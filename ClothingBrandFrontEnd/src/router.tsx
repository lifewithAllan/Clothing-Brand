import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import RequestSignup from './pages/RequestSignup';
import SignupComplete from './pages/SignupComplete';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/signup/request', element: <RequestSignup /> },
  { path: '/signup/complete', element: <SignupComplete /> },
  {
    path: '/app',
    element: <ProtectedRoute />, // gate
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
]);
