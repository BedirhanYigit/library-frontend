import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './resources/en'
import { de } from './resources/de'
import { tr } from './resources/tr'
import { zh } from './resources/zh'

export const supportedLanguages = ['en', 'de', 'tr', 'zh'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const languageLabels: Record<SupportedLanguage, string> = {
	en: '🇬🇧 English',
	de: '🇩🇪 Deutsch',
	tr: '🇹🇷 Türkçe',
	zh: '🇨🇳 中文',
}

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			de: { translation: de },
			tr: { translation: tr },
			zh: { translation: zh },
		},
		fallbackLng: 'en',
		supportedLngs: supportedLanguages,
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		}
	})

export default i18n
