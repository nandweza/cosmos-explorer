import { useState, useEffect } from 'react';
import { Search, Thermometer, Globe, Wind, Satellite } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import type { Planet } from '../types';

export default function Planets() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selected, setSelected] = useState<Planet | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.planets.getAll().then(data => {
      setPlanets(data.filter((p: Planet) => p.id !== 'sun').concat(data.filter((p: Planet) => p.id === 'sun')));
      setLoading(false);
    });
  }, []);

  const filtered = planets.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'all' && p.type !== filter) return false;
    return true;
  });

  const radarData = selected ? [
    { subject: 'Size', A: Math.log10(selected.radius) / Math.log10(69911) * 100 },
    { subject: 'Mass', A: Math.log10(selected.mass) / Math.log10(1.898e27) * 100 },
    { subject: 'Gravity', A: (selected.surfaceGravity / 274) * 100 },
    { subject: 'Temp Range', A: Math.min(100, (selected.maxTemp - selected.minTemp) / 6.55) },
    { subject: 'Moons', A: Math.min(100, (selected.moons / 146) * 100) },
    { subject: 'Distance', A: (selected.distanceFromSun / 30.069) * 100 },
  ] : [];

  return (
    <div className="page" style={{ background: 'linear-gradient(to bottom, #02020a, #050510, #02020a)' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ paddingTop: 20 }}>
          <span className="section-eyebrow">Solar System Atlas</span>
          <h1 style={{ background: 'linear-gradient(135deg, #f0f4ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Planetary Data
          </h1>
          <p>Comprehensive data on every planet, from 50+ years of exploration missions.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,200,255,0.4)' }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Search planets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {['all', 'terrestrial', 'gas_giant', 'ice_giant', 'star'].map(f => (
            <button
              key={f}
              className="btn"
              onClick={() => setFilter(f)}
              style={{ borderColor: filter === f ? '#00d4ff' : undefined, color: filter === f ? '#00d4ff' : undefined }}
            >
              {f === 'all' ? 'All' : f === 'gas_giant' ? 'Gas Giants' : f === 'ice_giant' ? 'Ice Giants' : f === 'star' ? 'Star' : 'Terrestrial'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 24 }}>
          {/* Planet grid */}
          <div>
            {loading ? (
              <div className="grid-2">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="card skeleton" style={{ height: 200 }} />
                ))}
              </div>
            ) : (
              <div className="grid-2">
                {filtered.map(planet => (
                  <div
                    key={planet.id}
                    className="card"
                    onClick={() => setSelected(planet.id === selected?.id ? null : planet)}
                    style={{
                      cursor: 'pointer',
                      padding: 20,
                      borderColor: selected?.id === planet.id ? '#00d4ff' : undefined,
                      background: selected?.id === planet.id ? 'rgba(0,212,255,0.06)' : undefined,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* BG glow */}
                    <div style={{
                      position: 'absolute',
                      top: -40,
                      right: -40,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${planet.color}20 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      {/* Planet visual */}
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color, 0.4)} 0%, ${planet.color} 50%, ${darken(planet.color, 0.3)} 100%)`,
                        boxShadow: `0 0 20px ${planet.color}40, inset -8px -8px 16px rgba(0,0,0,0.5)`,
                        flexShrink: 0,
                        border: selected?.id === planet.id ? `2px solid ${planet.color}` : '2px solid transparent',
                      }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{planet.name}</h3>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(180,200,255,0.6)',
                          }}>
                            {planet.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(180,200,255,0.65)', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {planet.description.slice(0, 100)}...
                        </p>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: '0.78rem' }}>
                            <Thermometer size={12} color="#ff7722" />
                            <span style={{ color: 'rgba(180,200,255,0.7)' }}>{planet.avgTemp}°C avg</span>
                          </div>
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: '0.78rem' }}>
                            <Satellite size={12} color="#00d4ff" />
                            <span style={{ color: 'rgba(180,200,255,0.7)' }}>{planet.moons} moons</span>
                          </div>
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: '0.78rem' }}>
                            <Globe size={12} color="#a78bfa" />
                            <span style={{ color: 'rgba(180,200,255,0.7)' }}>{planet.distanceFromSun} AU</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ position: 'sticky', top: 84, height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
              <div className="glass" style={{ padding: 24 }}>
                {/* Planet graphic */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, ${lighten(selected.color, 0.5)} 0%, ${selected.color} 50%, ${darken(selected.color, 0.4)} 100%)`,
                    boxShadow: `0 0 50px ${selected.color}50, 0 0 100px ${selected.color}25`,
                    animation: 'float 4s ease-in-out infinite',
                  }} />
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: 4, background: `linear-gradient(135deg, ${selected.color}, #a78bfa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {selected.name}
                </h2>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(180,200,255,0.5)', marginBottom: 20 }}>
                  {selected.type.replace('_', ' ')} · {selected.distanceFromSun} AU from Sun
                </p>

                {/* Radar chart */}
                <div style={{ height: 200, marginBottom: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(180,200,255,0.6)', fontSize: 11 }} />
                      <Radar dataKey="A" stroke={selected.color} fill={selected.color} fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Quick stats */}
                {[
                  ['Radius', `${selected.radius.toLocaleString()} km`],
                  ['Orbital Period', `${selected.orbitalPeriod.toLocaleString()} days`],
                  ['Surface Gravity', `${selected.surfaceGravity} m/s²`],
                  ['Escape Velocity', `${selected.escapeVelocity} km/s`],
                  ['Avg Temperature', `${selected.avgTemp}°C`],
                  ['Known Moons', selected.moons.toString()],
                  ['Has Rings', selected.rings ? 'Yes' : 'No'],
                  ['Magnetic Field', selected.magneticField ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(180,200,255,0.6)' }}>{label}</span>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'Roboto Mono' }}>{value}</span>
                  </div>
                ))}

                <p style={{ fontSize: '0.83rem', color: 'rgba(200,215,255,0.75)', lineHeight: 1.6, marginTop: 16 }}>
                  {selected.description}
                </p>

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.5)', marginBottom: 8 }}>Key Facts</div>
                  {selected.funFacts.slice(0, 3).map((f, i) => (
                    <div key={i} style={{ fontSize: '0.82rem', color: 'rgba(200,215,255,0.75)', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 8 }}>
                      <span style={{ color: selected.color }}>◆</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount * 255);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount * 255);
  const b = Math.min(255, (num & 0xff) + amount * 255);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount * 255);
  const b = Math.max(0, (num & 0xff) - amount * 255);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}
