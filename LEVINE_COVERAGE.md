# Levine Source Coverage

This ledger tracks the jazz-piano course against Mark Levine's *The Jazz Piano Book* and prevents practice studies from being mistaken for source notation.

Status terms:

- **Native score** - verified structured source notation, playable from the same data that is rendered.
- **Interactive source analysis** - source-grounded explanation of a book example or rule whose complete notation is not yet native.
- **Application study** - editable learner practice. It is not book notation.

## Supplied scan

The supplied PDF contains 150 scanned pages. Its table of contents lists 23 chapters, but the file itself ends during Chapter Sixteen. Chapters Seventeen through Twenty-Three are named in the contents but their pages are not present, so they cannot yet be implemented as source-grounded lessons.

| Lesson | Book coverage | Source status in app | Application |
| --- | --- | --- | --- |
| L01 Intervals & triads | Ch. 1 | **Native scores** for the complete interval chart, the four C triad qualities, and C-major/C-minor inversion chart. **Interactive source analysis** covers interval inversion rules. The many tune-based interval illustrations remain pending rather than being reconstructed from memory. | Fixed-root interval comparison, interval inversion, four triad qualities, major/minor inversions |
| L02 Major modes & II-V-I | Ch. 2 | **Native scores** for C Ionian→Cmaj7, D Dorian→Dm7, and G Mixolydian→G7. **Interactive source analysis** covers the seven-mode overview and the chapter's II-V-I quality/transposition rule. The separate interval-detail figures remain pending. | Build 1-3-5-7 chords, write II-V-I in C, transpose it to F |
| L03 Three-note voicings | Ch. 3 | **Native grand-staff scores** for both C-major II-V-I three-note positions. **Interactive source analysis** covers cycle-of-fifths practice and the extension/alteration terminology at the end of the chapter. Tune excerpts such as *Old Folks* and *Just Friends* remain pending. | Root + guide-tone shells, both compact positions, transpose the rule to F, extension-number comparison |
| L04 Sus & Phrygian chords | Ch. 4 | **Interactive source analysis** covers the root-plus-upper-triad sus construction, alternate sus/slash symbols, coexistence of fourth and third, the G7/E Phrygian construction, and II-V compression. Dense printed voicings and licensed tune excerpts remain untranscribed. | Build Gsus and Dm7/G, compare fourth-plus-third tension, hear G7/E resolve to Amaj7, compress a II-V into one suspended sonority |
| L05 Adding notes to three-note voicings | Ch. 5 | **Interactive source analysis** covers the chapter's first added-note rules, dominant ninth alterations, contextual major-chord colours, and the half-diminished/minor-major/diminished-seventh/whole-tone chord definitions. Dense printed voicing arrays and tune excerpts remain pending. | Enrich compact II-V-I shells, compare natural/flat/sharp ninths, compare maj7/6/6-9 tonic colours, identify four special chord families |
| L06 Tritone substitution | Ch. 6 | **Interactive source analysis** covers G7↔D-flat7 substitution, the shared third-and-seventh tritone, each dominant's ordinary resolution, substitute II-V extension, and the source's warning about bass/melody clashes. Tune excerpts are not reconstructed. | Compare original and substituted II-V-I, hold the shared tritone while moving the root, hear both ordinary V-I resolutions, build A-flatm7-D-flat7-Cmaj7 |
| L07 Left-hand voicings | Ch. 7 | **Interactive source analysis** covers the purpose of rootless left-hand voicings, A-position and B-position II-V-I shapes, half-step voice leading, tonic alternatives, all-keys cycle practice, register limits and closest-position selection. Licensed tune melodies remain untranscribed. | Compare rooted and rootless tonic colour, build both C-major rootless II-V-I positions, carry A-position from C into F |
| L08 Altering notes in left-hand voicings | Ch. 8 | **Interactive source analysis** covers half-diminished variants, flat-nine/flat-thirteen/altered dominant shapes, the altered-dominant tritone-substitution equivalence, sharp-eleven and minor-major overlap, diminished-to-G7b9 derivation, sus/Phrygian reuse, and the chapter's smoothness/register/melody criteria. Licensed tune notation remains untranscribed. | Flatten the fifth inside familiar shapes, compare dominant alterations, reinterpret G7#11 as minor-major colour, derive G7b9 from diminished, reuse Dm7 shapes for Gsus and build E Phrygian |
| L09 Scale theory | Ch. 9 | Source pages present; implementation pending. | Pending |
| L10 Putting scales to work | Ch. 10 | Source pages present; implementation pending. | Pending |
| L11 Practicing scales | Ch. 11 | Source pages present; implementation pending. | Pending |
| L12 So What chords | Ch. 12 | Source pages present; implementation pending. | Pending |
| L13 Fourth chords | Ch. 13 | Source pages present; implementation pending. | Pending |
| L14 Upper structures | Ch. 14 | Source pages present; implementation pending. | Pending |
| L15 Pentatonic scales | Ch. 15 | Source pages present; implementation pending. | Pending |
| L16 Voicings, voicings, voicings | Ch. 16 | Source pages present only through the supplied scan's endpoint; implementation pending and coverage must be verified against the available pages. | Pending |
| L17-L23 | Chs. 17-23 | **Blocked** - chapter pages are absent from the supplied PDF. Only their titles are visible in the table of contents. | Not implemented |

## Rules

1. Every source ID used by a Levine exercise resolves through `levineSourceMaterial`.
2. Book figure numbers are internal provenance only and do not appear in learner-facing teaching or source-card labels.
3. A required source example appears on the same exercise screen before the practice workspace.
4. A practice voicing may be transposed or re-registered, but it is never represented as the source score.
5. Native scores are checked directly against the supplied scan before receiving native status.
6. Tune excerpts and dense voicings remain pending when fidelity cannot be established confidently.
7. Source notation and source playback derive from the same structured events.
