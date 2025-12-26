import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SmoothiesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/collections/smoothies');
  }, [router]);

  return (
    <div style={{ 
      background: '#000', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#fff'
    }}>
      <p>Redirecting...</p>
    </div>
  );
}
