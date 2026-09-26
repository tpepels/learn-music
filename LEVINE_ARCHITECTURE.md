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
- use enough explanation to make the task intelligible without the book open beside the app.

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

The source score and the practice grid have different jobs:

- source score = verified book material;
- practice grid = learner-entered voicing or transposition.

Completion should require both musical state and evidence of interaction/listening so inherited state cannot silently complete a later exercise.

## 9. Supplied-source boundary

The supplied PDF is a 150-page scan. It contains the book through Chapter Sixteen and ends during that chapter. The table of contents names Chapters Seventeen through Twenty-Three, but their chapter pages are not present in the supplied file.

Therefore:

- Chapters 1-16 may be implemented from this source after page-by-page verification.
- Chapters 17-23 remain blocked for source-grounded implementation until their pages are supplied.
- The table of contents alone is not sufficient evidence for lesson content or examples in those chapters.

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
