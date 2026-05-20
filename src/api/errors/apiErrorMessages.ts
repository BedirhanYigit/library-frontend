import type { ApiErrorResponse } from '../../models/api-error.types.ts'
import { ApiError } from '../ApiError.ts'
import { getBookErrorMessage } from './bookErrorMessages.ts'
import { getGeneralErrorMessage } from './generalErrorMessages.ts'
import { getAuthErrorMessage } from './authErrorMessages.ts'
import { getUserErrorMessage } from './userErrorMessages.ts'
import { getLoanErrorMessage } from './loanErrorMessages.ts'
import { getReservationErrorMessage } from './reservationErrorMessages.ts'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

function getApiErrorResponse(error: unknown): ApiErrorResponse | null {
	if (error instanceof ApiError) {
		return error.response
	}

	return null
}

export function getApiErrorMessage(error: unknown, t: TranslationFunction, fallback = t('apiErrors.defaultFallback')): string {
	const response = getApiErrorResponse(error)

	if (!response) {
		return fallback
	}

	const domainMessage = getDomainErrorMessage(response, t)

	if (domainMessage) {
		return domainMessage
	}

	const generalMessage = getGeneralErrorMessage(response.code, t)

	if (generalMessage) {
		return generalMessage
	}

	if (response.message) {
		return response.message
	}

	const firstNestedError = response.errors[0]

	if (firstNestedError?.message) {
		return firstNestedError.message
	}

	return fallback
}

function getDomainErrorMessage(response: ApiErrorResponse, t: TranslationFunction): string | null {
	switch (response.domain) {
		case 'AUTH':
			return getAuthErrorMessage(response.code, t)

		case 'BOOK':
			return getBookErrorMessage(response.code, t)

		case 'LOAN':
			return getLoanErrorMessage(response.code, t)

		case 'RESERVATION':
			return getReservationErrorMessage(response.code, t)

		case 'USER':
			return getUserErrorMessage(response.code, t)

		case 'GENERAL':
			return getGeneralErrorMessage(response.code, t)

		default:
			return null
	}
}
