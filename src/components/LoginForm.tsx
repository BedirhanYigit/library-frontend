import React, { useState } from 'react'

// NEW: Define an Interface specifically for the Props this component receives!
interface LoginFormProps {
  loginType: 'user' | 'admin'
  onSubmit: (email: string, password: string) => void // A function that takes two strings and returns nothing
  onBack: () => void // A simple function with no parameters
  errorMessage: string
}

// NEW: Pass the interface into React.FC so it knows what props to expect
const LoginForm: React.FC<LoginFormProps> = ({ loginType, onSubmit, onBack, errorMessage }) => {
  // Explicitly type the state as strings
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // NEW: Type the form submission event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{loginType === 'user' ? 'User Login' : 'Admin Login'}</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="input-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          // NEW: Type the input change event
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="button-group">
        <button type="button" className="login-btn back-btn" onClick={onBack}>
          Back
        </button>
        <button
          type="submit"
          className={`login-btn ${loginType === 'user' ? 'user-btn' : 'admin-btn'}`}
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm
