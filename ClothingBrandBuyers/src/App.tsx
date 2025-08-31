import React from 'react';
import Router from './routes';
import { AuthProvider } from './app/contexts/AuthContext';
import { CartProvider } from './app/contexts/CartContext';
import { UIProvider } from './app/contexts/UIContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <UIProvider>
          <Router />
        </UIProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
