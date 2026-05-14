import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book, Loan, Reservation } from '../models/types'
import { get, post } from '../api/http'
import type { LoanRequest, ReservationRequest } from '../models/request.types.ts'

// NEW: We can define a quick interface for our action messages
interface ActionMessage {
	text: string
	type: 'success' | 'error' | '' // Strict typing so it only accepts these exact strings
}

const BooksPage: React.FC = () => {
	const navigate = useNavigate()

	// NEW: State typing
	const [books, setBooks] = useState<Book[]>([])
	const [sortOption, setSortOption] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<ActionMessage>({ text: '', type: '' })

	const fetchBooks = async (options?: { showLoading?: boolean }) => {
		if (options?.showLoading) {
			setIsLoading(true)
		}

		try {
			const data = await get<Book[]>('/books')
			setBooks(data)
			setError(null)
		} catch {
			setError('Could not load books. Is your backend running?')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		void fetchBooks()
	}, [])

	const handleLoanBook = async (bookId: number) => {
		setActionMessage({ text: '', type: '' })
		const userId = localStorage.getItem('userId')
		if (!userId)
			return setActionMessage({
				text: 'Error: User ID missing. Please log in.',
				type: 'error',
			})

		try {
			const userIdInt = parseInt(userId)
			const loanRequest: LoanRequest = {
				bookId: bookId,
				userId: userIdInt,
			}

			await post<Loan, LoanRequest>(`/loans`, loanRequest)
			setActionMessage({ text: 'Book loaned successfully!', type: 'success' })
			await fetchBooks()
		} catch {
			setActionMessage({
				text: 'Failed to loan book. You may have reached your limit.',
				type: 'error',
			})
		}
	}

	const handleReserveBook = async (bookId: number) => {
		setActionMessage({ text: '', type: '' })
		const userId = localStorage.getItem('userId')
		if (!userId)
			return setActionMessage({
				text: 'Error: User ID missing. Please log in.',
				type: 'error',
			})

		try {
			const userIdInt = parseInt(userId)
			const request: ReservationRequest = {
				userId: userIdInt,
				bookId: bookId,
			}
			await post<Reservation, ReservationRequest>(`/reservations`, request)

			setActionMessage({
				text: 'Book reserved successfully! You will be notified when it is available.',
				type: 'success',
			})
		} catch {
			setActionMessage({
				text: 'Failed to reserve book. You might already have a reservation for this.',
				type: 'error',
			})
		}
	}

	// NEW: Type the 'e' parameter as a Select Element Change Event
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const option = e.target.value
		setSortOption(option)

		const sortedBooks = [...books]
		if (option === 'title-asc') sortedBooks.sort((a, b) => a.title.localeCompare(b.title))
		else if (option === 'title-desc') sortedBooks.sort((a, b) => b.title.localeCompare(a.title))
		else if (option === 'author-asc') sortedBooks.sort((a, b) => a.author.localeCompare(b.author))
		setBooks(sortedBooks)
	}

	const isAvailable = (book: Book) => {
		return book.numOfCopiesAvailable > 0
	}

	return (
		<div className="page-wrapper">
			<div className="books-header-actions">
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
						disabled={isLoading || error !== null}
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

				{actionMessage.text && (
					<div className={actionMessage.type === 'error' ? 'error-message' : 'success-message'}>
						{actionMessage.text}
					</div>
				)}

				{isLoading && <p>Loading books from database...</p>}
				{error && <p className="error-message">{error}</p>}

				{!isLoading && !error && books.length > 0 && (
					<div className="books-grid">
						{books.map((book) => (
							<div key={book.id} className="book-card">
								<h3 className="book-title">{book.title}</h3>

								<p className="book-detail">
									<strong>Author:</strong> {book.author}
								</p>

								<p className="book-detail">
									<strong>Genre:</strong> {book.genre}
								</p>

								<p className="book-detail">
									<strong>ISBN:</strong> {book.isbn}
								</p>

								<p className="book-detail">
									<strong>Available Copies:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}
								</p>

								<p className={`book-status status-${isAvailable(book) ? 'available' : 'loaned'}`}>
									{isAvailable(book) ? 'AVAILABLE' : 'UNAVAILABLE'}
								</p>

								<div className="book-card-actions">
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
