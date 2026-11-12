import { Capacitor } from '@capacitor/core';

/** true dans l'application Android / iOS empaquetée avec Capacitor, false en PWA. */
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'android' | 'ios' | 'web'
