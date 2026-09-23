# PLAY / LAB — Learn Music

PLAY / LAB is a browser-based environment for learning **music composition and music production together by making music**.

The product now has three connected modes:

- **Learn** — guided, progressive lessons with checks and explanations;
- **Create** — open-ended briefs without a single correct answer;
- **Studio** — the same real instruments and production tools collected into a reusable workstation.

All three modes operate on the same persistent local project.

Current curriculum release: **v2.2.1**.

v2.1.5 replaces the basic synthesized kick, snare, and hi-hat with **bundled sampled drum one-shots** while preserving the same sequencer, velocity, compressor, mixer, sidechain, EQ, saturation, stereo, and effects signal path.

v2.2.1 makes piano touch fully shared: the PIANO harmony voice now follows the same soft, medium, and strong recorded Salamander layers as the melody piano.

v2.2 adds a shared **instrument palette** and a five-lesson **Style Lab**. Melody piano now uses three real Salamander velocity layers; electric bass uses six locally bundled sampled anchors with Sub and Synth alternatives; harmony can be played by sampled piano, electric keys, pad, or pluck. The Style Lab reshapes the learner's existing project into House, Funk, Hip-hop, Ambient, and Pop studies. It does not load genre presets: every lesson asks the learner to alter, compare, listen, and decide.

## Current interactive curriculum

There are currently **33 lessons and 132 guided exercises**.

1. **Pulse & groove** — four-on-the-floor, backbeat, eighths, syncopation
2. **Repetition & variation** — related variation, fill, anticipation, turnaround
3. **Keys & melody** — C major, in-key writing, scale degrees, motif and phrase
4. **Chords & progressions** — write chord tones directly into a four-bar piano roll, then turn I/IV/V into a rhythmic accompaniment
5. **Sound & synthesis** — waveforms and filtering, then pluck-vs-pad envelope roles on the learner's melody
6. **Arrangement & form** — hear density and section contrast, then shape an eight-bar rise and release with the peak wherever the music needs it
7. **Mixing & space** — faders, pan, low-cut EQ, send/return reverb and delay
8. **Automation & dynamics** — volume rides, filter sweeps, compression, transients
9. **Creative effects & transitions** — learn reverb, delay, and chorus by exaggerating them, then choose only the effects a transition needs
10. **Finish the track** — listen to the composition, arrangement, and mix as a whole; remove unjustified processing; save a version worth keeping
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
21. **Sidechain ducking** — hear kick/bass overlap, exaggerate the pump, back it off, then reshape the kick pattern and hear the bass envelope follow
22. **Stereo width & mono** — pan, mid/side width, centred low end, mono translation
23. **Reference mixing** — snapshots, A/B comparison, level matching, quiet and mono checks
24. **Relative minor** — A natural minor, shared C-major pitch collection, tonic gravity, relative-key pivot
25. **Harmonic minor & leading tone** — raised 7th, G♯→A resolution, augmented second, cadential melody
26. **Minor-key progressions** — write i/iv, V7–i, Andalusian, and deceptive cadences directly into the harmony piano roll
27. **Seventh chords** — add and remove the seventh as actual MIDI, then write ii7–V7–Imaj7 and I–vi–ii–V accompaniments
28. **Borrowed chords & modal mixture** — alter A→A♭ and write B♭/Fm directly into four-bar accompaniments
29. **Style lab · House** — four-beat pulse, offbeat subdivision, instrument articulation, sidechain movement, evolving repetition
30. **Style lab · Funk** — accent hierarchy, syncopated bass, short articulation, rhythmic harmony and negative space
31. **Style lab · Hip-hop** — backbeat space, kick phrasing, swing comparison, sparse hook writing, sonic weight
32. **Style lab · Ambient** — envelope, sustain, harmonic duration, spatial depth, sparse orchestration
33. **Style lab · Pop** — hook economy, supportive harmony, section contrast, foreground timbre

Each guided exercise keeps the instrument central. The supporting panel is deliberately small: **the idea**, **what to listen for**, how the same thing appears in a DAW or instrument, and the terms needed to name it.

The curriculum is regression-tested for every implemented exercise. Completion is not based only on the final state. Where it matters, the app records exercise-local evidence that the learner **played the music, changed something, compared alternatives, or explored a control range**. A plausible final knob value therefore cannot stand in for the listening process that was meant to teach it.

The v2.1 editorial and pedagogy pass applies one rule across the course: **listen, alter, compare, decide**. Theory and parameter values are used to focus attention, not as an answer key. Several exercises deliberately ask for a bad or exaggerated version first so the learner can hear the boundary before choosing a result.

v2.1.1 also repairs persisted pre-v2 form data on startup. Older local projects that have section labels/roles but no sixteen-bar layer plan are migrated to safe defaults instead of crashing the app.

v2.1.2 strengthens **project continuity** between lessons. Melody writing now happens over the groove the learner already made; harmony is written under that groove and melody; bass is written against the existing groove and harmony; motif, harmonic-function, and minor lessons keep developing shared project material. Continuity is selective rather than automatic: the later C-major seventh/borrowed-chord lessons keep the groove but omit the preceding A-minor melody so incompatible material cannot obscure the harmony being taught.

