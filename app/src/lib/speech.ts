import type { PluginListenerHandle } from '@capacitor/core';
import { isNative } from './platform';
import { describeError, log } from './debug';

/**
 * Synthèse vocale en français avec position du mot lu.
 * - Natif : voix du téléphone (plugin text-to-speech, évènement `onRangeStart`).
 * - PWA : Web Speech API (évènement `boundary`).
 * `onBoundary` reçoit l'indice de caractère du mot en cours dans `text`.
 */
export interface Speaker {
  available(): boolean;
  speak(text: string, rate: number, onBoundary: (charIndex: number) => void): Promise<void>;
  stop(): void;
}

class WebSpeaker implements Speaker {
  private voice: SpeechSynthesisVoice | null = null;
  private current: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (!this.available()) return;
    const pick = () => {
      const fr = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('fr'));
      this.voice =
        fr.find((v) => v.localService && /fr-FR/i.test(v.lang)) ?? fr.find((v) => /fr-FR/i.test(v.lang)) ?? fr[0] ?? null;
      if (this.voice) log('tts', `Voix web : ${this.voice.name} (${this.voice.lang})`);
    };
    pick();
    speechSynthesis.addEventListener?.('voiceschanged', pick);
  }

  available() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  speak(text: string, rate: number, onBoundary: (i: number) => void) {
    return new Promise<void>((resolve) => {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      if (this.voice) u.voice = this.voice;
      u.rate = rate;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(safety);
        resolve();
      };
      // Certains navigateurs n'émettent jamais `end` : filet de sécurité.
      const safety = setTimeout(finish, (text.length * 130) / rate + 5000);
      u.onboundary = (e) => {
        if (!e.name || e.name === 'word') onBoundary(e.charIndex);
      };
      u.onend = finish;
      u.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') log('tts', 'Erreur voix web', e.error, 'error');
        finish();
      };
      this.current = u;
      speechSynthesis.speak(u);
    });
  }

  stop() {
    if (!this.available()) return;
    if (this.current) {
      this.current.onend = null;
      this.current.onboundary = null;
    }
    speechSynthesis.cancel();
  }
}

class NativeSpeaker implements Speaker {
  private handler: ((i: number) => void) | null = null;
  private listener: Promise<PluginListenerHandle> | null = null;
  private plugin = import('@capacitor-community/text-to-speech');

  available() {
    return true;
  }

  async speak(text: string, rate: number, onBoundary: (i: number) => void) {
    const { TextToSpeech, QueueStrategy } = await this.plugin;
    if (!this.listener) {
      this.listener = TextToSpeech.addListener('onRangeStart', (info) => this.handler?.(info.start));
      TextToSpeech.isLanguageSupported({ lang: 'fr-FR' })
        .then((r) => log('tts', `Voix native fr-FR disponible : ${r.supported}`))
        .catch((e) => log('tts', 'Test de la langue impossible', describeError(e), 'warn'));
    }
    await this.listener;
    this.handler = onBoundary;
    try {
      await TextToSpeech.speak({ text, lang: 'fr-FR', rate, queueStrategy: QueueStrategy.Flush });
    } catch (e) {
      log('tts', 'Voix native : arrêt ou erreur', describeError(e), 'warn');
    }
  }

  stop() {
    this.handler = null;
    void this.plugin.then(({ TextToSpeech }) => TextToSpeech.stop()).catch(() => {});
  }
}

export const speaker: Speaker = isNative ? new NativeSpeaker() : new WebSpeaker();
