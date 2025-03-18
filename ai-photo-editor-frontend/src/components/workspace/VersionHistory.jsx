import React, { useState } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import Modal from '../common/Modal';

/**
 * Version history component for the workspace that displays saved versions
 */
function VersionHistory() {
  const { versions, activeVersionId, restoreVersion, deleteVersion } = useWorkspaceContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState(null);
  
  // Handle version deletion with confirmation modal
  const handleDeleteClick = (id, e) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    setVersionToDelete(versions.find(v => v.id === id));
    setDeleteModalOpen(true);
  };
  
  // Confirm deletion
  const confirmDelete = () => {
    if (versionToDelete) {
      deleteVersion(versionToDelete.id);
      setDeleteModalOpen(false);
      setVersionToDelete(null);
    }
  };
  
  if (versions.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 dark:text-gray-400">
        <p>No saved versions yet</p>
        <p className="text-xs mt-1">Save your work to create versions</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="version-history space-y-3">
        {versions.map((version) => (
          <div 
            key={version.id}
            className={`version-item p-2 border rounded-md cursor-pointer transition-all ${
              version.id === activeVersionId ? 
              'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 
              'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => restoreVersion(version.id)}
            role="button"
            aria-pressed={version.id === activeVersionId}
            tabIndex={0}
            onKeyDown={(e) => {
              // Keyboard accessibility
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                restoreVersion(version.id);
              }
            }}
          >
            <div className="flex items-start">
              {/* Thumbnail */}
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden mr-3 flex-shrink-0">
                {version.generatedImage ? (
                  <img 
                    src={`data:image/jpeg;base64,${version.generatedImage}`} 
                    alt={version.name}
                    className="w-full h-full object-cover"
                  />
                ) : version.uploadedImage ? (
                  <img 
                    src={`data:image/jpeg;base64,${version.uploadedImage}`} 
                    alt={version.name}
                    className="w-full h-full object-contain p-0.5"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-xs">No img</span>
                  </div>
                )}
              </div>
              
              {/* Version info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate pr-2">
                    {version.name}
                  </p>
                  <button 
                    onClick={(e) => handleDeleteClick(version.id, e)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-auto p-1"
                    aria-label={`Delete version: ${version.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {new Date(version.timestamp).toLocaleString()}
                </p>
                
                {/* Badge for current step/mode */}
                <div className="mt-1 flex">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    version.currentMode === 'upload' ? 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                    version.currentMode === 'generate' ? 
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {version.currentMode === 'upload' ? 'Upload' : 
                     version.currentMode === 'generate' ? 'Generate' : 'Edit'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Version"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete "<span className="font-medium">{versionToDelete?.name}</span>"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default VersionHistory;
