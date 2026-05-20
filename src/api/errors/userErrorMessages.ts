import { UserApiErrorCode } from '../../models/api-error.types'

const userErrorMessages: Record<UserApiErrorCode, string> = {
	[UserApiErrorCode.NotFound]: 'The selected user could not be found.',
}

export function getUserErrorMessage(code: string): string | null {
	if (!isUserApiErrorCode(code)) {
		return null
	}

	return userErrorMessages[code]
}

function isUserApiErrorCode(code: string): code is UserApiErrorCode {
	return Object.values(UserApiErrorCode).includes(code as UserApiErrorCode)
}
