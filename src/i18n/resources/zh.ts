export const zh = {
	app: {
		title: 'Deveci 图书馆',
		welcome: '欢迎来到 Deveci 图书馆',
	},
	language: {
		label: '语言',
		english: '英语',
		german: '德语',
		turkish: '土耳其语',
		chinese: '中文',
	},
	login: {
		newToLibrary: '第一次使用图书馆？',
		signUp: '注册',
		selectLoginType: '选择登录类型',
		userLogin: '用户登录',
		adminLogin: '管理员登录',
		email: '邮箱',
		password: '密码',
		back: '返回',
		submit: '登录',
		submitUser: '以用户身份登录',
		submitAdmin: '以管理员身份登录',
		invalidCredentials: '邮箱或密码无效。',
	},
	apiErrors: {
		defaultFallback: '出现问题。请稍后重试。',
		auth: {
			emailAlreadyExists: '使用此邮箱的账户已存在。',
			invalidCredentials: '邮箱或密码无效。',
			authenticationRequired: '请登录后继续。',
			adminAccessRequired: '您需要管理员权限才能查看此页面。',
		},
		book: {
			notFound: '找不到所选图书。',
			isbnAlreadyExists: '已有一本图书使用此 ISBN。',
			totalCopiesBelowLoanedCopies: '总副本数不能少于当前已借出的副本数。',
		},
		loan: {
			notFound: '找不到所选借阅记录。',
			openLoanAlreadyExists: '您已经有这本书的有效借阅记录。',
			bookNotAvailable: '这本书当前不可借。您可以改为预约。',
		},
		reservation: {
			notFound: '找不到所选预约记录。',
			reservationAlreadyExists: '您已经有这本书的有效预约。',
		},
		user: {
			notFound: '找不到所选用户。',
		},
		general: {
			requestValidationFailed: '请求包含无效数据。',
			requestFieldInvalid: '提交的字段中有一个无效。',
			internalServerError: '发生意外的服务器错误。请稍后重试。',
		},
	},
}
