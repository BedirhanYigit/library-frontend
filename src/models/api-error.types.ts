export type ApiErrorDomain = 'AUTH' | 'BOOK' | 'LOAN' | 'RESERVATION' | 'USER' | 'GENERAL'

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

export enum AuthApiErrorCode {
	EmailAlreadyExists = 'EMAIL_ALREADY_EXISTS',
	InvalidCredentials = 'INVALID_CREDENTIALS',
	AuthenticationRequired = 'AUTHENTICATION_REQUIRED',
	AdminAccessRequired = 'ADMIN_ACCESS_REQUIRED',
}

export enum BookApiErrorCode {
	NotFound = 'NOT_FOUND',
	IsbnAlreadyExists = 'ISBN_ALREADY_EXISTS',
	TotalCopiesBelowLoanedCopies = 'TOTAL_COPIES_BELOW_LOANED_COPIES',
	
}

export enum UserApiErrorCode {
	NotFound = 'NOT_FOUND',
}

export enum LoanApiErrorCode {
	NotFound = 'NOT_FOUND',
	OpenLoanAlreadyExists = 'OPEN_LOAN_ALREADY_EXISTS',
	BookNotAvailable = 'BOOK_NOT_AVAILABLE',
}

export enum ReservationApiErrorCode {
	NotFound = 'NOT_FOUND',
	ReservationAlreadyExists = 'RESERVATION_ALREADY_EXISTS',
}

export enum GeneralApiErrorCode {
	RequestValidationFailed = 'REQUEST_VALIDATION_FAILED',
	RequestFieldInvalid = 'REQUEST_FIELD_INVALID',
	InternalServerError = 'INTERNAL_SERVER_ERROR',
}
