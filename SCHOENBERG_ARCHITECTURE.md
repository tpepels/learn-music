# Schoenberg track architecture

This document defines the architecture and product rules for the Schoenberg composition track. It exists so later work does not have to reconstruct the intended design from chat history.

Read this together with `SCHOENBERG_COVERAGE.md`.

## 1. Product model

The Schoenberg track has four distinct layers. They must stay distinct in code and in the UI.

### A. Lesson exercise

A PLAY / LAB **exercise** is one learner step such as A, B, C, etc.

It lives in:

- `src/lessons/schoenberg*.ts`
- `ExerciseDefinition` / `exerciseContentSchema`

An exercise contains:

- `learn` - the central musical idea
- `explanation` - enough theory to understand the task
- `instruction` - what the learner must do
- `recognition` - what to listen for
- `terms` - only vocabulary needed for the current task
- `source.exampleIds` - source examples actually shown on that screen
- `evaluate` - completion evidence

### B. Book source example

A Schoenberg source item is verified material from the book. Internally it may retain references such as `Ex. 2e`, `Ex. 14b` or `Ex. 35a` for provenance and coverage tracking.

It lives in:

- `src/music/schoenbergSourceMaterial.ts`

It is either:

- `kind: "score"` - verified structured notation and playback
- `kind: "map"` - source-grounded interactive analysis while full notation is still pending

The source registry is the only place that owns source-example identity and source-fidelity metadata.

### C. Application study

The editable/playable workspace is a PLAY / LAB **application study**.

It lives primarily in:

- `src/music/study.ts`
- `src/components/CompositionStudyWorkspace.tsx`

Application material is not Schoenberg's original notation unless it is explicitly rendered from a source score in the source registry.

### D. Coverage ledger

`SCHOENBERG_COVERAGE.md` records what has actually been verified/transcribed.

If source fidelity or coverage changes, update the ledger in the same PR.

---

## 2. Terminology contract

Use these words consistently:

- **Exercise A/B/C...** = app lesson step.
- **Exercise A/B/C...** = app lesson step.
- **Source passage / source example** = material from the book shown to the learner.
- **Study** or **application study** = editable PLAY / LAB material.
- **Book index** = internal provenance such as `Ex. 2e`; never a teaching label.

Do not call a book source an "exercise".
Do not call Exercise C "Example C".

### Book-index rule

Book indices are useful for verification and maintenance, but they add no pedagogical value by themselves. Keep them in source IDs, `reference`, fidelity notes and the coverage ledger. Do **not** display them in learner-facing lesson titles, explanations, instructions, completion text, source-card headings or analysis-tab labels.

Name the music or the musical idea instead: for example, "Beethoven - Eroica opening theme", "Diminution", "Broken-chord study", or "Mozart K. 280-I".

---

## 3. Reference-integrity rule

A learner must never be sent hunting for a book reference. Source material required for a task must already be present on the same exercise screen.

Therefore:

1. Every `source.exampleIds` entry must resolve in `schoenbergSourceMaterial`.
2. Instructions refer to visible music descriptively - for example "the Eroica opening theme below" or simply "the two source passages below" - never by book index.
3. If source material is necessary for the task, it appears **before the editable workspace**.
4. Do not use prose as a substitute for missing source material.
5. If a necessary source is not available, add a verified source representation first or rewrite the task so it does not depend on it.

Executable regression tests enforce source-ID resolution and the absence of book indices from learner-facing material.

---

## 4. Learner-facing layout contract

For the Schoenberg track, the reading order is:

1. lesson title
2. top teaching block
3. vocabulary needed now
4. source examples
5. editable/application workspace
6. completion rail

The top teaching block is two columns on desktop:

### Left - Concept

Contains:

- the central musical principle
- enough explanation from the relevant chapter to understand the task
- meaningful distinctions, not a one-sentence summary

### Right - Exercise

Contains:

- the concrete task
- any constraints
- what to listen for

On narrow screens the two columns collapse to one column.

Do not put essential theory below the workspace.
Do not hide essential instructions in expandable details.

---

