import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import ImageUploader from '../ImageUploader';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { generateId } from '../../utils/idHelpers';
import { handleError } from '../../utils/errorHandling';

/**
 * The main canvas area for displaying and interacting with images
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
  
  // Refs for handling interactions
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);
  
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
            
            {/* Save button - opens modal instead of prompt */}
            <ToolbarButton 
              icon="💾"
              label="Save"
              onClick={() => setSaveModalOpen(true)}
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
            {currentMode === 'upload' && (
              <div className="h-full flex items-center justify-center">
                <div className="max-w-lg w-full p-8">
                  <ImageUploader onImageUploaded={handleImageUploaded} />
                </div>
              </div>
            )}
            
            {currentMode === 'generate' && currentImages.uploaded && (
              <div className="flex items-center justify-center h-full">
                <div className="relative max-h-full max-w-full p-4">
                  <img 
                    src={`data:image/jpeg;base64,${currentImages.uploaded}`}
                    alt="Uploaded clothing"
                    className="max-h-[80vh] max-w-full object-contain border dark:border-gray-700 shadow-md"
                  />
                </div>
              </div>
            )}
            
            {currentMode === 'edit' && isComparing && currentImages.uploaded && currentImages.generated && (
              <div className="flex items-center justify-center h-full">
                <div className="relative max-h-full max-w-full">
                  {/* Image comparison slider */}
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
            
            {currentMode === 'edit' && !isComparing && currentImages.generated && (
              <div className="flex items-center justify-center h-full">
                <div className="relative max-h-full max-w-full p-4">
                  <img 
                    src={`data:image/jpeg;base64,${currentImages.generated}`}
                    alt="Generated fashion model"
                    className="max-h-[80vh] max-w-full object-contain border dark:border-gray-700 shadow-md"
                  />
                </div>
              </div>
            )}
            
            {!currentImages.uploaded && !currentImages.generated && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-xl mb-2">No images yet</p>
                  <p className="text-sm">Upload a clothing image to get started</p>
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
