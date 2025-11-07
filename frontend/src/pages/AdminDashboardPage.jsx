import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom"; // 1. Import RouterLink
import {
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
} from "../services/issueService";
import { useNotification } from "../context/NotificationContext";

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
  Link, // 2. Import MUI Link (we'll use it with the router)
} from "@mui/material";

function AdminDashboardPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  // Function to fetch all issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllIssues();
      setIssues(data);
    } catch (apiError) {
      console.error("Failed to fetch issues:", apiError);
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
  }, []);

  // Handler for changing an issue's status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedIssue = await updateIssueStatus(id, newStatus);
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === id ? { ...issue, status: updatedIssue.status } : issue
        )
      );
      showNotification("Issue status updated successfully!", "success");
    } catch (apiError) {
      console.error("Failed to update status:", apiError);
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
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    try {
      await deleteIssue(id);
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
      showNotification("Issue deleted successfully!", "success");
    } catch (apiError) {
      console.error("Failed to delete issue:", apiError);
      const errorMessage =
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
          ? apiError.response.data.message
          : "Failed to delete issue.";
      showNotification(errorMessage, "error");
    }
  };

  // --- Render Logic ---

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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // We need this to build the full image URL
  const BACKEND_URL = "http://localhost:8080";

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

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
                  {/* --- 3. THIS IS THE CHANGE --- */}
                  {/* Make the title a clickable link to the detail page */}
                  <Typography variant="h6" component="h2">
                    <Link
                      component={RouterLink}
                      to={`/issue/${issue.id}`}
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      {issue.title}
                    </Link>
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

                {/* 4. Conditionally render the image if it exists */}
                {issue.imageUrl && (
                  <Box sx={{ mb: 2, maxHeight: 300, overflow: "hidden" }}>
                    <img
                      src={`${BACKEND_URL}${issue.imageUrl}`}
                      alt={issue.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}

                <Typography color="text.secondary" variant="caption">
                  Reported on: {new Date(issue.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pr: 2, pb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150, mr: 1 }}>
                  <InputLabel>Change Status</InputLabel>
                  <Select
                    value={issue.status}
                    label="Change Status"
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                  </Select>
                </FormControl>

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
