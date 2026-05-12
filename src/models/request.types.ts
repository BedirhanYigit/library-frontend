export interface BookRequest {
	title: string
	author: string
	isbn: string
	genre: string
	numOfTotalCopies: number
	coverImageUrl: string
}

export interface LoginRequest {
	email: string
	password: string
}
