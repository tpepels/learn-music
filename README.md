# PLAY / LAB — Learn Music

PLAY / LAB is a browser-based environment for learning **music composition and music production together by making music**.

The product now has three connected modes:

- **Learn** — guided, progressive lessons with checks and explanations;
- **Create** — open-ended briefs without a single correct answer;
- **Studio** — the same real instruments and production tools collected into a reusable workstation.

All three modes operate on the same persistent local project.

Current curriculum release: **v2.0.0**.

## Current interactive curriculum

There are currently **28 lessons and 112 guided exercises**.

1. **Pulse & groove** — four-on-the-floor, backbeat, eighths, syncopation
2. **Repetition & variation** — related variation, fill, anticipation, turnaround
3. **Keys & melody** — C major, in-key writing, scale degrees, motif and phrase
4. **Chords & progressions** — write chord tones directly into a four-bar piano roll, then turn I/IV/V into a rhythmic accompaniment
5. **Sound & synthesis** — waveforms and filtering, then pluck-vs-pad envelope roles on the learner's melody
6. **Arrangement & form** — density, A/B contrast, climax, release
7. **Mixing & space** — faders, pan, low-cut EQ, send/return reverb and delay
8. **Automation & dynamics** — volume rides, filter sweeps, compression, transients
9. **Creative effects & transitions** — reverb depth, rhythmic delay, chorus, transition design
10. **Finish the track** — composition audit, arrangement audit, production audit, project export
11. **Voicing & voice leading** — root position, first inversion, second inversion, smooth voice motion
12. **Bass lines** — roots, chord tones, approach notes, complete four-bar bass phrase
13. **Velocity, accents & swing** — MIDI velocity, accent patterns, ghost notes, swung timing
14. **Motif development** — repetition, transposition, fragmentation, call and response
15. **Melody over harmony** — chord tones, passing tones, neighbour notes, tension/resolution
16. **Harmonic function** — rewrite real harmony MIDI for tonic/predominant/dominant, ii–V–I, deceptive resolution, and V/V
17. **Phrase & form** — build audible 16-bar A/A′/B relationships with real layer changes, returns, binary, ternary, and AABA
18. **Texture & orchestration** — register, open voicing, octave doubling, density contrast
19. **EQ & spectral balance** — low-cut cleanup, search sweeps, corrective cuts, complementary EQ
20. **Saturation & distortion** — harmonic weight, parallel drum crunch, subtle colour, selective processing
21. **Sidechain ducking** — kick-to-bass ducking, pumping, transparent release timing, arrangement context
22. **Stereo width & mono** — pan, mid/side width, centred low end, mono translation
23. **Reference mixing** — snapshots, A/B comparison, level matching, quiet and mono checks
24. **Relative minor** — A natural minor, shared C-major pitch collection, tonic gravity, relative-key pivot
25. **Harmonic minor & leading tone** — raised 7th, G♯→A resolution, augmented second, cadential melody
26. **Minor-key progressions** — write i/iv, V7–i, Andalusian, and deceptive cadences directly into the harmony piano roll
27. **Seventh chords** — add and remove the seventh as actual MIDI, then write ii7–V7–Imaj7 and I–vi–ii–V accompaniments
28. **Borrowed chords & modal mixture** — alter A→A♭ and write B♭/Fm directly into four-bar accompaniments

Every exercise explains:

- **WHY** music makers use the technique;
- **WHEN** it appears in the writing/production process;
- **WHAT** real tools are used;
- **WHAT IT LOOKS LIKE** in DAWs or hardware;
- how to recognize the result by ear;
- the terminology musicians and producers use.

Coverage is regression-tested for every implemented exercise. Newly opened incomplete exercises also require a fresh learner interaction before they can be completed, so inherited state from exercise C cannot silently pre-complete exercise D.

The v2.0 curriculum audit also distinguishes **final state** from **learning process** where that matters. A production exercise can record local per-exercise evidence such as the parameter range the learner actually explored, while harmony lessons can require real MIDI edits rather than chord labels alone. This lets exercises require actions such as hearing an exaggerated/bad setting and backing away from it instead of accepting a memorized target value.

## Learn

Learn progressively reveals controls instead of presenting a full DAW immediately.

Current workspaces include:

- drum machine / 16-step sequencer
- A/B pattern lab
- MIDI keyboard
- piano roll
- chord track
- four-bar polyphonic harmony piano roll with chord-tone guidance, groove/melody context, and learner-written rhythm
- voicing / inversion lab
- four-bar bass piano roll
- velocity lane + swing/groove editor
- motif-development piano roll
- melody-over-harmony overlay
- harmonic-function harmony piano roll
- A-natural-minor / A-harmonic-minor piano roll with scale-degree map
- minor-key harmony piano roll with a real E7/G♯ dominant
- seventh-chord harmony piano roll with editable fourth chord tones
- modal-mixture harmony piano roll with editable A♭ and B♭
- sixteen-bar macro-form player with per-section layer choices
- texture/orchestration register controls
- parametric EQ display and controls
- saturation / parallel-distortion processor
- kick-to-bass sidechain ducking
- stereo field with pan, width, and mono audition
- level-matched reference A/B workspace
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
- improve a production without rewriting the notes;
- make the same note collection resolve first to C and then to A;
- reharmonize a C-major idea with a seventh chord and a borrowed chord.

These prompts intentionally do not use automatic “correct composition” scoring. They hand the learner into the same Studio project.

## Studio

Studio collects the learned tools into a single workstation. Modules unlock as their corresponding lessons are completed.

Current modules:

