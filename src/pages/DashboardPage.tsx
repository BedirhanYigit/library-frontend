import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { notify } from '../components/notifications/notify.tsx'

const DashboardPage: React.FC = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const { logout } = useAuth()

	const handleLogout = async () => {
		try {
			await logout()
			navigate('/')
		} catch (error) {
			notify.error(getApiErrorMessage(error, t, t('dashboard.logoutError')))
		}
	}

	return (
		<div className="dashboard-container">
			<h2>{t('dashboard.title')}</h2>
			<p>{t('dashboard.welcome')}</p>

			<div className="button-group dashboard-button-group">
				<button className="login-btn user-btn" onClick={() => navigate('/books')}>
					{t('dashboard.books')}
				</button>

				<button className="login-btn user-btn" onClick={() => navigate('/my-reservations')}>
					{t('dashboard.reservations')}
				</button>
			</div>

			<button onClick={handleLogout} className="login-btn back-btn logout-button">
				{t('dashboard.logOut')}
			</button>
		</div>
	)
}

export default DashboardPage
