import React from 'react';
import PropTypes from 'prop-types';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import { getWorkflowSteps } from '../../utils/navigationSteps';

/**
 * Vertical workflow steps visualization for the sidebar
 */
function WorkflowSteps({ currentMode }) {
  const { setCurrentMode, currentImages } = useWorkspaceContext();
  
  // Get steps from shared utility
  const steps = getWorkflowSteps(currentImages);
  
  return (
    <div className="workflow-steps space-y-4">
      {steps.map((step) => (
        <button
          key={step.id}
          className={`w-full text-left flex items-start p-2 rounded ${
            currentMode === step.id
              ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'
              : step.isAvailable()
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200'
                : 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
          }`}
          onClick={() => step.isAvailable() && setCurrentMode(step.id)}
          disabled={!step.isAvailable()}
        >
          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 
            ${step.isCompleted()
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              : currentMode === step.id
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {step.isCompleted() ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span>{step.icon}</span>
            )}
          </div>
          
          <div>
            <div className="font-medium">{step.fullLabel}</div>
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
