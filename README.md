# Learn Music

Learn Music is a browser-based teaching environment for learning **music composition and music production together**.

The interface grows with the learner: early lessons expose only a few musically meaningful controls, while later lessons can develop into a compact DAW-like workspace.

## Current prototype

Two interactive lessons are implemented.

### 1. Pulse & groove

- 16-step mouse-driven drum sequencer;
- browser audio using Tone.js/Web Audio;
- play/stop transport and tempo control;
- kick, snare and hi-hat roles;
- live playhead;
- automatic lesson checks.

### 2. Rhythm & variation

- A/B pattern comparison;
- original pattern preserved as a listen-only reference;
- editable B variation;
- constraints that teach recognisable variation rather than arbitrary change;
- live switching between A and B during playback.

Course state now persists locally. Completed lessons, both patterns, the current lesson, active pattern and tempo survive reloads through Zustand's persistence layer.

## Architecture

- React + TypeScript + Vite
- Tone.js / Web Audio
- Zustand + persistence
- Zod lesson schemas
- Vitest lesson-logic tests
- GitHub Actions + GitHub Pages

Lesson content and evaluators live outside the main UI. The music model remains independent of Tone.js, and the audio engine receives the currently active pattern rather than owning project data.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm test
npm run build
```

## Deployment

Pushes to `main` run `.github/workflows/pages.yml`, validate the lesson logic, build the Vite application, and deploy `dist/` to GitHub Pages.

The production Vite base is configured for:

```text
/learn-music/
```
