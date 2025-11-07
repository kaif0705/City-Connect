import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Alert } from '@mui/material';

/**
 * This is a stricter "guard" for admin-only routes.
 * It checks two things:
 * 1. Is the user authenticated?
 * 2. Is the user's role 'ROLE_ADMIN'?
 * * If both are true, it renders the page.
 * If not, it redirects to /login (if not logged in) or shows a
 * "Forbidden" message (if logged in but not an admin).
 */
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // 1. Not logged in at all
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ROLE_ADMIN') {
    // 2. Logged in, but NOT an admin
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">
          <Typography variant="h5">Access Denied</Typography>
          <Typography>
            You do not have permission to view this page.
          </Typography>
        </Alert>
      </Container>
    );
  }

  // 3. User is authenticated AND is an admin
  return children;
}

export default AdminRoute;