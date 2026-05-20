import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Loan } from '../models/types'
import { get, post } from '../api/http'
import { useAuth } from '../auth/useAuth.ts'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'

const MyBooksPage: React.FC = () => {
	const navigate = useNavigate()

	const [loans, setLoans] = useState<Loan[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<StatusMessageType>(null)

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchMyBooks = useCallback(async () => {
		if (!userId) {
			setLoadError('Please log in again to view your loaned books.')
			setIsLoading(false)
			return
		}

		try {
			const data = await get<Loan[]>(`/loans/${userId}`)
			const activeLoans = data.filter((item) => !item.isReturned)

			setLoans(activeLoans)
			setLoadError(null)
		} catch (error) {
			setLoadError(getApiErrorMessage(error, 'Could not load your books. Please try again.'))
		} finally {
			setIsLoading(false)
		}
	}, [userId])

	useEffect(() => {
		if (isAuthLoading) {
			return
		}

		void fetchMyBooks()
	}, [fetchMyBooks, isAuthLoading])

	const setSuccessMessage = (message: string) => {
		setActionMessage({ type: 'success', text: message })
	}

	const setErrorMessage = (message: string) => {
		setActionMessage({ type: 'error', text: message })
	}

	const clearActionMessage = () => {
		setActionMessage(null)
	}

	const handleReturnLoan = async (loanId: number) => {
		clearActionMessage()

		if (!userId) {
			setErrorMessage('Please log in again before returning a book.')
			return
		}

		try {
			await post<void>(`/loans/${loanId}/return`)
			setSuccessMessage('Book returned successfully!')
			await fetchMyBooks()
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, 'Could not return the book. Please try again.'))
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

				<StatusMessage message={actionMessage} />

				{isLoading && <p>Loading your books...</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && loans.length === 0 && (
					<p>You haven't loaned any books yet. Go browse the catalog!</p>
				)}

				{!isLoading && !loadError && loans.length > 0 && (
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
