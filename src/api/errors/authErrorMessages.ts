import { AuthApiErrorCode } from '../../models/api-error.types'

const authErrorMessages: Record<AuthApiErrorCode, string> = {
	[AuthApiErrorCode.EmailAlreadyExists]: 'An account with this email already exists.',
	[AuthApiErrorCode.InvalidCredentials]: 'Invalid email or password.',
}

export function getAuthErrorMessage(code: string): string | null {
	if (!isAuthApiErrorCode(code)) {
		return null
	}

	return authErrorMessages[code]
}

function isAuthApiErrorCode(code: string): code is AuthApiErrorCode {
	return Object.values(AuthApiErrorCode).includes(code as AuthApiErrorCode)
}
