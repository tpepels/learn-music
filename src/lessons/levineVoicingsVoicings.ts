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
  id: "levine.voicings-voicings-voicings",
  number: 16,
  title: "Voicings, voicings, voicings",
  eyebrow: "Jazz Piano · Chapter 16",
  hero: "Mix quartal, upper-structure, diminished and compact intervallic voicings so a progression changes colour without losing voice-leading.",
  description:
    "Combine earlier voicing systems inside II-V-I progressions, exploit diminished symmetry, split a diminished scale between the hands, and learn compact three-note 'bite' voicings.",
  overview:
    "The chapter's central idea is variety. A pianist does not need one canonical shape for each chord. Different voicing families can be combined so long as the harmony remains clear and the voices move convincingly.",
});

export const levineVoicingsVoicingsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.voicings-voicings-voicings.a",
        letter: "A",
        title: "Mix three voicing languages through II-V-I",
        learn:
          "Move from a So What Dm7 shape to a G7 flat-nine upper structure and resolve into a C-major fourth voicing.",
        explanation:
          "A progression does not need to use one voicing system from beginning to end. A D-minor So What shape can move into an altered dominant upper structure and then into a fourth-based tonic voicing.\n\nThe important test is the connection between the shapes. If common tones remain and the other voices move by small intervals, the ear hears one continuous harmonic background even though the construction method changes at every chord.",
        instruction:
          "Study the mixed-voicing progression. Clear the grid. Write D3-G3-C4-F4-A4 in bar 1 for Dm7. In bar 2 write B3-E4-F4-G-sharp4-B4 for G7 flat nine using upper structure VI. In bar 3 write E3-A3-D4-G4-C5 for C major. Leave bar 4 empty and play the progression.",
        recognition:
          "Can you hear the construction method change while the progression itself still feels smoothly connected?",
        source: {
          reference: "Chapter Sixteen - Figures 16-1 through 16-6",
          focus:
            "So What, upper-structure and fourth voicings are deliberately combined inside II-V-I progressions to create variety with smooth voice leading.",
          exampleIds: ["l16.mixed-voicing-ii-v-i"],
        },
        terms: [
          {
            term: "Mixed voicing language",
            definition:
              "Using different chord-construction systems within one progression instead of forcing every chord into the same type of shape.",
          },
          {
            term: "Harmonic background",
            definition:
              "The connected field of chord colour behind a melody or improvisation.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Combine three voicing systems",
        successLabel: "You changed voicing vocabulary without breaking the II-V-I connection",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the mixed-voicing progression",
          complete: studiedSource(experiments, "l16.mixed-voicing-ii-v-i"),
        },
        {
          label: "The three contrasting voicings are written",
          complete: exactStudy(harmonySequence, [
            [0,[50,55,60,65,69]],
            [8,[59,64,65,68,71]],
            [16,[52,57,62,67,72]],
          ]),
        },
        {
          label: "You entered the complete progression",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to the changing voicing language",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.voicings-voicings-voicings.b",
        letter: "B",
        title: "Move dominant colour by minor thirds",
        learn:
          "Keep the dominant function while shifting diminished-derived upper material through a minor-third cycle.",
        explanation:
          "A dominant flat-nine chord can draw its upper material from a half-step/whole-step diminished scale. Because that scale repeats every minor third, related upper structures can move by minor thirds while the dominant function remains in place.\n\nThis creates motion inside one dominant area without inventing unrelated chords. The repeated symmetry makes the movement sound organized even when the voicing becomes dense.",
        instruction:
          "Study the diminished motion. Clear the grid. Keep B3-F4 as the G7 guide-tone core. In bar 1 add E4-G-sharp4-B4. In bar 2 add G4-B4-D5. In bar 3 add B-flat4-D5-F5. Leave bar 4 empty and play the three related colours.",
        recognition:
          "Can you hear the right-hand structures cycle by minor thirds while B-F keeps the dominant identity stable?",
        source: {
          reference: "Chapter Sixteen - Figures 16-6 through 16-11",
          focus:
            "Diminished-derived dominant voicings are moved by minor thirds, extending the symmetrical logic introduced earlier.",
          exampleIds: ["l16.diminished-motion"],
        },
        terms: [
          {
            term: "Internal dominant motion",
            definition:
              "Changing the upper colour of a dominant chord while preserving its underlying function.",
          },
          {
            term: "Minor-third symmetry",
            definition:
              "The property of diminished harmony that reproduces the same pitch collection after transposition by three semitones.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Cycle the dominant colour",
        successLabel: "You created motion inside one dominant function using diminished symmetry",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied diminished-derived dominant motion",
          complete: studiedSource(experiments, "l16.diminished-motion"),
        },
        {
          label: "Three minor-third-related colours are written",
          complete: exactStudy(harmonySequence, [
            [0,[59,64,65,68,71]],
            [8,[59,65,67,71,74]],
            [16,[59,65,70,74,77]],
          ]),
        },
        {
          label: "You entered all three dominant colours",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened through the minor-third cycle",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.voicings-voicings-voicings.c",
        letter: "C",
        title: "Split one diminished scale between the hands",
        learn:
          "Combine two diminished-seventh chords whose notes interlock to produce all eight notes of one diminished scale.",
        explanation:
          "One striking diminished voicing places one diminished-seventh chord in each hand. For a D7 flat-nine colour, the left hand can play F-sharp diminished seventh while the right hand plays D diminished seventh.\n\nThe two four-note chords interlock rather than duplicate each other. Together they contain all eight pitch classes of the relevant diminished scale, turning a scale concept into a large keyboard sonority.",
        instruction:
          "Study the double-diminished construction. Clear the grid. In bar 1 write F-sharp2-A2-C3-E-flat3. In bar 2 write F3-A-flat3-B3-D4. In bar 3 combine both hands into one eight-note sonority. Leave bar 4 empty and play the three stages.",
        recognition:
          "Can you hear the final sonority as two simple symmetrical chords combining into one complete diminished field?",
        source: {
          reference: "Chapter Sixteen - Figures 16-8 through 16-11",
          focus:
            "Two diminished-seventh chords can be placed in opposite hands so their combined notes form the entire diminished scale.",
          exampleIds: ["l16.double-diminished"],
        },
        terms: [
          {
            term: "Double diminished",
            definition:
              "A voicing made by combining two diminished-seventh chords that together cover an eight-note diminished scale.",
          },
          {
            term: "Interlocking",
            definition:
              "Two note sets filling the gaps in one another instead of duplicating the same pitches.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Assemble the eight-note diminished sonority",
        successLabel: "You turned two diminished-seventh shapes into one complete symmetrical scale",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the double-diminished construction",
          complete: studiedSource(experiments, "l16.double-diminished"),
        },
        {
          label: "Both component chords and the combined sonority are written",
          complete: exactStudy(harmonySequence, [
            [0,[42,45,48,51]],
            [8,[53,56,59,62]],
            [16,[42,45,48,51,53,56,59,62]],
          ]),
        },
        {
          label: "You entered both hands and the combination",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the full diminished field",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.voicings-voicings-voicings.d",
        letter: "D",
        title: "Learn the three-note bite",
        learn:
          "Compare compact three-note cells built from half step plus major third with the dominant-flat-nine version built from half step plus minor third.",
        explanation:
          "A very compact three-note voicing can get much of its character from a semitone at the bottom. For C major seventh, B-C-E gives seventh, root and third: a half step followed by a major third. In C major harmony, E-F-A gives another half-step-plus-major-third cell. In C melodic minor, D-E-flat-G does the same.\n\nDominant flat-nine harmony changes the second interval. C-D-flat-E gives root, flat ninth and third: a half step followed by a minor third. The hand shape is tiny, but the harmonic identity is strong.",
        instruction:
          "Study the compact intervallic cells. Clear the grid. Write B3-C4-E4 in bar 1, E4-F4-A4 in bar 2, D4-E-flat4-G4 in bar 3, and C4-D-flat4-E4 in bar 4. Play each shape and compare the interval above the bottom semitone.",
        recognition:
          "Can you distinguish the half-step-plus-major-third family from the tighter dominant-flat-nine version?",
        source: {
          reference: "Chapter Sixteen - Figure 16-31 and surrounding discussion",
          focus:
            "Compact three-note voicings use a bottom half step plus major third in major and melodic-minor harmony, with half step plus minor third for dominant-flat-nine chords.",
          exampleIds: ["l16.three-note-bite"],
        },
        terms: [
          {
            term: "Three-note bite",
            definition:
              "A compact voicing whose close semitone at the bottom gives the chord a distinctive edge.",
          },
          {
            term: "Intervallic formula",
            definition:
              "Remembering a voicing by the intervals between its notes rather than by one fixed chord spelling.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare four compact intervallic cells",
        successLabel: "You heard a small interval change distinguish ordinary and flat-nine harmony",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the three-note interval formulas",
          complete: studiedSource(experiments, "l16.three-note-bite"),
        },
        {
          label: "All four compact cells are written",
          complete: exactStudy(harmonySequence, [
            [0,[59,60,64]],
            [8,[64,65,69]],
            [16,[62,63,67]],
            [24,[60,61,64]],
          ]),
        },
        {
          label: "You entered all four voicings",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to both interval formulas",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
