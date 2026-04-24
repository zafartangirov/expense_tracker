import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ThemeToggle from '../components/ThemeToggle'

export default function GitHubCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      api.post('/auth/github', { code })
        .then((res) => {
          login(res.data)
          navigate('/dashboard')
        })
        .catch(() => {
          navigate('/login?error=github')
        })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="app-shell">
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>

      <main className="auth-page-shell flex items-center justify-center">
        <div className="glass-card w-full max-w-md rounded-[32px] p-8 text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-b-2 border-indigo-500" />
          <h1 className="panel-title text-2xl">GitHub orqali kirilmoqda...</h1>
          <p className="soft-text mt-3 text-sm">Iltimos kuting, hisobingiz tayyorlanmoqda.</p>
        </div>
      </main>
    </div>
  )
}
