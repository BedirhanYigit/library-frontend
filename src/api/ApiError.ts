import type { ApiErrorResponse } from '../models/api-error.types'

export class ApiError extends Error {
	status: number
	response: ApiErrorResponse | null

	constructor(status: number, response: ApiErrorResponse | null) {
		super(response?.message || `Request failed with status ${status}`)

		this.name = 'ApiError'
		this.status = status
		this.response = response
	}
}
