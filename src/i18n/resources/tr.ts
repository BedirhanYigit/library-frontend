export const tr = {
	app: {
		title: 'Deveci Kütüphanesi',
		welcome: 'Deveci Kütüphanesine Hoş Geldiniz',
	},
	language: {
		label: 'Dil',
		english: 'İngilizce',
		german: 'Almanca',
		turkish: 'Türkçe',
		chinese: 'Çince',
	},
	login: {
		newToLibrary: 'Kütüphanede yeni misiniz?',
		signUp: 'Kayıt Ol',
		selectLoginType: 'Giriş türünü seçin',
		userLogin: 'Kullanıcı Girişi',
		adminLogin: 'Admin Girişi',
		email: 'E-posta',
		password: 'Şifre',
		back: 'Geri',
		submit: 'Giriş Yap',
		submitUser: 'Kullanıcı olarak giriş yap',
		submitAdmin: 'Admin olarak giriş yap',
		invalidCredentials: 'E-posta veya şifre hatalı.',
	},
	apiErrors: {
		defaultFallback: 'Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.',
		auth: {
			emailAlreadyExists: 'Bu e-posta ile zaten bir hesap mevcut.',
			invalidCredentials: 'E-posta veya şifre hatalı.',
			authenticationRequired: 'Devam etmek için lütfen giriş yapın.',
			adminAccessRequired: 'Bu sayfayı görüntülemek için admin yetkisine ihtiyacınız var.',
		},
		book: {
			notFound: 'Seçilen kitap bulunamadı.',
			isbnAlreadyExists: 'Bu ISBN ile zaten bir kitap mevcut.',
			totalCopiesBelowLoanedCopies: 'Toplam kopya sayısı, şu anda ödünç verilmiş kopya sayısından az olamaz.',
		},
		loan: {
			notFound: 'Seçilen ödünç alma kaydı bulunamadı.',
			openLoanAlreadyExists: 'Bu kitap için zaten aktif bir ödünç alma kaydınız var.',
			bookNotAvailable: 'Bu kitap şu anda mevcut değil. Bunun yerine rezervasyon yapabilirsiniz.',
		},
		reservation: {
			notFound: 'Seçilen rezervasyon bulunamadı.',
			reservationAlreadyExists: 'Bu kitap için zaten aktif bir rezervasyonunuz var.',
		},
		user: {
			notFound: 'Seçilen kullanıcı bulunamadı.',
		},
		general: {
			requestValidationFailed: 'İstek geçersiz veriler içeriyor.',
			requestFieldInvalid: 'Gönderilen alanlardan biri geçersiz.',
			internalServerError: 'Beklenmeyen bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
		},
	},
}
