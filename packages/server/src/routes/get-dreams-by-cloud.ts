import { Request, Response } from 'express';

export async function getServerSideProps(context: any) {
  const slug = context.params.slug;
  
  // Mock implementation - replace with actual database query when connected
  const mockDreams = [
    {
      id: 'ai-dream-1',
      title: 'Neural Network Optimizer',
      dreamCloud: slug,
      timestamp: Date.now() - 1000000
    },
    {
      id: 'ai-dream-2', 
      title: 'Quantum ML Framework',
      dreamCloud: slug,
      timestamp: Date.now() - 2000000
    }
  ];

  // When database is connected, use:
  // const dreams = await db.collection('dreams')
  //   .find({ dreamCloud: slug })
  //   .sort({ timestamp: -1 })
  //   .toArray();

  return { props: { dreams: mockDreams, slug } };
}

// REST API endpoint version
export default async function handler(req: Request, res: Response) {
  const { slug } = req.params;
  
  // Mock implementation
  const mockDreams = [
    {
      id: `${slug}-dream-1`,
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Innovation Project`,
      dreamCloud: slug,
      timestamp: Date.now() - 1000000
    }
  ];

  // When database is connected, use:
  // const dreams = await db.collection('dreams')
  //   .find({ dreamCloud: slug })
  //   .sort({ timestamp: -1 })
  //   .toArray();

  res.json(mockDreams);
}