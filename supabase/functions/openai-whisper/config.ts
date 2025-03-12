
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const audioConfig = {
  maxRetries: 5,
  baseRetryDelay: 2000 // 2 seconds base delay
};
