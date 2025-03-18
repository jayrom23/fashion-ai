import React, { useState } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { generateId } from '../../utils/idHelpers';
import { handleError } from '../../utils/errorHandling';

/**
 * Workspace action buttons component for the header
 */
function WorkspaceActions() {
  const COMPONENT_NAME = 'WorkspaceActions';
  const { 
    currentImages, 
    saveCurrentState,
    toggleGallery,
    showGallery,
    toggleWorkspacePanel,
    showWorkspacePanel
  } = useWorkspaceContext();
  
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  
  const versionNameId = generateId(COMPONENT_NAME, 'versionName');
  
  const hasContent = currentImages.uploaded || currentImages.generated;
  
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
  
  if (!hasContent) {
    return null;
  }
  
  return (
    <>
      <div className="workspace-actions flex items-center space-x-2">
        <button 
          onClick={toggleGallery}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center"
          aria-pressed={showGallery}
          aria-label={showGallery ? 'Hide gallery' : 'Show gallery'}
        >
          <span className="mr-1">{showGallery ? '🔽' : '🔼'}</span>
          {showGallery ? 'Hide Gallery' : 'Show Gallery'}
        </button>
        
        <button 
          onClick={toggleWorkspacePanel}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center"
          aria-pressed={showWorkspacePanel}
          aria-label={showWorkspacePanel ? 'Hide history' : 'Show history'}
        >
          <span className="mr-1">{showWorkspacePanel ? '📁' : '📂'}</span>
          {showWorkspacePanel ? 'Hide History' : 'Show History'}
        </button>
        
        <button 
          onClick={() => setSaveModalOpen(true)}
          className="px-3 py-1.5 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800/40 flex items-center"
          aria-label="Save version"
        >
          <span className="mr-1">💾</span>
          Save Version
        </button>
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
    </>
  );
}

export default WorkspaceActions;
