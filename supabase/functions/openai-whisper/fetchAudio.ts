
import { AudioProcessingConfig } from './types.ts';
import { addCacheBuster, noCacheHeaders } from './utils/urlUtils.ts';
import { withRetry } from './utils/retryUtils.ts';

export async function fetchAudioFile(audioUrl: string, config: AudioProcessingConfig): Promise<Response> {
  return withRetry(
    async () => {
      const fetchUrl = addCacheBuster(audioUrl);
      const response = await fetch(fetchUrl, { headers: noCacheHeaders });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Fetch failed with status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    },
    config.maxRetries,
    config.baseRetryDelay,
    'Audio file fetch'
  );
}

