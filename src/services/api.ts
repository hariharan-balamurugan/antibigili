import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiResponse, LoginPayload, RegisterPayload, User, AuthToken } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async login(payload: LoginPayload): Promise<ApiResponse<AuthToken & { user: User }>> {
    const response = await this.client.post('/auth/login', payload)
    return response.data
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthToken & { user: User }>> {
    const response = await this.client.post('/auth/register', payload)
    return response.data
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/profile')
    return response.data
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.client.post('/auth/logout')
    return response.data
  }
}

export const api = new ApiClient()
