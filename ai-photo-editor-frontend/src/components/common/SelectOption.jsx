import React from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced select component with description support
 */
function SelectOption({ 
  id, 
  value, 
  onChange, 
  options, 
  disabled = false,
  className = '',
  label,
  required = false
}) {
  return (
    <div className="select-option-component">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Display the description of the selected option if available */}
      {options.find(o => o.value === value)?.description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {options.find(o => o.value === value)?.description}
        </p>
      )}
    </div>
  );
}

SelectOption.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool
};

export default SelectOption;
