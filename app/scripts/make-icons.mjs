// Génère les sources PNG des icônes et de l'écran de démarrage (resources/*.svg → resources/*.png),
// puis @capacitor/assets produit toutes les tailles Android / iOS.
import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const res = join(dirname(fileURLToPath(import.meta.url)), '..', 'resources');
const png = (svg, out, size) => sharp(join(res, svg), { density: 300 }).resize(size, size).png().toFile(join(res, out));

await png('icon.svg', 'icon-only.png', 1024);
await png('icon-foreground.svg', 'icon-foreground.png', 1024);
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#FEF7D6' } }).png().toFile(join(res, 'icon-background.png'));

// Écran de démarrage : logo centré sur le fond de l'application
const logo = await sharp(join(res, 'logo.svg'), { density: 400 }).resize({ width: 1100 }).png().toBuffer();
for (const [name, bg] of [['splash.png', '#FAFAF9'], ['splash-dark.png', '#FAFAF9']]) {
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: bg } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(join(res, name));
}
console.log('Sources d’icônes générées dans resources/');
