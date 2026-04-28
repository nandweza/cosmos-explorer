import { Router, Request, Response } from 'express';
import { PLANETS } from '../data/planets';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: PLANETS });
});

router.get('/:id', (req: Request, res: Response) => {
  const planet = PLANETS.find(p => p.id === req.params.id);
  if (!planet) return res.status(404).json({ success: false, error: 'Planet not found' });
  res.json({ success: true, data: planet });
});

export default router;
