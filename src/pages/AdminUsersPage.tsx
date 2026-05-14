import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../models/types.ts'
import { get } from '../api/http'

const AdminUsersPage: React.FC = () => {
	const navigate = useNavigate()

	// NEW: Added <User[]> to tell TS this array holds User objects
	const [users, setUsers] = useState<User[]>([])
	// NEW: Explicitly typed boolean and string/null states
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await get<User[]>('/users')
				setUsers(data)
				setError(null)
			} catch (err) {
				console.error('Error fetching users:', err)
				setError('Could not load users. Is your backend running?')
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [])

	return (
		<div className="page-wrapper">
			<div className="books-header-actions">
				<button className="login-btn back-btn" onClick={() => navigate('/admin-dashboard')}>
					Back to Admin Dashboard
				</button>
			</div>

			<div className="books-container">
				<h2>Registered Library Users</h2>

				{isLoading && <p>Loading users from database...</p>}
				{error && <p className="error-message">{error}</p>}

				{!isLoading && !error && users.length === 0 && <p>No users found in the system.</p>}

				{!isLoading && !error && users.length > 0 && (
					<div className="books-grid">
						{users.map((user) => (
							<div key={user.id} className="book-card">
								<h3 className="book-title">{user.name}</h3>
								<p className="book-detail">
									<strong>Email:</strong> {user.email}
								</p>
								<p className="book-detail">
									<strong>Phone:</strong> {user.phoneNumber || 'N/A'}
								</p>
								<p className="book-detail">
									<strong>Address:</strong> {user.address || 'N/A'}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminUsersPage
