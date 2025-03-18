import React, { useState, useEffect } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import toast from 'react-hot-toast';

/**
 * Control panel showing context-specific supplementary information
 * This contains supportive content, not the main interface elements
 */
function ControlPanel() {
  const { 
    currentMode, 
    currentImages, 
    generatedImageMetadata,
    updateGenerationSettings
  } = useWorkspaceContext();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Templates for quick generation presets
  const generationTemplates = [
    {
      name: "Casual Outdoor",
      settings: {
        background: 'outdoor-nature',
        pose: 'natural',
        cameraAngle: 'eye-level',
        lens: 'standard'
      }
    },
    {
      name: "Studio Professional",
      settings: {
        background: 'studio-white',
        pose: 'professional',
        cameraAngle: 'three-quarter',
        lens: 'portrait'
      }
    },
    {
      name: "Urban Style",
      settings: {
        background: 'outdoor-urban',
        pose: 'editorial',
        cameraAngle: 'low-angle',
        lens: 'wide'
      }
    },
    {
      name: "Formal Event",
      settings: {
        background: 'lifestyle-office',
        pose: 'professional',
        cameraAngle: 'eye-level',
        lens: 'telephoto'
      }
    }
  ];
  
  // Apply template settings
  const applyTemplate = (template) => {
    updateGenerationSettings(template.settings);
    toast.success(`Applied "${template.name}" template`);
  };
  
  // Download generated image
  const downloadImage = (format = 'png') => {
    if (!currentImages.generated) return;
    
    try {
      // Create an image from base64 data
      const img = new Image();
      img.onload = () => {
        // Create a canvas to potentially handle format conversion
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        
        // Set image format and quality
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'png' ? 1.0 : 0.92;
        
        // Get data URL with appropriate format
        link.href = canvas.toDataURL(mimeType, quality);
        
        // Set filename
        link.download = `fashion-model-${Date.now()}.${format}`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Downloaded image as ${format.toUpperCase()}`);
      };
      
      // Start the process by loading the image
      img.src = `data:image/jpeg;base64,${currentImages.generated}`;
      
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
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
          {/* Upload mode - show simplified tips instead of elaborate guidelines */}
          {currentMode === 'upload' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Tips for Best Results
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4 opacity-70 text-center">📸</div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  For the best AI fashion model results:
                </p>
                
                <ul className="space-y-3 text-gray-600 dark:text-gray-400 list-disc pl-5">
                  <li>Use high resolution clothing images</li>
                  <li>Choose items with plain backgrounds</li>
                  <li>Avoid mannequins or models in the photo</li>
                  <li>Use front-facing view of the clothing</li>
                  <li>Remove watermarks or text overlays</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Generate mode - show clothing preview and FUNCTIONAL template presets */}
          {currentMode === 'generate' && currentImages.uploaded && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Clothing Preview
              </h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={`data:image/jpeg;base64,${currentImages.uploaded}`}
                  alt="Uploaded clothing"
                  className="w-full object-contain"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Template Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {generationTemplates.map((template, index) => (
                    <button 
                      key={index}
                      onClick={() => applyTemplate(template)} 
                      className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm 
                                hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300
                                transition-colors duration-150 hover:border-primary-300 dark:hover:border-primary-700"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Edit mode - show metadata and WORKING export options */}
          {currentMode === 'edit' && currentImages.generated && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex justify-between items-center">
                <span>Image Details</span>
                {/* Add collapse toggle on mobile */}
                <button 
                  className="md:hidden text-sm text-gray-500 dark:text-gray-400"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? "Show details" : "Hide details"}
                </button>
              </h2>
              
              {/* Collapsible content */}
              <div className={`space-y-4 ${isCollapsed ? 'hidden md:block' : 'block'}`}>
                {/* Image metadata */}
                <div className="space-y-3">
                  {generatedImageMetadata?.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Model Type:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {generatedImageMetadata.gender.charAt(0).toUpperCase() + generatedImageMetadata.gender.slice(1)}
                      </span>
                    </div>
                  )}
                  
                  {generatedImageMetadata?.background && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Background:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {generatedImageMetadata.background.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                  )}
                  
                  {generatedImageMetadata?.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Created:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {new Date(generatedImageMetadata.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Divider */}
                <hr className="border-gray-200 dark:border-gray-700" />
                
                {/* Export options - with actual functionality */}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Export Options</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => downloadImage('png')} 
                      className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
                    >
                      Download as PNG
                    </button>
                    <button 
                      onClick={() => downloadImage('jpg')} 
                      className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-150"
                    >
                      Download as JPG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ControlPanel;
