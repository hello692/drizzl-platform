import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AccountIndex() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (session) {
      router.replace('/account/dashboard');
    } else {
      router.replace('/account/login');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#00FF85',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
