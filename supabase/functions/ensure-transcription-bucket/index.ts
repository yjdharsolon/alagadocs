
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Checking for transcriptions bucket...");
    // Check if 'transcriptions' bucket exists
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      throw new Error(`Error listing buckets: ${listError.message}`);
    }

    const bucketExists = existingBuckets.some(b => b.name === 'transcriptions');
    console.log("Bucket exists:", bucketExists);

    if (!bucketExists) {
      console.log("Creating transcriptions bucket...");
      // Create the bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('transcriptions', {
          public: true,
          fileSizeLimit: 52428800, // 50MB in bytes
          allowedMimeTypes: ['audio/*']
        });

      if (createError) {
        console.error("Error creating bucket:", createError);
        throw new Error(`Error creating bucket: ${createError.message}`);
      }

      console.log("Setting up bucket policies...");
      // Add very permissive policies for the bucket using RPC function
      const { error: rpcError } = await supabase.rpc('ensure_storage_policies', {
        bucket_id: 'transcriptions',
        user_id: 'system' // This is just a placeholder, policies will be created for all users
      });
      
      if (rpcError) {
        console.warn("Error setting up policies via RPC:", rpcError);
        
        // Fallback to direct SQL if RPC fails
        const directPoliciesSQL = `
          -- Create authenticated insert policy (allow any authenticated user to upload)
          CREATE POLICY IF NOT EXISTS "Allow authenticated uploads to transcriptions"
          ON storage.objects FOR INSERT
          TO authenticated
          WITH CHECK (bucket_id = 'transcriptions');
          
          -- Create authenticated select policy (allow any authenticated user to select)
          CREATE POLICY IF NOT EXISTS "Allow authenticated selects from transcriptions"
          ON storage.objects FOR SELECT
          TO authenticated
          USING (bucket_id = 'transcriptions');
        `;
        
        const { error: sqlError } = await supabase.rpc('run_sql_query', {
          query: directPoliciesSQL
        });
        
        if (sqlError) {
          console.warn("Error with direct SQL policy setup:", sqlError);
        } else {
          console.log("Direct SQL policy setup successful");
        }
      } else {
        console.log("Storage policies setup successful via RPC");
      }
      
      // Test the bucket by uploading a test file
      const { error: testError } = await supabase
        .storage
        .from('transcriptions')
        .upload('test-file.txt', new Blob(['test content']), {
          cacheControl: '3600',
          upsert: true
        });
        
      if (testError) {
        console.warn("Test upload failed:", testError);
      } else {
        console.log("Test upload successful");
        
        // Clean up test file
        await supabase.storage.from('transcriptions').remove(['test-file.txt']);
      }
    } else {
      // Make sure permissions are set correctly
      console.log("Bucket already exists, verifying policies...");
      
      // Verify and fix policies using RPC
      const { error: rpcError } = await supabase.rpc('ensure_storage_policies', {
        bucket_id: 'transcriptions',
        user_id: 'system' // This is just a placeholder
      });
      
      if (rpcError) {
        console.warn("Error ensuring policies via RPC:", rpcError);
      } else {
        console.log("Storage policies verified successfully");
      }
      
      // Check permissions by testing upload
      try {
        const { error: testError } = await supabase
          .storage
          .from('transcriptions')
          .upload('test-file.txt', new Blob(['test content']), {
            cacheControl: '3600',
            upsert: true
          });
          
        if (testError) {
          console.warn("Test upload failed:", testError);
        } else {
          console.log("Test upload successful");
          
          // Clean up test file
          await supabase.storage.from('transcriptions').remove(['test-file.txt']);
        }
      } catch (err) {
        console.warn("Error during test upload:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Transcriptions bucket ready' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ensure-transcription-bucket function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
