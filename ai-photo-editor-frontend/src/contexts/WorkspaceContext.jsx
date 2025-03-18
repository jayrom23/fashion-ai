import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { workspaceReducer } from '../reducers/workspaceReducer';
import projectService from '../services/projectService';

// Define initial state structure
const initialState = {
  currentMode: 'upload', // 'upload', 'generate', 'edit'
  currentStep: 1, // Legacy step counter (1, 2, 3)
  
  // Image data
  currentImages: {
    uploaded: null,
    generated: null,
  },
  generatedImageMetadata: null,
  imageId: null,
  
  // Projects & Versions management
  projects: [],
  activeProjectId: null,
  versions: [], 
  activeVersionId: null,
  
  // UI state
  showGallery: false,
  showWorkspacePanel: false,
  galleryRefreshCounter: 0, // Counter to trigger gallery refresh
  
  // Generation settings
  generationSettings: {
    gender: 'female',
    bodyType: 'default',
    bodySize: 'default',
    height: 'default',
    age: 'default',
    ethnicity: 'default',
    background: 'outdoor-nature',
    pose: 'natural',
    cameraAngle: 'default',
    lens: 'default',
    isCustomPrompt: false,
    customPrompt: '',
  },
  
  // Editing settings
  editingSettings: {},
};

// Create the context
export const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  
  // Load workspace state from localStorage on initial mount
  useEffect(() => {
    const savedState = localStorage.getItem('workspaceState');
    if (savedState) {
      try {
        dispatch({ 
          type: 'RESTORE_WORKSPACE', 
          payload: JSON.parse(savedState) 
        });
      } catch (error) {
        console.error('Failed to parse saved workspace state', error);
      }
    }
    
    // Load workspace versions from localStorage
    const savedVersions = localStorage.getItem('workspaceStates');
    if (savedVersions) {
      try {
        dispatch({
          type: 'RESTORE_VERSIONS',
          payload: JSON.parse(savedVersions)
        });
      } catch (error) {
        console.error('Failed to parse saved workspace versions', error);
      }
    }
    
    // Load active version ID
    const activeVersionId = localStorage.getItem('activeWorkspaceId');
    if (activeVersionId) {
      dispatch({
        type: 'SET_ACTIVE_VERSION',
        payload: activeVersionId
      });
    }
    
    // Load active project ID
    const activeProjectId = localStorage.getItem('activeProjectId');
    if (activeProjectId) {
      dispatch({
        type: 'SET_ACTIVE_PROJECT',
        payload: activeProjectId
      });
      
      // Load the project data if available
      const project = projectService.getProject(activeProjectId);
      if (project) {
        dispatch({
          type: 'LOAD_PROJECT',
          payload: project
        });
      }
    }
  }, []);
  
  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workspaceState', JSON.stringify({
      currentImages: state.currentImages,
      currentMode: state.currentMode,
      currentStep: state.currentStep,
      imageId: state.imageId,
      generatedImageMetadata: state.generatedImageMetadata,
      showGallery: state.showGallery,
      showWorkspacePanel: state.showWorkspacePanel,
      generationSettings: state.generationSettings
    }));
  }, [state]);
  
  // Persist versions separately (they might be large)
  useEffect(() => {
    if (state.versions.length > 0) {
      localStorage.setItem('workspaceStates', JSON.stringify(state.versions));
    }
  }, [state.versions]);
  
  // Persist active version ID
  useEffect(() => {
    if (state.activeVersionId) {
      localStorage.setItem('activeWorkspaceId', state.activeVersionId);
    }
  }, [state.activeVersionId]);
  
  // Persist active project ID and update project data
  useEffect(() => {
    if (state.activeProjectId) {
      localStorage.setItem('activeProjectId', state.activeProjectId);
      
      // Automatically update project when state changes
      const updateProject = () => {
        // Don't update if we don't have images yet
        if (!state.currentImages.uploaded && !state.currentImages.generated) return;
        
        const project = projectService.getProject(state.activeProjectId);
        if (project) {
          const updatedProject = {
            ...project,
            uploadedImage: state.currentImages.uploaded,
            generatedImage: state.currentImages.generated,
            generatedImageMetadata: state.generatedImageMetadata,
            imageId: state.imageId,
            updatedAt: new Date().toISOString()
          };
          
          projectService.updateProject(updatedProject);
        }
      };
      
      // Debounce project updates to prevent excessive writes
      const timeoutId = setTimeout(updateProject, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [state.activeProjectId, state.currentImages, state.generatedImageMetadata, state.imageId]);
  
  // Project management helpers
  const createProject = useCallback((name) => {
    if (!state.currentImages.uploaded && !state.currentImages.generated) {
      return null;
    }
    
    const newProject = {
      name,
      uploadedImage: state.currentImages.uploaded,
      generatedImage: state.currentImages.generated,
      generatedImageMetadata: state.generatedImageMetadata,
      imageId: state.imageId,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const savedProject = projectService.createProject(newProject);
    dispatch({ 
      type: 'SET_ACTIVE_PROJECT', 
      payload: savedProject.id 
    });
    
    return savedProject;
  }, [state.currentImages, state.generatedImageMetadata, state.imageId]);
  
  // Create helper actions for the context value
  const contextValue = {
    ...state,
    dispatch,
    
    // Helper functions to make common actions easier
    setUploadedImage: (imageData) => {
      dispatch({ type: 'SET_UPLOADED_IMAGE', payload: imageData });
    },
    
    setGeneratedImage: (imageData, metadata, id) => {
      dispatch({ 
        type: 'SET_GENERATED_IMAGE', 
        payload: { imageData, metadata, id } 
      });
    },
    
    saveCurrentState: (customName) => {
      if (!state.currentImages.uploaded) return;
      
      dispatch({ 
        type: 'SAVE_VERSION', 
        payload: { name: customName } 
      });
    },
    
    restoreVersion: (versionId) => {
      dispatch({ type: 'RESTORE_VERSION', payload: versionId });
    },
    
    deleteVersion: (versionId) => {
      dispatch({ type: 'DELETE_VERSION', payload: versionId });
    },
    
    setCurrentMode: (mode) => {
      dispatch({ type: 'SET_CURRENT_MODE', payload: mode });
    },
    
    toggleGallery: () => {
      dispatch({ type: 'TOGGLE_GALLERY' });
    },
    
    toggleWorkspacePanel: () => {
      dispatch({ type: 'TOGGLE_WORKSPACE_PANEL' });
    },
    
    updateGenerationSettings: (settings) => {
      dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: settings });
    },
    
    // Project management functions
    createProject,
    
    loadProject: (project) => {
      dispatch({ type: 'LOAD_PROJECT', payload: project });
    },
    
    clearActiveProject: () => {
      dispatch({ type: 'SET_ACTIVE_PROJECT', payload: null });
    }
  };
  
  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}
