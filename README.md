# PLAY / LAB — Learn Music

PLAY / LAB is a browser-based environment for learning **music composition and music production together by making music**.

The product now has three connected modes:

- **Learn** — guided, progressive lessons with checks and explanations;
- **Create** — open-ended briefs without a single correct answer;
- **Studio** — the same real instruments and production tools collected into a reusable workstation.

All three modes operate on the same persistent local project.

## Current interactive curriculum

There are currently **12 lessons and 48 guided exercises**.

1. **Pulse & groove** — four-on-the-floor, backbeat, eighths, syncopation
2. **Repetition & variation** — related variation, fill, anticipation, turnaround
3. **Keys & melody** — C major, in-key writing, scale degrees, motif and phrase
4. **Chords & progressions** — tonic triad, I/IV/V, cadence, I–V–vi–IV
5. **Sound & synthesis** — waveforms, filtering, envelopes, subtractive synthesis
6. **Arrangement & form** — density, A/B contrast, climax, release
7. **Mixing & space** — faders, pan, low-cut EQ, send/return reverb and delay
8. **Automation & dynamics** — volume rides, filter sweeps, compression, transients
9. **Creative effects & transitions** — reverb depth, rhythmic delay, chorus, transition design
10. **Finish the track** — composition audit, arrangement audit, production audit, project export
11. **Voicing & voice leading** — root position, first inversion, second inversion, smooth voice motion
12. **Bass lines** — roots, chord tones, approach notes, complete four-bar bass phrase

Every exercise explains:

- **WHY** music makers use the technique;
- **WHEN** it appears in the writing/production process;
- **WHAT** real tools are used;
- **WHAT IT LOOKS LIKE** in DAWs or hardware;
- how to recognize the result by ear;
- the terminology musicians and producers use.

Coverage is regression-tested for every implemented exercise.

## Learn

Learn progressively reveals controls instead of presenting a full DAW immediately.

Current workspaces include:

- drum machine / 16-step sequencer
- A/B pattern lab
- MIDI keyboard
- piano roll
- chord track
- voicing / inversion lab
- four-bar bass piano roll
- subtractive synthesizer
- arrangement view
- four-channel mixer
- automation lanes
- drum-bus compressor
- creative FX rack
- final project audit/export

Completing exercise D moves directly into exercise A of the next lesson.

## Create

Create provides open-ended prompts such as:

- make one groove feel like two sections;
- write an eight-bar miniature;
- create one unmistakable energy peak;
- improve a production without rewriting the notes.

These prompts intentionally do not use automatic “correct composition” scoring. They hand the learner into the same Studio project.

## Studio

Studio collects the learned tools into a single workstation. Modules unlock as their corresponding lessons are completed.

Current modules:

- Groove
- Piano roll
- Chords
- Voicing
- Bass
- Synth
- Arrangement
- Mixer
- Automation
- FX
- Finish

Edits made in Learn, Create, or Studio are edits to the same project.

## Audio architecture

Tone.js / Web Audio drives real playback and processing.

Current signal paths include:

- core playback is initialized independently from optional FX, so an effect failure cannot disable Play;
- Studio transport follows the currently open Studio module rather than being hard-wired to Arrangement;
- drum voices → **drum-bus compressor** → mixer channel
- melody → **chorus insert** → mixer channel
- chords → **automated low-pass filter** → mixer channel
- mixer channels → master
- post-fader sends → shared **reverb** and **delay** returns

Automation is real playback automation:

- melody channel volume ramps between bar breakpoints;
- chord low-pass cutoff ramps between bar breakpoints.

Mixer and effects controls manipulate the real audio graph rather than a decorative UI.

## Project persistence

Projects persist locally through Zustand/local storage.

The final workspace can:

- **export** a versioned `play-lab-project` JSON file;
- **import** that file later;
- validate imports with Zod before replacing current project state.

The project file contains:

- tempo
- patterns
- melody
- chord progression
- synth settings
- arrangement
- mixer
- automation
- dynamics
- effects
- chord inversions / voicings
- programmed bass line

The project file is the editable session. It is intentionally distinguished from a future standalone WAV/audio render.

## Install / offline

The GitHub Pages build is now a small PWA:

- web-app manifest
- standalone app metadata
- installable icon
- production service-worker registration
- same-origin runtime asset caching
- cached navigation fallback when offline

All current instruments are synthesized in the browser, so the current course does not require remote sample downloads.

## Interface

The design follows a “friendly workstation” approach:

- the instrument or production tool is the main surface;
- the right rail has one purpose: task, checks, continue/reset;
- WHY / WHEN / WHAT / terminology lives in a larger collapsible centre panel;
- typography has a readability floor rather than 7–9 px instructional copy;
- controls look and behave like pads, keys, clips, faders, mixer sends, automation lanes, and synth parameters;
- real DAW labels such as GRID, MIDI CLIP, CHORD TRACK, OSC, FILTER, AMP ENV, RETURN, MASTER, and AUTOMATION appear where learners will later encounter them.

## Architecture

- React + TypeScript + Vite
- Tone.js / Web Audio
- Tonal
- Zustand + persistent local project state
- Zod content and project-file schemas
- inline SVG concept diagrams
- Vitest curriculum, progression, production-context, and project-file tests
- GitHub Actions
- GitHub Pages
- PWA manifest + service worker

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

Feature branches validate without publishing. `main` deploys to GitHub Pages only after the production workflow passes.

Production base:

```text
/learn-music/
```
