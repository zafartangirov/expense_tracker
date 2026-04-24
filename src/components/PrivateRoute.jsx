import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="glass-card flex w-full max-w-sm flex-col items-center rounded-[28px] px-8 py-10 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
          <p className="panel-title mt-5 text-lg">Sahifa yuklanmoqda</p>
          <p className="soft-text mt-2 text-sm">Foydalanuvchi ma'lumotlari tekshirilmoqda.</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}
