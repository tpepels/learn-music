# PLAY / LAB — Learn Music

PLAY / LAB is a browser-based environment for learning **music composition and music production together by making music**.

The application deliberately grows toward the visual language of real music software and hardware without exposing a beginner to a full DAW all at once.

## Design direction

The interface is now built around a **friendly music workstation** rather than a course dashboard.

- the instrument or production tool is always the main surface;
- transport, grid, pattern, MIDI, chord-track, synth, and arrangement terminology appears where students will later see it in real DAWs and hardware;
- controls behave like pads, keys, clips, and instrument parameters rather than form inputs;
- different musical roles have stable visual identities and illuminated playback states;
- the studio coach sits beside the instrument instead of replacing it;
- completed experiments give immediate positive feedback while remaining editable;
- later lessons progressively expose real DAW routing concepts such as channels, faders, pan, EQ, sends, returns, buses, and the master output.

The visual language uses bright studio colours, tactile button states, playhead lighting, track identity, and small inline diagrams. The diagrams deliberately resemble production concepts such as a step sequencer, piano roll, chord track, subtractive-synth signal flow, and DAW arrangement view.

## Every exercise answers four practical questions

For all 28 current exercises the app now explicitly explains:

1. **WHY** — why music makers use the technique;
2. **WHEN** — where it usually appears in the writing/production process;
3. **WHAT** — the real tools, controls, or software views used to do it;
4. **WHAT IT LOOKS LIKE** — how the same idea appears on hardware or in a DAW.

A regression test requires that every implemented exercise has this production context and a visual.

## Current interactive curriculum

There are currently **7 lessons and 28 guided exercises**.

### 1. Pulse & groove
A. Four-on-the-floor  
B. Backbeat  
C. Eighth-note subdivision  
D. Syncopation

Workspace: drum machine / 16-step sequencer.

### 2. Repetition & variation
A. Close variation  
B. Drum fill  
C. Anticipation  
D. Turnaround

Workspace: A/B pattern lab.

### 3. Keys & melody
A. Map C major  
B. Compose inside the key  
C. Use scale degrees 1, 3, and 5  
D. Build a motif and phrase

Workspaces: MIDI keyboard and piano roll.

### 4. Chords & progressions
A. Build the tonic triad  
B. Add IV and V  
C. Hear a V-I cadence  
D. Build I-V-vi-IV

Workspace: chord track with Roman numerals.

### 5. Sound & synthesis
A. Compare oscillator waveforms  
B. Shape brightness with a low-pass filter  
C. Shape attack and release  
D. Design a warm pad

Workspace: subtractive synthesizer with visible OSC → FILTER → AMP ENV signal flow.

### 6. Arrangement & form
A. Shape texture with layer density  
B. Create A/B contrast  
C. Build toward a climax  
D. Release after the climax

Workspace: eight-bar DAW-style arrangement view with drums, bass, chords, and melody.

### 7. Mixing & space
A. Balance with faders  
B. Place sounds in stereo  
C. Clear unnecessary low end  
D. Create depth with sends

Workspace: a real four-channel mixer. Drums, bass, chords, and melody are routed through channel faders, pan controls, low-cut filters, and shared reverb/delay send buses. The controls manipulate the actual Tone.js signal graph, so students hear the result of every mix decision.

## Progression

Each lesson contains four experiments. Finishing D completes the lesson and opens A of the next lesson immediately. Progression has dedicated regression tests across the complete implemented course.

## Architecture

- React + TypeScript + Vite
- Tone.js / Web Audio
- Tonal
- Zustand + local persistence
- Zod content schemas
- inline SVG concept diagrams
- Vitest curriculum, progression, and production-context coverage
- GitHub Actions + GitHub Pages

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

Feature branches run CI without publishing. `main` deploys to GitHub Pages after validation.

Production base:

```text
/learn-music/
```
