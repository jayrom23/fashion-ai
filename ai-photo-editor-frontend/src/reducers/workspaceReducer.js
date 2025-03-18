/**
 * Workspace Reducer - handles all state transitions for the unified workspace
 */

// Helper function to generate a unique ID for workspace versions
const generateId = () => `state-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function workspaceReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_WORKSPACE':
      return {
        ...state,
        ...action.payload
      };
      
    case 'RESTORE_VERSIONS':
      return {
        ...state,
        versions: action.payload
      };
      
    case 'SET_UPLOADED_IMAGE':
      return {
        ...state,
        currentImages: {
          ...state.currentImages,
          uploaded: action.payload
        },
        currentMode: 'generate',
        currentStep: 2 // Maintain legacy step counter
      };
      
    case 'SET_GENERATED_IMAGE':
      return {
        ...state,
        currentImages: {
          ...state.currentImages,
          generated: action.payload.imageData
        },
        generatedImageMetadata: action.payload.metadata,
        imageId: action.payload.id || null,
        currentMode: 'edit',
        currentStep: 3, // Maintain legacy step counter
        // Increment the gallery refresh counter
        galleryRefreshCounter: (state.galleryRefreshCounter || 0) + 1
      };
      
    case 'SET_CURRENT_MODE':
      const newStep = action.payload === 'upload' ? 1 : 
                     action.payload === 'generate' ? 2 : 3;
      return {
        ...state,
        currentMode: action.payload,
        currentStep: newStep // Update legacy step counter
      };
      
    case 'SET_ACTIVE_VERSION':
      return {
        ...state,
        activeVersionId: action.payload
      };
      
    case 'SAVE_VERSION': {
      const versionName = action.payload.name || `Version ${state.versions.length + 1}`;
      const newVersion = {
        id: generateId(),
        name: versionName,
        timestamp: new Date(),
        uploadedImage: state.currentImages.uploaded,
        generatedImage: state.currentImages.generated,
        generatedImageMetadata: state.generatedImageMetadata,
        currentStep: state.currentStep,
        currentMode: state.currentMode,
        imageId: state.imageId,
        generationSettings: state.generationSettings
      };
      
      return {
        ...state,
        versions: [...state.versions, newVersion],
        activeVersionId: newVersion.id
      };
    }
      
    case 'RESTORE_VERSION': {
      const versionToRestore = state.versions.find(v => v.id === action.payload);
      if (!versionToRestore) return state;
      
      return {
        ...state,
        currentImages: {
          uploaded: versionToRestore.uploadedImage,
          generated: versionToRestore.generatedImage
        },
        generatedImageMetadata: versionToRestore.generatedImageMetadata,
        currentStep: versionToRestore.currentStep || 
                    (versionToRestore.generatedImage ? 3 : versionToRestore.uploadedImage ? 2 : 1),
        currentMode: versionToRestore.currentMode || 
                    (versionToRestore.generatedImage ? 'edit' : versionToRestore.uploadedImage ? 'generate' : 'upload'),
        imageId: versionToRestore.imageId || null,
        activeVersionId: versionToRestore.id,
        generationSettings: versionToRestore.generationSettings || state.generationSettings
      };
    }
      
    case 'DELETE_VERSION': {
      const updatedVersions = state.versions.filter(v => v.id !== action.payload);
      const isActivatedVersionDeleted = state.activeVersionId === action.payload;
      
      return {
        ...state,
        versions: updatedVersions,
        activeVersionId: isActivatedVersionDeleted ? 
          (updatedVersions.length > 0 ? updatedVersions[updatedVersions.length - 1].id : null) : 
          state.activeVersionId
      };
    }
      
    case 'TOGGLE_GALLERY':
      return {
        ...state,
        showGallery: !state.showGallery
      };
      
    case 'TOGGLE_WORKSPACE_PANEL':
      return {
        ...state,
        showWorkspacePanel: !state.showWorkspacePanel
      };
      
    case 'UPDATE_GENERATION_SETTINGS':
      return {
        ...state,
        generationSettings: {
          ...state.generationSettings,
          ...action.payload
        }
      };
    
    // Project management actions
    case 'SET_ACTIVE_PROJECT':
      return {
        ...state,
        activeProjectId: action.payload
      };
    
    case 'LOAD_PROJECT':
      const project = action.payload;
      return {
        ...state,
        currentImages: {
          uploaded: project.uploadedImage || null,
          generated: project.generatedImage || null
        },
        generatedImageMetadata: project.generatedImageMetadata || null,
        imageId: project.imageId || null,
        currentStep: project.generatedImage ? 3 : project.uploadedImage ? 2 : 1,
        currentMode: project.generatedImage ? 'edit' : project.uploadedImage ? 'generate' : 'upload',
        activeProjectId: project.id
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        activeProjectId: action.payload.id
      };
    
    default:
      return state;
  }
}
