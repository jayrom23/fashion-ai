import React from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';

/**
 * Status bar component for debugging integration
 * Shows current workspace state for development/testing
 */
function IntegrationStatusBar() {
  const { 
    currentMode, 
    currentStep,
    activeVersionId,
    activeProjectId,
    versions,
    galleryRefreshCounter
  } = useWorkspaceContext();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-1 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
      <div>
        <span className="px-1">Mode: <b>{currentMode}</b></span>
        <span className="px-1">Step: <b>{currentStep}</b></span>
        <span className="px-1">Active Version: <b>{activeVersionId ? activeVersionId.substring(0, 8) : 'None'}</b></span>
        <span className="px-1">Active Project: <b>{activeProjectId ? activeProjectId.substring(0, 8) : 'None'}</b></span>
      </div>
      <div>
        <span className="px-1">Versions: <b>{versions.length}</b></span>
        <span className="px-1">Gallery Refresh: <b>{galleryRefreshCounter}</b></span>
      </div>
    </div>
  );
}

export default IntegrationStatusBar;
