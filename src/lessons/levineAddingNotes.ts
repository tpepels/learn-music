import { changedControl, heardPlayback, studiedSource } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function sameNotes(actual: number[] | undefined, expected: number[]): boolean {
  if (!actual || actual.length !== expected.length) return false;
  const left = [...actual].sort((a, b) => a - b);
  const right = [...expected].sort((a, b) => a - b);
  return left.every((note, index) => note === right[index]);
}

function exactStudy(
  sequence: LessonContext["harmonySequence"],
  entries: Array<[number, number[]]>,
): boolean {
  const expectedSteps = new Set(entries.map(([step]) => step));
  return (
    entries.every(([step, notes]) => sameNotes(sequence[step], notes)) &&
    sequence.every((notes, step) => notes.length === 0 || expectedSteps.has(step))
  );
}

const lesson = lessonContentSchema.parse({
  id: "levine.adding-notes",
  number: 5,
  title: "Adding notes to three-note voicings",
  eyebrow: "Jazz Piano · Chapter 5",
  hero: "Expand the root-third-seventh skeleton without losing its voice leading.",
  description:
    "Add characteristic fifths, ninths, altered tones and tonic colours to the compact voicings from Chapter 3, then separate common seventh-chord extensions from special chord families.",
  overview:
    "The chapter does not give one fixed recipe for every chord. It starts from clear default additions, then shows that melody, register, density and harmonic function determine which extra notes actually work.",
});

