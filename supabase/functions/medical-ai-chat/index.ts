
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, type = 'general', medicalRole = 'Doctor' } = await req.json();
    
    if (!prompt) {
      throw new Error('No prompt provided');
    }
    
    // Set the system prompt based on the request type
    let systemPrompt = '';
    if (type === 'structure') {
      systemPrompt = `You are a medical assistant specializing in structuring medical notes for healthcare professionals with the role of ${medicalRole}. 
      Your task is to organize raw medical text into a structured medical note with clear sections.
      Be thorough but concise, maintain medical accuracy, and organize the content into standard medical note sections.
      Format your response as a JSON object with these sections: chiefComplaint, historyOfPresentIllness, pastMedicalHistory, medications, allergies, physicalExamination, assessment, plan.
      If information for a section is not present, include that section with "Not mentioned" as the value.`;
    } else if (type === 'analyze') {
      systemPrompt = `You are a medical assistant specializing in analyzing medical information for healthcare professionals with the role of ${medicalRole}.
      Your task is to provide insights on the provided medical text, highlight key points, identify potential issues or missing information, and suggest relevant considerations.
      Be thorough, evidence-based, and highlight important clinical considerations.`;
    } else {
      systemPrompt = `You are a helpful medical assistant that provides accurate, concise information about medical topics for healthcare professionals with the role of ${medicalRole}.
      You should be professional but friendly, and always prioritize evidence-based information. Do not diagnose conditions or prescribe treatments.`;
    }
    
    // Call OpenAI API for chat completion
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ message: data.choices[0].message.content, type }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in medical-ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
