import React, { useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';  // Updated import path
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import Modal from './Modal';
import { toast } from 'react-hot-toast';
import { generateId } from '../../utils/idHelpers';
import { handleError } from '../../utils/errorHandling';

/**
 * Centralized save version modal component
 */
function SaveVersionModal() {
  const { saveModalOpen, closeSaveModal } = useNavigation();
  const { saveCurrentState } = useWorkspaceContext();
  const [versionName, setVersionName] = useState('');
  
  const versionNameId = generateId('SaveVersionModal', 'versionName');

  const handleSaveVersion = () => {
    try {
      saveCurrentState(versionName);
      closeSaveModal();
      setVersionName('');
      toast.success('Version saved successfully');
    } catch (error) {
      handleError(error, 'Failed to save version');
    }
  };

  return (
    <Modal
      isOpen={saveModalOpen}
      onClose={closeSaveModal}
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
            onClick={closeSaveModal} 
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
  );
}

export default SaveVersionModal;
