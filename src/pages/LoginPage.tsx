import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm.tsx'
import { useAuth } from '../auth/useAuth.ts'

type ViewState = 'selection' | 'user-login' | 'admin-login'

const LoginPage: React.FC = () => {
	const [currentView, setCurrentView] = useState<ViewState>('selection')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const navigate = useNavigate()
	const { loginAsUser, loginAsAdmin } = useAuth()

	const handleLoginSubmit = async (email: string, password: string) => {
		setErrorMessage('')

		try {
			if (currentView === 'admin-login') {
				await loginAsAdmin({ email, password })
				navigate('/admin-dashboard')
			} else {
				await loginAsUser({ email, password })
				navigate('/dashboard')
			}
		} catch {
			setErrorMessage('Invalid email or password.')
		}
	}

	const goBack = () => {
		setCurrentView('selection')
		setErrorMessage('')
	}

	return (
		<main className="login-section login-section-relative">
			<div className="top-right-action">
				<span className="top-right-action-text">New to the library?</span>

				<button className="login-btn user-btn signup-nav-button" onClick={() => navigate('/signup')}>
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
