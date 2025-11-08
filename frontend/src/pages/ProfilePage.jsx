import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../services/userService';

// Import MUI Components
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Button,
  Divider
} from '@mui/material';

function ProfilePage() {
  const { user, updateUser, logout } = useAuth(); // Get user and helpers from AuthContext
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState(''); // For the controlled email input
  const [loading, setLoading] = useState(true); // For the initial page load
  const [updateLoading, setUpdateLoading] = useState(false); // For the "Save" button
  const [deleteLoading, setDeleteLoading] = useState(false); // For the "Delete" button

  // 1. Data Fetching: Load the user's profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        // Pre-fill the form with the user's current email
        setEmail(data.email);
      } catch (apiError) {
        showNotification(apiError.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showNotification]); // Run once on load

  // 2. Handler for the "Save Changes" button
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      // Call the API
      const updatedProfile = await updateUserProfile({ email });

      // Update the global AuthContext
      updateUser(updatedProfile);

      // Show success
      showNotification("Profile updated successfully!", "success");

    } catch (apiError) {
      console.error("Profile update failed:", apiError);
      showNotification(apiError.message, 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  // 3. Handler for the "Delete Account" button
  const handleDeleteAccount = async () => {
    // Show a confirmation dialog
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is permanent and cannot be undone."
      )
    ) {
      return; // Do nothing if they click "Cancel"
    }

    setDeleteLoading(true);
    try {
      // Call the API
      await deleteUserProfile();

      // Show success and log the user out
      showNotification("Your account has been successfully deleted.", "info");
      logout(); // This will clear state and redirect to /login

    } catch (apiError) {
      console.error("Account deletion failed:", apiError);
      showNotification(apiError.message, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- Render Logic ---

  // Helper style for our translucent cards
  const translucentBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
    borderRadius: '12px',
    padding: 3,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
        My Profile
      </Typography>

      {/* --- Card 1: Edit Profile --- */}
      <Paper 
        component="form" 
        onSubmit={handleUpdateSubmit} 
        elevation={3} 
        sx={{ ...translucentBoxStyle, mb: 4 }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Profile
        </Typography>
        
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          value={user?.username || ''} // Get username from AuthContext
          disabled // Username cannot be changed
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email} // Use our state-controlled email
          onChange={(e) => setEmail(e.target.value)}
          disabled={updateLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={updateLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {updateLoading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Paper>

      {/* --- Card 2: Danger Zone --- */}
      <Paper 
        elevation={3} 
        sx={{ 
          ...translucentBoxStyle, 
          borderColor: 'error.main', // Red border
          borderWidth: 1, 
          borderStyle: 'solid' 
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Deleting your account is permanent. All your submitted issues, comments, 
          and uploaded files will be removed forever.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="error"
          disabled={deleteLoading}
          onClick={handleDeleteAccount}
        >
          {deleteLoading ? <CircularProgress size={24} /> : "Delete My Account"}
        </Button>
      </Paper>
    </Container>
  );
}

export default ProfilePage;