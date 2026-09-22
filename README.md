# Learn Music

Learn Music is a browser-based teaching environment for learning **music composition and music production together**.

The interface is intended to grow with the learner: early lessons expose only a few musically meaningful controls, while later lessons can develop into a compact DAW-like workspace.

## Current prototype

The first implemented lesson is **Pulse & groove**:

- 16-step mouse-driven drum sequencer;
- browser audio using Tone.js/Web Audio;
- play/stop transport and tempo control;
- kick, snare and hi-hat roles;
- live playhead;
- automatic lesson checks;
- course/lesson/teacher workspace layout.

The exercise starts with kick and hi-hat material. The learner adds a backbeat and immediately hears how pulse, subdivision and production choices interact.

## Stack

- React + TypeScript + Vite
- Tone.js / Web Audio
- Zustand
- Zod
- GitHub Actions + GitHub Pages

The music model and teaching layer are kept separate from the audio implementation so the editor can grow without making Tone.js the application data model.

## Development

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Validation

```bash
npm run typecheck
npm run build
```

## Deployment

Pushes to `main` run `.github/workflows/pages.yml`, build the Vite application, and deploy `dist/` to GitHub Pages.

The production Vite base is configured for:

```text
/learn-music/
```

Initial prototype status: active development.
