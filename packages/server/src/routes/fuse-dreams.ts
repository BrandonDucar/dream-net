import { Request, Response } from 'express';

export default function fuseDreamsHandler(req: Request, res: Response) {
  const { dreamIds, fusionType } = req.body;
  
  const fusedDream = {
    id: `fused-${Date.now()}`,
    title: `Fused Dream: ${dreamIds.join(' + ')}`,
    dreamCloud: 'custom',
    fusionType,
    parentDreams: dreamIds,
    createdAt: new Date().toISOString()
  };
  
  res.json({ success: true, fusedDream });
}