import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context';
import { BackButton, Parrot } from '../components/ui';
import { isNative } from '../lib/platform';
import { recognizeNative, recognizeWeb, warmUpOcr } from '../lib/ocr';
import { scanNative } from '../lib/scanner';
import { imageSharpness, laplacianVariance, looksLikePage, meanAbsDiff, toGray, type Gray } from '../lib/sharpness';
import type { RawWord } from '../lib/words';
import { log, logError } from '../lib/debug';

type Phase = 'search' | 'blur' | 'sharp' | 'reading' | 'noText' | 'ocrError' | 'error';

interface Props {
  onBack: () => void;
  onDenied: () => void;
  onGranted: () => void;
  onCaptured: (words: RawWord[], photo: Blob | string) => void;
}

const COLOR: Record<Phase, string> = {
  search: '#ffffff',
  blur: 'var(--warning)',
  sharp: 'var(--success)',
  reading: '#ffffff',
  noText: 'var(--warning)',
  ocrError: 'var(--warning)',
  error: 'var(--warning)',
};

/** Durée pendant laquelle la page doit rester nette et stable avant la capture auto. */
const STABLE_MS = 800;
/** Netteté minimale d'un scan natif (variance du laplacien sur 480 px). */
const NATIVE_MIN_SHARPNESS = 60;

