import { BASE_URL } from './http.ts'

export function toAssetUrl(path?: string | null): string | null {
	if (!path) {
		return null
	}

	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}

	return `${BASE_URL}${path}`
}
