import React, { useState, useRef } from "react"; // 1. Import useRef
import { createIssue } from "../services/issueService";
import { uploadFile } from "../services/fileService"; // 2. Import the new file service
import { useNotification } from "../context/NotificationContext";

// Import MUI components
import {
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
  Alert, // We'll use this for file selection feedback
  Icon,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material"; // Import an icon

function IssueForm() {
  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [file, setFile] = useState(null); // 3. Add state for the file
  const fileInputRef = useRef(null); // 4. Add a ref for the file input

  // Loading and notification state
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(""); // For user feedback
  const { showNotification } = useNotification();

  // 5. Handler for when a file is selected
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Optional: Add file size/type validation here
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        showNotification("File is too large! (Max 5MB)", "error");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null; // Reset input
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null; // This will hold the URL from the backend

    try {
      // --- STEP 1: UPLOAD FILE (if one is selected) ---
      if (file) {
        setLoadingText("Uploading image...");
        imageUrl = await uploadFile(file); // Call file service
        showNotification("Image uploaded successfully!", "info");
      }

      // --- STEP 2: SUBMIT ISSUE (with or without image URL) ---
      setLoadingText("Submitting issue...");

      const issueData = {
        title,
        description,
        category,
        imageUrl, // Pass the URL (or null) to the backend
        latitude: 18.5204, // Still hardcoded
        longitude: 73.8567,
      };

      const response = await createIssue(issueData);

      // --- STEP 3: SUCCESS ---
      showNotification(
        `Successfully submitted issue! ID: ${response.id}`,
        "success"
      );

      // Clear the form
      setTitle("");
      setDescription("");
      setCategory("Pothole");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null; // Reset file input
    } catch (apiError) {
      // --- STEP 4: ERROR HANDLING ---
      console.error("Failed to submit issue:", apiError);
      // We use apiError.message because our fileService and issueService throw clean messages
      showNotification(apiError.message || "Failed to submit issue.", "error");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        padding: 4,
        marginTop: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)", // 50% opacity
        backdropFilter: "blur(10px)", // 10px blur
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        margin: "auto",
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
        select
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

      {/* --- 6. NEW FILE INPUT FIELD --- */}
      <Box>
        <Button
          variant="outlined"
          component="label" // This makes the button act as a <label>
          fullWidth
          disabled={loading}
          startIcon={<PhotoCamera />}
        >
          Upload Photo
          {/* The actual, hidden file input */}
          <input
            type="file"
            hidden
            accept="image/*" // Only accept image files
            onChange={handleFileChange}
            ref={fileInputRef} // Link the ref
          />
        </Button>
        {/* Show the name of the selected file */}
        {file && (
          <Alert
            severity="info"
            sx={{
              mt: 1,
              backgroundColor: "rgba(229, 246, 253, 0.4)",
              color: "rgb(1, 67, 97)",
              backdropFilter: "blur(5px)",
            }}
          >
            Selected file: {file.name}
          </Alert>
        )}
      </Box>

      {/* --- 7. UPDATED SUBMIT BUTTON --- */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {/* Show loading spinner or text */}
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Submit Issue"
        )}
      </Button>
      {/* Show loading text (e.g., "Uploading image...") */}
      {loading && (
        <Typography variant="caption" textAlign="center">
          {loadingText}
        </Typography>
      )}
    </Box>
  );
}

export default IssueForm;
