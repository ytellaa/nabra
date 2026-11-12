/**
 * Indicateurs fixés au moment du build.
 * VITE_RELEASE=true est posé par `npm run android:release` et `npm run android:aab` :
 * le mode debug (réglage, bandeau, journal) n'est alors pas proposé aux utilisateurs.
 * Les traces restent écrites dans la console Android (adb logcat).
 */
export const DEBUG_AVAILABLE = import.meta.env.VITE_RELEASE !== 'true';
