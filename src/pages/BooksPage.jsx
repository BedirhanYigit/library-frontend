import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BooksPage() {
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [sortOption, setSortOption] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state to show success/error messages when loaning
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // Extracted fetch function so we can reuse it to refresh the data
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/get-all-books'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Could not load books. Is your backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // --- NEW: Handle Loaning a Book ---
  const handleLoanBook = async (bookId) => {
    setActionMessage({ text: '', type: '' }); // clear old messages
    
    // 1. Get the logged-in user's ID from localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setActionMessage({ text: 'Error: Could not find your User ID. Please log out and log back in.', type: 'error' });
      return;
    }

    try {
      // 2. Make the POST request to your backend
      const response = await fetch(`http://localhost:8080/create-loan-userId-bookId/${userId}/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // If your LoanRequestDTO requires specific fields (like dates), add them here!
        // Otherwise, sending an empty object is fine if the backend handles the rest.
        body: JSON.stringify({}) 
      });

      if (response.ok) {
        setActionMessage({ text: 'Book loaned successfully!', type: 'success' });
        fetchBooks(); // Refresh the books list so the "Available Copies" updates immediately
      } else {
        setActionMessage({ text: 'Failed to loan book. It might be unavailable or you reached your limit.', type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: 'Network error. Could not connect to the server.', type: 'error' });
    }
  };

  // Sorting Logic
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedBooks = [...books];
    if (option === 'title-asc') {
      sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === 'title-desc') {
      sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (option === 'author-asc') {
      sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
    }
    setBooks(sortedBooks);
  };

  return (
    <div className="page-wrapper">
      <div className="books-header-actions">
        <button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
        
        <div className="sort-container">
          <label htmlFor="sort">Sort by: </label>
          <select 
            id="sort" 
            className="sort-select" 
            value={sortOption} 
            onChange={handleSortChange}
            disabled={isLoading || error}
          >
            <option value="" disabled>Select option...</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="author-asc">Author Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="books-container">
        <h2>Library Books</h2>
        
        {/* Display Success or Error Messages for Loaning */}
        {actionMessage.text && (
          <div className={actionMessage.type === 'error' ? 'error-message' : 'success-message'} 
               style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', 
                        backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fef2f2',
                        color: actionMessage.type === 'success' ? '#166534' : '#ef4444',
                        fontWeight: 'bold' }}>
            {actionMessage.text}
          </div>
        )}
        
        {isLoading && <p>Loading books from database...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!isLoading && !error && books.length === 0 && (
          <p>No books found in the library database.</p>
        )}

        {!isLoading && !error && books.length > 0 && (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-detail"><strong>Author:</strong> {book.author}</p>
                <p className="book-detail"><strong>Genre:</strong> {book.genre}</p>
                <p className="book-detail"><strong>ISBN:</strong> {book.isbn}</p>
                <p className="book-detail"><strong>Available Copies:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}</p>
                
                <p className={`book-status status-${book.available ? 'available' : 'loaned'}`}>
                  {book.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                </p>

                {/* NEW: Loan Button */}
                <div style={{ marginTop: '20px' }}>
                  <button 
                    className="login-btn user-btn" 
                    style={{ 
                      width: '100%', 
                      padding: '10px',
                      opacity: book.available ? 1 : 0.5,
                      cursor: book.available ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => handleLoanBook(book.id)}
                    disabled={!book.available} // Prevent clicking if no copies are left
                  >
                    {book.available ? 'Loan Book' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;