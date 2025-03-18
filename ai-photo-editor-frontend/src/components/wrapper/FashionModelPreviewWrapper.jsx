import React, { useEffect, useState, useRef } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import FashionModelPreview from '../FashionModelPreview';
import toast from 'react-hot-toast';
import { handleError } from '../../utils/errorHandling';

/**
 * Wrapper component to integrate FashionModelPreview with WorkspaceContext
 * This allows us to keep the original component unchanged while adding context integration
 */
function FashionModelPreviewWrapper() {
  const { 
    currentImages,
    setGeneratedImage,
    generationSettings,
    updateGenerationSettings,
    saveCurrentState
  } = useWorkspaceContext();
  
  const [initialized, setInitialized] = useState(false);
  const isMounted = useRef(true);
  
  // Set up mounting/unmounting ref for avoiding memory leaks
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Auto-save when an image is generated with error handling
  const handleImageGenerated = (imageData, metadata, id) => {
    try {
      // Only proceed if component is still mounted
      if (!isMounted.current) return;
      
      // Set the generated image in the workspace context
      setGeneratedImage(imageData, metadata, id);
      
      // Create an auto-save version with timestamp
      const autoSaveName = `Generated ${new Date().toLocaleTimeString()}`;
      saveCurrentState(autoSaveName);
      
      // Single success message
      toast.success('Image generated and saved successfully');
    } catch (error) {
      if (!isMounted.current) return;
      
      // Use our error handling utility instead
      handleError(
        error,
        'Failed to process generated image',
        () => {
          // Fallback: still try to set the image
          try {
            setGeneratedImage(imageData, metadata, id);
          } catch (innerError) {
            console.error('Also failed to set image:', innerError);
          }
        }
      );
    }
  };
  
  // Setup effect to synchronize settings from context to component
  useEffect(() => {
    if (!initialized && generationSettings && isMounted.current) {
      setInitialized(true);
    }
  }, [generationSettings, initialized]);
  
  if (!currentImages.uploaded) {
    return null;
  }
  
  // Pass hidePreview to FashionModelPreview
  return (
    <FashionModelPreview
      clothingImage={currentImages.uploaded}
      onImageGenerated={handleImageGenerated}
      hidePreview={true} // Tell the component to hide the preview image
    />
  );
}

export default FashionModelPreviewWrapper;
