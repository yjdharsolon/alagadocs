
/**
 * Counts the number of words in a text string
 * @param text The text to count words in
 * @returns The word count
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Counts the number of characters in a text string
 * @param text The text to count characters in
 * @returns The character count
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Estimates reading time for text
 * @param text The text to estimate reading time for
 * @param wordsPerMinute Words per minute reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = countWords(text);
  return words / wordsPerMinute;
}
