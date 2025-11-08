import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 3. useEffect to load token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      try {
        // Decode token to get user data and check expiry
        const decodedToken = jwtDecode(storedToken);

        // Check if token is expired
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (!isExpired) {
          // If not expired, set the auth state
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setToken(storedToken);
          setUser(storedUser);
        } else {
          // If expired, clear storage
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("user");
        }
      } catch (error) {
        // If token is invalid, clear storage
        console.error("Invalid token:", error);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
      }
    }
  }, []); // The empty array [] means this runs only once on mount

  // 4. Login function
  const login = (newToken, newUser) => {
    // Store in localStorage
    localStorage.setItem("jwtToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Store in state
    setToken(newToken);
    setUser(newUser);
  };

  // 5. Logout function
  const logout = () => {
    // Clear from localStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");

    // Clear from state
    setToken(null);
    setUser(null);
  };

  // --- 6. ADD THIS NEW FUNCTION ---
  /**
   * Updates the user object in state and localStorage.
   * This is used by the Profile Page after a successful update.
   * @param {object} updatedUser - The new user object (e.g., { username, email, role })
   */
  const updateUser = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // 7. Value to be provided to all children components
  const value = {
    user,
    token,
    login,
    logout,
    updateUser, // <-- 8. ADD IT TO THE VALUE OBJECT
    isAuthenticated: !!token, // A simple boolean to check if logged in
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 9. Custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
