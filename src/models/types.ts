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
	isReturned: boolean
}

export interface Reservation {
	id: number
	reservationDate: string

	book: ReservationBook
	user: ReservationUser
}

export interface ReservationBook {
	bookId: number
	title: string
	author?: string
	genre?: string
	isbn: string
}

export interface ReservationUser {
	userId: number
	userName: string
}
