import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Satellite, Globe, ChevronRight, Wifi } from 'lucide-react';
import SolarSystem3D from '../components/SolarSystem3D';
import PlanetPanel from '../components/PlanetPanel';
import { api } from '../services/api';
import { useAppContext } from '../App';
import type { Planet, Mission } from '../types';

export default function Home() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selected, setSelected] = useState<Planet | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [loading, setLoading] = useState(true);
  const { liveData, wsConnected } = useAppContext();

  useEffect(() => {
    Promise.all([api.planets.getAll(), api.missions.getAll()]).then(([p, m]) => {
      setPlanets(p);
      setMissions(m.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Planets', value: '8', icon: '🪐' },
    { label: 'Missions', value: missions.length || '60+', icon: '🚀' },
    { label: 'Active Missions', value: missions.filter(m => m.status === 'active').length || '15+', icon: '📡' },
    { label: 'NEOs Tracked', value: liveData.neo?.totalCount ? liveData.neo.totalCount.toLocaleString() : '---', icon: '☄️' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#02020a' }}>
      {/* 3D Solar System - full screen */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {!loading && planets.length > 0 && (
          <SolarSystem3D
            planets={planets}
            onPlanetSelect={setSelected}
            selectedPlanet={selected}
            showLabels={showLabels}
          />
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 48 }} className="float">🪐</div>
            <div style={{ color: 'rgba(180,200,255,0.6)', fontSize: '0.9rem' }}>Initializing Solar System...</div>
          </div>
        )}
      </div>

      {/* UI Overlay */}
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {/* Hero text */}
        <div style={{
          paddingTop: 100,
          paddingLeft: 40,
          paddingRight: selected ? 400 : 40,
          maxWidth: 700,
          pointerEvents: 'auto',
        }}>
          <div style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 12 }}>
            NASA Open Data · Real-time · Interactive
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            background: 'linear-gradient(135deg, #f0f4ff 0%, #a78bfa 50%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Explore the<br />Solar System
          </h1>
          <p style={{ color: 'rgba(200,215,255,0.75)', fontSize: '1.05rem', maxWidth: 460, marginBottom: 28, lineHeight: 1.7 }}>
            60+ years of planetary exploration. Real NASA data. Interactive 3D visualization. Click any planet to discover its secrets.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/planets" className="btn btn-primary" style={{ pointerEvents: 'auto' }}>
              <Globe size={16} /> Explore Planets
            </Link>
            <Link to="/missions" className="btn" style={{ pointerEvents: 'auto' }}>
              <Rocket size={16} /> Mission Archive
            </Link>
            <button
              className="btn"
              onClick={() => setShowLabels(l => !l)}
              style={{ pointerEvents: 'auto', borderColor: showLabels ? 'rgba(0,212,255,0.4)' : undefined }}
            >
              {showLabels ? '🏷️ Hide Labels' : '🏷️ Show Labels'}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          background: 'rgba(2,2,15,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 50,
          padding: '12px 24px',
          pointerEvents: 'auto',
          zIndex: 2,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 20px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(180,200,255,0.5)', letterSpacing: '0.08em', marginBottom: 3 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Roboto Mono', color: '#00d4ff' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Live ISS tracker */}
        {liveData.iss && (
          <div style={{
            position: 'fixed',
            top: 80,
            right: 24,
            background: 'rgba(2,2,15,0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 12,
            padding: '12px 16px',
            zIndex: 2,
            pointerEvents: 'auto',
            minWidth: 200,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Satellite size={14} color="#00d4ff" />
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00d4ff' }}>ISS Position</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'pulse 2s infinite' }} />
            </div>
            <div style={{ fontFamily: 'Roboto Mono', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div><span style={{ color: 'rgba(180,200,255,0.5)', marginRight: 8 }}>LAT</span>
                <span style={{ color: '#f0f4ff' }}>{parseFloat(liveData.iss.position.latitude).toFixed(2)}°</span>
              </div>
              <div><span style={{ color: 'rgba(180,200,255,0.5)', marginRight: 8 }}>LON</span>
                <span style={{ color: '#f0f4ff' }}>{parseFloat(liveData.iss.position.longitude).toFixed(2)}°</span>
              </div>
            </div>
          </div>
        )}

        {/* NEO alert */}
        {liveData.neo && liveData.neo.hazardous > 0 && (
          <div style={{
            position: 'fixed',
            top: liveData.iss ? 200 : 80,
            right: 24,
            background: 'rgba(255,68,102,0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,68,102,0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            zIndex: 2,
            pointerEvents: 'auto',
            maxWidth: 220,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>☄️</span>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff4466' }}>Hazardous NEOs</span>
            </div>
            <div style={{ fontFamily: 'Roboto Mono', fontSize: '1.4rem', fontWeight: 700, color: '#ff4466' }}>
              {liveData.neo.hazardous}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(180,200,255,0.5)', marginTop: 3 }}>this week · <Link to="/neo" style={{ color: '#ff4466' }}>Track →</Link></div>
          </div>
        )}

        {/* Navigation hints */}
        <div style={{
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 24,
          fontSize: '0.75rem',
          color: 'rgba(180,200,255,0.4)',
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <span>🖱️ Drag to rotate</span>
          <span>⚲ Scroll to zoom</span>
          <span>👆 Click planet for details</span>
        </div>
      </div>

      {/* Planet detail panel */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ pointerEvents: 'auto', position: 'relative', width: 380, height: '100%' }}>
            <PlanetPanel planet={selected} missions={missions} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
