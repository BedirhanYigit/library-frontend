import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// NEW: Define the shape of our form data
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  
  // NEW: Strongly type the form state
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });

  // NEW: Strongly type our status states
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // NEW: We use a Union Type (|) to tell TS this event could come from an Input OR a Textarea!
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NEW: Type the form submission event
  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- RULE: Gmail Restriction ---
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setError('Mail addresses other than gmail are not permitted. Please register with your gmail provider.');
      return; 
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Account created successfully! You may now log in.');
        setFormData({ name: '', email: '', password: '', phoneNumber: '', address: '' });
      } else {
        setError('Failed to create account. This email might already be in use.');
      }
    } catch (err) {
      setError('Network error. Make sure your backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-section">
      <div className="login-card" style={{ maxWidth: '500px' }}>
        <h2>Library Registration</h2>
        
        {success ? (
          <div className="success-view">
            <h3 style={{ color: '#166534', marginBottom: '20px' }}>{success}</h3>
            <button className="login-btn user-btn" onClick={() => navigate('/')}>
              Go to Login Page
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSignUpSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="input-group">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" required />
            </div>

            <div className="input-group">
              <label>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
            </div>

            <div className="input-group">
              <label>Phone Number *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>

            <div className="input-group">
              <label>Physical Address *</label>
              {/* This is the textarea that made us use the union type above! */}
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
                style={{
                  padding: '12px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', 
                  fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', minHeight: '80px'
                }}
              />
            </div>

            <div className="button-group" style={{ marginTop: '20px' }}>
              <button type="button" className="login-btn back-btn" onClick={() => navigate('/')} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="login-btn user-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;