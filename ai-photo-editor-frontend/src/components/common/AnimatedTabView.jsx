import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';

/**
 * A reusable component for tab views with smooth transitions
 */
function AnimatedTabView({ activeTab, children, transitionDirection = 'horizontal' }) {
  // Choose the appropriate animation based on direction
  const variants = transitionDirection === 'horizontal' 
    ? TRANSITIONS.PANEL 
    : TRANSITIONS.FADE;
  
  return (
    <div className="animated-tab-view">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          className="tab-content"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

AnimatedTabView.propTypes = {
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  transitionDirection: PropTypes.oneOf(['horizontal', 'vertical', 'fade'])
};

AnimatedTabView.defaultProps = {
  transitionDirection: 'horizontal'
};

export default AnimatedTabView;
