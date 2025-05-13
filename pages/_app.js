import { useEffect } from 'react';
import { initCoralogix } from '../lib/init-cx';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initCoralogix();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
