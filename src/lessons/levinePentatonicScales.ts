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

function melodicLine(notes: number[], offset = 0): Array<[number, number[]]> {
  return notes.map((note, index) => [offset + index, [note]]);
}

const lesson = lessonContentSchema.parse({
  id: "levine.pentatonic-scales",
  number: 15,
  title: "Pentatonic scales",
  eyebrow: "Jazz Piano · Chapter 15",
  hero: "Use five-note scales as compact melodic fields that can float across several chords without losing harmonic focus.",
  description:
    "Build the major pentatonic and its modes, use the V pentatonic across a II-V-I, derive it by removing avoid notes, and compare in-sen and altered pentatonic colours.",
  overview:
    "Pentatonic thinking reduces a seven-note scale to a smaller collection with fewer friction points. The useful skill is not merely knowing the five notes, but choosing a pentatonic collection because of how its missing and retained tones interact with the chord underneath.",
});

export const levinePentatonicScalesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.pentatonic-scales.a",
        letter: "A",
        title: "Build the major pentatonic and its minor mode",
        learn:
          "Hear C-D-E-G-A as a five-note major collection, then rotate the same notes so A becomes the center.",
        explanation:
          "The familiar major pentatonic uses scale degrees 1, 2, 3, 5 and 6. In C that gives C-D-E-G-A. Its interval pattern is whole step, whole step, minor third, whole step before the octave closes.\n\nLike a seven-note scale, this collection has modes. Starting the same notes from A gives A-C-D-E-G, the commonly named minor pentatonic sound. No pitch classes have changed - only the tonal center has.",
        instruction:
          "Study the five-note construction. Clear the piano grid. Write C4-D4-E4-G4-A4 on steps 1-5. In bar 3 write A3-C4-D4-E4-G4 on steps 17-21. Play both and listen to how the same five notes change identity when A becomes the center.",
        recognition:
          "Can you hear the second collection as a new tonal center rather than a different set of notes?",
        source: {
          reference: "Chapter Fifteen - Figures 15-2 through 15-5",
          focus:
            "The major pentatonic is 1-2-3-5-6, has five modes, and its fifth mode is the familiar minor pentatonic.",
          exampleIds: ["l15.major-pentatonic"],
        },
        terms: [
          {
            term: "Major pentatonic",
            definition:
              "A five-note major collection containing scale degrees 1, 2, 3, 5 and 6.",
          },
          {
            term: "Minor pentatonic",
            definition:
              "The fifth mode of the major pentatonic collection, heard from its relative-minor center.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare the two pentatonic centers",
        successLabel: "You heard one five-note collection produce major and minor pentatonic identities",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the pentatonic construction",
          complete: studiedSource(experiments, "l15.major-pentatonic"),
        },
        {
          label: "Both pentatonic rotations are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60, 62, 64, 67, 69]),
            ...melodicLine([57, 60, 62, 64, 67], 16),
          ]),
        },
        {
          label: "You entered both five-note collections",
          complete: changedControl(experiments, "harmony.note-edit", 10),
        },
        {
          label: "You listened to the changed center",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.pentatonic-scales.b",
        letter: "B",
        title: "Compare I, IV and V pentatonics in C",
        learn:
          "Build the three major pentatonic collections that occur naturally on C, F and G inside the key of C.",
        explanation:
          "In C major, the pentatonic collections rooted on C, F and G all stay inside the key. They are often described as I, IV and V pentatonics only to show where they come from.\n\nThe three collections overlap heavily but emphasize different colour tones. On D minor seventh, for example, G pentatonic contains B and E - the sixth and ninth of the chord - which gives it a more extended sound than simply staying close to the D-minor chord tones.",
        instruction:
          "Study the three in-key pentatonics. Clear the grid. Write C-D-E-G-A on steps 1-5, F-G-A-C-D on steps 9-13, and G-A-B-D-E on steps 17-21. Play all three and listen for which notes distinguish each collection.",
        recognition:
          "Can you hear the G collection become brighter because B and E remain available?",
        source: {
          reference: "Chapter Fifteen - Figures 15-6 through 15-9",
          focus:
            "C, F and G pentatonic all occur naturally in C major and offer different colours over diatonic harmony.",
          exampleIds: ["l15.in-key-pentatonics"],
        },
        terms: [
          {
            term: "I pentatonic",
            definition:
              "A pentatonic scale rooted on the tonic of the current major key.",
          },
          {
            term: "V pentatonic",
            definition:
              "A pentatonic scale rooted on the dominant of the current major key.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the three in-key pentatonics",
        successLabel: "You heard three overlapping five-note colours inside one major key",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the in-key pentatonic options",
          complete: studiedSource(experiments, "l15.in-key-pentatonics"),
        },
        {
          label: "I, IV and V pentatonics are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60, 62, 64, 67, 69]),
            ...melodicLine([65, 67, 69, 72, 74], 8),
            ...melodicLine([67, 69, 71, 74, 76], 16),
          ]),
        },
        {
          label: "You entered all three pentatonic collections",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to their changing colour",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.pentatonic-scales.c",
        letter: "C",
        title: "Carry G pentatonic across a II-V-I",
        learn:
          "Keep G-A-B-D-E in the upper voice while the harmonic core moves from Dm7 to G7 to Cmaj7.",
        explanation:
          "One of the most practical pentatonic shortcuts in C major is to use the V pentatonic - G-A-B-D-E - across the entire II-V-I. The collection contains no C or F, the two notes that create the most obvious friction against G7 and C major seventh.\n\nKeeping one five-note field while the harmony changes lets the line sound connected. The chord underneath reinterprets the same melody notes as extensions and chord tones.",
        instruction:
          "Study the II-V-I application. Clear the grid. On steps 1-5 combine the Dm7 guide tones F3-C4 with G4-A4-B4-D5-E5. On steps 9-13 use the G7 guide tones F3-B3 under the same five melody notes. On steps 17-21 use E3-B3 for Cmaj7 under the same melody notes. Play the whole loop.",
        recognition:
          "Can you hear the same G pentatonic notes change function as the guide-tone shell changes underneath them?",
        source: {
          reference: "Chapter Fifteen - Figure 15-10 and surrounding discussion",
          focus:
            "The V pentatonic can be used across all three chords of a major-key II-V-I as a simple, connected melodic strategy.",
          exampleIds: ["l15.v-pentatonic-ii-v-i"],
        },
        terms: [
          {
            term: "Common melodic field",
            definition:
              "One pitch collection retained across several chord changes so the line stays connected while note functions change.",
          },
          {
            term: "Guide-tone shell",
            definition:
              "A compact chord core built from tones such as the third and seventh that identify the harmony beneath a line.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Keep one pentatonic over three chords",
        successLabel: "You heard one melodic field take on three different harmonic meanings",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the V-pentatonic II-V-I strategy",
          complete: studiedSource(experiments, "l15.v-pentatonic-ii-v-i"),
        },
        {
          label: "The complete shell-plus-pentatonic study is written",
          complete: exactStudy(harmonySequence, [
            [0,[53,60,67]],[1,[53,60,69]],[2,[53,60,71]],[3,[53,60,74]],[4,[53,60,76]],
            [8,[53,59,67]],[9,[53,59,69]],[10,[53,59,71]],[11,[53,59,74]],[12,[53,59,76]],
            [16,[52,59,67]],[17,[52,59,69]],[18,[52,59,71]],[19,[52,59,74]],[20,[52,59,76]],
          ]),
        },
        {
          label: "You entered all three harmonic settings",
          complete: changedControl(experiments, "harmony.note-edit", 45),
        },
        {
          label: "You listened across the full II-V-I",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.pentatonic-scales.d",
        letter: "D",
        title: "Derive G pentatonic by removing the avoid notes",
        learn:
          "Start from C major and remove C and F, leaving the five-note collection G-A-B-D-E.",
        explanation:
          "Across a II-V-I in C, Dm7 has no avoid note in the C-major collection, G7 makes C the most problematic sustained note, and Cmaj7 makes F the most problematic sustained note. Remove C and F from the seven-note C-major scale and five notes remain: D-E-G-A-B.\n\nThose are exactly the notes of G major pentatonic. This gives a harmonic reason for the V-pentatonic shortcut instead of treating it as an arbitrary rule.",
        instruction:
          "Study the avoid-note derivation. Clear the grid. Write C4-D4-E4-F4-G4-A4-B4 on steps 1-7. In bar 3 write only G4-A4-B4-D5-E5 on steps 17-21. Play the full scale, then the reduced collection.",
        recognition:
          "Can you hear the five-note version as the C-major field with its two strongest sustained clashes removed?",
        source: {
          reference: "Chapter Fifteen - Figures 15-13 and 15-14",
          focus:
            "Removing C and F from C major leaves the V pentatonic, explaining why it works smoothly across a C-major II-V-I.",
          exampleIds: ["l15.avoid-note-derivation"],
        },
        terms: [
          {
            term: "Avoid-note reduction",
            definition:
              "Deriving a smaller pitch collection by removing notes that create the strongest sustained clashes against the harmony.",
          },
          {
            term: "Pentatonic subset",
            definition:
              "A five-note collection contained inside a larger seven-note scale.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Reduce C major to five notes",
        successLabel: "You derived the V pentatonic from harmonic friction rather than memorizing it",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the avoid-note derivation",
          complete: studiedSource(experiments, "l15.avoid-note-derivation"),
        },
        {
          label: "The seven-note and five-note collections are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60,62,64,65,67,69,71]),
            ...melodicLine([67,69,71,74,76], 16),
          ]),
        },
        {
          label: "You entered the full and reduced collections",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the reduction",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.pentatonic-scales.e",
        letter: "E",
        title: "Compare in-sen and altered pentatonic",
        learn:
          "Hear two five-note scales built around E: E-F-A-B-D and E-F-A-B-C-sharp.",
        explanation:
          "Five-note scales are not limited to the familiar major pentatonic. The Japanese in-sen collection shown here is E-F-A-B-D. Its intervals are half step, major third, whole step and minor third. The related altered pentatonic is E-F-A-B-C-sharp, changing only the final note and using half step, major third, whole step, whole step.\n\nBoth can be connected to larger major or melodic-minor systems. Their uneven spacing gives them a very different melodic profile from the more familiar 1-2-3-5-6 pentatonic.",
        instruction:
          "Study the two alternative five-note scales. Clear the grid. Write E4-F4-A4-B4-D5 on steps 1-5. In bar 3 write E4-F4-A4-B4-C-sharp5 on steps 17-21. Play both and focus on D versus C-sharp.",
        recognition:
          "Can you hear how one changed note shifts the collection from the in-sen colour toward melodic-minor-derived altered harmony?",
        source: {
          reference: "Chapter Fifteen - Figures 15-17 through 15-21",
          focus:
            "The in-sen and altered-pentatonic collections are five-note alternatives with characteristic interval patterns and links to major or melodic-minor harmony.",
          exampleIds: ["l15.other-five-note-scales"],
        },
        terms: [
          {
            term: "In-sen",
            definition:
              "A five-note Japanese-derived scale presented here with the interval pattern half step, major third, whole step, minor third.",
          },
          {
            term: "Altered pentatonic",
            definition:
              "A five-note melodic-minor-derived collection presented here with the pattern half step, major third, whole step, whole step.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare two alternative five-note scales",
        successLabel: "You heard how a single pitch change reshapes an uneven five-note collection",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the alternative five-note scales",
          complete: studiedSource(experiments, "l15.other-five-note-scales"),
        },
        {
          label: "Both five-note scales are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([64,65,69,71,74]),
            ...melodicLine([64,65,69,71,73], 16),
          ]),
        },
        {
          label: "You entered both interval patterns",
          complete: changedControl(experiments, "harmony.note-edit", 10),
        },
        {
          label: "You listened to D versus C-sharp",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
