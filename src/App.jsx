import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; 
import AdminBooksPage from './pages/AdminBooksPage';    
import AdminUsersPage from './pages/AdminUsersPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="greeting-header">
          <h1>Welcome to Deveci Library</h1>
        </header>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/books" element={<AdminBooksPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;