import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Favorites from './pages/Favorites';
import Pricing from './pages/Pricing';
import Locations from './pages/Locations';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import WorkspaceOwnerDashboard from './pages/WorkspaceOwnerDashboard';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import WorkspaceOwnerRoute from './components/WorkspaceOwnerRoute';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    path: '/search',
    element: (
      <ProtectedRoute>
        <Search />
      </ProtectedRoute>
    )
  },
  {
    path: '/spaces/:id',
    element: (
      <ProtectedRoute>
        <Details />
      </ProtectedRoute>
    )
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <Favorites />
      </ProtectedRoute>
    )
  },
  {
    path: '/pricing',
    element: (
      <ProtectedRoute>
        <Pricing />
      </ProtectedRoute>
    )
  },
  {
    path: '/locations',
    element: (
      <ProtectedRoute>
        <Locations />
      </ProtectedRoute>
    )
  },
  {
    path: '/about',
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    )
  },
  {
    path: '/contact',
    element: (
      <ProtectedRoute>
        <Contact />
      </ProtectedRoute>
    )
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/bookings',
    element: (
      <ProtectedRoute>
        <BookingHistory />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    )
  },
  {
    path: '/workspace-owner',
    element: (
      <WorkspaceOwnerRoute>
        <WorkspaceOwnerDashboard />
      </WorkspaceOwnerRoute>
    )
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
