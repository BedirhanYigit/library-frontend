import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book } from '../models/types'

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

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8080/get-all-books')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      // NEW: Tell TS this data matches the Book[] shape
      const data: Book[] = await response.json()
      setBooks(data)
      setError(null)
    } catch (_) {
      setError("Could not load books. Is your backend running?")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchBooks()
  }, [])

  // NEW: Add 'number' type to the bookId parameter
  const handleLoanBook = async (bookId: number) => {
    setActionMessage({ text: '', type: '' })
    const userId = localStorage.getItem('userId')
    if (!userId) return setActionMessage({ text: 'Error: User ID missing. Please log in.', type: 'error' })

    try {
      const response = await fetch(`http://localhost:8080/create-loan-userId-bookId/${userId}/${bookId}`, { method: 'POST' })
      if (response.ok) {
        setActionMessage({ text: 'Book loaned successfully!', type: 'success' })
        await fetchBooks()
      } else {
        setActionMessage({ text: 'Failed to loan book. You may have reached your limit.', type: 'error' })
      }
    } catch (_) {
      setActionMessage({ text: 'Network error.', type: 'error' })
    }
  }

  // NEW: Add 'number' type to the bookId parameter
  const handleReserveBook = async (bookId: number) => {
    setActionMessage({ text: '', type: '' })
    const userId = localStorage.getItem('userId')
    if (!userId) return setActionMessage({ text: 'Error: User ID missing. Please log in.', type: 'error' })

    try {
      const response = await fetch(`http://localhost:8080/make-reservation/${userId}/${bookId}`, { method: 'POST' })
      if (response.ok) {
        setActionMessage({ text: 'Book reserved successfully! You will be notified when it is available.', type: 'success' })
        await fetchBooks()
      } else {
        setActionMessage({ text: 'Failed to reserve book. You might already have a reservation for this.', type: 'error' })
      }
    } catch (_) {
      setActionMessage({ text: 'Network error.', type: 'error' })
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

  return (
    <div className="page-wrapper">
      <div className="books-header-actions" style={{ display: 'flex', alignItems: 'center' }}>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          <button className="login-btn user-btn" onClick={() => navigate('/my-books')}>My Books</button>
          <button className="login-btn user-btn" style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }} onClick={() => navigate('/my-reservations')}>
            My Reservations
          </button>
        </div>

        <div className="sort-container" style={{ marginLeft: 'auto' }}>
          <label htmlFor="sort">Sort by: </label>
          <select id="sort" className="sort-select" value={sortOption} onChange={handleSortChange} disabled={isLoading || error !== null}>
            <option value="" disabled>Select option...</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="author-asc">Author Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="books-container">
        <h2>Library Books</h2>

        {actionMessage.text && (
          <div className={actionMessage.type === 'error' ? 'error-message' : 'success-message'}
               style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px',
                        backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fef2f2',
                        color: actionMessage.type === 'success' ? '#166534' : '#ef4444', fontWeight: 'bold' }}>
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
                {/* FIX: Corrected typo 'autasdasdhor' to 'author' */}
                <p className="book-detail"><strong>Author:</strong> {book.author}</p>
                <p className="book-detail"><strong>Genre:</strong> {book.genre}</p>
                <p className="book-detail"><strong>ISBN:</strong> {book.isbn}</p>
                <p className="book-detail"><strong>Available Copies:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}</p>

                <p className={`book-status status-${book.available ? 'available' : 'loaned'}`}>
                  {book.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                </p>

                <div style={{ marginTop: '20px' }}>
                  {book.available ? (
                    <button
                      className="login-btn user-btn"
                      style={{ width: '100%', padding: '10px' }}
                      onClick={() => handleLoanBook(book.id)}
                    >
                      Loan Book
                    </button>
                  ) : (
                    <button
                      className="login-btn"
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#f59e0b',
                        borderColor: '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                      onClick={() => handleReserveBook(book.id)}
                    >
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
