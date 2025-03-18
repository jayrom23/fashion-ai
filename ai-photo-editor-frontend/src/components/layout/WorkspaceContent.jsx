import React, { useRef, useCallback } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import WorkspaceCanvas from '../workspace/WorkspaceCanvas';
import ControlPanel from '../workspace/ControlPanel';
import GalleryWrapper from '../wrapper/GalleryWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import { handleError } from '../../utils/errorHandling';

/**
 * Main content area of the workspace
 */
function WorkspaceContent() {
  const { 
    currentMode, 
    showGallery, 
    setGeneratedImage, 
    galleryRefreshCounter 
  } = useWorkspaceContext();
  
  // Keep track of component mounted state
  const isMounted = useRef(true);
  
  // Set up unmount cleanup
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Handle gallery image selection with error handling
  const handleGalleryImageSelected = useCallback((image) => {
    try {
      if (!image?.imageData || !isMounted.current) return;
      
      setGeneratedImage(image.imageData, image.metadata || {}, image.id);
    } catch (error) {
      if (!isMounted.current) return;
      
      handleError(
        error, 
        'Failed to load selected image',
        () => {
          // Optional fallback action
          console.log('Image selection failed, fallback would go here');
        }
      );
    }
  }, [setGeneratedImage]);
  
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Conditional gallery display with animation */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={TRANSITIONS.PAGE}
            className="p-4 bg-white dark:bg-gray-800/50 border-b dark:border-gray-700"
          >
            <GalleryWrapper
              onImageSelected={handleGalleryImageSelected}
              refreshTrigger={galleryRefreshCounter}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main workspace grid */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Canvas area (left on desktop, top on mobile) */}
        <div className="md:w-3/5 lg:w-2/3 xl:w-3/4 h-full overflow-auto">
          <WorkspaceCanvas />
        </div>
        
        {/* Control panel - adjust width settings but maintain reasonable constraints */}
        <div className="md:w-2/5 lg:w-1/3 xl:w-1/4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 h-full overflow-auto bg-white dark:bg-gray-800">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceContent;