export function CameraScreen({ onBack, onDenied, onGranted, onCaptured }: Props) {
  const { t, sound } = useApp();
  const [phase, setPhase] = useState<Phase>('search');
  const [flash, setFlash] = useState(false);
  const [still, setStill] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const busy = useRef(false);
  const alive = useRef(true);
  const phaseRef = useRef<Phase>('search');

  const setP = useCallback(
    (p: Phase) => {
      if (phaseRef.current === p) return;
      log('camera', `Phase : ${phaseRef.current} → ${p}`);
      if (p === 'blur' || p === 'noText' || p === 'ocrError') sound('son-oups');
      phaseRef.current = p;
      setPhase(p);
    },
    [sound],
  );

  const doFlash = () => {
    setFlash(true);
    sound('son-declic');
    setTimeout(() => setFlash(false), 200);
  };

  const finishOcr = useCallback(
    (words: RawWord[] | null, photo: Blob | string) => {
      if (!alive.current) return;
      if (!words || !words.length) {
        log('camera', words ? 'Aucun mot reconnu' : 'OCR en échec');
        setP(words ? 'noText' : 'ocrError');
        // Natif : on reste sur cet écran, le bouton relance le scanner.
        if (isNative) {
          busy.current = false;
          return;
        }
        setTimeout(() => {
          if (!alive.current) return;
          setStill(null);
          busy.current = false;
          setP('search');
        }, 2500);
        return;
      }
      log('camera', `${words.length} mots reconnus → Lecteur`);
      onCaptured(words, photo);
    },
    [onCaptured, setP],
  );

  /* ---------- PWA : capture depuis la vidéo ---------- */
  const captureWeb = useCallback(async () => {
    const v = videoRef.current;
    if (!v || busy.current || !v.videoWidth) return;
    busy.current = true;
    doFlash();
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext('2d')!.drawImage(v, 0, 0);
    setStill(canvas.toDataURL('image/jpeg', 0.85));
    setP('reading');
    try {
      const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej()), 'image/jpeg', 0.85));
      log('camera', `Capture ${canvas.width}×${canvas.height}`);
      const words = await recognizeWeb(canvas);
      finishOcr(words, blob);
    } catch (e) {
      logError('camera', 'OCR web en échec', e);
      finishOcr(null, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishOcr, setP]);

  useEffect(() => {
    alive.current = true;
    if (isNative) return;
    warmUpOcr();
    let timer: ReturnType<typeof setInterval> | undefined;
    let prev: Gray | null = null;
    let peak = 0;
    let sharpSince = 0;
    let pageSince = 0;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } },
          audio: false,
        });
        if (!alive.current) return stream.getTracks().forEach((tr) => tr.stop());
        streamRef.current = stream;
        onGranted();
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play().catch(() => {});
      } catch (e) {
        if (!alive.current) return;
        logError('camera', 'getUserMedia refusé ou impossible', e);
        const name = (e as DOMException)?.name;
        if (name === 'NotAllowedError' || name === 'SecurityError') onDenied();
        else setP('error');
        return;
      }

      timer = setInterval(() => {
        const v = videoRef.current;
        if (!v || busy.current || !v.videoWidth) return;
        const W = v.videoWidth;
        const H = v.videoHeight;
        const crop = { x: W * 0.15, y: H * 0.12, w: W * 0.7, h: H * 0.76 };
        const g = toGray(v, W, H, 240, crop);
        const sharpness = laplacianVariance(g);
        const motion = prev ? meanAbsDiff(prev, g) : 99;
        prev = g;
        peak = Math.max(sharpness, peak * 0.985);
        const now = Date.now();
        const page = looksLikePage(g);
        if (!page) {
          pageSince = 0;
          sharpSince = 0;
          setP('search');
          return;
        }
        if (!pageSince) pageSince = now;
        const isSharp = sharpness > 40 && sharpness >= peak * 0.6 && motion < 5;
        if (isSharp) {
          if (!sharpSince) sharpSince = now;
          setP('sharp');
          if (now - sharpSince >= STABLE_MS) void captureWeb();
        } else {
          sharpSince = 0;
          if (now - pageSince > 400) setP('blur');
        }
      }, 150);
    })();

    return () => {
      alive.current = false;
      clearInterval(timer);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Natif : scanner système (ML Kit / VisionKit) ---------- */
  const scan = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setStill(null);
    setP('search');
    const res = await scanNative();
    if (!alive.current) return;
    if (res.status === 'cancel') return onBack();
    if (res.status === 'error') {
      busy.current = false;
      return setP('error');
    }
    onGranted();
    sound('son-declic');
    setStill(res.previewUrl);
    try {
      const sharp = await imageSharpness(res.previewUrl);
      log('camera', `Netteté du scan : ${Math.round(sharp)} (seuil ${NATIVE_MIN_SHARPNESS})`);
      if (sharp < NATIVE_MIN_SHARPNESS) {
        busy.current = false;
        return setP('blur');
      }
    } catch (e) {
      log('camera', 'Contrôle de netteté impossible, on continue', String(e), 'warn');
    }
    if (!alive.current) return;
    setP('reading');
    try {
      finishOcr(await recognizeNative(res.uri), res.uri);
    } catch (e) {
      logError('camera', 'OCR ML Kit en échec', e);
      finishOcr(null, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishOcr, onBack, setP]);

  useEffect(() => {
    if (isNative) void scan();
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusKey = phase === 'reading' ? 'camera.status.reading' : phase === 'sharp' ? 'camera.status.sharp' : phase === 'blur' ? 'camera.status.blur' : 'camera.status.search';
  const bubbleKey =
    phase === 'reading'
      ? 'camera.bubble.reading'
      : phase === 'noText'
        ? 'camera.bubble.noText'
        : phase === 'ocrError'
          ? 'camera.bubble.ocrError'
          : phase === 'error'
          ? 'camera.bubble.error'
          : (`camera.bubble.${phase}` as const);
  const oups = phase === 'blur' || phase === 'noText' || phase === 'ocrError' || phase === 'error';
  const shutterLabel = isNative && phase !== 'search' ? t('camera.scanAgain') : t('camera.shoot');

  return (
    <main className="screen camera">
      <div className="row" style={{ gap: 12 }}>
        <BackButton label={t('common.home')} onClick={onBack} dark />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="status-pill" role="status" aria-live="polite">
            <span className="status-dot" style={{ background: COLOR[phase] }} />
            {t(statusKey)}
          </div>
        </div>
        <div style={{ width: 52, flex: 'none' }} />
      </div>

      <div className="viewfinder">
        {!isNative && <video ref={videoRef} playsInline muted autoPlay aria-hidden="true" />}
        {still && <img className="still" src={still} alt="" />}
        <div className="guide" style={{ borderColor: COLOR[phase] }} />
        {phase === 'reading' && <div className="spinner" aria-hidden="true" />}
        <div className={`flash${flash ? ' on' : ''}`} />
      </div>

      <div className="row" style={{ gap: 12 }}>
        {oups ? <Parrot pose="oups" size={76} bg="var(--peach)" /> : <Parrot pose="photo" size={76} bg="var(--yellow)" />}
        <div className="cam-bubble" aria-live="polite">
          {t(bubbleKey)}
        </div>
      </div>

      <div className="shutter-wrap">
        <button
          type="button"
          className="shutter"
          aria-label={shutterLabel}
          disabled={phase === 'reading'}
          onClick={() => (isNative ? void scan() : void captureWeb())}
        >
          <span />
        </button>
        <span className="shutter-label" aria-hidden="true">
          {shutterLabel}
        </span>
      </div>
    </main>
  );
}
