import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import styles from './Dashboard.module.css'

interface DashboardProps {
  onLogout: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await api.logout()
    } finally {
      localStorage.removeItem('token')
      onLogout()
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h1>Welcome, {user?.name}!</h1>
        <p className={styles.email}>Email: {user?.email}</p>

        <div className={styles.content}>
          <h2>Dashboard</h2>
          <p>You are successfully authenticated with JWT.</p>
          <p>This is your dashboard home page.</p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={styles.logoutButton}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
