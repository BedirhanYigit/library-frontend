export type UserRole = 'USER' | 'ADMIN'

export interface CurrentUser {
	id: number
	name: string | null
	email: string
	role: UserRole
}

export interface LoginRequest {
	email: string
	password: string
}
