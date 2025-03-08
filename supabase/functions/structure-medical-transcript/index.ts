import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface RequestBody {
  text: string;
  role?: string;
  transcriptionId?: string;
  template?: {
    sections: string[];
  };
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials are not set');
    }

    console.log("Received structure-medical-transcript request");
    const { text, role = 'Doctor', template, transcriptionId } = await req.json() as RequestBody;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
    const systemPrompt = getSystemPrompt(role, template);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");
    
    let structuredContent;
    
    try {
      // Parse the response as JSON if possible
      structuredContent = JSON.parse(data.choices[0].message.content);
      
      // If transcriptionId is provided, save the structured output to the database
      if (transcriptionId) {
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
        
        const { error: saveError } = await supabase
          .from('structured_notes')
          .insert({
            transcription_id: transcriptionId,
            user_id: userData.user.id,
            content: structuredContent
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
        } else {
          console.log("Structured note saved successfully");
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
        content: data.choices[0].message.content 
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

function getSystemPrompt(role: string, template?: { sections: string[] }): string {
  const standardSections = [
    "Chief Complaint",
    "History of Present Illness",
    "Past Medical History",
    "Medications",
    "Allergies",
    "Physical Examination",
    "Assessment",
    "Plan"
  ];
  
  const sections = template?.sections || standardSections;
  
  const sectionsList = sections.map(section => `- ${section}`).join('\n');
  
  const basePrompt = `
You are an expert medical assistant helping to structure transcriptions of medical conversations or dictations. You're assisting a healthcare professional with role: ${role}.

Take the provided transcription text and organize it into a structured medical note with the following sections:
${sectionsList}

Return the structured information in JSON format with these sections as keys with camelCase format. 
If certain sections are not present in the transcription, include the key with an empty string or "Not mentioned" as the value.
Be accurate, concise and professional in your structuring. Do not invent information not present in the transcription.

Example response format (using camelCase for keys):
{
  ${sections.map(section => `"${toCamelCase(section)}": "..."`).join(',\n  ')}
}
`;

  return basePrompt;
}

function toCamelCase(str: string): string {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}
