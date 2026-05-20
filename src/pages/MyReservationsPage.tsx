import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Reservation } from '../models/types'
import { deleteRequest, get } from '../api/http'
import { useAuth } from '../auth/useAuth.ts'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'

const MyReservationsPage: React.FC = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const [reservations, setReservations] = useState<Reservation[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [actionMessage, setActionMessage] = useState<StatusMessageType>(null)

	const { currentUser, isLoading: isAuthLoading } = useAuth()
	const userId = currentUser?.id

	const fetchReservations = useCallback(async () => {
		if (!userId) {
			setLoadError(t('myReservations.loginAgainView'))
			setIsLoading(false)
			return
		}

		try {
			const data = await get<Reservation[]>(`/reservations/${userId}`)
			setReservations(data)
			setLoadError(null)
		} catch (error) {
			setLoadError(getApiErrorMessage(error, t, t('myReservations.loadError')))
		} finally {
			setIsLoading(false)
		}
	}, [t, userId])

	useEffect(() => {
		if (isAuthLoading) {
			return
		}

		void fetchReservations()
	}, [fetchReservations, isAuthLoading])

	const setSuccessMessage = (message: string) => {
		setActionMessage({ type: 'success', text: message })
	}

	const setErrorMessage = (message: string) => {
		setActionMessage({ type: 'error', text: message })
	}

	const clearActionMessage = () => {
		setActionMessage(null)
	}

	const handleCancelReservation = async (reservationId: number) => {
		clearActionMessage()

		if (!userId) {
			setErrorMessage(t('myReservations.loginAgainCancel'))
			return
		}

		try {
			await deleteRequest<void>(`/reservations/${reservationId}`)
			setSuccessMessage(t('myReservations.cancelSuccess'))
			await fetchReservations()
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, t, t('myReservations.cancelError')))
		}
	}

	return (
		<div className="page-wrapper">
			<div className="page-header-actions">
				<div className="header-button-group">
					<button className="login-btn back-btn" onClick={() => navigate('/dashboard')}>
						{t('myReservations.backToDashboard')}
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/books')}>
						{t('myReservations.browseAllBooks')}
					</button>

					<button className="login-btn user-btn" onClick={() => navigate('/my-books')}>
						{t('myReservations.myBooks')}
					</button>
				</div>
			</div>

			<div className="books-container">
				<h2>{t('myReservations.title')}</h2>

				<StatusMessage message={actionMessage} />

				{isLoading && <p>{t('myReservations.loading')}</p>}
				{loadError && <p className="error-message">{loadError}</p>}

				{!isLoading && !loadError && reservations.length === 0 && <p>{t('myReservations.empty')}</p>}

				{!isLoading && !loadError && reservations.length > 0 && (
					<div className="entity-grid">
						{reservations.map((reservation) => (
							<div key={reservation.id} className="entity-card">
								<h3 className="entity-card-title">
									{reservation.book?.title || t('myReservations.unknownTitle')}
								</h3>

								<p className="entity-card-detail">
									<strong>{t('book.author')}:</strong> {reservation.book?.author || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('book.genre')}:</strong> {reservation.book?.genre || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('book.isbn')}:</strong> {reservation.book?.isbn || t('book.notAvailable')}
								</p>

								<p className="entity-card-detail">
									<strong>{t('myReservations.reservedOn')}:</strong>{' '}
									{reservation.reservationDate || t('book.notAvailable')}
								</p>

								<p className="book-status status-reserved">{t('myReservations.waitingForCopy')}</p>

								<div className="entity-card-actions">
									<button
										className="login-btn secondary-action-btn"
										onClick={() => handleCancelReservation(reservation.id)}
									>
										{t('myReservations.cancelReservation')}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default MyReservationsPage
