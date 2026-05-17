import type { ReactNode } from 'react'
import { useAuth } from './useAuth.ts'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
	children: ReactNode
	requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
	const { isLoading, isLoggedIn, isAdmin } = useAuth()

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (!isLoggedIn) {
		return <Navigate to={'/'} replace />
	}

	if (requireAdmin && !isAdmin) {
		return <Navigate to={'/dashboard'} replace />
	}

	return children
}
