import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LoginFormProps {
	loginType: 'user' | 'admin'
	onSubmit: (email: string, password: string) => void
	onBack: () => void
	errorMessage: string
}

const LoginForm: React.FC<LoginFormProps> = ({ loginType, onSubmit, onBack, errorMessage }) => {
	const { t } = useTranslation()

	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		onSubmit(email, password)
	}

	return (
		<form onSubmit={handleSubmit} className="login-form">
			<h2>{loginType === 'user' ? t('login.userLogin') : t('login.adminLogin')}</h2>

			{errorMessage && <div className="error-message">{errorMessage}</div>}

			<div className="input-group">
				<label>{t('login.email')}:</label>
				<input
					type="email"
					value={email}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
					required
				/>
			</div>

			<div className="input-group">
				<label>{t('login.password')}:</label>
				<input
					type="password"
					value={password}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
					required
				/>
			</div>

			<div className="button-group">
				<button type="button" className="login-btn back-btn" onClick={onBack}>
					{t('login.back')}
				</button>

				<button type="submit" className={`login-btn ${loginType === 'user' ? 'user-btn' : 'admin-btn'}`}>
					{t('login.submit')}
				</button>
			</div>
		</form>
	)
}

export default LoginForm
