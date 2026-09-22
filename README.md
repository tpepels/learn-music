# Learn Music

Learn Music is a browser-based teaching environment for learning **music composition and music production together**.

The interface grows with the learner. Concepts are introduced by name, explained in plain language, connected to listening cues, and then explored through several hands-on variations before the next lesson unlocks.

## Current interactive curriculum

There are currently **6 lessons and 24 guided exercises**.

### 1. Pulse & groove

A. Four-on-the-floor  
B. Backbeat  
C. Eighth-note subdivision  
D. Syncopation

Students learn beat, bar, 4/4, accents, subdivision, offbeats, and syncopation while building one groove progressively.

### 2. Repetition & variation

A. Close variation  
B. Drum fill  
C. Anticipation  
D. Turnaround

Pattern A remains the reference while Pattern B is edited and compared in real time.

### 3. Keys & melody

A. Map C major on a chromatic keyboard  
B. Compose a melody inside the key  
C. Use scale degrees 1, 3, and 5  
D. Build a motif, repeat it, and answer it as a phrase

The piano workspace supports direct note auditioning and a 16-step piano-roll-style melody grid.

### 4. Chords & progressions

A. Build the tonic triad  
B. Add IV and V  
C. Hear a V-I cadence in I-IV-V-I  
D. Build I-V-vi-IV

Students work with four chord slots and a diatonic chord palette labelled with Roman numerals.

### 5. Sound & synthesis

A. Compare oscillator waveforms  
B. Shape brightness with a low-pass filter  
C. Shape attack and release  
D. Design a warm pad

The synthesizer workspace teaches oscillator, waveform, timbre, harmonics, spectrum, filtering, envelopes, ADSR, subtractive synthesis, transients, and pads.

### 6. Arrangement & form

A. Shape texture with layer density  
B. Create A/B contrast  
C. Build toward a climax  
D. Release after the climax

The arrangement workspace combines the student's existing drums, bass, harmony, and melody across eight bars. It plays the arrangement while showing its layer-density curve.

## Progression

Each lesson contains four exercises. The next exercise unlocks after the current one is completed. Completing exercise D now **completes the lesson and moves directly into exercise A of the next lesson in the same action**.

Lesson-to-lesson progression is represented by a shared progression model and regression-tested across the complete implemented course.

## Teaching structure

Every exercise contains:

- a clear statement of what the student is learning;
- an explanation of the underlying musical idea;
- named terminology when it is first introduced;
- a description of how to recognise the concept by ear;
- a hands-on task;
- automatic completion checks;
- a Continue action that unlocks the next exercise or lesson.

Progress, patterns, key selections, melodies, chord progressions, synth settings, and arrangements are persisted locally in the browser.

## Architecture

- React + TypeScript + Vite
- Tone.js / Web Audio for sequencing, synthesis, and playback
- Tonal for music-theory data and analysis
- Zustand + local persistence
- Zod lesson/content schemas
- Vitest curriculum and progression tests
- GitHub Actions + GitHub Pages

The music model remains separate from Tone.js. Lesson content and evaluators remain separate from UI rendering.

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

Feature branches run `.github/workflows/ci.yml` without publishing. Pushes to `main` run the Pages workflow and deploy the Vite build.

The production Vite base is:

```text
/learn-music/
```
