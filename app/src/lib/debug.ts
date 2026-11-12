/**
 * Journal de diagnostic. Toujours écrit dans la console (visible avec `adb logcat`),
 * et gardé en mémoire pour l'écran « Journal » du mode debug.
 */
export interface LogEntry {
  t: number;
  level: 'info' | 'warn' | 'error';
  tag: string;
  msg: string;
}

const MAX = 300;
const entries: LogEntry[] = [];
const listeners = new Set<() => void>();
let enabled = false;

export function setDebugEnabled(on: boolean) {
  enabled = on;
  notify();
}
export const isDebugEnabled = () => enabled;

function notify() {
  listeners.forEach((l) => l());
}

function fmt(data: unknown): string {
  if (data === undefined) return '';
  if (data instanceof Error) return ` ${data.name}: ${data.message}`;
  try {
    const s = typeof data === 'string' ? data : JSON.stringify(data);
    return ' ' + (s.length > 600 ? s.slice(0, 600) + '…' : s);
  } catch {
    return ' ' + String(data);
  }
}

export function log(tag: string, msg: string, data?: unknown, level: LogEntry['level'] = 'info') {
  const e: LogEntry = { t: Date.now(), level, tag, msg: msg + fmt(data) };
  entries.push(e);
  if (entries.length > MAX) entries.shift();
  const line = `[Nabra:${tag}] ${e.msg}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
  notify();
}

export const logError = (tag: string, msg: string, err?: unknown) => log(tag, msg, describeError(err), 'error');

/** Message lisible pour une erreur de plugin Capacitor ou JS. */
export function describeError(err: unknown): string {
  if (!err) return '';
  const e = err as { message?: string; code?: string; name?: string };
  return [e.name && e.name !== 'Error' ? e.name : '', e.code ? `[${e.code}]` : '', e.message ?? String(err)]
    .filter(Boolean)
    .join(' ');
}

export function getLogs(): LogEntry[] {
  return entries.slice();
}

export function clearLogs() {
  entries.length = 0;
  notify();
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function logsAsText(): string {
  return entries
    .map((e) => `${new Date(e.t).toISOString().slice(11, 23)} ${e.level.toUpperCase().padEnd(5)} ${e.tag}: ${e.msg}`)
    .join('\n');
}

// Erreurs non interceptées
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => log('window', 'Erreur non interceptée', e.error ?? e.message, 'error'));
  window.addEventListener('unhandledrejection', (e) => log('window', 'Promesse rejetée', describeError(e.reason), 'error'));
}
