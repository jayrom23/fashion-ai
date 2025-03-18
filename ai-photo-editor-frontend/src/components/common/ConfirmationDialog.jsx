import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from './Button';

/**
 * Reusable confirmation dialog component
 */
function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  size = "sm"
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.node.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.oneOf(['danger', 'primary', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full'])
};

export default ConfirmationDialog;
