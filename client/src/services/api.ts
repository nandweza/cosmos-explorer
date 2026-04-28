import axios from 'axios';

const BASE = '/api';

const http = axios.create({ baseURL: BASE, timeout: 15000 });

export const api = {
  planets: {
    getAll: () => http.get('/planets').then(r => r.data.data),
    getById: (id: string) => http.get(`/planets/${id}`).then(r => r.data.data),
  },
  missions: {
    getAll: (params?: Record<string, string>) =>
      http.get('/missions', { params }).then(r => r.data),
    getStats: () => http.get('/missions/stats').then(r => r.data.data),
    getById: (id: string) => http.get(`/missions/${id}`).then(r => r.data.data),
  },
  nasa: {
    apod: (count?: number) =>
      http.get('/nasa/apod', { params: count ? { count } : {} }).then(r => r.data.data),
    neo: (start?: string, end?: string) =>
      http.get('/nasa/neo', { params: { start, end } }).then(r => r.data.data),
    marsPhotos: (rover = 'curiosity', sol?: number) =>
      http.get('/nasa/mars-photos', { params: { rover, ...(sol != null ? { sol } : {}) } }).then(r => r.data.data),
    images: (q: string) =>
      http.get('/nasa/images', { params: { q } }).then(r => r.data.data),
    spaceWeather: () =>
      http.get('/nasa/space-weather').then(r => r.data.data),
    exoplanets: () =>
      http.get('/nasa/exoplanets').then(r => r.data.data),
    iss: () =>
      http.get('/nasa/iss').then(r => r.data.data),
  },
  health: () => http.get('/health').then(r => r.data),
};
