import { Router, Request, Response } from 'express';
import { MISSIONS } from '../data/missions';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  let result = [...MISSIONS];

  if (req.query.target) {
    const t = (req.query.target as string).toLowerCase();
    result = result.filter(m => m.target.toLowerCase().includes(t) || m.targetType.toLowerCase().includes(t));
  }
  if (req.query.agency) {
    const a = (req.query.agency as string).toLowerCase();
    result = result.filter(m => m.agency.toLowerCase().includes(a));
  }
  if (req.query.type) {
    result = result.filter(m => m.type === req.query.type);
  }
  if (req.query.status) {
    result = result.filter(m => m.status === req.query.status);
  }

  result.sort((a, b) => new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime());
  res.json({ success: true, data: result, total: result.length });
});

router.get('/stats', (_req: Request, res: Response) => {
  const stats = {
    total: MISSIONS.length,
    byStatus: {} as Record<string, number>,
    byAgency: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byTarget: {} as Record<string, number>,
    activeMissions: MISSIONS.filter(m => m.status === 'active').length,
    firstMission: MISSIONS.reduce((a, b) => new Date(a.launchDate) < new Date(b.launchDate) ? a : b).name,
    latestMission: MISSIONS.reduce((a, b) => new Date(a.launchDate) > new Date(b.launchDate) ? a : b).name,
  };

  MISSIONS.forEach(m => {
    stats.byStatus[m.status] = (stats.byStatus[m.status] || 0) + 1;
    stats.byAgency[m.agency] = (stats.byAgency[m.agency] || 0) + 1;
    stats.byType[m.type] = (stats.byType[m.type] || 0) + 1;
    stats.byTarget[m.targetType] = (stats.byTarget[m.targetType] || 0) + 1;
  });

  res.json({ success: true, data: stats });
});

router.get('/:id', (req: Request, res: Response) => {
  const mission = MISSIONS.find(m => m.id === req.params.id);
  if (!mission) return res.status(404).json({ success: false, error: 'Mission not found' });
  res.json({ success: true, data: mission });
});

export default router;
