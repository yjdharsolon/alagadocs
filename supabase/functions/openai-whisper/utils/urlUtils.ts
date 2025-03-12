
export function addCacheBuster(audioUrl: string): string {
  const cacheBusterParam = `cb=${Date.now()}`;
  
  if (audioUrl.includes('?')) {
    // URL already has query parameters
    return `${audioUrl}&${cacheBusterParam}`;
  } else {
    // URL doesn't have query parameters
    return `${audioUrl}?${cacheBusterParam}`;
  }
}

export const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getFileExtension(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const lastDotIndex = pathname.lastIndexOf('.');
    
    if (lastDotIndex !== -1) {
      return pathname.substring(lastDotIndex + 1).toLowerCase();
    }
    
    return null;
  } catch (e) {
    return null;
  }
}
