import React from 'react'
import { useNavigate } from 'react-router-dom'

// NEW: Added React.FC to type this as a Functional Component
const DashboardPage: React.FC = () => {
	const navigate = useNavigate()

	// TypeScript automatically infers that this function returns nothing (void)
	const handleLogout = () => {
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

			<button onClick={handleLogout} className="login-btn back-btn logout-button">
				Log Out
			</button>
		</div>
	)
}

export default DashboardPage
