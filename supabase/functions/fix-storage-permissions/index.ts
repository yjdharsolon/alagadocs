
// This edge function will help fix storage permissions when needed
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
    // Create a Supabase client with the admin role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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
      throw new Error('Missing Authorization header');
    }

    // Ensure the transcriptions bucket exists and is public
    const { data: bucketData, error: bucketError } = await supabaseAdmin
      .storage
      .createBucket('transcriptions', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['audio/*']
      });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    // Update bucket to be public if it exists but isn't public
    if (bucketError?.message.includes('already exists')) {
      await supabaseAdmin
        .storage
        .updateBucket('transcriptions', {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: ['audio/*']
        });
    }

    // Get user ID from auth token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid auth token');
    }

    // Ensure storage permissions are set correctly
    const { error: policyError } = await supabaseAdmin
      .rpc('ensure_storage_policies', {
        bucket_id: 'transcriptions',
        user_id: user.id
      });

    if (policyError) {
      console.error('Error ensuring storage policies:', policyError);
      throw policyError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Storage permissions updated successfully' 
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
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
