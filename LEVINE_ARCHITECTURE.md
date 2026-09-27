# Levine jazz-piano track architecture

This document defines the implementation contract for the Mark Levine jazz-piano track based on *The Jazz Piano Book*. It intentionally mirrors the source-integrity rules of the Schoenberg track.

Read this together with `LEVINE_COVERAGE.md`.

## 1. Product layers

The track keeps four layers separate.

### A. Lesson exercise

A lettered app **exercise** is one learner step.

It lives in:

- `src/lessons/levine*.ts`
- `ExerciseDefinition` / `exerciseContentSchema`

An exercise owns the teaching copy, task, listening goal, vocabulary, source IDs and completion evidence.

### B. Book source example

Verified source material lives in:

- `src/music/levineSourceMaterial.ts`

It is either:

- `kind: "score"` - verified structured notation; displayed notation and playback come from the same note data.
- `kind: "map"` - source-grounded interactive analysis when a faithful native transcription is not yet present.

The shared score renderer is used through `LevineSourceMaterial`; source identity and fidelity remain owned by the Levine registry.

### C. Application study

The editable jazz-piano workspace is a separate practice surface. It may transpose, re-register or simplify a source concept for practice, but it must never be presented as the book's notation.

### D. Coverage ledger

`LEVINE_COVERAGE.md` records what has actually been checked against the supplied scan, which examples are native, which remain analytical, and which chapters are unavailable.

If source fidelity or coverage changes, update the ledger in the same PR.

## 2. Terminology

Use these terms consistently:

- **Exercise A/B/C...** - the app's learner step.
- **Source passage / source example** - material from the book.
- **Study / practice study** - editable material in the app.
- **Book index** - internal provenance such as `Figure 3-2`.

Book indices do not belong in learner-facing lesson titles, instructions, explanations, completion text, source-card headings or analysis-tab labels. Name the musical content instead.

## 3. Reference integrity

1. A learner is never sent to hunt for a book figure.
2. If an exercise depends on a source example, that example is shown on the same screen before the editable study.
3. Every `source.exampleIds` entry resolves through `levineSourceMaterial`.
4. Application material must not be labelled as if it were a Levine source transcription.
5. If the source is not sufficiently verified, keep it as a source-analysis map or do not depend on it.
6. Licensed tune excerpts in the book are not silently reconstructed from memory. They stay pending until verified from the supplied source and implemented at the required fidelity.

## 4. Learner-facing layout

Use the same book-course flow as the Schoenberg track:

1. lesson title
2. Concept / Exercise teaching block
3. vocabulary needed now
4. source examples
5. editable jazz-piano workspace
6. completion rail

Essential theory and instructions stay visible. Source cards teach the musical point directly and do not expose implementation language, provenance commentary or book figure numbers.

## 5. Teaching depth

The course follows the structure and distinctions of *The Jazz Piano Book* rather than replacing it with a generic jazz-harmony syllabus.

For every exercise:

- explain the musical relationship the source chapter is teaching;
- preserve useful terminology and explicit exceptions;
- connect written notation, keyboard shape and sound;
- make the learner play and listen rather than only identify labels;
- separate chord-symbol knowledge from actual voicing and voice leading;
- state one concise **Make this stick** memory target - the rule, sound or physical relationship worth carrying into the next lesson;
- provide one collapsed **Need a hint?** prompt that redirects attention to a useful first move or listening cue without simply dumping the completed answer;
- use enough explanation to make the task intelligible without the book open beside the app.

Hints are support, not a second answer key. Prefer prompts such as "hold the guide tones and change only X", "follow the top note", "find the common tones first", or "listen to the bass center" over restating every pitch from the instruction.

Do not repeatedly write "Levine says..." when the musical principle can be taught directly.

## 6. Source fidelity

Never invent source pitches, rhythms, chord spellings, metre, clef, attribution, tune excerpts or analysis.

For native source scores:

- transcribe directly from the supplied scan;
- keep accidentals and voicing register explicit;
- use the same structured data for rendering and playback;
- document any deliberate application re-registering in the exercise as practice material, not as source notation.

For source-analysis maps:

- include only distinctions supported by the inspected pages;
- do not turn an untranscribed score into a prose claim of exact musical content.

## 7. Shared notation

The Levine and Schoenberg source tracks share the generic book-source notation model and renderer:

- types: `src/music/bookSourceMaterial.ts`
- renderer: `BookSourceMaterialView` in `src/components/SchoenbergSourceMaterial.tsx`

Do not fork a second engraving engine for Levine. Renderer fixes should remain source-neutral and keep both tracks' regression tests green.

## 8. Jazz-piano workspace

Levine exercises use `workspace: "jazz-piano"` for piano-only study.

The source score and the application workspace have different jobs:

- source score = verified book material;
- time grid = learner-entered timing, duration, voicing or transposition;
- keyboard view = the same learner-entered study shown as physical piano geometry.

Every Levine exercise uses the shared keyboard view. Selecting a bar and eighth-note step must expose the actual piano keys used at that moment and name the interval relationships between them. The grid teaches **when** notes occur; the keyboard teaches **where** they sit under the hands and **how far apart** they are. Neither view replaces the other.

Teaching copy should connect symbol, keyboard shape and sound explicitly. When an exercise depends on inversion, spacing, a scale center, a chord stack or voice leading, the learner should be able to verify that relationship visually in the keyboard view rather than infer it from row labels alone.

Completion should require both musical state and evidence of interaction/listening so inherited state cannot silently complete a later exercise.

## 9. Supplied-source boundary

The supplied PDF contains 316 PDF pages. An earlier indexed preview exposed only the first 150 pages, which led to an obsolete assumption that the scan ended during Chapter Sixteen. Direct page inspection of the attached PDF confirms later chapter material through Chapter Twenty-Three.

Therefore:

- Chapters 1-23 may be implemented only from pages that have actually been inspected in the supplied scan.
- The coverage ledger records which passages are native scores and which remain source-grounded analysis.
- A table-of-contents entry alone is never sufficient evidence for pitches, voicings, rhythms or tune excerpts.

## 10. Workflow

Use the repository-wide low-noise workflow:

1. refresh exact main, PRs/issues and Actions;
2. inspect the relevant book pages;
3. make one coherent change set;
4. create a draft PR only after the branch is ready;
5. mark ready once for one validation cycle;
6. if it fails, return to draft before fixes;
7. merge only when current with main and validation is green;
8. verify the exact-main Pages deployment.
