import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../models/types.ts'
import { get } from '../api/http'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'

const AdminUsersPage: React.FC = () => {
	const navigate = useNavigate()

	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true)

			try {
				const data = await get<User[]>('/users')
				setUsers(data)
				setLoadError(null)
			} catch (error) {
				setLoadError(getApiErrorMessage(error, 'Could not load users. Please try again.'))
			} finally {
				setIsLoading(false)
			}
		}

		void fetchUsers()
	}, [])

	const hasUsers = !isLoading && !loadError && users.length > 0
	const hasNoUsers = !isLoading && !loadError && users.length === 0

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<button className="login-btn back-btn" onClick={() => navigate('/admin-dashboard')}>
					Back to Admin Dashboard
				</button>
			</div>

			<div className="books-container">
				<h2>Registered Library Users</h2>

				{isLoading && <p>Loading users from database...</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{hasNoUsers && <p>No users found in the system.</p>}

				{hasUsers && (
					<div className="entity-grid">
						{users.map((user) => (
							<div key={user.id} className="entity-card">
								<h3 className="entity-card-title">{user.name}</h3>

								<p className="entity-card-detail">
									<strong>Email:</strong> {user.email}
								</p>

								<p className="entity-card-detail">
									<strong>Phone:</strong> {user.phoneNumber || 'N/A'}
								</p>

								<p className="entity-card-detail">
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
