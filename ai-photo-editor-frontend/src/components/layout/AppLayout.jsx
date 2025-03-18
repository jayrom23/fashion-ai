import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useWorkspaceContext } from '../../hooks/useWorkspaceContext';
import Sidebar from './Sidebar';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceContent from './WorkspaceContent';
import Footer from '../Footer';
import MobileDrawer from './MobileDrawer';
import IntegrationStatusBar from '../workspace/IntegrationStatusBar';

/**
 * Main application layout component that provides the structure for the unified workspace
 */
function AppLayout() {
  const { currentImages } = useWorkspaceContext();
  const hasContent = currentImages.uploaded || currentImages.generated;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // For development tracking of integration
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Toaster position="top-center" />
      
      <WorkspaceHeader onMobileMenuClick={() => setMobileDrawerOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only visible on desktop when we have content */}
        {hasContent && (
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 hidden md:block">
            <Sidebar />
          </div>
        )}
        
        {/* Mobile drawer for navigation */}
        {hasContent && (
          <MobileDrawer 
            isOpen={mobileDrawerOpen} 
            onClose={() => setMobileDrawerOpen(false)} 
          />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkspaceContent />
        </div>
      </div>
      
      <Footer />
      
      {/* Integration status bar (visible only in development) */}
      {isDevelopment && <IntegrationStatusBar />}
    </div>
  );
}

export default AppLayout;
