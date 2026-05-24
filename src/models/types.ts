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

	book: Book,
	user: User,

	loanDate: string
	dueDate: string
	returnDate: string | null
	isReturned: boolean
}

export interface Reservation {
	id: number
	reservationDate: string

	book: Book
	user: User
}
