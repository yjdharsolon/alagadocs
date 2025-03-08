
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

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
    // Get the supabase client using environment variables
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    
    // Check if the transcriptions bucket already exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin
      .storage
      .listBuckets();

    if (bucketsError) {
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    const bucketName = 'transcriptions';
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create a new bucket for transcriptions
      const { error } = await supabaseAdmin
        .storage
        .createBucket(bucketName, {
          public: false, // Not publicly accessible
          fileSizeLimit: 52428800, // 50MB limit
          allowedMimeTypes: [
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/webm',
            'audio/ogg',
            'audio/m4a'
          ]
        });

      if (error) {
        throw new Error(`Error creating bucket: ${error.message}`);
      }
    
      // Set up bucket policy to allow only authenticated users to access their own files
      const { error: policyError } = await supabaseAdmin
        .storage
        .from(bucketName)
        .createPolicy('Authenticated users only', {
          name: 'authenticated-users-only',
          definition: { role: 'authenticated' },
          allowedOperations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
        });
    
      if (policyError) {
        throw new Error(`Error creating bucket policy: ${policyError.message}`);
      }
      
      return new Response(
        JSON.stringify({ message: `Successfully created '${bucketName}' bucket` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: `Bucket '${bucketName}' already exists` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error in create-bucket function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
