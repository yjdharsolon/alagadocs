
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "./utils/cors.ts";
import { structureWithOpenAI } from "./services/openai.ts";
import { saveStructuredNote } from "./services/database.ts";

interface RequestBody {
  text: string;
  role?: string;
  transcriptionId?: string;
  template?: {
    sections: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    console.log("Received structure-medical-transcript request");
    const { text, role = 'Doctor', template, transcriptionId } = await req.json() as RequestBody;
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    console.log(`Processing text with role: ${role}`);
    
    // Process the text with OpenAI
    const openAIResponse = await structureWithOpenAI(text, role, template);
    
    let structuredContent;
    
    try {
      // Parse the response as JSON if possible
      structuredContent = JSON.parse(openAIResponse);
      
      // If transcriptionId is provided, save the structured output to the database
      if (transcriptionId) {
        const saveResponse = await saveStructuredNote(req, transcriptionId, structuredContent);
        
        // If there was an error saving, return that error
        if (saveResponse) {
          return saveResponse;
        }
      }
      
      return new Response(JSON.stringify(structuredContent), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    } catch (e) {
      console.log("Could not parse as JSON, returning raw content");
      // If not valid JSON, return the raw text
      return new Response(JSON.stringify({
        content: openAIResponse 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }
  } catch (error) {
    console.error("Error in structure-medical-transcript:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });
  }
});
