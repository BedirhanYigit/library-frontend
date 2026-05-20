import { ReservationApiErrorCode } from '../../models/api-error.types'
import type { TranslationFunction } from '../../i18n/translation.types.ts'

const reservationErrorMessageKeys: Record<ReservationApiErrorCode, string> = {
	[ReservationApiErrorCode.NotFound]: 'apiErrors.reservation.notFound',
	[ReservationApiErrorCode.ReservationAlreadyExists]: 'apiErrors.reservation.reservationAlreadyExists',
}

export function getReservationErrorMessage(code: string, t: TranslationFunction): string | null {
	if (!isReservationApiErrorCode(code)) {
		return null
	}

	return t(reservationErrorMessageKeys[code])
}

function isReservationApiErrorCode(code: string): code is ReservationApiErrorCode {
	return Object.values(ReservationApiErrorCode).includes(code as ReservationApiErrorCode)
}
