import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/command-center');
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
        color: '#666666',
        fontSize: 14,
      }}>
        Redirecting to Command Center...
      </div>
    </div>
  );
}
