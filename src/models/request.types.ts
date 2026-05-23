export interface BookRequest {
	title: string
	author: string
	isbn: string
	genre: string
	numOfTotalCopies: number
	removeCoverImage?: boolean
}

export interface LoanRequest {
	bookId: number
	userId: number
}

export interface ReservationRequest {
	userId: number
	bookId: number
}

export interface CreateUserRequest {
	name: string
	email: string
	password: string
	phoneNumber: string
	address: string
}
