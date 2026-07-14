import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from '@/app/providers';
import App from '@/app/App';
import { attachApiInterceptors } from '@/services/api/interceptors';

import '@/index.css';

attachApiInterceptors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
