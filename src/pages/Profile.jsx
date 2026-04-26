import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import LoadingScreen from '../components/LoadingScreen'

function DangerModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-[30px] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/25 bg-red-500/12 text-2xl text-red-300">
          !
        </div>
        <h2 className="mt-5 text-2xl font-bold theme-text">Barcha xarajatlarni o&apos;chirish</h2>
        <p className="soft-text mt-3 text-sm leading-6">
          Bu amal barcha yozuvlarni butunlay o&apos;chiradi va uni qaytarib bo&apos;lmaydi.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={onClose} className="ghost-button w-full rounded-2xl px-4 py-3 text-sm font-medium transition">
            Bekor qilish
          </button>
          <button onClick={onConfirm} className="danger-button w-full rounded-2xl px-4 py-3 text-sm font-semibold transition">
            O&apos;chirish
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passLoading, setPassLoading] = useState(false)
  const [passSuccess, setPassSuccess] = useState('')
  const [passError, setPassError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pictureLoading, setPictureLoading] = useState(false)
  const [pictureError, setPictureError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile')
      setProfile(res.data)
      setProfileForm({
        fullName: res.data.fullName,
        email: res.data.email,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePictureUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    setPictureError('Rasm hajmi 5MB dan oshmasin!')
    return
  }

  if (!file.type.startsWith('image/')) {
    setPictureError('Faqat rasm fayllari qabul qilinadi!')
    return
  }

  setPictureLoading(true)
  setPictureError('')

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await api.post('/user/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    setProfile(res.data)

    // localStorage yangilash
    localStorage.setItem('profilePicture', res.data.profilePicture || '')

    // ✅ user null bo'lmasligi uchun tekshiruv
    const currentToken = localStorage.getItem('token')
    const currentEmail = localStorage.getItem('email')
    const currentFullName = localStorage.getItem('fullName')

    if (currentToken) {
      login({
        token: currentToken,
        email: currentEmail,
        fullName: currentFullName,
        profilePicture: res.data.profilePicture || ''
      })
    }

    setPictureError('')
  } catch (err) {
    console.error('Picture upload error:', err)
    setPictureError('Rasm yuklashda xatolik!')
  } finally {
    setPictureLoading(false)
  }
}
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      await api.put('/user/profile', profileForm)
      setProfileSuccess("Ma'lumotlar yangilandi. Xavfsizlik uchun qayta kirishingiz kerak...")
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 2000)
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Xatolik yuz berdi!')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')

    if (!passForm.oldPassword) {
      setPassError("Eski parol bo'sh bo'lmasin!")
      return
    }
    if (!passForm.newPassword) {
      setPassError("Yangi parol bo'sh bo'lmasin!")
      return
    }
    if (passForm.newPassword.length < 6) {
      setPassError("Yangi parol kamida 6 ta belgi bo'lsin!")
      return
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError("Yangi parollar mos kelmayapti!")
      return
    }

    setPassLoading(true)
    try {
      await api.put('/user/password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword,
      })
      setPassSuccess("Parol muvaffaqiyatli o'zgartirildi!")
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object' && !data.error) {
        const messages = Object.values(data).join(', ')
        setPassError(messages)
      } else {
        setPassError(data?.error || 'Xatolik yuz berdi!')
      }
    } finally {
      setPassLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'ET'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleDeletePicture = async () => {
  try {
    await api.delete('/user/profile/picture')
    setProfile({ ...profile, profilePicture: null })
    localStorage.setItem('profilePicture', '')

    const currentToken = localStorage.getItem('token')
    if (currentToken) {
      login({
        token: currentToken,
        email: localStorage.getItem('email'),
        fullName: localStorage.getItem('fullName'),
        profilePicture: ''
      })
    }
  } catch (err) {
    setPictureError('Rasmni o\'chirishda xatolik!')
  }
}

  const handleDeleteAllExpenses = async () => {
    try {
      await api.delete('/expenses/all')
      setShowDeleteModal(false)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <LoadingScreen message="Profil yuklanmoqda" />

  return (
    <div className="app-shell">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-10 sm:px-6 lg:px-8">
        <section className="glass-card-highlight rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-[var(--theme-chip-border)] bg-[var(--ghost-bg)] text-2xl font-bold theme-text shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  {profile?.profilePicture ? (
  <img
    src={profile.profilePicture}  // To'liq URL
    alt="Profile"
    className="w-full h-full object-cover"
  />
) : (
  <span>{getInitials(profile?.fullName)}</span>
)}
                </div>

                <label
                  htmlFor="picture-upload"
                  className={`absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm text-white shadow-lg transition ${
                    pictureLoading ? 'bg-white/10' : 'bg-indigo-500 hover:bg-indigo-400'
                  }`}
                  title="Rasm yuklash"
                >
                  {pictureLoading ? <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" /> : '+'}
                </label>
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                  disabled={pictureLoading}
                />

                {profile?.profilePicture && (
                  <button
                    onClick={handleDeletePicture}
                    className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-400/25 bg-red-500/90 text-sm text-white transition hover:bg-red-500"
                    title="Rasmni o'chirish"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="max-w-xl">
                <span className="section-badge">Account Center</span>
                <h1 className="page-title mt-4 text-4xl font-extrabold theme-text sm:text-5xl">{profile?.fullName}</h1>
                <p className="soft-text mt-3 text-sm leading-7 sm:text-base">{profile?.email}</p>
                <p className="faint-text mt-2 text-sm">
                  A&apos;zo bo&apos;lgan sana:{' '}
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('uz-UZ') : '—'}
                </p>
                {pictureError && <p className="mt-2 text-sm" style={{ color: 'var(--danger-text)' }}>{pictureError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="glass-card rounded-[24px] p-5">
                <p className="text-sm font-medium theme-text-soft">Xarajatlar soni</p>
                <p className="stat-value mt-3 text-3xl font-extrabold tracking-[-0.04em]">
                  {profile?.totalExpenses || 0}
                </p>
              </div>
              <div className="glass-card rounded-[24px] p-5">
                <p className="text-sm font-medium theme-text-soft">Jami summa</p>
                <p className="stat-value mt-3 text-3xl font-extrabold tracking-[-0.04em]">
                  {(profile?.totalAmount || 0).toLocaleString()} so&apos;m
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="glass-card rounded-[30px] p-5 sm:p-6">
            <div className="mb-5">
              <span className="section-badge">Personal Info</span>
              <h2 className="panel-title mt-4 text-2xl">Shaxsiy ma&apos;lumotlar</h2>
              <p className="soft-text mt-2 text-sm">Ism va emailni yangilash uchun quyidagi formadan foydalaning.</p>
            </div>

            {profileSuccess && (
              <div className="mb-5 rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="theme-alert-danger mb-5 rounded-[22px] px-4 py-3 text-sm">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">To&apos;liq ism</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="dark-input px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="dark-input px-4 py-3 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {profileLoading ? 'Saqlanmoqda...' : "Ma'lumotlarni saqlash"}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[30px] p-5 sm:p-6">
            <div className="mb-5">
              <span className="section-badge">Security</span>
              <h2 className="panel-title mt-4 text-2xl">Parolni yangilash</h2>
              <p className="soft-text mt-2 text-sm">Hisob xavfsizligini saqlash uchun parolni vaqti-vaqti bilan yangilang.</p>
            </div>

            {passSuccess && (
              <div className="mb-5 rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {passSuccess}
              </div>
            )}
            {passError && (
              <div className="theme-alert-danger mb-5 rounded-[22px] px-4 py-3 text-sm">
                {passError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Eski parol</label>
                <input
                  type="password"
                  value={passForm.oldPassword}
                  onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                  className="dark-input px-4 py-3 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Yangi parol</label>
                <input
                  type="password"
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  className="dark-input px-4 py-3 text-sm"
                  placeholder="Kamida 6 ta belgi"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium theme-label">Yangi parolni tasdiqlang</label>
                <input
                  type="password"
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  className="dark-input px-4 py-3 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={passLoading}
                className="glow-button w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {passLoading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
              </button>
            </form>
          </div>
        </section>

        <section className="mt-6 glass-card rounded-[30px] border border-red-400/12 p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="section-badge">Danger Zone</span>
              <h2 className="mt-4 text-2xl font-bold" style={{ color: 'var(--danger-text)' }}>Xavfli zona</h2>
              <p className="mt-3 text-sm leading-7 theme-text-soft">
                Hisobdan chiqish yoki barcha xarajatlarni o&apos;chirish kabi ehtiyotkorlik talab qiladigan amallar shu yerda.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="ghost-button rounded-2xl px-5 py-3 text-sm font-medium transition"
              >
                Hisobdan chiqish
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="danger-button rounded-2xl px-5 py-3 text-sm font-semibold transition"
              >
                Barcha xarajatlarni o&apos;chirish
              </button>
            </div>
          </div>
        </section>
      </main>

      {showDeleteModal && <DangerModal onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteAllExpenses} />}
    </div>
  )
}
