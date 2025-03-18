import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import InfoBox from '../common/InfoBox';
import { CARD_STYLES, BUTTON_VARIANTS } from '../../styles/constants';

/**
 * AdvancedTabPanel component for prompt editing
 * @param {string} customPrompt - Custom prompt text
 * @param {boolean} isUsingCustomPrompt - Whether using custom prompt
 * @param {function} setCustomPrompt - Function to update custom prompt
 * @param {function} setIsUsingCustomPrompt - Function to update isUsingCustomPrompt state
 * @param {function} buildEnhancedPrompt - Function to build default prompt
 */
function AdvancedTabPanel({ 
  customPrompt, 
  isUsingCustomPrompt, 
  setCustomPrompt, 
  setIsUsingCustomPrompt,
  buildEnhancedPrompt
}) {
  // Get the auto-generated prompt for preview
  const generatedPrompt = buildEnhancedPrompt();
  
  return (
    <div className="space-y-4">
      {/* Toggle for custom vs. auto prompt */}
      <div className="flex items-center mb-2">
        <div className="flex items-center mr-6">
          <input
            id="auto-prompt"
            type="radio"
            name="prompt-type"
            className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            checked={!isUsingCustomPrompt}
            onChange={() => setIsUsingCustomPrompt(false)}
          />
          <label 
            htmlFor="auto-prompt" 
            className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300" // FIXED: Improved text contrast
          >
            Auto-generated prompt
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="custom-prompt"
            type="radio"
            name="prompt-type"
            className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            checked={isUsingCustomPrompt}
            onChange={() => setIsUsingCustomPrompt(true)}
          />
          <label 
            htmlFor="custom-prompt" 
            className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300" // FIXED: Improved text contrast
          >
            Custom prompt
          </label>
        </div>
      </div>
      
      {/* Prompt editor */}
      <div>
        <label 
          htmlFor="prompt-editor" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" // FIXED: Improved text contrast
        >
          {isUsingCustomPrompt ? 'Edit Prompt' : 'Preview Auto-Generated Prompt'}
        </label>
        <textarea
          id="prompt-editor"
          rows={8}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" // FIXED: Improved text contrast
          value={isUsingCustomPrompt ? customPrompt : generatedPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          readOnly={!isUsingCustomPrompt}
          placeholder={isUsingCustomPrompt ? "Enter your custom prompt..." : ""}
        />
      </div>
      
      {/* Helpful tips */}
      {isUsingCustomPrompt && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Tips for writing prompts:</h4>
          <ul className="list-disc pl-5 text-xs text-blue-700 dark:text-blue-400">
            <li>Be specific about clothing details you want to highlight</li>
            <li>Include "photorealistic" for realistic results</li>
            <li>Specify "professional photography" for higher quality</li>
            <li>Describe the environment and lighting you want</li>
          </ul>
        </div>
      )}
    </div>
  );
}

AdvancedTabPanel.propTypes = {
  customPrompt: PropTypes.string.isRequired,
  isUsingCustomPrompt: PropTypes.bool.isRequired,
  setCustomPrompt: PropTypes.func.isRequired,
  setIsUsingCustomPrompt: PropTypes.func.isRequired,
  buildEnhancedPrompt: PropTypes.func.isRequired
};

export default AdvancedTabPanel;
