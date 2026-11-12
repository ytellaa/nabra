import fr from './fr.json';
import ar from './ar.json';

export type Lang = 'fr' | 'ar';
export type TKey = keyof typeof fr;

const dict: Record<Lang, Record<string, string>> = { fr, ar };

export function translate(lang: Lang, key: TKey, vars?: Record<string, string | number>): string {
  let s = dict[lang][key] ?? dict.fr[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export function detectLang(): Lang {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some((l) => l?.toLowerCase().startsWith('ar')) ? 'ar' : 'fr';
}

/** « Aujourd'hui », « Hier » ou une date courte (chiffres latins, même en arabe). */
export function formatDay(ts: number, lang: Lang): string {
  const d = new Date(ts);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(today) - startOf(d)) / 86_400_000);
  if (diff === 0) return translate(lang, 'common.today');
  if (diff === 1) return translate(lang, 'common.yesterday');
  const locale = lang === 'ar' ? 'ar-u-nu-latn' : 'fr-FR';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(d);
}
