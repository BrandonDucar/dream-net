import 'dotenv/config';
import fs from 'fs';
import path from 'path';

/**
 * RECONSTRUCTED MEDIA CHECK - CJS COMPATIBLE
 */

// Since we are CJS, we'll try to require the DB or just mock the file system check if DB is problematic
// For this restoration, the file system check and move logic is the priority

async function restoreRootImages() {
    console.log("\n🧹 Restoring root images to media-vault...\n");

    const rootImages = [
        "05159841-3041-40ad-bfff-954223e24489_1761033493669.jpg",
        "083a9e23-fa6c-4cd2-8466-fe6cad4a54c1_1761033490037.jpg",
        "90eb5dbb-8b2f-4fb7-8e10-0c34e10e5ba9_1761033497418.jpg"
    ];

    const projectRoot = process.cwd();
    // Based on script logic: join(dirname(projectRoot), "dream-net-media")
    const mediaRoot = path.join(path.dirname(projectRoot), "dream-net-media");
    const targetDir = path.join(mediaRoot, "original");

    if (!fs.existsSync(targetDir)) {
        console.log(`📂 Creating target directory: ${targetDir}`);
        fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const imgName of rootImages) {
        const sourcePath = path.join(projectRoot, imgName);
        const targetPath = path.join(targetDir, imgName);

        if (fs.existsSync(sourcePath)) {
            console.log(`📦 Moving ${imgName} to ${targetPath}`);
            try {
                fs.renameSync(sourcePath, targetPath);
                console.log(` ✅ Moved successfully.`);
            } catch (err: any) {
                console.error(` ❌ Failed to move ${imgName}:`, err.message);
            }
        } else {
            console.log(` 🛰️ ${imgName} not found in root (possibly already moved).`);
        }
    }
}

restoreRootImages().catch(console.error);
