import { ReservationApiErrorCode } from '../../models/api-error.types'

const reservationErrorMessages: Record<ReservationApiErrorCode, string> = {
	[ReservationApiErrorCode.NotFound]: 'The selected reservation could not be found.',
	[ReservationApiErrorCode.ReservationAlreadyExists]: 'You already have an active reservation for this book.',
}

export function getReservationErrorMessage(code: string): string | null {
	if (!isReservationApiErrorCode(code)) {
		return null
	}

	return reservationErrorMessages[code]
}

function isReservationApiErrorCode(code: string): code is ReservationApiErrorCode {
	return Object.values(ReservationApiErrorCode).includes(code as ReservationApiErrorCode)
}
