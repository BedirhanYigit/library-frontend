import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.ts'

const DashboardPage: React.FC = () => {
	const navigate = useNavigate()
	const [error, setError] = useState<string | null>(null)

	const { logout } = useAuth()

	const handleLogout = async () => {
		try {
			await logout()
		} catch {
			setError('Failed to log out. Please try again.')
		}

		navigate('/')
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

			{error && <p className="error-message">{error}</p>}

			<button onClick={handleLogout} className="login-btn back-btn logout-button">
				Log Out
			</button>
		</div>
	)
}

export default DashboardPage
