export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface OAuthProvider {
  id: string
  name: string
  icon: string
  color: string
}
