import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import Modal from './Modal';
import Button from './Button';
import toast from 'react-hot-toast';
import { generateId } from '../../utils/idHelpers';
import { handleError } from '../../utils/errorHandling';

/**
 * Standardized save version button with modal
 */
function SaveVersionButton({ className, buttonText = "Save Version", icon = "💾", buttonSize = "default", variant = "primary-light" }) {
  const { saveCurrentState } = useWorkspaceContext();
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  
  const versionNameId = generateId('SaveVersionButton', 'versionName');

  const handleSaveVersion = () => {
    try {
      saveCurrentState(versionName);
      setSaveModalOpen(false);
      setVersionName('');
      toast.success('Version saved successfully');
    } catch (error) {
      handleError(error, 'Failed to save version');
    }
  };
  
  // Button styling variants
  const variantStyles = {
    'primary': "bg-primary-600 hover:bg-primary-700 text-white",
    'primary-light': "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-800/40",
    'secondary': "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
  };
  
  // Button sizing classes
  const sizeClasses = {
    small: "p-1 text-sm",
    default: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base"
  };
  
  const buttonSizeClass = sizeClasses[buttonSize] || sizeClasses.default;
  const variantClass = variantStyles[variant] || variantStyles['primary-light'];

  return (
    <>
      <button 
        onClick={() => setSaveModalOpen(true)}
        className={className || `${buttonSizeClass} ${variantClass} rounded-md flex items-center`}
        aria-label="Save version"
      >
        {icon && <span className="mr-1">{icon}</span>}
        {buttonText}
      </button>
      
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
            <Button 
              variant="secondary"
              size="md"
              onClick={() => setSaveModalOpen(false)} 
            >
              Cancel
            </Button>
            
            <Button 
              variant="primary"
              size="md"
              onClick={handleSaveVersion}
            >
              Save Version
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

SaveVersionButton.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  buttonSize: PropTypes.oneOf(['small', 'default', 'large']),
  variant: PropTypes.oneOf(['primary', 'primary-light', 'secondary'])
};

export default SaveVersionButton;
