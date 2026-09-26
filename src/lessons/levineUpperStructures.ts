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
  id: "levine.upper-structures",
  number: 14,
  title: "Upper structures",
  eyebrow: "Jazz Piano · Chapter 14",
  hero: "Place a simple triad above a dominant tritone and let that triad organize complex ninths, sharp elevenths and altered tensions.",
  description:
    "Build upper-structure triads over the third and seventh of a dominant chord, learn the basic labels, invert the triads, and connect them to Lydian-dominant, altered and diminished scale families.",
  overview:
    "Upper structures turn dense altered harmony into familiar hand shapes. The left hand supplies the dominant guide tones while the right hand plays a major or minor triad whose root names the upper structure relative to the chord root.",
});

export const levineUpperStructuresLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.upper-structures.a",
        letter: "A",
        title: "Put a D-major triad over the C7 tritone",
        learn:
          "Build C7 sharp-eleven/thirteen colour from the left-hand tritone E-B-flat and a right-hand D-major triad.",
        explanation:
          "An upper structure is a triad placed above a dominant chord's third and seventh. For C7, the guide-tone tritone is E and B-flat. Add a D-major triad above it: D-F-sharp-A. Relative to C, those upper notes are the ninth, sharp eleventh and thirteenth.\n\nBecause D is a major second above C, this is called upper structure II. The label describes the root of the triad, not every extension separately.",
        instruction:
          "Study the basic construction. Clear the grid. In bar 1 write only E3-B-flat3. In bar 2 add the D-major triad above it: E3-B-flat3-D4-F-sharp4-A4. In bar 3 add C3 in the bass to hear the complete dominant root. Leave bar 4 empty and play the three stages.",
        recognition:
          "Can you hear the complex dominant colour as one simple D-major hand shape sitting above the E-B-flat tritone?",
        source: {
          reference: "Chapter Fourteen - Figures 14-2 and 14-3",
          focus:
            "An upper structure is a triad over a dominant tritone; D major over the C7 guide tones supplies 9, sharp 11 and 13 and is named upper structure II.",
          exampleIds: ["l14.basic-upper-structure"],
        },
        terms: [
          {
            term: "Upper structure",
            definition:
              "A major or minor triad placed above the guide tones of a larger chord to organize its extensions and alterations.",
          },
          {
            term: "Upper structure II",
            definition:
              "An upper triad whose root lies a major second above the chord root.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the dominant in three layers",
        successLabel: "You heard three altered tensions as one familiar major triad",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the triad-over-tritone construction",
          complete: studiedSource(experiments, "l14.basic-upper-structure"),
        },
        {
          label: "The tritone, upper structure and rooted dominant are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 58]],
            [8, [52, 58, 62, 66, 69]],
            [16, [48, 52, 58, 62, 66, 69]],
          ]),
        },
        {
          label: "You entered all three layers",
          complete: changedControl(experiments, "harmony.note-edit", 13),
        },
        {
          label: "You listened to the colour accumulate",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.upper-structures.b",
        letter: "B",
        title: "Compare four basic upper structures",
        learn:
          "Keep E-B-flat fixed and change only the right-hand triad to hear four distinct dominant colours.",
        explanation:
          "The same C7 guide-tone tritone can support several upper triads. D major gives upper structure II. A-flat major gives upper structure flat VI. A major gives upper structure VI. F-sharp minor gives upper structure sharp IV minor.\n\nThe power of the system is practical: each complex dominant colour becomes a familiar three-note hand shape. You can invert the triad later without changing its upper-structure identity.",
        instruction:
          "Study the four basic structures. Clear the grid. Over E3-B-flat3, write D4-F-sharp4-A4 in bar 1, E-flat4-A-flat4-C5 in bar 2, E4-A4-C-sharp5 in bar 3, and C-sharp4-F-sharp4-A4 in bar 4. Play all four while keeping the left-hand tritone conceptually fixed.",
        recognition:
          "Can you identify each colour by the right-hand triad shape instead of calculating every altered extension individually?",
        source: {
          reference: "Chapter Fourteen - Figures 14-2 through 14-6",
          focus:
            "The basic upper-structure set includes II, flat VI, VI and sharp IV minor over a dominant tritone, with triads usable in inversion.",
          exampleIds: ["l14.basic-family"],
        },
        terms: [
          {
            term: "Guide-tone tritone",
            definition:
              "The dominant chord's third and minor seventh, whose tritone strongly defines the harmony.",
          },
          {
            term: "Upper-structure label",
            definition:
              "The interval from the underlying chord root to the root of the upper triad, with minor added when the triad itself is minor.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare four right-hand triads",
        successLabel: "You heard four dominant colours while the left-hand guide tones stayed unchanged",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the basic upper-structure family",
          complete: studiedSource(experiments, "l14.basic-family"),
        },
        {
          label: "Four upper structures are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 58, 62, 66, 69]],
            [8, [52, 58, 63, 68, 72]],
            [16, [52, 58, 64, 69, 73]],
            [24, [52, 58, 61, 66, 69]],
          ]),
        },
        {
          label: "You entered all four structures",
          complete: changedControl(experiments, "harmony.note-edit", 20),
        },
        {
          label: "You listened to the changing triad colour",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.upper-structures.c",
        letter: "C",
        title: "Invert the upper triad, not the dominant core",
        learn:
          "Keep the C7 guide tones stationary while rotating the D-major triad through its three positions.",
        explanation:
          "An upper structure is still a triad, so normal triad inversions remain available. Inverting the right hand changes register and melodic top note without changing the underlying upper-structure label.\n\nThis is one of the easiest ways to make the same altered dominant fit different melodies: the left hand stays stable while the right hand chooses the inversion whose top note and spacing work best.",
        instruction:
          "Study the inversion rule. Clear the grid. Over E3-B-flat3, write D4-F-sharp4-A4 in bar 1, F-sharp4-A4-D5 in bar 2, and A4-D5-F-sharp5 in bar 3. Leave bar 4 empty and play the three positions.",
        recognition:
          "Can you hear the same dominant colour survive while the top note changes from A to D to F-sharp?",
        source: {
          reference: "Chapter Fourteen - Figure 14-3 and accompanying inversion discussion",
          focus:
            "The upper triad may be played in root position or either inversion while the dominant tritone remains below it.",
          exampleIds: ["l14.inversions"],
        },
        terms: [
          {
            term: "Upper-triad inversion",
            definition:
              "Reordering only the triad above the dominant core while preserving its triad identity.",
          },
          {
            term: "Top-note choice",
            definition:
              "Selecting an inversion partly by which note appears highest and therefore interacts most directly with the melody.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Rotate the D-major upper structure",
        successLabel: "You changed melody and spacing without changing the underlying dominant colour",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied upper-triad inversion",
          complete: studiedSource(experiments, "l14.inversions"),
        },
        {
          label: "All three D-major positions are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 58, 62, 66, 69]],
            [8, [52, 58, 66, 69, 74]],
            [16, [52, 58, 69, 74, 78]],
          ]),
        },
        {
          label: "You entered all three inversions",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to the changing top note",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.upper-structures.d",
        letter: "D",
        title: "Connect upper structures to scale families",
        learn:
          "Hear one triad from Lydian-dominant harmony, one from altered harmony and one from diminished harmony over the same C7 guide tones.",
        explanation:
          "Upper structures are not arbitrary triads. Their notes can be traced back to the scale family used for the dominant. Over C7, D major belongs naturally to C Lydian dominant; A-flat major belongs to the altered collection; E-flat major belongs to the half-step/whole-step diminished collection.\n\nThinking this way links the voicing vocabulary back to the scale theory you already practiced. The scale tells you which triads are available, and the triad gives your hand a compact way to play several tensions at once.",
        instruction:
          "Study the scale-family map. Clear the grid. Over E3-B-flat3, write D4-F-sharp4-A4 in bar 1, E-flat4-A-flat4-C5 in bar 2, and E-flat4-G4-B-flat4 in bar 3. Leave bar 4 empty and play the three colours.",
        recognition:
          "Can you hear each right-hand triad as a compact slice of a larger dominant scale rather than as an unrelated substitution?",
        source: {
          reference: "Chapter Fourteen - Figures 14-14 and 14-15",
          focus:
            "The complete upper-structure vocabulary is organized by Lydian-dominant, altered and half-step/whole-step diminished scale sources.",
          exampleIds: ["l14.scale-families"],
        },
        terms: [
          {
            term: "Scale-derived upper structure",
            definition:
              "An upper triad whose notes are drawn from the scale or mode being used over the underlying chord.",
          },
          {
            term: "Interchangeable voicing",
            definition:
              "A voicing that can serve more than one chord when those chords derive from the same pitch collection and the bass supplies the differing root.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare three scale-derived triads",
        successLabel: "You connected upper-structure hand shapes to the dominant scales behind them",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the scale-family organization",
          complete: studiedSource(experiments, "l14.scale-families"),
        },
        {
          label: "Three scale-derived upper structures are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 58, 62, 66, 69]],
            [8, [52, 58, 63, 68, 72]],
            [16, [52, 55, 58, 63, 67]],
          ]),
        },
        {
          label: "You entered the three scale-family examples",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to the three dominant colours",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.upper-structures.e",
        letter: "E",
        title: "Exploit diminished symmetry",
        learn:
          "Move major triads by minor thirds inside one diminished collection and hear why several dominant-flat-nine colours are closely related.",
        explanation:
          "Diminished harmony repeats at the interval of a minor third. That means triads and dominant colours drawn from one diminished collection can also be related by minor-third motion.\n\nOver a G-dominant guide-tone core, major triads rooted on B-flat, D-flat, E and G all draw their notes from the same G half-step/whole-step diminished collection. Treat the movement as one family of interchangeable colours rather than four unrelated chords.",
        instruction:
          "Study the diminished-symmetry application. Clear the grid. Keep B3-F4 as the dominant core. Add F4-B-flat4-D5 in bar 1, D-flat4-F4-A-flat4 in bar 2, E4-G-sharp4-B4 in bar 3, and G4-B4-D5 in bar 4. Play the four bars and track the upper-triad roots by minor thirds.",
        recognition:
          "Can you hear the upper structures as rotations of one symmetrical pitch field rather than separate dominant tricks?",
        source: {
          reference: "Chapter Fourteen - Figures 14-11, 14-17 through 14-22",
          focus:
            "Diminished-derived upper structures and dominant-flat-nine voicings move naturally by minor thirds because the underlying diminished scale repeats at that interval.",
          exampleIds: ["l14.diminished-symmetry"],
        },
        terms: [
          {
            term: "Minor-third cycle",
            definition:
              "A sequence of roots separated by three semitones, which preserves a diminished pitch collection.",
          },
          {
            term: "Diminished interchangeability",
            definition:
              "The close relationship among chords and voicings whose roots or upper structures belong to the same symmetrical diminished scale.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Cycle the upper structures by minor thirds",
        successLabel: "You used diminished symmetry to organize a family of upper-structure colours",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the diminished-symmetry application",
          complete: studiedSource(experiments, "l14.diminished-symmetry"),
        },
        {
          label: "Four diminished-related upper structures are written",
          complete: exactStudy(harmonySequence, [
            [0, [59, 65, 70, 74]],
            [8, [59, 61, 65, 68]],
            [16, [59, 64, 68, 71]],
            [24, [59, 67, 71, 74]],
          ]),
        },
        {
          label: "You entered all four upper structures",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the minor-third cycle",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
