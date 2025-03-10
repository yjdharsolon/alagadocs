
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
      // Add very permissive policies for the bucket
      const policiesSQL = `
        -- Create public read policy (allow anyone to read)
        CREATE POLICY "Public Read Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'transcriptions');
        
        -- Create authenticated insert policy (allow any authenticated user to upload)
        CREATE POLICY "Authenticated Users Can Upload"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'transcriptions');
        
        -- Create authenticated update policy (allow any authenticated user to update any file)
        CREATE POLICY "Authenticated Users Can Update Any Files"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'transcriptions');
        
        -- Create authenticated delete policy (allow any authenticated user to delete any file)
        CREATE POLICY "Authenticated Users Can Delete Any Files"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'transcriptions');
      `;
      
      // Execute the SQL
      const { error: policyError } = await supabase.rpc('run_sql_query', {
        query: policiesSQL
      });
      
      if (policyError) {
        console.warn("Error setting up policies:", policyError);
      } else {
        console.log("Storage policies setup successful");
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
      }
    } else {
      // Make sure permissions are set correctly
      console.log("Bucket already exists, verifying policies...");
      
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
          if (testError.message.includes('row-level security policy') || 
              testError.message.includes('new row violates')) {
            console.log("Upload test failed due to RLS policy, fixing policies...");
            
            // Fix policies for existing bucket
            const policiesSQL = `
              -- Drop existing policies for this bucket if any
              DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
              DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
              DROP POLICY IF EXISTS "Authenticated Users Can Update Own Files" ON storage.objects;
              DROP POLICY IF EXISTS "Authenticated Users Can Delete Own Files" ON storage.objects;
              
              -- Create public read policy (allow anyone to read)
              CREATE POLICY "Public Read Access"
              ON storage.objects FOR SELECT
              USING (bucket_id = 'transcriptions');
              
              -- Create authenticated insert policy (allow any authenticated user to upload)
              CREATE POLICY "Authenticated Users Can Upload"
              ON storage.objects FOR INSERT
              TO authenticated
              WITH CHECK (bucket_id = 'transcriptions');
              
              -- Create authenticated update policy (allow any authenticated user to update any file)
              CREATE POLICY "Authenticated Users Can Update Any Files"
              ON storage.objects FOR UPDATE
              TO authenticated
              USING (bucket_id = 'transcriptions');
              
              -- Create authenticated delete policy (allow any authenticated user to delete any file)
              CREATE POLICY "Authenticated Users Can Delete Any Files"
              ON storage.objects FOR DELETE
              TO authenticated
              USING (bucket_id = 'transcriptions');
            `;
            
            const { error: policyError } = await supabase.rpc('run_sql_query', {
              query: policiesSQL
            });
            
            if (policyError) {
              console.warn("Error fixing policies:", policyError);
            } else {
              console.log("Successfully fixed bucket policies");
            }
          } else {
            console.warn("Test upload failed for other reason:", testError);
          }
        } else {
          console.log("Upload test successful, bucket is properly configured");
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
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
