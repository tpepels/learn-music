# PLAY / LAB Design Principles

This document is the product and curriculum reference for future PLAY / LAB work. New lessons and major UI changes should follow these principles unless a deliberate exception is documented.

## 1. Learn by making and hearing

The core learning loop is:

**hear → inspect → alter → compare → decide → make**

Reading supports the musical activity. It does not replace it.

## 2. Keep the musical object central

The score, piano roll, instrument, mixer, form map, or other musical object is the main surface.

Each exercise should have one authoritative guide close to that object:

- **Do this**
- **Listen for**
- **From the source** when relevant

Longer theory, vocabulary, and DAW transfer stay secondary or collapsible. Avoid duplicated instructions in multiple places.

## 3. Source-based tracks must be canonical

When a track is based on a book or method, the source determines the important concepts, terminology, order, examples, and distinctions.

For the Schoenberg track:

- read the complete relevant chapter and examples before designing the lesson;
- preserve Schoenberg's useful terminology and distinctions;
- distinguish **source**, **our interpretation**, and **PLAY / LAB adaptation**;
- maintain coverage of pedagogically substantive examples rather than silently skipping them.

## 4. If an example matters, include it

A learner should never be told to analyse an example that is only named.

Preferred flow:

**native source example → guided analysis → interactive reduction/abstraction → learner application**

Source examples should preferably be re-engraved as verified structured musical data so they can be read, played, highlighted, and reused throughout the app. The supplied scan is the verification source, not the normal learner-facing representation. Raster crops are a fallback only when faithful native reconstruction is not yet practical.

If a complete native transcription is not yet available, expose only the source-derived analysis that has actually been verified, label it as partial, and record the missing transcription in the coverage ledger. A reduction must never silently present itself as the original example.

## 5. Use authentic musical language

Teach real terms such as antecedent, consequent, liquidation, augmentation, part-writing, retransition, voice leading, etc.

Explain unfamiliar terminology instead of replacing it with vague substitutes. When historical and modern usage differ, say so.

## 6. One musical object, multiple useful views

Staff notation, piano roll, scale degrees, Roman numerals, motive labels, and form annotations should represent the same underlying music whenever practical.

Use a representation because it reveals something:

- staff - contour, rhythm, phrasing;
- piano roll - editing and timing;
- scale degrees - tonal relation;
- Roman numerals - harmonic function;
- motive/form annotations - derivation and structure.

Do not make switching views arbitrary proof-of-work.

## 7. Analysis should lead to composition

Repertoire analysis should normally become an active task:

**What is happening? → can you hear it? → can you alter/reconstruct it? → can you use the principle yourself?**

Where musically sensible, learner material should accumulate across lessons: motive → phrase → sentence/period → theme → larger form.

## 8. Exercise count follows the material

Do not force every lesson into A-D.

If a chapter needs A-J, use A-J. If one idea deserves its own lesson, split it. Later form lessons must use genuinely larger structures rather than relabelled short loops.

## 9. Completion checks should test musical understanding

Checks should ask whether the musical requirement is present, not whether the learner clicked enough controls.

Evaluators must be safe on fresh/partial state, allow more than one valid musical answer where appropriate, and remain advisory. **Move on anyway** stays available.

## 10. Musical structure should be real under the hood

Do not fake pedagogy with prewritten strings or one-off special cases.

Musical identity should be structural and derived into display, notation, MIDI, playback, bass, voicing, harmony, and related views. Persisted projects must migrate safely.

## 11. Comprehensive does not mean indiscriminate

For source-based tracks, maintain a chapter/example coverage map. Each substantial example should be:

- taught directly;
- embedded in another exercise;
- deliberately deferred/optional; or
- deliberately omitted with a reason.

The goal is canonical coverage of the teaching, not reproduction of every page for its own sake.

## 12. Definition of done includes teaching quality

A lesson is not finished merely because it builds.

Before merge, check:

- source fidelity;
- important examples are actually present;
- exercise order teaches a progression;
- instructions are clear in one place;
- the learner must hear or manipulate the concept;
- the final activity demonstrates understanding;
- persistence/evaluators remain safe;
- typecheck, tests, production build, and exact-main deployment pass.
