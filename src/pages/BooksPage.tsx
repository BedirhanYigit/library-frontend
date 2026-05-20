import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Book, Loan, Reservation } from '../models/types'
import { get, post } from '../api/http'
import type { LoanRequest, ReservationRequest } from '../models/request.types.ts'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { notify } from '../components/notifications/notify.tsx'

const BooksPage: React.FC = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const [books, setBooks] = useState<Book[]>([])
	const [sortOption, setSortOption] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchBooks = useCallback(
		async (options?: { showLoading?: boolean }) => {
			if (options?.showLoading) {
				setIsLoading(true)
			}

			try {
				const data = await get<Book[]>('/books')
				setBooks(data)
				setLoadError(null)
			} catch (error) {
				setLoadError(getApiErrorMessage(error, t, t('books.loadError')))
			} finally {
				setIsLoading(false)
			}
		},
		[t],
	)

	useEffect(() => {
		if (isAuthLoading) {
			return
		}

		void fetchBooks({ showLoading: true })
	}, [fetchBooks, isAuthLoading])

	const handleLoanBook = async (bookId: number) => {
		if (!userId) {
			notify.error(t('books.loginBeforeLoan'))
			return
		}

		try {
			await post<Loan, LoanRequest>('/loans', { bookId, userId })
			notify.success(t('books.loanSuccess'))
			await fetchBooks()
		} catch (error) {
			notify.error(getApiErrorMessage(error, t, t('books.loanError')))
		}
	}

	const handleReserveBook = async (bookId: number) => {
		if (!userId) {
			notify.error(t('books.loginBeforeReserve'))
			return
		}

		try {
			await post<Reservation, ReservationRequest>('/reservations', { userId, bookId })
			notify.success(t('books.reserveSuccess'))
		} catch (error) {
			notify.error(getApiErrorMessage(error, t, t('books.reserveError')))
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

	const hasNoBooks = !isLoading && !loadError && books.length === 0
	const hasBooks = !isLoading && !loadError && books.length > 0

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<div className="header-button-group">
					<button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
						{t('books.backToDashboard')}
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/my-books')}>
						{t('books.myBooks')}
					</button>

					<button className="login-btn user-btn reservation-nav-btn" onClick={() => navigate('/my-reservations')}>
						{t('books.myReservations')}
					</button>
				</div>

				<div className="sort-container">
					<label htmlFor="sort">{t('books.sortBy')} </label>

					<select
						id="sort"
						className="sort-select"
						value={sortOption}
						onChange={handleSortChange}
						disabled={isLoading || loadError !== null}
					>
						<option value="" disabled>
							{t('books.selectSortOption')}
						</option>
						<option value="title-asc">{t('books.sortTitleAsc')}</option>
						<option value="title-desc">{t('books.sortTitleDesc')}</option>
						<option value="author-asc">{t('books.sortAuthorAsc')}</option>
					</select>
				</div>
			</div>

			<div className="books-container">
				<h2>{t('books.title')}</h2>

				{isLoading && <p>{t('books.loading')}</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{hasNoBooks && <p>{t('books.empty')}</p>}

				{hasBooks && (
					<div className="entity-grid">
						{books.map((book) => (
							<div key={book.id} className="entity-card">
								<h3 className="entity-card-title">{book.title}</h3>

								<p className="entity-card-detail">
									<strong>{t('book.author')}:</strong> {book.author}
								</p>

								<p className="entity-card-detail">
									<strong>{t('book.genre')}:</strong> {book.genre || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('book.isbn')}:</strong> {book.isbn}
								</p>

								<p className="entity-card-detail">
									<strong>{t('books.availableCopies')}:</strong> {book.numOfCopiesAvailable} /{' '}
									{book.numOfTotalCopies}
								</p>

								<p className={`book-status status-${isAvailable(book) ? 'available' : 'loaned'}`}>
									{isAvailable(book) ? t('books.available') : t('books.unavailable')}
								</p>

								<div className="entity-card-actions">
									{isAvailable(book) ? (
										<button
											className="login-btn user-btn full-width-button compact-button"
											onClick={() => handleLoanBook(book.id)}
										>
											{t('books.loanBook')}
										</button>
									) : (
										<button className="login-btn reserve-btn" onClick={() => handleReserveBook(book.id)}>
											{t('books.reserveBook')}
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
