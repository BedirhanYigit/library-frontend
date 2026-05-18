import type { ChangeEvent, SubmitEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book } from '../models/types.ts'
import type { BookRequest } from '../models/request.types'
import { get, post, put } from '../api/http'
import TextField from '../components/TextField.tsx'

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

	const [showForm, setShowForm] = useState<boolean>(false)

	const [editingBook, setEditingBook] = useState<Book | null>(null)
	const [formError, setFormError] = useState<string>('')
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	const [formData, setFormData] = useState<BookFormData>(emptyBookForm)

	const fetchBooks = async () => {
		setIsLoading(true)

		try {
			const data = await get<Book[]>('/books')
			setBooks(data)
		} catch (err) {
			console.error('Error fetching books:', err)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		void fetchBooks()
	}, [])

	// NEW: Defined the 'e' parameter as an Input Element Change Event
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	// NEW: Defined the 'book' parameter as a Book
	const handleEditClick = (book: Book) => {
		setFormError('')
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
		setFormError('')
		setEditingBook(null)
		setFormData(emptyBookForm)
		setShowForm(true)
	}

	const handleCancelForm = () => {
		setShowForm(false)
		setEditingBook(null)
		setFormError('')
	}

	// NEW: Defined the 'e' parameter as a Form Submission Event
	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)
		setFormError('')

		const totalCopies = Number(formData.numOfTotalCopies)

		if (!Number.isInteger(totalCopies) || totalCopies < 1) {
			setFormError('Total number of copies must be at least 1.')
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

				setShowForm(false)
				setFormData(emptyBookForm)
				await fetchBooks()
			} else {
				await post<Book, BookRequest>('/books', payload)
				setShowForm(false)
				setFormData(emptyBookForm)
				await fetchBooks()
			}
		} catch {
			setFormError(editingBook ? 'Failed to update the book. Check backend logs.' : 'Failed to add the book.')
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
						{formError && <div className="error-message">{formError}</div>}

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
				{isLoading ? (
					<p>Loading...</p>
				) : (
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
