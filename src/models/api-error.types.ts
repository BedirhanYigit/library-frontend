export type ApiErrorDomain = 'BOOK' | 'LOAN' | 'RESERVATION' | 'USER' | 'GENERAL'

export interface ApiValidationError {
	domain: ApiErrorDomain
	code: string
	message: string
}

export interface ApiErrorResponse {
	domain: ApiErrorDomain
	code: string
	message: string
	errors: ApiValidationError[]
}

export enum BookApiErrorCode {
	IsbnAlreadyExists = 'ISBN_ALREADY_EXISTS',
	TotalCopiesBelowLoanedCopies = 'TOTAL_COPIES_BELOW_LOANED_COPIES',
}
