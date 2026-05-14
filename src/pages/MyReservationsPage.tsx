import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Reservation } from '../models/types'
import { deleteRequest, get } from '../api/http'
import { getCurrentUser } from '../auth/authStorage.ts'

interface ActionMessage {
	text: string
	type: 'success' | 'error' | ''
}

const MyReservationsPage: React.FC = () => {
	const navigate = useNavigate()

	const [reservations, setReservations] = useState<Reservation[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<ActionMessage>({ text: '', type: '' })

	const currentUser = getCurrentUser()
	const userId = currentUser?.id

	const fetchReservations = async () => {
		if (!userId) {
			setError('User ID not found. Please log in again.')
			setIsLoading(false)
			return
		}

		setIsLoading(true)

		try {
			const data = await get<Reservation[]>(`/reservations/${userId}`)
			setReservations(data)
			setError(null)
		} catch (err) {
			console.error('Error fetching reservations:', err)
			setError('Could not load your reservations. Is your backend running?')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchReservations()
	}, [userId])

	// TODO missing backend?, yb
	const handleCancelReservation = async (reservationId: number) => {
		setActionMessage({ text: '', type: '' })

		try {
			await deleteRequest<void>(`/reservations/${reservationId}`)

			setActionMessage({ text: 'Reservation cancelled successfully!', type: 'success' })
			await fetchReservations()
		} catch {
			setActionMessage({
				text: 'Network error. Could not connect to the server.',
				type: 'error',
			})
		}
	}

	return (
		<div className="page-wrapper">
			{/* HEADER SECTION */}
			<div className="books-header-actions">
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

			{/* MAIN CONTENT SECTION */}
			<div className="books-container">
				<h2>My Reservations</h2>

				{/* SUCCESS / ERROR ALERTS */}
				{actionMessage.text && (
					<div className={actionMessage.type === 'error' ? 'error-message' : 'success-message'}>
						{actionMessage.text}
					</div>
				)}

				{isLoading && <p>Loading your reservations...</p>}
				{error && <p className="error-message">{error}</p>}

				{!isLoading && !error && reservations.length === 0 && <p>You have no active reservations.</p>}

				{/* RESERVATIONS GRID */}
				{!isLoading && !error && reservations.length > 0 && (
					<div className="books-grid">
						{reservations.map((reservation) => (
							<div key={reservation.id} className="book-card">
								<h3 className="book-title">{reservation.book?.title || 'Unknown Title'}</h3>

								<p className="book-detail">
									<strong>Author:</strong> {reservation.book?.author || 'N/A'}
								</p>

								<p className="book-detail">
									<strong>Genre:</strong> {reservation.book?.genre || 'N/A'}
								</p>

								<p className="book-detail">
									<strong>ISBN:</strong> {reservation.book?.isbn || 'N/A'}
								</p>

								<p className="book-detail">
									<strong>Reserved On:</strong> {reservation.reservationDate || 'N/A'}
								</p>

								<p className="book-status status-reserved">WAITING FOR COPY</p>

								{/* CANCEL BUTTON */}
								<div className="book-card-actions">
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