export const levineAddingNotesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.adding-notes.a",
        letter: "A",
        title: "Enrich the three-note II-V-I",
        learn:
          "Add the fifth to II, the ninth to V and the fifth to I while keeping the guide-tone skeleton intact.",
        explanation:
          "The easiest expansion of the three-note voicings is deliberately conservative. On an unaltered major-key II-V-I, add the fifth to the II chord, the ninth - or sometimes flat ninth - to the V chord, and the fifth to the I chord. The root, third and seventh still carry the harmonic identity; the added note supplies colour.\n\nA useful connection appears between II and V: the fifth of the II chord becomes the ninth of the V chord. In C major, A belongs to both Dm7 and G9. Keeping that A in place makes the richer voicing feel like an extension of the voice-leading you already learned rather than a new stack for every chord.",
        instruction:
          "Study the first added-note rules. Clear the grid. In bars 1-3 write D3-F4-A4-C5, G3-F4-A4-B4, and C3-E4-G4-B4. Leave bar 4 empty. Play the progression and follow A4 from the D-minor fifth into the G-dominant ninth while the guide tones continue their familiar half-step resolutions.",
        recognition:
          "Can you hear the added note as colour while the third-and-seventh voice leading still tells you where the progression is going?",
        source: {
          reference: "Chapter Five - Figures 5-1 through 5-3",
          focus:
            "The first enrichment rule adds the fifth to II, ninth or flat ninth to V, and fifth to I; the fifth of II and ninth of V can be a common tone.",
          exampleIds: ["l05.add-to-shells"],
        },
        terms: [
          {
            term: "Added note",
            definition:
              "A chord tone or extension placed into a basic voicing without replacing its essential harmonic identity.",
          },
          {
            term: "Common tone",
            definition:
              "A pitch that can stay unchanged while the surrounding harmony moves to a new chord.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Enrich the II-V-I",
        successLabel: "You added colour without breaking the compact voice leading",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the added-note rule",
          complete: studiedSource(experiments, "l05.add-to-shells"),
        },
        {
          label: "The enriched II-V-I is written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 65, 69, 72]],
            [8, [55, 65, 69, 71]],
            [16, [48, 64, 67, 71]],
          ]),
        },
        {
          label: "You entered the voicings yourself",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the common-tone motion",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.adding-notes.b",
        letter: "B",
        title: "Change the dominant ninth",
        learn:
          "Hear natural nine, flat nine and sharp nine as concrete pitch changes above the same dominant core.",
        explanation:
          "Dominant seventh chords accept several colours in this chapter. The ninth can remain natural, move down to flat nine, or move up to sharp nine. The chord symbol is describing a pitch relationship, not an abstract degree of tension: on G7 those three colours are A, A-flat and A-sharp above the same G-B-F dominant framework.\n\nKeeping the root, third and seventh unchanged isolates what the alteration does. The colour is strong because the altered ninth sits close to stable chord tones, so spacing and register have a large effect on how harsh or usable it sounds.",
        instruction:
          "Study the dominant-colour map. Clear the grid. Write G3-B3-F4-A4 in bar 1, G3-B3-F4-A-flat4 in bar 2, and G3-B3-F4-A-sharp4 in bar 3. Leave bar 4 empty. Play the three chords and focus only on the highest note moving A-A-flat-A-sharp around the unchanged G7 core.",
        recognition:
          "Can you identify which ninth is natural, lowered and raised without looking at the grid?",
        source: {
          reference: "Chapter Five - Figures 5-11a through 5-11h",
          focus:
            "The dominant family includes natural and altered ninths alongside other common alterations and extensions.",
          exampleIds: ["l05.dominant-colour"],
        },
        terms: [
          {
            term: "Flat ninth",
            definition:
              "The ninth lowered by a semitone; on G7 this pitch is A-flat.",
          },
          {
            term: "Sharp ninth",
            definition:
              "The ninth raised by a semitone; on G7 this pitch is A-sharp.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare three ninth colours",
        successLabel: "You heard altered chord-symbol numbers as actual pitch changes",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the dominant additions",
          complete: studiedSource(experiments, "l05.dominant-colour"),
        },
        {
          label: "Natural, flat and sharp ninths are written",
          complete: exactStudy(harmonySequence, [
            [0, [55, 59, 65, 69]],
            [8, [55, 59, 65, 68]],
            [16, [55, 59, 65, 70]],
          ]),
        },
        {
          label: "You entered the three dominant colours",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to all three ninths",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.adding-notes.c",
        letter: "C",
        title: "Choose tonic colour by context",
        learn:
          "Compare major seventh, sixth and sixth-plus-ninth colours without treating any one of them as the compulsory major-tonic voicing.",
        explanation:
          "Major chords in this chapter can take the fifth, sixth, ninth, sharp fourth or raised fifth in different contexts. The sixth is especially important because it can replace the major seventh in a tonic-major sound, and the sixth and ninth can appear together.\n\nThere are no hard-and-fast rules that choose the final voicing for you. A melody note may already supply a chord tone; a dense voicing behaves differently from a sparse one; high register is clearer than the same cluster low on the keyboard. The practical skill is to hear how the added note changes the chord without losing the underlying major quality.",
        instruction:
          "Study the major-chord colour choices. Clear the grid. In bar 1 write C3-E3-G3-B3. In bar 2 replace B with A: C3-E3-G3-A3. In bar 3 write C3-E3-A3-D4 to hear sixth and ninth together. Leave bar 4 empty. Play the three chords at the same tempo and compare the top-colour change rather than judging one as universally correct.",
        recognition:
          "Do major seventh, sixth and sixth-plus-ninth all keep a tonic-major identity while changing the amount and kind of colour?",
        source: {
          reference: "Chapter Five - Figures 5-8 through 5-12",
          focus:
            "Added-note choice depends on melody, register and density; major chords may use sixth and ninth as alternatives or additions to the major seventh.",
          exampleIds: ["l05.major-colour-context"],
        },
        terms: [
          {
            term: "Sixth chord",
            definition:
              "A major or minor triad coloured by scale degree six, sometimes used instead of the seventh in a tonic function.",
          },
          {
            term: "Register",
            definition:
              "The pitch range in which a voicing is placed; the same intervals can sound clearer or muddier at different heights.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare three tonic colours",
        successLabel: "You heard voicing choice as a contextual decision rather than a fixed recipe",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the contextual colour choices",
          complete: studiedSource(experiments, "l05.major-colour-context"),
        },
        {
          label: "Major seventh, sixth and sixth-plus-ninth are written",
          complete: exactStudy(harmonySequence, [
            [0, [48, 52, 55, 59]],
            [8, [48, 52, 55, 57]],
            [16, [48, 52, 57, 62]],
          ]),
        },
        {
          label: "You entered all three tonic colours",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the colour comparison",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.adding-notes.d",
        letter: "D",
        title: "Separate four special chord families",
        learn:
          "Recognize half-diminished, minor-major seventh, diminished seventh and augmented-dominant sounds by their actual interval formulas and functions.",
        explanation:
          "Several chords at the end of the chapter need their own identities. A half-diminished chord is a minor seventh chord with a flat fifth and commonly functions as II in a minor-key II-V-I. A minor-major seventh combines a minor third and perfect fifth with a major seventh and normally behaves as a tonic-minor colour rather than as II.\n\nA diminished seventh chord is built as a chain of minor thirds. The whole-tone dominant shown here has a major third, augmented fifth and minor seventh; it often functions as V. These labels are not interchangeable alterations of one generic seventh chord, so play them side by side and learn the interval structure that makes each one distinct.",
        instruction:
          "Study the four special families. Clear the grid. Write D3-F3-A-flat3-C4 in bar 1, C3-E-flat3-G3-B3 in bar 2, C3-E-flat3-G-flat3-A3 in bar 3, and C3-E3-G-sharp3-B-flat3 in bar 4. Play the loop and name each formula before checking the label.",
        recognition:
          "Can you hear which chord contains the flat fifth, which has the major seventh over a minor triad, which stacks minor thirds, and which has the augmented fifth?",
        source: {
          reference: "Chapter Five - Figures 5-10 through 5-16",
          focus:
            "The chapter distinguishes half-diminished, minor-major seventh, diminished seventh and whole-tone dominant structures and their common functions.",
          exampleIds: ["l05.special-chords"],
        },
        terms: [
          {
            term: "Half-diminished",
            definition:
              "A minor seventh chord with a flattened fifth, commonly used as II in minor harmony.",
          },
          {
            term: "Minor-major seventh",
            definition:
              "A minor triad with a major seventh, commonly heard as a tonic-minor colour.",
          },
          {
            term: "Diminished seventh",
            definition:
              "A four-note chord formed by stacking three minor thirds.",
          },
          {
            term: "Whole-tone dominant",
            definition:
              "A dominant-seventh sonority with an augmented fifth, associated with whole-tone colour.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build all four special chord types",
        successLabel: "You separated four easily confused seventh-chord families by sound and interval content",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the special chord families",
          complete: studiedSource(experiments, "l05.special-chords"),
        },
        {
          label: "All four chord families are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 53, 56, 60]],
            [8, [48, 51, 55, 59]],
            [16, [48, 51, 54, 57]],
            [24, [48, 52, 56, 58]],
          ]),
        },
        {
          label: "You entered all four structures",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the four-family comparison",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
