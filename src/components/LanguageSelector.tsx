import { languageLabels, type SupportedLanguage, supportedLanguages } from '../i18n/i18n.ts'
import { useTranslation } from 'react-i18next'
import type { ChangeEvent } from 'react'

function isSupportedLanguage(value: string): value is SupportedLanguage {
	return supportedLanguages.includes(value as SupportedLanguage)
}

function LanguageSelector() {
	const { i18n, t } = useTranslation()

	const selectedLanguage = isSupportedLanguage(i18n.language) ? i18n.language : 'en'

	const handleLanguageChange = async (event: ChangeEvent<HTMLSelectElement>) => {
		const nextLanguage = event.target.value

		if (!isSupportedLanguage(nextLanguage)) {
			return
		}

		await i18n.changeLanguage(nextLanguage)
	}

	return (
		<label className={'language-selector'}>
			<span className={'language-selector-label'}>{t('language.label')}</span>

			<select value={selectedLanguage} onChange={handleLanguageChange} className={'language-selector-select'}>
				{supportedLanguages.map((language) => (
					<option key={language} value={language}>
						{languageLabels[language]}
					</option>
				))}
			</select>
		</label>
	)
}

export default LanguageSelector
