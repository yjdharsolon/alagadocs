
/**
 * Adds a cache buster parameter to a URL to prevent caching issues
 * First removes any existing cache busters to prevent duplicates
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  // Remove any existing cache busters
  let cleanUrl = url;
  if (url.includes('?')) {
    const [baseUrl, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    
    // Remove any existing cache buster parameters
    if (params.has('cb')) {
      params.delete('cb');
      // Reconstruct the URL without the cache buster
      cleanUrl = baseUrl + (params.toString() ? `?${params.toString()}` : '');
    } else {
      cleanUrl = url; // Keep original URL if no cache buster found
    }
  }
  
  // Add a new cache buster
  const cacheBusterParam = `cb=${Date.now()}`;
  
  if (cleanUrl.includes('?')) {
    // URL already has query parameters
    return `${cleanUrl}&${cacheBusterParam}`;
  } else {
    // URL doesn't have query parameters
    return `${cleanUrl}?${cacheBusterParam}`;
  }
}
