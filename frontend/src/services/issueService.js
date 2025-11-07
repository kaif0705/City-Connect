// 1. Import the central 'api' instance we just created.
import api from './api';

/**
 * --- Slice 1: Create an Issue ---
 * Calls the POST /api/v1/issues endpoint.
 * @param {object} issueData - The issue data (title, description, etc.)
 * @returns {Promise<object>} - The newly created issue object from the backend.
 */
export const createIssue = async (issueData) => {
  try {
    // We send the 'issueData' as the JSON body of the request.
    const response = await api.post('/issues', issueData);
    return response.data;
  } catch (error) {
    // Pass the error to the component to handle
    throw error.response.data || error;
  }
};

/**
 * --- Slice 2: Get All Issues (for Admin) ---
 * Calls the GET /api/v1/admin/issues endpoint.
 * @returns {Promise<Array>} - An array of all issue objects.
 */
export const getAllIssues = async () => {
  try {
    const response = await api.get('/admin/issues');
    return response.data;
  } catch (error) {
    throw error.response.data || error;
  }
};

/**
 * --- Slice 3: Update Issue Status (for Admin) ---
 * Calls the PUT /api/v1/admin/issues/{id}/status endpoint.
 * @param {number} id - The ID of the issue to update.
 * @param {string} newStatus - The new status string (e.g., "IN_PROGRESS").
 * @returns {Promise<object>} - The updated issue object.
 */
export const updateIssueStatus = async (id, newStatus) => {
  try {
    // Our backend expects a JSON body like: { "status": "IN_PROGRESS" }
    const response = await api.put(`/admin/issues/${id}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    throw error.response.data || error;
  }
};

/**
 * --- Slice 3 (Delete): Delete an Issue (for Admin) ---
 * Calls the DELETE /api/v1/admin/issues/{id} endpoint.
 * @param {number} id - The ID of the issue to delete.
 * @returns {Promise<void>} - No return data on success.
 */
export const deleteIssue = async (id) => {
  try {
    // A DELETE request does not need a body.
    await api.delete(`/admin/issues/${id}`);
    // A 204 No Content response has no data, so we return nothing.
  } catch (error) {
    throw error.response.data || error;
  }
};

/**
 *  Get User Issues (for Citizen) ---
 * Calls the GET /api/v1/issues/my endpoint.
 * @returns {Promise<Array>} - An array of the user's own issue objects.
 */
export const getMyIssues = async () => {
  // The auth token is automatically added by the interceptor in api.js
  const response = await api.get('/issues/my');
  return response.data;
};