import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import BrandLogo from '../components/BrandLogo'
import ThemeToggle from '../components/ThemeToggle'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
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
    const redirectUri = 'http://localhost:8080/api/auth/github/callback'
    const scope = 'user:email'
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await api.post('/auth/register', form)
      navigate('/verify-email')
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object' && !data.error) {
        setErrors(data)
      } else {
        setErrors({ general: data?.error || "Ro'yxatdan o'tishda xatolik!" })
      }
    } finally {
      setLoading(false)
    }
  }

  // Parol kuchini hisoblash funksiyasi
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' }
  
  let score = 0
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password),
  }

  if (checks.length) score++
  if (checks.longLength) score++
  if (checks.lowercase) score++
  if (checks.uppercase) score++
  if (checks.numbers) score++
  if (checks.symbols) score++

  if (score <= 2) return { score, label: 'Juda zaif', color: '#ef4444', percent: 16, emoji: '😰' }
  if (score === 3) return { score, label: 'Zaif', color: '#f97316', percent: 33, emoji: '😕' }
  if (score === 4) return { score, label: "O'rtacha", color: '#eab308', percent: 55, emoji: '😐' }
  if (score === 5) return { score, label: 'Kuchli', color: '#22c55e', percent: 80, emoji: '😊' }
  return { score, label: 'Juda kuchli', color: '#10b981', percent: 100, emoji: '🔥' }
}

const getPasswordChecks = (password) => [
  { label: 'Kamida 8 ta belgi', done: password.length >= 8 },
  { label: 'Katta harf (A-Z)', done: /[A-Z]/.test(password) },
  { label: 'Kichik harf (a-z)', done: /[a-z]/.test(password) },
  { label: 'Raqam (0-9)', done: /[0-9]/.test(password) },
  { label: 'Maxsus belgi (!@#$)', done: /[^a-zA-Z0-9]/.test(password) },
]

  return (
    <div className="app-shell">
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>

      <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
          <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="glass-card order-2 rounded-[34px] p-6 sm:p-8 xl:order-1 xl:p-10">
              <div className="mb-8">
                <span className="section-badge">Create Account</span>
                <h2 className="panel-title mt-4 text-3xl">Ro'yxatdan o'tish</h2>
                <p className="soft-text mt-3 text-sm leading-7">
                  Yangi hisob yarating va ichki sahifalardagi yangilangan tajribani birinchi bo'lib sinab ko'ring.
                </p>
              </div>

              {errors.general && (
                <div className="theme-alert-danger mb-5 rounded-[22px] px-4 py-3 text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="mb-2 block text-sm font-medium theme-label">To'liq ism</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => {
                      setForm({ ...form, fullName: e.target.value })
                      setErrors({ ...errors, fullName: '' })
                    }}
                    className={`dark-input px-4 py-3 text-sm ${errors.fullName ? 'border-red-400/50 bg-red-500/10' : ''}`}
                    placeholder="Sardor Aliyev"
                  />
                  {errors.fullName && <p className="mt-2 text-xs" style={{ color: 'var(--danger-text)' }}>{errors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium theme-label">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value })
                      setErrors({ ...errors, email: '' })
                    }}
                    className={`dark-input px-4 py-3 text-sm ${errors.email ? 'border-red-400/50 bg-red-500/10' : ''}`}
                    placeholder="sardor@mail.com"
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
        setErrors({...errors, password: ''})
      }}
      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-12 ${
        errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
      }`}
      placeholder="Kamida 8 ta belgi"
    />
    {/* Ko'rish/yashirish tugmasi */}
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

  {/* Parol kuchi */}
  {form.password && (() => {
    const strength = getPasswordStrength(form.password)
    const checks = getPasswordChecks(form.password)
    return (
      <div className="mt-3 space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Parol kuchi</span>
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: strength.color }}>
              {strength.emoji} {strength.label}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${strength.percent}%`,
                background: `linear-gradient(90deg, ${strength.color}88, ${strength.color})`,
                boxShadow: `0 0 8px ${strength.color}66`
              }}
            />
          </div>
        </div>

        {/* Talablar ro'yxati */}
        <div className="grid grid-cols-1 gap-1.5 p-3 bg-gray-50 rounded-xl">
          {checks.map((check, i) => (
            <div
              key={i}
              className="flex items-center gap-2 transition-all duration-300"
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-white transition-all duration-300 shrink-0"
                style={{
                  background: check.done
                    ? 'linear-gradient(135deg, #22c55e, #10b981)'
                    : '#e5e7eb',
                  transform: check.done ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: check.done ? '0 0 6px rgba(34,197,94,0.5)' : 'none'
                }}
              >
                {check.done ? (
                  <svg width="8" height="8" viewBox="0 0 10 10">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#9ca3af' }}/>
                )}
              </div>
              <span
                className="text-xs transition-all duration-300"
                style={{ color: check.done ? '#16a34a' : '#9ca3af' }}
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  })()}
</div>

                <button
                  type="submit"
                  disabled={loading}
                  className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
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
                Hisob bormi?{' '}
                <Link to="/login" className="font-semibold theme-text-soft transition hover:text-[var(--text-primary)]">
                  Kirish
                </Link>
              </p>
            </section>

            <section className="glass-card-highlight order-1 rounded-[34px] p-6 sm:p-8 xl:order-2 xl:p-10">
              <Link
                to="/"
                className="inline-flex items-center gap-3 rounded-full border border-[var(--ghost-border)] bg-[var(--ghost-bg)] px-4 py-2 text-sm font-semibold theme-text transition hover:bg-[var(--ghost-hover-bg)]"
              >
                <BrandLogo size="sm" />
              </Link>

              <div className="mt-8 max-w-xl">
                <span className="section-badge">Start Smart</span>
                <h1 className="page-title mt-4 text-4xl font-extrabold theme-text sm:text-5xl">
                  Moliyaviy nazoratni bugundan boshlang
                </h1>
                <p className="soft-text mt-4 text-sm leading-7 sm:text-base">
                  Yangi foydalanuvchi sifatida bir necha qadamda tizimga qo'shiling va zamonaviy dashboard,
                  xarajatlar boshqaruvi hamda profil sahifalaridan foydalanishni boshlang.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'AI yordami', desc: 'Xarajatlarni tahlil qilish va aqlli tavsiyalar olish.' },
                  { title: 'Chek skan', desc: "Rasm orqali expense ma'lumotlarini tez to'ldirish." },
                  { title: 'Responsive', desc: 'Barcha sahifalar mobil va desktop uchun mos.' },
                ].map((item) => (
                  <div key={item.title} className="glass-card rounded-[24px] p-4">
                    <p className="text-sm font-semibold theme-text">{item.title}</p>
                    <p className="soft-text mt-2 text-xs leading-6">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 glass-card rounded-[28px] p-5">
                <p className="text-sm font-semibold theme-text">Ro'yxatdan o'tgach nimalarga ega bo'lasiz?</p>
                <div className="mt-4 space-y-3">
                  {[
                    'Landing uslubiga mos ichki zamonaviy interfeys',
                    "Ko'p platformali login variantlari",
                    'Shaxsiy profil va xarajat tarixini boshqarish',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm theme-text-soft">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(165,180,252,0.8)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
