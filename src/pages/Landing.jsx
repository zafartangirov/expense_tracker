import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from '../components/BrandLogo'
import ThemeToggle from '../components/ThemeToggle'
import bulbEmoji from '../assets/landing-emojis/bulb.png'
import chartEmoji from '../assets/landing-emojis/chart.png'
import chartUpEmoji from '../assets/landing-emojis/chart-up.png'
import currencyExchangeEmoji from '../assets/landing-emojis/currency-exchange.png'
import lockEmoji from '../assets/landing-emojis/lock.png'
import moneyWingsEmoji from '../assets/landing-emojis/money-wings.png'
import personEmoji from '../assets/landing-emojis/person.png'
import plusEmoji from '../assets/landing-emojis/plus.png'
import robotEmoji from '../assets/landing-emojis/robot.png'
import rocketEmoji from '../assets/landing-emojis/rocket.png'
import scrollEmoji from '../assets/landing-emojis/scroll.png'

const stats = [
  { num: '10K+', label: 'Foydalanuvchilar' },
  { num: '99.9%', label: 'Uptime' },
  { num: '4.9', label: 'Reyting' },
]

const features = [
  {
    icon: robotEmoji,
    title: 'AI Kategoriyalash',
    desc: "Xarajatlaringiz avtomatik kategoriyalanadi. Qo'lda deyarli hech narsa kiritmaysiz.",
  },
  {
    icon: scrollEmoji,
    title: 'Chek Skan',
    desc: "Chek rasmini yuklang, tizim kerakli maydonlarni avtomatik to'ldiradi.",
  },
  {
    icon: chartEmoji,
    title: 'Aqlli Hisobotlar',
    desc: 'Oylik, haftalik va yillik hisobotlarni grafik va diagrammalar bilan ko\'ring.',
  },
  {
    icon: bulbEmoji,
    title: 'Tejash Maslahatlari',
    desc: 'AI xarajatlaringizni tahlil qilib, amaliy tejash tavsiyalarini beradi.',
  },
  {
    icon: currencyExchangeEmoji,
    title: 'Valyuta Konvertatsiya',
    desc: "Turli valyutalarda xarajat qo'shing va avtomatik konvertatsiyadan foydalaning.",
  },
  {
    icon: lockEmoji,
    title: 'Xavfsiz Kirish',
    desc: 'Google, GitHub, Telegram yoki email orqali qulay va himoyalangan kirish.',
  },
]

const steps = [
  {
    step: '01',
    title: "Ro'yxatdan o'ting",
    desc: 'Google, GitHub yoki email orqali bir necha soniyada hisob yarating.',
    icon: personEmoji,
  },
  {
    step: '02',
    title: "Xarajat qo'shing",
    desc: "Xarajatni qo'lda kiriting yoki chek yuklang. AI ma'lumotlarni tayyorlaydi.",
    icon: plusEmoji,
  },
  {
    step: '03',
    title: 'Tahlil oling',
    desc: 'Dashboard ichida grafiklar, kuzatuvlar va tavsiyalarni ko\'ring.',
    icon: chartUpEmoji,
  },
]

const floatingTokens = [
  { top: '16%', left: '8%', icon: moneyWingsEmoji, name: 'Money', delay: '0s' },
  { top: '22%', right: '8%', icon: robotEmoji, name: 'Robot', delay: '0.5s' },
  { bottom: '28%', left: '7%', icon: scrollEmoji, name: 'Scroll', delay: '1s' },
  { bottom: '20%', right: '7%', icon: chartEmoji, name: 'Chart', delay: '1.4s' },
  { top: '52%', left: '3%', icon: currencyExchangeEmoji, name: 'Exchange', delay: '0.8s' },
  { top: '45%', right: '4%', icon: bulbEmoji, name: 'Idea', delay: '1.2s' },
]

