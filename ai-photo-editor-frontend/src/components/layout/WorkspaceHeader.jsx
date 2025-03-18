import React from 'react';
import PropTypes from 'prop-types';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import WorkspaceBreadcrumb from '../navigation/WorkspaceBreadcrumb';
import WorkspaceActions from '../workspace/WorkspaceActions';
import ThemeToggle from '../ThemeToggle'; // Import ThemeToggle

/**
 * Header component for the workspace with navigation and actions
 */
function WorkspaceHeader({ onMobileMenuClick }) {
  const { currentMode, currentImages } = useWorkspaceContext();
  const hasContent = currentImages.uploaded || currentImages.generated;
  
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Logo/Title with mobile menu button */}
        <div className="flex items-center">
          {hasContent && (
            <button 
              onClick={onMobileMenuClick}
              className="mr-3 md:hidden text-gray-700 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Fashion Editor</h1>
        </div>
        
        {/* Center: Breadcrumb navigation */}
        {hasContent && (
          <div className="hidden sm:block">
            <WorkspaceBreadcrumb />
          </div>
        )}
        
        {/* Right: Action buttons */}
        <div className="flex items-center space-x-3">
          <WorkspaceActions />
          <ThemeToggle /> {/* Add ThemeToggle component */}
        </div>
      </div>
    </header>
  );
}

WorkspaceHeader.propTypes = {
  onMobileMenuClick: PropTypes.func.isRequired
};

export default WorkspaceHeader;
