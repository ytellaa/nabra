/** Outils d'analyse d'image : netteté (variance du laplacien), mouvement, présence d'une page. */

export interface Gray {
  data: Float32Array;
  w: number;
  h: number;
}

/** Convertit une zone d'une source (vidéo, image, canvas) en niveaux de gris réduits. */
export function toGray(
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  targetW: number,
  crop?: { x: number; y: number; w: number; h: number },
): Gray {
  const c = crop ?? { x: 0, y: 0, w: srcW, h: srcH };
  const w = Math.max(8, Math.round(targetW));
  const h = Math.max(8, Math.round((c.h / c.w) * w));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(src, c.x, c.y, c.w, c.h, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  const data = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) data[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
  return { data, w, h };
}

/** Variance du laplacien : plus elle est haute, plus l'image est nette. */
export function laplacianVariance({ data, w, h }: Gray): number {
  let sum = 0;
  let sum2 = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const v = data[i - w] + data[i + w] + data[i - 1] + data[i + 1] - 4 * data[i];
      sum += v;
      sum2 += v * v;
      n++;
    }
  }
  const mean = sum / n;
  return sum2 / n - mean * mean;
}

/** Différence moyenne entre deux images de même taille (0–255). */
export function meanAbsDiff(a: Gray, b: Gray): number {
  if (a.w !== b.w || a.h !== b.h) return 255;
  let s = 0;
  for (let i = 0; i < a.data.length; i++) s += Math.abs(a.data[i] - b.data[i]);
  return s / a.data.length;
}

/**
 * Une page de texte est claire en moyenne avec beaucoup de petits contrastes
 * (les lettres). Heuristique simple et légère.
 */
export function looksLikePage({ data, w, h }: Gray): boolean {
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  const mean = sum / data.length;
  let edges = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (Math.abs(data[i + 1] - data[i - 1]) + Math.abs(data[i + w] - data[i - w]) > 60) edges++;
    }
  }
  const density = edges / ((w - 2) * (h - 2));
  return mean > 95 && density > 0.01 && density < 0.35;
}

/** Seuil de netteté pour une image réduite à ~480 px de large. */
export const SHARP_THRESHOLD = 180;

/** Netteté d'une image chargée depuis une URL (contrôle après le scanner natif). */
export async function imageSharpness(url: string): Promise<number> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  await img.decode();
  return laplacianVariance(toGray(img, img.naturalWidth, img.naturalHeight, 480));
}
