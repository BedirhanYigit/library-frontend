import { BookApiErrorCode } from '../../models/api-error.types'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

const bookErrorMessageKeys: Record<BookApiErrorCode, string> = {
	[BookApiErrorCode.NotFound]: 'apiErrors.book.notFound',
	[BookApiErrorCode.IsbnAlreadyExists]: 'apiErrors.book.isbnAlreadyExists',
	[BookApiErrorCode.TotalCopiesBelowLoanedCopies]: 'apiErrors.book.totalCopiesBelowLoanedCopies',
}

export function getBookErrorMessage(code: string, t: TranslationFunction): string | null {
	if (!isBookApiErrorCode(code)) {
		return null
	}

	return t(bookErrorMessageKeys[code])
}

function isBookApiErrorCode(code: string): code is BookApiErrorCode {
	return Object.values(BookApiErrorCode).includes(code as BookApiErrorCode)
}
