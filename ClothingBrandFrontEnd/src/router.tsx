import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import RequestSignup from './pages/RequestSignup';
import SignupComplete from './pages/SignupComplete';
import ProtectedRoute from './components/ProtectedRoute';

// NEW seller pages
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Leagues from './pages/Leagues/Leagues';
import LeagueDetails from './pages/LeagueDetails/LeagueDetails';
import AddProduct from './pages/AddProduct/AddProduct';
import AddLeague from './pages/AddLeague/AddLeague';

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/signup/request', element: <RequestSignup /> },
  { path: '/signup/complete', element: <SignupComplete /> },

  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Dashboard />, // navbar + layout
        children: [
          { index: true, element: <Home /> },
          { path: 'products', element: <Products /> },
          { path: 'products/:id', element: <ProductDetails /> },
          { path: 'leagues', element: <Leagues /> },
          { path: 'leagues/:id', element: <LeagueDetails /> },
          { path: 'add-product', element: <AddProduct /> },
          { path: 'add-league', element: <AddLeague /> },
        ],
      },
    ],
  },
]);
