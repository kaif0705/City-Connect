import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * This component acts as a "guard" for routes.
 * It checks if the user is authenticated.
 * If yes, it renders the child component (the page).
 * If no, it redirects them to the /login page.
 * * We also add a `loading` state from useAuth (if we had one) or check
 * for the user state being determined, but for simplicity,
 * we just check for `isAuthenticated`.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    // The 'replace' prop is used to replace the current entry in the history 
    // stack instead of adding a new one. This is good practice for logins.
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the page they were trying to access
  return children;
}

export default ProtectedRoute;