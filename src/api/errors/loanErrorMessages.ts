import { LoanApiErrorCode } from '../../models/api-error.types'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

const loanErrorMessageKeys: Record<LoanApiErrorCode, string> = {
	[LoanApiErrorCode.NotFound]: 'apiErrors.loan.notFound',
	[LoanApiErrorCode.OpenLoanAlreadyExists]: 'apiErrors.loan.openLoanAlreadyExists',
	[LoanApiErrorCode.BookNotAvailable]: 'apiErrors.loan.bookNotAvailable',
}

export function getLoanErrorMessage(code: string, t: TranslationFunction): string | null {
	if (!isLoanApiErrorCode(code)) {
		return null
	}

	return t(loanErrorMessageKeys[code])
}

function isLoanApiErrorCode(code: string): code is LoanApiErrorCode {
	return Object.values(LoanApiErrorCode).includes(code as LoanApiErrorCode)
}
