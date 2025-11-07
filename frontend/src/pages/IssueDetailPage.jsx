import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 1. Hook to get ID from URL
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { getIssueById } from "../services/issueService";
import { getCommentsForIssue, postComment } from "../services/commentService";

// Import MUI Components
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  CardMedia,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
} from "@mui/material";

// We need this to build the full image URL
const BACKEND_URL = "http://localhost:8080";

function IssueDetailPage() {
  const { id } = useParams(); // Get the issue ID from the URL
  const { user } = useAuth(); // Get current user to check for Admin role
  const { showNotification } = useNotification();

  // State for our data
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new comment form
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // 2. useEffect to fetch all data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Promise.all to fetch issue details and comments in parallel
        const [issueData, commentsData] = await Promise.all([
          getIssueById(id),
          getCommentsForIssue(id),
        ]);

        setIssue(issueData);
        setComments(commentsData);
      } catch (apiError) {
        console.error("Failed to load issue details:", apiError);
        const errorMessage =
          apiError.message || "Could not load issue details.";
        setError(errorMessage);
        showNotification(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showNotification]); // Re-run if the ID in the URL changes

  // 5. Handler for submitting the new comment form (for Admins)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showNotification("Comment cannot be empty.", "warning");
      return;
    }

    setCommentLoading(true);
    try {
      // Call the API to post the new comment
      const postedComment = await postComment(id, newComment);

      // Add the new comment to our local state to update the UI instantly
      setComments((prevComments) => [...prevComments, postedComment]);

      setNewComment(""); // Clear the form
      showNotification("Comment posted successfully!", "success");
    } catch (apiError) {
      console.error("Failed to post comment:", apiError);
      showNotification(apiError.message, "error");
    } finally {
      setCommentLoading(false);
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

  if (!issue) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Issue not found.
      </Alert>
    );
  }

  // 3. Render the issue details
  return (
    <Container maxWidth="md">
      {/* --- Issue Details Section --- */}
      <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h4" component="h1">
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
          />
        </Box>
        <Typography color="text.secondary" gutterBottom>
          Reported by: {issue.submittedByUsername} on{" "}
          {new Date(issue.createdAt).toLocaleString()}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Category: {issue.category}
        </Typography>

        {issue.imageUrl && (
          <CardMedia
            component="img"
            image={`${BACKEND_URL}${issue.imageUrl}`}
            alt={issue.title}
            sx={{
              height: 400,
              width: "100%",
              objectFit: "contain",
              mt: 2,
              mb: 2,
              borderRadius: 1,
              backgroundColor: "#f5f5f5",
            }}
          />
        )}

        <Typography variant="body1" sx={{ mt: 2 }}>
          {issue.description}
        </Typography>
      </Paper>

      {/* --- Comments Section --- */}
      <Typography variant="h5" component="h2" gutterBottom>
        Comments
      </Typography>

      {/* 5. Show "Add Comment" form ONLY if user is an Admin */}
      {user?.role === "ROLE_ADMIN" && (
        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <TextField
            label="Write a new comment..."
            multiline
            rows={3}
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={commentLoading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={commentLoading}
            sx={{ alignSelf: "flex-end" }}
          >
            {commentLoading ? <CircularProgress size={24} /> : "Post Comment"}
          </Button>
        </Box>
      )}

      {/* 4. Map over the comments and display them */}
      <Paper elevation={2} sx={{ padding: 2, backgroundColor: "#f9f9f9" }}>
        {comments.length === 0 ? (
          <Typography color="text.secondary">
            No comments on this issue yet.
          </Typography>
        ) : (
          <List>
            {comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{comment.username.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.username}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.content}
                        </Typography>
                        {new Date(comment.createdAt).toLocaleString()}
                      </>
                    }
                  />
                </ListItem>
                {/* Add a divider between comments, but not after the last one */}
                {index < comments.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default IssueDetailPage;
