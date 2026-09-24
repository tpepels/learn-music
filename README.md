# PLAY / LAB — Learn Music

PLAY / LAB is a browser-based environment for learning **music composition and music production together by making music**.

Product, curriculum, source-fidelity, and lesson-design decisions should follow [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md).

The canonical source audit for the Schoenberg track is maintained in [SCHOENBERG_COVERAGE.md](SCHOENBERG_COVERAGE.md).

The product now has three connected modes:

- **Learn** — guided, progressive lessons with checks and explanations;
- **Create** — open-ended briefs without a single correct answer;
- **Studio** — the same real instruments and production tools collected into a reusable workstation.

All three modes operate on the same persistent local project.

Current curriculum release: **v2.5.0**.

v2.5.0 repairs and upgrades Lesson 6's eight-bar arrangement editor. Arrangement playback now reads the current grid on every transport step instead of freezing a snapshot when Play is pressed, so adding or removing layers while the loop runs takes effect immediately—including bars 5–8. Melody playback now loops the complete 16-step written phrase across the arrangement rather than repeating only its first eight steps. The 16-bar form player keeps a separate stable arrangement source. The editor also supports click-and-drag painting/erasing across a track row, clearer A/B section labels, and an explicit live-edit indicator while transport is running.

v2.4.9 fixes evaluator crashes on fresh or recovered state. Lesson 5B previously treated an absent cutoff experiment as if it were merely non-null, then dereferenced its missing `max`/ `min` fields. The same unsafe pattern also existed in sidechain release, delay-feedback exploration, and stereo pan exploration. Those checks are now null-safe, and the curriculum test suite now verifies that every exercise evaluator can run with an empty experiment history without throwing.

v2.4.8 adds a **Recover to lesson 5** path for lost or intentionally skipped early progress. The recovery preset rebuilds a coherent prerequisite project—two related drum patterns, a C-major phrase, a C–F–G–C progression, and written harmony—marks lessons 1–4/exercises A–D complete for navigation, and opens Sound & synthesis. Recovery requires confirmation because it replaces the current musical project; it is a catch-up mechanism, not another completion gate.

v2.4.7 fixes the refresh-only blank-screen failure at its persisted-state source. Older saved groove settings could contain `swing` without the velocity lanes introduced later; the shallow Zustand merge accepted that legacy shape, then the audio-engine synchronization effect threw while reading `velocities.kick`, causing React to clear the root and leave only the page background. Rehydration now migrates groove state forward, preserving valid old values while filling missing velocity lanes from current defaults. A root error boundary also ensures a future project-state incompatibility produces a visible diagnostic instead of an empty interface.

v2.4.6 retires the custom PLAY / LAB service worker. The previous worker kept a permanent `play-lab-v1` cache across releases, which could mix a newly deployed HTML shell with stale or unavailable hashed JavaScript assets and leave only the styled background after refresh. Production startup now unregisters PLAY / LAB service workers and removes `play-lab-*` caches, while the legacy `sw.js` self-retires and clears its caches for existing installations. GitHub Pages/Vite's normal fingerprinted asset caching remains in use.

v2.4.5 fixes lesson 5 synth auditioning. The sound-design instrument is now polyphonic, so long release tails can overlap following melody notes instead of being cut off by a single stolen voice. **Play current melody** now schedules the entire written melody rather than truncating after eight note events, preserves each note's written duration, and uses the learner's melody whenever any project notes exist; the fallback demo phrase is used only for an empty melody.

v2.4.4 makes the learning flow more forgiving. Focused Learn-mode playback now has a **Mute earlier parts** toggle that temporarily solos the current musical layer without changing saved mixer values. Exercise completion no longer has a hidden “make one fresh change after opening this exercise” gate: when the exercise's own checks are already satisfied, Continue is available immediately. If a remaining check feels over-specific, a learner can also choose **Move on anyway**; the checks remain useful prompts, but they no longer behave like permission slips.

v2.4.3 adds **non-destructive lesson audio focus**. In Learn mode, writing/listening lessons temporarily prioritise the musical layer currently being learned: drum-focused lessons foreground drums, melody lessons foreground melody, harmony lessons foreground chords, and bass lessons foreground bass. A focused track is brought to a useful monitoring floor while context tracks are capped lower, so mixer choices carried forward from older exercises cannot mask the new material. The learner's actual mixer values are not changed or exported, and arrangement/mixer/EQ/effects/reference/Studio/Create playback stays neutral so production decisions are heard at their real balance.

v2.4.2 repaces the **actual lesson screen** after the concept-depth work. The instrument remains the dominant surface; immediately below it the learner now sees only a short exercise-specific learning headline, one concept explanation, and one listening cue. The underlying model, why/when guidance, PLAY/LAB-to-DAW mapping, vocabulary, tools, conceptual pitfall, visual, and glossary remain available under a single **Go deeper** disclosure instead of all competing for attention at once. The three DAW transfer checkpoints are also compact disclosures: they remain visible as milestones without automatically expanding a grid of reference material into the exercise flow. On narrower screens the optional deep-reading layout becomes one column rather than compressing dense prose into two narrow columns.

v2.4.1 deepens the curriculum-wide **concept and DAW-transfer layer**. The learning panel now follows the same sequence throughout the course: the exercise-specific concept, the underlying mental model, what is actually changing, what to listen for, why and when the technique is useful, how PLAY/LAB represents it, where the same object lives in a DAW, and a common conceptual confusion. The DAW map now grows with the learner: familiar timeline/MIDI, instrument, effects, mixer, and output stages remain visible while later stages stay deliberately muted until they are introduced. Transfer checkpoints now occur at lessons 5, 10, and 29—after the relevant material has actually been learned—and culminate in an explicit PLAY/LAB-to-real-DAW signal-path exercise. Production-context copy was also made direct and learner-facing rather than relying on generic “producers do this” language.

v2.4.0 introduced the first curriculum-wide **concept and DAW-transfer layer**: workspace mental models, DAW locations, vocabulary, common conceptual mistakes, and explicit transfer checkpoints alongside expanded explanations in several harmony, melody, bass, texture, and saturation exercises.

v2.3.0 is a full curriculum pedagogy audit across all **33 lessons / 132 exercises**. Completion now follows the musical process more consistently: exercises that ask the learner to write, compare, audition, reshape, or critically listen require exercise-local evidence of those actions instead of accepting a plausible final state alone. Playback that continues naturally into the next exercise counts as listening, so the stronger checks do not force repeated Play clicks. Reference/mono comparisons are scoped to the exercise that asks for them, bass and pattern work now record learning evidence, and the former lesson-10 “Final project” is correctly framed as a **first-track checkpoint** before the later harmony, writing, production, and Style Lab material.

v2.2.2 aligns the instrument-palette wording with the shared piano implementation: **PIANO TOUCH** now explicitly describes the acoustic-piano layer used by melody and by harmony whenever the harmony voice is PIANO.

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
10. **First track checkpoint** — listen to the composition, arrangement, and mix as a whole; remove unjustified processing; save a complete version before the course moves into deeper writing, harmony, feel, and production
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

Each guided exercise keeps the instrument central. The supporting panel now moves from **the concept** to the **underlying model**, **what is actually changing**, **what to listen for**, **why and when you would use it**, the corresponding object **here in PLAY/LAB**, and finally **where the same operation lives in a DAW**. A progressive DAW map keeps previously learned parts visible while introducing new ones, and the three transfer checkpoints deliberately zoom out from individual controls to piano roll, project screen, and complete signal path.

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
- production checkpoint / finish / export

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
