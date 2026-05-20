import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { User } from '../models/types.ts'
import { get } from '../api/http'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { useAuth } from '../auth/useAuth.ts'

const AdminUsersPage: React.FC = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const { isLoading: isAuthLoading } = useAuth()

	const fetchUsers = useCallback(async () => {
		setIsLoading(true)

		try {
			const data = await get<User[]>('/users')
			setUsers(data)
			setLoadError(null)
		} catch (error) {
			setLoadError(getApiErrorMessage(error, t, t('adminUsers.loadError')))
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		if (isAuthLoading) {
			return
		}

		void fetchUsers()
	}, [fetchUsers, isAuthLoading])

	const hasUsers = !isLoading && !loadError && users.length > 0
	const hasNoUsers = !isLoading && !loadError && users.length === 0

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<button className="login-btn back-btn" onClick={() => navigate('/admin-dashboard')}>
					{t('adminUsers.backToDashboard')}
				</button>
			</div>

			<div className="books-container">
				<h2>{t('adminUsers.title')}</h2>

				{isLoading && <p>{t('adminUsers.loading')}</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{hasNoUsers && <p>{t('adminUsers.empty')}</p>}

				{hasUsers && (
					<div className="entity-grid">
						{users.map((user) => (
							<div key={user.id} className="entity-card">
								<h3 className="entity-card-title">{user.name}</h3>

								<p className="entity-card-detail">
									<strong>{t('user.email')}:</strong> {user.email}
								</p>

								<p className="entity-card-detail">
									<strong>{t('user.phone')}:</strong> {user.phoneNumber || t('user.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('user.address')}:</strong> {user.address || t('user.notAvailable')}
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
