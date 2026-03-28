import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './assets/styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </HelmetProvider>
  </React.StrictMode>
);
=======
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
