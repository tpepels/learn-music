# Schoenberg Source Coverage

This ledger tracks the implemented Schoenberg composition track against *Fundamentals of Musical Composition*. It prevents PLAY / LAB application studies from being mistaken for the source material.

Status terms:

- **Native score** - verified musical material is stored as structured note data, rendered from that data, playable note-by-note or as an excerpt, and has source-analysis controls tied to the notation.
- **Interactive source analysis** - Schoenberg's own analytical distinction is reconstructed interactively from the book, but a complete note-for-note native transcription is still pending.
- **Application study** - PLAY / LAB material used after source study. It is not the book example.

| Lesson | Book coverage | Source status in app | Application |
| --- | --- | --- | --- |
| S01 Form & phrase | Ch. I-II; Exs. 1-11 | Ex. 2e and Exs. 5a, 6a, 7a and 8a are **native playable scores** with melodic/rhythmic content verified against the supplied scan. Ex. 2e keeps Beethoven's original cello register and therefore uses bass clef in the app; Schoenberg's exact printed clef still needs an explicit scan recheck before claiming engraving-level clef fidelity. Ex. 5a correctly omits an invented time signature because none is printed. Ex. 4c and the remaining subexamples in Exs. 5-11 retain **interactive source analysis** until their notation is transcribed. | Phrase comparison, repair, and construction studies |
| S02 The motive | Ch. III; Exs. 12-29 | Ex. 12b, Ex. 14b-c, and Exs. 17a-19a are **native playable scores**. Exs. 17a-19a now expose the printed baseline rhythm, ancillary-note insertion, and reordered broken-chord form directly before the broader source-analysis maps. Full native notation remains pending for the remaining variants, literature excerpts, and multi-part examples. | Transformation and systematic broken-chord studies |
| S03 Connecting motive-forms | Ch. IV; Exs. 30-34 | Ex. 31a now has a **native playable score** for its first complete bar, including the retained rhythmic profile used by the lesson. Exs. 30-34 also retain **interactive source analysis** preserving Schoenberg's distinctions about direction, transposition, combined changes, shifts, reduction and omission. Full native notation for the remaining variants is still pending. | Connection, repair, phrase-building and motive-chain studies |
| S04 Beginning the sentence | Ch. V; Exs. 35-41 | Exs. 35a and 35b now have **native playable grand-staff scores** of the complete excerpts printed by Schoenberg, including pickups, tonic-form phrases, dominant-form answers, simultaneous accompaniment chords and triplet detail. Exs. 35-41 retain interactive source analysis for the broader comparisons. Native notation for Exs. 36-41 is still pending where the printed examples require quartet or denser multi-voice notation. | Sentence-opening and tonic/dominant application studies |
| S05 Completing the sentence | Ch. VIII; Exs. 52-61 | A-L follows the chapter and examples individually. Mozart Ex. 59a (Piano Sonata K. 280-I) is now a **complete native playable grand-staff score** for all 14 measures printed by Schoenberg. The remaining Ex. 52-61 groups have interactive source analysis; the ledger now identifies Ex. 57-58 as Bach/Haydn, Ex. 60 as Schubert, and Ex. 61 as Brahms. Further native multi-staff transcriptions remain pending. | Core continuation/liquidation practice, source study, then a final rebuilt sentence |
| S06 The period - antecedent & consequent | Chs. VI-VII; Exs. 42-51 | **Interactive source analysis** covers postponed repetition, antecedent contrast, caesura, modified consequent return, cadence contour, rhythmic identity and irregular length. Native notation for the dense literature examples remains pending rather than being replaced with invented reductions. | Period comparison, antecedent/consequent listening, and a 32-step editable period study |
| S07 The accompaniment | Ch. IX; Exs. 62-67 | **Interactive source analysis** covers functional accompaniment, omissibility, accompanimental motive and bass-line treatment. No note-for-note notation is claimed for the still-untranscribed examples. | Transparency/arrangement study, recurring harmonic rhythm, active support, and bass-line revision |
| S08 Character & mood | Ch. X; Ex. 68 | **Interactive source analysis** covers combined determinants of character and the descriptive-motion categories discussed in the literature examples. No source melody is fabricated. | Groove timing/accent studies and expressive texture shaping |
| S09 Melody & theme | Ch. XI; Exs. 69-100 | **Interactive source analysis** covers vocal melody, instrumental melody and melody-versus-theme distinctions. The numerous literature examples remain pending for verified native transcription. | Singability, melodic wave/climax, compensated leap and self-contained melody studies |
| S10 Self-criticism & revision | Ch. XII; illustrations of self-criticism | **Interactive source analysis** presents the revision checklist and diagnostic categories without pretending the referenced score illustrations have been transcribed. | Listening, melodic economy, bass audit, harmonic audit and multi-sketch revision |


## Rules

The full implementation contract is in `SCHOENBERG_ARCHITECTURE.md`. In particular, **exercise** always means a PLAY / LAB lettered step and **example** always means book source material.

1. A lesson may not ask the learner to analyse a named example unless source material for that example is present on that exercise screen.
2. Every `source.exampleIds` entry must resolve through the source registry.
3. A PLAY / LAB application study must never be labelled or rendered as if it were Schoenberg's original notation.
4. Native transcriptions are verified against the supplied book scan before being marked **Native score**.
5. Complex source material may ship first as a clearly labelled interactive source-analysis map, but the missing native transcription remains visible here until completed.
6. When a native source score is available, it should be playable and its displayed notation and playback must derive from the same structured data.


## S01-S05 recheck - native/interactivity pass

- Raster book crops are not used as lesson source material.
- Every specifically named Schoenberg example in S01-S05 resolves to in-app source material.
- Native scores now combine playback with selectable analytical spans, so the score itself participates in the exercise rather than acting as a static illustration.
- Key signatures are stored structurally and rendered in native scores; unprinted metres are not invented.
- The native score model now supports sixteenth-note source material so later transcriptions are not forced into the coarser PLAY / LAB study grid.
- Interactive source-analysis maps remain the explicit fallback for examples whose faithful multi-voice/native transcription is still pending. Those pending items stay visible in this ledger rather than being silently replaced by application reductions.


### Recheck corrections

- S01 Ex. 5a no longer displays a 4/4 meter that is absent from the printed source.
- S04 Exs. 35a-b are complete native grand-staff examples rather than prose-only references.
- S05 literature attribution was checked directly against the printed example pages: Ex. 57 is Bach, Ex. 58 Haydn, Ex. 59 Mozart, Ex. 60 Schubert, and Ex. 61 Brahms.
- S05 Ex. 59a now exposes the actual Mozart K. 280-I passage used by Schoenberg, including the measures involved in his omission/interpolation analysis.
