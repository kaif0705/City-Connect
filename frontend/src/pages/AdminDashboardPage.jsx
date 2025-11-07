import React, { useState, useEffect } from "react";
import {
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
} from "../services/issueService";
import { useNotification } from "../context/NotificationContext"; // 1. Import notification hook

// Import MUI components
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";

function AdminDashboardPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification(); // 2. Get the notification function

  // Function to fetch all issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllIssues();
      setIssues(data);
    } catch (apiError) {
      console.error("Failed to fetch issues:", apiError);
      // Use the local error state for a persistent error on the page
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Could not load issues. Please try again later.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch issues when the component mounts
  useEffect(() => {
    fetchIssues();
  }, []); // The empty array [] means this runs only once

  // Handler for changing an issue's status
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 1. Call the API
      const updatedIssue = await updateIssueStatus(id, newStatus);

      // 2. Update the local state to match
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === id ? { ...issue, status: updatedIssue.status } : issue
        )
      );

      // 3. Show success notification
      showNotification("Issue status updated successfully!", "success");
    } catch (apiError) {
      console.error("Failed to update status:", apiError);
      // 4. Show error notification
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Failed to update status.";
      showNotification(errorMessage, "error");
    }
  };

  // Handler for deleting an issue
  const handleDelete = async (id) => {
    // Optional: Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    try {
      // 1. Call the API
      await deleteIssue(id);

      // 2. Update local state by filtering out the deleted issue
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));

      // 3. Show success notification
      showNotification("Issue deleted successfully!", "success");
    } catch (apiError) {
      console.error("Failed to delete issue:", apiError);
      // 4. Show error notification
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Failed to delete issue.";
      showNotification(errorMessage, "error");
    }
  };

  // --- 3. Render Logic ---

  // 3a. Show loading spinner while fetching
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 3b. Show persistent error if fetching failed
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* 3c. Show empty state message */}
      {issues.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          sx={{ mt: 5 }}
        >
          No issues found.
        </Typography>
      ) : (
        // 3d. Render the list of issues
        <Box>
          {issues.map((issue) => (
            <Card key={issue.id} sx={{ mb: 2, backgroundColor: "#f9f9f9" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" component="h2">
                    {issue.title}
                  </Typography>
                  <Chip
                    label={issue.status}
                    color={
                      issue.status === "RESOLVED"
                        ? "success"
                        : issue.status === "IN_PROGRESS"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  Category: {issue.category} (Reported by:{" "}
                  {issue.submittedByUsername})
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {issue.description}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  Reported on: {new Date(issue.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pr: 2, pb: 2 }}>
                {/* Status Update Dropdown */}
                <FormControl size="small" sx={{ minWidth: 150, mr: 1 }}>
                  <InputLabel>Change Status</InputLabel>
                  <Select
                    value={issue.status}
                    label="Change Status"
                    // Call handler when a new value is selected
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                  </Select>
                </FormControl>

                {/* Delete Button */}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleDelete(issue.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default AdminDashboardPage;
