import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Speech Synthesis Plugin for synthesizing speech from text.
 *
 * @since 1.0.0
 */
export interface SpeechSynthesisPlugin {
  /**
   * Speaks the given text with specified options.
   * The utterance is added to the speech queue.
   *
   * @param options - The speech options including text and voice settings
   * @returns Promise resolving with the utterance ID
   * @since 1.0.0
   * @example
   * ```typescript
   * const result = await SpeechSynthesis.speak({
   *   text: 'Hello, world!',
   *   language: 'en-US',
   *   rate: 1.0,
   *   pitch: 1.0,
   *   volume: 1.0,
   *   queueStrategy: 'Add'
   * });
   * console.log('Utterance ID:', result.utteranceId);
   * ```
   */
  speak(options: SpeakOptions): Promise<SpeakResult>;

  /**
   * Synthesizes speech to an audio file (Android/iOS only).
   * Returns the file path where the audio was saved.
   *
   * @param options - The speech options including text and voice settings
   * @returns Promise resolving with the file path and utterance ID
   * @since 1.0.0
   * @example
   * ```typescript
   * const result = await SpeechSynthesis.synthesizeToFile({
   *   text: 'Hello, world!',
   *   language: 'en-US'
   * });
   * console.log('Audio file saved at:', result.filePath);
   * ```
   */
  synthesizeToFile(options: SpeakOptions): Promise<SynthesizeToFileResult>;

  /**
   * Cancels all queued utterances and stops current speech.
   *
   * @returns Promise that resolves when speech is cancelled
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.cancel();
   * ```
   */
  cancel(): Promise<void>;

  /**
   * Pauses speech immediately.
   *
   * @returns Promise that resolves when speech is paused
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.pause();
   * ```
   */
  pause(): Promise<void>;

  /**
   * Resumes paused speech.
   *
   * @returns Promise that resolves when speech is resumed
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.resume();
   * ```
   */
  resume(): Promise<void>;

  /**
   * Checks if speech synthesis is currently speaking.
   *
   * @returns Promise resolving with the speaking state
   * @since 1.0.0
   * @example
   * ```typescript
   * const { isSpeaking } = await SpeechSynthesis.isSpeaking();
   * console.log('Is speaking:', isSpeaking);
   * ```
   */
  isSpeaking(): Promise<{ isSpeaking: boolean }>;

  /**
   * Checks if speech synthesis is available on the device.
   *
   * @returns Promise resolving with the availability status
   * @since 1.0.0
   * @example
   * ```typescript
   * const { isAvailable } = await SpeechSynthesis.isAvailable();
   * if (isAvailable) {
   *   console.log('Speech synthesis is available');
   * }
   * ```
   */
  isAvailable(): Promise<{ isAvailable: boolean }>;

  /**
   * Gets all available voices.
   *
   * @returns Promise resolving with the list of available voices
   * @since 1.0.0
   * @example
   * ```typescript
   * const { voices } = await SpeechSynthesis.getVoices();
   * voices.forEach(voice => {
   *   console.log(`${voice.name} (${voice.language})`);
   * });
   * ```
   */
  getVoices(): Promise<{ voices: VoiceInfo[] }>;

  /**
   * Gets all available languages.
   *
   * @returns Promise resolving with the list of available language codes
   * @since 1.0.0
   * @example
   * ```typescript
   * const { languages } = await SpeechSynthesis.getLanguages();
   * console.log('Available languages:', languages);
   * ```
   */
  getLanguages(): Promise<{ languages: string[] }>;

  /**
   * Checks if a specific language is available.
   *
   * @param options - The language to check
   * @returns Promise resolving with the availability status
   * @since 1.0.0
   * @example
   * ```typescript
   * const { isAvailable } = await SpeechSynthesis.isLanguageAvailable({
   *   language: 'es-ES'
   * });
   * console.log('Spanish available:', isAvailable);
   * ```
   */
  isLanguageAvailable(options: IsLanguageAvailableOptions): Promise<{ isAvailable: boolean }>;

