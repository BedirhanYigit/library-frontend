import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Reservation } from '../models/types'
import { deleteRequest, get } from '../api/http'

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

	const userId = localStorage.getItem('userId')

	const fetchReservations = async () => {
		if (!userId) {
			setError('User ID not found. Please log in again.')
			setIsLoading(false)
			return
		}

		setIsLoading(true)

		try {
			const data = await get<Reservation[]>(`/get-reservations/${userId}`)
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
			await deleteRequest<void>(`/reservations/cancel/${reservationId}`)

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
			<div className="books-header-actions" style={{ display: 'flex', alignItems: 'center' }}>
				<div style={{ display: 'flex', gap: '10px' }}>
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
					<div
						className={actionMessage.type === 'error' ? 'error-message' : 'success-message'}
						style={{
							marginBottom: '20px',
							padding: '15px',
							borderRadius: '8px',
							backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fef2f2',
							color: actionMessage.type === 'success' ? '#166534' : '#ef4444',
							fontWeight: 'bold',
						}}
					>
						{actionMessage.text}
					</div>
				)}

				{isLoading && <p>Loading your reservations...</p>}
				{error && <p className="error-message">{error}</p>}

				{!isLoading && !error && reservations.length === 0 && <p>You have no active reservations.</p>}

				{/* RESERVATIONS GRID */}
				{!isLoading && !error && reservations.length > 0 && (
					<div className="books-grid">
						{reservations.map((item) => (
							<div key={item.id} className="book-card">
								{/* BOOK DETAILS - Fixed with Optional Chaining */}
								<h3 className="book-title">{item.book?.title || item.bookTitle || 'Unknown Title'}</h3>
								<p className="book-detail">
									<strong>Author:</strong> {item.book?.author || item.author || 'N/A'}
								</p>
								<p className="book-detail">
									<strong>Genre:</strong> {item.book?.genre || item.genre || 'N/A'}
								</p>
								<p className="book-detail">
									<strong>ISBN:</strong> {item.book?.isbn || item.isbn || 'N/A'}
								</p>

								{/* RESERVATION DATE */}
								<p className="book-detail">
									<strong>Reserved On:</strong> {item.reservationDate || 'N/A'}
								</p>

								{/* STATUS INDICATOR */}
								<p
									className="book-status"
									style={{
										color: '#f59e0b',
										fontWeight: 'bold',
										marginTop: '10px',
									}}
								>
									WAITING FOR COPY
								</p>

								{/* CANCEL BUTTON */}
								<div style={{ marginTop: '20px' }}>
									<button
										className="login-btn back-btn"
										style={{
											width: '100%',
											padding: '10px',
											backgroundColor: '#64748b',
											color: 'white',
											borderColor: '#64748b',
											fontWeight: 'bold',
											cursor: 'pointer',
										}}
										onClick={() => handleCancelReservation(item.id)}
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
