# Cosmos Explorer 🪐

Interactive visualization of planets, galaxies, and 60+ years of planetary exploration missions.

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start both server + client (dev)
npm run dev
```

- **Client**: http://localhost:5173
- **Server API**: http://localhost:3001/api

## NASA API Key (Optional but recommended)

The DEMO_KEY has limits: 30 requests/hour, 50/day. Get a free key:

1. Visit https://api.nasa.gov/
2. Sign up for a free API key
3. Edit `server/.env`: `NASA_API_KEY=your_key_here`

## Features

| Page | Feature |
|------|---------|
| **Solar System** | Interactive 3D scene — drag, zoom, click planets |
| **Planets** | All 9 bodies with full physical data, composition charts, mission history |
| **Missions** | 55 missions 1957–2024, timeline + grid view, filterable |
| **NEO Tracker** | Real-time near-Earth objects from NASA API via WebSocket |
| **Deep Space** | NASA APOD gallery, Mars rover photos (Curiosity/Perseverance/Opportunity) |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite, Three.js (React Three Fiber), Recharts, Framer Motion
- **Backend**: Node.js + Express + Socket.io (WebSocket)
- **Data**: NASA Open APIs (APOD, NEO, Mars Photos, DONKI), ISS location, JPL Exoplanet Archive

## API Endpoints

```
GET /api/health          — Server status
GET /api/planets         — All 9 planets with full data
GET /api/missions        — All 55+ missions (filterable)
GET /api/missions/stats  — Mission statistics
GET /api/nasa/apod       — Astronomy Picture of the Day
GET /api/nasa/neo        — Near-Earth Objects (7-day window)
GET /api/nasa/mars-photos— Mars rover photos
GET /api/nasa/iss        — ISS real-time position
GET /api/nasa/space-weather — Solar coronal mass ejections
GET /api/nasa/exoplanets — Confirmed exoplanet archive
```
