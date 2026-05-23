import type { ChangeEvent, SubmitEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TextField from '../components/TextField'
import { post } from '../api/http'
import type { User } from '../models/types.ts'
import type { CreateUserRequest } from '../models/request.types.ts'
import TextAreaField from '../components/TextAreaField.tsx'
import { getApiErrorMessage } from '../api/errors/apiErrorMessages.ts'
import { notify } from '../components/notifications/notify.tsx'

interface SignUpFormData {
	name: string
	email: string
	password: string
	phoneNumber: string
	address: string
}

const emptySignUpForm: SignUpFormData = {
	name: '',
	email: '',
	password: '',
	phoneNumber: '',
	address: '',
}

function SignUpPage() {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const [formData, setFormData] = useState<SignUpFormData>(emptySignUpForm)
	const [wasCreatedSuccessfully, setWasCreatedSuccessfully] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSignUpSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const email = formData.email.trim().toLowerCase()

		if (!email.endsWith('@gmail.com')) {
			notify.error(t('signUp.gmailOnly'))
			return
		}

		setIsSubmitting(true)

		try {
			const request: CreateUserRequest = {
				name: formData.name.trim(),
				email,
				password: formData.password,
				phoneNumber: formData.phoneNumber.trim(),
				address: formData.address.trim(),
			}

			await post<User, CreateUserRequest>('/auth/users/register', request)

			setWasCreatedSuccessfully(true)
			setFormData(emptySignUpForm)
		} catch (error) {
			notify.error(getApiErrorMessage(error, t, t('signUp.createError')))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="login-section">
			<div className="login-card signup-card">
				<h2>{t('signUp.title')}</h2>

				{wasCreatedSuccessfully ? (
					<div className="success-view">
						<h3 className="success-title">{t('signUp.success')}</h3>

						<button className="login-btn user-btn" onClick={() => navigate('/')}>
							{t('signUp.goToLogin')}
						</button>
					</div>
				) : (
					<form className="app-form" onSubmit={handleSignUpSubmit}>
						<TextField
							label={t('signUp.fullName')}
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
						/>

						<TextField
							label={t('signUp.emailAddress')}
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="example@gmail.com"
							required
						/>

						<TextField
							label={t('signUp.password')}
							name="password"
							type="password"
							value={formData.password}
							onChange={handleInputChange}
							required
						/>

						<TextField
							label={t('signUp.phoneNumber')}
							name="phoneNumber"
							type="tel"
							value={formData.phoneNumber}
							onChange={handleInputChange}
							required
						/>

						<TextAreaField
							label={t('signUp.physicalAddress')}
							name="address"
							value={formData.address}
							onChange={handleInputChange}
							required
						/>

						<div className="button-group button-group-spaced">
							<button
								type="button"
								className="login-btn back-btn"
								onClick={() => navigate('/')}
								disabled={isSubmitting}
							>
								{t('signUp.cancel')}
							</button>

							<button type="submit" className="login-btn user-btn" disabled={isSubmitting}>
								{isSubmitting ? t('signUp.creatingAccount') : t('signUp.submit')}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default SignUpPage
