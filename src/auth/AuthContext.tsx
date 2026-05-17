import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { CurrentUser, LoginRequest } from './auth.types'
import type { AuthContextValue } from './authContext'
import { AuthContext } from './authContext'
import * as authApi from './authApi'

interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const refreshCurrentUser = async () => {
		try {
			const user = await authApi.getMe()
			setCurrentUser(user)
		} catch {
			setCurrentUser(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		void refreshCurrentUser()
	}, [])

	const loginAsUser = async (request: LoginRequest) => {
		const user = await authApi.loginUser(request)
		setCurrentUser(user)
	}

	const loginAsAdmin = async (request: LoginRequest) => {
		const user = await authApi.loginAdmin(request)
		setCurrentUser(user)
	}

	const logout = async () => {
		try {
			await authApi.logout()
		} finally {
			setCurrentUser(null)
		}
	}

	const value = useMemo<AuthContextValue>(
		() => ({
			currentUser,
			isLoading,
			isLoggedIn: currentUser !== null,
			isAdmin: currentUser?.role === 'ADMIN',
			loginAsUser,
			loginAsAdmin,
			logout,
			refreshCurrentUser,
		}),
		[currentUser, isLoading],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
