import { progressionMatchesDegrees } from "../music/harmony";
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

function analysedAll(
  experiments: LessonContext["experiments"],
  sourceId: string,
  count: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return Array.from({ length: count }, (_, index) =>
    values.includes(sourceId + ":" + index),
  ).every(Boolean);
}

const lesson = lessonContentSchema.parse({
  id: "levine.three-note-voicings",
  number: 3,
  title: "Three-note voicings",
  eyebrow: "Jazz Piano · Chapter 3",
  hero: "Reduce seventh chords to root, third and seventh, then let the guide tones move as little as possible.",
  description:
    "The left hand supplies the root while the right hand keeps the third and seventh - the notes that most clearly define major-seventh, minor-seventh and dominant-seventh quality. Two compact positions make II-V-I smooth instead of forcing every chord back into root position.",
  overview:
    "First learn both right-hand positions in C. Then trace the half-step resolutions inside them and carry one position to F. The chapter's cycle-of-fifths practice turns the voicing rule into something that can eventually work in all twelve keys.",
});

export const levineThreeNoteVoicingsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.three-note-voicings.a",
        letter: "A",
        title: "Strip II-V-I to root, third and seventh",
        learn:
          "Hear how little information is needed to define the quality of a seventh chord.",
        explanation:
          "For most major-seventh, minor-seventh and dominant-seventh chords, the fifth is not the note that distinguishes the quality. The root identifies the chord, while the third and seventh tell you whether it is major seventh, minor seventh or dominant seventh. The chapter therefore reduces these chords to three essential notes: root in the left hand, third and seventh in the right.

