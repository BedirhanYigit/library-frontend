import React, { useState } from 'react';

function LoginForm({ loginType, onSubmit, onBack, errorMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{loginType === 'user' ? 'User Login' : 'Admin Login'}</h2>
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="input-group">
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>

      <div className="input-group">
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>

      <div className="button-group">
        <button type="button" className="login-btn back-btn" onClick={onBack}>Back</button>
        <button type="submit" className={`login-btn ${loginType === 'user' ? 'user-btn' : 'admin-btn'}`}>
          Login
        </button>
      </div>
    </form>
  );
}

export default LoginForm;