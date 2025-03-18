import React from 'react';
import PropTypes from 'prop-types';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';

/**
 * Vertical workflow steps visualization for the sidebar
 */
function WorkflowSteps({ currentMode }) {
  const { setCurrentMode, currentImages } = useWorkspaceContext();
  
  // Define the workflow steps
  const steps = [
    { 
      id: 'upload', 
      label: 'Upload Clothing', 
      icon: '📁',
      description: 'Upload clothing image'
    },
    { 
      id: 'generate', 
      label: 'Generate Model', 
      icon: '✨',
      description: 'Create fashion model with your clothing'
    },
    { 
      id: 'edit', 
      label: 'Edit & Export', 
      icon: '✏️',
      description: 'Refine and download your image'
    }
  ];
  
  // Check if a step is available based on current state
  const isStepAvailable = (stepId) => {
    if (stepId === 'upload') return true;
    if (stepId === 'generate') return !!currentImages.uploaded;
    if (stepId === 'edit') return !!currentImages.generated;
    return false;
  };
  
  // Check if a step is completed
  const isStepCompleted = (stepId, index) => {
    const currentIndex = steps.findIndex(step => step.id === currentMode);
    if (currentIndex === -1) return false;
    
    if (stepId === 'upload') return !!currentImages.uploaded;
    if (stepId === 'generate') return !!currentImages.generated;
    return false;
  };
  
  return (
    <div className="workflow-steps space-y-4">
      {steps.map((step, index) => (
        <button
          key={step.id}
          className={`w-full text-left flex items-start p-2 rounded ${
            currentMode === step.id
              ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'
              : isStepAvailable(step.id)
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200'
                : 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
          }`}
          onClick={() => isStepAvailable(step.id) && setCurrentMode(step.id)}
          disabled={!isStepAvailable(step.id)}
        >
          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 
            ${isStepCompleted(step.id, index)
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              : currentMode === step.id
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {isStepCompleted(step.id, index) ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span>{step.icon}</span>
            )}
          </div>
          
          <div>
            <div className="font-medium">{step.label}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{step.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

WorkflowSteps.propTypes = {
  currentMode: PropTypes.string.isRequired
};

export default WorkflowSteps;
