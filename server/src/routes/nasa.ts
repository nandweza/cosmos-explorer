import { Router, Request, Response } from 'express';
import { getAPOD, getNEO, getMarsPhotos, getNASAImages, getSpaceWeather, getExoplanets, getISSLocation } from '../services/nasaApi';

const router = Router();

router.get('/apod', async (req: Request, res: Response) => {
  try {
    const count = req.query.count ? parseInt(req.query.count as string) : undefined;
    const data = await getAPOD(count);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('APOD error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch APOD data', message: err.message });
  }
});

router.get('/neo', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    const data = await getNEO(start as string, end as string);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('NEO error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch NEO data', message: err.message });
  }
});

router.get('/mars-photos', async (req: Request, res: Response) => {
  try {
    const rover = (req.query.rover as string) || 'curiosity';
    const sol = req.query.sol ? parseInt(req.query.sol as string) : undefined;
    const data = await getMarsPhotos(rover, sol);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Mars photos error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch Mars photos', message: err.message });
  }
});

router.get('/images', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || 'solar system';
    const data = await getNASAImages(query);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Images error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch NASA images', message: err.message });
  }
});

router.get('/space-weather', async (req: Request, res: Response) => {
  try {
    const data = await getSpaceWeather();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Space weather error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch space weather', message: err.message });
  }
});

router.get('/exoplanets', async (req: Request, res: Response) => {
  try {
    const data = await getExoplanets();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Exoplanets error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch exoplanet data', message: err.message });
  }
});

router.get('/iss', async (_req: Request, res: Response) => {
  try {
    const data = await getISSLocation();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch ISS location' });
  }
});

export default router;
