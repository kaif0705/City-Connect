import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNotification } from "../context/NotificationContext"; // 1. Import the notification hook

// Import MUI components
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // 2. Get the notification function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call the login API service
      const data = await loginUser({ username, password });

      // 2. On success, call login() from our AuthContext
      login(data.token, { username: data.username, role: data.role });

      // 3. Show success notification and redirect
      showNotification("Login successful! Welcome back.", "success");
      navigate("/"); // Redirect to homepage
    } catch (apiError) {
      console.error("Login failed:", apiError);

      // 4. Use the notification hook to show the error
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Login failed. Please check your network and try again.";

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          padding: 4, 
          marginTop: 8,
          // --- ADD THESE LINES FOR TRANSLUCENCY ---
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with 70% opacity
          backdropFilter: 'blur(5px)', // Blurs the background behind the card
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Optional: nicer shadow
          borderRadius: '12px'  
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* We no longer need the <Alert> component here */}

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Box textAlign="center">
            <Link to="/register" style={{ textDecoration: "none" }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
