import { GeneralApiErrorCode } from '../../models/api-error.types'

const generalErrorMessages: Record<GeneralApiErrorCode, string> = {
	[GeneralApiErrorCode.RequestValidationFailed]: 'The request contains invalid data.',
	[GeneralApiErrorCode.RequestFieldInvalid]: 'One of the submitted fields is invalid.',
	[GeneralApiErrorCode.InternalServerError]: 'An unexpected server error occurred. Please try again later.',
}

export function getGeneralErrorMessage(code: string): string | null {
	if (!isGeneralApiErrorCode(code)) {
		return null
	}

	return generalErrorMessages[code]
}

function isGeneralApiErrorCode(code: string): code is GeneralApiErrorCode {
	return Object.values(GeneralApiErrorCode).includes(code as GeneralApiErrorCode)
}
