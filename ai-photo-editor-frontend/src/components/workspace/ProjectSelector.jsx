import React, { useState, useEffect } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ConfirmationDialog from '../common/ConfirmationDialog';

/**
 * Project selector component for managing projects in the workspace
 */
function ProjectSelector() {
  const { 
    currentImages, 
    generatedImageMetadata, 
    imageId, 
    activeProjectId, 
    dispatch 
  } = useWorkspaceContext();
  
  const [projects, setProjects] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load projects from storage
  const loadProjects = () => {
    try {
      const allProjects = projectService.getProjects();
      setProjects(allProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    }
  };
  
  // Create new project
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newProject = {
        name: newProjectName,
        uploadedImage: currentImages.uploaded,
        generatedImage: currentImages.generated,
        generatedImageMetadata,
        imageId,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const savedProject = projectService.createProject(newProject);
      
      // Update projects list
      loadProjects();
      
      // Set as active project
      dispatch({ 
        type: 'SET_ACTIVE_PROJECT', 
        payload: savedProject.id 
      });
      
      toast.success('Project created successfully');
      
      // Reset UI state
      setNewProjectName('');
      setIsCreateOpen(false);
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load project
  const handleLoadProject = (project) => {
    try {
      // Update workspace context with project data
      dispatch({ 
        type: 'LOAD_PROJECT', 
        payload: project 
      });
      
      // Close menu
      setIsMenuOpen(false);
      
      toast.success(`Loaded project: ${project.name || 'Unnamed project'}`);
    } catch (error) {
      toast.error('Failed to load project');
      console.error(error);
    }
  };
  
  // Handle project import
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = projectService.importProject(e.target.result);
        if (success) {
          loadProjects();
          toast.success('Project imported successfully');
        } else {
          toast.error('Failed to import project');
        }
      } catch (error) {
        toast.error('Invalid project file');
      }
    };
    reader.readAsText(file);
  };
  
  // Handle project export
  const handleExport = (id, event) => {
    event.stopPropagation();
    const url = projectService.exportProject(id);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `fashion-project-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Project exported successfully');
    }
  };
  
  // Handle project deletion
  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    const project = projects.find(p => p.id === id);
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };
  
  // Handle confirmed deletion
  const confirmDelete = () => {
    if (projectToDelete) {
      try {
        projectService.deleteProject(projectToDelete.id);
        loadProjects();
        
        // If the deleted project was active, clear active project
        if (projectToDelete.id === activeProjectId) {
          dispatch({ type: 'SET_ACTIVE_PROJECT', payload: null });
        }
        
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };
  
  return (
    <div className="project-selector">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Current Project</span>
        <div className="flex gap-1">
          <Button 
            variant="link"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            aria-label="Create new project"
          >
            + New
          </Button>
          
          <label className="flex items-center cursor-pointer">
            <Button
              variant="link"
              size="sm"
              as="span"
              aria-label="Import project"
            >
              Import
            </Button>
            <input 
              type="file" 
              accept="application/json" 
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {/* Current project selector button */}
      <div className="relative">
        <Button 
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-left justify-between"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <span className="font-medium truncate">
            {activeProjectId ? 
              projects.find(p => p.id === activeProjectId)?.name || 'Unnamed Project' : 
              'No Active Project'
            }
          </span>
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </Button>
        
        {/* Create Project Dialog */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create New Project"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary"
                size="md"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              
              <Button 
                variant="primary"
                size="md"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : 'Create Project'}
              </Button>
            </div>
          </div>
        </Modal>
        
        {/* Projects Dropdown */}
        {isMenuOpen && projects.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
            {projects.map(project => (
              <div 
                key={project.id}
                onClick={() => handleLoadProject(project)}
                className={`flex p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  project.id === activeProjectId ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                role="option"
                aria-selected={project.id === activeProjectId}
              >
                {/* Project thumbnail */}
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 rounded">
                  {project.generatedImage ? (
                    <img 
                      src={`data:image/jpeg;base64,${project.generatedImage}`}
                      alt="Fashion model" 
                      className="object-cover h-full w-full"
                    />
                  ) : project.uploadedImage ? (
                    <img 
                      src={`data:image/jpeg;base64,${project.uploadedImage}`}
                      alt="Clothing" 
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>
                
                {/* Project details */}
                <div className="ml-2 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate pr-2">
                      {project.name || `Project ${project.id.slice(-4)}`}
                    </p>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleExport(project.id, e)}
                        aria-label="Export project"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(project.id, e)}
                        aria-label="Delete project"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        }
                        className="hover:text-red-600 dark:hover:text-red-400"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Replace delete confirmation modal with ConfirmationDialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={
          <>
            Are you sure you want to delete project "<span className="font-medium">{projectToDelete?.name || 'Untitled'}</span>"? 
            This action cannot be undone.
          </>
        }
        confirmVariant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        size="sm"
      />
    </div>
  );
}

export default ProjectSelector;
