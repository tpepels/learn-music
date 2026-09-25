# Schoenberg Source Coverage

This ledger tracks the first five lessons against *Fundamentals of Musical Composition*. It prevents PLAY / LAB application studies from being mistaken for Schoenberg's source examples.

Status terms:

- **Native score** - verified musical material is stored as structured note data, rendered from that data, playable note-by-note or as an excerpt, and has source-analysis controls tied to the notation.
- **Interactive source analysis** - Schoenberg's own analytical distinction is reconstructed interactively from the book, but a complete note-for-note native transcription is still pending.
- **Application study** - PLAY / LAB material used after source study. It is not the book example.

| Lesson | Book coverage | Source status in app | Application |
| --- | --- | --- | --- |
| S01 Form & phrase | Ch. I-II; Exs. 1-11 | Ex. 2e and Exs. 5a, 6a, 7a and 8a are **native playable scores** verified against the supplied scan. Ex. 4c and the remaining subexamples in Exs. 5-11 retain **interactive source analysis** until their notation is transcribed. | Phrase comparison, repair, and construction studies |
| S02 The motive | Ch. III; Exs. 12-29 | Ex. 12b, Ex. 14b-c, and Exs. 17a-19a are **native playable scores**. Exs. 17a-19a now expose the printed baseline rhythm, ancillary-note insertion, and reordered broken-chord form directly before the broader source-analysis maps. Full native notation remains pending for the remaining variants, literature excerpts, and multi-part examples. | Transformation and systematic broken-chord studies |
| S03 Connecting motive-forms | Ch. IV; Exs. 30-34 | Ex. 31a now has a **native playable score** for its first complete bar, including the retained rhythmic profile used by the lesson. Exs. 30-34 also retain **interactive source analysis** preserving Schoenberg's distinctions about direction, transposition, combined changes, shifts, reduction and omission. Full native notation for the remaining variants is still pending. | Connection, repair, phrase-building and motive-chain studies |
| S04 Beginning the sentence | Ch. V; Exs. 35-41 | Exs. 35-41 have **interactive source analysis** based on Schoenberg's own comments: I/V complementary forms, I-V-I/V-I-V, passing harmony, non-mechanical correspondence, contour vs rhythm, and main-harmony answering. Full native multi-voice notation is pending. | Sentence-opening and tonic/dominant application studies |
| S05 Completing the sentence | Ch. VIII; Exs. 52-61 | A-L now follows the chapter and examples individually. Ex. 52, Ex. 53, Exs. 54-56, Exs. 57-58, Ex. 59, Ex. 60 and Ex. 61 each have **interactive source analysis** based on Schoenberg's printed labels and written commentary. Full native multi-staff transcriptions remain pending. | Core continuation/liquidation practice, source study, then a final rebuilt sentence |

## Rules

1. A lesson may not ask the learner to analyse a named example unless source material for that example is present in the lesson.
2. A PLAY / LAB reduction or exercise must never be labelled or rendered as if it were Schoenberg's original notation.
3. Native transcriptions are verified against the supplied book scan before being marked **Native score**.
4. Complex source material may ship first as a clearly labelled interactive source-analysis map, but the missing native transcription remains visible here until completed.
5. When a native source score is available, it should be playable and its displayed notation and playback must derive from the same structured data.


## S01-S05 recheck - native/interactivity pass

- Raster book crops are not used as lesson source material.
- Every specifically named Schoenberg example in S01-S05 resolves to in-app source material.
- Native scores now combine playback with selectable analytical spans, so the score itself participates in the exercise rather than acting as a static illustration.
- Key signatures are stored structurally and rendered in native scores; unprinted metres are not invented.
- The native score model now supports sixteenth-note source material so later transcriptions are not forced into the coarser PLAY / LAB study grid.
- Interactive source-analysis maps remain the explicit fallback for examples whose faithful multi-voice/native transcription is still pending. Those pending items stay visible in this ledger rather than being silently replaced by application reductions.
