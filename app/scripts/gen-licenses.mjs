// Génère public/licenses.txt : texte intégral de la licence de Nabra et des licences
// (et fichiers NOTICE) des logiciels libres embarqués. MIT, ISC, Apache-2.0, MPL-2.0 et
// SIL OFL imposent de fournir ces textes avec l'application.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');

// Paquets dont le code ou les ressources sont livrés dans l'application.
const PACKAGES = [
  '@capacitor/core',
  '@capacitor/android',
  '@capacitor/ios',
  '@capacitor/app',
  '@capacitor/filesystem',
  '@capacitor/share',
  '@capacitor-community/text-to-speech',
  '@capacitor-mlkit/text-recognition',
  '@capgo/capacitor-document-scanner',
  'react',
  'react-dom',
  'dexie',
  'tesseract.js',
  'tesseract.js-core',
  '@tesseract.js-data/fra',
  'lucide-react',
  '@fontsource/inter',
  '@fontsource/ibm-plex-sans-arabic',
];

const SEP = '='.repeat(72);
const repoUrl = (pkg) => {
  const r = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  return r ? r.replace(/^git\+/, '').replace(/\.git$/, '') : '';
};

const parts = [];
parts.push(`${SEP}\nNabra\n${SEP}\n\n${readFileSync(join(root, '..', 'LICENSE'), 'utf8').trim()}\n`);

for (const name of PACKAGES) {
  const dir = join(nm, name);
  if (!existsSync(dir)) throw new Error(`gen-licenses : paquet introuvable ${name}`);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const files = readdirSync(dir).filter((f) => /^(licen[cs]e|notice|copying)(\.(md|txt))?$/i.test(f));
  let head = `${SEP}\n${name} ${pkg.version} — ${pkg.license}\n`;
  const url = repoUrl(pkg);
  if (url) head += `Code source : ${url}\n`;
  head += `${SEP}\n`;
  const body = files.length
    ? files.map((f) => readFileSync(join(dir, f), 'utf8').trim()).join('\n\n')
    : `Distribué sous licence ${pkg.license}. Texte de la licence : https://spdx.org/licenses/${pkg.license}.html`;
  parts.push(`${head}\n${body}\n`);
}

parts.push(
  `${SEP}\nGoogle ML Kit (reconnaissance de texte, scanner de documents)\n${SEP}\n\n` +
    'Utilisé selon les conditions d’utilisation des API Google :\n' +
    'https://developers.google.com/terms et https://developers.google.com/ml-kit/terms\n',
);

writeFileSync(join(root, 'public', 'licenses.txt'), parts.join('\n'));
console.log(`public/licenses.txt généré (${PACKAGES.length} paquets)`);
