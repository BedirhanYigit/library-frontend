import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book, Loan, Reservation } from '../models/types'
import { get, post } from '../api/http'
import type { LoanRequest, ReservationRequest } from '../models/request.types.ts'
import { useAuth } from '../auth/useAuth.ts'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'

const BooksPage: React.FC = () => {
	const navigate = useNavigate()

	const [books, setBooks] = useState<Book[]>([])
	const [sortOption, setSortOption] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<StatusMessageType>(null)

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchBooks = useCallback(
		async (options?: { showLoading?: boolean }) => {
			if (isAuthLoading) {
				return
			}

			if (options?.showLoading) {
				setIsLoading(true)
			}

			try {
				const data = await get<Book[]>('/books')
				setBooks(data)
				setLoadError(null)
			} catch {
				setLoadError('Could not load books. Is your backend running?')
			} finally {
				setIsLoading(false)
			}
		},
		[isAuthLoading],
	)

	useEffect(() => {
		void fetchBooks()
	}, [fetchBooks])

	const setSuccessMessage = (message: string) => {
		setActionMessage({ type: 'success', text: message })
	}

	const setErrorMessage = (message: string) => {
		setActionMessage({ type: 'error', text: message })
	}

	const clearActionMessage = () => {
		setActionMessage(null)
	}

	const handleLoanBook = async (bookId: number) => {
		clearActionMessage()

		if (!userId) {
			setErrorMessage('Error: User ID missing. Please log in.')
			return
		}

		try {
			await post<Loan, LoanRequest>('/loans', { bookId, userId })
			setSuccessMessage('Book loaned successfully!')
			await fetchBooks()
		} catch {
			setErrorMessage('Failed to loan book. You may have reached your limit.')
		}
	}

	const handleReserveBook = async (bookId: number) => {
		clearActionMessage()

		if (!userId) {
			setErrorMessage('Error: User ID missing. Please log in.')
			return
		}

		try {
			await post<Reservation, ReservationRequest>('/reservations', { userId, bookId })
			setSuccessMessage('Book reserved successfully! You will be notified when it is available.')
		} catch {
			setErrorMessage('Failed to reserve book. You might already have a reservation for this.')
		}
	}

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const option = e.target.value
		setSortOption(option)

		const sortedBooks = [...books]

		if (option === 'title-asc') {
			sortedBooks.sort((a, b) => a.title.localeCompare(b.title))
		} else if (option === 'title-desc') {
			sortedBooks.sort((a, b) => b.title.localeCompare(a.title))
		} else if (option === 'author-asc') {
			sortedBooks.sort((a, b) => a.author.localeCompare(b.author))
		}

		setBooks(sortedBooks)
	}

	const isAvailable = (book: Book) => {
		return book.numOfCopiesAvailable > 0
	}

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<div className="header-button-group">
					<button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
						Back to Dashboard
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/my-books')}>
						My Books
					</button>

					<button className="login-btn user-btn reservation-nav-btn" onClick={() => navigate('/my-reservations')}>
						My Reservations
					</button>
				</div>

				<div className="sort-container">
					<label htmlFor="sort">Sort by: </label>
					<select
						id="sort"
						className="sort-select"
						value={sortOption}
						onChange={handleSortChange}
						disabled={isLoading || loadError !== null}
					>
						<option value="" disabled>
							Select option...
						</option>
						<option value="title-asc">Title (A-Z)</option>
						<option value="title-desc">Title (Z-A)</option>
						<option value="author-asc">Author Name (A-Z)</option>
					</select>
				</div>
			</div>

			<div className="books-container">
				<h2>Library Books</h2>

				<StatusMessage message={actionMessage} />

				{isLoading && <p>Loading books from database...</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && books.length === 0 && <p>No books found.</p>}

				{!isLoading && !loadError && books.length > 0 && (
					<div className="entity-grid">
						{books.map((book) => (
							<div key={book.id} className="entity-card">
								<h3 className="entity-card-title">{book.title}</h3>

								<p className="entity-card-detail">
									<strong>Author:</strong> {book.author}
								</p>

								<p className="entity-card-detail">
									<strong>Genre:</strong> {book.genre || 'N/A'}
								</p>

								<p className="entity-card-detail">
									<strong>ISBN:</strong> {book.isbn}
								</p>

								<p className="entity-card-detail">
									<strong>Available Copies:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}
								</p>

								<p className={`book-status status-${isAvailable(book) ? 'available' : 'loaned'}`}>
									{isAvailable(book) ? 'AVAILABLE' : 'UNAVAILABLE'}
								</p>

								<div className="entity-card-actions">
									{isAvailable(book) ? (
										<button
											className="login-btn user-btn full-width-button compact-button"
											onClick={() => handleLoanBook(book.id)}
										>
											Loan Book
										</button>
									) : (
										<button className="login-btn reserve-btn" onClick={() => handleReserveBook(book.id)}>
											Reserve Book
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default BooksPage