  /**
   * Checks if a specific voice is available.
   *
   * @param options - The voice ID to check
   * @returns Promise resolving with the availability status
   * @since 1.0.0
   * @example
   * ```typescript
   * const { isAvailable } = await SpeechSynthesis.isVoiceAvailable({
   *   voiceId: 'com.apple.ttsbundle.Samantha-compact'
   * });
   * console.log('Voice available:', isAvailable);
   * ```
   */
  isVoiceAvailable(options: IsVoiceAvailableOptions): Promise<{ isAvailable: boolean }>;

  /**
   * Initializes the speech synthesis engine (iOS optimization).
   * This can reduce latency for the first speech request.
   *
   * @returns Promise that resolves when initialized
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.initialize();
   * ```
   */
  initialize(): Promise<void>;

  /**
   * Activates the audio session with a specific category (iOS only).
   *
   * @param options - The audio session category
   * @returns Promise that resolves when activated
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.activateAudioSession({
   *   category: 'Playback'
   * });
   * ```
   */
  activateAudioSession(options: ActivateAudioSessionOptions): Promise<void>;

  /**
   * Deactivates the audio session (iOS only).
   *
   * @returns Promise that resolves when deactivated
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.deactivateAudioSession();
   * ```
   */
  deactivateAudioSession(): Promise<void>;

  /**
   * Gets the native plugin version.
   *
   * @returns Promise resolving with the plugin version
   * @since 1.0.0
   * @example
   * ```typescript
   * const { version } = await SpeechSynthesis.getPluginVersion();
   * console.log('Plugin version:', version);
   * ```
   */
  getPluginVersion(): Promise<{ version: string }>;

  /**
   * Listens for when an utterance starts speaking.
   *
   * @param eventName - The event name ('start')
   * @param listenerFunc - The callback function
   * @returns A handle to remove the listener
   * @since 1.0.0
   * @example
   * ```typescript
   * const listener = await SpeechSynthesis.addListener('start', (event) => {
   *   console.log('Started speaking:', event.utteranceId);
   * });
   * // Later: listener.remove();
   * ```
   */
  addListener(eventName: 'start', listenerFunc: (event: UtteranceEvent) => void): Promise<PluginListenerHandle>;

  /**
   * Listens for when an utterance finishes speaking.
   *
   * @param eventName - The event name ('end')
   * @param listenerFunc - The callback function
   * @returns A handle to remove the listener
   * @since 1.0.0
   * @example
   * ```typescript
   * const listener = await SpeechSynthesis.addListener('end', (event) => {
   *   console.log('Finished speaking:', event.utteranceId);
   * });
   * ```
   */
  addListener(eventName: 'end', listenerFunc: (event: UtteranceEvent) => void): Promise<PluginListenerHandle>;

  /**
   * Listens for word boundaries during speech.
   *
   * @param eventName - The event name ('boundary')
   * @param listenerFunc - The callback function
   * @returns A handle to remove the listener
   * @since 1.0.0
   * @example
   * ```typescript
   * const listener = await SpeechSynthesis.addListener('boundary', (event) => {
   *   console.log('Word boundary at:', event.charIndex);
   * });
   * ```
   */
  addListener(eventName: 'boundary', listenerFunc: (event: BoundaryEvent) => void): Promise<PluginListenerHandle>;

  /**
   * Listens for synthesis errors.
   *
   * @param eventName - The event name ('error')
   * @param listenerFunc - The callback function
   * @returns A handle to remove the listener
   * @since 1.0.0
   * @example
   * ```typescript
   * const listener = await SpeechSynthesis.addListener('error', (event) => {
   *   console.error('Speech error:', event.error);
   * });
   * ```
   */
  addListener(eventName: 'error', listenerFunc: (event: ErrorEvent) => void): Promise<PluginListenerHandle>;

  /**
   * Removes all event listeners.
   *
   * @returns Promise that resolves when listeners are removed
   * @since 1.0.0
   * @example
   * ```typescript
   * await SpeechSynthesis.removeAllListeners();
   * ```
   */
  removeAllListeners(): Promise<void>;
}

/**
 * Options for speaking text.
 *
 * @since 1.0.0
 */
export interface SpeakOptions {
  /**
   * The text to speak.
   *
   * @since 1.0.0
   */
  text: string;

