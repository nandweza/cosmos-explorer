import { X, Thermometer, Wind, Globe, Compass, Activity, Star, Rocket } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Planet, Mission } from '../types';

interface PlanetPanelProps {
  planet: Planet;
  missions: Mission[];
  onClose: () => void;
}

function StatRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color: 'rgba(180,200,255,0.6)', fontSize: '0.82rem' }}>{label}</span>
      <span style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '0.88rem', color: '#f0f4ff' }}>
        {value}{unit ? <span style={{ color: 'rgba(180,200,255,0.5)', fontSize: '0.78rem', marginLeft: 3 }}>{unit}</span> : null}
      </span>
    </div>
  );
}

const PIE_COLORS = ['#00d4ff', '#a78bfa', '#ffb800', '#00ff88', '#ff7722', '#ff4466'];

export default function PlanetPanel({ planet, missions, onClose }: PlanetPanelProps) {
  const planetMissions = missions.filter(m => planet.missions.includes(m.id));

  const formatMass = (mass: number) => {
    const exp = Math.floor(Math.log10(mass));
    const mantissa = (mass / Math.pow(10, exp)).toFixed(2);
    return `${mantissa} × 10^${exp}`;
  };

  const tempColor = (temp: number) => {
    if (temp > 200) return '#ff4466';
    if (temp > 50) return '#ff7722';
    if (temp > -50) return '#00ff88';
    return '#00d4ff';
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 380,
      height: '100%',
      background: 'rgba(2,2,15,0.95)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      overflowY: 'auto',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        background: `linear-gradient(135deg, rgba(${hexToRgb(planet.color)},0.15), transparent)`,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: planet.color, boxShadow: `0 0 12px ${planet.color}` }} />
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(180,200,255,0.6)' }}>
                {planet.type.replace('_', ' ')}
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, background: `linear-gradient(135deg, ${planet.color}, #a78bfa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {planet.name}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: '#f0f4ff',
            padding: 8,
            cursor: 'pointer',
          }}>
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'rgba(200,215,255,0.7)', lineHeight: 1.5, marginTop: 8 }}>
          {planet.description.slice(0, 140)}...
        </p>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Temperature */}
        <div style={{ margin: '20px 0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Thermometer size={15} color="#ff7722" />
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)' }}>Temperature</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Min', value: planet.minTemp },
              { label: 'Avg', value: planet.avgTemp },
              { label: 'Max', value: planet.maxTemp },
            ].map(({ label, value }) => (
              <div key={label} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
                border: `1px solid rgba(${hexToRgb(tempColor(value))},0.2)`,
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: tempColor(value), fontFamily: 'Roboto Mono, monospace' }}>
                  {value > 0 ? '+' : ''}{value}°
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(180,200,255,0.5)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '4px 12px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <StatRow label="Mass" value={formatMass(planet.mass)} unit="kg" />
          <StatRow label="Radius" value={planet.radius.toLocaleString()} unit="km" />
          <StatRow label="Distance from Sun" value={planet.distanceFromSun} unit="AU" />
          <StatRow label="Orbital Period" value={planet.orbitalPeriod.toLocaleString()} unit="days" />
          <StatRow label="Rotation Period" value={planet.rotationPeriod} unit="days" />
          <StatRow label="Surface Gravity" value={planet.surfaceGravity} unit="m/s²" />
          <StatRow label="Escape Velocity" value={planet.escapeVelocity} unit="km/s" />
          <StatRow label="Moons" value={planet.moons} />
          <StatRow label="Rings" value={planet.rings ? 'Yes' : 'No'} />
          <StatRow label="Axial Tilt" value={`${planet.obliquity}°`} />
          <StatRow label="Magnetic Field" value={planet.magneticField ? 'Yes' : 'No'} />
        </div>

        {/* Atmosphere */}
        {planet.atmosphere.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Wind size={15} color="#00d4ff" />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)' }}>Atmosphere</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {planet.atmosphere.map(a => (
                <span key={a} style={{
                  padding: '3px 10px',
                  background: 'rgba(0,212,255,0.1)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  color: '#00d4ff',
                }}>{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Composition */}
        {planet.composition.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Globe size={15} color="#a78bfa" />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)' }}>Composition</span>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planet.composition} dataKey="percentage" nameKey="element" cx="50%" cy="50%" outerRadius={55} strokeWidth={0}>
                    {planet.composition.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
                    formatter={(value: any, name: string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {planet.composition.map((c, i) => (
                <div key={c.element} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'rgba(180,200,255,0.7)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {c.element} {c.percentage}%
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Star size={15} color="#ffb800" />
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)' }}>Key Facts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {planet.funFacts.map((fact, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 10,
                padding: '8px 12px',
                background: 'rgba(255,184,0,0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255,184,0,0.12)',
              }}>
                <span style={{ color: '#ffb800', fontSize: '0.75rem', marginTop: 1 }}>◆</span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(210,220,255,0.85)', lineHeight: 1.5 }}>{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missions */}
        {planetMissions.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Rocket size={15} color="#00ff88" />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)' }}>
                Missions ({planetMissions.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {planetMissions.map(m => (
                <div key={m.id} style={{
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{m.name}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 7px',
                      borderRadius: 20,
                      background: m.status === 'active' ? 'rgba(0,255,136,0.12)' : 'rgba(0,212,255,0.12)',
                      color: m.status === 'active' ? '#00ff88' : '#00d4ff',
                      border: `1px solid ${m.status === 'active' ? 'rgba(0,255,136,0.25)' : 'rgba(0,212,255,0.25)'}`,
                    }}>{m.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(180,200,255,0.5)' }}>{m.agency} · {new Date(m.launchDate).getFullYear()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
