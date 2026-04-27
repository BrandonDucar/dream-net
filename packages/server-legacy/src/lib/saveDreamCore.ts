import fs from 'fs';
import path from 'path';

export async function saveDreamCoreToLocal(dreamCore: any, walletAddress: string) {
  const dataDir = path.resolve(process.cwd(), 'server/data');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, `${walletAddress}-dream.json`);

  try {
    fs.writeFileSync(filePath, JSON.stringify(dreamCore, null, 2));
    console.log(`💾 Dream Core saved for wallet: ${walletAddress}`);
    return { status: 'success', message: 'Dream Core saved locally.' };
  } catch (err) {
    console.error("💾 Save failed:", err);
    return { status: 'error', message: 'Save failed.' };
  }
}

export async function loadDreamCoreFromLocal(walletAddress: string) {
  const dataDir = path.resolve(process.cwd(), 'server/data');
  const filePath = path.join(dataDir, `${walletAddress}-dream.json`);

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return { status: 'success', data: JSON.parse(data) };
    }
    return { status: 'not_found', message: 'No saved dream core found.' };
  } catch (err) {
    console.error("💾 Load failed:", err);
    return { status: 'error', message: 'Load failed.' };
  }
}

export async function listSavedDreamCores() {
  const dataDir = path.resolve(process.cwd(), 'server/data');
  
  try {
    if (!fs.existsSync(dataDir)) {
      return { status: 'success', cores: [] };
    }
    
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('-dream.json'))
      .map(file => ({
        walletAddress: file.replace('-dream.json', ''),
        fileName: file,
        lastModified: fs.statSync(path.join(dataDir, file)).mtime
      }));
    
    return { status: 'success', cores: files };
  } catch (err) {
    console.error("💾 List failed:", err);
    return { status: 'error', message: 'List failed.' };
  }
}