# Example App for `@capgo/capacitor-speech-synthesis`

This Vite project links directly to the local plugin source so you can exercise the native APIs while developing.

## Actions in this playground

- **Speak text** – Synthesizes and speaks the provided text.
- **Get available voices** – Retrieves all available TTS voices on the device.
- **Get supported languages** – Retrieves all supported language codes.
- **Pause speech** – Pauses ongoing speech synthesis.
- **Resume speech** – Resumes paused speech synthesis.
- **Stop speech** – Stops ongoing speech synthesis.
- **Check if speaking** – Checks if speech synthesis is currently active.
- **Get max speech length** – Gets the maximum text length supported (Android only).
- **Synthesize to file** – Synthesizes text and saves it to an audio file.
- **Set audio session category (iOS)** – Sets the audio session category for playback behavior.

## Getting started

```bash
npm install
npm start
```

Add native shells with `npx cap add ios` or `npx cap add android` from this folder to try behaviour on device or simulator.
