import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'

function AppHeader() {
	const { t } = useTranslation()

	return (
		<header className="app-header">
			<div className="app-header-content">
				<h1 className="app-header-title">{t('app.welcome')}</h1>

				<LanguageSelector />
			</div>
		</header>
	)
}

export default AppHeader
