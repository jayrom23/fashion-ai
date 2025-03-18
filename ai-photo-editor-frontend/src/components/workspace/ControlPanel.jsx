import React from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import FashionModelPreviewWrapper from '../wrapper/FashionModelPreviewWrapper'; // Use wrapper instead
import GeneratedImageView from '../GeneratedImageView'; // Reuse existing component
import ImageUploader from '../ImageUploader'; // Reuse existing component
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';

/**
 * Control panel showing context-specific controls based on the current workspace mode
 */
function ControlPanel() {
  const { 
    currentMode, 
    currentImages, 
    generatedImageMetadata,
    imageId,
    setUploadedImage
  } = useWorkspaceContext();
  
  // Handle image upload
  const handleImageUploaded = (imageData) => {
    setUploadedImage(imageData);
  };
  
  return (
    <div className="control-panel h-full overflow-y-auto">
      {/* Content with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMode}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={TRANSITIONS.PANEL}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {/* Mode-specific content */}
          {currentMode === 'upload' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Upload Your Clothing Image
              </h2>
              <ImageUploader onImageUploaded={handleImageUploaded} />
            </div>
          )}
          
          {currentMode === 'generate' && currentImages.uploaded && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Generate a Fashion Model
              </h2>
              <FashionModelPreviewWrapper />
            </div>
          )}
          
          {currentMode === 'edit' && currentImages.generated && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Your Fashion Model Image
              </h2>
              <GeneratedImageView 
                image={currentImages.generated}
                metadata={generatedImageMetadata}
                imageId={imageId}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ControlPanel;
