import { AuthApiErrorCode } from '../../models/api-error.types'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

const authErrorMessageKeys: Record<AuthApiErrorCode, string> = {
	[AuthApiErrorCode.EmailAlreadyExists]: 'apiErrors.auth.emailAlreadyExists',
	[AuthApiErrorCode.InvalidCredentials]: 'apiErrors.auth.invalidCredentials',
	[AuthApiErrorCode.AuthenticationRequired]: 'apiErrors.auth.authenticationRequired',
	[AuthApiErrorCode.AdminAccessRequired]: 'apiErrors.auth.adminAccessRequired',
}

export function getAuthErrorMessage(code: string, t: TranslationFunction): string | null {
	if (!isAuthApiErrorCode(code)) {
		return null
	}

	return t(authErrorMessageKeys[code])
}

function isAuthApiErrorCode(code: string): code is AuthApiErrorCode {
	return Object.values(AuthApiErrorCode).includes(code as AuthApiErrorCode)
}
