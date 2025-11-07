// This is a new file
import React, { useState, useEffect } from "react";
import { getMyIssues } from "../services/issueService";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

function MyIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch issues when the component mounts
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyIssues();
        setIssues(data);
      } catch (apiError) {
        console.error("Failed to fetch my issues:", apiError);
        setError(apiError.message || "Could not load your issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []); // Empty array means this runs once on load

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
            <Card key={issue.id} sx={{ mb: 2 }}>
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
                  {/* We can color-code the status chip */}
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
                <Typography color="text.secondary" variant="caption">
                  Reported by: {issue.submittedByUsername} on{" "}
                  {new Date(issue.createdAt).toLocaleDateString()}
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
