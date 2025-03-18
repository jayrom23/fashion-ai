import { useContext } from 'react';
import { WorkspaceContext } from '../contexts/WorkspaceContext';

/**
 * Custom hook to access the WorkspaceContext with error handling
 * 
 * @returns {Object} The workspace context value
 * @throws {Error} If used outside of a WorkspaceProvider
 */
export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  
  return context;
}
