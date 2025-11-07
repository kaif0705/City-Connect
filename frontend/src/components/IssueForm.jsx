import React, { useState } from "react";
import { createIssue } from "../services/issueService";
import { useNotification } from "../context/NotificationContext"; // 1. Import the notification hook

// Import MUI components for the form
import {
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";

function IssueForm() {
  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole"); // Default category

  // Loading and notification state
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification(); // 2. Get the notification function

  // We will add a file state here in the next phase (Image Upload)
  // const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    const issueData = {
      title,
      description,
      category,
      // Hardcode location for now. We can add a map picker later.
      latitude: 18.5204,
      longitude: 73.8567,
      imageUrl: null, // We will add this in the next phase
    };

    try {
      // 3. Call the createIssue API service
      const response = await createIssue(issueData);

      // 4. Show a success notification
      showNotification(
        `Successfully submitted issue! ID: ${response.id}`,
        "success"
      );

      // 5. Clear the form fields
      setTitle("");
      setDescription("");
      setCategory("Pothole");
      // setFile(null);
    } catch (apiError) {
      // 6. Show an error notification
      console.error("Error submitting issue:", apiError);
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Failed to submit issue. Please try again.";

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // Adds space between form elements
        maxWidth: 500,
        margin: "auto", // Center the form
        padding: 3,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.1)",
      }}
    >
      <Typography variant="h5" component="h2" textAlign="center">
        Report a New Issue
      </Typography>

      <TextField
        label="Title"
        variant="outlined"
        required
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />

      <TextField
        label="Description"
        variant="outlined"
        required
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />

      <TextField
        label="Category"
        variant="outlined"
        required
        fullWidth
        select // This turns the TextField into a dropdown
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={loading}
      >
        <MenuItem value="Pothole">Pothole</MenuItem>
        <MenuItem value="Streetlight Out">Streetlight Out</MenuItem>
        <MenuItem value="Sanitation">Sanitation</MenuItem>
        <MenuItem value="Vandalism">Vandalism</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>

      {/* We will add the File Upload button here in the next phase */}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Submit Issue"
        )}
      </Button>
    </Box>
  );
}

export default IssueForm;