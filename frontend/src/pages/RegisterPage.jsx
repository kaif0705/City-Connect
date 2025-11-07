import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import { useNotification } from "../context/NotificationContext"; // 1. Import the notification hook

// Import MUI components
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // We'll auto-login the user after they register
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // 2. Get the notification function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call the register API service
      const data = await registerUser({ username, email, password });

      // 2. On success, call login() to auto-login the new user
      login(data.token, { username: data.username, role: data.role });

      // 3. Show success notification and redirect
      showNotification("Registration successful! Welcome!", "success");
      navigate("/");
    } catch (apiError) {
      console.error("Registration failed:", apiError);

      // 4. Use the notification hook to show the error
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Registration failed. Please check your network and try again.";

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: "0 3px 10px rgb(0 0 0 / 0.1)",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* We no longer need the <Alert> component here, 
              as the Snackbar will handle all errors. */}

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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="new-password"
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
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Box textAlign="center">
            <Link to="/login" style={{ textDecoration: "none" }}>
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
