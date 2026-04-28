import { NavLink, useLocation } from 'react-router-dom';
import { Globe, Rocket, Radio, Camera, Menu, X, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../App';

const NAV_ITEMS = [
  { path: '/', label: 'Solar System', icon: Globe },
  { path: '/planets', label: 'Planets', icon: Globe },
  { path: '/missions', label: 'Missions', icon: Rocket },
  { path: '/neo', label: 'NEO Tracker', icon: Radio },
  { path: '/apod', label: 'Deep Space', icon: Camera },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wsConnected } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(2, 2, 10, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(123,47,190,0.3))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            border: '1px solid rgba(0,212,255,0.3)',
            boxShadow: '0 0 20px rgba(0,212,255,0.2)',
          }}>
            🪐
          </div>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Cosmos Explorer
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, '@media (max-width: 768px)': { display: 'none' } } as any}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? '#00d4ff' : 'rgba(220,230,255,0.75)',
                background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Status indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: wsConnected ? '#00ff88' : '#ff4466',
          }}>
            {wsConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span style={{ display: window.innerWidth < 640 ? 'none' : 'block' }}>
              {wsConnected ? 'LIVE' : 'OFFLINE'}
            </span>
            <div style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: wsConnected ? '#00ff88' : '#ff4466',
              boxShadow: wsConnected ? '0 0 8px #00ff88' : '0 0 8px #ff4466',
              animation: wsConnected ? 'pulse 2s infinite' : 'none',
            }} />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#f0f4ff',
              padding: '7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(5,5,15,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: isActive ? '#00d4ff' : 'rgba(220,230,255,0.8)',
                background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
