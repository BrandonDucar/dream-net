import type { Dream } from "@dreamnet/shared/schema";

export function generateSampleDreams(count: number = 10): Dream[] {
  const dreams: Dream[] = [];
  
  const baseTags = [
    'AI',
    'Design', 
    'Environment',
    'Education',
    'Health',
    'Finance',
    'Social',
    'Gaming',
    'Productivity',
    'Art'
  ];

  const coreTypes = ['Vision', 'Tool', 'Movement'];
  
  // Generate dreams using your exact pattern
  for (let i = 0; i < 3; i++) {
    const dream: Dream = {
      id: `dream-${i}`,
      name: `Dream ${i}`,
      creator: `0xFAKE${i}`,
      wallet: `0xFAKE${i}`,
      tags: [baseTags[i % baseTags.length]],
      score: 0,
      evolved: false,
      lastUpdated: new Date().toISOString(),
      coreType: coreTypes[i % coreTypes.length] as 'Vision' | 'Tool' | 'Movement',
      description: `This is the seed description for Dream ${i}`,
      image: `https://picsum.photos/seed/${i}/300/200`,
      status: 'Draft',
    };
    dreams.push(dream);
  }
  
  // Generate additional dreams if count > 3
  for (let i = 3; i < count; i++) {
    const dream: Dream = {
      id: `dream-${i}`,
      name: `Dream ${i}`,
      creator: `0xFAKE${i}`,
      wallet: `0xFAKE${i}`,
      tags: [baseTags[i % baseTags.length]],
      score: Math.floor(Math.random() * 100),
      evolved: Math.random() > 0.7,
      lastUpdated: new Date().toISOString(),
      coreType: coreTypes[i % coreTypes.length] as 'Vision' | 'Tool' | 'Movement',
      description: `This is the seed description for Dream ${i}`,
      image: `https://picsum.photos/seed/${i}/300/200`,
      status: 'Draft',
    };
    dreams.push(dream);
  }
  
  return dreams;
}

export const sampleDreams = generateSampleDreams(12);

// Generate static sample dreams using your exact code pattern
export const staticSampleDreams: Dream[] = (() => {
  const dreams: Dream[] = [];
  const baseTags = ['ai', 'crypto', 'music', 'edu'];
  const coreTypes = ['Vision', 'Tool', 'Movement'];
  
  for (let i = 0; i < 3; i++) {
    const dream: Dream = {
      id: `dream-${i}`,
      name: `Dream ${i}`,
      creator: `0xFAKE${i}`,
      wallet: `0xFAKE${i}`,
      tags: [baseTags[i % baseTags.length]],
      score: 0,
      evolved: false,
      lastUpdated: new Date().toISOString(),
      coreType: coreTypes[i % coreTypes.length] as 'Vision' | 'Tool' | 'Movement',
      description: `This is the seed description for Dream ${i}.`,
      image: `https://picsum.photos/seed/${i}/300/200`,
      status: 'Draft',
    };
    dreams.push(dream);
  }
  
  return dreams;
})();