export default function Landing() {
  const { user } = useAuth()
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className={`app-shell${user ? ' landing-authenticated' : ''}`}
      style={{
        fontFamily: "'Sora', sans-serif",
        minHeight: '100vh',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(99,102,241,0.2); }
        .btn-glow { position:relative; overflow:hidden; }
        .btn-glow::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transition:0.5s; }
        .btn-glow:hover::before { left:100%; }
        .animate-up { animation: slideUp 0.8s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity:0; }
        .delay-2 { animation-delay: 0.2s; opacity:0; }
        .delay-3 { animation-delay: 0.3s; opacity:0; }
        .delay-4 { animation-delay: 0.4s; opacity:0; }
        .delay-5 { animation-delay: 0.5s; opacity:0; }
        .stat-num { background: linear-gradient(135deg, var(--text-primary), #a78bfa, #60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .feature-icon { animation: float 3s ease-in-out infinite; }
        .shimmer-text { background: linear-gradient(90deg, var(--text-primary) 0%, #a78bfa 50%, var(--text-primary) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        .landing-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(20px); background: var(--nav-bg); border-bottom: 1px solid var(--nav-border); }
        .landing-nav-inner { max-width: 1200px; margin: 0 auto; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .landing-nav-row { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .landing-brand { display: inline-flex; align-items: center; color: var(--text-primary); text-decoration: none; min-width: 0; }
        .landing-nav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
        .landing-nav-theme-mobile { display: none; }
        .landing-nav-link { position: relative; display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 20px; border-radius: 14px; text-decoration: none; font-size: 14px; font-weight: 600; white-space: nowrap; transition: transform 0.2s ease, background-color 0.2s ease; }
        .landing-nav-link:hover { transform: translateY(-1px); }
        .landing-nav-link-secondary { border: 1px solid var(--ghost-border); color: var(--text-primary); background: var(--ghost-bg); }
        .landing-nav-link-secondary:hover { background: var(--ghost-hover-bg); }
        .landing-nav-link-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; box-shadow: 0 14px 36px rgba(99,102,241,0.26); }
        .landing-nav-user-chip { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; max-width: 220px; padding: 12px 16px; border-radius: 14px; border: 1px solid var(--surface-soft-border); background: var(--surface-soft-bg); color: var(--text-soft); font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; backdrop-filter: blur(12px); }
        .landing-hero { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 140px 20px 60px; }
        .landing-floating-token { position: absolute; color: var(--badge-text); width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--badge-border); background: var(--badge-bg); display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 12px 30px rgba(99,102,241,0.12); }
        .landing-floating-token img { width: 34px; height: 34px; object-fit: contain; }
        @media (max-width: 900px) {
          .landing-nav-inner { padding: 18px 24px; }
          .landing-hero { padding-top: 150px; }
        }
        @media (max-width: 640px) {
          .landing-nav-inner { padding: 14px 16px 16px; flex-direction: column; align-items: stretch; gap: 12px; }
          .landing-nav-row { width: 100%; justify-content: space-between; }
          .landing-nav-theme-desktop { display: none; }
          .landing-nav-theme-mobile { display: inline-flex; flex-shrink: 0; }
          .landing-nav-actions { width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .landing-authenticated .landing-nav-actions { grid-template-columns: 1fr; }
          .landing-nav-link,
          .landing-nav-user-chip { width: 100%; max-width: none; }
          .landing-hero { padding: 164px 16px 48px; }
          .landing-authenticated .landing-hero { padding-top: 214px; }
          .landing-floating-token { display: none; }
        }
        @media (max-width: 420px) {
          .landing-brand { transform: scale(0.96); transform-origin: left center; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
      </div>

      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-row">
            <Link to="/" className="landing-brand">
              <BrandLogo size="md" nameClassName="text-[17px] sm:text-[18px]" />
            </Link>

            <div className="landing-nav-theme-mobile">
              <ThemeToggle compact />
            </div>
          </div>

          <div className="landing-nav-actions">
            <div className="landing-nav-theme-desktop">
              <ThemeToggle />
            </div>

            {user ? (
              <>
                <span className="landing-nav-user-chip" title={user.fullName}>
                  {user.fullName}
                </span>

                <Link to="/dashboard" className="landing-nav-link landing-nav-link-primary btn-glow">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="landing-nav-link landing-nav-link-secondary">
                  Kirish
                </Link>

                <Link to="/register" className="landing-nav-link landing-nav-link-primary btn-glow">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="landing-hero">
        <div style={{ maxWidth: '800px' }}>
          <div className="animate-up delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--badge-border)', background: 'var(--badge-bg)', marginBottom: '32px', fontSize: '13px', color: 'var(--badge-text)' }}>
            <span style={{ animation: 'pulse 2s infinite', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--badge-text)', display: 'inline-block' }} />
            AI bilan moliyaviy mustaqillikka qadam qo'ying
          </div>

          <h1 className="animate-up delay-2" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-3px', marginBottom: '24px' }}>
            Xarajatlaringizni <span className="shimmer-text">aqlli boshqaring</span>
          </h1>

          <p className="animate-up delay-3" style={{ fontSize: '18px', color: 'var(--text-soft)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
            Sun'iy intellekt yordamida xarajatlaringizni kategoriyalang, oylik hisobotlar oling va moliyaviy mustaqillikka erishing.
          </p>

          <div className="animate-up delay-4" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
            <Link to="/register" className="btn-glow" style={{ padding: '16px 36px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', fontSize: '16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              Bepul boshlash
            </Link>
            <Link to="/login" style={{ padding: '16px 36px', borderRadius: '14px', border: '1px solid var(--ghost-border)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '16px', fontWeight: 500, backdropFilter: 'blur(10px)', background: 'var(--ghost-bg)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Kirish
            </Link>
          </div>

          <div className="animate-up delay-5" style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {stats.map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div className="stat-num" style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>{item.num}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-faint)', marginTop: '4px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={heroRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'transform 0.1s' }}>
          {floatingTokens.map((token, index) => (
            <div
              key={`${token.name}-${index}`}
              className="landing-floating-token"
              style={{
                top: token.top,
                left: token.left,
                right: token.right,
                bottom: token.bottom,
                animation: `float 3s ease-in-out ${token.delay} infinite`,
              }}
            >
              <img src={token.icon} alt={token.name} />
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 1, padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '16px' }}>
            Nima uchun bizni tanlashadi?
          </h2>
          <p style={{ color: 'var(--text-faint)', fontSize: '16px' }}>Barcha kerakli funksiyalar bir joyda</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {features.map((feature, index) => (
            <div key={feature.title} className="card-hover" style={{ padding: '32px', borderRadius: '20px', background: 'var(--surface-soft-bg)', border: '1px solid var(--surface-soft-border)', backdropFilter: 'blur(10px)' }}>
              <div className="feature-icon" style={{ width: '64px', height: '64px', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', background: 'var(--badge-bg)', color: 'var(--badge-text)', animationDelay: `${index * 0.3}s` }}>
                <img src={feature.icon} alt="" aria-hidden="true" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.5px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-soft)', lineHeight: 1.7, fontSize: '14px' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 1, padding: '80px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '16px' }}>
            Qanday ishlaydi?
          </h2>
          <p style={{ color: 'var(--text-faint)', fontSize: '16px' }}>3 ta oddiy qadam</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((item) => (
            <div key={item.step} className="card-hover" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', padding: '32px', borderRadius: '20px', background: 'var(--surface-soft-bg)', border: '1px solid var(--surface-soft-border)' }}>
              <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#6366f1', fontWeight: 700, minWidth: '36px', paddingTop: '4px', letterSpacing: '1px' }}>{item.step}</div>
              <div style={{ minWidth: '64px', height: '64px', borderRadius: '20px', background: 'var(--badge-bg)', color: 'var(--badge-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.icon} alt="" aria-hidden="true" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.5px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-soft)', lineHeight: 1.7, fontSize: '14px', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 1, padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 40px', borderRadius: '28px', background: 'var(--surface-highlight-bg)', border: '1px solid var(--surface-highlight-border)', backdropFilter: 'blur(20px)', boxShadow: '0 0 80px rgba(99,102,241,0.15)' }}>
          <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', borderRadius: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ghost-bg)', color: 'var(--text-primary)' }}>
            <img src={rocketEmoji} alt="" aria-hidden="true" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>
            Bugun boshlang!
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '16px', lineHeight: 1.7, marginBottom: '36px' }}>
            Minglab foydalanuvchilar bilan birgalikda moliyaviy mustaqillikka erishishni boshlang. Bepul va hech qanday majburiyatsiz.
          </p>
          <Link to="/register" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 40px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', fontSize: '16px', fontWeight: 700, boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}>
            Bepul ro'yxatdan o'tish
          </Link>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-faint)' }}>
            Kredit karta talab qilinmaydi | Bepul | 30 soniyada tayyor
          </p>
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, padding: '40px 20px', textAlign: 'center', borderTop: '1px solid var(--nav-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <BrandLogo size="sm" nameClassName="text-[16px]" />
        </div>
        <p style={{ color: 'var(--text-faint)', fontSize: '13px', marginBottom: '16px' }}>
          AI bilan moliyaviy mustaqillikka qadam qo'ying
        </p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-faint)', textDecoration: 'none', fontSize: '13px' }}>Kirish</Link>
          <Link to="/register" style={{ color: 'var(--text-faint)', textDecoration: 'none', fontSize: '13px' }}>Ro'yxatdan o'tish</Link>
        </div>
        <p style={{ color: 'var(--text-subtle)', fontSize: '12px', marginTop: '24px' }}>
          2026 Expense Tracker. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </div>
  )
}
