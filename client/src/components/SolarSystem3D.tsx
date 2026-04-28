import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';
import type { Planet } from '../types';

interface PlanetMeshProps {
  planet: Planet;
  timeRef: React.MutableRefObject<number>;
  onSelect: (planet: Planet) => void;
  isSelected: boolean;
  showLabels: boolean;
}

function createPlanetTexture(planet: Planet): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (planet.id === 'sun') {
    const grad = ctx.createRadialGradient(256, 128, 0, 256, 128, 256);
    grad.addColorStop(0, '#fff8cc');
    grad.addColorStop(0.3, '#ffdd44');
    grad.addColorStop(0.7, '#ff9900');
    grad.addColorStop(1, '#ff5500');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    // Solar granules
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512, y = Math.random() * 256;
      const r = Math.random() * 15 + 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${100 + Math.random() * 100 | 0},0,${0.15 + Math.random() * 0.2})`;
      ctx.fill();
    }
  } else if (planet.id === 'jupiter') {
    const bands = [
      { pct: 0, color: '#C88B3A' }, { pct: 0.07, color: '#E8C87A' }, { pct: 0.13, color: '#B8722A' },
      { pct: 0.2, color: '#D4A060' }, { pct: 0.27, color: '#8B5A1A' }, { pct: 0.33, color: '#C89050' },
      { pct: 0.4, color: '#E8D090' }, { pct: 0.47, color: '#B06030' }, { pct: 0.53, color: '#D08040' },
      { pct: 0.6, color: '#E8C070' }, { pct: 0.67, color: '#C07030' }, { pct: 0.73, color: '#D0A050' },
      { pct: 0.8, color: '#886020' }, { pct: 0.87, color: '#C08040' }, { pct: 0.93, color: '#E0B060' }, { pct: 1, color: '#C88B3A' }
    ];
    for (let i = 0; i < bands.length - 1; i++) {
      const grad = ctx.createLinearGradient(0, bands[i].pct * 256, 0, bands[i + 1].pct * 256);
      grad.addColorStop(0, bands[i].color);
      grad.addColorStop(1, bands[i + 1].color);
      ctx.fillStyle = grad;
      ctx.fillRect(0, bands[i].pct * 256, 512, (bands[i + 1].pct - bands[i].pct) * 256);
    }
    // Great Red Spot
    ctx.save();
    ctx.translate(180, 145);
    ctx.scale(2.5, 1);
    const spotGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
    spotGrad.addColorStop(0, 'rgba(180,60,30,0.9)');
    spotGrad.addColorStop(0.5, 'rgba(200,80,40,0.7)');
    spotGrad.addColorStop(1, 'rgba(180,80,30,0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (planet.id === 'saturn') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#E4D191');
    grad.addColorStop(0.3, '#D4C070');
    grad.addColorStop(0.5, '#E8D8A0');
    grad.addColorStop(0.7, '#C8B860');
    grad.addColorStop(1, '#D8C870');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    // Subtle bands
    for (let i = 0; i < 8; i++) {
      const y = (i / 8) * 256;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(180,160,40,0.2)' : 'rgba(255,240,160,0.15)';
      ctx.fillRect(0, y, 512, 30);
    }
  } else if (planet.id === 'earth') {
    // Ocean
    ctx.fillStyle = '#1a4fa0';
    ctx.fillRect(0, 0, 512, 256);
    // Continents
    ctx.fillStyle = '#4a8c3f';
    const continents = [
      [30, 60, 100, 80], [160, 40, 80, 100], [260, 80, 70, 60], [350, 50, 90, 80],
      [50, 140, 60, 60], [200, 150, 50, 50], [300, 160, 80, 60]
    ];
    continents.forEach(([x, y, w, h]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2, h / 2, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    });
    // Ice caps
    ctx.fillStyle = 'rgba(220,240,255,0.8)';
    ctx.fillRect(0, 0, 512, 20);
    ctx.fillRect(0, 236, 512, 20);
    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 256, 40 + Math.random() * 60, 10 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planet.id === 'mars') {
    ctx.fillStyle = '#C1440E';
    ctx.fillRect(0, 0, 512, 256);
    // Terrain variation
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512, y = Math.random() * 256;
      const r = Math.random() * 20 + 3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(150,40,0,0.4)' : 'rgba(200,80,20,0.3)';
      ctx.fill();
    }
    // Valles Marineris hint
    ctx.strokeStyle = 'rgba(80,20,0,0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 130);
    ctx.bezierCurveTo(200, 125, 320, 135, 420, 128);
    ctx.stroke();
    // Ice caps
    ctx.fillStyle = 'rgba(220,220,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(256, 10, 100, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(256, 246, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (planet.id === 'mercury') {
    ctx.fillStyle = '#B5B5B5';
    ctx.fillRect(0, 0, 512, 256);
    // Craters
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 512, y = Math.random() * 256;
      const r = Math.random() * 18 + 3;
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      grad.addColorStop(0, 'rgba(80,80,80,0.6)');
      grad.addColorStop(0.8, 'rgba(160,160,160,0.1)');
      grad.addColorStop(1, 'rgba(200,200,200,0.4)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planet.id === 'venus') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#E8CDA2');
    grad.addColorStop(0.5, '#D4A870');
    grad.addColorStop(1, '#C09050');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    // Thick clouds
    ctx.fillStyle = 'rgba(230,200,140,0.6)';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 256, 80 + Math.random() * 100, 20 + Math.random() * 30, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planet.id === 'uranus') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#A0C8E8');
    grad.addColorStop(0.5, '#7EABDE');
    grad.addColorStop(1, '#5A8FCC');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    // Subtle banding
    ctx.fillStyle = 'rgba(150,200,240,0.3)';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(0, (i / 6) * 256, 512, 20);
    }
  } else if (planet.id === 'neptune') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#3E54E8');
    grad.addColorStop(0.5, '#2A40CC');
    grad.addColorStop(1, '#1A2AA0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    // Great Dark Spot hint
    ctx.fillStyle = 'rgba(20,30,100,0.5)';
    ctx.beginPath();
    ctx.ellipse(160, 100, 50, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Atmospheric bands
    ctx.strokeStyle = 'rgba(100,140,255,0.3)';
    ctx.lineWidth = 8;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i / 5) * 256 + 25);
      ctx.bezierCurveTo(170, (i / 5) * 256 + 20, 340, (i / 5) * 256 + 30, 512, (i / 5) * 256 + 25);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = planet.color;
    ctx.fillRect(0, 0, 512, 256);
  }

  return new THREE.CanvasTexture(canvas);
}

function SunGlow() {
  return (
    <>
      {[3.8, 5.5, 8].map((r, i) => (
        <mesh key={i}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshBasicMaterial
            color="#ff8800"
            transparent
            opacity={[0.06, 0.04, 0.02][i]}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function OrbitRing({ radius, color = '#ffffff' }: { radius: number; color?: string }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.12} />
    </lineLoop>
  );
}

function SaturnRings({ size }: { size: number }) {
  return (
    <>
      {[1.4, 1.65, 1.9, 2.1].map((mult, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * mult, size * (mult + [0.18, 0.12, 0.08, 0.06][i]), 64]} />
          <meshBasicMaterial
            color={['#D4C878', '#E8DA90', '#C8B860', '#D0C270'][i]}
            transparent
            opacity={[0.7, 0.5, 0.6, 0.45][i]}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

function PlanetMesh({ planet, timeRef, onSelect, isSelected, showLabels }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const texture = useMemo(() => createPlanetTexture(planet), [planet.id]);

  useFrame(() => {
    if (!groupRef.current || planet.id === 'sun') return;
    const t = timeRef.current;
    const speed = (2 * Math.PI) / (planet.orbitalPeriod * 0.8);
    const x = Math.cos(t * speed) * planet.orbitalRadius3D;
    const z = Math.sin(t * speed) * planet.orbitalRadius3D;
    groupRef.current.position.set(x, 0, z);

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003 / Math.max(planet.rotationPeriod, 0.4);
    }
  });

  useFrame(() => {
    if (meshRef.current && planet.id === 'sun') {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(planet); }}
        rotation={[THREE.MathUtils.degToRad(planet.id === 'uranus' ? 97 : 0), 0, 0]}
      >
        <sphereGeometry args={[planet.size3D, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          roughness={planet.id === 'sun' ? 0 : 0.7}
          metalness={0.1}
          emissive={planet.id === 'sun' ? new THREE.Color('#ff6600') : new THREE.Color(planet.glowColor)}
          emissiveIntensity={planet.id === 'sun' ? 1.5 : (isSelected ? 0.4 : 0.15)}
        />
      </mesh>

      {/* Atmosphere */}
      {planet.id !== 'sun' && planet.atmosphere.length > 0 && (
        <mesh>
          <sphereGeometry args={[planet.size3D * 1.06, 24, 24]} />
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={planet.id === 'venus' ? 0.18 : 0.07}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Saturn's rings */}
      {planet.id === 'saturn' && <SaturnRings size={planet.size3D} />}

      {/* Selection ring */}
      {isSelected && planet.id !== 'sun' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.size3D * 1.6, planet.size3D * 1.7, 64]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Label */}
      {showLabels && (
        <Html
          position={[0, planet.size3D + 0.5, 0]}
          center
          distanceFactor={20}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(2,2,10,0.8)',
            border: `1px solid ${isSelected ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: isSelected ? '#00d4ff' : '#f0f4ff',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
          }}>
            {planet.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({
  planets,
  onSelect,
  selectedPlanet,
  showLabels,
}: {
  planets: Planet[];
  onSelect: (p: Planet) => void;
  selectedPlanet: Planet | null;
  showLabels: boolean;
}) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta * 8;
  });

  return (
    <>
      <Stars radius={200} depth={80} count={6000} factor={4} saturation={0.3} fade speed={0.5} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={8} distance={150} decay={1.5} color="#fff5cc" />

      {/* Orbit rings */}
      {planets.filter(p => p.id !== 'sun').map(p => (
        <OrbitRing key={`orbit-${p.id}`} radius={p.orbitalRadius3D} />
      ))}

      {/* Sun glow */}
      <SunGlow />

      {/* Planets */}
      {planets.map(planet => (
        <PlanetMesh
          key={planet.id}
          planet={planet}
          timeRef={timeRef}
          onSelect={onSelect}
          isSelected={selectedPlanet?.id === planet.id}
          showLabels={showLabels}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={120}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        makeDefault
      />
    </>
  );
}

interface SolarSystem3DProps {
  planets: Planet[];
  onPlanetSelect: (planet: Planet | null) => void;
  selectedPlanet: Planet | null;
  showLabels?: boolean;
}

export default function SolarSystem3D({ planets, onPlanetSelect, selectedPlanet, showLabels = true }: SolarSystem3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 35, 60], fov: 55, near: 0.1, far: 500 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onPlanetSelect(null)}
    >
      <Scene
        planets={planets}
        onSelect={onPlanetSelect}
        selectedPlanet={selectedPlanet}
        showLabels={showLabels}
      />
    </Canvas>
  );
}
