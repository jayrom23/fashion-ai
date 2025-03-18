import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import AppLayout from './components/layout/AppLayout';
import { Toaster, toast } from 'react-hot-toast';

/**
 * Main application component
 * Now serves as a thin wrapper around our new architecture
 */
function App() {
  // Check for required dependencies in a safer way
  useEffect(() => {
    // Check if framer-motion is available by testing AnimatePresence existence
    // This is safer than using require directly
    if (typeof window !== 'undefined') {
      import('framer-motion')
        .then(() => {
          // Success - framer-motion is installed
        })
        .catch(() => {
          console.error('Framer Motion is not installed. Please run: npm install framer-motion');
          toast.error('Missing dependency: Please install framer-motion');
        });
    }
  }, []);

  return (
    <Router>
      <WorkspaceProvider>
        {/* Standardized toast configuration */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            success: {
              duration: 2000,
              style: {
                background: 'var(--color-success-50, #ecfdf5)',
                color: 'var(--color-success-700, #047857)',
                border: '1px solid var(--color-success-200, #a7f3d0)'
              }
            },
            error: {
              duration: 4000,
              style: {
                background: 'var(--color-error-50, #fef2f2)',
                color: 'var(--color-error-700, #b91c1c)',
                border: '1px solid var(--color-error-200, #fecaca)'
              }
            }
          }}
        />
        <AppLayout />
      </WorkspaceProvider>
    </Router>
  );
}

export default App;