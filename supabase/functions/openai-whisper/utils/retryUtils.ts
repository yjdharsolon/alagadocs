
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  baseDelay: number,
  operationName: string
): Promise<T> {
  let retries = maxRetries;
  let backoffTime = baseDelay;
  
  while (retries > 0) {
    try {
      console.log(`${operationName} attempt: ${maxRetries + 1 - retries}/${maxRetries}`);
      const result = await operation();
      console.log(`${operationName} successful`);
      return result;
    } catch (err) {
      console.error(`${operationName} attempt failed, ${retries - 1} retries left:`, err);
      
      retries--;
      if (retries > 0) {
        console.log(`Waiting ${backoffTime}ms before next retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        backoffTime *= 2; // Exponential backoff
      } else {
        throw new Error(`${operationName} failed after ${maxRetries} retries`);
      }
    }
  }
  
  throw new Error(`${operationName} failed after exhausting all retries`);
}

