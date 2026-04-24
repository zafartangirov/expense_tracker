import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ThemeToggle from '../components/ThemeToggle'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(`${email} ga kod yuborildi!`)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Xatolik yuz berdi!')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/verify-code', { email, code })
      setSuccess('')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Kod noto'g'ri!")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Parollar mos kelmayapti!')
      return
    }
    if (newPassword.length < 6) {
      setError("Parol kamida 6 ta belgi bo'lsin!")
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, code, newPassword })
      setSuccess("Parol muvaffaqiyatli o'zgartirildi!")
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Xatolik yuz berdi!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>

      <main className="auth-page-shell flex items-center justify-center">
        <div className="glass-card w-full max-w-lg rounded-[32px] p-6 sm:p-8">
          <div className="mb-8 text-center">
            <span className="section-badge">Password Recovery</span>
            <h1 className="panel-title mt-4 text-3xl">Parolni tiklash</h1>
            <p className="soft-text mt-3 text-sm">
              {step === 1 && 'Emailingizni kiriting'}
              {step === 2 && 'Emailga yuborilgan kodni kiriting'}
              {step === 3 && "Yangi parol o'rnating"}
            </p>
          </div>

          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    step > item
                      ? 'bg-emerald-500 text-white'
                      : step === item
                        ? 'bg-indigo-500 text-white'
                        : 'theme-chip'
                  }`}
                >
                  {step > item ? 'OK' : item}
                </div>
                {item < 3 && (
                  <div className={`h-0.5 w-10 ${step > item ? 'bg-emerald-500' : 'bg-[var(--progress-neutral)]'}`} />
                )}
              </div>
            ))}
          </div>

          {error && <div className="theme-alert-danger mb-4 rounded-[22px] px-4 py-3 text-sm">{error}</div>}
          {success && <div className="theme-alert-success mb-4 rounded-[22px] px-4 py-3 text-sm">{success}</div>}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  className="dark-input px-4 py-3 text-sm"
                  placeholder="sardor@mail.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:opacity-70"
              >
                {loading ? 'Yuborilmoqda...' : 'Kod yuborish'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">6 raqamli kod</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setError('')
                  }}
                  className="dark-input px-4 py-3 text-center text-2xl font-bold tracking-[0.4em]"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="theme-text-faint mt-2 text-center text-xs">Kod 15 daqiqa davomida amal qiladi</p>
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:opacity-70"
              >
                {loading ? 'Tekshirilmoqda...' : 'Kodni tasdiqlash'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setCode('')
                  setError('')
                  setSuccess('')
                }}
                className="ghost-button w-full rounded-2xl px-5 py-3 text-sm font-medium transition"
              >
                Emailni o'zgartirish
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Yangi parol</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setError('')
                  }}
                  className="dark-input px-4 py-3 text-sm"
                  placeholder="Kamida 6 ta belgi"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Parolni tasdiqlang</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError('')
                  }}
                  className={`dark-input px-4 py-3 text-sm ${confirmPassword && newPassword !== confirmPassword ? 'border-red-400/50' : ''}`}
                  placeholder="********"
                  required
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-xs" style={{ color: 'var(--danger-text)' }}>
                    Parollar mos kelmayapti
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword}
                className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:opacity-70"
              >
                {loading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm theme-text-faint">
            <Link to="/login" className="font-semibold theme-text-soft transition hover:text-[var(--text-primary)]">
              Loginga qaytish
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
