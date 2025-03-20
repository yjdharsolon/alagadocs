
/**
 * Parses a complex medication string that may contain generic name, brand name, and strength.
 * Examples: "Aspirin (aspilets) 80mg", "Metformin 500mg"
 * 
 * @param medicationString - The medication string to parse
 * @returns An object with genericName, brandName, and strength properties
 */
export const parseComplexMedicationString = (medicationString: string) => {
  let genericName = medicationString;
  let brandName = '';
  let strength = '';
  
  // Extract brand name in parentheses if present
  if (medicationString.includes('(') && medicationString.includes(')')) {
    const startBrand = medicationString.indexOf('(');
    const endBrand = medicationString.indexOf(')', startBrand);
    
    if (startBrand > 0 && endBrand > startBrand) {
      genericName = medicationString.substring(0, startBrand).trim();
      brandName = medicationString.substring(startBrand + 1, endBrand).trim();
      
      // If there's text after the closing parenthesis, it may be the strength
      if (endBrand + 1 < medicationString.length) {
        strength = medicationString.substring(endBrand + 1).trim();
      }
    }
  } else {
    // No brand name, check for strength at the end
    const parts = medicationString.split(' ');
    if (parts.length > 1 && /\d/.test(parts[parts.length - 1])) {
      strength = parts[parts.length - 1];
      genericName = parts.slice(0, parts.length - 1).join(' ');
    }
  }
  
  return { genericName, brandName, strength };
};
