import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Reservation } from '../models/types'
import { deleteRequest, get } from '../api/http'
import { useAuth } from '../auth/useAuth.ts'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'

const MyReservationsPage: React.FC = () => {
	const navigate = useNavigate()

	const [reservations, setReservations] = useState<Reservation[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<StatusMessageType>(null)

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchReservations = useCallback(async () => {
		if (isAuthLoading) {
			return
		}

		if (!userId) {
			setLoadError('User ID not found. Please log in again.')
			setIsLoading(false)
			return
		}

		try {
			const data = await get<Reservation[]>(`/reservations/${userId}`)
			setReservations(data)
			setLoadError(null)
		} catch {
			setLoadError('Could not load your reservations. Is your backend running?')
		} finally {
			setIsLoading(false)
		}
	}, [isAuthLoading, userId])

	useEffect(() => {
		void fetchReservations()
	}, [fetchReservations])

	const setSuccessMessage = (message: string) => {
		setActionMessage({ type: 'success', text: message })
	}

	const setErrorMessage = (message: string) => {
		setActionMessage({ type: 'error', text: message })
	}

	const clearActionMessage = () => {
		setActionMessage(null)
	}

	const handleCancelReservation = async (reservationId: number) => {
		clearActionMessage()

		try {
			await deleteRequest<void>(`/reservations/${reservationId}`)
			setSuccessMessage('Reservation cancelled successfully!')
			await fetchReservations()
		} catch {
			setErrorMessage('Network error. Could not connect to the server.')
		}
	}

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<div className="header-button-group">
					<button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
						Back to Dashboard
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/books')}>
						Browse All Books
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/my-books')}>
						My Books
					</button>
				</div>
			</div>

			<div className="books-container">
				<h2>My Reservations</h2>

				<StatusMessage message={actionMessage} />

				{isLoading && <p>Loading your reservations...</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && reservations.length === 0 && <p>You have no active reservations.</p>}

				{!isLoading && !loadError && reservations.length > 0 && (
					<div className="entity-grid">
						{reservations.map((reservation) => (
							<div key={reservation.id} className="entity-card">
								<h3 className="entity-card-title">{reservation.book?.title || 'Unknown Title'}</h3>

								<p className="entity-card-detail">
									<strong>Author:</strong> {reservation.book?.author || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>Genre:</strong> {reservation.book?.genre || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>ISBN:</strong> {reservation.book?.isbn || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>Reserved On:</strong> {reservation.reservationDate || 'N/A'}
								</p>

								<p className="book-status status-reserved">WAITING FOR COPY</p>

								<div className="entity-card-actions">
									<button
										className="login-btn secondary-action-btn"
										onClick={() => handleCancelReservation(reservation.id)}
									>
										Cancel Reservation
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default MyReservationsPage
