import React from 'react';
import Router from './routes';
import { AuthProvider, useAuth } from './app/contexts/AuthContext';
import { CartProvider } from './app/contexts/CartContext';
import { UIProvider } from './app/contexts/UIContext';
import styles from './App.module.css';

// A wrapper that waits for auth to finish before showing the rest of the app
const AppInner: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading your session...</p>
      </div>
    );
  }

  return (
    <CartProvider>
      <UIProvider>
        <Router />
      </UIProvider>
    </CartProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
};

export default App;
