import React from 'react';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- Import all our pages ---
import SubmitPage from './pages/SubmitPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Import our GUARDS ---
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// --- Import MUI Components ---
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      
      {/* --- The "Smart" MUI Navigation Bar --- */}
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            CityConnect
          </Typography>

          {isAuthenticated ? (
            // --- User is Logged In ---
            <Box>
              <Button component={RouterLink} to="/" color="inherit">
                Report an Issue
              </Button>
              
              {user?.role === 'ROLE_ADMIN' && (
                <Button component={RouterLink} to="/admin" color="inherit">
                  Admin Dashboard
                </Button>
              )}
              
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user?.username})
              </Button>
            </Box>
          ) : (
            // --- User is Logged Out ---
            <Box>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/register" color="inherit">
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {/* --- The Page Content Area --- */}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* --- 1. Public Routes --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- 2. Protected Routes (for any logged-in user) --- */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SubmitPage />
              </ProtectedRoute>
            } 
          />
          
          {/* --- 3. Admin-Only Route --- */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } 
          />
        </Routes>
      </Container>
      
    </div>
  ); // End of return
} // End of App function

export default App;