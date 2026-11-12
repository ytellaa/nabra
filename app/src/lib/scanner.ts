import { Capacitor } from '@capacitor/core';
import { describeError, log, logError } from './debug';

export type ScanResult =
  | { status: 'ok'; path: string; uri: string; previewUrl: string }
  | { status: 'cancel' }
  | { status: 'error'; message: string };

/**
 * Le scanner renvoie un chemin absolu (« /data/user/0/…/scan.jpg ») alors que
 * l'OCR ML Kit fait `Uri.parse(path)` et attend une URI « file:// ».
 */
export function toFileUri(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) return path;
  return 'file://' + (path.startsWith('/') ? '' : '/') + path;
}

/**
 * Scanner natif : ML Kit Document Scanner (Android) / VisionKit (iOS).
 * La détection de page, le recadrage et la capture automatique sont faits par le système.
 */
export async function scanNative(): Promise<ScanResult> {
  try {
    const { DocumentScanner, ResponseType, ScanDocumentResponseStatus } = await import('@capgo/capacitor-document-scanner');
    log('scan', 'Ouverture du scanner natif');
    const res = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      letUserAdjustCrop: false,
      responseType: ResponseType.ImageFilePath,
      croppedImageQuality: 95,
    });
    log('scan', 'Réponse du scanner', { status: res.status, images: res.scannedImages?.length ?? 0, first: res.scannedImages?.[0] });
    const path = res.scannedImages?.[0];
    if (res.status === ScanDocumentResponseStatus.Cancel || !path) return { status: 'cancel' };
    const uri = toFileUri(path);
    const previewUrl = Capacitor.convertFileSrc(uri);
    log('scan', 'Image prête', { uri, previewUrl });
    return { status: 'ok', path, uri, previewUrl };
  } catch (e) {
    const message = describeError(e);
    if (/cancel/i.test(message)) {
      log('scan', 'Scan annulé', message);
      return { status: 'cancel' };
    }
    logError('scan', 'Échec du scanner', e);
    return { status: 'error', message };
  }
}
