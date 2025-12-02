import dynamic from 'next/dynamic';

const AuthPage = dynamic(() => import('../components/AuthForm'), {
  ssr: false,
});

export default AuthPage;
