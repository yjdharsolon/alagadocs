
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, role, customTemplate } = await req.json()
    
    if (!prompt) {
      throw new Error('No prompt provided')
    }

    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found')
    }

    // Create a system message based on the user's role
    let systemMessage = 'You are a helpful medical assistant that structures transcriptions into clinical notes.';
    
    // Role-specific prompts
    if (role) {
      switch (role) {
        case 'doctor':
          systemMessage = 'You are an experienced physician assistant. Format this transcription into a detailed clinical note using standard medical terminology and structure.';
          break;
        case 'nurse':
          systemMessage = 'You are an experienced nursing assistant. Format this transcription into a nursing note with focus on patient care, vitals, and interventions.';
          break;
        case 'therapist':
          systemMessage = 'You are an experienced therapy assistant. Format this transcription into a therapy note with focus on exercises, progress, and treatment plans.';
          break;
        default:
          systemMessage = 'You are a helpful medical assistant that structures transcriptions into clinical notes.';
      }
    }

    // Allow for custom templates if provided
    if (customTemplate) {
      systemMessage = customTemplate;
    }

    console.log('Sending request to OpenAI API...')
    
    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    console.log('Received response from OpenAI API')
    
    return new Response(
      JSON.stringify({
        message: data.choices[0].message.content,
        usage: data.usage,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in openai-chat function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
