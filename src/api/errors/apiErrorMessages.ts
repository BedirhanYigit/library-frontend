import type { ApiErrorResponse } from '../../models/api-error.types.ts'
import { ApiError } from '../ApiError.ts'
import { getBookErrorMessage } from './bookErrorMessages.ts'

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

	const mappedMessage = getDomainErrorMessage(response)

	if (mappedMessage) {
		return mappedMessage
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
		case 'BOOK':
			return getBookErrorMessage(response.code)

		default:
			return null
	}
}
