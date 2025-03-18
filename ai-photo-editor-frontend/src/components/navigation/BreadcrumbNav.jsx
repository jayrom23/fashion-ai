import React from 'react';
import PropTypes from 'prop-types';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';

/**
 * Breadcrumb navigation component showing current workflow position
 */
function BreadcrumbNav({ currentMode }) {
  const { setCurrentMode, currentImages } = useWorkspaceContext();
  
  // Define the workflow steps
  const steps = [
    { id: 'upload', label: 'Upload', icon: '📁' },
    { id: 'generate', label: 'Generate', icon: '✨' },
    { id: 'edit', label: 'Edit', icon: '✏️' }
  ];
  
  // Determine which steps are available based on current state
  const isStepAvailable = (stepId) => {
    if (stepId === 'upload') return true;
    if (stepId === 'generate') return !!currentImages.uploaded;
    if (stepId === 'edit') return !!currentImages.generated;
    return false;
  };
  
  return (
    <nav className="breadcrumb-nav flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Separator between steps */}
          {index > 0 && (
            <svg className="mx-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {/* Step button */}
          <button
            className={`flex items-center px-2 py-1 rounded ${
              currentMode === step.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : isStepAvailable(step.id)
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            onClick={() => isStepAvailable(step.id) && setCurrentMode(step.id)}
            disabled={!isStepAvailable(step.id)}
          >
            <span className="mr-1">{step.icon}</span>
            <span>{step.label}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

BreadcrumbNav.propTypes = {
  currentMode: PropTypes.string.isRequired
};

export default BreadcrumbNav;
