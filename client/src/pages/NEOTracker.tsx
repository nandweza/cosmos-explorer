import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Zap, Activity, Globe, Clock } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { api } from '../services/api';
import { useAppContext } from '../App';
import type { NEO } from '../types';

function formatDistance(km: string) {
  const n = parseFloat(km);
  if (n > 1e9) return `${(n / 1e9).toFixed(2)}B km`;
  if (n > 1e6) return `${(n / 1e6).toFixed(2)}M km`;
  return `${(n / 1000).toFixed(0)}K km`;
}

function getHazardLevel(neo: NEO): 'danger' | 'warning' | 'safe' {
  const dist = parseFloat(neo.close_approach_data[0]?.miss_distance?.lunar || '999');
  if (neo.is_potentially_hazardous_asteroid && dist < 10) return 'danger';
  if (neo.is_potentially_hazardous_asteroid) return 'warning';
  return 'safe';
}

const HAZARD_COLORS = {
  danger: '#ff4466',
  warning: '#ffb800',
  safe: '#00ff88',
};

export default function NEOTracker() {
  const [neoData, setNeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNeo, setSelectedNeo] = useState<NEO | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'velocity' | 'size'>('distance');
  const { liveData, wsConnected } = useAppContext();

  useEffect(() => {
    api.nasa.neo().then(data => {
      setNeoData(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const allNeos: NEO[] = neoData
    ? Object.values(neoData.near_earth_objects || {}).flat() as NEO[]
    : [];

  const sorted = [...allNeos].sort((a, b) => {
    if (sortBy === 'distance') {
      return parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers || '0') -
        parseFloat(b.close_approach_data[0]?.miss_distance?.kilometers || '0');
    }
    if (sortBy === 'velocity') {
      return parseFloat(b.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || '0') -
        parseFloat(a.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || '0');
    }
    return (b.estimated_diameter.kilometers.estimated_diameter_max) -
      (a.estimated_diameter.kilometers.estimated_diameter_max);
  });

  const hazardous = allNeos.filter(n => n.is_potentially_hazardous_asteroid);
  const closest = sorted.slice(0, 1)[0];

  // Scatter data: distance vs size
  const scatterData = allNeos.map(neo => ({
    x: parseFloat(neo.close_approach_data[0]?.miss_distance?.lunar || '0'),
    y: neo.estimated_diameter.kilometers.estimated_diameter_max * 1000,
    hazardous: neo.is_potentially_hazardous_asteroid,
    name: neo.name,
  }));

  // Daily NEO count
  const dailyCount = neoData
    ? Object.entries(neoData.near_earth_objects || {}).map(([date, neos]) => ({
        date: date.slice(5),
        count: (neos as any[]).length,
        hazardous: (neos as any[]).filter((n: any) => n.is_potentially_hazardous_asteroid).length,
      }))
    : [];

  return (
    <div className="page" style={{ background: 'linear-gradient(to bottom, #02020a, #0a0505)' }}>
      <div className="container">
        <div className="section-header" style={{ paddingTop: 20 }}>
          <span className="section-eyebrow">Planetary Defense</span>
          <h1 style={{ background: 'linear-gradient(135deg, #f0f4ff, #ff4466)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Near-Earth Object Tracker
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem',
              color: wsConnected ? '#00ff88' : '#ff4466',
              background: wsConnected ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,102,0.1)',
              border: `1px solid ${wsConnected ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,102,0.3)'}`,
              borderRadius: 20, padding: '4px 12px',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: wsConnected ? '#00ff88' : '#ff4466', animation: wsConnected ? 'pulse 2s infinite' : 'none' }} />
              {wsConnected ? 'Live data via WebSocket' : 'Polling NASA API'}
            </div>
            {neoData && <span style={{ fontSize: '0.82rem', color: 'rgba(180,200,255,0.5)' }}>7-day window · Updated {new Date().toLocaleDateString()}</span>}
          </div>
        </div>

        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            {
              icon: <Activity size={20} color="#00d4ff" />,
              label: 'Total NEOs',
              value: loading ? '---' : (liveData.neo?.totalCount || allNeos.length).toString(),
              sub: 'this week',
              color: '#00d4ff',
            },
            {
              icon: <AlertTriangle size={20} color="#ff4466" />,
              label: 'Potentially Hazardous',
              value: loading ? '---' : hazardous.length.toString(),
              sub: 'flagged objects',
              color: '#ff4466',
            },
            {
              icon: <Globe size={20} color="#ffb800" />,
              label: 'Closest Approach',
              value: loading || !closest ? '---' : formatDistance(closest.close_approach_data[0]?.miss_distance?.kilometers || '0'),
              sub: closest?.name?.slice(0, 20) || '',
              color: '#ffb800',
            },
            {
              icon: <Zap size={20} color="#a78bfa" />,
              label: 'Max Velocity',
              value: loading ? '---' : (() => {
                const max = Math.max(...allNeos.map(n => parseFloat(n.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || '0')));
                return `${(max / 1000).toFixed(0)}k km/h`;
              })(),
              sub: 'fastest approach',
              color: '#a78bfa',
            },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '18px 20px', borderColor: `${s.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ padding: 8, borderRadius: 10, background: `${s.color}15` }}>{s.icon}</div>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Roboto Mono', color: s.color }}>{s.value}</span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(220,230,255,0.8)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(180,200,255,0.45)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {!loading && allNeos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            {/* Scatter plot */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)', marginBottom: 16 }}>
                Distance vs Size (lunar distances / meters)
              </h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <XAxis dataKey="x" name="Distance (LD)" tick={{ fill: 'rgba(180,200,255,0.4)', fontSize: 10 }} label={{ value: 'Lunar Distances', fill: 'rgba(180,200,255,0.4)', fontSize: 10, position: 'insideBottom', offset: -2 }} />
                    <YAxis dataKey="y" name="Diameter (m)" tick={{ fill: 'rgba(180,200,255,0.4)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
                      cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }}
                      formatter={(value: any, name: string) => [typeof value === 'number' ? value.toFixed(2) : value, name]}
                    />
                    <Scatter data={scatterData}>
                      {scatterData.map((d, i) => (
                        <Cell key={i} fill={d.hazardous ? '#ff4466' : '#00d4ff'} fillOpacity={0.7} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff' }} /> Safe</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4466' }} /> Potentially Hazardous</div>
              </div>
            </div>

            {/* Daily count */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)', marginBottom: 16 }}>
                Daily NEO count
              </h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyCount}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(180,200,255,0.4)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'rgba(180,200,255,0.4)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.8rem' }} />
                    <Area type="monotone" dataKey="count" stroke="#00d4ff" fill="rgba(0,212,255,0.1)" strokeWidth={2} name="Total" />
                    <Area type="monotone" dataKey="hazardous" stroke="#ff4466" fill="rgba(255,68,102,0.1)" strokeWidth={2} name="Hazardous" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* NEO Table */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)' }}>
              Approaching Objects
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['distance', 'velocity', 'size'] as const).map(s => (
                <button key={s} className="btn" onClick={() => setSortBy(s)}
                  style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: sortBy === s ? '#00d4ff' : undefined, color: sortBy === s ? '#00d4ff' : undefined }}>
                  Sort by {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 60 }} />)}
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(180,200,255,0.5)' }}>
              No NEO data available. Check API connection.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Object', 'Approach Date', 'Miss Distance', 'Velocity', 'Diameter', 'Risk'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.5)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.slice(0, 30).map(neo => {
                    const ca = neo.close_approach_data[0];
                    const level = getHazardLevel(neo);
                    const color = HAZARD_COLORS[level];
                    return (
                      <tr
                        key={neo.id}
                        onClick={() => setSelectedNeo(selectedNeo?.id === neo.id ? null : neo)}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          background: selectedNeo?.id === neo.id ? `${color}0a` : undefined,
                          transition: 'background 0.2s',
                        }}
                      >
                        <td style={{ padding: '10px 12px', fontSize: '0.85rem', fontWeight: 500, color: color }}>
                          {neo.name.replace('(', '').replace(')', '')}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.82rem', color: 'rgba(180,200,255,0.7)', fontFamily: 'Roboto Mono' }}>
                          {ca?.close_approach_date || 'N/A'}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.82rem', fontFamily: 'Roboto Mono', color: '#f0f4ff' }}>
                          {ca ? formatDistance(ca.miss_distance.kilometers) : 'N/A'}
                          <div style={{ fontSize: '0.7rem', color: 'rgba(180,200,255,0.45)' }}>
                            {ca ? `${parseFloat(ca.miss_distance.lunar).toFixed(1)} LD` : ''}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.82rem', fontFamily: 'Roboto Mono', color: '#f0f4ff' }}>
                          {ca ? `${(parseFloat(ca.relative_velocity.kilometers_per_hour) / 1000).toFixed(1)}k km/h` : 'N/A'}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.82rem', fontFamily: 'Roboto Mono', color: '#f0f4ff' }}>
                          {(neo.estimated_diameter.kilometers.estimated_diameter_max * 1000).toFixed(0)} m
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                            <span style={{ fontSize: '0.75rem', color, textTransform: 'capitalize' }}>{level}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected NEO detail */}
        {selectedNeo && (
          <div className="card" style={{ padding: 24, marginTop: 16, borderColor: HAZARD_COLORS[getHazardLevel(selectedNeo)] + '40' }}>
            <h3 style={{ marginBottom: 16, color: HAZARD_COLORS[getHazardLevel(selectedNeo)] }}>{selectedNeo.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                ['Absolute Magnitude', `${selectedNeo.absolute_magnitude_h} H`],
                ['Min Diameter', `${(selectedNeo.estimated_diameter.kilometers.estimated_diameter_min * 1000).toFixed(0)} m`],
                ['Max Diameter', `${(selectedNeo.estimated_diameter.kilometers.estimated_diameter_max * 1000).toFixed(0)} m`],
                ['Close Approach', selectedNeo.close_approach_data[0]?.close_approach_date_full || 'N/A'],
                ['Miss Distance (km)', parseFloat(selectedNeo.close_approach_data[0]?.miss_distance?.kilometers || '0').toLocaleString()],
                ['Miss Distance (lunar)', `${parseFloat(selectedNeo.close_approach_data[0]?.miss_distance?.lunar || '0').toFixed(2)} LD`],
                ['Relative Velocity', `${(parseFloat(selectedNeo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || '0') / 1000).toFixed(2)}k km/h`],
                ['Potentially Hazardous', selectedNeo.is_potentially_hazardous_asteroid ? '⚠️ YES' : '✅ NO'],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(180,200,255,0.5)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'Roboto Mono', fontSize: '0.9rem' }}>{value}</div>
                </div>
              ))}
            </div>
            <a href={selectedNeo.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: 16, display: 'inline-flex' }}>
              View JPL Data →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
