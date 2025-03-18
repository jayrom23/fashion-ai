import { useContext } from 'react';
import { NavigationContext } from '../contexts/NavigationContext';

/**
 * Custom hook to access the NavigationContext
 * @returns {Object} Navigation context value with workflow steps and navigation methods
 * @throws {Error} If used outside of NavigationProvider
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
