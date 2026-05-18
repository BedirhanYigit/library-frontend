import type { ChangeEvent, SubmitEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book } from '../models/types.ts'
import type { BookRequest } from '../models/request.types'
import { get, post, put } from '../api/http'
import TextField from '../components/TextField.tsx'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'

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

	const [books, setBooks] = useState<Book[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	const [showForm, setShowForm] = useState<boolean>(false)
	const [editingBook, setEditingBook] = useState<Book | null>(null)
	const [formMessage, setFormMessage] = useState<StatusMessageType>(null)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	const [formData, setFormData] = useState<BookFormData>(emptyBookForm)

	const fetchBooks = async () => {
		setIsLoading(true)

		try {
			const data = await get<Book[]>('/books')
			setBooks(data)
			setLoadError(null)
		} catch (err) {
			console.error('Error fetching books:', err)
			setLoadError('Could not load books. Is your backend running?')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		void fetchBooks()
	}, [])

	const setFormErrorMessage = (message: string) => {
		setFormMessage({ type: 'error', text: message })
	}

	const clearFormMessage = () => {
		setFormMessage(null)
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleEditClick = (book: Book) => {
		clearFormMessage()
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
		clearFormMessage()
		setEditingBook(null)
		setFormData(emptyBookForm)
		setShowForm(true)
	}

	const handleCancelForm = () => {
		setShowForm(false)
		setEditingBook(null)
		clearFormMessage()
	}

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)
		clearFormMessage()

		const totalCopies = Number(formData.numOfTotalCopies)

		if (!Number.isInteger(totalCopies) || totalCopies < 1) {
			setFormErrorMessage('Total number of copies must be at least 1.')
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
			} else {
				await post<Book, BookRequest>('/books', payload)
			}

			setShowForm(false)
			setEditingBook(null)
			setFormData(emptyBookForm)
			await fetchBooks()
		} catch {
			setFormErrorMessage(editingBook ? 'Failed to update the book. Check backend logs.' : 'Failed to add the book.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<button className="login-btn back-btn" onClick={() => navigate('/admin-dashboard')}>
					Back to Admin Dashboard
				</button>

				<button className="login-btn admin-btn" onClick={handleAddNewClick}>
					+ Add New Book
				</button>
			</div>

			{showForm && (
				<div className="admin-form-container">
					<h2>{editingBook ? 'Update Book Details' : 'Add New Book'}</h2>

					<form className="login-form" onSubmit={handleSubmit}>
						<StatusMessage message={formMessage} />

						<TextField label="Title" name="title" value={formData.title} onChange={handleInputChange} required />

						<TextField label="Author" name="author" value={formData.author} onChange={handleInputChange} required />

						<TextField label="Genre" name="genre" value={formData.genre} onChange={handleInputChange} />

						<TextField label="ISBN" name="isbn" value={formData.isbn} onChange={handleInputChange} required />

						<TextField
							label="Total Number of Copies"
							name="numOfTotalCopies"
							type="number"
							value={formData.numOfTotalCopies}
							onChange={handleInputChange}
							min={1}
							required
						/>

						<TextField
							label="Cover Image URL"
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
								Cancel
							</button>

							<button type="submit" className="login-btn admin-btn" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : editingBook ? 'Save Changes' : 'Create Book'}
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="books-container books-container-spaced">
				<h2>Library Inventory</h2>

				{isLoading && <p>Loading...</p>}
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
									<strong>Available:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}
								</p>

								<div className="entity-card-actions">
									<button
										className="login-btn user-btn full-width-button compact-button"
										onClick={() => handleEditClick(book)}
									>
										Update Details
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
