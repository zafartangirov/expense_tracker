import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import BrandLogo from '../components/BrandLogo'
import ThemeToggle from '../components/ThemeToggle'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    window.onTelegramAuth = async (telegramData) => {
      setLoading(true)
      setErrors({})
      try {
        const res = await api.post('/auth/telegram', telegramData)
        login(res.data)
        navigate('/dashboard')
      } catch (err) {
        setErrors({ general: 'Telegram orqali kirishda xatolik!' })
      } finally {
        setLoading(false)
      }
    }

    const widget = document.getElementById('telegram-widget')
    if (widget && widget.childElementCount === 0) {
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.setAttribute('data-telegram-login', 'expense_tracker_zafar_bot')
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-radius', '12')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      script.async = true
      widget.appendChild(script)
    }

    return () => {
      delete window.onTelegramAuth
    }
  }, [])

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '917677364358-0rp9jcogoaqv7aerbds59ud2haohlnn1.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      })
      window.google.accounts.id.renderButton(document.getElementById('google-widget'), {
        theme: 'outline',
        size: 'large',
        width: '100%',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
      })
    }
  }, [])

  const handleGoogleResponse = async (response) => {
    setLoading(true)
    setErrors({})
    try {
      const res = await api.post('/auth/google', {
        credential: response.credential,
      })
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      setErrors({ general: 'Google orqali kirishda xatolik!' })
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = () => {
    const clientId = 'Ov23liiFPy44veeSFoyG'
    const redirectUri = `${import.meta.env.VITE_API_URL}/api/auth/github/callback`
    const scope = 'user:email'
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const newErrors = {}
    if (!form.email) newErrors.email = "Email bo'sh bo'lmasin"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email noto'g'ri"
    if (!form.password) newErrors.password = "Parol bo'sh bo'lmasin"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const res = await api.post('/auth/login', form)
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.error || ''

      if (message.includes('EMAIL_NOT_VERIFIED')) {
        navigate('/verify-email')
      } else if (message.includes('mavjud emas')) {
        setErrors({ general: 'Bunday foydalanuvchi mavjud emas!' })
      } else if (message.includes("noto'g'ri") || message.includes('Parol')) {
        setErrors({ general: "Parol noto'g'ri!" })
      } else {
        setErrors({ general: 'Kirishda xatolik yuz berdi!' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>

      <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
          <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="glass-card-highlight order-2 rounded-[34px] p-6 sm:p-8 xl:order-1 xl:p-10">
              <Link
                to="/"
                className="inline-flex items-center gap-3 rounded-full border border-[var(--ghost-border)] bg-[var(--ghost-bg)] px-4 py-2 text-sm font-semibold theme-text transition hover:bg-[var(--ghost-hover-bg)]"
              >
                <BrandLogo size="sm" />
              </Link>

              <div className="mt-8 max-w-xl">
                <span className="section-badge">Welcome Back</span>
                <h1 className="page-title mt-4 text-4xl font-extrabold theme-text sm:text-5xl">
                  Hisobingizga xavfsiz kiring
                </h1>
                <p className="soft-text mt-4 text-sm leading-7 sm:text-base">
                  Xarajatlaringiz, hisobotlaringiz va AI tavsiyalaringiz bir joyda. Zamonaviy, tez va landing
                  sahifangizga mos auth tajribasi bilan davom eting.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Tez kirish', desc: 'Email yoki ijtimoiy login orqali bir necha soniyada.' },
                  { title: 'Himoyalangan', desc: "Hisob ma'lumotlari xavfsiz va tartibli saqlanadi." },
                  { title: 'Mobilga mos', desc: "Telefon va planshetda ham toza ko'rinish." },
                ].map((item) => (
                  <div key={item.title} className="glass-card rounded-[24px] p-4">
                    <p className="text-sm font-semibold theme-text">{item.title}</p>
                    <p className="soft-text mt-2 text-xs leading-6">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 glass-card rounded-[28px] p-5">
                <p className="text-sm font-semibold theme-text">Nimalar sizni kutyapti?</p>
                <div className="mt-4 space-y-3">
                  {[
                    'Dashboard ichida real vaqt statistikasi',
                    "Chek skan bilan xarajat qo'shish",
                    'AI tahlil va tejash tavsiyalari',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm theme-text-soft">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(165,180,252,0.8)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="glass-card order-1 rounded-[34px] p-6 sm:p-8 xl:order-2 xl:p-10">
              <div className="mb-8">
                <span className="section-badge">Sign In</span>
                <h2 className="panel-title mt-4 text-3xl">Kirish</h2>
                <p className="soft-text mt-3 text-sm leading-7">
                  Email va parolingizni kiriting yoki qulay ijtimoiy login usullaridan foydalaning.
                </p>
              </div>

              {errors.general && (
                <div className="theme-alert-danger mb-5 rounded-[22px] px-4 py-3 text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="mb-2 block text-sm font-medium theme-label">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value })
                      setErrors({ ...errors, email: '', general: '' })
                    }}
                    className={`dark-input px-4 py-3 text-sm ${errors.email ? 'border-red-400/50 bg-red-500/10' : ''}`}
                    placeholder="test@mail.com"
                  />
                  {errors.email && <p className="mt-2 text-xs" style={{ color: 'var(--danger-text)' }}>{errors.email}</p>}
                </div>

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Parol
  </label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      value={form.password}
      onChange={e => {
        setForm({...form, password: e.target.value})
        setErrors({...errors, password: '', general: ''})
      }}
      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-12 ${
        errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
      }`}
      placeholder="••••••"
    />
    {form.password && (
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
  >
    {showPassword ? '🙈' : '👁️'}
  </button>
)}
  </div>
  {errors.password && (
    <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>
  )}
</div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm theme-text-soft transition hover:text-[var(--text-primary)]">
                    Parolni unutdingizmi?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Kirish...' : 'Kirish'}
                </button>

                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-[var(--theme-chip-border)]" />
                  <span className="text-xs uppercase tracking-[0.2em] theme-text-subtle">yoki</span>
                  <div className="h-px flex-1 bg-[var(--theme-chip-border)]" />
                </div>

                <div className="space-y-3">
                  <div className="glass-card-soft rounded-[24px] p-3">
                    <div id="telegram-widget" className="flex justify-center" />
                  </div>
                  <div className="glass-card-soft rounded-[24px] p-3">
                    <div id="google-widget" className="flex justify-center" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    className="ghost-button flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
                    GitHub orqali kirish
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm theme-text-faint">
                Hisob yo'qmi?{' '}
                <Link to="/register" className="font-semibold theme-text-soft transition hover:text-[var(--text-primary)]">
                  Ro'yxatdan o'ting
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
