
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
    
    // Delete existing bucket if it exists (to reset all policies)
    if (bucketExists) {
      console.log("Existing bucket found, deleting it to reset policies");
      
      try {
        // Empty the bucket first (required before deletion)
        const { data: files } = await supabase.storage.from('transcriptions').list();
        
        if (files && files.length > 0) {
          for (const file of files) {
            await supabase.storage.from('transcriptions').remove([file.name]);
          }
        }
        
        // Now delete the bucket
        const { error: deleteError } = await supabase.storage.deleteBucket('transcriptions');
        
        if (deleteError) {
          console.warn("Error deleting bucket:", deleteError);
        }
      } catch (err) {
        console.warn("Error while trying to delete bucket:", err);
        // Continue anyway, we'll try to recreate or fix the policies
      }
    }

    // Create a new bucket
    console.log("Creating transcriptions bucket...");
    const { error: createError } = await supabase
      .storage
      .createBucket('transcriptions', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });

    if (createError) {
      throw new Error(`Error creating bucket: ${createError.message}`);
    }

    // Add policies to the bucket (public read, authenticated write)
    console.log("Setting up storage policies...");
    
    // Use direct SQL execution for adding more permissive policies
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
    
    // Execute the SQL
    const { error: policyError } = await supabase.rpc('run_sql_query', {
      query: policiesSQL
    });
    
    if (policyError) {
      console.warn("Error setting up policies:", policyError);
      throw new Error(`Error setting policies: ${policyError.message}`);
    }

    // Verify bucket is accessible
    try {
      const { data: testFile, error: testError } = await supabase
        .storage
        .from('transcriptions')
        .upload('test-file.txt', new Blob(['test content']), {
          cacheControl: '3600',
          upsert: true
        });
        
      if (testError) {
        console.warn("Test upload failed:", testError);
      } else {
        console.log("Test upload successful:", testFile);
        
        // Try to delete the test file
        const { error: deleteError } = await supabase
          .storage
          .from('transcriptions')
          .remove(['test-file.txt']);
          
        if (deleteError) {
          console.warn("Error deleting test file:", deleteError);
        }
      }
    } catch (testErr) {
      console.warn("Error during test upload:", testErr);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Storage bucket recreated with public access and authenticated upload permissions' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fix-storage-permissions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
