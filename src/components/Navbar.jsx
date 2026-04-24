import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Xarajatlar' },
  { to: '/profile', label: 'Profil' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
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

  const linkClassName = (path) => {
    const isActive = location.pathname === path
    return [
      'rounded-full px-4 py-2 text-sm font-medium transition duration-200',
      isActive
        ? 'theme-chip shadow-[0_0_30px_rgba(99,102,241,0.16)]'
        : 'theme-text-faint hover:border-[var(--ghost-border)] hover:bg-[var(--ghost-bg)] hover:text-[var(--text-primary)] border border-transparent',
    ].join(' ')
  }

  return (
    <nav className="theme-nav fixed inset-x-0 top-0 z-50 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-full border border-[var(--ghost-border)] bg-[var(--ghost-bg)] px-4 py-2 text-sm font-semibold tracking-[-0.02em] text-[var(--text-primary)] transition hover:bg-[var(--ghost-hover-bg)]"
          onClick={() => setMenuOpen(false)}
        >
          <BrandLogo size="sm" nameClassName="hidden sm:inline" />
        </Link>

        <div className="ml-2 hidden items-center gap-2 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={linkClassName(item.to)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <div className="glass-card-soft flex items-center gap-3 rounded-full px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500/80 to-sky-500/80 text-xs font-bold text-white">
              {user?.profilePicture ? (
                <img
                  src={`http://localhost:8080${user.profilePicture}`}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user?.fullName)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold theme-text">{user?.fullName}</p>
              <p className="truncate text-xs theme-text-faint">{user?.email}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="ghost-button rounded-full px-4 py-2 text-sm font-medium transition">
            Chiqish
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle compact />
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ghost-border)] bg-[var(--ghost-bg)] text-lg text-[var(--text-primary)]"
            aria-label="Menu"
          >
            {menuOpen ? 'x' : '='}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="theme-nav-mobile px-4 py-4 md:hidden">
          <div className="glass-card space-y-2 rounded-[28px] p-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${linkClassName(item.to)}`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 rounded-[22px] border border-[var(--surface-soft-border)] bg-[var(--ghost-bg)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500/80 to-sky-500/80 text-xs font-bold text-white">
                  {user?.profilePicture ? (
                    <img
                      src={`http://localhost:8080${user.profilePicture}`}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(user?.fullName)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold theme-text">{user?.fullName}</p>
                  <p className="truncate text-xs theme-text-faint">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ghost-button mt-4 w-full rounded-2xl px-4 py-3 text-sm font-medium transition"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
