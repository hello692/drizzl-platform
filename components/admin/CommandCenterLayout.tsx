import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CommandCenterSidebar from './CommandCenterSidebar';

interface CommandCenterLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CommandCenterLayout({ children, title }: CommandCenterLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} | DRIZZL Command Center` : 'DRIZZL Command Center'}</title>
      </Head>

      <div style={styles.container}>
        <CommandCenterSidebar isOpen={sidebarOpen || !isMobile} onToggle={toggleSidebar} />
        
        <main style={{
          ...styles.main,
          marginLeft: isMobile ? 0 : 240,
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
    transition: 'margin-left 0.3s ease',
  },
};
