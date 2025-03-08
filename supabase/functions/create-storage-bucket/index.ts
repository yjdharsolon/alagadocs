
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

    // Check if 'transcriptions' bucket exists
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }

    const bucketExists = existingBuckets.some(b => b.name === 'transcriptions');

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('transcriptions', {
          public: true,
          fileSizeLimit: 52428800, // 50MB in bytes
        });

      if (createError) {
        throw new Error(`Error creating bucket: ${createError.message}`);
      }

      // Add bucket policies
      await supabase.rpc('create_storage_policy', { 
        bucket_name: 'transcriptions',
        policy_name: 'Allow public read access',
        definition: `bucket_id = 'transcriptions'`,
        action: 'SELECT'
      });

      await supabase.rpc('create_storage_policy', { 
        bucket_name: 'transcriptions',
        policy_name: 'Allow authenticated uploads',
        definition: `bucket_id = 'transcriptions' AND auth.role() = 'authenticated'`,
        action: 'INSERT'
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Storage bucket setup complete' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-storage-bucket function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
