export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthToken {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
