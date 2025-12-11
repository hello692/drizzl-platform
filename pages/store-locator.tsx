import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreLocator() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/locations');
  }, [router]);

  return null;
}
