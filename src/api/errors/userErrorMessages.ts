import { UserApiErrorCode } from '../../models/api-error.types'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

const userErrorMessageKeys: Record<UserApiErrorCode, string> = {
	[UserApiErrorCode.NotFound]: 'apiErrors.user.notFound',
}

export function getUserErrorMessage(code: string, t: TranslationFunction): string | null {
	if (!isUserApiErrorCode(code)) {
		return null
	}

	return t(userErrorMessageKeys[code])
}

function isUserApiErrorCode(code: string): code is UserApiErrorCode {
	return Object.values(UserApiErrorCode).includes(code as UserApiErrorCode)
}
