import type { ChangeEvent, SubmitEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../components/TextField'
import { post } from '../api/http'

interface SignUpFormData {
	name: string
	email: string
	password: string
	phoneNumber: string
	address: string
}

type FormMessage = {
	type: 'success' | 'error'
	text: string
} | null

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
	const [message, setMessage] = useState<FormMessage>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const showSuccess = message?.type === 'success'
	const showError = message?.type === 'error'

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
			await post<void, SignUpFormData>('/create-user', formData)
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

				{showSuccess ? (
					<div className="success-view">
						<h3 className={'success-title'}>{message.text}</h3>

						<button className="login-btn user-btn" onClick={() => navigate('/')}>
							Go to Login Page
						</button>
					</div>
				) : (
					<form className="login-form" onSubmit={handleSignUpSubmit}>
						{showError && <div className="error-message">{message.text}</div>}

						{/*Name*/}
						<TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />

						{/*Email*/}
						<TextField
							label="Email Address"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder={'example@gmail.com'}
							required
						/>

						{/*Password*/}
						<TextField
							label="Password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleInputChange}
							required
						/>

						{/*Phone number*/}
						<TextField
							label="Phone Number"
							name="phoneNumber"
							type="tel"
							value={formData.phoneNumber}
							onChange={handleInputChange}
							required
						/>

						{/*Address*/}
						<div className="input-group">
							<label htmlFor={'address'}>Physical Address *</label>

							<textarea
								id="address"
								name="address"
								value={formData.address}
								onChange={handleInputChange}
								required
							/>
						</div>

						{/*Action buttons*/}
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
