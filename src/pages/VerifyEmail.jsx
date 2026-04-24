import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ThemeToggle from '../components/ThemeToggle'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
        .then(() => {
          setStatus('success')
          setMessage('Email muvaffaqiyatli tasdiqlandi!')
          setTimeout(() => navigate('/login'), 3000)
        })
        .catch((err) => {
          if (err.response?.status === 400 && err.response?.data?.error?.includes('allaqachon')) {
            setStatus('success')
            setMessage('Email muvaffaqiyatli tasdiqlandi!')
            setTimeout(() => navigate('/login'), 3000)
            return
          }

          setStatus('error')
          setMessage(err.response?.data?.error || "Tasdiqlash havolasi noto'g'ri yoki muddati o'tgan!")
        })
    } else {
      setStatus('sent')
    }
  }, [])

  const handleResend = async (e) => {
    e.preventDefault()
    setResendLoading(true)
    setResendSuccess('')
    try {
      await api.post('/auth/resend-verification', { email: resendEmail })
      setResendSuccess('Tasdiqlash emaili yuborildi! Emailingizni tekshiring.')
    } catch (err) {
      setResendSuccess(err.response?.data?.error || 'Xatolik yuz berdi!')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>

      <main className="auth-page-shell flex items-center justify-center">
        <div className="glass-card w-full max-w-lg rounded-[32px] p-6 text-center sm:p-8">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-b-2 border-indigo-500" />
              <h1 className="panel-title text-2xl">Email tasdiqlanmoqda...</h1>
              <p className="soft-text mt-3 text-sm">Iltimos kuting</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="theme-alert-success mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold">
                OK
              </div>
              <h1 className="panel-title text-3xl">Tasdiqlandi!</h1>
              <p className="mt-3 text-sm" style={{ color: 'var(--success-text)' }}>{message}</p>
              <p className="soft-text mt-3 text-sm">3 soniyadan keyin login sahifasiga o'tkazilasiz...</p>
              <Link to="/login" className="glow-button mt-6 inline-block rounded-2xl px-6 py-3 text-sm font-semibold transition">
                Kirish
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="theme-alert-danger mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold">
                !
              </div>
              <h1 className="panel-title text-3xl">Xatolik</h1>
              <p className="mt-3 text-sm" style={{ color: 'var(--danger-text)' }}>{message}</p>

              <div className="glass-card-soft mt-6 rounded-[26px] p-5 text-left">
                <p className="theme-text mb-3 text-sm font-medium">Yangi tasdiqlash emaili olish:</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="dark-input px-4 py-3 text-sm"
                    placeholder="emailingiz@mail.com"
                    required
                  />
                  {resendSuccess && (
                    <p className="text-xs" style={{ color: resendSuccess.includes('yuborildi') ? 'var(--success-text)' : 'var(--danger-text)' }}>
                      {resendSuccess}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="glow-button w-full rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:opacity-70"
                  >
                    {resendLoading ? 'Yuborilmoqda...' : 'Qayta yuborish'}
                  </button>
                </form>
              </div>

              <Link to="/login" className="theme-text-soft mt-5 inline-block text-sm hover:text-[var(--text-primary)]">
                Loginga qaytish
              </Link>
            </>
          )}

          {status === 'sent' && (
            <>
              <div className="theme-alert-info mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold">
                @
              </div>
              <h1 className="panel-title text-3xl">Emailni tekshiring</h1>
              <p className="soft-text mt-3 text-sm leading-7">
                Ro'yxatdan o'tganingiz uchun emailingizga tasdiqlash havolasi yuborildi. Emailni tasdiqlang va kirish
                imkoniyatiga ega bo'ling.
              </p>

              <div className="glass-card-soft mt-6 rounded-[26px] p-5 text-left">
                <p className="theme-text mb-3 text-sm font-medium">Email kelmadimi? Qayta yuborish:</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="dark-input px-4 py-3 text-sm"
                    placeholder="emailingiz@mail.com"
                    required
                  />
                  {resendSuccess && (
                    <p className="text-xs" style={{ color: resendSuccess.includes('yuborildi') ? 'var(--success-text)' : 'var(--danger-text)' }}>
                      {resendSuccess}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="glow-button w-full rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:opacity-70"
                  >
                    {resendLoading ? 'Yuborilmoqda...' : 'Qayta yuborish'}
                  </button>
                </form>
              </div>

              <Link to="/login" className="theme-text-soft mt-5 inline-block text-sm hover:text-[var(--text-primary)]">
                Loginga qaytish
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