  /**
   * The BCP-47 language tag (e.g., 'en-US', 'es-ES').
   *
   * @since 1.0.0
   */
  language?: string;

  /**
   * The voice identifier to use.
   *
   * @since 1.0.0
   */
  voiceId?: string;

  /**
   * The pitch of the voice (0.5 to 2.0, default: 1.0).
   *
   * @since 1.0.0
   */
  pitch?: number;

  /**
   * The speaking rate (0.1 to 10.0, default: 1.0).
   *
   * @since 1.0.0
   */
  rate?: number;

  /**
   * The volume (0.0 to 1.0, default: 1.0).
   *
   * @since 1.0.0
   */
  volume?: number;

  /**
   * The queue strategy: 'Add' to append or 'Flush' to replace queue.
   * Default: 'Add'
   *
   * @since 1.0.0
   */
  queueStrategy?: 'Add' | 'Flush';
}

/**
 * Result from speaking text.
 *
 * @since 1.0.0
 */
export interface SpeakResult {
  /**
   * Unique identifier for this utterance.
   *
   * @since 1.0.0
   */
  utteranceId: string;
}

/**
 * Result from synthesizing to file.
 *
 * @since 1.0.0
 */
export interface SynthesizeToFileResult {
  /**
   * The file path where audio was saved.
   *
   * @since 1.0.0
   */
  filePath: string;

  /**
   * Unique identifier for this utterance.
   *
   * @since 1.0.0
   */
  utteranceId: string;
}

/**
 * Information about a voice.
 *
 * @since 1.0.0
 */
export interface VoiceInfo {
  /**
   * Unique voice identifier.
   *
   * @since 1.0.0
   */
  id: string;

  /**
   * Display name of the voice.
   *
   * @since 1.0.0
   */
  name: string;

  /**
   * BCP-47 language code.
   *
   * @since 1.0.0
   */
  language: string;

  /**
   * Gender of the voice (iOS only).
   *
   * @since 1.0.0
   */
  gender?: 'male' | 'female' | 'neutral';

  /**
   * Whether this voice requires a network connection.
   *
   * @since 1.0.0
   */
  isNetworkConnectionRequired?: boolean;

  /**
   * Whether this is the default voice (Web only).
   *
   * @since 1.0.0
   */
  default?: boolean;
}

/**
 * Options for checking language availability.
 *
 * @since 1.0.0
 */
export interface IsLanguageAvailableOptions {
  /**
   * The BCP-47 language code to check.
   *
   * @since 1.0.0
   */
  language: string;
}

/**
 * Options for checking voice availability.
 *
 * @since 1.0.0
 */
export interface IsVoiceAvailableOptions {
  /**
   * The voice ID to check.
   *
   * @since 1.0.0
   */
  voiceId: string;
}

/**
 * Options for activating the audio session (iOS only).
 *
 * @since 1.0.0
 */
export interface ActivateAudioSessionOptions {
  /**
   * The audio session category.
   * - 'Ambient': Mixes with other audio
   * - 'Playback': Stops other audio
   *
   * @since 1.0.0
   */
  category: 'Ambient' | 'Playback';
}

/**
 * Event emitted when utterance starts or ends.
 *
 * @since 1.0.0
 */
export interface UtteranceEvent {
  /**
   * The utterance identifier.
   *
   * @since 1.0.0
   */
  utteranceId: string;
}

/**
 * Event emitted at word boundaries.
 *
 * @since 1.0.0
 */
export interface BoundaryEvent {
  /**
   * The utterance identifier.
   *
   * @since 1.0.0
   */
  utteranceId: string;

  /**
   * The character index in the text.
   *
   * @since 1.0.0
   */
  charIndex: number;

  /**
   * The character length of the current word.
   *
   * @since 1.0.0
   */
  charLength?: number;
}

/**
 * Event emitted on synthesis error.
 *
 * @since 1.0.0
 */
export interface ErrorEvent {
  /**
   * The utterance identifier.
   *
   * @since 1.0.0
   */
  utteranceId: string;

  /**
   * The error message.
   *
   * @since 1.0.0
   */
  error: string;
}
