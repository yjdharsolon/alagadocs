
/**
 * Parses a complex medication string that includes generic name, brand name in parentheses,
 * and strength information.
 * 
 * For example: "Aspirin (Aspilets) 80mg" would be parsed into:
 *   - genericName: "Aspirin"
 *   - brandName: "Aspilets"
 *   - strength: "80mg"
 * 
 * @param text - The medication string to parse
 * @returns An object containing the genericName, brandName, and strength as separate components
 */
export const parseComplexMedicationString = (text: string): { genericName: string, brandName: string, strength: string } => {
  // Regular expression to match "GenericName (BrandName) Strength"
  // This captures three groups: generic name, brand name (optional), and strength/dosage (optional)
  const regex = /^([^(]+)\s*(?:\(([^)]+)\))?\s*(.*)$/;
  const matches = text.match(regex);
  
  if (matches) {
    const genericName = matches[1]?.trim() || '';
    const brandName = matches[2]?.trim() || '';
    const strength = matches[3]?.trim() || '';
    
    console.log(`Complex parsing: "${text}" -> Generic: "${genericName}", Brand: "${brandName}", Strength: "${strength}"`);
    return { genericName, brandName, strength };
  }
  
  return { genericName: text, brandName: '', strength: '' };
};
