import api from "./api"; // Import our central Axios instance

/**
 * --- Slice 1: Create an Issue ---
 * Calls the POST /api/v1/issues endpoint.
 * @param {object} issueData - The issue data (title, description, etc.)
 * @returns {Promise<object>} - The newly created issue object from the backend.
 */
export const createIssue = async (issueData) => {
  try {
    const response = await api.post("/issues", issueData);
    return response.data;
  } catch (error) {
    console.error("Failed to create issue:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Could not create issue. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * --- Slice 2: Get All Issues (for Admin) ---
 * Calls the GET /api/v1/admin/issues endpoint.
 * @returns {Promise<Array>} - An array of all issue objects.
 */
export const getAllIssues = async () => {
  try {
    const response = await api.get("/admin/issues");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all issues:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Could not load issues. Please try again.";
    throw new Error(errorMessage);
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
    const response = await api.put(`/admin/issues/${id}/status`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update status:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Could not update status. Please try again.";
    throw new Error(errorMessage);
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
    await api.delete(`/admin/issues/${id}`);
  } catch (error) {
    console.error("Failed to delete issue:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Could not delete issue. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * --- Slice 5: Get My Issues (for Citizen) ---
 * Calls the GET /api/v1/issues/my endpoint.
 * @returns {Promise<Array>} - An array of the user's own issue objects.
 */
export const getMyIssues = async () => {
  try {
    const response = await api.get("/issues/my");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user's issues:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Could not load your issues. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * --- Slice 6, Phase 3: Get Single Issue Details ---
 * Calls the GET /api/v1/issues/{id} endpoint.
 * @param {number} id - The ID of the issue to fetch.
 * @returns {Promise<object>} - The full issue object.
 */
export const getIssueById = async (id) => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch issue by ID:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Could not load this issue. Please try again.";
    throw new Error(errorMessage);
  }
};
