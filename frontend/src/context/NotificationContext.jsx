import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// 1. Create the Context
const NotificationContext = createContext();

// 2. Create a custom hook to easily use the context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// 3. Create the Provider component
export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // 'success', 'error', 'warning', 'info'

  // Function to show the notification
  const showNotification = (newMessage, newSeverity = "success") => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  // Function to close the notification
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // The value that will be provided to all consuming components
  const value = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* The global Snackbar component that will pop up */}
      <Snackbar
        open={open}
        autoHideDuration={6000} // Hide after 6 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {/* Use Alert for correct styling based on severity */}
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
