import React from 'react';
import PropTypes from 'prop-types';
import SelectOption from '../common/SelectOption';
import useComponentStyles from '../../hooks/useComponentStyles';

/**
 * BasicsTabPanel component for basic model settings
 * @param {string} gender - Selected gender
 * @param {function} trackChange - Function to track changes to options
 * @param {string} bodySize - Selected body size
 * @param {string} height - Selected height
 * @param {Array} bodySizeOptions - Body size options
 * @param {Array} heightOptions - Height options
 */
function BasicsTabPanel({ 
  gender, 
  trackChange, 
  bodySize, 
  height, 
  bodySizeOptions, 
  heightOptions 
}) {
  const styles = useComponentStyles();
  
  return (
    <div className="space-y-5">
      {/* Gender selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender
        </label>
        <div className="flex space-x-3">
          <button
            className={`flex-1 py-2 px-4 rounded-md border ${
              gender === 'female'
                ? 'bg-primary-100 border-primary-300 text-primary-800 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600/50'
            }`}
            onClick={() => trackChange('gender', 'female')}
          >
            Female
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md border ${
              gender === 'male'
                ? 'bg-primary-100 border-primary-300 text-primary-800 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600/50'
            }`}
            onClick={() => trackChange('gender', 'male')}
          >
            Male
          </button>
        </div>
      </div>

      {/* Body size selection with description */}
      <div>
        <label htmlFor="body-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Body Size
        </label>
        <SelectOption
          id="body-size"
          value={bodySize}
          onChange={(e) => trackChange('bodySize', e.target.value)}
          options={bodySizeOptions}
        />
      </div>

      {/* Height selection with description */}
      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Height
        </label>
        <SelectOption
          id="height"
          value={height}
          onChange={(e) => trackChange('height', e.target.value)}
          options={heightOptions}
        />
      </div>
    </div>
  );
}

BasicsTabPanel.propTypes = {
  gender: PropTypes.string.isRequired,
  trackChange: PropTypes.func.isRequired,
  bodySize: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  bodySizeOptions: PropTypes.array.isRequired,
  heightOptions: PropTypes.array.isRequired
};

export default BasicsTabPanel;
