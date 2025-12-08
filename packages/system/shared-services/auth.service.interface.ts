export const AUTH_SERVICE = 'AuthService'

export interface AuthService {
  signIn(email: string, password: string): Promise<void>
}
