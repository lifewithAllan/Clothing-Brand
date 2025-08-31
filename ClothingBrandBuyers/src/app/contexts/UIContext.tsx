import React, { createContext, useContext, useState } from 'react';

type UIContextType = {
  loginOpen: boolean;
  signupOpen: boolean;
  forgotOpen: boolean;
  menuOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  openForgot: () => void;
  closeAllModals: () => void;
  toggleMenu: (open?: boolean) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openLogin = () => { setSignupOpen(false); setForgotOpen(false); setLoginOpen(true); };
  const openSignup = () => { setLoginOpen(false); setForgotOpen(false); setSignupOpen(true); };
  const openForgot = () => { setLoginOpen(false); setSignupOpen(false); setForgotOpen(true); };

  const closeAllModals = () => { setLoginOpen(false); setSignupOpen(false); setForgotOpen(false); };
  const toggleMenu = (open?: boolean) => setMenuOpen(o => typeof open === 'boolean' ? open : !o);

  return (
    <UIContext.Provider value={{ loginOpen, signupOpen, forgotOpen, menuOpen, openLogin, openSignup, openForgot, closeAllModals, toggleMenu }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
};
