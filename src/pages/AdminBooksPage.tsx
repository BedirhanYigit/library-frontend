import { type ChangeEvent, type SubmitEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Book } from '../models/types.ts'
import type { BookRequest } from '../models/request.types'
import { get, post, put } from '../api/http'
import TextField from '../components/TextField.tsx'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { useAuth } from '../auth/useAuth.ts'
import { notify } from '../components/notifications/notify.tsx'

interface BookFormData {
	title: string
	author: string
	isbn: string
	genre: string
	numOfTotalCopies: string
	coverImageUrl: string
}

const emptyBookForm: BookFormData = {
	title: '',
	author: '',
	isbn: '',
	genre: '',
	numOfTotalCopies: '',
	coverImageUrl: '',
}

function AdminBooksPage() {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const [books, setBooks] = useState<Book[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const [showForm, setShowForm] = useState<boolean>(false)
	const [editingBook, setEditingBook] = useState<Book | null>(null)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	const [formData, setFormData] = useState<BookFormData>(emptyBookForm)

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

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleEditClick = (book: Book) => {
		setEditingBook(book)

		setFormData({
			title: book.title,
			author: book.author,
			isbn: book.isbn,
			genre: book.genre ?? '',
			numOfTotalCopies: String(book.numOfTotalCopies),
			coverImageUrl: book.coverImageUrl ?? '',
		})

		setShowForm(true)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleAddNewClick = () => {
		setEditingBook(null)
		setFormData(emptyBookForm)
		setShowForm(true)
	}

	const handleCancelForm = () => {
		setShowForm(false)
		setEditingBook(null)
	}

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)

		const totalCopies = Number(formData.numOfTotalCopies)

		if (!Number.isInteger(totalCopies) || totalCopies < 1) {
			notify.error(t('adminBooks.totalCopiesValidation'))
			setIsSubmitting(false)
			return
		}

		const payload: BookRequest = {
			title: formData.title.trim(),
			author: formData.author.trim(),
			isbn: formData.isbn.trim(),
			genre: formData.genre.trim(),
			numOfTotalCopies: totalCopies,
			coverImageUrl: formData.coverImageUrl.trim(),
		}

		try {
			if (editingBook) {
				await put<Book, BookRequest>(`/books/${editingBook.id}`, payload)
				notify.success(t('adminBooks.updateSuccess'))
			} else {
				await post<Book, BookRequest>('/books', payload)
				notify.success(t('adminBooks.createSuccess'))
			}

			setShowForm(false)
			setEditingBook(null)
			setFormData(emptyBookForm)
			await fetchBooks()
		} catch (error) {
			const fallbackMessage = editingBook ? t('adminBooks.updateError') : t('adminBooks.createError')
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

			{showForm && (
				<div className="admin-form-container">
					<h2>{editingBook ? t('adminBooks.updateBookDetails') : t('adminBooks.createBookTitle')}</h2>

					<form className="login-form" onSubmit={handleSubmit}>
						<TextField
							label={t('book.title')}
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							required
						/>

						<TextField
							label={t('book.author')}
							name="author"
							value={formData.author}
							onChange={handleInputChange}
							required
						/>

						<TextField label={t('book.genre')} name="genre" value={formData.genre} onChange={handleInputChange} />

						<TextField
							label={t('book.isbn')}
							name="isbn"
							value={formData.isbn}
							onChange={handleInputChange}
							required
						/>

						<TextField
							label={t('book.totalNumberOfCopies')}
							name="numOfTotalCopies"
							type="number"
							value={formData.numOfTotalCopies}
							onChange={handleInputChange}
							min={1}
							required
						/>

						<TextField
							label={t('book.coverImageUrl')}
							name="coverImageUrl"
							type="url"
							value={formData.coverImageUrl}
							onChange={handleInputChange}
							placeholder="https://..."
						/>

						<div className="button-group">
							<button
								type="button"
								className="login-btn back-btn"
								onClick={handleCancelForm}
								disabled={isSubmitting}
							>
								{t('adminBooks.cancel')}
							</button>

							<button type="submit" className="login-btn admin-btn" disabled={isSubmitting}>
								{isSubmitting
									? t('adminBooks.saving')
									: editingBook
										? t('adminBooks.saveChanges')
										: t('adminBooks.createBook')}
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="books-container books-container-spaced">
				<h2>{t('adminBooks.inventoryTitle')}</h2>

				{isLoading && <p>{t('adminBooks.loading')}</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && books.length === 0 && <p>{t('adminBooks.empty')}</p>}

				{!isLoading && !loadError && books.length > 0 && (
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
									<strong>{t('book.available')}:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}
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
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminBooksPage
