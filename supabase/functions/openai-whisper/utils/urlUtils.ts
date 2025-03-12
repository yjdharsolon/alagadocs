
export function addCacheBuster(audioUrl: string): string {
  const cacheBuster = `?t=${Date.now()}`;
  return audioUrl.includes('?') ? `${audioUrl}&cb=${Date.now()}` : `${audioUrl}${cacheBuster}`;
}

export const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

