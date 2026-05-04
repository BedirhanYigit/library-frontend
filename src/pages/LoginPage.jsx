import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const [currentView, setCurrentView] = useState('selection'); 
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (email, password) => {
    setErrorMessage(''); 
    
    const endpoint = currentView === 'user-login' 
      ? 'http://localhost:8080/login' 
      : 'http://localhost:8080/admin-login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // NEW: Extract the user data from the backend response
        const data = await response.json();
        
        if (currentView === 'admin-login') {
          // Save admin ID just in case we need it later
          localStorage.setItem('userId', data.id); 
          navigate('/admin-dashboard');
        } else {
          // Save the normal User ID so we can use it to loan books!
          localStorage.setItem('userId', data.id); 
          navigate('/dashboard');
        }
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      setErrorMessage('Network error. Make sure your Spring Boot backend is running.');
    }
  };

  const goBack = () => {
    setCurrentView('selection');
    setErrorMessage('');
  };

  return (
    <main className="login-section">
      <div className="login-card">
        
        {/* VIEW: Selection */}
        {currentView === 'selection' && (
          <>
            <h2>Select Login Type</h2>
            <div className="button-group">
              <button className="login-btn user-btn" onClick={() => setCurrentView('user-login')}>
                User Login
              </button>
              <button className="login-btn admin-btn" onClick={() => setCurrentView('admin-login')}>
                Admin Login
              </button>
            </div>
          </>
        )}

        {/* VIEW: Form */}
        {(currentView === 'user-login' || currentView === 'admin-login') && (
          <LoginForm 
            loginType={currentView === 'user-login' ? 'user' : 'admin'}
            onSubmit={handleLoginSubmit}
            onBack={goBack}
            errorMessage={errorMessage}
          />
        )}

      </div>
    </main>
  );
}

export default LoginPage;