import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Book } from '../models/types.ts'
import type { BookRequest } from '../models/request.types.ts'
import { get, postFormData, putFormData } from '../api/http.ts'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { useAuth } from '../auth/useAuth.ts'
import { notify } from '../components/notifications/notify.tsx'
import BookFormModal from '../components/books/BookFormModal.tsx'
import BookCoverImage from '../components/books/BookCoverImage.tsx'

function createBookFormData(payload: BookRequest, coverImage: File | null): FormData {
	const formData = new FormData()

	formData.append(
		'book',
		new Blob([JSON.stringify(payload)], {
			type: 'application/json',
		}),
	)

	if (coverImage) {
		formData.append('coverImage', coverImage)
	}

	return formData
}

function AdminBooksPage() {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const [books, setBooks] = useState<Book[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const [selectedBook, setSelectedBook] = useState<Book | null>(null)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	const { isLoading: isAuthLoading } = useAuth()

	const fetchBooks = useCallback(async () => {
		setIsLoading(true)

		try {
			const data = await get<Book[]>('/books')
			setBooks(data)
			setLoadError(null)
		} catch (error) {
			console.error('Error fetching books:', error)
			setLoadError(getApiErrorMessage(error, t, t('adminBooks.loadError')))
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		if (isAuthLoading) {
			return
		}

		void fetchBooks()
	}, [fetchBooks, isAuthLoading])

	const handleAddNewClick = () => {
		setSelectedBook(null)
		setIsModalOpen(true)
	}

	const handleEditClick = (book: Book) => {
		setSelectedBook(book)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		if (isSubmitting) {
			return
		}

		setIsModalOpen(false)
		setSelectedBook(null)
	}

	const handleSubmitBook = async (payload: BookRequest, coverImage: File | null) => {
		if (!Number.isInteger(payload.numOfTotalCopies) || payload.numOfTotalCopies < 1) {
			notify.error(t('adminBooks.totalCopiesValidation'))
			return
		}

		setIsSubmitting(true)

		const formData = createBookFormData(payload, coverImage)

		try {
			if (selectedBook) {
				await putFormData<Book>(`/books/${selectedBook.id}`, formData)
				notify.success(t('adminBooks.updateSuccess'))
			} else {
				await postFormData<Book>('/books', formData)
				notify.success(t('adminBooks.createSuccess'))
			}

			setIsModalOpen(false)
			setSelectedBook(null)
			await fetchBooks()
		} catch (error) {
			const fallbackMessage = selectedBook ? t('adminBooks.updateError') : t('adminBooks.createError')
			notify.error(getApiErrorMessage(error, t, fallbackMessage))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<button className="login-btn back-btn" onClick={() => navigate('/admin-dashboard')}>
					{t('adminBooks.backToDashboard')}
				</button>

				<button className="login-btn admin-btn" onClick={handleAddNewClick}>
					{t('adminBooks.addNewBook')}
				</button>
			</div>

			{isModalOpen && (
				<BookFormModal
					book={selectedBook}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmitBook}
					onClose={handleCloseModal}
				/>
			)}

			<div className="books-container books-container-spaced">
				<h2>{t('adminBooks.inventoryTitle')}</h2>

				{isLoading && <p>{t('adminBooks.loading')}</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && books.length === 0 && <p>{t('adminBooks.empty')}</p>}

				{!isLoading && !loadError && books.length > 0 && (
					<div className="entity-grid">
						{books.map((book) => {
							return (
								<div key={book.id} className="entity-card">
									<BookCoverImage title={book.title} coverImageUrl={book.coverImageUrl} />

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
										<strong>{t('book.available')}:</strong> {book.numOfCopiesAvailable} /{' '}
										{book.numOfTotalCopies}
									</p>

									<div className="entity-card-actions">
										<button
											className="login-btn user-btn full-width-button compact-button"
											onClick={() => handleEditClick(book)}
										>
											{t('adminBooks.updateDetails')}
										</button>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminBooksPage
