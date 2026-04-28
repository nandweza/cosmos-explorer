import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Rocket, Clock, CheckCircle, AlertCircle, Zap, Star, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../services/api';
import type { Mission } from '../types';

const TYPE_ICONS: Record<string, string> = {
  orbiter: '🛸', lander: '🛬', rover: '🚗', flyby: '🌠', telescope: '🔭',
  crewed: '👨‍🚀', probe: '📡', sample_return: '💎', impactor: '💥',
};

const AGENCY_COLORS: Record<string, string> = {
  'NASA': '#00d4ff',
  'ESA': '#ffd700',
  'Soviet Union': '#ff4466',
  'CNSA': '#ff7722',
  'ISRO': '#00ff88',
  'JAXA': '#a78bfa',
  'UAE Space Agency': '#66aaff',
  'NASA/ESA': '#00d4ff',
  'NASA/ESA/ASI': '#00d4ff',
  'NASA/ESA/CSA': '#00d4ff',
  'ESA/JAXA': '#ffd700',
};

const STATUS_CONFIG = {
  active: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', icon: <Zap size={12} /> },
  completed: { color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', icon: <CheckCircle size={12} /> },
  failed: { color: '#ff4466', bg: 'rgba(255,68,102,0.08)', icon: <AlertCircle size={12} /> },
  upcoming: { color: '#ffb800', bg: 'rgba(255,184,0,0.08)', icon: <Clock size={12} /> },
  extended: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', icon: <Star size={12} /> },
};

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAgency, setFilterAgency] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.missions.getAll(), api.missions.getStats()]).then(([m, s]) => {
      setMissions(m.data || []);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const agencies = useMemo(() => {
    const set = new Set(missions.map(m => m.agency));
    return ['all', ...Array.from(set)];
  }, [missions]);

  const filtered = useMemo(() => {
    return missions.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.target.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterAgency !== 'all' && m.agency !== filterAgency) return false;
      if (filterType !== 'all' && m.type !== filterType) return false;
      if (filterTarget !== 'all' && m.targetType !== filterTarget) return false;
      return true;
    });
  }, [missions, search, filterStatus, filterAgency, filterType, filterTarget]);

  // Group by decade for timeline
  const byDecade = useMemo(() => {
    const groups: Record<string, Mission[]> = {};
    filtered.forEach(m => {
      const year = new Date(m.launchDate).getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;
      groups[decade] = [...(groups[decade] || []), m];
    });
    return Object.entries(groups).sort(([a], [b]) => parseInt(a) - parseInt(b));
  }, [filtered]);

  // Chart data - missions per year
  const chartData = useMemo(() => {
    const byYear: Record<string, number> = {};
    missions.forEach(m => {
      const year = new Date(m.launchDate).getFullYear().toString();
      byYear[year] = (byYear[year] || 0) + 1;
    });
    return Object.entries(byYear).map(([year, count]) => ({ year, count })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [missions]);

  return (
    <div className="page" style={{ background: 'linear-gradient(to bottom, #02020a, #050510)' }}>
      <div className="container">
        <div className="section-header" style={{ paddingTop: 20 }}>
          <span className="section-eyebrow">Space Exploration Archive</span>
          <h1 style={{ background: 'linear-gradient(135deg, #f0f4ff, #ffb800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Mission Database
          </h1>
          <p>60+ years of planetary exploration — from Sputnik to James Webb.</p>
        </div>

        {/* Stats overview */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Total Missions', value: stats.total, icon: '🚀' },
              { label: 'Active', value: stats.byStatus?.active || 0, icon: '📡' },
              { label: 'Completed', value: stats.byStatus?.completed || 0, icon: '✅' },
              { label: 'Agencies', value: Object.keys(stats.byAgency || {}).length, icon: '🌍' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Roboto Mono', color: '#00d4ff' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(180,200,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Launch frequency chart */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 32 }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,200,255,0.6)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Rocket size={14} /> Mission launches by year
          </h3>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={8}>
                <XAxis dataKey="year" tick={{ fill: 'rgba(180,200,255,0.4)', fontSize: 10 }} interval={4} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
                  labelStyle={{ color: '#f0f4ff' }}
                  cursor={{ fill: 'rgba(0,212,255,0.05)' }}
                />
                <Bar dataKey="count">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={`rgba(0, 212, 255, ${0.3 + (i / chartData.length) * 0.5})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,200,255,0.4)' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search missions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select className="select" value={filterAgency} onChange={e => setFilterAgency(e.target.value)}>
            {agencies.map(a => <option key={a} value={a}>{a === 'all' ? 'All Agencies' : a}</option>)}
          </select>
          <select className="select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            {['orbiter','lander','rover','flyby','telescope','crewed','probe','sample_return','impactor'].map(t => (
              <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace('_', ' ')}</option>
            ))}
          </select>
          <select className="select" value={filterTarget} onChange={e => setFilterTarget(e.target.value)}>
            <option value="all">All Targets</option>
            {['planet','moon','asteroid','comet','star','deep_space'].map(t => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            {(['timeline', 'grid'] as const).map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                background: viewMode === v ? 'rgba(0,212,255,0.15)' : 'transparent',
                border: 'none',
                color: viewMode === v ? '#00d4ff' : 'rgba(180,200,255,0.5)',
                padding: '9px 16px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
              }}>
                {v === 'timeline' ? '📅 Timeline' : '⊞ Grid'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12, color: 'rgba(180,200,255,0.5)', fontSize: '0.85rem' }}>
          Showing {filtered.length} of {missions.length} missions
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}
          </div>
        ) : viewMode === 'timeline' ? (
          // Timeline view
          <div>
            {byDecade.map(([decade, dMissions]) => (
              <div key={decade} style={{ marginBottom: 40 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 20,
                }}>
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    fontFamily: 'Roboto Mono',
                    background: 'linear-gradient(135deg, #ffb800, #ff7722)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{decade}</div>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,184,0,0.3), transparent)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'rgba(180,200,255,0.4)' }}>{dMissions.length} missions</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16, borderLeft: '2px solid rgba(255,184,0,0.15)' }}>
                  {dMissions.map(m => {
                    const sc = STATUS_CONFIG[m.status] || STATUS_CONFIG.completed;
                    const isOpen = expanded === m.id;
                    return (
                      <div
                        key={m.id}
                        className="card"
                        style={{ padding: '14px 18px', cursor: 'pointer', position: 'relative', marginLeft: -1 }}
                        onClick={() => setExpanded(isOpen ? null : m.id)}
                      >
                        <div style={{ position: 'absolute', left: -9, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, borderRadius: '50%', background: sc.color, border: '3px solid #02020a', boxShadow: `0 0 8px ${sc.color}` }} />

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <span style={{ fontSize: 20, flexShrink: 0 }}>{TYPE_ICONS[m.type] || '🚀'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                              <div>
                                <span style={{ fontWeight: 600, marginRight: 10 }}>{m.name}</span>
                                <span style={{ fontSize: '0.78rem', color: AGENCY_COLORS[m.agency] || 'rgba(180,200,255,0.5)' }}>{m.agency}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.78rem', color: 'rgba(180,200,255,0.5)', fontFamily: 'Roboto Mono' }}>
                                  {new Date(m.launchDate).getFullYear()}
                                </span>
                                <span style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20,
                                  background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40`,
                                }}>
                                  {sc.icon} {m.status}
                                </span>
                                <span style={{
                                  fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20,
                                  background: 'rgba(255,255,255,0.06)', color: 'rgba(180,200,255,0.6)',
                                }}>
                                  {m.target}
                                </span>
                              </div>
                            </div>
                            {!isOpen && (
                              <p style={{ fontSize: '0.8rem', color: 'rgba(180,200,255,0.6)', marginTop: 4 }}>
                                {m.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {isOpen && (
                          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(200,215,255,0.8)', marginBottom: 12, lineHeight: 1.6 }}>{m.description}</p>

                            {m.achievements.length > 0 && (
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00d4ff', marginBottom: 8 }}>Achievements</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {m.achievements.map((a, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: 'rgba(200,215,255,0.75)' }}>
                                      <span style={{ color: '#00d4ff', flexShrink: 0 }}>▸</span> {a}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {m.notableDiscoveries && m.notableDiscoveries.length > 0 && (
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ffb800', marginBottom: 8 }}>Discoveries</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {m.notableDiscoveries.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: 'rgba(200,215,255,0.75)' }}>
                                      <span style={{ color: '#ffb800', flexShrink: 0 }}>◆</span> {d}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {m.cost && (
                              <div style={{ display: 'inline-flex', gap: 8, padding: '4px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: '0.8rem' }}>
                                <span style={{ color: 'rgba(180,200,255,0.5)' }}>Mission cost:</span>
                                <span style={{ fontFamily: 'Roboto Mono', color: '#00ff88' }}>{m.cost}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid view
          <div className="grid-2">
            {filtered.map(m => {
              const sc = STATUS_CONFIG[m.status] || STATUS_CONFIG.completed;
              return (
                <div key={m.id} className="card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 24 }}>{TYPE_ICONS[m.type] || '🚀'}</span>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: AGENCY_COLORS[m.agency] || 'rgba(180,200,255,0.5)' }}>{m.agency}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', padding: '3px 9px', borderRadius: 20, background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40`, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {sc.icon} {m.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(180,200,255,0.65)', marginBottom: 12 }}>{m.description}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, color: 'rgba(180,200,255,0.5)' }}>
                      <Target size={10} style={{ display: 'inline', marginRight: 4 }} />{m.target}
                    </span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, color: 'rgba(180,200,255,0.5)', fontFamily: 'Roboto Mono' }}>
                      {new Date(m.launchDate).getFullYear()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
