import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getIssueById } from '../services/issueService';
import { getCommentsForIssue, postComment } from '../services/commentService';

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
  Button
} from '@mui/material';

const BACKEND_URL = 'http://localhost:8080';

function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [issueData, commentsData] = await Promise.all([
          getIssueById(id),
          getCommentsForIssue(id)
        ]);

        setIssue(issueData);
        setComments(commentsData);

      } catch (apiError) {
        console.error("Failed to load issue details:", apiError);
        const errorMessage = apiError.message || "Could not load issue details.";
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showNotification]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showNotification("Comment cannot be empty.", "warning");
      return;
    }

    setCommentLoading(true);
    try {
      const postedComment = await postComment(id, newComment);
      setComments(prevComments => [...prevComments, postedComment]);
      setNewComment('');
      showNotification('Comment posted successfully!', 'success');
    } catch (apiError) {
      console.error("Failed to post comment:", apiError);
      showNotification(apiError.message, 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!issue) {
    return <Alert severity="info" sx={{ mt: 2 }}>Issue not found.</Alert>;
  }

  // --- This is the new style object we will apply ---
  const translucentBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
    borderRadius: '12px'
  };

  return (
    <Container maxWidth="md">
      {/* --- Issue Details Section --- */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          mb: 3, 
          ...translucentBoxStyle // <-- 1. APPLY THE TRANSLUCENT STYLE HERE
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="h1">
            {issue.title}
          </Typography>
          <Chip 
            label={issue.status} 
            color={issue.status === 'RESOLVED' ? 'success' : (issue.status === 'IN_PROGRESS' ? 'warning' : 'default')}
          />
        </Box>
        <Typography color="text.secondary" gutterBottom>
          Reported by: {issue.submittedByUsername} on {new Date(issue.createdAt).toLocaleString()}
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
              width: '100%', 
              objectFit: 'contain', 
              mt: 2, 
              mb: 2, 
              borderRadius: 1, 
              backgroundColor: '#f5f5f5' // Keep the image background solid
            }}
          />
        )}

        <Typography variant="body1" sx={{ mt: 2 }}>
          {issue.description}
        </Typography>
      </Paper>

      {/* --- Comments Section --- */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}> {/* 2. MAKE "COMMENTS" TITLE WHITE */}
        Comments
      </Typography>

      {/* Admin-only comment form */}
      {user?.role === 'ROLE_ADMIN' && (
        <Box 
          component="form" 
          onSubmit={handleCommentSubmit} 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1,
            p: 2, // Add padding to the form
            ...translucentBoxStyle // <-- 3. APPLY STYLE TO THE FORM BOX
          }}
        >
          <TextField
            label="Write a new comment..."
            multiline
            rows={3}
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={commentLoading}
            // Style the text field to look better on a translucent background
            variant="filled" 
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={commentLoading}
            sx={{ alignSelf: 'flex-end' }}
          >
            {commentLoading ? <CircularProgress size={24} /> : "Post Comment"}
          </Button>
        </Box>
      )}

      {/* Comments List */}
      <Paper 
        elevation={2} 
        sx={{ 
          padding: 2, 
          ...translucentBoxStyle // <-- 4. APPLY STYLE TO THE COMMENTS LIST
        }}
      >
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
                          sx={{ display: 'block' }}
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
                {index < comments.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default IssueDetailPage;