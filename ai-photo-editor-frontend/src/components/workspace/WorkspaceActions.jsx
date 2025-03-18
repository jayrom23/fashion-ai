import React from 'react';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import SaveVersionButton from '../common/SaveVersionButton';
import Button from '../common/Button';

/**
 * Workspace action buttons component for the header
 */
function WorkspaceActions() {
  const { 
    currentImages, 
    toggleGallery,
    showGallery,
  } = useWorkspaceContext();
  
  const hasContent = currentImages.uploaded || currentImages.generated;
  
  if (!hasContent) {
    return null;
  }
  
  return (
    <div className="workspace-actions flex items-center space-x-2">
      {/* Gallery Toggle Button - Now with enhanced styling since it's the only button */}
      <Button 
        variant="secondary"
        size="md"
        onClick={toggleGallery}
        aria-pressed={showGallery}
        icon={showGallery ? '🔽' : '🔼'}
      >
        {showGallery ? 'Hide Gallery' : 'Show Gallery'}
      </Button>
      
      {/* Save Version Button - unchanged */}
      <SaveVersionButton 
        variant="primary-light"
        buttonText="Save Version"
      />
    </div>
  );
}

export default WorkspaceActions;
