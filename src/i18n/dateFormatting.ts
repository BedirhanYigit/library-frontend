const languageToLocale: Record<string, string> = {
	en: 'en-GB',
	de: 'de-DE',
	tr: 'tr-TR',
	zh: 'zh-CN',
}

function resolveLocale(language: string): string {
	const baseLanguage = language.split('-')[0] ?? 'en'

	return languageToLocale[baseLanguage] ?? 'en-GB'
}

function parseDate(value: string): Date | null {
	const parsedDate = new Date(value)

	if (Number.isNaN(parsedDate.getTime())) {
		return null
	}

	return parsedDate
}

export function formatDate(value: string | null | undefined, language: string): string {
	if (!value) {
		return ''
	}

	const parsedDate = parseDate(value)

	if (!parsedDate) {
		return value
	}

	return new Intl.DateTimeFormat(resolveLocale(language), {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(parsedDate)
}
