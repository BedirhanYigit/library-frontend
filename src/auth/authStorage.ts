// TODO simplify or remove these, yb

export type UserRole = 'USER' | 'ADMIN'

export interface CurrentUser {
	id: number
	name?: string
	email: string
	role: UserRole
}

const CURRENT_USER_KEY = 'currentUser'

export function saveCurrentUser(user: CurrentUser): void {
	localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function getCurrentUser(): CurrentUser | null {
	const rawUser = localStorage.getItem(CURRENT_USER_KEY)

	if (!rawUser) return null

	try {
		return JSON.parse(rawUser) as CurrentUser
	} catch {
		localStorage.removeItem(CURRENT_USER_KEY)
		return null
	}
}

export function clearCurrentUser(): void {
	localStorage.removeItem(CURRENT_USER_KEY)
}

export function isAdmin(): boolean {
	return getCurrentUser()?.role === 'ADMIN'
}

export function isLoggedIn(): boolean {
	return getCurrentUser() !== null
}
