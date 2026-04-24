export default function LoadingScreen({ message = "Yuklanmoqda..." }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: "'Sora', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&display=swap');

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(60px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(60px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(80px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(80px) rotate(-600deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40%           { transform: scale(1); opacity: 1; }
        }

        .orbit-1 { animation: orbit  1.8s linear infinite; }
        .orbit-2 { animation: orbit2 2.4s linear infinite; }
        .orbit-3 { animation: orbit3 3.0s linear infinite; }

        .pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(99,102,241,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }
        .pulse-ring-2 {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(139,92,246,0.4);
          animation: pulse-ring 2s ease-out 0.6s infinite;
        }
        .pulse-ring-3 {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(59,130,246,0.3);
          animation: pulse-ring 2s ease-out 1.2s infinite;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a78bfa 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }

        .dot-1 { animation: bounce-dot 1.4s ease-in-out 0.0s infinite; }
        .dot-2 { animation: bounce-dot 1.4s ease-in-out 0.2s infinite; }
        .dot-3 { animation: bounce-dot 1.4s ease-in-out 0.4s infinite; }

        .fade-in-up { animation: fadeInUp 0.8s ease forwards; }
      `}</style>

      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}/>

      {/* Grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }}/>

      {/* Main loader */}
      <div className="fade-in-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '160px', height: '160px', marginBottom: '48px' }}>

        {/* Pulse rings */}
        <div className="pulse-ring"/>
        <div className="pulse-ring-2"/>
        <div className="pulse-ring-3"/>

        {/* Center logo */}
        <div style={{ position: 'relative', zIndex: 10, width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}>
          💸
        </div>

        {/* Orbiting dots */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="orbit-1" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', boxShadow: '0 0 10px rgba(99,102,241,0.8)' }}/>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="orbit-2" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #c4b5fd)', boxShadow: '0 0 10px rgba(139,92,246,0.8)' }}/>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="orbit-3" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 10px rgba(59,130,246,0.8)' }}/>
        </div>
      </div>

      {/* Logo text */}
      <div className="fade-in-up" style={{ animationDelay: '0.2s', opacity: 0, textAlign: 'center', marginBottom: '16px' }}>
        <h1 className="shimmer-text" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>
          Expense Tracker
        </h1>
      </div>

      {/* Message + dots */}
      <div className="fade-in-up" style={{ animationDelay: '0.4s', opacity: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div className="dot-1" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }}/>
          <div className="dot-2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }}/>
          <div className="dot-3" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }}/>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="fade-in-up" style={{ animationDelay: '0.6s', opacity: 0, position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '200px' }}>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: '100px',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            width: '60%'
          }}/>
        </div>
      </div>
    </div>
  )
}