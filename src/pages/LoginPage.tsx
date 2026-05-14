import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm.tsx'
import { post } from '../api/http'
import type { LoginRequest } from '../models/request.types'
import type { LoginResponse } from '../models/response.types' // Assuming this is still .jsx or .tsx, both are fine!

// NEW: Define exactly what string values our view state can hold
type ViewState = 'selection' | 'user-login' | 'admin-login'

const LoginPage: React.FC = () => {
	const [currentView, setCurrentView] = useState<ViewState>('selection')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const navigate = useNavigate()

	const handleLoginSubmit = async (email: string, password: string) => {
		setErrorMessage('')

		const endpoint = currentView === 'user-login' ? '/auth/users/login' : '/auth/admins/login'
		const payload: LoginRequest = {
			email,
			password,
		}

		try {
			const data = await post<LoginResponse, LoginRequest>(endpoint, payload)

			localStorage.setItem('userId', data.id.toString())
			if (currentView === 'admin-login') {
				navigate('/admin-dashboard')
			} else {
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
			{/* Top Right Sign-Up Button */}
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
