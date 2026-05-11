import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book } from '../models/types.ts'

interface BookFormData {
  title: string
  author: string
  isbn: string
  genre: string
  numOfTotalCopies: string | number
  numOfCopiesAvailable: number
  coverImageUrl: string
}

function AdminBooksPage() {
  const navigate = useNavigate()

  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [showForm, setShowForm] = useState<boolean>(false)

  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formError, setFormError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    numOfCopiesAvailable: 0,
    numOfTotalCopies: 0,
    coverImageUrl: '',
  })

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8080/get-all-books')
      if (response.ok) {
        // NEW: Tell TS that the parsed JSON is an array of Books
        const data: Book[] = await response.json()
        setBooks(data)
      }
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // NEW: Defined the 'e' parameter as an Input Element Change Event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      genre: book.genre || '',
      numOfTotalCopies: book.numOfTotalCopies || '',
      coverImageUrl: book.coverImageUrl || '',
    })

    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddNewClick = () => {
    setFormError('')
    setEditingBook(null)
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      numOfTotalCopies: '',
      coverImageUrl: '',
    })
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingBook(null)
    setFormError('')
  }

  // NEW: Defined the 'e' parameter as a Form Submission Event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    const payload = {
      ...formData,
      numOfTotalCopies: parseInt(formData.numOfTotalCopies as string, 10),
    }

    try {
      if (editingBook) {
        const response = await fetch(`http://localhost:8080/update-book/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          setShowForm(false)
          fetchBooks()
        } else {
          setFormError('Failed to update the book. Check backend logs.')
        }
      } else {
        const response = await fetch('http://localhost:8080/create-book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          setShowForm(false)
          fetchBooks()
        } else {
          setFormError('Failed to add the book.')
        }
      }
    } catch (error) {
      setFormError('Network error. Is your Spring Boot backend running?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="books-header-actions">
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

            <div className="input-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Genre</label>
              <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Total Number of Copies *</label>
              <input
                type="number"
                name="numOfTotalCopies"
                value={formData.numOfTotalCopies}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="input-group">
              <label>Cover Image URL (Optional)</label>
              <input
                type="url"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

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
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-detail">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="book-detail">
                  <strong>Genre:</strong> {book.genre || 'N/A'}
                </p>
                <p className="book-detail">
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p className="book-detail">
                  <strong>Available:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}
                </p>

                <div style={{ marginTop: '20px' }}>
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
