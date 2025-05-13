import { useEffect } from 'react';
import { initCoralogix } from 'init-cx';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initCoralogix();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
