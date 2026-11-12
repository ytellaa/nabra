import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ctx, type AppCtx } from './context';
import { detectLang, translate, type Lang } from './i18n';
import { db, loadPrefs, loadSessions, newId, savePref, type Prefs, type Session } from './lib/db';
import { exportBackup, savePhoto } from './lib/files';
import { isNative, platform } from './lib/platform';
import { log, logsAsText, setDebugEnabled } from './lib/debug';
import { DebugPanel } from './components/DebugPanel';
import { DEBUG_AVAILABLE } from './lib/buildFlags';
import { playSound, type SoundName } from './lib/sounds';
import { buildWords, wordsFromText, type RawWord, type Word } from './lib/words';
import { CameraScreen } from './screens/Camera';
import { End } from './screens/End';
import { Home } from './screens/Home';
import { TINTS } from './lib/tints';
import { Reader } from './screens/Reader';
import { Settings, type SettingsPage } from './screens/Settings';

type Screen = 'home' | 'camera' | 'reader' | 'end' | SettingsPage;

interface ReaderState {
  key: number;
  words: Word[];
  text: string;
  fromCapture: boolean;
  photo?: Blob | string;
  savedId?: string;
  autoPlay: boolean;
}

const SETTINGS_PAGES: Screen[] = ['settings', 'lang', 'backup', 'backupDone', 'backupError', 'logs', 'legal'];

