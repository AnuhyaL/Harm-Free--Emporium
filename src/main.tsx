import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* "user" makes every Framer Motion animation honor prefers-reduced-motion. */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </MotionConfig>
    </HelmetProvider>
  </React.StrictMode>,
);
