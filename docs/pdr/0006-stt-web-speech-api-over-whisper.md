# PDR-0006: STT Provider — Web Speech API over Whisper

- **Status**: Accepted
- **Date**: 2026-04-07
- **Phase**: 2

## Context

Speaking sessions were text-only in Phase 1. Phase 2 required voice input to make the speaking simulator realistic. Two STT approaches were evaluated:

**Option A — OpenAI Whisper API (`POST /api/stt`)**: Record audio in the browser (MediaRecorder, WebM/opus), send the blob to a server route, transcribe with `whisper-1`, return `{ text: string }`.

**Option B — Web Speech API (browser-native)**: Chrome exposes `window.SpeechRecognition` / `window.webkitSpeechRecognition`. Transcription happens client-side via Google's servers. No audio blob is ever sent to our backend.

Key comparison:

| Factor | Whisper | Web Speech API |
|--------|---------|----------------|
| Setup | OpenAI API key + `/api/stt` route | Zero — native in Chrome |
| Cost | ~$0.006 / minute | Free |
| Latency | 1–3 s after recording stops | Real-time (streams interim results) |
| Filler capture | More reliable for accented speech | May silently clean up fillers |
| Offline | No | No |
| Dev machine constraint | Extra RAM for blob upload handling | None |

The user's environment is MacBook M1 + Google Chrome, where `webkitSpeechRecognition` is natively available and well-supported.

## Decision

Use **Option B (Web Speech API)** for Phase 2.

The `useSpeechInput` hook (`src/lib/ielts/timer/use-speech-input.ts`) wraps the API:
- `continuous: true` + `interimResults: true` streams interim text into the input field as the user speaks.
- Final results (`isFinal: true`) are appended to the chat input and cleared from the interim buffer.
- `supported` flag is derived on mount; if `false`, the mic button is hidden and the user falls back to text input silently.

The `MicInput` component (`src/components/mic-input.tsx`) replaces the plain `<input>` + `<button>` form in all speaking routes. It shows a red pulsing mic button while recording and displays interim text below the input.

## Consequences

- No `/api/stt` route was created. If Whisper is needed later (e.g., for better filler detection accuracy on non-native accents), it can be added as an opt-in alternative without changing the hook interface.
- Filler detection (`filler-detector.ts`) runs on the transcribed text that arrives from the browser. Chrome's STT may suppress some fillers (`um`, `uh`) for clean-sounding speech. This is an accepted limitation; filler counts shown at session end are a guide, not a precise count.
- The Web Speech API requires an active internet connection (Google's STT servers). This is acceptable — the app already requires network access for Ollama and the DB.
- Safari and Firefox do not support the Web Speech API. This is a known constraint and acceptable given the Chrome-only user environment. If cross-browser support is needed, Whisper becomes the fallback.
