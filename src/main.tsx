import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New Lanka Transit version available.');
  },
  onOfflineReady() {
    console.log('Lanka Transit is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

