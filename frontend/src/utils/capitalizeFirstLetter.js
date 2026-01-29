export function capitalize(val) {
  if (!val) return ""; // Return empty string if data is missing
  const str = String(val); 
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
