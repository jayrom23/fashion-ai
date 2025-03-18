import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import ImageUploader from '../ImageUploader';
import FashionModelPreviewWrapper from '../wrapper/FashionModelPreviewWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import SaveVersionButton from '../common/SaveVersionButton';
import Modal from '../common/Modal'; // Add missing Modal import
import toast from 'react-hot-toast';
import { generateId } from '../../utils/idHelpers';
import { handleError } from '../../utils/errorHandling';

/**
 * The main canvas area for displaying and interacting with images
 * Main tasks for each step should be here in the larger space
 */
function WorkspaceCanvas() {
  // Component name for ID generation
  const COMPONENT_NAME = 'WorkspaceCanvas';
  
  const { 
    currentMode,
    currentImages,
    setUploadedImage,
    saveCurrentState
  } = useWorkspaceContext();
  
  // Local state
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50); // 0-100%
  const [isMobile, setIsMobile] = useState(false);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  
  // Refs for handling interactions
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);
  const imageContainerRef = useRef(null);
  
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
    return () => window.removeEventListener('resize', checkMobile);
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
  
  // Handle save version with modal
  const handleSaveVersion = () => {
    try {
      saveCurrentState(versionName);
      setSaveModalOpen(false);
      setVersionName('');
      toast.success('Version saved successfully');
    } catch (error) {
      console.error('Error saving version:', error);
      toast.error('Failed to save version');
    }
  };
  
  // Handle slider interactions with mouse and touch support
  const handleSliderStart = (clientX) => {
    if (!sliderRef.current) return;
    
    isDraggingRef.current = true;
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    
    const updatePosition = (moveClientX) => {
      if (!isDraggingRef.current || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = moveClientX - rect.left;
      const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setComparisonPosition(newPosition);
    };
    
    const handleMove = (e) => {
      // Handle both mouse and touch events
      const moveX = e.clientX !== undefined ? e.clientX : 
                    e.touches && e.touches[0] ? e.touches[0].clientX : null;
      
      if (moveX !== null) {
        updatePosition(moveX);
      }
    };
    
    const handleEnd = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    // Initial position update
    updatePosition(clientX);
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
  
  // Canvas toolbar buttons
  const ToolbarButton = ({ icon, label, active, onClick }) => (
    <button
      className={`p-1.5 rounded-md flex items-center ${
        active 
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
    >
      <span className="mr-1.5">{icon}</span>
      <span className="text-sm">{!isMobile && label}</span>
    </button>
  );
  
  // Generate standardized ID for the version name input
  const versionNameId = generateId(COMPONENT_NAME, 'versionName');
  
  return (
    <div className="workspace-canvas h-full flex flex-col">
      {/* Toolbar */}
      {(currentImages.uploaded || currentImages.generated) && (
        <div className="canvas-toolbar flex items-center p-2 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Display appropriate tools based on current mode */}
          <div className="flex space-x-1">
            {currentMode === 'edit' && currentImages.uploaded && (
              <ToolbarButton 
                icon={isComparing ? "🔍" : "🔀"}
                label={isComparing ? "Normal View" : "Compare"}
                active={isComparing}
                onClick={() => setIsComparing(!isComparing)}
              />
            )}
            
            {/* Replace Save button with SaveVersionButton component */}
            <SaveVersionButton 
              buttonSize="small" 
              buttonText={isMobile ? "" : "Save Version"} 
              icon="💾"
              variant="secondary"
            />
          </div>
        </div>
      )}
      
      {/* Save Version Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Version"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor={versionNameId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Version Name (optional)
            </label>
            <input
              id={versionNameId}
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="Enter a name for this version"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setSaveModalOpen(false)} 
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleSaveVersion}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save Version
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Canvas content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode + (isComparing ? "-comparing" : "")}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={TRANSITIONS.FADE}
            className="h-full"
          >
            {/* Upload Mode: Simplified upload interface without duplicate tips */}
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
            
            {/* Edit Mode: Comparison view remains unchanged */}
            {currentMode === 'edit' && isComparing && currentImages.uploaded && currentImages.generated && (
              <div className="flex items-center justify-center h-full">
                <div className="relative max-h-full max-w-full">
                  {/* Image comparison slider - unchanged */}
                  <div 
                    ref={sliderRef}
                    className="relative border dark:border-gray-700 shadow-md"
                  >
                    {/* Generated image (full width) */}
                    <img 
                      src={`data:image/jpeg;base64,${currentImages.generated}`}
                      alt="Generated fashion model"
                      className="max-h-[80vh] max-w-full object-contain"
                    />
                    
                    {/* Uploaded image (partial width) */}
                    <div 
                      className="absolute top-0 left-0 h-full overflow-hidden"
                      style={{ width: `${comparisonPosition}%` }}
                    >
                      <img 
                        src={`data:image/jpeg;base64,${currentImages.uploaded}`}
                        alt="Uploaded clothing"
                        className="max-h-[80vh] max-w-none object-contain"
                      />
                    </div>
                    
                    {/* Slider handle with mouse and touch support */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                      style={{ left: `${comparisonPosition}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSliderStart(e.clientX);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleSliderStart(e.touches[0].clientX);
                      }}
                      role="slider"
                      aria-valuenow={comparisonPosition}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Comparison slider"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        // Add keyboard support for accessibility
                        if (e.key === 'ArrowLeft') {
                          setComparisonPosition(Math.max(0, comparisonPosition - 5));
                        } else if (e.key === 'ArrowRight') {
                          setComparisonPosition(Math.min(100, comparisonPosition + 5));
                        }
                      }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Edit Mode: Normal view with editing tools */}
            {currentMode === 'edit' && !isComparing && currentImages.generated && (
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
                    ref={imageContainerRef}
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
                
                {/* Add editing tools below the image */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-3">
                    <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                      <span className="mr-1">🎨</span> Adjust Colors
                    </button>
                    <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                      <span className="mr-1">🖼️</span> Background
                    </button>
                    <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                      <span className="mr-1">📷</span> Filters
                    </button>
                    <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                      <span className="mr-1">✨</span> Effects
                    </button>
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
