import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { User, AuthToken } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((authToken: string, userData: User) => {
    setToken(authToken)
    setUser(userData)
    localStorage.setItem('token', authToken)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
