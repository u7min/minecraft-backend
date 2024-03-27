import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RootContext } from '../context/root-context';
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootContext.Provider value={undefined}>
      <SWRConfig
        value={{ fetcher: (url: string) => fetch(url).then((response) => response.json()) }}
      >
        <div className="bg-black">
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </RootContext.Provider>
  );
}

export default MyApp;
