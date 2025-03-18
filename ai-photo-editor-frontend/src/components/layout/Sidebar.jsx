import React from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import ProjectSelector from '../workspace/ProjectSelector';
import WorkflowSteps from '../navigation/WorkflowSteps';
import VersionHistory from '../workspace/VersionHistory';
import SaveVersionButton from '../common/SaveVersionButton';

/**
 * Sidebar component providing persistent navigation and workspace context
 */
function Sidebar() {
  const { currentMode } = useWorkspaceContext();

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Project selector section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Project</h2>
        <ProjectSelector />
      </div>
      
      {/* Workflow steps navigation */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Workflow</h2>
        <WorkflowSteps currentMode={currentMode} />
      </div>
      
      {/* Version history */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-grow overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-gray-800 dark:text-gray-200">Version History</h2>
          <SaveVersionButton 
            buttonSize="small"
            buttonText="+ Save"
            variant="link"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          />
        </div>
        <VersionHistory />
      </div>
    </aside>
  );
}

export default Sidebar;
