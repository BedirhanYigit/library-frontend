const BASE_URL = 'http://localhost:8080'

type RequestParams = Record<string, string | number | boolean>

function createUrl(path: string, params?: RequestParams): string {
	const url = new URL(`${BASE_URL}${path}`)

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, String(value))
		})
	}

	return url.toString()
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return (await response.json()) as Promise<T>
}

export async function get<T>(path: string, params?: RequestParams): Promise<T> {
	const response = await fetch(createUrl(path, params))

	return handleResponse<T>(response)
}

export async function post<TResponse, TBody = unknown>(path: string, body?: TBody): Promise<TResponse> {
	const response = await fetch(createUrl(path), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: body ? JSON.stringify(body) : null,
	})

	return handleResponse<TResponse>(response)
}

export async function put<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
	const response = await fetch(createUrl(path), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})

	return handleResponse<TResponse>(response)
}

export async function deleteRequest<T>(path: string): Promise<T> {
	const response = await fetch(createUrl(path), {
		method: 'DELETE',
	})

	return handleResponse<T>(response)
}
