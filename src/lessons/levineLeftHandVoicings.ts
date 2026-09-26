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
  id: "levine.left-hand-voicings",
  number: 7,
  title: "Left-hand voicings",
  eyebrow: "Jazz Piano · Chapter 7",
  hero: "Move the harmony into compact rootless left-hand shapes so the right hand is free for melody and improvisation.",
  description:
    "Learn the two basic rootless II-V-I positions, hear their half-step voice leading, and transpose the same shapes through the cycle of fifths.",
  overview:
    "These voicings remove the root and place thirds, sevenths and extensions in a compact middle register. Their logic is physical as well as harmonic: one note often moves by a half step while the other notes remain close.",
});

export const levineLeftHandVoicingsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.left-hand-voicings.a",
        letter: "A",
        title: "Hear what the rootless voicing keeps",
        learn:
          "Compare a rooted C major seventh with two compact rootless tonic colours.",
        explanation:
          "A left-hand voicing can omit the root completely. The missing root may be supplied by the bass player, implied by the progression, or briefly checked elsewhere on the keyboard. Removing it creates room for the right hand and lets the left hand use colour tones such as the ninth and thirteenth.

The important question is whether the harmony still reads clearly. A compact C-major shape such as E-G-B-D contains the third, fifth, major seventh and ninth. E-G-A-D replaces the major seventh with the sixth while retaining the same tonic identity.",
        instruction:
          "Study the rootless-voicing idea. Clear the piano grid. In bar 1 write C3-E3-G3-B3. In bar 2 remove the root and write E3-G3-B3-D4. In bar 3 write E3-G3-A3-D4. Leave bar 4 empty. Play the loop and listen for what changes when C disappears but the upper structure remains.",
        recognition:
          "Do the two rootless shapes still sound like C-major harmony, and can you hear the ninth or sixth as colour rather than as a new root?",
        source: {
          reference: "Chapter Seven - Figure 7-1 and opening discussion",
          focus:
            "Rootless left-hand voicings free the right hand, sit higher on the keyboard, and use extensions while the bass or context supplies the root.",
          exampleIds: ["l07.rootless-purpose"],
        },
        terms: [
          {
            term: "Rootless voicing",
            definition:
              "A chord voicing that omits the root while retaining enough characteristic tones and context for the harmony to remain identifiable.",
          },
          {
            term: "Extension",
            definition:
              "A chord tone beyond the seventh, such as the ninth, eleventh or thirteenth.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare rooted and rootless tonic colours",
        successLabel: "You heard how the harmony survives after the root is removed",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied why the root can be omitted",
          complete: studiedSource(experiments, "l07.rootless-purpose"),
        },
        {
          label: "The rooted and two rootless C-major shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [48, 52, 55, 59]],
            [8, [52, 55, 59, 62]],
            [16, [52, 55, 57, 62]],
          ]),
        },
        {
          label: "You entered all three shapes",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the rootless comparison",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.left-hand-voicings.b",
        letter: "B",
        title: "Play the A-position II-V-I",
        learn:
          "Keep three notes nearly fixed while the seventh of II drops a half step into the third of V.",
        explanation:
          "In the first basic position, Dm7 is F-A-C-E: third, fifth, seventh and ninth. When the harmony moves to G7, only C needs to fall to B. The result F-A-B-E contains the seventh, ninth, third and thirteenth of G7.

For the tonic, E-G-A-D gives the third, fifth, sixth and ninth of C. The lowest note therefore follows a simple pattern across the progression: third of II, seventh of V, third of I. This is commonly called the A position.",
        instruction:
          "Study the A-position voice leading. Clear the grid. Write F3-A3-C4-E4 in bar 1, F3-A3-B3-E4 in bar 2, and E3-G3-A3-D4 in bar 3. Leave bar 4 empty. Play the loop and follow C4-B3 while the other notes stay close.",
        recognition:
          "Can you hear that the move from II to V is produced mainly by one half-step change rather than by rebuilding the chord?",
        source: {
          reference: "Chapter Seven - Figures 7-2 and 7-3",
          focus:
            "The A-position II-V-I uses rootless Dm7, G7 and C-major voicings with the little finger on third, seventh and third.",
          exampleIds: ["l07.a-position"],
        },
        terms: [
          {
            term: "A position",
            definition:
              "The basic rootless position in which the lowest note follows third-seventh-third across a major-key II-V-I.",
          },
          {
            term: "Common tone",
            definition:
              "A note retained while the chord changes around it.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the A-position II-V-I",
        successLabel: "You heard the seventh of II fall by a half step while the voicing stayed compact",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the A-position pattern",
          complete: studiedSource(experiments, "l07.a-position"),
        },
        {
          label: "The complete A-position II-V-I is written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 57, 60, 64]],
            [8, [53, 57, 59, 64]],
            [16, [52, 55, 57, 62]],
          ]),
        },
        {
          label: "You entered the three voicings",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the half-step voice leading",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.left-hand-voicings.c",
        letter: "C",
        title: "Play the B-position II-V-I",
        learn:
          "Invert the same rootless material so the lowest note follows seventh-third-seventh.",
        explanation:
          "The second basic position reverses the lowest-note pattern. Dm7 becomes C-E-F-A: seventh, ninth, third and fifth. Lower C to B and the G7 voicing becomes B-E-F-A: third, thirteenth, seventh and ninth.

The tonic can then be B-C-E-G, heard as major seventh, root, third and fifth. A common alternative replaces the root C with the ninth D. The lowest note now follows seventh of II, third of V, seventh of I. This is the B position.",
        instruction:
          "Study the B-position pattern. Clear the grid. Use the higher register so every note fits comfortably: C4-E4-F4-A4 in bar 1, B3-E4-F4-A4 in bar 2, and B3-C4-E4-G4 in bar 3. Leave bar 4 empty and play the loop.",
        recognition:
          "Does the B-position sequence feel like the same II-V-I mechanism viewed from a different inversion?",
        source: {
          reference: "Chapter Seven - Figures 7-4 through 7-6",
          focus:
            "The B position rearranges the same rootless material so the little finger follows seventh, third and seventh.",
          exampleIds: ["l07.b-position"],
        },
        terms: [
          {
            term: "B position",
            definition:
              "The basic rootless position in which the lowest note follows seventh-third-seventh across a major-key II-V-I.",
          },
          {
            term: "Inversion",
            definition:
              "A rearrangement of chord tones that changes their vertical order while preserving the harmonic identity.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the B-position II-V-I",
        successLabel: "You heard the complementary rootless position without changing the harmonic function",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the B-position pattern",
          complete: studiedSource(experiments, "l07.b-position"),
        },
        {
          label: "The complete B-position II-V-I is written",
          complete: exactStudy(harmonySequence, [
            [0, [60, 64, 65, 69]],
            [8, [59, 64, 65, 69]],
            [16, [59, 60, 64, 67]],
          ]),
        },
        {
          label: "You entered the three voicings",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the inverted position",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.left-hand-voicings.d",
        letter: "D",
        title: "Carry the position into the next key",
        learn:
          "Move the same A-position rule from C major to F major instead of memorizing isolated shapes.",
        explanation:
          "The positions are meant to be practiced through all twelve keys. The cycle of fifths gives a systematic route: after C, move to F, then B-flat, E-flat and onward. The rule stays the same even though every absolute pitch changes.

When the chord change is a II-V, the seventh of II falls by a half step. Keep the left-hand shape in a useful middle register and learn the sound and physical shape together rather than calculating every interval from scratch each time.",
        instruction:
          "Study the transposition routine. Clear the grid. Put the C-major A-position II-V-I on bar 1 beat 1, bar 1 beat 3 and bar 2 beat 1: F3-A3-C4-E4, F3-A3-B3-E4, E3-G3-A3-D4. Then put the same rule in F major on bar 3 beat 1, bar 3 beat 3 and bar 4 beat 1: B-flat3-D4-F4-A4, B-flat3-D4-E4-A4, A3-C4-D4-G4. Play the whole four-bar loop.",
        recognition:
          "Can you follow the same third-seventh-third pattern in both keys without treating the F-major version as a separate trick?",
        source: {
          reference: "Chapter Seven - cycle-of-fifths practice and practice tips",
          focus:
            "Both left-hand positions are practiced through all twelve keys, with smooth register and the II-to-V half-step rule kept consistent.",
          exampleIds: ["l07.cycle-practice"],
        },
        terms: [
          {
            term: "Cycle of fifths",
            definition:
              "A twelve-key route used here to move the same voicing problem systematically from one key to the next.",
          },
          {
            term: "Register",
            definition:
              "The pitch range in which a voicing is placed; rootless left-hand shapes are kept in a compact middle range to avoid muddiness.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transpose the rootless pattern",
        successLabel: "You carried the same voice-leading rule from C major into F major",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the all-keys practice rule",
          complete: studiedSource(experiments, "l07.cycle-practice"),
        },
        {
          label: "The C-major and F-major II-V-I shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 57, 60, 64]],
            [4, [53, 57, 59, 64]],
            [8, [52, 55, 57, 62]],
            [16, [58, 62, 65, 69]],
            [20, [58, 62, 64, 69]],
            [24, [57, 60, 62, 67]],
          ]),
        },
        {
          label: "You entered both keys yourself",
          complete: changedControl(experiments, "harmony.note-edit", 24),
        },
        {
          label: "You listened across the key change",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
