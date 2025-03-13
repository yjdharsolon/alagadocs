
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ensureUuid } from "../utils/uuid.ts";
import { corsHeaders } from "../utils/cors.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase credentials are not set');
}

/**
 * Creates a Supabase client with admin privileges
 */
export function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Saves structured content to the database
 */
export async function saveStructuredNote(req: Request, transcriptionId: string, structuredContent: any): Promise<Response | null> {
  try {
    // Get the user's JWT from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header found");
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    const supabase = getSupabaseClient();
    
    // Get the user from the token
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !userData?.user) {
      console.error("Authentication error:", authError);
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }
    
    console.log(`Saving structured output for transcription ID ${transcriptionId} and user ID ${userData.user.id}`);
    
    // Ensure transcriptionId is a valid UUID
    const validTranscriptionId = ensureUuid(transcriptionId);
    
    const { error: saveError } = await supabase
      .from('structured_notes')
      .insert({
        transcription_id: validTranscriptionId,
        user_id: userData.user.id,
        content: structuredContent,
        original_id: transcriptionId
      });
      
    if (saveError) {
      console.error("Error saving structured note:", saveError);
      return new Response(JSON.stringify({ 
        error: 'Failed to save structured note', 
        details: saveError 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    } 
    
    console.log("Structured note saved successfully");
    return null;
  } catch (error) {
    console.error("Error in saveStructuredNote:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });
  }
}
