import React, { useState } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import ProjectSelector from '../workspace/ProjectSelector';
import WorkflowSteps from '../navigation/WorkflowSteps';
import VersionHistory from '../workspace/VersionHistory';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { generateId } from '../../utils/idHelpers';
import { handleError } from '../../utils/errorHandling';

/**
 * Sidebar component specifically for mobile drawer
 * Duplicates Sidebar but with proper modal integration
 */
function MobileDrawerSidebar() {
  const COMPONENT_NAME = 'MobileSidebar';
  const { currentMode, saveCurrentState } = useWorkspaceContext();
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  
  const versionNameId = generateId(COMPONENT_NAME, 'versionName');

  const handleSaveVersion = () => {
    try {
      saveCurrentState(versionName);
      setSaveModalOpen(false);
      setVersionName('');
      toast.success('Version saved successfully');
    } catch (error) {
      handleError(error, 'Failed to save version');
    }
  };

  return (
    <div className="h-full flex flex-col">
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
          <button 
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            onClick={() => setSaveModalOpen(true)}
            aria-label="Save new version"
          >
            + Save
          </button>
        </div>
        <VersionHistory />
      </div>

      {/* Save Version Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Version"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor={versionNameId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Version Name (optional)
            </label>
            <input
              id={versionNameId}
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="Enter a name for this version"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setSaveModalOpen(false)} 
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleSaveVersion}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save Version
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MobileDrawerSidebar;
