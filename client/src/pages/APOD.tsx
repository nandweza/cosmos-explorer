import { useState, useEffect } from 'react';
import { Camera, ExternalLink, Calendar, User, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { api } from '../services/api';
import type { APOD } from '../types';

export default function APODPage() {
  const [apods, setApods] = useState<APOD[]>([]);
  const [featured, setFeatured] = useState<APOD | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [marsPhotos, setMarsPhotos] = useState<any[]>([]);
  const [marsLoading, setMarsLoading] = useState(true);
  const [activeRover, setActiveRover] = useState('curiosity');
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.nasa.apod(12),
      api.nasa.marsPhotos('curiosity'),
    ]).then(([apodData, marsData]) => {
      const apodList = Array.isArray(apodData) ? apodData.reverse() : [apodData];
      setApods(apodList);
      setFeatured(apodList[0]);
      setMarsPhotos(marsData?.photos?.slice(0, 18) || []);
      setLoading(false);
      setMarsLoading(false);
    }).catch(() => {
      setLoading(false);
      setMarsLoading(false);
    });
  }, []);

  useEffect(() => {
    setMarsLoading(true);
    api.nasa.marsPhotos(activeRover)
      .then(data => {
        setMarsPhotos(data?.photos?.slice(0, 18) || []);
        setMarsLoading(false);
      })
      .catch(() => setMarsLoading(false));
  }, [activeRover]);

  const selectAPOD = (idx: number) => {
    setSelectedIdx(idx);
    setFeatured(apods[idx]);
  };

  return (
    <div className="page" style={{ background: 'linear-gradient(to bottom, #02020a, #050510)' }}>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img src={lightbox} alt="Fullscreen" style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: 8 }} />
        </div>
      )}

      <div className="container">
        <div className="section-header" style={{ paddingTop: 20 }}>
          <span className="section-eyebrow">NASA Open Data</span>
          <h1 style={{ background: 'linear-gradient(135deg, #f0f4ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Deep Space Gallery
          </h1>
          <p>Astronomy Picture of the Day, Mars surface imagery, and more from NASA's archives.</p>
        </div>

        {/* Featured APOD */}
        {loading ? (
          <div className="skeleton" style={{ height: 500, borderRadius: 20, marginBottom: 32 }} />
        ) : featured ? (
          <div className="card" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 32, border: '1px solid rgba(167,139,250,0.2)' }}>
            <div style={{ position: 'relative', aspectRatio: featured.media_type === 'image' ? '16/7' : '16/9' }}>
              {featured.media_type === 'image' ? (
                <img
                  src={featured.url}
                  alt={featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                  onClick={() => setLightbox(featured.hdurl || featured.url)}
                />
              ) : (
                <iframe
                  src={featured.url}
                  title={featured.title}
                  style={{ width: '100%', height: '400px', border: 'none' }}
                  allowFullScreen
                />
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(2,2,15,0.95) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(167,139,250,0.2)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 20 }}>
                    <Camera size={11} style={{ display: 'inline', marginRight: 4 }} />Astronomy Picture of the Day
                  </span>
                  {featured.media_type === 'video' && (
                    <span style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(255,184,0,0.15)', color: '#ffb800', border: '1px solid rgba(255,184,0,0.25)', borderRadius: 20 }}>
                      <Play size={11} style={{ display: 'inline', marginRight: 4 }} />Video
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 8 }}>{featured.title}</h2>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'rgba(180,200,255,0.6)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} />{featured.date}</span>
                  {featured.copyright && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><User size={12} />© {featured.copyright}</span>}
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(200,215,255,0.8)', maxWidth: 800 }}>
                {featured.explanation}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 140 }}>
                {featured.hdurl && (
                  <a href={featured.hdurl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <ExternalLink size={14} /> HD Image
                  </a>
                )}
                <button onClick={() => setLightbox(featured.hdurl || featured.url)} className="btn">
                  🔍 Full Screen
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 40, textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌠</div>
            <p style={{ color: 'rgba(180,200,255,0.6)' }}>Unable to load APOD data. NASA API may be rate-limited.</p>
            <p style={{ color: 'rgba(180,200,255,0.4)', fontSize: '0.85rem', marginTop: 8 }}>
              Try adding a NASA API key to the server environment (NASA_API_KEY)
            </p>
          </div>
        )}

        {/* APOD Gallery */}
        {apods.length > 1 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Recent Gallery</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => selectAPOD(Math.max(0, selectedIdx - 1))} disabled={selectedIdx === 0} style={{ padding: '7px 12px' }}>
                  <ChevronLeft size={16} />
                </button>
                <button className="btn" onClick={() => selectAPOD(Math.min(apods.length - 1, selectedIdx + 1))} disabled={selectedIdx === apods.length - 1} style={{ padding: '7px 12px' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {apods.map((apod, i) => (
                <div
                  key={apod.date}
                  onClick={() => selectAPOD(i)}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: i === selectedIdx ? '2px solid #a78bfa' : '2px solid transparent',
                    transition: 'all 0.2s',
                    position: 'relative',
                    aspectRatio: '1',
                    background: '#0a0a1a',
                  }}
                >
                  {apod.media_type === 'image' ? (
                    <img
                      src={apod.url}
                      alt={apod.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: i === selectedIdx ? 'none' : 'brightness(0.7)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                      <Play size={24} color="#ffb800" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(180,200,255,0.7)' }}>{apod.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mars Rover Photos */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>Mars Surface Imagery</h2>
              <p style={{ color: 'rgba(180,200,255,0.6)', fontSize: '0.85rem' }}>Live photos from Mars rovers via NASA API</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'curiosity', label: 'Curiosity', color: '#00d4ff' },
                { id: 'perseverance', label: 'Perseverance', color: '#00ff88' },
                { id: 'opportunity', label: 'Opportunity', color: '#ffb800' },
              ].map(r => (
                <button
                  key={r.id}
                  className="btn"
                  onClick={() => setActiveRover(r.id)}
                  style={{ borderColor: activeRover === r.id ? r.color : undefined, color: activeRover === r.id ? r.color : undefined }}
                >
                  🚗 {r.label}
                </button>
              ))}
            </div>
          </div>

          {marsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 12 }} />)}
            </div>
          ) : marsPhotos.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔴</div>
              <p style={{ color: 'rgba(180,200,255,0.6)' }}>No Mars photos available for this rover. API may be rate-limited.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {marsPhotos.map((photo: any) => (
                <div
                  key={photo.id}
                  style={{ borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in', position: 'relative', background: '#0a0a1a' }}
                  onClick={() => setLightbox(photo.img_src)}
                >
                  <img
                    src={photo.img_src}
                    alt={`Mars ${photo.camera?.full_name}`}
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(180,200,255,0.7)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photo.camera?.full_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(180,200,255,0.4)', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sol {photo.sol}</span>
                      <span>{photo.earth_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Space facts footer */}
        <div style={{ marginTop: 60, padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 32, background: 'linear-gradient(135deg, #00d4ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Did You Know?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { icon: '🌌', fact: 'The observable universe contains an estimated 2 trillion galaxies' },
              { icon: '⭐', fact: 'There are more stars in the universe than grains of sand on all Earth\'s beaches' },
              { icon: '🕳️', fact: 'The supermassive black hole at the center of our galaxy is 4 million times the mass of our Sun' },
              { icon: '💫', fact: 'Light from the most distant galaxies takes 13.8 billion years to reach us' },
              { icon: '🪐', fact: 'Saturn\'s rings are incredibly thin - just 20 meters deep despite spanning 282,000 km' },
              { icon: '🔭', fact: 'James Webb Space Telescope can detect a bumblebee in Earth\'s orbit from the Moon' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '0.88rem', color: 'rgba(200,215,255,0.8)', lineHeight: 1.6 }}>{item.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