- Groove
- Feel
- Piano roll
- Motif
- Melody + chords
- Chords
- Function
- A minor
- Harmonic minor
- Minor harmony
- 7th chords
- Borrowed
- Voicing
- Bass
- Synth
- Form
- Arrangement
- Texture
- Mixer
- EQ
- Saturation
- Sidechain
- Stereo
- Reference
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
- mixer channels run through **high-pass → parametric bell EQ → saturation → stereo width → fader/pan**
- mixer channels → master
- post-fader sends → shared **reverb** and **delay** returns
- drum hits read real per-step **MIDI velocity** values
- Tone transport applies the project **swing** amount to eighth-note subdivision timing
- keyboard and melody playback use a bundled sampled Salamander Grand Piano rather than a generic triangle synth
- the early harmony lesson loops the learner's existing groove and melody while the learner writes every harmony note in a 32-step polyphonic piano roll
- chord-tone shading follows the selected chord in each bar, but outside notes remain clickable so mistakes and tension can be heard rather than silently prevented
- chord slots and their MIDI bars have explicit clear actions; changing or removing a label never traps the learner in a preset
- learner-written harmony is also used by arrangement playback when present; later function/minor/seventh/modal-mixture lessons reuse the same editable piano roll instead of reverting to chord-button exercises
- macro-form playback expands four section layer plans into a real sixteen-bar arrangement so A/B/A′ relationships are heard, not only labelled
- chord playback supports full seventh chords such as D7 / V/V, E7 / V7 in A minor, Cmaj7, Dm7, G7, Am7, and Bm7♭5
- chromatic chord playback includes correctly voiced borrowed Fm and B♭ major
- texture settings transpose bass/chords/melody by octave during playback
- open chord spacing and melody octave doubling alter the actual rendered voices
- kick events can create real bass-channel **sidechain ducking** with adjustable amount and release
- mono audition centres pan, collapses width, and removes time-based sends during the compatibility check
- reference A/B audition recalls stored fader/EQ/saturation/width settings with adjustable level-match trim
- quiet-check audition reduces the full mix by 18 dB without changing stored fader values

Automation is real playback automation:

- melody channel volume ramps between bar breakpoints;
- chord low-pass cutoff ramps between bar breakpoints.

Mixer and effects controls manipulate the real audio graph rather than a decorative UI.

## Project persistence

The musical project persists locally through Zustand/local storage.

**Learning progress is also stored in a first-party browser cookie** (`play_lab_progress_v1`). It keeps the current lesson, per-lesson exercise position, completed exercises, and completed lessons across reloads. The current compact v2 codec stores A/B/C/D completion as a four-bit mask per lesson so the cookie remains small as the curriculum grows. Existing verbose v1 cookies are decoded and migrated automatically.

Exercise-specific exploration evidence is kept locally with the learning state and is not part of exported musical project files. It records only interaction summaries needed by checks, such as values tried or the min/max of a control during that exercise.

Each lesson has a **Reset lesson progress** action. Resetting:
- returns that lesson to exercise A;
- removes completion for that lesson's A/B/C/D exercises;
- removes the lesson-complete flag;
- clears that lesson's exploration evidence;
- keeps the shared musical project intact.

This distinction is deliberate: restarting a lesson should not erase a melody, mix, chord progression, bass line, or other work reused by later lessons.

The final workspace can:

- **export** a versioned `play-lab-project` JSON file;
- **import** that file later;
- validate imports with Zod before replacing current project state.

The project file contains:

- tempo
- patterns
- melody
- chord progression, including minor-key, seventh-chord, and borrowed-chord symbols
- learner-written 32-step polyphonic harmony sequence
- four macro-form section layer plans
- legacy chord accompaniment pattern for older/fallback project playback
- synth settings
- arrangement
- mixer
- automation
- dynamics
- effects
- chord inversions / voicings
- programmed bass line
- groove velocity values and swing amount
- sixteen-bar macro-form map
- register / open-voicing / octave-doubling texture settings
- parametric EQ settings
- per-channel saturation settings
- sidechain amount/release
- stereo widths and mono-check history
- reference-mix snapshot and comparison state

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
- instructional text now uses a substantially larger readability floor;
- the central explanation is a single collapsible two-column reading surface rather than a grid of small cards;
- exercise A–D navigation is now a compact set of progress lights in the right rail, keeping the centre for instruments, theory, and explanation;
- the top lesson intro shows one short summary sentence before the instrument;
- redundant status copy, repeated headings, chips, and decorative instructional slogans have been removed;
- transport keeps playing while moving between playable exercises/lessons and automatically re-routes when the workspace changes;
- controls look and behave like pads, keys, clips, faders, mixer sends, automation lanes, and synth parameters;
- real DAW labels such as GRID, MIDI CLIP, CHORD TRACK, OSC, FILTER, AMP ENV, RETURN, MASTER, and AUTOMATION appear where learners will later encounter them.

## Architecture

- React + TypeScript + Vite
- Tone.js / Web Audio
- Tonal
- Zustand + persistent local project state
- Zod content and project-file schemas
- inline SVG concept diagrams
- Vitest curriculum, progression, production-context, cookie-progress, lesson-reset, and project-file tests
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

Feature branches are intentionally quiet by default so intermediate development commits do not trigger notification-heavy CI runs. Validate locally with the commands above, or run the manual **Validate branch manually** workflow when an explicit GitHub-hosted branch check is useful. `main` still runs the full typecheck, curriculum tests, production build, and GitHub Pages deployment automatically.

Production base:

```text
/learn-music/
```


## Audio sample attribution

The keyboard/melody instrument includes a reduced set of **Salamander Grand Piano V2** samples recorded by Alexander Holm, licensed under **CC BY 3.0**. The bundled sample directory contains the attribution notice and source reference.
