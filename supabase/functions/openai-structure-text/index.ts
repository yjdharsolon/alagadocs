
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RequestBody {
  text: string;
  role?: string;
  template?: {
    sections: string[];
  };
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { text, role = 'Doctor', template } = await req.json() as RequestBody;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const systemPrompt = getSystemPrompt(role, template);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    try {
      // Parse the response as JSON if possible
      const structuredContent = JSON.parse(data.choices[0].message.content);
      return new Response(JSON.stringify(structuredContent), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (e) {
      // If not valid JSON, return the raw text
      return new Response(JSON.stringify({
        content: data.choices[0].message.content 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
