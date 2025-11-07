import api from './api'; // Import our central Axios instance

const API_PATH = '/auth';

/**
 * Calls the backend to register a new user.
 * @param {object} userData - An object with { username, email, password }
 * @returns {Promise<object>} - The backend's response (AuthResponse DTO)
 */
export const registerUser = async (userData) => {
  // NO try...catch here. Let the component handle the error.
  const response = await api.post(`${API_PATH}/register`, userData);
  return response.data;
};

/**
 * Calls the backend to log in a user.
 * @param {object} credentials - An object with { username, password }
 * @returns {Promise<object>} - The backend's response (AuthResponse DTO)
 */
export const loginUser = async (credentials) => {
  // NO try...catch here. Let the component handle the error.
  const response = await api.post(`${API_PATH}/login`, credentials);
  return response.data;
};