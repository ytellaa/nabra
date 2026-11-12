export type SoundName = 'son-salut' | 'son-oups' | 'son-declic' | 'son-doute' | 'son-mot' | 'son-bravo' | 'son-ok';

const VOLUME: Partial<Record<SoundName, number>> = { 'son-mot': 0.35 };
const cache = new Map<SoundName, HTMLAudioElement>();
let saluted = false;
let lastOups = 0;

function audio(name: SoundName) {
  let a = cache.get(name);
  if (!a) {
    a = new Audio(`/assets/sounds/${name}.ogg`);
    a.preload = 'auto';
    a.volume = VOLUME[name] ?? 1;
    cache.set(name, a);
  }
  return a;
}

/**
 * Joue un petit son du perroquet. Le réglage « Sons » coupe ces effets,
 * jamais la voix de lecture.
 */
export function playSound(name: SoundName, enabled: boolean) {
  if (name === 'son-salut') {
    if (saluted) return;
    saluted = true;
  }
  if (name === 'son-oups') {
    if (Date.now() - lastOups < 3000) return;
    lastOups = Date.now();
  }
  if (!enabled) return;
  try {
    const a = audio(name);
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {
    /* son indisponible : on ignore */
  }
}
