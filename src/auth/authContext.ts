import { createContext } from 'react'
import type { CurrentUser, LoginRequest } from './auth.types.ts'

export interface AuthContextValue {
	currentUser: CurrentUser | null
	isLoading: boolean
	isLoggedIn: boolean
	isAdmin: boolean
	loginAsUser: (request: LoginRequest) => Promise<void>
	loginAsAdmin: (request: LoginRequest) => Promise<void>
	logout: () => Promise<void>
	refreshCurrentUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
