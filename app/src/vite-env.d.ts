/// <reference types="vite/client" />

/** Version SemVer de l'application, lue dans package.json au build. */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** « true » pour un build release (APK/AAB signés) : masque le mode debug. */
  readonly VITE_RELEASE?: string;
}
