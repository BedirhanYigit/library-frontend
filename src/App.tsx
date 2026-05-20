import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BooksPage from './pages/BooksPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminBooksPage from './pages/AdminBooksPage'
import AdminUsersPage from './pages/AdminUsersPage'
import SignUpPage from './pages/SignUpPage'
import MyBooksPage from './pages/MyBooksPage'
import MyReservationsPage from './pages/MyReservationsPage'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute.tsx'
import AppHeader from './components/AppHeader.tsx'

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="app-container">
					<AppHeader />

					<Routes>
						<Route path="/" element={<LoginPage />} />
						<Route path="/signup" element={<SignUpPage />} />

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/books"
							element={
								<ProtectedRoute>
									<BooksPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/my-books"
							element={
								<ProtectedRoute>
									<MyBooksPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/my-reservations"
							element={
								<ProtectedRoute>
									<MyReservationsPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin-dashboard"
							element={
								<ProtectedRoute requireAdmin>
									<AdminDashboardPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/books"
							element={
								<ProtectedRoute requireAdmin>
									<AdminBooksPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/users"
							element={
								<ProtectedRoute requireAdmin>
									<AdminUsersPage />
								</ProtectedRoute>
							}
						/>

						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	)
}

export default App
