import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // We'll auto-login the user after they register
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Call the register API service
      const data = await registerUser({ username, email, password });

      // 2. On success, call login() to auto-login the new user
      // Our backend sends back { token, username, role }
      login(data.token, { username: data.username, role: data.role });

      // 3. Redirect to the homepage
      navigate("/");
    } catch (apiError) {
      console.error("Registration failed:", apiError);

      // --- THIS IS THE FIX ---
      // Check if the error has a response and a data message from our backend
      if (
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
      ) {
        // This is a clean error from our Spring Boot GlobalExceptionHandler
        // (e.g., "Username is already taken: ...")
        setError(apiError.response.data.message);
      } else {
        // This is a generic network error (e.g., backend is not running)
        // or the bug we saw earlier.
        setError(
          "Registration failed. Please check your network and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {" "}
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
        {" "}
        <Typography component="h1" variant="h5">
          {" "}
          Sign Up{" "}
        </Typography>{" "}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Show the error in an Alert component */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
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
