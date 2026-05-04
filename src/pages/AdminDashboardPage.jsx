import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <h2>Admin Control Panel</h2>
      <p>Welcome, Administrator. What would you like to manage today?</p>
      
      <div className="admin-grid">
        <div className="admin-card" onClick={() => navigate('/admin/books')}>
          <h3>📚 Manage Books</h3>
          <p>Add new books, update details, or view inventory.</p>
        </div>
        
        <div className="admin-card" onClick={() => navigate('/admin/users')}>
          <h3>👥 Manage Users</h3>
          <p>View all registered library users and their details.</p>
        </div>
        
        <div className="admin-card" onClick={() => console.log('Navigate to reservations')}>
          <h3>📅 Reservations</h3>
          <p>View and process current book reservations.</p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="login-btn back-btn" 
        style={{ marginTop: '40px' }}
      >
        Log Out
      </button>
    </div>
  );
}

export default AdminDashboardPage;