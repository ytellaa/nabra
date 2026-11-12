import { useState, useSyncExternalStore } from 'react';
import { getLogs, subscribe, type LogEntry } from '../lib/debug';

let snapshot: LogEntry[] = getLogs();
const sub = (fn: () => void) =>
  subscribe(() => {
    snapshot = getLogs();
    fn();
  });

export function useLogs(): LogEntry[] {
  return useSyncExternalStore(sub, () => snapshot);
}

const COLOR: Record<LogEntry['level'], string> = { info: '#cfd3dc', warn: '#ffc078', error: '#ff8787' };

export function LogLine({ e }: { e: LogEntry }) {
  return (
    <div style={{ color: COLOR[e.level], whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      {new Date(e.t).toISOString().slice(11, 19)} {e.tag}: {e.msg}
    </div>
  );
}

/** Bandeau des dernières traces, affiché en haut de chaque écran en mode debug. Appuyer pour agrandir. */
export function DebugPanel() {
  const logs = useLogs();
  const [open, setOpen] = useState(false);
  const shown = logs.slice(open ? -14 : -3);
  return (
    <button
      type="button"
      dir="ltr"
      onClick={() => setOpen((o) => !o)}
      aria-label="Journal de debug"
      style={{
        flex: 'none',
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: '#11131a',
        border: 'none',
        padding: '6px 10px',
        font: '500 11px/1.35 ui-monospace, Menlo, monospace',
        maxHeight: open ? '45vh' : 64,
        overflow: 'auto',
        cursor: 'pointer',
      }}
    >
      {shown.length ? shown.map((e, i) => <LogLine key={logs.length - shown.length + i} e={e} />) : <span style={{ color: '#888' }}>debug : aucun message</span>}
    </button>
  );
}
