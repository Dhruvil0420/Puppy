import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#2B1810',
                  color: '#FAF7F2',
                  border: '1px solid rgba(224, 122, 95, 0.25)',
                  borderRadius: '1.25rem',
                  padding: '12px 18px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  boxShadow: '0 10px 30px -10px rgba(43, 24, 16, 0.3)',
                },
                success: {
                  iconTheme: {
                    primary: '#E07A5F',
                    secondary: '#FAF7F2',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#DC2626',
                    secondary: '#FAF7F2',
                  },
                },
              }}
            />
            <AppRoutes />
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
