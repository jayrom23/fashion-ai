import React, { useState } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import GeneratedImageView from '../GeneratedImageView'; // For metadata display
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';

/**
 * Control panel showing context-specific supplementary information
 * This contains supportive content, not the main interface elements
 */
function ControlPanel() {
  const { 
    currentMode, 
    currentImages, 
    generatedImageMetadata,
    imageId
  } = useWorkspaceContext();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
          
          {/* Generate mode - only show a compact clothing preview and template presets */}
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
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Casual Outdoor
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Studio Professional
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Urban Style
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Formal Event
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Edit mode - show metadata and export options */}
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
                
                {/* Export options */}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Export Options</h3>
                  <div className="space-y-3">
                    <button className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150">
                      Export as PNG
                    </button>
                    <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-150">
                      Export as JPG
                    </button>
                    <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-150">
                      Save to Project
                    </button>
                  </div>
                </div>
                
                {/* Tags section */}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-200">
                      Fashion
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-200">
                      AI Generated
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-200">
                      {generatedImageMetadata?.gender || 'Model'}
                    </span>
                    <button className="px-2 py-1 border border-dashed border-gray-300 dark:border-gray-600 rounded text-sm text-gray-500 dark:text-gray-400">
                      + Add Tag
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
