import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const NASA_BASE = 'https://api.nasa.gov';
const NASA_KEY = () => process.env.NASA_API_KEY || 'DEMO_KEY';

const inflight = new Map<string, Promise<any>>();

async function cachedFetch<T>(cacheKey: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get<T>(cacheKey);
  if (cached !== undefined) {
    console.log(`[Cache HIT] ${cacheKey}`);
    return cached;
  }
  if (inflight.has(cacheKey)) {
    console.log(`[Cache WAIT] ${cacheKey}`);
    return inflight.get(cacheKey) as Promise<T>;
  }
  console.log(`[Cache MISS] ${cacheKey}`);
  const promise = fetcher().then(data => {
    cache.set(cacheKey, data);
    inflight.delete(cacheKey);
    return data;
  }).catch(err => {
    inflight.delete(cacheKey);
    throw err;
  });
  inflight.set(cacheKey, promise);
  return promise;
}

export async function getAPOD(count?: number): Promise<any> {
  const key = `apod_${count || 1}`;
  return cachedFetch(key, async () => {
    const params: Record<string, any> = { api_key: NASA_KEY() };
    if (count) {
      params.count = Math.min(count, 20);
    }
    const { data } = await axios.get(`${NASA_BASE}/planetary/apod`, { params });
    return data;
  });
}

export async function getNEO(startDate?: string, endDate?: string): Promise<any> {
  const today = new Date();
  const start = startDate || today.toISOString().split('T')[0];
  const end = endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const key = `neo_${start}_${end}`;
  return cachedFetch(key, async () => {
    const { data } = await axios.get(`${NASA_BASE}/neo/rest/v1/feed`, {
      params: { start_date: start, end_date: end, api_key: NASA_KEY() }
    });
    return data;
  });
}

export async function getMarsPhotos(rover: string, sol?: number): Promise<any> {
  const key = `mars_${rover}_${sol ?? 'latest'}`;
  return cachedFetch(key, async () => {
    if (sol != null) {
      const { data } = await axios.get(`${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos`, {
        params: { sol, api_key: NASA_KEY(), page: 1 }
      });
      return data;
    }
    const { data } = await axios.get(`${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/latest_photos`, {
      params: { api_key: NASA_KEY() }
    });
    return { photos: data.latest_photos || [] };
  });
}

export async function getNASAImages(query: string): Promise<any> {
  const key = `images_${query}`;
  return cachedFetch(key, async () => {
    const { data } = await axios.get('https://images-api.nasa.gov/search', {
      params: { q: query, media_type: 'image', page_size: 20 }
    });
    return data;
  });
}

export async function getSpaceWeather(): Promise<any> {
  const key = 'space_weather';
  return cachedFetch(key, async () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data } = await axios.get(`${NASA_BASE}/DONKI/CME`, {
      params: {
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        api_key: NASA_KEY()
      }
    });
    return data;
  });
}

export async function getExoplanets(): Promise<any> {
  const key = 'exoplanets';
  return cachedFetch(key, async () => {
    const { data } = await axios.get('https://exoplanetarchive.ipac.caltech.edu/TAP/sync', {
      params: {
        query: 'SELECT pl_name,hostname,pl_orbper,pl_rade,pl_masse,disc_year,discoverymethod FROM pscomppars WHERE tran_flag=1 ORDER BY disc_year DESC',
        format: 'json'
      },
      timeout: 10000
    });
    return Array.isArray(data) ? data.slice(0, 100) : [];
  });
}

export async function getISSLocation(): Promise<any> {
  try {
    const { data } = await axios.get('http://api.open-notify.org/iss-now.json', { timeout: 5000 });
    return data;
  } catch {
    return { message: 'success', iss_position: { latitude: '0', longitude: '0' }, timestamp: Date.now() };
  }
}
