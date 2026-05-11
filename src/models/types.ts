export interface Book {
  id: number
  title: string
  author: string
  genre?: string
  isbn: string
  numOfTotalCopies: number
  numOfCopiesAvailable: number
  coverImageUrl?: string
}

export interface User {
  id: number
  name: string
  email: string
  phoneNumber?: string
  address?: string
  role?: string
}

export interface Loan {
  id: number
  bookId: number

  bookTitle: string
  author?: string
  genre?: string
  isbn?: string

  userId: number
  userName: string

  loanDate: string
  dueDate: string
  returnDate: string | null
  returned: boolean
}

export interface Reservation {
  id: number
  bookId: number
  bookTitle: string
  userId: number
  userName: string
  reservationDate: string
  author?: string
  genre?: string
  isbn?: string
  book?: Book
}
