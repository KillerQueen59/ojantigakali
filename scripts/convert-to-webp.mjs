import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const FOLDERS = [
  'serat-kalam',
  'simelaproklim',
  'fokuslah',
  'ddp',
  'jgc',
  'parkle',
];

let totalOriginal = 0;
let totalConverted = 0;

async function convertFolder(folder) {
  const dir = join(publicDir, folder);
  const files = await readdir(dir);
  const pngs = files.filter(f => extname(f).toLowerCase() === '.png');

  for (const file of pngs) {
    const input = join(dir, file);
    const output = join(dir, basename(file, '.png') + '.webp');

    const { size: origSize } = await import('fs').then(fs => fs.promises.stat(input));
    await sharp(input).webp({ quality: 82 }).toFile(output);
    const { size: newSize } = await import('fs').then(fs => fs.promises.stat(output));

    totalOriginal += origSize;
    totalConverted += newSize;

    const savings = (((origSize - newSize) / origSize) * 100).toFixed(1);
    console.log(`  ${file} → ${basename(output)}  (${(origSize/1024/1024).toFixed(1)}MB → ${(newSize/1024/1024).toFixed(1)}MB, -${savings}%)`);

    await unlink(input);
  }
}

console.log('Converting PNGs to WebP...\n');
for (const folder of FOLDERS) {
  console.log(`[${folder}]`);
  await convertFolder(folder);
}

console.log(`\nDone! Total: ${(totalOriginal/1024/1024).toFixed(1)}MB → ${(totalConverted/1024/1024).toFixed(1)}MB saved ${((totalOriginal-totalConverted)/1024/1024).toFixed(1)}MB`);
