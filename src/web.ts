import { WebPlugin } from '@capacitor/core';

import type {
  SpeechSynthesisPlugin,
  SpeakOptions,
  SpeakResult,
  SynthesizeToFileResult,
  VoiceInfo,
  IsLanguageAvailableOptions,
  IsVoiceAvailableOptions,
  ActivateAudioSessionOptions,
} from './definitions';

export class SpeechSynthesisWeb extends WebPlugin implements SpeechSynthesisPlugin {
  private utteranceIdCounter = 0;
  private currentUtterances = new Map<string, SpeechSynthesisUtterance>();

  async speak(options: SpeakOptions): Promise<SpeakResult> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    const utteranceId = `web-utterance-${++this.utteranceIdCounter}`;
    const utterance = new SpeechSynthesisUtterance(options.text);

    // Set voice if specified
    if (options.voiceId) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.voiceURI === options.voiceId || v.name === options.voiceId);
      if (voice) {
        utterance.voice = voice;
      }
    } else if (options.language) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang === options.language);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = options.language;
    }

    // Set speech parameters
    if (options.pitch !== undefined) {
      utterance.pitch = Math.max(0, Math.min(2, options.pitch));
    }
    if (options.rate !== undefined) {
      utterance.rate = Math.max(0.1, Math.min(10, options.rate));
    }
    if (options.volume !== undefined) {
      utterance.volume = Math.max(0, Math.min(1, options.volume));
    }

    // Set up event listeners
    utterance.onstart = () => {
      this.notifyListeners('start', { utteranceId });
    };

    utterance.onend = () => {
      this.currentUtterances.delete(utteranceId);
      this.notifyListeners('end', { utteranceId });
    };

    utterance.onboundary = (event) => {
      this.notifyListeners('boundary', {
        utteranceId,
        charIndex: event.charIndex,
        charLength: event.charLength,
      });
    };

    utterance.onerror = (event) => {
      this.currentUtterances.delete(utteranceId);
      this.notifyListeners('error', {
        utteranceId,
        error: event.error || 'Unknown error',
      });
    };

    // Handle queue strategy
    if (options.queueStrategy === 'Flush') {
      window.speechSynthesis.cancel();
      this.currentUtterances.clear();
    }

    this.currentUtterances.set(utteranceId, utterance);
    window.speechSynthesis.speak(utterance);

    return { utteranceId };
  }

  async synthesizeToFile(_options: SpeakOptions): Promise<SynthesizeToFileResult> {
    throw new Error('synthesizeToFile is not supported on web platform');
  }

  async cancel(): Promise<void> {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterances.clear();
    }
  }

  async pause(): Promise<void> {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  async resume(): Promise<void> {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  async isSpeaking(): Promise<{ isSpeaking: boolean }> {
    if ('speechSynthesis' in window) {
      return { isSpeaking: window.speechSynthesis.speaking };
    }
    return { isSpeaking: false };
  }

  async isAvailable(): Promise<{ isAvailable: boolean }> {
    return { isAvailable: 'speechSynthesis' in window };
  }

  async getVoices(): Promise<{ voices: VoiceInfo[] }> {
    if (!('speechSynthesis' in window)) {
      return { voices: [] };
    }

    const webVoices = window.speechSynthesis.getVoices();
    const voices: VoiceInfo[] = webVoices.map((voice) => ({
      id: voice.voiceURI,
      name: voice.name,
      language: voice.lang,
      isNetworkConnectionRequired: !voice.localService,
      default: voice.default,
    }));

    return { voices };
  }

  async getLanguages(): Promise<{ languages: string[] }> {
    if (!('speechSynthesis' in window)) {
      return { languages: [] };
    }

    const webVoices = window.speechSynthesis.getVoices();
    const languages = Array.from(new Set(webVoices.map((voice) => voice.lang)));

    return { languages };
  }

  async isLanguageAvailable(options: IsLanguageAvailableOptions): Promise<{ isAvailable: boolean }> {
    if (!('speechSynthesis' in window)) {
      return { isAvailable: false };
    }

    const webVoices = window.speechSynthesis.getVoices();
    const isAvailable = webVoices.some((voice) => voice.lang === options.language);

    return { isAvailable };
  }

  async isVoiceAvailable(options: IsVoiceAvailableOptions): Promise<{ isAvailable: boolean }> {
    if (!('speechSynthesis' in window)) {
      return { isAvailable: false };
    }

    const webVoices = window.speechSynthesis.getVoices();
    const isAvailable = webVoices.some((voice) => voice.voiceURI === options.voiceId || voice.name === options.voiceId);

    return { isAvailable };
  }

  async initialize(): Promise<void> {
    // Pre-load voices on web
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }

  async activateAudioSession(_options: ActivateAudioSessionOptions): Promise<void> {
    // Not applicable on web
  }

  async deactivateAudioSession(): Promise<void> {
    // Not applicable on web
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }
}
