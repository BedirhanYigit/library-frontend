import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm.tsx' // Assuming this is still .jsx or .tsx, both are fine!

// NEW: Define exactly what string values our view state can hold
type ViewState = 'selection' | 'user-login' | 'admin-login'

const LoginPage: React.FC = () => {
	// NEW: Apply the ViewState type to our state
	const [currentView, setCurrentView] = useState<ViewState>('selection')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const navigate = useNavigate()

	// NEW: Specify that email and password must be strings
	const handleLoginSubmit = async (email: string, password: string) => {
		setErrorMessage('')
		const endpoint =
			currentView === 'user-login' ? 'http://localhost:8080/login' : 'http://localhost:8080/admin-login'

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			if (response.ok) {
				// NEW: Tell TypeScript that our backend responds with at least an 'id'
				const data: { id: string } = await response.json()

				if (currentView === 'admin-login') {
					// localStorage always expects strings, so if your ID is a number from backend,
					// it implicitly gets converted, but we typed it as string above to be safe.
					localStorage.setItem('userId', data.id.toString())
					navigate('/admin-dashboard')
				} else {
					localStorage.setItem('userId', data.id.toString())
					navigate('/dashboard')
				}
			} else {
				setErrorMessage('Invalid email or password.')
			}
		} catch {
			setErrorMessage('Network error. Make sure your Spring Boot backend is running.')
		}
	}

	const goBack = () => {
		setCurrentView('selection')
		setErrorMessage('')
	}

	return (
		<main className="login-section" style={{ position: 'relative' }}>
			{/* Top Right Sign-Up Button */}
			<div className="top-right-action">
				<span style={{ marginRight: '15px', fontWeight: '600', color: '#475569' }}>New to the library?</span>
				<button
					className="login-btn user-btn"
					style={{ padding: '8px 20px' }}
					onClick={() => navigate('/signup')}
				>
					Sign Up
				</button>
			</div>

			<div className="login-card">
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
	)
}

export default LoginPage
