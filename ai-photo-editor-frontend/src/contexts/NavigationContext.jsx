import React, { createContext, useState } from 'react';
import { useWorkspaceContext } from '../hooks/useWorkspaceContext';

// Create context with default values to improve TypeScript inference and IDE support
const NavigationContext = createContext({
  workflowSteps: [],
  currentMode: '',
  navigateToStep: () => {},
  saveModalOpen: false,
  openSaveModal: () => {},
  closeSaveModal: () => {},
  confirmationProps: null,
  showConfirmation: () => {},
  hideConfirmation: () => {}
});

export { NavigationContext };

export function NavigationProvider({ children }) {
  const { currentMode, setCurrentMode, currentImages } = useWorkspaceContext();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [confirmationProps, setConfirmationProps] = useState(null);
  
  // Define workflow steps once for the entire application
  const workflowSteps = [
    { 
      id: 'upload', 
      label: 'Upload',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ),
      textIcon: "📁", // For compatibility during transition
      description: 'Upload clothing image',
      isAvailable: () => true,
      isCompleted: () => !!currentImages.uploaded
    },
    { 
      id: 'generate', 
      label: 'Generate', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
      ),
      textIcon: "✨",
      description: 'Create fashion model with your clothing',
      isAvailable: () => !!currentImages.uploaded,
      isCompleted: () => !!currentImages.generated
    },
    { 
      id: 'edit', 
      label: 'Edit', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
      textIcon: "✏️",
      description: 'Refine and download your image',
      isAvailable: () => !!currentImages.generated,
      isCompleted: () => false // Edit is last step, never completed
    }
  ];
  
  // Open save modal from anywhere in the app
  const openSaveModal = () => setSaveModalOpen(true);
  const closeSaveModal = () => setSaveModalOpen(false);
  
  // Show confirmation dialog with any configuration
  const showConfirmation = (props) => setConfirmationProps(props);
  const hideConfirmation = () => setConfirmationProps(null);

  return (
    <NavigationContext.Provider value={{
      workflowSteps,
      currentMode,
      navigateToStep: setCurrentMode,
      saveModalOpen,
      openSaveModal,
      closeSaveModal,
      confirmationProps,
      showConfirmation,
      hideConfirmation
    }}>
      {children}
    </NavigationContext.Provider>
  );
}