v2.1.3 adds **drawn MIDI note length**. Melody, harmony, bass, motif, melody-over-harmony, and minor-key piano rolls now distinguish note onset from duration: click for a one-eighth note, or drag horizontally to sustain through later eighth-note cells. Drawn durations affect real playback, carry into arrangement and sound-design reuse, persist across refreshes, and round-trip through project export/import. Older saved projects migrate to the original one-cell duration automatically.

v2.1.4 tightens MIDI note semantics. Melody and bass notes cannot sustain through a later onset in the same part; a new note automatically ends the previous held note. Harmony remains polyphonic, but re-triggering the same pitch ends its earlier sustain without affecting the other chord tones. Tapping any part of a sustained block removes that note; dragging the block still resizes it.

## Learn

Learn progressively reveals controls instead of presenting a full DAW immediately.

Current workspaces include:

- drum machine / 16-step sequencer
- A/B pattern lab
- MIDI keyboard
- piano roll with draggable eighth-note-based durations
- chord track
- four-bar polyphonic harmony piano roll with chord-tone guidance, groove/melody context, learner-written rhythm, and draggable note lengths
- voicing / inversion lab
- four-bar bass piano roll with draggable note lengths
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
- instrument palette with three piano touch layers, sampled electric/sub/synth bass, and piano/electric/pad/pluck harmony
- Style Lab exercises that reuse the same project instead of loading genre templates
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
- final project listening/finish/export

Completing exercise D moves directly into exercise A of the next lesson.

## Create

Create provides open-ended prompts such as:

- make one groove feel like two sections;
- write an eight-bar miniature;
- create one unmistakable energy peak;
- improve a production without rewriting the notes;
- make the same note collection resolve first to C and then to A;
- reharmonize a C-major idea with a seventh chord and a borrowed chord.

These prompts do not use automatic “correct composition” scoring. They open the same project in Studio and leave the musical decisions to the user.

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
- Palette
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
- sampled kick/snare/closed-hat one-shots → **drum-bus compressor** → mixer channel
- melody → **chorus insert** → mixer channel
- chords → **automated low-pass filter** → mixer channel
- mixer channels run through **high-pass → parametric bell EQ → saturation → stereo width → fader/pan**
- mixer channels → master
- post-fader sends → shared **reverb** and **delay** returns
- drum hits read real per-step **MIDI velocity** values
- Tone transport applies the project **swing** amount to eighth-note subdivision timing
- keyboard and melody playback choose among three bundled Salamander Grand Piano velocity layers so soft, medium, and strong touch use different recordings rather than gain alone
- bass playback can use a six-anchor sampled electric bass, a rounded sub synth, or the original filtered synth bass
- harmony playback can use sampled piano, FM electric keys, a slow pad, or a short pluck
- the early harmony lesson loops the learner's existing groove and melody while the learner writes every harmony note in a 32-step polyphonic piano roll
- chord-tone shading follows the selected chord in each bar, but outside notes remain clickable so mistakes and tension can be heard rather than silently prevented
- chord palette buttons are explicit **target + preview** controls: they set the selected bar's harmonic target, recolour chord-tone guidance, and audibly preview the chord without writing MIDI for the learner
- chord slots and their MIDI bars have explicit clear actions; changing or removing a label never traps the learner in a preset
- learner-written harmony is also used by arrangement playback when present; bass playback now keeps the learner's groove and harmony running while the bass line is written
- melody-over-harmony playback combines the learner's groove, current chord progression, and melody so chord-tone/tension decisions are heard rather than only colour-coded
- later function/minor/seventh/modal-mixture lessons reuse the same editable piano roll instead of reverting to chord-button exercises
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
- instrument palette settings for piano touch, bass voice, and chord voice
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

Audio runs entirely in the browser. Piano/melody, the core drum kit, the electric-bass voice, and the chord-piano voice use bundled samples. Sub/synth bass, electric-key/pad/pluck harmony, and the sound-design instrument remain synthesized so synthesis and timbre can still be compared directly. The course does not depend on remote sample downloads.

## Interface

The design follows a “friendly workstation” approach:

- the instrument or production tool is the main surface;
- the right rail has one purpose: task, checks, continue/reset;
- theory sits in a compact collapsible panel with the idea, a listening cue, DAW/instrument context, and terms;
- instructional text uses a larger readability floor;
- listening prompts favour concrete A/B questions over telling the learner what they are supposed to hear;
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

The keyboard/melody and chord-piano instruments use selected **Salamander Grand Piano V2** samples recorded by Alexander Holm under **CC BY 3.0**, including three recorded velocity layers.

The electric-bass voice bundles six sample anchors from **nbrosowsky/tonejs-instruments**, sourced from Karoryfer and distributed under **CC BY 3.0**.

The drum kit uses bundled one-shots from **@teropa/drumkit**. Kick and snare originate from DWSD's Deep House Drum Kit under Creative Commons Attribution; the closed hi-hat comes from Stomachache's Analog Cymbal under CC0. The deployed `SAMPLE_ATTRIBUTION.txt` contains the source links and license details.
