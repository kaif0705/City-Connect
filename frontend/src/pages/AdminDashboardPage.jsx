import React, { useState, useEffect } from "react";
import {
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
} from "../services/issueService";

// Import MUI components for a clean UI
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

function AdminDashboardPage() {
  // State for issues, loading, and errors
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchIssues();
  }, []); // The empty array means this runs once on load

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await getAllIssues();
      setIssues(data);
      setError(null);
    } catch (apiError) {
      setError(apiError.message || "Failed to fetch issues.");
    } finally {
      setLoading(false);
    }
  };

  // --- Slice 3: Handle Status Update ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedIssue = await updateIssueStatus(id, newStatus);
      // Update the 'issues' state locally to reflect the change
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === id ? updatedIssue : issue))
      );
    } catch (apiError) {
      alert(`Error updating status: ${apiError.message}`);
    }
  };

  // --- Slice 3: Handle Delete ---
  const handleDelete = async (id) => {
    // Add a confirmation dialog
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    try {
      await deleteIssue(id);
      // Update the 'issues' state locally by filtering out the deleted issue
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
    } catch (apiError) {
      alert(`Error deleting issue: ${apiError.message}`);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 2, mb: 2 }}
      >
        Admin Dashboard
      </Typography>

      {issues.length === 0 ? (
        <Typography>No issues submitted yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {issues.map((issue) => (
            <Paper key={issue.id} elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">
                {issue.title} (ID: {issue.id})
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                {issue.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Category */}
                <Typography variant="body2">
                  <strong>Category:</strong> {issue.category}
                </Typography>
                {/* Reported Date */}
                <Typography variant="body2">
                  <strong>Reported:</strong>{" "}
                  {new Date(issue.createdAt).toLocaleString()}
                </Typography>

                {/* Status Dropdown (Slice 3) */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={issue.status}
                    label="Status"
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                  </Select>
                </FormControl>

                {/* Delete Button (Slice 3) */}
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(issue.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default AdminDashboardPage;
