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
  id: "levine.tritone-substitution",
  number: 6,
  title: "Tritone substitution",
  eyebrow: "Jazz Piano · Chapter 6",
  hero: "Replace a dominant with the dominant a tritone away by following the third and seventh, not just the root.",
  description:
    "Hear why G7 and D-flat7 can substitute for one another, compare their resolutions, and extend the substitution by preceding the new dominant with its own II chord.",
  overview:
    "The substitution works because the two dominant chords contain the same tritone as their third and seventh, with the note names reinterpreted enharmonically. The changed root can create smoother chromatic bass motion, but the result still has to fit the melody and bass line.",
});

export const levineTritoneSubstitutionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.tritone-substitution.a",
        letter: "A",
        title: "Replace V with the dominant a tritone away",
        learn:
          "Compare Dm7-G7-Cmaj7 with Dm7-D-flat7-Cmaj7 and hear the substituted progression's chromatic bass.",
        explanation:
          "A substitute chord takes the harmonic job of another chord. The most common substitution introduced here replaces a dominant seventh with the dominant whose root lies a tritone away. In C major, D-flat7 can replace G7.\n\nThe bass effect is immediately audible. Dm7-G7-Cmaj7 jumps D-G-C, while Dm7-D-flat7-Cmaj7 gives the descending chromatic line D-D-flat-C. The substitution changes the colour and the bass motion without removing the dominant pull into C.",
        instruction:
          "Study the basic substitution. Clear the grid. In the first half write Dm7, G7, Cmaj7 on steps 1, 5 and 9 as D3-F3-A3-C4, G3-B3-D4-F4, C3-E3-G3-B3. In the second half write Dm7, D-flat7, Cmaj7 on steps 17, 21 and 25 as D3-F3-A3-C4, D-flat3-F3-A-flat3-C-flat4, C3-E3-G3-B3. Play the loop and follow only the lowest note through both versions.",
        recognition:
          "Does D-D-flat-C make the substitute progression sound smoother in the bass even though the middle chord is harmonically more remote by name?",
        source: {
          reference: "Chapter Six - Figures 6-1 through 6-3",
          focus:
            "D-flat7 substitutes for G7 in a II-V-I, creating a chromatic bass line into C.",
          exampleIds: ["l06.basic-substitution"],
        },
        terms: [
          {
            term: "Tritone substitution",
            definition:
              "Replacing a dominant seventh with the dominant seventh whose root lies a tritone away.",
          },
          {
            term: "Chromatic bass",
            definition:
              "Bass motion by consecutive semitones rather than only by diatonic scale steps or larger functional leaps.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write original and substituted progressions",
        successLabel: "You heard the changed dominant as a new route to the same tonic",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the basic substitution",
          complete: studiedSource(experiments, "l06.basic-substitution"),
        },
        {
          label: "Both II-V-I versions are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 53, 57, 60]],
            [4, [55, 59, 62, 65]],
            [8, [48, 52, 55, 59]],
            [16, [50, 53, 57, 60]],
            [20, [49, 53, 56, 59]],
            [24, [48, 52, 55, 59]],
          ]),
        },
        {
          label: "You entered both progressions yourself",
          complete: changedControl(experiments, "harmony.note-edit", 24),
        },
        {
          label: "You listened to both bass lines",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.tritone-substitution.b",
        letter: "B",
        title: "Find the shared tritone",
        learn:
          "Keep B-F fixed while changing only the dominant root from G to D-flat.",
        explanation:
          "The third and seventh are the most important notes for identifying a dominant seventh. On G7 they are B and F, and the interval between them is a tritone. D-flat7 contains the same two sounding pitches: F is its third and C-flat - enharmonically the same piano key as B - is its seventh.\n\nThat shared tritone explains the substitution more directly than memorizing a root-distance rule. The roots G and D-flat are themselves a tritone apart, while the guide tones stay in place and exchange their functional names.",
        instruction:
          "Study the shared-tritone map. Clear the grid. In bar 1 write G3-B3-F4. In bar 2 write D-flat3-C-flat4-F4; on the piano grid C-flat appears on the same key as B3. Leave bars 3-4 empty. Play the two shells back and forth and listen for the unchanged B/C-flat-F interval above the moving root.",
        recognition:
          "Can you hear that almost all of the dominant identity survives when the root moves because the two guide tones do not move at all?",
        source: {
          reference: "Chapter Six - Figures 6-4 and 6-5",
          focus:
            "G7 and D-flat7 share the same third-and-seventh tritone enharmonically, while their roots are also a tritone apart.",
          exampleIds: ["l06.shared-tritone"],
        },
        terms: [
          {
            term: "Enharmonic",
            definition:
              "Two differently spelled notes that use the same piano key, such as B and C-flat.",
          },
          {
            term: "Guide tones",
            definition:
              "The third and seventh whose motion or retention strongly defines a seventh chord's function.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Hold the tritone, change the root",
        successLabel: "You located the shared guide-tone mechanism behind the substitution",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the shared tritone",
          complete: studiedSource(experiments, "l06.shared-tritone"),
        },
        {
          label: "Both dominant shells share B/C-flat and F",
          complete: exactStudy(harmonySequence, [
            [0, [55, 59, 65]],
            [8, [49, 59, 65]],
          ]),
        },
        {
          label: "You entered both shells",
          complete: changedControl(experiments, "harmony.note-edit", 6),
        },
        {
          label: "You listened to the unchanged guide tones",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.tritone-substitution.c",
        letter: "C",
        title: "Resolve each dominant to its own I",
        learn:
          "Hear G7 resolve to C and D-flat7 resolve to G-flat before using either dominant as a substitute.",
        explanation:
          "A dominant seventh is unstable and normally points toward the tonic a fifth below its root. G7 therefore resolves to C. D-flat7 has its own ordinary resolution as well: it resolves to G-flat.\n\nThe substitution becomes easier to hear when both normal resolutions are familiar. D-flat7 can point to G-flat as its own V chord, yet the shared tritone also lets it stand in for G7 and move to C. One sonority can therefore participate in two different harmonic readings depending on what follows.",
        instruction:
          "Study the two normal resolutions. Clear the grid. Write G3-B3-D4-F4 in bar 1 and C3-E3-G3-B3 in bar 2. Write D-flat3-F3-A-flat3-C-flat4 in bar 3 and G-flat3-B-flat3-D-flat4-F4 in bar 4. Play the loop and hear each dominant resolve to the tonic implied by its own root.",
        recognition:
          "Can you hear D-flat7 as a normal V of G-flat before asking your ear to accept it as a substitute V of C?",
        source: {
          reference: "Chapter Six - Figures 6-6 through 6-9",
          focus:
            "The chapter first reinforces ordinary V-I instability, then shows that D-flat7 has its own resolution to G-flat as well as its substitute role for G7.",
          exampleIds: ["l06.dual-resolution"],
        },
        terms: [
          {
            term: "Resolution",
            definition:
              "Movement from an unstable harmony toward a more stable harmonic goal.",
          },
          {
            term: "Dominant function",
            definition:
              "The tendency of a dominant chord to point toward and resolve into a tonic.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Play both ordinary resolutions",
        successLabel: "You heard the substitute dominant as a real dominant with its own tonic",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied both dominant resolutions",
          complete: studiedSource(experiments, "l06.dual-resolution"),
        },
        {
          label: "G7-C and D-flat7-G-flat are both written",
          complete: exactStudy(harmonySequence, [
            [0, [55, 59, 62, 65]],
            [8, [48, 52, 55, 59]],
            [16, [49, 53, 56, 59]],
            [24, [54, 58, 61, 65]],
          ]),
        },
        {
          label: "You entered all four chords",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to both resolutions",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.tritone-substitution.d",
        letter: "D",
        title: "Precede the substitute dominant with its II",
        learn:
          "Turn the substitute D-flat7 into a complete A-flat-minor7-D-flat7 II-V before resolving to C.",
        explanation:
          "Bebop practice extends tritone substitution by treating the substitute dominant as a real V chord and placing its own II before it. If D-flat7 substitutes for G7, A-flat minor seventh can precede D-flat7, giving A-flat-minor7-D-flat7-Cmaj7.\n\nThis increases harmonic motion and can create a striking bass route, but the chapter explicitly warns against using the device mechanically. A substitution may produce an awkward bass line or clash with the melody. The shared tritone explains why the harmony can work; the surrounding music decides whether it actually does.",
        instruction:
          "Study the substitute II-V route and the caution attached to it. Clear the grid. Write A-flat3-C-flat4-E-flat4-G-flat4 in bar 1, D-flat3-F3-A-flat3-C-flat4 in bar 2, and C3-E3-G3-B3 in bar 3. Leave bar 4 empty. Play the progression and follow the bass A-flat-D-flat-C while listening for the D-flat dominant's pull into C.",
        recognition:
          "Does the added A-flat-minor chord make D-flat7 feel like a genuine dominant destination before it turns unexpectedly into C?",
        source: {
          reference: "Chapter Six - Figures 6-12 and 6-13",
          focus:
            "The substitute dominant may be preceded by its own II chord; the chapter also cautions that substitutions must still fit bass and melody.",
          exampleIds: ["l06.substitute-ii-v"],
        },
        terms: [
          {
            term: "Substitute II-V",
            definition:
              "A II-V built to the substitute dominant before that dominant resolves to the original target.",
          },
          {
            term: "Voice-leading check",
            definition:
              "Testing a reharmonization against the actual bass and melody rather than trusting the chord rule alone.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the substitute II-V",
        successLabel: "You extended the substitution into a complete II-V and heard its new bass direction",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the extended substitution",
          complete: studiedSource(experiments, "l06.substitute-ii-v"),
        },
        {
          label: "The substitute II-V and tonic are written",
          complete: exactStudy(harmonySequence, [
            [0, [56, 59, 63, 66]],
            [8, [49, 53, 56, 59]],
            [16, [48, 52, 55, 59]],
          ]),
        },
        {
          label: "You entered the progression yourself",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the extended substitution",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
