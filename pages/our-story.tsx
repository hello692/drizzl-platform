import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OurStory() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/about');
  }, [router]);

  return null;
}
