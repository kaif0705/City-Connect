import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SubmitPage from './pages/SubmitPage'; 


function App() {
  return (
    <div className="app-container">
      
      <nav className="navbar">
        <Link to="/" className="nav-link">CityConnect</Link>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">Report an Issue</Link>
          </li>
          <li>
            <Link to="/admin" className="nav-link">Admin Dashboard</Link>
          </li>
        </ul>
      </nav>

      <div className="page-content">
        <Routes>
          {/* 3. Use the REAL SubmitPage component */}
          <Route path="/" element={<SubmitPage />} /> 
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </div>
      
    </div>
  );
}

export default App;