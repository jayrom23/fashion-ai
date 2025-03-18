import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import ImageUploader from '../ImageUploader';
import FashionModelPreviewWrapper from '../wrapper/FashionModelPreviewWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import toast from 'react-hot-toast';
import { handleError } from '../../utils/errorHandling';

/**
 * The main canvas area for displaying and interacting with images
 * Main tasks for each step should be here in the larger space
 */
function WorkspaceCanvas() {
  const { 
    currentMode,
    currentImages,
    setUploadedImage
  } = useWorkspaceContext();
  
  // Track component mounted state for safe async operations
  const isMounted = useRef(true);
  
  // Basic zoom functionality for the result image
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  
  // Check if on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Track window size for responsive adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // MD breakpoint in Tailwind
    };
    
    // Initial check
    checkMobile();
    
    // Add listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Handle image upload with error handling
  const handleImageUploaded = (imageData) => {
    try {
      setUploadedImage(imageData);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };
  
  // Handle pan/drag functionality
  const handlePanStart = () => {
    if (zoomLevel > 1) {
      setIsPanning(true);
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handlePan = (e, info) => {
    if (zoomLevel > 1 && isPanning) {
      setPanPosition(prev => ({
        x: prev.x + info.delta.x,
        y: prev.y + info.delta.y
      }));
    }
  };

  // Handle wheel event for zooming
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  // Reset pan when zoom level changes to 1
  useEffect(() => {
    if (zoomLevel === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);
  
  return (
    <div className="workspace-canvas h-full flex flex-col">
      {/* Canvas content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={TRANSITIONS.FADE}
            className="h-full"
          >
            {/* Upload Mode: Simplified upload interface */}
            {currentMode === 'upload' && (
              <div className="h-full flex items-center justify-center">
                <div className="max-w-lg w-full p-4">
                  <ImageUploader onImageUploaded={handleImageUploaded} />
                </div>
              </div>
            )}
            
            {/* Generate Mode: Show FashionModelPreviewWrapper directly */}
            {currentMode === 'generate' && currentImages.uploaded && (
              <div className="h-full flex flex-col p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Generate a Fashion Model
                </h2>
                <div className="flex-1 overflow-auto">
                  <FashionModelPreviewWrapper />
                </div>
              </div>
            )}
            
            {/* Edit Mode: Simplified view with basic zoom functionality */}
            {currentMode === 'edit' && currentImages.generated && (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center overflow-auto p-4 relative">
                  {/* Add zoom controls */}
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-md shadow-md p-2 flex space-x-2 z-10">
                    <button className="p-1 text-gray-700 dark:text-gray-300" onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}>
                      <span aria-label="Zoom in">➕</span>
                    </button>
                    <button className="p-1 text-gray-700 dark:text-gray-300" onClick={() => setZoomLevel(1)}>
                      <span aria-label="Reset zoom">🔄</span>
                    </button>
                    <button className="p-1 text-gray-700 dark:text-gray-300" onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}>
                      <span aria-label="Zoom out">➖</span>
                    </button>
                  </div>
                  
                  {/* Image with zoom and pan applied */}
                  <div 
                    className="relative max-h-full max-w-full overflow-hidden"
                    onWheel={handleWheel}
                  >
                    <div 
                      className={`transform ${isPanning ? 'cursor-grabbing' : zoomLevel > 1 ? 'cursor-grab' : 'cursor-default'}`}
                      style={{ 
                        transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                        transformOrigin: 'center center',
                        transition: isPanning ? 'none' : 'transform 0.2s' 
                      }}
                      onMouseDown={handlePanStart}
                      onMouseUp={handlePanEnd}
                      onMouseLeave={handlePanEnd}
                      onMouseMove={(e) => zoomLevel > 1 && isPanning && handlePan(e, { delta: { x: e.movementX, y: e.movementY } })}
                    >
                      <img 
                        src={`data:image/jpeg;base64,${currentImages.generated}`}
                        alt="Generated fashion model"
                        className="max-h-[80vh] max-w-full object-contain border dark:border-gray-700 shadow-md"
                        onDoubleClick={() => setZoomLevel(prev => prev === 1 ? 2 : 1)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty state - simplified with no duplicate tips */}
            {!currentImages.uploaded && !currentImages.generated && (
              <div className="flex items-center justify-center h-full text-center">
                <div className="max-w-sm p-6">
                  <div className="text-6xl mb-4 opacity-70">📸</div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">Start a New Project</h3>
                  <button 
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors duration-200 w-full flex items-center justify-center"
                    onClick={() => setCurrentMode('upload')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Clothing Image
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WorkspaceCanvas;
