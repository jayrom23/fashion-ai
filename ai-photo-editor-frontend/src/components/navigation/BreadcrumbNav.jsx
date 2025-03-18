import React from 'react';
import PropTypes from 'prop-types';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import { getWorkflowSteps } from '../../utils/navigationSteps';

/**
 * Breadcrumb navigation component showing current workflow position
 */
function BreadcrumbNav({ currentMode }) {
  const { setCurrentMode, currentImages } = useWorkspaceContext();
  
  // Get steps from shared utility
  const steps = getWorkflowSteps(currentImages);
  
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
                : step.isAvailable()
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            onClick={() => step.isAvailable() && setCurrentMode(step.id)}
            disabled={!step.isAvailable()}
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
