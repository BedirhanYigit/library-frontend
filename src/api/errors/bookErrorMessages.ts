import { BookApiErrorCode } from '../../models/api-error.types'

const bookErrorMessages: Record<BookApiErrorCode, string> = {
	[BookApiErrorCode.NotFound]: 'The selected book could not be found.',
	[BookApiErrorCode.IsbnAlreadyExists]: 'A book with this ISBN already exists.',
	[BookApiErrorCode.TotalCopiesBelowLoanedCopies]: 'Total copies cannot be lower than currently loaned copies.',
}

export function getBookErrorMessage(code: string): string | null {
	if (!isBookApiErrorCode(code)) {
		return null
	}

	return bookErrorMessages[code]
}

function isBookApiErrorCode(code: string): code is BookApiErrorCode {
	return Object.values(BookApiErrorCode).includes(code as BookApiErrorCode)
}
