import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import ConfirmDeleteAccountPage from './pages/ConfirmDeleteAccountPage/ConfirmDeleteAccountPage';
import AboutPage from './pages/AboutPage/AboutPage';
import CompleteSignup from './app/CompleteSignup';
//import ContactPage from './pages/ContactPage/ContactPage';
//import SponsorsPage from './pages/SponsorsPage/SponsorsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { useAuth } from './app/contexts/AuthContext';

const Router: React.FC = () => {
  // We'll not block product listing for non-auth users; but for pages that need buyer auth you can
  // wrap with a RequireAuth component — omitted here for brevity
  const router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/products', element: <ProductsPage /> },
    { path: '/products/:id', element: <ProductDetailsPage /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/checkout', element: <CheckoutPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },
    { path: '/confirm-delete-account', element: <ConfirmDeleteAccountPage /> },
    { path: '/signup/complete', element: <CompleteSignup /> },
    { path: '/about', element: <AboutPage /> },
    /*{ path: '/contact', element: <ContactPage /> },
    { path: '/sponsors', element: <SponsorsPage /> },*/
    { path: '*', element: <NotFoundPage /> },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
