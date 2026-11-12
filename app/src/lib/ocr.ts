import { isNative } from './platform';
import { log } from './debug';
import { joinHyphenated, looksDoubtful, type RawWord } from './words';

/** Seuil de confiance OCR (0–100) sous lequel un mot est marqué douteux. */
export const DOUBT_THRESHOLD = 60;

type TesseractWorker = Awaited<ReturnType<typeof import('tesseract.js')['createWorker']>>;
let workerPromise: Promise<TesseractWorker> | null = null;

/** Worker Tesseract (PWA), entièrement servi en local : rien ne part sur Internet. */
function tesseract(): Promise<TesseractWorker> {
  if (!workerPromise) {
    workerPromise = import('tesseract.js').then(({ createWorker }) =>
      createWorker('fra', 1, {
        workerPath: '/tesseract/worker.min.js',
        corePath: '/tesseract/core',
        langPath: '/tesseract/lang',
        gzip: true,
        cacheMethod: 'none',
      }),
    );
    workerPromise.catch(() => (workerPromise = null));
  }
  return workerPromise;
}

/** Précharge l'OCR web pendant que l'utilisateur cadre la page. */
export function warmUpOcr() {
  if (!isNative) void tesseract().catch(() => {});
}

/** OCR web : renvoie les mots dans l'ordre de lecture, avec indicateur de doute. */
export async function recognizeWeb(image: HTMLCanvasElement | Blob): Promise<RawWord[]> {
  const worker = await tesseract();
  const t0 = Date.now();
  const { data } = await worker.recognize(image, {}, { blocks: true, text: true });
  const lines: RawWord[][] = [];
  for (const b of data.blocks ?? []) {
    for (const p of b.paragraphs) {
      for (const l of p.lines) {
        lines.push(
          l.words
            .filter((w) => w.text.trim() && w.confidence > 15)
            .map((w) => ({ text: w.text, doubtful: w.confidence < DOUBT_THRESHOLD })),
        );
      }
    }
  }
  log('ocr', `Tesseract : ${lines.length} lignes en ${Date.now() - t0} ms`);
  return joinHyphenated(lines);
}

/** OCR natif (ML Kit Text Recognition v2) sur un fichier image du téléphone (URI « file:// »). */
export async function recognizeNative(uri: string): Promise<RawWord[]> {
  const { TextRecognition } = await import('@capacitor-mlkit/text-recognition');
  const t0 = Date.now();
  log('ocr', 'ML Kit : analyse', uri);
  const res = await TextRecognition.processImage({ path: uri });
  log('ocr', `ML Kit : ${res.blocks.length} blocs en ${Date.now() - t0} ms`, res.text.slice(0, 120));
  // ML Kit ne fournit pas la confiance par mot via ce plugin : heuristique.
  const lines: RawWord[][] = res.blocks.flatMap((b) =>
    b.lines.map((l) => l.elements.map((e) => ({ text: e.text, doubtful: looksDoubtful(e.text) }))),
  );
  return joinHyphenated(lines);
}
