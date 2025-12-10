import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PartnerIndex() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (session) {
      router.replace('/partner/dashboard');
    } else {
      router.replace('/partner/login');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666666',
      fontSize: 14,
    }}>
      Loading...
    </div>
  );
}
