import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { notify } from '../components/notifications/notify.tsx'

const AdminDashboardPage: React.FC = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const { logout } = useAuth()

	const handleLogout = async () => {
		try {
			await logout()
			navigate('/')
		} catch (error) {
			notify.error(getApiErrorMessage(error, t, t('adminDashboard.logoutError')))
		}
	}

	return (
		<div className="dashboard-container admin-dashboard-container">
			<h2>{t('adminDashboard.title')}</h2>
			<p>{t('adminDashboard.welcome')}</p>

			<div className="admin-grid">
				<div className="admin-card" onClick={() => navigate('/admin/books')}>
					<h3>{t('adminDashboard.manageBooksTitle')}</h3>
					<p>{t('adminDashboard.manageBooksDescription')}</p>
				</div>

				<div className="admin-card" onClick={() => navigate('/admin/users')}>
					<h3>{t('adminDashboard.manageUsersTitle')}</h3>
					<p>{t('adminDashboard.manageUsersDescription')}</p>
				</div>

				<div className="admin-card" onClick={() => console.log('Navigate to reservations')}>
					<h3>{t('adminDashboard.reservationsTitle')}</h3>
					<p>{t('adminDashboard.reservationsDescription')}</p>
				</div>
			</div>

			<button onClick={handleLogout} className="login-btn back-btn admin-logout-button">
				{t('adminDashboard.logOut')}
			</button>
		</div>
	)
}

export default AdminDashboardPage
