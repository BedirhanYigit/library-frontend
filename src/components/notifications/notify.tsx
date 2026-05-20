import { toast } from 'sonner'
import socialCreditImage from '../../assets/toasts/social-credit.png'
import minusSocialCreditImage from '../../assets/toasts/minus-credit.webp'
import './notifications.css'

type LanguageCode = string

export const notify = {
	success: (message: string) => {
		toast.success(message)
	},

	error: (message: string) => {
		toast.error(message)
	},

	info: (message: string) => {
		toast.info(message)
	},

	languageSelectionBonus: (language: LanguageCode) => {
		const normalizedLanguage = language.toLowerCase()

		if (normalizedLanguage.startsWith('zh')) {
			toast.custom(() => (
				<div className="image-toast image-toast-success">
					<img className="image-toast-image" src={socialCreditImage} alt="" />

					<div className="image-toast-content">
						<strong>+15 credit points</strong>
						<span>Excellent language selection.</span>
					</div>
				</div>
			))

			return
		}

		if (normalizedLanguage.startsWith('en')) {
			toast.custom(() => (
				<div className="image-toast image-toast-error">
					<img className="image-toast-image" src={minusSocialCreditImage} alt="" />

					<div className="image-toast-content">
						<strong>-30 credit points</strong>
						<span>Suspicious language activity detected.</span>
					</div>
				</div>
			))
		}
	},
}
