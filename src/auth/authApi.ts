import type { CurrentUser, LoginRequest } from './auth.types.ts'
import { get, post } from '../api/http.ts'

export function loginUser(request: LoginRequest): Promise<CurrentUser> {
	return post<CurrentUser, LoginRequest>('/auth/users/login', request)
}

export function loginAdmin(request: LoginRequest): Promise<CurrentUser> {
	return post<CurrentUser, LoginRequest>('/auth/admins/login', request)
}

export function getMe(): Promise<CurrentUser> {
	return get<CurrentUser>('/auth/me')
}

export function logout(): Promise<void> {
	return post<void>('/auth/logout')
}
