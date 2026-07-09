import { useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthForm } from '@/components/AuthForm'
import { Dashboard } from '@/components/Dashboard'
import styles from './App.module.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <AuthProvider>
      <div className={styles.container}>
        {isAuthenticated ? (
          <Dashboard onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <AuthForm onSuccess={() => setIsAuthenticated(true)} />
        )}
      </div>
    </AuthProvider>
  )
}

export default App
