import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import MobileDrawerSidebar from './MobileDrawerSidebar';

/**
 * Mobile drawer component for navigation on smaller screens
 */
function MobileDrawer({ isOpen, onClose }) {
  // Prevent clicks inside the drawer from closing it
  const handleDrawerClick = (e) => {
    e.stopPropagation();
  };
  
  // Add swipe-to-close functionality
  const handleSwipeClose = (_, info) => {
    if (info.offset.x < -50) { // User swiped left more than 50px
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black"
          />
          
          {/* Drawer panel */}
          <motion.div
            className="absolute inset-y-0 left-0 w-64 flex flex-col bg-white dark:bg-gray-800"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={TRANSITIONS.DRAWER_RIGHT}
            onClick={handleDrawerClick}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleSwipeClose}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-medium text-gray-800 dark:text-gray-200">Workspace</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md p-1"
                aria-label="Close navigation menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Use the specialized MobileDrawerSidebar instead of Sidebar */}
            <div className="flex-1 overflow-y-auto">
              <MobileDrawerSidebar />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

MobileDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default MobileDrawer;
