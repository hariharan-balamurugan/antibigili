import React, { useState } from 'react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import styles from './AuthForm.module.css'

interface AuthFormProps {
  onSuccess: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const response = await api.login({ email, password })
        if (response.success && response.data) {
          login(response.data.accessToken, response.data.user)
          onSuccess()
        }
      } else {
        const response = await api.register({ email, password, name })
        if (response.success && response.data) {
          login(response.data.accessToken, response.data.user)
          onSuccess()
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            className={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className={styles.toggle}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
          }}
          className={styles.toggleButton}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  )
}
