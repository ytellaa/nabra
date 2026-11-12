import { createContext, useContext } from 'react';
import { translate, type Lang, type TKey } from './i18n';
import type { SoundName } from './lib/sounds';

export interface AppCtx {
  lang: Lang;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  sound: (name: SoundName) => void;
  debug: boolean;
}

export const Ctx = createContext<AppCtx>({
  lang: 'fr',
  t: (k, v) => translate('fr', k, v),
  sound: () => {},
  debug: false,
});

export const useApp = () => useContext(Ctx);
