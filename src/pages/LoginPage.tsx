import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LoginForm from '../components/LoginForm.tsx'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'

type ViewState = 'selection' | 'user-login' | 'admin-login'

const LoginPage: React.FC = () => {
	const [currentView, setCurrentView] = useState<ViewState>('selection')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const navigate = useNavigate()
	const { t } = useTranslation()
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
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, t, t('login.invalidCredentials')))
		}
	}

	const goBack = () => {
		setCurrentView('selection')
		setErrorMessage('')
	}

	return (
		<main className="login-section login-section-relative">
			<div className="top-right-action">
				<span className="top-right-action-text">{t('login.newToLibrary')}</span>

				<button className="login-btn user-btn signup-nav-button" onClick={() => navigate('/signup')}>
					{t('login.signUp')}
				</button>
			</div>

			<div className="login-card">
				{currentView === 'selection' && (
					<>
						<h2>{t('login.selectLoginType')}</h2>

						<div className="button-group">
							<button className="login-btn user-btn" onClick={() => setCurrentView('user-login')}>
								{t('login.userLogin')}
							</button>

							<button className="login-btn admin-btn" onClick={() => setCurrentView('admin-login')}>
								{t('login.adminLogin')}
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
