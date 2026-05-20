export const en = {
	app: {
		title: 'Deveci Library',
		welcome: 'Welcome to Deveci Library',
	},
	language: {
		label: 'Language',
		english: 'English',
		german: 'German',
		turkish: 'Turkish',
		chinese: 'Chinese',
	},
	login: {
		newToLibrary: 'New to the library?',
		signUp: 'Sign Up',
		selectLoginType: 'Select Login Type',
		userLogin: 'User Login',
		adminLogin: 'Admin Login',
		email: 'Email',
		password: 'Password',
		back: 'Back',
		submit: 'Login',
		submitUser: 'Login as User',
		submitAdmin: 'Login as Admin',
		invalidCredentials: 'Invalid email or password.',
	},
	apiErrors: {
		defaultFallback: 'Something went wrong. Please try again later.',
		auth: {
			emailAlreadyExists: 'An account with this email already exists.',
			invalidCredentials: 'Invalid email or password.',
			authenticationRequired: 'Please log in to continue.',
			adminAccessRequired: 'You need admin access to view this page.',
		},
		book: {
			notFound: 'The selected book could not be found.',
			isbnAlreadyExists: 'A book with this ISBN already exists.',
			totalCopiesBelowLoanedCopies: 'Total copies cannot be lower than currently loaned copies.',
		},
		loan: {
			notFound: 'The selected loan could not be found.',
			openLoanAlreadyExists: 'You already have an active loan for this book.',
			bookNotAvailable: 'This book is currently not available. You can reserve it instead.',
		},
		reservation: {
			notFound: 'The selected reservation could not be found.',
			reservationAlreadyExists: 'You already have an active reservation for this book.',
		},
		user: {
			notFound: 'The selected user could not be found.',
		},
		general: {
			requestValidationFailed: 'The request contains invalid data.',
			requestFieldInvalid: 'One of the submitted fields is invalid.',
			internalServerError: 'An unexpected server error occurred. Please try again later.',
		},
	},
}