The half-diminished chord is an explicit exception because its flat fifth is part of the quality. Do not turn the three-note rule into a universal claim that fifths never matter.",
        instruction:
          "Play the source II-V-I several times and step through its analysis. Set the study to C major with ii7-V7-Imaj7 in bars 1-3 and leave bar 4 empty. Clear the notes. For your practice register, write D3-F4-C5, G3-F4-B4 and C3-E4-B4 at the starts of bars 1-3. Play the progression and listen to the right hand separately from the moving roots.",
        recognition:
          "If the fifths disappear, do the three chord qualities still sound unambiguous?",
        source: {
          reference: "Chapter Three - Figure 3-2",
          focus:
            "The diagram reduces Dm7-G7-Cmaj7 to roots in the left hand and thirds/sevenths in the right.",
          exampleIds: ["l03.fig3-2"],
        },
        terms: [
          {
            term: "Three-note voicing",
            definition:
              "Here, a seventh-chord voicing made from the root plus the third and seventh.",
          },
          {
            term: "Guide tones",
            definition:
              "The third and seventh, whose quality and motion strongly identify the harmony.",
          },
          {
            term: "Shell voicing",
            definition:
              "A reduced chord voicing that keeps the tones essential to harmonic identity.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the first three-note position",
        successLabel: "You reduced II-V-I to roots and guide tones",
      }),
      evaluate: ({ tonalContext, harmonicProgression, harmonySequence, experiments }) => [
        {
          label: "You studied the source three-note voicing",
          complete: studiedSource(experiments, "l03.fig3-2"),
        },
        {
          label: "The key and targets are C-major ii7-V7-Imaj7",
          complete:
            tonalContext.tonic === 0 &&
            tonalContext.mode === "major" &&
            progressionMatchesDegrees(harmonicProgression.slice(0, 3), [2, 5, 1]) &&
            harmonicProgression[3] === null,
        },
        {
          label: "The three shell voicings are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 65, 72]],
            [8, [55, 65, 71]],
            [16, [48, 64, 71]],
          ]),
        },
        {
          label: "You built the voicings yourself",
          complete: changedControl(experiments, "harmony.note-edit", 9),
        },
        {
          label: "You listened to the three-note progression",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.three-note-voicings.b",
        letter: "B",
        title: "Reverse the right-hand position",
        learn:
          "Use the same third and seventh in the opposite vertical order and preserve the same voice-leading rule.",
        explanation:
          "The chapter gives a second position by reversing the right-hand guide tones. Instead of beginning Dm7 with the seventh above the third, the third is on top. The notes are still F and C, but their register changes.

The voice-leading logic remains the same. From II to V, the seventh of Dm7 - C - falls a half step to B while F stays. From V to I, the seventh of G7 - F - falls a half step to E while B stays. One voice holds; the other resolves by semitone.",
        instruction:
          "Play the second source position and visit all three analysis tabs. Clear the study but keep C-major ii7-V7-Imaj7 as the harmonic targets. Write D3-C4-F4, G3-B3-F4 and C3-B3-E4 at the starts of bars 1-3. Play it, then compare its register with the first position.",
        recognition:
          "Can you follow one stationary guide tone while the other drops by a half step at each resolution?",
        source: {
          reference: "Chapter Three - Figure 3-4",
          focus:
            "The second position reverses the two right-hand guide tones while preserving the half-step resolutions.",
          exampleIds: ["l03.fig3-4"],
        },
        terms: [
          {
            term: "Position",
            definition:
              "A particular vertical ordering and register of the same essential chord tones.",
          },
          {
            term: "Half-step resolution",
            definition:
              "A guide tone moving by one semitone into a chord tone of the next harmony.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the second position",
        successLabel: "You can now voice II-V-I in both compact guide-tone positions",
      }),
      evaluate: ({ harmonicProgression, harmonySequence, experiments }) => [
        {
          label: "You worked through all three source voice-leading views",
          complete: analysedAll(experiments, "l03.fig3-4", 3),
        },
        {
          label: "The targets remain ii7-V7-Imaj7",
          complete:
            progressionMatchesDegrees(harmonicProgression.slice(0, 3), [2, 5, 1]) &&
            harmonicProgression[3] === null,
        },
        {
          label: "The reversed-position voicings are correct",
          complete: exactStudy(harmonySequence, [
            [0, [50, 60, 65]],
            [8, [55, 59, 65]],
            [16, [48, 59, 64]],
          ]),
        },
        {
          label: "You rebuilt the position yourself",
          complete: changedControl(experiments, "harmony.note-edit", 9),
        },
        {
          label: "You listened to the second position",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.three-note-voicings.c",
        letter: "C",
        title: "Carry the voicing rule to F",
        learn:
          "Move the three-note II-V-I system to a new key without abandoning close voice leading.",
        explanation:
          "The cycle-of-fifths practice is designed to prevent these shapes from becoming a C-major trick. Moving counterclockwise from C to F gives Gm7-C7-Fmaj7. The chord names change, but the job of each guide tone does not: one note can remain common while the seventh of the current chord resolves downward by half step.

For this first transposition, use the second position because it sits comfortably inside the study register. The important test is not whether the chord stacks look identical; it is whether the third-and-seventh motion follows the same rule.",
        instruction:
          "Study the cycle-of-fifths route. Change the key to F major while keeping ii7-V7-Imaj7 in bars 1-3. Clear the notes and write G3-F4-B-flat4, C3-E4-B-flat4 and F3-E4-A4. Play the result. Check the two upper voices: B-flat falls to A on the final resolution while E stays.",
        recognition:
          "Does the progression in F feel like the same voice-leading mechanism rather than a new set of memorized shapes?",
        source: {
          reference: "Chapter Three - Figure 3-3 and cycle practice",
          focus:
            "The cycle sends the II-V-I exercise through all twelve major keys, beginning C to F to B-flat.",
          exampleIds: ["l03.fig3-3"],
        },
        terms: [
          {
            term: "Cycle of fifths",
            definition:
              "An ordering of all twelve pitch classes by successive fifth relationships, used here as a route through every key.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transpose the shell voicing",
        successLabel: "The same guide-tone rule now works in F major",
      }),
      evaluate: ({ tonalContext, harmonicProgression, harmonySequence, experiments }) => [
        {
          label: "You studied the cycle-of-fifths practice route",
          complete: studiedSource(experiments, "l03.fig3-3"),
        },
        {
          label: "The final key is F major with ii7-V7-Imaj7 targets",
          complete:
            tonalContext.tonic === 5 &&
            tonalContext.mode === "major" &&
            progressionMatchesDegrees(harmonicProgression.slice(0, 3), [2, 5, 1]) &&
            harmonicProgression[3] === null,
        },
        {
          label: "Gm7-C7-Fmaj7 use compact root-plus-guide-tone voicings",
          complete: exactStudy(harmonySequence, [
            [0, [55, 65, 70]],
            [8, [48, 64, 70]],
            [16, [53, 64, 69]],
          ]),
        },
        {
          label: "You changed key and rebuilt the voicings",
          complete:
            changedControl(experiments, "harmony.key") &&
            changedControl(experiments, "harmony.note-edit", 9),
        },
        {
          label: "You listened in F major",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.three-note-voicings.d",
        letter: "D",
        title: "Read extension numbers as chord tones",
        learn:
          "Connect jazz chord-symbol numbers to scale degrees above the seventh instead of treating them as decoration.",
        explanation:
          "Jazz chord symbols keep counting stacked thirds past the seventh. The ninth, eleventh and thirteenth correspond to scale degrees 2, 4 and 6 placed above the octave. The chapter also points out that musicians sometimes use different numbers for the same pitch class according to harmonic context - the sixth and thirteenth, for example, are octave equivalents.

Altered symbols change one of those chord tones: flat-nine, sharp-nine, flat-five and sharp-five are not abstract suffixes but instructions about pitches. Later chapters make much more use of these colours; here the goal is simply to read the number as a note relationship.",
        instruction:
          "Work through the extension source analysis. Set the study back to C major and clear both targets and notes if necessary. In bar 1 write a C6 sound as C3-E3-G3-A3. In bar 2 write Cmaj7 as C3-E3-G3-B3. Play the two bars and focus only on the upper note: A is scale degree 6, B is scale degree 7. Leave bars 3-4 empty.",
        recognition:
          "Can you hear the symbol number as a specific chord tone rather than as a name attached to the whole shape?",
        source: {
          reference: "Chapter Three - Figures 3-9 through 3-11",
          focus:
            "The closing pages introduce extension numbers and altered tones used in jazz chord symbols.",
          exampleIds: ["l03.extensions"],
        },
        terms: [
          {
            term: "Extension",
            definition:
              "A chord tone named above the seventh, commonly the ninth, eleventh or thirteenth.",
          },
          {
            term: "Altered tone",
            definition:
              "A chord tone raised or lowered from its ordinary form, such as flat-nine or sharp-five.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Hear two upper chord tones",
        successLabel: "Extension numbers now point to concrete notes on the keyboard",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the extension terminology",
          complete: studiedSource(experiments, "l03.extensions"),
        },
        {
          label: "C6 and Cmaj7 are written with different top notes",
          complete: exactStudy(harmonySequence, [
            [0, [48, 52, 55, 57]],
            [8, [48, 52, 55, 59]],
          ]),
        },
        {
          label: "You built both comparison chords",
          complete: changedControl(experiments, "harmony.note-edit", 8),
        },
        {
          label: "You listened to the upper-tone difference",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
