
export function addCacheBuster(url: string): string {
  const cacheBusterParam = `cb=${Date.now()}`;
  
  if (url.includes('?')) {
    // URL already has query parameters
    return `${url}&${cacheBusterParam}`;
  } else {
    // URL doesn't have query parameters
    return `${url}?${cacheBusterParam}`;
  }
}