export default function App() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [screen, setScreen] = useState<Screen>('home');
  const [reader, setReader] = useState<ReaderState | null>(null);
  const [speed, setSpeed] = useState(1);
  const [exporting, setExporting] = useState(false);
  const readerRef = useRef(reader);
  useEffect(() => {
    readerRef.current = reader;
  }, [reader]);

  /* ---------- Chargement ---------- */
  useEffect(() => {
    (async () => {
      const defaults: Prefs = { lang: detectLang(), soundOn: true, totalWordsRead: 0, cameraPermission: 'unknown', debugOn: false };
      try {
        const [p, s] = await Promise.all([loadPrefs(defaults), loadSessions()]);
        setDebugEnabled(DEBUG_AVAILABLE && p.debugOn);
        setPrefs(p);
        setSessions(s);
        log('app', 'Démarrage', { platform, native: isNative, lang: p.lang, sessions: s.length, ua: navigator.userAgent });
      } catch (e) {
        log('app', 'Lecture de la base impossible', String(e), 'error');
        setPrefs(defaults);
      }
    })();
  }, []);

  const lang: Lang = prefs?.lang ?? 'fr';
  const soundOn = prefs?.soundOn ?? true;
  const debugOn = DEBUG_AVAILABLE && (prefs?.debugOn ?? false);

  const updatePref = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => (p ? { ...p, [key]: value } : p));
    void savePref(key, value).catch(() => {});
  }, []);

  const ctx = useMemo<AppCtx>(
    () => ({
      lang,
      t: (k, v) => translate(lang, k, v),
      sound: (name: SoundName) => playSound(name, soundOn),
      debug: debugOn,
    }),
    [lang, soundOn, debugOn],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Son d'accueil : une seule fois par ouverture de l'application.
  useEffect(() => {
    if (prefs && screen === 'home') ctx.sound('son-salut');
  }, [prefs, screen, ctx]);

  /* ---------- Navigation ---------- */
  const goHome = useCallback(() => {
    setScreen('home');
    setReader(null);
  }, []);

  const openCamera = () => setScreen('camera');

  const onCaptured = useCallback(
    (raw: RawWord[], photo: Blob | string) => {
      const { text, words } = buildWords(raw);
      log('reader', `Ouverture : ${words.length} mots, ${words.filter((w) => w.doubtful).length} douteux`);
      setReader({ key: Date.now(), words, text, fromCapture: true, photo, autoPlay: false });
      setScreen('reader');
      if (words.some((w) => w.doubtful)) ctx.sound('son-doute');
    },
    [ctx],
  );

  const openSession = (s: Session) => {
    setReader({ key: Date.now(), words: wordsFromText(s.text), text: s.text, fromCapture: false, savedId: s.id, autoPlay: false });
    setScreen('reader');
  };

  /** Sauvegarde automatique au premier ▶ (ou « Lire quand même »). */
  const onStart = useCallback(() => {
    const r = readerRef.current;
    if (!r || !r.fromCapture || r.savedId) return;
    const session: Session = {
      id: newId(),
      createdAt: Date.now(),
      text: r.text,
      wordCount: r.words.length,
      tint: sessions.length % TINTS.length,
    };
    readerRef.current = { ...r, savedId: session.id };
    setReader(readerRef.current);
    setSessions((list) => [session, ...list]);
    void (async () => {
      await db.sessions.put(session);
      if (r.photo) {
        const uri = await savePhoto(session.id, r.photo);
        if (uri) await db.sessions.update(session.id, { sourcePhotoUri: uri });
      }
    })().catch(() => {});
  }, [sessions.length]);

  const onFinish = useCallback(() => {
    const r = readerRef.current;
    if (!r) return;
    setPrefs((p) => {
      if (!p) return p;
      const total = p.totalWordsRead + r.words.length;
      void savePref('totalWordsRead', total).catch(() => {});
      return { ...p, totalWordsRead: total };
    });
    setScreen('end');
    ctx.sound('son-bravo');
  }, [ctx]);

  const replay = () => {
    if (!reader) return goHome();
    setReader({ ...reader, key: Date.now(), autoPlay: true });
    setScreen('reader');
  };

  const settingsBack = useCallback(() => {
    setScreen((s) => (s === 'settings' ? 'home' : 'settings'));
  }, []);

  const doExport = async () => {
    if (exporting || !prefs) return;
    setExporting(true);
    const res = await exportBackup(sessions, prefs.totalWordsRead);
    setExporting(false);
    if (res === 'ok') {
      setScreen('backupDone');
      ctx.sound('son-ok');
    } else if (res === 'error') {
      setScreen('backupError');
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    updatePref('soundOn', next);
    if (next) playSound('son-ok', true);
  };

  const toggleDebug = () => {
    const next = !debugOn;
    setDebugEnabled(next);
    updatePref('debugOn', next);
    log('app', `Mode debug ${next ? 'activé' : 'désactivé'}`);
  };

  const shareLogs = async () => {
    const text = `Nabra 1.0 · ${platform}\n${navigator.userAgent}\n\n${logsAsText()}`;
    try {
      if (isNative) {
        const { Share } = await import('@capacitor/share');
        await Share.share({ title: 'Journal Nabra', text });
      } else if (navigator.share) {
        await navigator.share({ title: 'Journal Nabra', text });
      } else {
        await navigator.clipboard.writeText(text);
        log('app', 'Journal copié dans le presse-papiers');
      }
    } catch (e) {
      log('app', 'Partage du journal annulé ou impossible', String(e), 'warn');
    }
  };

  // Trace de navigation
  useEffect(() => {
    log('nav', `Écran : ${screen}`);
  }, [screen]);

  /* ---------- Bouton retour Android ---------- */
  const screenRef = useRef(screen);
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);
  useEffect(() => {
    if (!isNative) return;
    let handle: { remove: () => void } | undefined;
    void import('@capacitor/app').then(async ({ App: CapApp }) => {
      handle = await CapApp.addListener('backButton', () => {
        const s = screenRef.current;
        if (s === 'home') void CapApp.minimizeApp();
        else if (SETTINGS_PAGES.includes(s)) settingsBack();
        else goHome();
      });
    });
    return () => handle?.remove();
  }, [goHome, settingsBack]);

  if (!prefs) return <div className="app" />;

  const appClass = `app${screen === 'camera' ? ' dark' : ''}${screen === 'end' ? ' end' : ''}`;

  return (
    <Ctx.Provider value={ctx}>
      <div className={appClass} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
        {debugOn && <DebugPanel />}
        {screen === 'home' && (
          <Home
            sessions={sessions}
            totalWords={prefs.totalWordsRead}
            onToggleLang={() => updatePref('lang', lang === 'fr' ? 'ar' : 'fr')}
            onSettings={() => setScreen('settings')}
            onNewRead={openCamera}
            onOpen={openSession}
          />
        )}

        {screen === 'camera' && (
          <CameraScreen
            onBack={goHome}
            onDenied={() => {
              updatePref('cameraPermission', 'denied');
              goHome();
            }}
            onGranted={() => prefs.cameraPermission !== 'granted' && updatePref('cameraPermission', 'granted')}
            onCaptured={onCaptured}
          />
        )}

        {screen === 'reader' && reader && (
          <Reader
            key={reader.key}
            words={reader.words}
            text={reader.text}
            fromCapture={reader.fromCapture}
            autoPlay={reader.autoPlay}
            speed={speed}
            onSpeed={setSpeed}
            onBack={goHome}
            onRescan={openCamera}
            onStart={onStart}
            onFinish={onFinish}
          />
        )}

        {screen === 'end' && reader && <End wordCount={reader.words.length} onReplay={replay} onHome={goHome} />}

        {SETTINGS_PAGES.includes(screen) && (
          <Settings
            page={screen as SettingsPage}
            soundOn={soundOn}
            debugOn={debugOn}
            sessionsCount={sessions.length}
            totalWords={prefs.totalWordsRead}
            exporting={exporting}
            onBack={settingsBack}
            onNavigate={(p) => setScreen(p)}
            onToggleSound={toggleSound}
            onToggleDebug={toggleDebug}
            onShareLogs={shareLogs}
            onSetLang={(l) => updatePref('lang', l)}
            onExport={doExport}
          />
        )}
      </div>
    </Ctx.Provider>
  );
}
