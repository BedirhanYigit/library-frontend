export const de = {
	app: {
		title: 'Deveci Bibliothek',
		welcome: 'Willkommen in der Deveci Bibliothek',
	},
	language: {
		label: 'Sprache',
		english: 'Englisch',
		german: 'Deutsch',
		turkish: 'Türkisch',
		chinese: 'Chinesisch',
	},
	login: {
		newToLibrary: 'Neu in der Bibliothek?',
		signUp: 'Registrieren',
		selectLoginType: 'Login-Typ auswählen',
		userLogin: 'Benutzer-Login',
		adminLogin: 'Admin-Login',
		email: 'E-Mail',
		password: 'Passwort',
		back: 'Zurück',
		submit: 'Einloggen',
		submitUser: 'Als Benutzer einloggen',
		submitAdmin: 'Als Admin einloggen',
		invalidCredentials: 'Ungültige E-Mail oder ungültiges Passwort.',
	},
	apiErrors: {
		defaultFallback: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.',
		auth: {
			emailAlreadyExists: 'Ein Konto mit dieser E-Mail existiert bereits.',
			invalidCredentials: 'Ungültige E-Mail oder ungültiges Passwort.',
			authenticationRequired: 'Bitte melden Sie sich an, um fortzufahren.',
			adminAccessRequired: 'Sie benötigen Admin-Rechte, um diese Seite anzuzeigen.',
		},
		book: {
			notFound: 'Das ausgewählte Buch konnte nicht gefunden werden.',
			isbnAlreadyExists: 'Ein Buch mit dieser ISBN existiert bereits.',
			totalCopiesBelowLoanedCopies:
				'Die Gesamtanzahl der Exemplare darf nicht niedriger sein als die aktuell ausgeliehenen Exemplare.',
		},
		loan: {
			notFound: 'Die ausgewählte Ausleihe konnte nicht gefunden werden.',
			openLoanAlreadyExists: 'Sie haben bereits eine aktive Ausleihe für dieses Buch.',
			bookNotAvailable: 'Dieses Buch ist derzeit nicht verfügbar. Sie können es stattdessen reservieren.',
		},
		reservation: {
			notFound: 'Die ausgewählte Reservierung konnte nicht gefunden werden.',
			reservationAlreadyExists: 'Sie haben bereits eine aktive Reservierung für dieses Buch.',
		},
		user: {
			notFound: 'Der ausgewählte Benutzer konnte nicht gefunden werden.',
		},
		general: {
			requestValidationFailed: 'Die Anfrage enthält ungültige Daten.',
			requestFieldInvalid: 'Eines der übermittelten Felder ist ungültig.',
			internalServerError: 'Ein unerwarteter Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
		},
	},
}
