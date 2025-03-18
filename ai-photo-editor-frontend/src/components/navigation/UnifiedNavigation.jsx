import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '../../hooks/useNavigation';  // Updated import path

/**
 * Unified navigation component that adapts to different layouts
 * @param {string} variant - Navigation display variant ('breadcrumb', 'steps', 'tabs')
 * @param {string} orientation - Layout orientation ('horizontal', 'vertical')
 */
function UnifiedNavigation({ variant = 'breadcrumb', orientation = 'horizontal' }) {
  const { workflowSteps, currentMode, navigateToStep } = useNavigation();
  
  // Helper function to determine if step is clickable
  const canNavigate = (step) => step.isAvailable();
  
  // Rendering for horizontal breadcrumb style
  if (variant === 'breadcrumb' && orientation === 'horizontal') {
    return (
      <nav className="flex items-center space-x-1">
        {workflowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Add separator between steps */}
            {index > 0 && (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            )}
            
            {/* Step button */}
            <button
              className={`flex items-center px-2 py-1 rounded text-sm ${
                currentMode === step.id
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-800/30 dark:text-primary-300 font-medium'
                  : canNavigate(step)
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
              onClick={() => canNavigate(step) && navigateToStep(step.id)}
              disabled={!canNavigate(step)}
            >
              <span className="mr-1.5">{step.icon}</span>
              {step.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
    );
  }
  
  // Rendering for vertical steps style
  if (variant === 'steps' && orientation === 'vertical') {
    return (
      <div className="space-y-4">
        {workflowSteps.map((step) => (
          <button
            key={step.id}
            className={`w-full text-left flex items-start p-2 rounded ${
              currentMode === step.id
                ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'
                : canNavigate(step)
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200'
                  : 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
            }`}
            onClick={() => canNavigate(step) && navigateToStep(step.id)}
            disabled={!canNavigate(step)}
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
                step.icon
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
  
  // Default fallback
  return (
    <div className="flex space-x-2">
      {workflowSteps.map((step) => (
        <button
          key={step.id}
          className={`px-3 py-1.5 rounded ${
            currentMode === step.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => canNavigate(step) && navigateToStep(step.id)}
          disabled={!canNavigate(step)}
        >
          {step.label}
        </button>
      ))}
    </div>
  );
}

UnifiedNavigation.propTypes = {
  variant: PropTypes.oneOf(['breadcrumb', 'steps', 'tabs']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default UnifiedNavigation;
