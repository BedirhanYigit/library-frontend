import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import './styles/buttons.css'
import './styles/forms.css'
import './styles/cards.css'
import './styles/modal.css'
import './styles/books.css'
import './styles/admin.css'
import './i18n/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
