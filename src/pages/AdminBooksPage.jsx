import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminBooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data State - Includes ONLY the fields you specified can be updated
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    numOfTotalCopies: '',
    coverImageUrl: ''
  });

  // Extracted fetch function so we can reuse it to refresh the list after an update
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/get-all-books'); 
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // --- Handlers ---

  // Update formData state when user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (book) => {
    setFormError('');
    setEditingBook(book);
    
    // Pre-fill the form with the selected book's data
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      genre: book.genre || '',
      numOfTotalCopies: book.numOfTotalCopies || '',
      coverImageUrl: book.coverImageUrl || ''
    });
    
    setShowForm(true);
    // Scroll to top smoothly so admin sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleAddNewClick = () => {
    setFormError('');
    setEditingBook(null);
    // Clear the form
    setFormData({ title: '', author: '', isbn: '', genre: '', numOfTotalCopies: '', coverImageUrl: '' });
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormError('');
  };

  // Form Submission (The API Call)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitting(true);
    setFormError('');

    // Ensure numeric fields are actually numbers before sending to backend
    const payload = {
      ...formData,
      numOfTotalCopies: parseInt(formData.numOfTotalCopies, 10)
    };

    try {
      if (editingBook) {
        // --- UPDATE BOOK LOGIC (PUT) ---
        // Change this URL if your specific backend update endpoint is named differently
        const response = await fetch(`http://localhost:8080/update-book/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setShowForm(false); // Hide form
          fetchBooks(); // Refresh the books list to show the new data!
        } else {
          setFormError('Failed to update the book. Check backend logs.');
        }
      } else {
        // --- ADD NEW BOOK LOGIC (POST) ---
        const response = await fetch("http://localhost:8080/create-book", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setShowForm(false);
          fetchBooks(); 
        } else {
          setFormError('Failed to add the book.');
        }
      }
    } catch (error) {
      setFormError('Network error. Is your Spring Boot backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="books-header-actions">
        <button className="login-btn back-btn" onClick={() => navigate('/admin-dashboard')}>
          Back to Admin Dashboard
        </button>
        <button className="login-btn admin-btn" onClick={handleAddNewClick} style={{ flex: 'none' }}>
          + Add New Book
        </button>
      </div>

      {/* ADD / UPDATE FORM */}
      {showForm && (
        <div className="admin-form-container">
          <h2>{editingBook ? 'Update Book Details' : 'Add New Book'}</h2>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {formError && <div className="error-message">{formError}</div>}
            
            <div className="input-group">
              <label>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            
            <div className="input-group">
              <label>Author *</label>
              <input type="text" name="author" value={formData.author} onChange={handleInputChange} required />
            </div>
            
            <div className="input-group">
              <label>Genre</label>
              <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>ISBN *</label>
              <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} required />
            </div>
            
            <div className="input-group">
              <label>Total Number of Copies *</label>
              <input type="number" name="numOfTotalCopies" value={formData.numOfTotalCopies} onChange={handleInputChange} min="1" required />
            </div>

            <div className="input-group">
              <label>Cover Image URL (Optional)</label>
              <input type="url" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleInputChange} placeholder="https://..." />
            </div>

            <div className="button-group">
              <button type="button" className="login-btn back-btn" onClick={handleCancelForm} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="login-btn admin-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingBook ? 'Save Changes' : 'Create Book')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOOKS LIST */}
      <div className="books-container" style={{ marginTop: '20px' }}>
        <h2>Library Inventory</h2>
        {isLoading ? <p>Loading...</p> : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-detail"><strong>Author:</strong> {book.author}</p>
                <p className="book-detail"><strong>Genre:</strong> {book.genre}</p>
                <p className="book-detail"><strong>ISBN:</strong> {book.isbn}</p>
                <p className="book-detail"><strong>Available:</strong> {book.numOfCopiesAvailable} / {book.numOfTotalCopies}</p>
                
                <div style={{ marginTop: '20px' }}>
                  {/* Clicking this sets the editingBook and opens the form */}
                  <button 
                    className="login-btn user-btn" 
                    style={{ width: '100%', padding: '8px' }}
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
  );
}

export default AdminBooksPage;