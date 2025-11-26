import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './auth/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
