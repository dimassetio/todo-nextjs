import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import '@/styles/globals.css'; // Your global CSS file

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && router.pathname !== '/sign-in' && router.pathname !== '/sign-up') {
        router.push('/sign-in'); // Redirect to login page if user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;