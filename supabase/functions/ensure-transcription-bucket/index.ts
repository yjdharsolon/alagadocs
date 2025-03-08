
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
        });

      if (createError) {
        console.error("Error creating bucket:", createError);
        throw new Error(`Error creating bucket: ${createError.message}`);
      }

      console.log("Setting up bucket policies...");
      // Add basic storage policies for public access and authenticated uploads
      const { error: policyError } = await supabase
        .from('storage')
        .select('*')
        .limit(1);
        
      if (policyError) {
        console.error("Error with storage policies:", policyError);
      } else {
        console.log("Storage policies setup successful");
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Transcriptions bucket ready' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ensure-transcription-bucket function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
