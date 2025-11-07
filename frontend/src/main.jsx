import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // 1. Import our new AuthProvider
import { CssBaseline } from '@mui/material'; // 2. Import MUI's CSS reset

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap our entire app with the Router and Auth Provider */}
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CssBaseline /> 
          <App />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);