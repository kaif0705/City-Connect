import api from './api'; // Import our central Axios instance

// --- THIS IS THE FIX ---
// The path must be RELATIVE to the baseURL in api.js
// We remove '/api/v1' from here.
const API_PATH = '/issues'; 

/**
 * --- Slice 6, Phase 3: Get All Comments for an Issue ---
 * Calls the GET /api/v1/issues/{issueId}/comments endpoint.
 *
 * @param {number} issueId - The ID of the issue.
 * @returns {Promise<Array>} - An array of comment objects.
 */
export const getCommentsForIssue = async (issueId) => {
  try {
    // This will now correctly call: /api/v1/issues/1/comments
    const response = await api.get(`${API_PATH}/${issueId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    
    // Pass a clean error message to the component
    const errorMessage = (error.response && error.response.data && error.response.data.message)
      ? error.response.data.message
      : "Could not load comments. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * --- Slice 6, Phase 3: Post a New Comment ---
 * Calls the POST /api/v1/issues/{issueId}/comments endpoint.
 *
 * @param {number} issueId - The ID of the issue to comment on.
 * @param {string} content - The text of the comment.
 * @returns {Promise<object>} - The new comment object.
 */
export const postComment = async (issueId, content) => {
  try {
    // This will now correctly call: /api/v1/issues/1/comments
    const response = await api.post(`${API_PATH}/${issueId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error("Failed to post comment:", error);

    // Pass a clean error message to the component
    const errorMessage = (error.response && error.response.data && error.response.data.message)
      ? error.response.data.message
      : "Could not post comment. Please try again.";
    throw new Error(errorMessage);
  }
};