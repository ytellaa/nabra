// Reporte la version de package.json dans le projet iOS (Android la lit directement au build).
// MARKETING_VERSION = version SemVer ; CURRENT_PROJECT_VERSION = MAJEUR*10000 + MINEUR*100 + CORRECTIF.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const [major, minor, patch] = version.split('-')[0].split('.').map(Number);
const build = major * 10000 + minor * 100 + patch;

const pbx = join(root, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');
if (existsSync(pbx)) {
  const s = readFileSync(pbx, 'utf8')
    .replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version.split('-')[0]};`)
    .replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${build};`);
  writeFileSync(pbx, s);
}
console.log(`Version ${version} (build ${build})`);
