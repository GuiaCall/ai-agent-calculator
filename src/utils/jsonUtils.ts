
/**
 * Safely parse JSON data with fallback to default value
 */
export const safelyParseJSON = <T extends {}>(jsonData: any, defaultValue: T): T => {
  if (!jsonData) return defaultValue;
  
  try {
    if (typeof jsonData === 'object' && jsonData !== null) {
      return { ...defaultValue, ...jsonData };
    }
    
    if (typeof jsonData === 'string') {
      return { ...defaultValue, ...JSON.parse(jsonData) };
    }
  } catch (error) {
    console.error("Error parsing JSON data:", error);
  }
  
  return defaultValue;
};
