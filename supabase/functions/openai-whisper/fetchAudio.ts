
import { AudioProcessingConfig } from './types.ts';

export async function fetchAudioFile(audioUrl: string, config: AudioProcessingConfig): Promise<Response> {
  let retries = config.maxRetries;
  let backoffTime = config.baseRetryDelay;
  
  while (retries > 0) {
    try {
      console.log(`Attempt to fetch audio file: ${6-retries}/5, URL: ${audioUrl}`);
      
      const cacheBuster = `?t=${Date.now()}`;
      const fetchUrl = audioUrl.includes('?') ? `${audioUrl}&cb=${Date.now()}` : `${audioUrl}${cacheBuster}`;
      
      const audioResponse = await fetch(fetchUrl, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (audioResponse.ok) {
        console.log('Successfully fetched audio file');
        return audioResponse;
      } else {
        console.error(`Fetch attempt failed with status: ${audioResponse.status}`);
        const errorText = await audioResponse.text();
        console.error('Error response:', errorText);
      }
    } catch (err) {
      console.error(`Fetch attempt failed, ${retries - 1} retries left:`, err);
    }
    
    retries--;
    if (retries > 0) {
      console.log(`Waiting ${backoffTime}ms before next retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      backoffTime *= 2; // Exponential backoff
    } else {
      throw new Error(`Failed to fetch audio file after multiple retries`);
    }
  }
  
  throw new Error('Failed to fetch audio file after exhausting all retries');
}
