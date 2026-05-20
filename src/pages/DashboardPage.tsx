import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'

const DashboardPage: React.FC = () => {
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
		<div className="dashboard-container">
			<h2>Library Dashboard</h2>
			<p>Welcome inside! Here you will manage your library.</p>

			<div className="button-group dashboard-button-group">
				<button className="login-btn user-btn" onClick={() => navigate('/books')}>
					Books
				</button>

				<button className="login-btn user-btn" onClick={() => navigate('/my-reservations')}>
					Reservations
				</button>
			</div>

			<StatusMessage message={message} />

			<button onClick={handleLogout} className="login-btn back-btn logout-button">
				Log Out
			</button>
		</div>
	)
}

export default DashboardPage
