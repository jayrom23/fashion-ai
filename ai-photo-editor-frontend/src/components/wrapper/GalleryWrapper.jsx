import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import RecentImagesGallery from '../RecentImagesGallery';
import toast from 'react-hot-toast';

/**
 * Wrapper for RecentImagesGallery to handle refreshing
 * Provides a more efficient approach to triggering refreshes
 */
function GalleryWrapper({ onImageSelected, refreshTrigger }) {
  const galleryRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastRefreshTrigger = useRef(refreshTrigger);
  
  // Instead of forcing remount, implement a more efficient refresh mechanism
  useEffect(() => {
    if (refreshTrigger !== lastRefreshTrigger.current) {
      lastRefreshTrigger.current = refreshTrigger;
      
      // If the gallery component has a refresh method, call it
      if (galleryRef.current && typeof galleryRef.current.refresh === 'function') {
        try {
          setIsLoading(true);
          galleryRef.current.refresh();
        } catch (error) {
          console.error('Error refreshing gallery:', error);
          toast.error('Failed to refresh recent images');
        } finally {
          setIsLoading(false);
        }
      } else if (galleryRef.current) {
        // Fallback to manual refresh through re-render
        // This is a more gentle approach than remounting the entire component
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 100);
      }
    }
  }, [refreshTrigger]);

  // Custom error handling for image selection
  const handleImageSelected = (image) => {
    try {
      if (!image) {
        throw new Error('No image selected');
      }
      onImageSelected(image);
    } catch (error) {
      console.error('Error selecting image:', error);
      toast.error('Failed to select image');
    }
  };
  
  return (
    <div className="gallery-wrapper">
      {isLoading && (
        <div className="text-center py-2">
          <div className="inline-block animate-spin h-5 w-5 border-2 border-gray-300 border-t-primary-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Refreshing gallery...</span>
        </div>
      )}
      <RecentImagesGallery
        ref={galleryRef}
        onImageSelected={handleImageSelected}
      />
    </div>
  );
}

GalleryWrapper.propTypes = {
  onImageSelected: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.number
};

export default GalleryWrapper;
