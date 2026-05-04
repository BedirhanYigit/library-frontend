import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <div className="dashboard-container">
      <h2>Library Dashboard</h2>
      <p>Welcome inside! Here you will manage your library.</p>
      
      <div className="button-group" style={{ marginTop: '30px' }}>
        {/* Update this button with onClick */}
        <button className="login-btn user-btn" onClick={() => navigate('/books')}>
          Books
        </button>
        <button className="login-btn user-btn">Reservations</button>
      </div>

      <button 
        onClick={handleLogout} 
        className="login-btn back-btn" 
        style={{ marginTop: '40px' }}
      >
        Log Out
      </button>
    </div>
  );
}

export default DashboardPage;