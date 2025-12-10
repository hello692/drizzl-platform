import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CommandCenterSidebar from './CommandCenterSidebar';

interface CommandCenterLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CommandCenterLayout({ children, title }: CommandCenterLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 64 : 240);

  return (
    <>
      <Head>
        <title>{title ? `${title} | DRIZZL Command Center` : 'DRIZZL Command Center'}</title>
      </Head>

      <div style={styles.container}>
        <CommandCenterSidebar 
          isOpen={sidebarOpen || !isMobile} 
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          onCollapse={toggleCollapse}
        />
        
        <main style={{
          ...styles.main,
          marginLeft: sidebarWidth,
        }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .command-center-main {
            margin-left: 0 !important;
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
  },
  main: {
    minHeight: '100vh',
    padding: 32,
    backgroundColor: '#000000',
    transition: 'margin-left 0.2s ease',
  },
};
