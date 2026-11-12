// Copie les ressources de design/ et les fichiers Tesseract (OCR hors ligne) dans public/.
import { cpSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const handoff = join(root, '..', 'design');
const pub = join(root, 'public');
const nm = join(root, 'node_modules');

const copy = (from, to) => {
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
};

// Images et sons du handoff
if (existsSync(handoff)) {
  copy(join(handoff, 'assets', 'images'), join(pub, 'assets', 'images'));
  copy(join(handoff, 'assets', 'sounds'), join(pub, 'assets', 'sounds'));
}

// Logo Nabra
copy(join(root, 'resources', 'logo.svg'), join(pub, 'assets', 'images', 'logo.svg'));

// Tesseract.js : worker, cœur WASM (variantes LSTM) et modèle français
const tess = join(pub, 'tesseract');
copy(join(nm, 'tesseract.js', 'dist', 'worker.min.js'), join(tess, 'worker.min.js'));
for (const f of readdirSync(join(nm, 'tesseract.js-core'))) {
  if (/lstm\.wasm\.js$/.test(f)) copy(join(nm, 'tesseract.js-core', f), join(tess, 'core', f));
}
copy(
  join(nm, '@tesseract.js-data', 'fra', '4.0.0_best_int', 'fra.traineddata.gz'),
  join(tess, 'lang', 'fra.traineddata.gz'),
);

console.log('Ressources copiées dans public/');
