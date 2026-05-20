import type { ApiErrorResponse } from '../../models/api-error.types.ts'
import { ApiError } from '../ApiError.ts'
import { getBookErrorMessage } from './bookErrorMessages.ts'
import { getGeneralErrorMessage } from './generalErrorMessages.ts'
import { getAuthErrorMessage } from './authErrorMessages.ts'
import { getUserErrorMessage } from './userErrorMessages.ts'
import { getLoanErrorMessage } from './loanErrorMessages.ts'
import { getReservationErrorMessage } from './reservationErrorMessages.ts'

const defaultFallbackMessage = 'Something went wrong. Please try again later.'

function getApiErrorResponse(error: unknown): ApiErrorResponse | null {
	if (error instanceof ApiError) {
		return error.response
	}

	return null
}

export function getApiErrorMessage(error: unknown, fallback = defaultFallbackMessage): string {
	const response = getApiErrorResponse(error)

	if (!response) {
		return fallback
	}

	const domainMessage = getDomainErrorMessage(response)

	if (domainMessage) {
		return domainMessage
	}

	const generalMessage = getGeneralErrorMessage(response.code)

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

function getDomainErrorMessage(response: ApiErrorResponse): string | null {
	switch (response.domain) {
		case 'AUTH':
			return getAuthErrorMessage(response.code)

		case 'BOOK':
			return getBookErrorMessage(response.code)

		case 'LOAN':
			return getLoanErrorMessage(response.code)

		case 'RESERVATION':
			return getReservationErrorMessage(response.code)

		case 'USER':
			return getUserErrorMessage(response.code)

		case 'GENERAL':
			return getGeneralErrorMessage(response.code)

		default:
			return null
	}
}
