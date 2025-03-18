/**
 * API Helpers for cancellable requests
 */

/**
 * Creates a cancellable API request function
 * @param {Function} apiMethod - The original API method that takes parameters and returns a Promise
 * @returns {Function} A new function that accepts the same parameters as the original plus a signal parameter
 */
export const createCancellableRequest = (apiMethod) => {
  return async (signal, ...args) => {
    if (signal?.aborted) {
      throw new DOMException('Request aborted by user', 'AbortError');
    }
    
    // If using fetch, we can pass the signal directly
    // For other HTTP clients, we'd need to implement specific cancellation
    if (apiMethod.toString().includes('fetch(')) {
      return apiMethod(...args, { signal });
    }
    
    // For non-fetch API methods, we need to check abort status during execution
    let result = await apiMethod(...args);
    
    if (signal?.aborted) {
      throw new DOMException('Request aborted by user', 'AbortError');
    }
    
    return result;
  };
};

/**
 * Executes an async function with abort controller support
 * @param {Function} asyncFn - The async function to execute
 * @param {AbortController} controller - The abort controller
 * @param {Array} args - Arguments to pass to the async function
 * @returns {Promise} The result of the async function
 */
export const executeWithAbortController = async (asyncFn, controller, ...args) => {
  try {
    return await asyncFn(controller.signal, ...args);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      return null;
    }
    throw error;
  }
};

/**
 * Hook to create an AbortController that's tied to component lifecycle
 * @returns {AbortController} An AbortController that will abort on unmount
 */
export const useAbortController = () => {
  const controllerRef = React.useRef(new AbortController());
  
  React.useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);
  
  return controllerRef.current;
};
