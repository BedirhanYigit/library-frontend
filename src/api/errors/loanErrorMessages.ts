import { LoanApiErrorCode } from '../../models/api-error.types'

const loanErrorMessages: Record<LoanApiErrorCode, string> = {
	[LoanApiErrorCode.NotFound]: 'The selected loan could not be found.',
	[LoanApiErrorCode.OpenLoanAlreadyExists]: 'You already have an active loan for this book.',
	[LoanApiErrorCode.BookNotAvailable]: 'This book is currently not available. You can reserve it instead.',
}

export function getLoanErrorMessage(code: string): string | null {
	if (!isLoanApiErrorCode(code)) {
		return null
	}

	return loanErrorMessages[code]
}

function isLoanApiErrorCode(code: string): code is LoanApiErrorCode {
	return Object.values(LoanApiErrorCode).includes(code as LoanApiErrorCode)
}
