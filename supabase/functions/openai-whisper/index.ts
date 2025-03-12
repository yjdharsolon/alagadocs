
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, audioConfig } from './config.ts';
import { fetchAudioFile } from './fetchAudio.ts';
import { transcribeWithOpenAI } from './transcribeAudio.ts';
import type { TranscriptionResponse } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting openai-whisper function...');
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('Server configuration error: OpenAI API key not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header provided');
      throw new Error('Missing Authorization header');
    }

    let audioUrl;
    try {
      const requestData = await req.json();
      audioUrl = requestData.audioUrl;
      
      if (!audioUrl) {
        throw new Error('No audio URL provided');
      }
    } catch (parseError) {
      console.error('Error parsing request:', parseError);
      throw new Error('Invalid request format. Expected JSON with audioUrl field.');
    }

    console.log('Processing audio transcription for URL:', audioUrl);

    // Add delay to ensure file is available
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Fetch and process the audio file
    const audioResponse = await fetchAudioFile(audioUrl, audioConfig);
    const audioBlob = await audioResponse.blob();
    
    if (audioBlob.size === 0) {
      throw new Error('Audio file has zero size. The file may be corrupted or not properly uploaded.');
    }
    
    // Transcribe the audio using OpenAI
    const transcriptionResult = await transcribeWithOpenAI(audioBlob, openaiApiKey);
    console.log('Transcription successful, length:', transcriptionResult.transcription.length);
    
    return new Response(JSON.stringify(transcriptionResult), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error in whisper function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
