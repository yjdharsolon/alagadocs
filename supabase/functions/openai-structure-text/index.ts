
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface RequestBody {
  text: string;
  role?: string;
  template?: {
    sections: string[];
  };
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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

    const { text, role = 'Doctor', template } = await req.json() as RequestBody;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const systemPrompt = getSystemPrompt(role, template);
    
    console.log("Calling OpenAI with system prompt:", systemPrompt);
    
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
          ...corsHeaders
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
          ...corsHeaders
        },
      });
    }
  } catch (error) {
    console.error("Error in structure-text function:", error);
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
  // SOAP format prompt
  if (template?.sections && 
      template.sections.includes('Subjective') && 
      template.sections.includes('Objective') && 
      template.sections.includes('Assessment') && 
      template.sections.includes('Plan')) {
    return `You are a medical assistant helping to format transcribed medical conversations into a structured SOAP note.
Format the provided transcription into a SOAP note with these exact sections:

1. Subjective:
   - Patient's symptoms
   - Patient's complaints
   - Patient's history related to current problem
   - Patient's own words and descriptions

2. Objective:
   - Physical examination findings
   - Vital signs
   - Laboratory and diagnostic results
   - Measurable, observable data

3. Assessment:
   - Diagnosis or clinical impression
   - Differential diagnoses if applicable
   - Analysis of the findings

4. Plan:
   - Treatment plan
   - Medications prescribed
   - Further testing needed
   - Follow-up instructions
   - Patient education

Return the structured information in this exact JSON format:
{
  "subjective": "",
  "objective": "",
  "assessment": "",
  "plan": ""
}

Extract all relevant information from the transcription. If any information is not present for a section, include that section with an empty string or "Not documented" as the value. Be accurate, concise and maintain medical terminology.`;
  }
  
  // Prescription format prompt
  if (template?.sections && template.sections.includes('Prescription')) {
    return `You are a medical assistant helping to format prescription information from transcribed medical conversations.
Format the provided transcription into a structured prescription note.

Return the structured information in JSON format with prescription-related information.
If certain details are not present in the transcription, include the key with "Not specified" as the value.`;
  }

  const standardSections = [
    "Subjective",
    "Objective",
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
