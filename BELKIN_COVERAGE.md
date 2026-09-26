# Belkin Source Coverage

This ledger tracks the companion composition-craft track against Alan Belkin's *Musical Composition: Craft and Art*.

The Belkin track complements the existing Schoenberg track. It does not replace Schoenberg's terminology, examples or coverage. Topics are added here when they contribute a distinct practical compositional skill rather than simply repeating material already taught elsewhere.

## Status terms

- **Interactive source analysis** - a source-grounded reconstruction of the chapter's compositional distinctions. It does not reproduce a copyrighted score example.
- **Application study** - editable PLAY / LAB material used to hear and apply the principle. It is not a transcription of Belkin's musical examples.

| Lesson | Book coverage | Source status in app | Application |
| --- | --- | --- | --- |
| B01 Punctuating | Ch. 5 | **Interactive source analysis** covers multidimensional cadence, melodic/rhythmic/harmonic/textural contribution, elision, and degrees of punctuation. No repertoire score is reproduced. | Melodic arrival, textural cadence, overlapping phrase join and hierarchy of endings |
| B02 Presenting | Ch. 6 | **Interactive source analysis** covers stable phrase grouping, familiarity, phrase-length pacing, period/paragraph hierarchy and stronger final articulation. No repertoire score is reproduced. | Related phrase pair, shortening as pacing, four-phrase paragraph and local culmination |
| B03 Binary form | Ch. 9 | **Interactive source analysis** covers shared principal material across both halves, strong middle punctuation, increased second-half activity, rounded return and stronger final ending. No repertoire score is reproduced. | Related two-part motif, intensified second half, departure/return and differentiated endings |

## Why the track begins here

Chapters 1-2 overlap substantially with motive and phrase work already treated at greater length in the Schoenberg track. Chapters 3-4, on singing and instrumental writing, are valuable but deserve instrument- and voice-specific interaction rather than a prose-only implementation. They remain candidates for a later dedicated pass.

Chapters 7-8 and 10, 14 and 19 overlap forms already implemented in the Schoenberg track. They should only be added where Belkin's treatment creates a materially different practical lesson.

Strong candidates for later Belkin lessons include:

- Ch. 7 - One-Part Forms
- Ch. 11 - Contrasting
- Ch. 12 - Connecting
- Ch. 13 - Progressing
- Ch. 15 - Beginning
- Ch. 16 - Exploring
- Ch. 17 - Returning
- Ch. 18 - Ending
- Ch. 20 - Refinements
- Appendix A - Sketching

## Rules

1. Belkin source identities live in `src/music/belkinSourceMaterial.ts`, separate from the Schoenberg registry.
2. A Belkin application study must never be presented as one of the book's score examples.
3. Do not reproduce copyrighted repertoire notation unless it is independently permissible and deliberately sourced.
4. Chapter-derived claims must remain faithful to the supplied book.
5. The learner-facing track should teach the musical principle directly; chapter references and fidelity notes remain internal provenance.
6. Every exercise that requires source analysis must display its registered source material on the same screen.
7. The track should add craft that is genuinely useful in practice rather than duplicate the existing Schoenberg sequence for completeness alone.
