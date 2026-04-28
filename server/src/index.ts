import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import nasaRoutes from './routes/nasa';
import missionRoutes from './routes/missions';
import planetRoutes from './routes/planets';
import { getNEO, getISSLocation, getSpaceWeather } from './services/nasaApi';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

app.use('/api/nasa', nasaRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/planets', planetRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    name: 'Cosmos Explorer API'
  });
});

// WebSocket - real-time data
io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  // Send initial NEO data
  const sendNEOUpdate = async () => {
    try {
      const data = await getNEO();
      const neos = Object.values(data.near_earth_objects || {}).flat() as any[];
      const closest = neos
        .sort((a: any, b: any) => {
          const distA = parseFloat(a.close_approach_data?.[0]?.miss_distance?.kilometers || '999999999');
          const distB = parseFloat(b.close_approach_data?.[0]?.miss_distance?.kilometers || '999999999');
          return distA - distB;
        })
        .slice(0, 10);
      socket.emit('neo_update', {
        timestamp: new Date().toISOString(),
        totalCount: data.element_count,
        closest,
        hazardous: neos.filter((n: any) => n.is_potentially_hazardous_asteroid).length
      });
    } catch (err) {
      console.error('[WebSocket] NEO update failed:', err);
    }
  };

  const sendISSUpdate = async () => {
    try {
      const data = await getISSLocation();
      socket.emit('iss_update', {
        timestamp: new Date().toISOString(),
        position: data.iss_position
      });
    } catch (err) {
      console.error('[WebSocket] ISS update failed:', err);
    }
  };

  // Send data immediately on connection
  sendNEOUpdate();
  sendISSUpdate();

  // Update ISS position every 10 seconds
  const issInterval = setInterval(sendISSUpdate, 10000);
  // Update NEO data every 5 minutes
  const neoInterval = setInterval(sendNEOUpdate, 300000);

  socket.on('request_space_weather', async () => {
    try {
      const data = await getSpaceWeather();
      socket.emit('space_weather', { timestamp: new Date().toISOString(), data });
    } catch (err) {
      socket.emit('space_weather', { error: 'Failed to fetch' });
    }
  });

  socket.on('disconnect', () => {
    clearInterval(issInterval);
    clearInterval(neoInterval);
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../public');
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Cosmos Explorer Server`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
  console.log(`   NASA Key: ${process.env.NASA_API_KEY ? 'Custom' : 'DEMO_KEY'}\n`);
});
