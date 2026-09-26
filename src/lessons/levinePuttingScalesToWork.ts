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

function melodicLine(notes: number[]): Array<[number, number[]]> {
  return notes.map((note, step) => [step, [note]]);
}

const lesson = lessonContentSchema.parse({
  id: "levine.putting-scales-to-work",
  number: 10,
  title: "Putting scales to work",
  eyebrow: "Jazz Piano · Chapter 10",
  hero: "Turn chord-scale knowledge into connected lines by moving a small melodic pattern through changing harmony.",
  description:
    "Use sequences to link one scale to the next, then vary the pattern so the result remains organized without becoming mechanical.",
  overview:
    "The exercise is not to run every scale from its root. Start from wherever the line has arrived, continue into the next chord's scale, and transform a small motif through eighth notes, broken thirds, reversals and triplet shapes.",
});

export const levinePuttingScalesToWorkLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.putting-scales-to-work.a",
        letter: "A",
        title: "Carry one four-note idea through a minor II-V-I",
        learn:
          "Move a short scalar cell through D half-diminished, G altered and C melodic minor instead of restarting every scale from its root.",
        explanation:
          "A sequence is a melodic phrase repeated at a different pitch level. Practicing sequences solves two problems at once: you learn the sound of the scale and you learn to connect that scale to the next chord without stopping.\n\nFor a minor II-V-I in C, D half-diminished can use D Locrian sharp-two, G7alt uses G altered, and the tonic can use C melodic minor. The line should cross each boundary as one continuous thought.",
        instruction:
          "Study the sequence-linking map. Clear the grid. Write D4-E4-F4-G4, then A-flat4-B-flat4-B4-D-flat5, then C5-D5-E-flat5-F5 on steps 1-12. Play the line as one phrase and listen to the boundary G-A-flat and D-flat-C.",
        recognition:
          "Do the chord changes feel like bends in one line rather than three scales placed next to each other?",
        source: {
          reference: "Chapter Ten - Figures 10-1 through 10-5",
          focus:
            "Sequences link scale material across chord changes; the next scale begins from the line's current register and direction rather than automatically restarting on its root.",
          exampleIds: ["l10.sequence-linking"],
        },
        terms: [
          {
            term: "Sequence",
            definition:
              "A melodic pattern repeated at another pitch level while preserving its recognizable interval or contour pattern.",
          },
          {
            term: "Scale connection",
            definition:
              "Moving directly from the current note into the pitch collection of the next chord without resetting the line to a predetermined root.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Link the minor II-V-I",
        successLabel: "You crossed two harmonic boundaries without restarting the melodic line",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied how the sequence crosses chord changes",
          complete: studiedSource(experiments, "l10.sequence-linking"),
        },
        {
          label: "The three connected four-note cells are written",
          complete: exactStudy(harmonySequence, melodicLine([
            62, 64, 65, 67,
            68, 70, 71, 73,
            72, 74, 75, 77,
          ])),
        },
        {
          label: "You entered the continuous line",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened across the chord boundaries",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.putting-scales-to-work.b",
        letter: "B",
        title: "Do not restart on the root",
        learn:
          "Enter the next scale from the nearest useful note and keep the direction of the phrase.",
        explanation:
          "Knowing a chord's scale is not enough if every new harmony makes you jump back to scale degree one. The practical skill is to know the scale well enough to enter it on any note.\n\nThis study moves from D Dorian into G Mixolydian, two modes of the same C-major collection. The pitch material does not change at all; only the harmonic emphasis changes. Keeping the line moving proves that the mode is a harmonic reading, not a fingering pattern that must start on its named root.",
        instruction:
          "Study the continuous-entry principle. Clear the grid. Write F4-G4-A4-B4-C5-D5-E5-F5 on steps 1-8. Continue immediately with G5-F5-E5-D5-C5-B4-A4-G4 on steps 9-16. Do not insert a gap or jump back to low G when the dominant area begins.",
        recognition:
          "Can you hear the mode change as a change of harmonic focus even though the line simply continues through the same C-major pitch collection?",
        source: {
          reference: "Chapter Ten - discussion following Figure 10-1",
          focus:
            "Scale practice should make every note available so a line can enter the next chord's scale from its current register instead of beginning each scale on the root.",
          exampleIds: ["l10.continuous-entry"],
        },
        terms: [
          {
            term: "Modal emphasis",
            definition:
              "The harmonic meaning created when the same pitch collection is heard against a different chord or tonal center.",
          },
          {
            term: "Register continuity",
            definition:
              "Keeping a melodic line in a connected pitch range rather than jumping to a memorized scale starting point at each chord.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Keep the line continuous",
        successLabel: "You entered the next mode from the line's current register",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied continuous scale entry",
          complete: studiedSource(experiments, "l10.continuous-entry"),
        },
        {
          label: "The uninterrupted modal line is written",
          complete: exactStudy(harmonySequence, melodicLine([
            65, 67, 69, 71, 72, 74, 76, 77,
            79, 77, 76, 74, 72, 71, 69, 67,
          ])),
        },
        {
          label: "You entered the full connected line",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened without a scale reset",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.putting-scales-to-work.c",
        letter: "C",
        title: "Transform the same scale into four patterns",
        learn:
          "Compare straight eighth-note motion, broken thirds, reversing thirds and a step-plus-skip triplet cell.",
        explanation:
          "The chapter varies one scale exercise several ways so that scale practice becomes melodic organization rather than mere up-and-down motion. Straight notes establish the collection. Broken thirds add intervallic movement. Reversing the direction of the thirds changes contour. Triplet cells combine a step and a skip.\n\nThe purpose is not to collect licks. It is to make the scale physically and aurally available in several shapes so that a line can respond to the harmony without sounding like a scale drill.",
        instruction:
          "Study the pattern-variation map. Clear the grid. Write four eight-note C-major patterns in consecutive bars: C-D-E-F-G-A-B-C; C-E-D-F-E-G-F-A; C-E-D-F-E-G-F-D; C-D-E-D-E-F-E-G. Play all four bars and identify which transformation you are hearing.",
        recognition:
          "Can you hear the same pitch field becoming progressively less scale-like as the interval pattern changes?",
        source: {
          reference: "Chapter Ten - Figures 10-6 through 10-10",
          focus:
            "One scale is practiced as eighth notes, broken thirds, reversing thirds, triplets, and triplet figures that combine a step with a skip.",
          exampleIds: ["l10.pattern-variants"],
        },
        terms: [
          {
            term: "Broken thirds",
            definition:
              "A scale pattern that alternates scale degrees a third apart rather than moving only by adjacent steps.",
          },
          {
            term: "Contour reversal",
            definition:
              "Changing the direction of a repeating interval pattern while preserving its underlying organization.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build four pattern variants",
        successLabel: "You turned one scale into several distinct melodic organizations",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the pattern variants",
          complete: studiedSource(experiments, "l10.pattern-variants"),
        },
        {
          label: "All four eight-note patterns are written",
          complete: exactStudy(harmonySequence, melodicLine([
            60, 62, 64, 65, 67, 69, 71, 72,
            60, 64, 62, 65, 64, 67, 65, 69,
            60, 64, 62, 65, 64, 67, 65, 62,
            60, 62, 64, 62, 64, 65, 64, 67,
          ])),
        },
        {
          label: "You entered all four transformations",
          complete: changedControl(experiments, "harmony.note-edit", 32),
        },
        {
          label: "You listened to the changing contours",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.putting-scales-to-work.d",
        letter: "D",
        title: "Break the sequence before it becomes mechanical",
        learn:
          "Use repetition to create order, then interrupt it deliberately so the pattern serves the line instead of taking over.",
        explanation:
          "A sequence can sound musical because repetition gives the listener something to follow. It can also sound mechanical if the pattern continues unchanged for too long. The source therefore treats these exercises as raw material for improvising, not as formulas to run automatically.\n\nA useful practice is to establish the pattern clearly, repeat it once, then change direction or interval content while staying inside the same harmonic field. The listener hears both organization and choice.",
        instruction:
          "Study the musical-use map. Clear the grid. Write C4-D4-E4-G4, then D4-E4-F4-A4 on steps 1-8. On steps 9-16 break the sequence with G4-F4-E4-C5-B4-G4-A4-E4. Play the line and listen for the moment the repeated cell gives way to a freer contour.",
        recognition:
          "Does the first half establish enough pattern that the broken second half sounds intentional rather than random?",
        source: {
          reference: "Chapter Ten - discussion after Figures 10-6 through 10-10 and practice tips",
          focus:
            "Scale sequences organize improvisation but should be varied and used selectively so they do not become mechanical.",
          exampleIds: ["l10.musical-use"],
        },
        terms: [
          {
            term: "Motivic organization",
            definition:
              "Creating coherence by repeating or transforming a small recognizable melodic idea.",
          },
          {
            term: "Mechanical repetition",
            definition:
              "Continuing a pattern automatically after its musical usefulness has passed.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Establish and break the sequence",
        successLabel: "You used repetition as structure without letting it dictate the whole line",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied how to keep sequences musical",
          complete: studiedSource(experiments, "l10.musical-use"),
        },
        {
          label: "The repeated and broken sections are written",
          complete: exactStudy(harmonySequence, melodicLine([
            60, 62, 64, 67,
            62, 64, 65, 69,
            67, 65, 64, 72, 71, 67, 69, 64,
          ])),
        },
        {
          label: "You entered the complete study",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened for the break in the pattern",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
