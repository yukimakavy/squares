import { copyFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const standaloneDir = join(rootDir, 'standalone');

// Remove existing standalone directory if it exists
if (existsSync(standaloneDir)) {
  console.log('Removing existing standalone directory...');
  rmSync(standaloneDir, { recursive: true, force: true });
}

// Create standalone directory
console.log('Creating standalone directory...');
mkdirSync(standaloneDir, { recursive: true });

// Copy all files from dist to standalone
function copyRecursive(src, dest) {
  const stats = statSync(src);

  if (stats.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    const files = readdirSync(src);

    for (const file of files) {
      copyRecursive(join(src, file), join(dest, file));
    }
  } else {
    copyFileSync(src, dest);
  }
}

console.log('Copying build files...');
copyRecursive(distDir, standaloneDir);

console.log('');
console.log('✓ Standalone build created successfully!');
console.log('');
console.log('Location: ' + standaloneDir);
console.log('');
console.log('To run the game:');
console.log('  1. Open the standalone folder');
console.log('  2. Double-click index.html');
console.log('  3. The game will open in your default browser');
console.log('');
console.log('You can also copy the entire "standalone" folder to share the game.');
