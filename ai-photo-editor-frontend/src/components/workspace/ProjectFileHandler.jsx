import React, { useState } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import projectService from '../../services/projectService';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

/**
 * Handles file operations for projects (import/export) with proper modals
 */
function ProjectFileHandler() {
  const { dispatch } = useWorkspaceContext();
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // File input reference to trigger the file dialog
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImportModalOpen(true);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const success = projectService.importProject(e.target.result);
          if (success) {
            // Try to load the project list after import
            const projects = projectService.getProjects();
            if (projects.length > 0) {
              const latestProject = projects[projects.length - 1];
              dispatch({ 
                type: 'SET_ACTIVE_PROJECT', 
                payload: latestProject.id 
              });
              
              // Load the project
              dispatch({
                type: 'LOAD_PROJECT',
                payload: latestProject
              });
            }
            
            toast.success('Project imported successfully');
            setImportModalOpen(false);
          } else {
            throw new Error('Import operation failed');
          }
        } catch (error) {
          console.error('Error importing project:', error);
          setImportError('Failed to import project. The file may be invalid or corrupted.');
          toast.error('Import failed');
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.onerror = () => {
        setImportError('Error reading file');
        setIsImporting(false);
        toast.error('Error reading file');
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error in import process:', error);
      setImportError('Unexpected error during import');
      setIsImporting(false);
      toast.error('Import process failed');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={triggerFileInput}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          aria-label="Import project"
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Import Confirmation Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => !isImporting && setImportModalOpen(false)}
        title="Import Project"
        size="sm"
      >
        <div className="space-y-4">
          {importError ? (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-sm">
              {importError}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Import project from file: <span className="font-medium">{selectedFile?.name}</span>?
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => !isImporting && setImportModalOpen(false)}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              disabled={isImporting}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importing...
                </>
              ) : 'Import'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProjectFileHandler;
