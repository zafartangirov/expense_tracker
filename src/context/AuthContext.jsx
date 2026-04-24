import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import LoadingScreen from '../components/LoadingScreen'

const AuthContext = createContext()
const AUTH_STORAGE_KEYS = ['token', 'email', 'fullName', 'profilePicture']

const clearStoredAuth = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

const normalizeUser = (data = {}) => ({
  token: data.token || '',
  email: data.email || '',
  fullName: data.fullName || '',
  profilePicture: data.profilePicture || '',
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persistUser = (data) => {
    const nextUser = normalizeUser(data)

    if (!nextUser.token) {
      clearStoredAuth()
      setUser(null)
      return null
    }

    localStorage.setItem('token', nextUser.token)
    localStorage.setItem('email', nextUser.email)
    localStorage.setItem('fullName', nextUser.fullName)
    localStorage.setItem('profilePicture', nextUser.profilePicture)
    setUser(nextUser)
    return nextUser
  }

  const syncUserProfile = async (baseUser) => {
    if (!baseUser?.token) return null

    try {
      const res = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${baseUser.token}` },
      })

      return persistUser({
        ...baseUser,
        email: res.data?.email ?? baseUser.email,
        fullName: res.data?.fullName ?? baseUser.fullName,
        profilePicture: res.data?.profilePicture ?? baseUser.profilePicture ?? '',
      })
    } catch (error) {
      console.error('Auth profile sync failed:', error)
      return baseUser
    }
  }

  useEffect(() => {
    const storedUser = normalizeUser({
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email'),
      fullName: localStorage.getItem('fullName'),
      profilePicture: localStorage.getItem('profilePicture'),
    })

    if (!storedUser.token) {
      setLoading(false)
      return
    }

    persistUser(storedUser)
    syncUserProfile(storedUser).finally(() => setLoading(false))
  }, [])

  const login = (data) => {
    const nextUser = persistUser({
      token: data?.token ?? localStorage.getItem('token'),
      email: data?.email ?? localStorage.getItem('email'),
      fullName: data?.fullName ?? localStorage.getItem('fullName'),
      profilePicture: data?.profilePicture ?? localStorage.getItem('profilePicture'),
    })

    setLoading(false)
    void syncUserProfile(nextUser)
  }

  const logout = () => {
    clearStoredAuth()
    setUser(null)
  }

  // ✅ if (loading) return — hook lardan KEYIN bo'lishi kerak!
  if (loading) return <LoadingScreen message="Tizim ishga tushmoqda" />

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}