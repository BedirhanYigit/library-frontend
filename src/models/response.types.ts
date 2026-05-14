export interface LoginResponse<TUser> {
	token: string
	tokenType: string
	user: TUser
}
