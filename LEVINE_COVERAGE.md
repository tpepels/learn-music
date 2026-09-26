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
| L04 Sus & Phrygian chords | Ch. 4 | Source pages present; implementation pending. | Pending |
| L05 Adding notes to three-note voicings | Ch. 5 | Source pages present; implementation pending. | Pending |
| L06 Tritone substitution | Ch. 6 | Source pages present; implementation pending. | Pending |
| L07 Left-hand voicings | Ch. 7 | Source pages present; implementation pending. | Pending |
| L08 Altering notes in left-hand voicings | Ch. 8 | Source pages present; implementation pending. | Pending |
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
