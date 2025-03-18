import toast from 'react-hot-toast';

/**
 * Standardized error handling function
 * 
 * @param {Error} error - The caught error
 * @param {string} friendlyMessage - User-friendly error message
 * @param {Function} [fallbackAction] - Optional fallback action to execute
 * @param {boolean} [logError=true] - Whether to log the error to console
 * @param {string} [toastType='error'] - Type of toast notification ('error', 'warning', etc.)
 */
export const handleError = (error, friendlyMessage, fallbackAction = null, logError = true, toastType = 'error') => {
  if (logError) {
    console.error(friendlyMessage, error);
  }
  
  // Show toast notification
  toast[toastType](friendlyMessage);
  
  // Execute fallback action if provided
  if (typeof fallbackAction === 'function') {
    fallbackAction();
  }
};

/**
 * Check if an error is an AbortError (request cancelled)
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is an AbortError
 */
export const isAbortError = (error) => {
  return error.name === 'AbortError' || error.code === 'ABORT_ERR';
};

/**
 * Checks if a component is still mounted before performing actions
 * 
 * @param {Object} mountRef - useRef object tracking component mount state
 * @param {Function} action - Function to execute if component is mounted
 * @returns {Function|null} The result of the action or null if unmounted
 */
export const ifMounted = (mountRef, action) => {
  if (mountRef.current && typeof action === 'function') {
    return action();
  }
  return null;
};

export default {
  handleError,
  isAbortError,
  ifMounted
};
