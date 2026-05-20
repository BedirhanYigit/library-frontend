import { GeneralApiErrorCode } from '../../models/api-error.types'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

const generalErrorMessageKeys: Record<GeneralApiErrorCode, string> = {
	[GeneralApiErrorCode.RequestValidationFailed]: 'apiErrors.general.requestValidationFailed',
	[GeneralApiErrorCode.RequestFieldInvalid]: 'apiErrors.general.requestFieldInvalid',
	[GeneralApiErrorCode.InternalServerError]: 'apiErrors.general.internalServerError',
}

export function getGeneralErrorMessage(code: string, t: TranslationFunction): string | null {
	if (!isGeneralApiErrorCode(code)) {
		return null
	}

	return t(generalErrorMessageKeys[code])
}

function isGeneralApiErrorCode(code: string): code is GeneralApiErrorCode {
	return Object.values(GeneralApiErrorCode).includes(code as GeneralApiErrorCode)
}
