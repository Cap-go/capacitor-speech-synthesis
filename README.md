# @capgo/capacitor-speech-synthesis
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Missing a feature? We'll build the plugin for you 💪</a></h2>
</div>

Synthesize speech from text with full control over language, voice, pitch, rate, and volume.

## Why Speech Synthesis?

A free, open-source alternative providing complete text-to-speech capabilities:

- **Cross-platform** - Works on iOS, Android, and Web with consistent API
- **Full voice control** - Choose from system voices, adjust pitch, rate, and volume
- **Event-driven** - Listen to speech events (start, end, word boundaries, errors)
- **File export** - Save speech to audio files on iOS and Android
- **Modern APIs** - Uses AVSpeechSynthesizer (iOS), TextToSpeech (Android), and Web Speech API
- **Production-ready** - Complete TypeScript support with comprehensive documentation

Perfect for accessibility features, language learning apps, audiobook players, and any app needing text-to-speech.

## Install

```bash
npm install @capgo/capacitor-speech-synthesis
npx cap sync
```

## API

<docgen-index>

* [`speak(...)`](#speak)
* [`synthesizeToFile(...)`](#synthesizetofile)
* [`cancel()`](#cancel)
* [`pause()`](#pause)
* [`resume()`](#resume)
* [`isSpeaking()`](#isspeaking)
* [`isAvailable()`](#isavailable)
* [`getVoices()`](#getvoices)
* [`getLanguages()`](#getlanguages)
* [`isLanguageAvailable(...)`](#islanguageavailable)
* [`isVoiceAvailable(...)`](#isvoiceavailable)
* [`initialize()`](#initialize)
* [`activateAudioSession(...)`](#activateaudiosession)
* [`deactivateAudioSession()`](#deactivateaudiosession)
* [`getPluginVersion()`](#getpluginversion)
* [`addListener('start', ...)`](#addlistenerstart-)
* [`addListener('end', ...)`](#addlistenerend-)
* [`addListener('boundary', ...)`](#addlistenerboundary-)
* [`addListener('error', ...)`](#addlistenererror-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Speech Synthesis Plugin for synthesizing speech from text.

### speak(...)

```typescript
speak(options: SpeakOptions) => Promise<SpeakResult>
```

Speaks the given text with specified options.
The utterance is added to the speech queue.

| Param         | Type                                                  | Description                                            |
| ------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| **`options`** | <code><a href="#speakoptions">SpeakOptions</a></code> | - The speech options including text and voice settings |

**Returns:** <code>Promise&lt;<a href="#speakresult">SpeakResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### synthesizeToFile(...)

```typescript
synthesizeToFile(options: SpeakOptions) => Promise<SynthesizeToFileResult>
```

Synthesizes speech to an audio file (Android/iOS only).
Returns the file path where the audio was saved.

| Param         | Type                                                  | Description                                            |
| ------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| **`options`** | <code><a href="#speakoptions">SpeakOptions</a></code> | - The speech options including text and voice settings |

**Returns:** <code>Promise&lt;<a href="#synthesizetofileresult">SynthesizeToFileResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### cancel()

```typescript
cancel() => Promise<void>
```

Cancels all queued utterances and stops current speech.

**Since:** 1.0.0

--------------------


### pause()

```typescript
pause() => Promise<void>
```

Pauses speech immediately.

**Since:** 1.0.0

--------------------


### resume()

```typescript
resume() => Promise<void>
```

Resumes paused speech.

**Since:** 1.0.0

--------------------


### isSpeaking()

```typescript
isSpeaking() => Promise<{ isSpeaking: boolean; }>
```

Checks if speech synthesis is currently speaking.

**Returns:** <code>Promise&lt;{ isSpeaking: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### isAvailable()

```typescript
isAvailable() => Promise<{ isAvailable: boolean; }>
```

Checks if speech synthesis is available on the device.

**Returns:** <code>Promise&lt;{ isAvailable: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### getVoices()

```typescript
getVoices() => Promise<{ voices: VoiceInfo[]; }>
```

Gets all available voices.

**Returns:** <code>Promise&lt;{ voices: VoiceInfo[]; }&gt;</code>

**Since:** 1.0.0

--------------------


### getLanguages()

```typescript
getLanguages() => Promise<{ languages: string[]; }>
```

Gets all available languages.

**Returns:** <code>Promise&lt;{ languages: string[]; }&gt;</code>

**Since:** 1.0.0

--------------------


### isLanguageAvailable(...)

```typescript
isLanguageAvailable(options: IsLanguageAvailableOptions) => Promise<{ isAvailable: boolean; }>
```

Checks if a specific language is available.

| Param         | Type                                                                              | Description             |
| ------------- | --------------------------------------------------------------------------------- | ----------------------- |
| **`options`** | <code><a href="#islanguageavailableoptions">IsLanguageAvailableOptions</a></code> | - The language to check |

**Returns:** <code>Promise&lt;{ isAvailable: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### isVoiceAvailable(...)

```typescript
isVoiceAvailable(options: IsVoiceAvailableOptions) => Promise<{ isAvailable: boolean; }>
```

Checks if a specific voice is available.

| Param         | Type                                                                        | Description             |
| ------------- | --------------------------------------------------------------------------- | ----------------------- |
| **`options`** | <code><a href="#isvoiceavailableoptions">IsVoiceAvailableOptions</a></code> | - The voice ID to check |

**Returns:** <code>Promise&lt;{ isAvailable: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### initialize()

```typescript
initialize() => Promise<void>
```

Initializes the speech synthesis engine (iOS optimization).
This can reduce latency for the first speech request.

**Since:** 1.0.0

--------------------


### activateAudioSession(...)

```typescript
activateAudioSession(options: ActivateAudioSessionOptions) => Promise<void>
```

Activates the audio session with a specific category (iOS only).

| Param         | Type                                                                                | Description                  |
| ------------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| **`options`** | <code><a href="#activateaudiosessionoptions">ActivateAudioSessionOptions</a></code> | - The audio session category |

**Since:** 1.0.0

--------------------


### deactivateAudioSession()

```typescript
deactivateAudioSession() => Promise<void>
```

Deactivates the audio session (iOS only).

**Since:** 1.0.0

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Gets the native plugin version.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

**Since:** 1.0.0

--------------------


### addListener('start', ...)

```typescript
addListener(eventName: 'start', listenerFunc: (event: UtteranceEvent) => void) => Promise<PluginListenerHandle>
```

Listens for when an utterance starts speaking.

| Param              | Type                                                                          | Description                |
| ------------------ | ----------------------------------------------------------------------------- | -------------------------- |
| **`eventName`**    | <code>'start'</code>                                                          | - The event name ('start') |
| **`listenerFunc`** | <code>(event: <a href="#utteranceevent">UtteranceEvent</a>) =&gt; void</code> | - The callback function    |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 1.0.0

--------------------


### addListener('end', ...)

```typescript
addListener(eventName: 'end', listenerFunc: (event: UtteranceEvent) => void) => Promise<PluginListenerHandle>
```

Listens for when an utterance finishes speaking.

| Param              | Type                                                                          | Description              |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------ |
| **`eventName`**    | <code>'end'</code>                                                            | - The event name ('end') |
| **`listenerFunc`** | <code>(event: <a href="#utteranceevent">UtteranceEvent</a>) =&gt; void</code> | - The callback function  |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 1.0.0

--------------------


### addListener('boundary', ...)

```typescript
addListener(eventName: 'boundary', listenerFunc: (event: BoundaryEvent) => void) => Promise<PluginListenerHandle>
```

Listens for word boundaries during speech.

| Param              | Type                                                                        | Description                   |
| ------------------ | --------------------------------------------------------------------------- | ----------------------------- |
| **`eventName`**    | <code>'boundary'</code>                                                     | - The event name ('boundary') |
| **`listenerFunc`** | <code>(event: <a href="#boundaryevent">BoundaryEvent</a>) =&gt; void</code> | - The callback function       |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 1.0.0

--------------------


### addListener('error', ...)

```typescript
addListener(eventName: 'error', listenerFunc: (event: ErrorEvent) => void) => Promise<PluginListenerHandle>
```

Listens for synthesis errors.

| Param              | Type                                                                  | Description                |
| ------------------ | --------------------------------------------------------------------- | -------------------------- |
| **`eventName`**    | <code>'error'</code>                                                  | - The event name ('error') |
| **`listenerFunc`** | <code>(event: <a href="#errorevent">ErrorEvent</a>) =&gt; void</code> | - The callback function    |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 1.0.0

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all event listeners.

**Since:** 1.0.0

--------------------


### Interfaces


#### SpeakResult

Result from speaking text.

| Prop              | Type                | Description                           | Since |
| ----------------- | ------------------- | ------------------------------------- | ----- |
| **`utteranceId`** | <code>string</code> | Unique identifier for this utterance. | 1.0.0 |


#### SpeakOptions

Options for speaking text.

| Prop                | Type                          | Description                                                                     | Since |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------- | ----- |
| **`text`**          | <code>string</code>           | The text to speak.                                                              | 1.0.0 |
| **`language`**      | <code>string</code>           | The BCP-47 language tag (e.g., 'en-US', 'es-ES').                               | 1.0.0 |
| **`voiceId`**       | <code>string</code>           | The voice identifier to use.                                                    | 1.0.0 |
| **`pitch`**         | <code>number</code>           | The pitch of the voice (0.5 to 2.0, default: 1.0).                              | 1.0.0 |
| **`rate`**          | <code>number</code>           | The speaking rate (0.1 to 10.0, default: 1.0).                                  | 1.0.0 |
| **`volume`**        | <code>number</code>           | The volume (0.0 to 1.0, default: 1.0).                                          | 1.0.0 |
| **`queueStrategy`** | <code>'Add' \| 'Flush'</code> | The queue strategy: 'Add' to append or 'Flush' to replace queue. Default: 'Add' | 1.0.0 |


#### SynthesizeToFileResult

Result from synthesizing to file.

| Prop              | Type                | Description                           | Since |
| ----------------- | ------------------- | ------------------------------------- | ----- |
| **`filePath`**    | <code>string</code> | The file path where audio was saved.  | 1.0.0 |
| **`utteranceId`** | <code>string</code> | Unique identifier for this utterance. | 1.0.0 |


#### VoiceInfo

Information about a voice.

| Prop                              | Type                                         | Description                                       | Since |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------- | ----- |
| **`id`**                          | <code>string</code>                          | Unique voice identifier.                          | 1.0.0 |
| **`name`**                        | <code>string</code>                          | Display name of the voice.                        | 1.0.0 |
| **`language`**                    | <code>string</code>                          | BCP-47 language code.                             | 1.0.0 |
| **`gender`**                      | <code>'male' \| 'female' \| 'neutral'</code> | Gender of the voice (iOS only).                   | 1.0.0 |
| **`isNetworkConnectionRequired`** | <code>boolean</code>                         | Whether this voice requires a network connection. | 1.0.0 |
| **`default`**                     | <code>boolean</code>                         | Whether this is the default voice (Web only).     | 1.0.0 |


#### IsLanguageAvailableOptions

Options for checking language availability.

| Prop           | Type                | Description                        | Since |
| -------------- | ------------------- | ---------------------------------- | ----- |
| **`language`** | <code>string</code> | The BCP-47 language code to check. | 1.0.0 |


#### IsVoiceAvailableOptions

Options for checking voice availability.

| Prop          | Type                | Description            | Since |
| ------------- | ------------------- | ---------------------- | ----- |
| **`voiceId`** | <code>string</code> | The voice ID to check. | 1.0.0 |


#### ActivateAudioSessionOptions

Options for activating the audio session (iOS only).

| Prop           | Type                                 | Description                                                                                     | Since |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- | ----- |
| **`category`** | <code>'Ambient' \| 'Playback'</code> | The audio session category. - 'Ambient': Mixes with other audio - 'Playback': Stops other audio | 1.0.0 |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### UtteranceEvent

Event emitted when utterance starts or ends.

| Prop              | Type                | Description               | Since |
| ----------------- | ------------------- | ------------------------- | ----- |
| **`utteranceId`** | <code>string</code> | The utterance identifier. | 1.0.0 |


#### BoundaryEvent

Event emitted at word boundaries.

| Prop              | Type                | Description                               | Since |
| ----------------- | ------------------- | ----------------------------------------- | ----- |
| **`utteranceId`** | <code>string</code> | The utterance identifier.                 | 1.0.0 |
| **`charIndex`**   | <code>number</code> | The character index in the text.          | 1.0.0 |
| **`charLength`**  | <code>number</code> | The character length of the current word. | 1.0.0 |


#### ErrorEvent

Event emitted on synthesis error.

| Prop              | Type                | Description               | Since |
| ----------------- | ------------------- | ------------------------- | ----- |
| **`utteranceId`** | <code>string</code> | The utterance identifier. | 1.0.0 |
| **`error`**       | <code>string</code> | The error message.        | 1.0.0 |

</docgen-api>
