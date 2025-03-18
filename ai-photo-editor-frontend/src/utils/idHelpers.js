/**
 * Generates a standardized ID for form elements
 * 
 * @param {string} componentName - Name of the component 
 * @param {string} elementName - Name of the form element
 * @param {string|null} [suffix=null] - Optional suffix for the ID
 * @returns {string} The standardized element ID
 */
export const generateId = (componentName, elementName, suffix = null) => {
  const base = `${componentName}-${elementName}`.toLowerCase();
  return suffix ? `${base}-${suffix}` : base;
};

export default {
  generateId
};
