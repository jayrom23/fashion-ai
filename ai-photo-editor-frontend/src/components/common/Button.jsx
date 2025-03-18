import React from 'react';
import PropTypes from 'prop-types';

/**
 * Standardized button component with consistent styling
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-primary-300 dark:disabled:bg-primary-800',
    secondary: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 disabled:text-gray-400',
    link: 'bg-transparent text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 disabled:text-primary-300 dark:disabled:text-primary-700',
    success: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300',
  };
  
  // Icon spacing
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
  
  // Compile classes
  const buttonClasses = [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth ? 'w-full' : '',
    disabled ? 'cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className={iconSpacing}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={iconSpacing}>{icon}</span>}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'link', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string
};

export default Button;
