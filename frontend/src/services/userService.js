import api from './api'; // Import our central Axios instance

// Define the relative path for this service
const API_PATH = '/users';

/**
 * --- Slice 7: Get User Profile ---
 * Calls the GET /api/v1/users/me endpoint.
 * The token is automatically sent by the interceptor in api.js.
 *
 * @returns {Promise<object>} - The user profile object (UserProfileResponse DTO).
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get(`${API_PATH}/me`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    const errorMessage = (error.response && error.response.data && error.response.data.message)
      ? error.response.data.message
      : "Could not load profile. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * --- Slice 7: Update User Profile ---
 * Calls the PUT /api/v1/users/me endpoint.
 *
 * @param {object} updateData - The data to update (e.g., { email: "new@email.com" }).
 * @returns {Promise<object>} - The updated user profile object.
 */
export const updateUserProfile = async (updateData) => {
  try {
    const response = await api.put(`${API_PATH}/me`, updateData);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    const errorMessage = (error.response && error.response.data && error.response.data.message)
      ? error.response.data.message
      : "Could not update profile. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * --- Slice 7: Delete User Profile ---
 * Calls the DELETE /api/v1/users/me endpoint.
 *
 * @returns {Promise<void>} - No return data on success.
 */
export const deleteUserProfile = async () => {
  try {
    await api.delete(`${API_PATH}/me`);
  } catch (error) {
    console.error("Failed to delete user profile:", error);
    const errorMessage = (error.response && error.response.data && error.response.data.message)
      ? error.response.data.message
      : "Could not delete account. Please try again.";
    throw new Error(errorMessage);
  }
};