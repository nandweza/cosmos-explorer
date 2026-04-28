import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { LiveData } from '../types';

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [liveData, setLiveData] = useState<LiveData>({});

  useEffect(() => {
    const s = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    s.on('connect', () => {
      setConnected(true);
      console.log('[WS] Connected');
    });

    s.on('disconnect', () => {
      setConnected(false);
      console.log('[WS] Disconnected');
    });

    s.on('neo_update', (data: any) => {
      setLiveData(prev => ({ ...prev, neo: data }));
    });

    s.on('iss_update', (data: any) => {
      setLiveData(prev => ({ ...prev, iss: data }));
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  const requestSpaceWeather = useCallback(() => {
    socket?.emit('request_space_weather');
  }, [socket]);

  return { socket, connected, liveData, requestSpaceWeather };
}
