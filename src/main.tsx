import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import './styles/cards.css'
import './styles/forms.css'
import './styles/buttons.css'
import './styles/books.css'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
