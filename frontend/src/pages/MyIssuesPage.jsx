import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom"; // 1. Import RouterLink
import { getMyIssues } from "../services/issueService";
import { useNotification } from "../context/NotificationContext";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Link, // 2. Import MUI Link
  CardMedia,
} from "@mui/material";

// We need this to build the full image URL
const BACKEND_URL = "http://localhost:8080";

function MyIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyIssues();
        setIssues(data);
      } catch (apiError) {
        console.error("Failed to fetch my issues:", apiError);
        const errorMessage = apiError.message || "Could not load your issues.";
        // Set error for display
        setError(errorMessage);
        // Also show notification for immediate feedback
        showNotification(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
    // We disable the exhaustive-deps rule here because showNotification
    // is stable and we only want this to run once on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        My Submitted Issues
      </Typography>
      {issues.length === 0 ? (
        <Typography>You have not submitted any issues yet.</Typography>
      ) : (
        <Box>
          {issues.map((issue) => (
            <Card
              key={issue.id}
              sx={{
                mb: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                borderRadius: "12px",
              }}
            >
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
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  Category: {issue.category}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {issue.description}
                </Typography>

                {/* 4. Conditionally render the image if it exists */}
                {issue.imageUrl && (
                  <CardMedia
                    component="img"
                    image={`${BACKEND_URL}${issue.imageUrl}`}
                    alt={issue.title}
                    sx={{
                      height: 300,
                      width: "100%",
                      objectFit: "contain",
                      mt: 2,
                      mb: 2,
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                )}

                <Typography color="text.secondary" variant="caption">
                  Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default MyIssuesPage;
