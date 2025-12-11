import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SalesIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sales/dashboard');
  }, [router]);

  return null;
}
