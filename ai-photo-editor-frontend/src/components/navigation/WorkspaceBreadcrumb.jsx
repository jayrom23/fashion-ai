import React from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';

/**
 * Breadcrumb navigation component for the workspace header
 */
function WorkspaceBreadcrumb() {
  const { currentMode, setCurrentMode, currentImages } = useWorkspaceContext();
  
  // Define the workflow steps with their details
  const steps = [
    { 
      id: 'upload', 
      label: 'Upload', 
      icon: '📁',
      isAvailable: () => true
    },
    { 
      id: 'generate', 
      label: 'Generate', 
      icon: '✨',
      isAvailable: () => !!currentImages.uploaded
    },
    { 
      id: 'edit', 
      label: 'Edit', 
      icon: '✏️',
      isAvailable: () => !!currentImages.generated
    }
  ];
  
  const currentStepIndex = steps.findIndex(step => step.id === currentMode);
  
  return (
    <nav className="workspace-breadcrumb flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Add separator between steps */}
          {index > 0 && (
            <svg className="w-4 h-4 mx-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          )}
          
          {/* Render step button */}
          <button
            className={`flex items-center px-2 py-1 rounded text-sm ${
              currentMode === step.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-800/30 dark:text-primary-300 font-medium'
                : step.isAvailable()
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            onClick={() => {
              if (step.isAvailable()) {
                setCurrentMode(step.id);
              }
            }}
            disabled={!step.isAvailable()}
          >
            <span className="mr-1.5">{step.icon}</span>
            {step.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

export default WorkspaceBreadcrumb;
