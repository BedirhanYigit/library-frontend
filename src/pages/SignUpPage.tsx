import type { ChangeEvent, SubmitEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../components/TextField'
import { post } from '../api/http'
import type { User } from '../models/types.ts'
import type { CreateUserRequest } from '../models/request.types.ts'
import TextAreaField from '../components/TextAreaField.tsx'
import type { StatusMessageType } from '../components/StatusMessage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'

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

	const [formData, setFormData] = useState<SignUpFormData>(emptySignUpForm)
	const [message, setMessage] = useState<StatusMessageType>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const errorMessage = message?.type === 'error' ? message : null
	const successMessage = message?.type === 'success' ? message : null

	const setSuccessMessage = (text: string) => {
		setMessage({ type: 'success', text })
	}

	const setErrorMessage = (text: string) => {
		setMessage({ type: 'error', text })
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSignUpSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setMessage(null)

		if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
			setErrorMessage('Mail addresses other than gmail are not permitted. Please register with your gmail provider.')
			return
		}

		setIsSubmitting(true)

		try {
			const request: CreateUserRequest = { ...formData }
			await post<User, CreateUserRequest>('/auth/users/register', request)
			setSuccessMessage('Account created successfully! You may now log in.')
			setFormData(emptySignUpForm)
		} catch {
			setErrorMessage('Failed to create account. This email might already be in use.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="login-section">
			<div className="login-card signup-card">
				<h2>Library Registration</h2>

				{successMessage ? (
					<div className="success-view">
						<h3 className="success-title">{successMessage.text}</h3>

						<button className="login-btn user-btn" onClick={() => navigate('/')}>
							Go to Login Page
						</button>
					</div>
				) : (
					<form className="login-form" onSubmit={handleSignUpSubmit}>
						<StatusMessage message={errorMessage} />

						<TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />

						<TextField
							label="Email Address"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="example@gmail.com"
							required
						/>

						<TextField
							label="Password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleInputChange}
							required
						/>

						<TextField
							label="Phone Number"
							name="phoneNumber"
							type="tel"
							value={formData.phoneNumber}
							onChange={handleInputChange}
							required
						/>

						<TextAreaField
							label="Physical Address"
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
								Cancel
							</button>

							<button type="submit" className="login-btn user-btn" disabled={isSubmitting}>
								{isSubmitting ? 'Creating Account...' : 'Sign Up'}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default SignUpPage