## 5. Content-depth rule

The track is based on *Fundamentals of Musical Composition*, not on generic composition summaries.

For every exercise:

- preserve the useful distinctions and terminology of the relevant chapter
- explain why the exercise exists
- explain what musical variable is being isolated
- explain what the learner should hear
- use enough prose to make the exercise intelligible without the learner having to infer the theory from controls

Do not pad the page with provenance commentary.
Do not write "Schoenberg says..." repeatedly when the musical principle can simply be taught directly.
Do not mention implementation details such as "native", "source-analysis map", "PLAY / LAB reduction" or transcription status in learner-facing prose.

Internal fidelity/provenance belongs in the source registry and coverage ledger.

---

## 6. Readability contract

Instructional text must remain comfortably readable.

Current intended minimums:

- main concept/exercise prose: about 15-16px
- source-analysis prose and vocabulary definitions: at least about 13px
- interactive controls and meaningful labels: at least about 12px
- smaller text is reserved for genuinely secondary metadata only

Do not reintroduce 8-10px fonts for instructions, analysis, exercise controls or note labels that the learner is expected to read.

---

## 7. Source-score architecture

### Source notation

Owned by:

- data: `src/music/schoenbergSourceMaterial.ts`
- renderer: `src/components/SchoenbergSourceMaterial.tsx`

A source score must derive notation and playback from the same structured events.

The renderer owns:

- clef and staff geometry
- key signature
- meter
- note spelling and accidentals
- noteheads, stems, flags and dots
- ledger lines
- barlines
- rests
- slurs
- grand-staff layout
- source-analysis highlighting

Do not "fix" a visual notation error by changing correct source MIDI data.

### Composition-study notation

Owned by:

- `src/components/CompositionStudyWorkspace.tsx`

This is an application renderer, not a source renderer.

It may be simpler than source engraving, but it still must provide valid basic notation:

- notes on correct vertical positions
- ledger lines
- conventional stem direction
- visible rests
- readable accidentals
- consistent staff/barline geometry

### Renderer changes

When a notation defect appears:

1. determine whether the error is in data or rendering
2. fix the renderer if the musical data is correct
3. add a focused geometry/spelling regression test
4. inspect both single-staff and grand-staff cases when shared geometry changes
5. do not duplicate a second ad-hoc formula if an existing geometry helper can be extended safely

Longer-term, shared notation primitives should move toward a common music-notation utility rather than accumulating independent pitch/staff formulas in the two renderers.

---

## 8. Source-fidelity rules

The coverage ledger remains authoritative for whether material is:

- native/structured score
- interactive source analysis
- application study

Rules:

- never invent pitches, rhythm, meter, harmony, attribution or analytical claims
- do not add a time signature when the printed subexample has none
- do not convert an application study into a supposed source score
- do not silently upgrade a map to a native score without verification
- complex examples may remain source-analysis maps until faithful transcription is feasible

---

## 9. Tests that must remain

At minimum, Schoenberg work must keep regression coverage for:

- source IDs resolving
- named source examples required by an exercise being present on that screen
- exercise/example terminology separation
- learner-facing implementation/provenance language not leaking into copy
- source notation spacing
- enharmonic spelling and accidentals
- stem direction
- grand-staff sizing
- composition-study ledger lines, stems and rests
- lesson-specific evaluator logic

A failing integrity test is a product defect, not a test to delete.

---

## 10. Workflow for continuing the track

Before changing a lesson:

1. refresh current `main`, PRs/issues and Actions
2. read this file and `SCHOENBERG_COVERAGE.md`
3. inspect the current exercise as rendered, not only its data
4. identify whether the problem is:
   - source fidelity
   - pedagogy/copy
   - reference integrity
   - layout/readability
   - notation rendering
   - exercise logic
5. change the smallest correct layer
6. add/update focused tests
7. run full typecheck/tests/build
8. restore manual-only branch CI
9. merge safely
10. verify exact-main Pages deployment

Do not start a new Schoenberg lesson merely because the previous lesson compiles. The current lessons should first meet the same readability, source-integrity and notation standard.
