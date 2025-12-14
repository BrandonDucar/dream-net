import React from 'react';
import ReactDOM from 'react-dom/client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import App from './App';
import '@coinbase/onchainkit/styles.css';
import './index.css';

const apiKey = import.meta.env.VITE_ONCHAINKIT_API_KEY || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OnchainKitProvider
      apiKey={apiKey}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
        },
        wallet: {
          display: 'modal',
          preference: 'all',
        },
      }}
    >
      <App />
    </OnchainKitProvider>
  </React.StrictMode>
);

