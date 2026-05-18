import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Loan } from '../models/types'
import { get, post } from '../api/http'
import { useAuth } from '../auth/useAuth.ts'

// NEW: Define the shape of our action messages (just like we did in BooksPage)
interface ActionMessage {
	text: string
	type: 'success' | 'error' | ''
}

const MyBooksPage: React.FC = () => {
	const navigate = useNavigate()

	const [loans, setLoans] = useState<Loan[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<ActionMessage>({ text: '', type: '' })

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchMyBooks = useCallback(async () => {
		if (isAuthLoading) {
			return
		}

		if (!userId) {
			setError('User ID not found. Please log in again.')
			setIsLoading(false)
			return
		}

		try {
			const data = await get<Loan[]>(`/loans/${userId}`)
			const activeLoans = data.filter((item) => !item.isReturned)

			setLoans(activeLoans)
			setError(null)
		} catch {
			setError('Could not load your books. Is your backend running?')
		} finally {
			setIsLoading(false)
		}
	}, [isAuthLoading, userId])

	useEffect(() => {
		void fetchMyBooks()
	}, [fetchMyBooks])

	const handleReturnLoan = async (loanId: number) => {
		setActionMessage({ text: '', type: '' })

		if (!userId) {
			setActionMessage({ text: 'User ID not found. Please log in again.', type: 'error' })
			return
		}

		try {
			await post<void>(`/loans/${loanId}/return`)
			setActionMessage({ text: 'Book returned successfully!', type: 'success' })
			await fetchMyBooks()
		} catch {
			setActionMessage({
				text: 'Network error. Could not connect to the server.',
				type: 'error',
			})
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

					<button className="login-btn user-btn reservation-nav-btn" onClick={() => navigate('/my-reservations')}>
						My Reservations
					</button>
				</div>
			</div>

			<div className="books-container">
				<h2>My Loaned Books</h2>

				{actionMessage.text && (
					<div className={actionMessage.type === 'error' ? 'error-message' : 'success-message'}>
						{actionMessage.text}
					</div>
				)}

				{isLoading && <p>Loading your books...</p>}
				{error && <p className="error-message">{error}</p>}

				{!isLoading && !error && loans.length === 0 && <p>You haven't loaned any books yet. Go browse the catalog!</p>}

				{!isLoading && !error && loans.length > 0 && (
					<div className="entity-grid">
						{loans.map((item) => (
							<div key={item.id} className="entity-card">
								<h3 className="entity-card-title">{item.bookTitle}</h3>

								<p className="entity-card-detail">
									<strong>Author:</strong> {item.author || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>Genre:</strong> {item.genre || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>ISBN:</strong> {item.isbn || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>Loaned On:</strong> {item.loanDate}
								</p>

								<p className="entity-card-detail entity-card-detail-danger">
									<strong>Due Date:</strong> {item.dueDate}
								</p>

								<p className="book-status status-loaned">CURRENTLY LOANED</p>

								<div className="entity-card-actions">
									<button className="login-btn danger-btn" onClick={() => handleReturnLoan(item.id)}>
										Return Book
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

export default MyBooksPage
