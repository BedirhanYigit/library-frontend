import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Loan } from '../models/types'
import { get, post } from '../api/http'

// NEW: Define the shape of our action messages (just like we did in BooksPage)
interface ActionMessage {
	text: string
	type: 'success' | 'error' | ''
}

const MyBooksPage: React.FC = () => {
	const navigate = useNavigate()

	// NEW: Strongly type our states
	const [loanedItems, setLoanedItems] = useState<Loan[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<ActionMessage>({ text: '', type: '' })

	const userId = localStorage.getItem('userId')

	const fetchMyBooks = async () => {
		if (!userId) {
			setError('User ID not found. Please log in again.')
			setIsLoading(false)
			return
		}

		setIsLoading(true)

		try {
			const data = await get<Loan[]>(`/get-loans/${userId}`)
			const activeLoans = data.filter((item) => !item.returned)

			setLoanedItems(activeLoans)
			setError(null)
		} catch (err) {
			setError('Could not load your books. Is your backend running?')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchMyBooks()
	}, [userId])

	const handleReturnBook = async (bookId: number) => {
		setActionMessage({ text: '', type: '' })

		if (!userId) {
			setActionMessage({ text: 'User ID not found. Please log in again.', type: 'error' })
			return
		}

		try {
			await post<void>(`/return-book/${userId}/${bookId}`)
			setActionMessage({ text: 'Book returned successfully!', type: 'success' })
		} catch {
			setActionMessage({
				text: 'Network error. Could not connect to the server.',
				type: 'error',
			})
		}
	}

	return (
		<div className="page-wrapper">
			<div className="books-header-actions" style={{ display: 'flex', alignItems: 'center' }}>
				<div style={{ display: 'flex', gap: '10px' }}>
					<button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
						Back to Dashboard
					</button>
					<button className="login-btn user-btn" onClick={() => navigate('/books')}>
						Browse All Books
					</button>
					<button
						className="login-btn user-btn"
						style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
						onClick={() => navigate('/my-reservations')}
					>
						My Reservations
					</button>
				</div>
			</div>

			<div className="books-container">
				<h2>My Loaned Books</h2>

				{actionMessage.text && (
					<div
						className={actionMessage.type === 'error' ? 'error-message' : 'success-message'}
						style={{
							marginBottom: '20px',
							padding: '15px',
							borderRadius: '8px',
							backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fef2f2',
							color: actionMessage.type === 'success' ? '#166534' : '#ef4444',
							fontWeight: 'bold',
						}}
					>
						{actionMessage.text}
					</div>
				)}

				{isLoading && <p>Loading your books...</p>}
				{error && <p className="error-message">{error}</p>}

				{!isLoading && !error && loanedItems.length === 0 && (
					<p>You haven't loaned any books yet. Go browse the catalog!</p>
				)}

				{!isLoading && !error && loanedItems.length > 0 && (
					<div className="books-grid">
						{loanedItems.map((item) => (
							<div key={item.id} className="book-card">
								<h3 className="book-title">{item.bookTitle}</h3>

								<p className="book-detail">
									<strong>Author:</strong> {item.author || 'N/A'}
								</p>

								<p className="book-detail">
									<strong>Genre:</strong> {item.genre || 'N/A'}
								</p>

								<p className="book-detail">
									<strong>ISBN:</strong> {item.isbn || 'N/A'}
								</p>

								<p className="book-detail">
									<strong>Loaned On:</strong> {item.loanDate}
								</p>

								<p className="book-detail" style={{ color: '#ef4444' }}>
									<strong>Due Date:</strong> {item.dueDate}
								</p>

								<p className="book-status status-loaned">CURRENTLY LOANED</p>

								<div style={{ marginTop: '20px' }}>
									<button
										className="login-btn back-btn"
										style={{
											width: '100%',
											padding: '10px',
											backgroundColor: '#ef4444',
											color: 'white',
											borderColor: '#ef4444',
											fontWeight: 'bold',
											cursor: 'pointer',
										}}
										onClick={() => handleReturnBook(item.bookId)}
									>
										Return Book
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
