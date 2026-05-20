import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'

const AdminDashboardPage: React.FC = () => {
	const navigate = useNavigate()
	const [message, setMessage] = useState<StatusMessageType>(null)

	const { logout } = useAuth()

	const handleLogout = async () => {
		setMessage(null)

		try {
			await logout()
			navigate('/')
		} catch (error) {
			setMessage({
				type: 'error',
				text: getApiErrorMessage(error, 'Failed to log out. Please try again.'),
			})
		}
	}

	return (
		<div className="dashboard-container admin-dashboard-container">
			<h2>Admin Control Panel</h2>
			<p>Welcome, Administrator. What would you like to manage today?</p>

			<div className="admin-grid">
				<div className="admin-card" onClick={() => navigate('/admin/books')}>
					<h3>📚 Manage Books</h3>
					<p>Add new books, update details, or view inventory.</p>
				</div>

				<div className="admin-card" onClick={() => navigate('/admin/users')}>
					<h3>👥 Manage Users</h3>
					<p>View all registered library users and their details.</p>
				</div>

				<div className="admin-card" onClick={() => console.log('Navigate to reservations')}>
					<h3>📅 Reservations</h3>
					<p>View and process current book reservations.</p>
				</div>
			</div>

			<StatusMessage message={message} />

			<button onClick={handleLogout} className="login-btn back-btn admin-logout-button">
				Log Out
			</button>
		</div>
	)
}

export default AdminDashboardPage
