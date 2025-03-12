
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting fix-storage-permissions function...');
    
    // Check for required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Server configuration error: Missing required environment variables');
    }

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header provided');
      throw new Error('Missing Authorization header');
    }

    // Get user ID from auth token
    console.log('Verifying user authentication...');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('Invalid auth token:', userError);
      throw new Error('Invalid auth token');
    }

    console.log(`Authenticated user: ${user.id}`);

    // Ensure the transcriptions bucket exists and is public
    console.log('Creating or updating transcriptions bucket...');
    try {
      const { error: bucketError } = await supabaseAdmin
        .storage
        .createBucket('transcriptions', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['audio/*', 'application/octet-stream'] // Added binary MIME type
        });

      if (bucketError && !bucketError.message.includes('already exists')) {
        console.error('Error creating bucket:', bucketError);
        throw bucketError;
      }

      // Update bucket to be public if it exists but isn't public
      if (bucketError?.message.includes('already exists')) {
        console.log('Bucket already exists, updating settings...');
        await supabaseAdmin
          .storage
          .updateBucket('transcriptions', {
            public: true,
            fileSizeLimit: 52428800,
            allowedMimeTypes: ['audio/*', 'application/octet-stream'] // Added binary MIME type
          });
      }
    } catch (bucketError) {
      console.error('Error managing bucket:', bucketError);
      throw new Error(`Error managing storage bucket: ${bucketError.message || 'Unknown error'}`);
    }

    // Test bucket access with improved binary test file
    console.log('Testing bucket access...');
    const maxRetries = 5; // Increased from 3 to 5
    let retryCount = 0;
    let uploadSuccess = false;
    
    while (retryCount < maxRetries && !uploadSuccess) {
      try {
        // Create a proper binary file for testing
        const testContent = new Uint8Array([0x89, 0x50, 0x4E, 0x47]); // PNG file header
        const testFilePath = `test-${Date.now()}.bin`;
        
        const { error: uploadError } = await supabaseAdmin
          .storage
          .from('transcriptions')
          .upload(testFilePath, testContent, {
            contentType: 'application/octet-stream', // Explicitly set binary MIME type
            cacheControl: 'no-cache' // Prevent caching issues
          });

        if (uploadError) {
          console.error(`Test upload attempt ${retryCount + 1} failed:`, uploadError);
          retryCount++;
          
          if (retryCount < maxRetries) {
            const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Retrying in ${backoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          } else {
            throw new Error(`Storage permission test failed after ${maxRetries} attempts: ${uploadError.message}`);
          }
        } else {
          uploadSuccess = true;
          console.log('Test upload successful');
          
          // Clean up test file
          await supabaseAdmin
            .storage
            .from('transcriptions')
            .remove([testFilePath]);
        }
      } catch (testError) {
        console.error(`Error in test upload attempt ${retryCount + 1}:`, testError);
        retryCount++;
        
        if (retryCount < maxRetries) {
          const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        } else {
          throw new Error(`Failed to test storage permissions after ${maxRetries} attempts: ${testError.message}`);
        }
      }
    }

    // Configure RLS policies if needed
    try {
      console.log('Ensuring RLS policies are properly configured...');
      
      // Execute RPC to ensure storage policies
      const { error: policyError } = await supabaseAdmin.rpc('ensure_storage_policies', {
        bucket_id: 'transcriptions',
        user_id: user.id
      });
      
      if (policyError) {
        console.warn('Warning: Could not update RLS policies via RPC:', policyError);
      }
    } catch (policyError) {
      console.warn('Warning: Error while configuring RLS policies:', policyError);
    }

    console.log('Storage permissions verified successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Storage permissions updated successfully',
        userId: user.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error fixing storage permissions:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        errorDetails: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
