import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

const AuthForm = dynamic(() => import('../components/AuthForm'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function AuthPage() {
  return (
    <>
      <Navbar />
      <AuthForm />
    </>
  );
}
