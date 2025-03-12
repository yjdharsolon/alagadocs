
import { TranscriptionResponse } from './types.ts';

export async function transcribeWithOpenAI(
  audioBlob: Blob,
  openaiApiKey: string
): Promise<TranscriptionResponse> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  formData.append('response_format', 'verbose_json');
  
  console.log('Calling OpenAI Whisper API...');
  
  let openaiRetries = 5;
  let openaiBackoffTime = 2000;
  
  while (openaiRetries > 0) {
    try {
      console.log(`OpenAI API call attempt: ${6-openaiRetries}/5`);
      
      const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: formData
      });
      
      if (openaiResponse.ok) {
        console.log('OpenAI API call successful');
        const transcription = await openaiResponse.json();
        return {
          transcription: transcription.text,
          duration: transcription.duration || null,
          language: transcription.language || 'en'
        };
      } else {
        const errorStatus = openaiResponse.status;
        const errorText = await openaiResponse.text();
        console.error(`OpenAI API call failed with status ${errorStatus}:`, errorText);
        
        if (errorStatus === 429) {
          openaiBackoffTime = 10000; // 10 seconds for rate limit errors
        }
        
        if (errorStatus >= 500) {
          openaiRetries--;
          if (openaiRetries > 0) {
            console.log(`Retrying OpenAI API call in ${openaiBackoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, openaiBackoffTime));
            openaiBackoffTime *= 2;
          } else {
            throw new Error(`OpenAI API server error after retries: ${errorText}`);
          }
        } else {
          throw new Error(`OpenAI API error: ${errorText}`);
        }
      }
    } catch (err) {
      console.error(`OpenAI API call attempt failed:`, err);
      openaiRetries--;
      
      if (openaiRetries > 0) {
        console.log(`Retrying OpenAI API call in ${openaiBackoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, openaiBackoffTime));
        openaiBackoffTime *= 2;
      } else {
        throw err;
      }
    }
  }
  
  throw new Error('Failed to call OpenAI API after multiple retries');
}
