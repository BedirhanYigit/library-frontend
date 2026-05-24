import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Loan } from '../models/types'
import { get, post } from '../api/http'
import { useAuth } from '../auth/useAuth.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { formatDate } from '../i18n/dateFormatting.ts'
import { notify } from '../components/notifications/notify.tsx'
import BookCoverImage from '../components/books/BookCoverImage.tsx'

const MyBooksPage: React.FC = () => {
	const navigate = useNavigate()
	const { t, i18n } = useTranslation()

	const [loans, setLoans] = useState<Loan[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchMyBooks = useCallback(async () => {
		if (!userId) {
			setLoadError(t('myBooks.loginAgainView'))
			setIsLoading(false)
			return
		}

		try {
			const data = await get<Loan[]>(`/loans/${userId}`)
			const activeLoans = data.filter((item) => !item.isReturned)

			setLoans(activeLoans)
			setLoadError(null)
		} catch (error) {
			setLoadError(getApiErrorMessage(error, t, t('myBooks.loadError')))
		} finally {
			setIsLoading(false)
		}
	}, [t, userId])

	useEffect(() => {
		if (isAuthLoading) {
			return
		}

		void fetchMyBooks()
	}, [fetchMyBooks, isAuthLoading])

	const handleReturnLoan = async (loanId: number) => {
		if (!userId) {
			notify.error(t('myBooks.loginAgainReturn'))
			return
		}

		try {
			await post<void>(`/loans/${loanId}/return`)
			notify.success(t('myBooks.returnSuccess'))
			await fetchMyBooks()
		} catch (error) {
			notify.error(getApiErrorMessage(error, t, t('myBooks.returnError')))
		}
	}

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<div className="header-button-group">
					<button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
						{t('myBooks.backToDashboard')}
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/books')}>
						{t('myBooks.browseAllBooks')}
					</button>

					<button className="login-btn user-btn reservation-nav-btn" onClick={() => navigate('/my-reservations')}>
						{t('myBooks.myReservations')}
					</button>
				</div>
			</div>

			<div className="books-container">
				<h2>{t('myBooks.title')}</h2>

				{isLoading && <p>{t('myBooks.loading')}</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && loans.length === 0 && <p>{t('myBooks.empty')}</p>}

				{!isLoading && !loadError && loans.length > 0 && (
					<div className="entity-grid">
						{loans.map((loan) => (
							<div key={loan.id} className="entity-card">
								<BookCoverImage title={loan.book.title} coverImageUrl={loan.book.coverImageUrl} />

								<h3 className="entity-card-title">{loan.book.title}</h3>

								<p className="entity-card-detail">
									<strong>{t('book.author')}:</strong> {loan.book.author || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('book.genre')}:</strong> {loan.book.genre || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('book.isbn')}:</strong> {loan.book.isbn || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('myBooks.loanedOn')}:</strong> {formatDate(loan.loanDate, i18n.language)}
								</p>

								<p className="entity-card-detail entity-card-detail-danger">
									<strong>{t('myBooks.dueDate')}:</strong> {formatDate(loan.dueDate, i18n.language)}
								</p>

								<p className="book-status status-loaned">{t('myBooks.currentlyLoaned')}</p>

								<div className="entity-card-actions">
									<button className="login-btn danger-btn" onClick={() => handleReturnLoan(loan.id)}>
										{t('myBooks.returnBook')}
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
