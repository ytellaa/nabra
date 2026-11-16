import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { isNative } from './lib/platform';

// Le code a bien démarré : désactive l'écran « Mise à jour nécessaire » d'index.html.
(window as Window & { __nabraReady?: boolean }).__nabraReady = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// PWA : fonctionnement hors ligne (pas de service worker dans l'appli native).
if (!isNative && 'serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
