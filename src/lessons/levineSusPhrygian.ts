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
  id: "levine.sus-phrygian",
  number: 4,
  title: "Sus & Phrygian chords",
  eyebrow: "Jazz Piano · Chapter 4",
  hero: "Treat suspended and Phrygian sounds as practical keyboard structures, not just chord-symbol suffixes.",
  description:
    "Build a suspended chord from a bass note and a major triad below it, learn why the fourth can remain unresolved, then turn a dominant seventh into a Phrygian chord by changing the bass.",
  overview:
    "This chapter expands the compact voicings from the previous lesson. The same pitch material can carry several chord symbols, and bass placement becomes part of the chord's identity and harmonic direction.",
});

export const levineSusPhrygianLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.sus-phrygian.a",
        letter: "A",
        title: "Build a suspended chord from two layers",
        learn:
          "Hear Gsus as a G bass underneath an F-major upper structure, then expand the same sound into Dm7 over G.",
        explanation:
          "A direct way to voice a suspended chord is to play the root in the bass and a major triad a whole step below that root above it. For Gsus, the upper triad is F major. The upper triad is commonly placed in second inversion, which gives C-F-A above the G bass.\n\nThe same harmonic area can appear under several symbols. Gsus, G7sus4, Gsus4 and F/G all point toward the suspended sound; Dm7/G is another useful spelling because it makes the combined II-V character visible. The symbol changes what you notice, but the keyboard sound remains closely related.",
        instruction:
          "Study the suspended-chord construction and symbol map. Clear the piano grid. At the start of bar 1 write G3-C4-F4-A4. At the start of bar 2 expand it to G3-D4-F4-A4-C5, the Dm7/G form. Leave bars 3-4 empty, play the loop and compare the compact upper triad with the fuller slash-chord version.",
        recognition:
          "Do both voicings keep the same suspended identity even though the second adds D and makes the II-V relationship more explicit?",
        source: {
          reference: "Chapter Four - Figures 4-1 through 4-3",
          focus:
            "Suspended harmony is built from a root in the bass plus a major triad a whole step below, with several equivalent chord-symbol spellings.",
          exampleIds: ["l04.sus-construction"],
        },
        terms: [
          {
            term: "Suspended fourth",
            definition:
              "The fourth above the root that replaces or delays the ordinary third as the most exposed chord tone.",
          },
          {
            term: "Slash chord",
            definition:
              "A chord symbol that specifies one harmony or upper structure over a particular bass note.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the two suspended structures",
        successLabel: "You heard the same suspended family through two related voicings",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the suspended construction",
          complete: studiedSource(experiments, "l04.sus-construction"),
        },
        {
          label: "Both suspended structures are written",
          complete: exactStudy(harmonySequence, [
            [0, [55, 60, 65, 69]],
            [8, [55, 62, 65, 69, 72]],
          ]),
        },
        {
          label: "You entered the notes yourself",
          complete: changedControl(experiments, "harmony.note-edit", 9),
        },
        {
          label: "You listened to the suspended sounds",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.sus-phrygian.b",
        letter: "B",
        title: "Keep the fourth, add the third",
        learn:
          "Hear why a modern sus chord does not have to resolve its fourth away, and why the third can coexist with the fourth when it is voiced above it.",
        explanation:
          "In traditional suspension grammar the fourth normally falls by step to the third. In this jazz usage the fourth often remains in the chord, giving the sonority a floating quality rather than acting as a temporary dissonance that must resolve immediately.\n\nThe third is not automatically forbidden. It can be included with the suspended fourth when the voicing keeps the third above the fourth. The resulting dissonance is more exposed in a short chord and easier to absorb when the harmony lasts longer, so duration and spacing matter as much as the chord label.",
        instruction:
          "Study the voicing variants. Clear the grid. In bar 1 write G3-C4-F4-A4. In bar 2 write G3-C4-F4-B4 so the third B is above the suspended fourth C. In bar 3 resolve to C3-B3-E4-G4. Leave bar 4 empty. Play the three sounds slowly and listen to how the second voicing contains both fourth and third before the move to C major seventh.",
        recognition:
          "Does the B sharpen the tension without erasing the suspended C, and does the move to C major seventh still feel like a clear release?",
        source: {
          reference: "Chapter Four - Figures 4-5 and 4-6",
          focus:
            "Suspended voicings may double notes, reinforce the fifth, and can include the third when it is placed above the fourth.",
          exampleIds: ["l04.sus-third"],
        },
        terms: [
          {
            term: "Unresolved suspension",
            definition:
              "A suspended fourth retained as a stable chord colour instead of being required to fall to the third.",
          },
          {
            term: "Voicing",
            definition:
              "The register and vertical arrangement chosen for the notes of a chord.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare the suspended variants",
        successLabel: "You heard the fourth alone, the fourth with the third, and the release",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the sus voicing variants",
          complete: studiedSource(experiments, "l04.sus-third"),
        },
        {
          label: "The two sus voicings and resolution are written",
          complete: exactStudy(harmonySequence, [
            [0, [55, 60, 65, 69]],
            [8, [55, 60, 65, 71]],
            [16, [48, 59, 64, 67]],
          ]),
        },
        {
          label: "You entered the voicings yourself",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the tension and release",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.sus-phrygian.c",
        letter: "C",
        title: "Put the thirteenth in the bass",
        learn:
          "Turn G7 into an E-Phrygian chord by putting E, the thirteenth of G, under the dominant seventh.",
        explanation:
          "A Phrygian chord in this chapter is a dominant seventh with its thirteenth used as the bass note instead of the dominant root. Start with G7 and put E underneath it: E-G-B-D-F. The result may be written G7/E, Esus-flat-9, or E Phrygian; there is no single universal symbol.\n\nThe bass changes the harmonic hearing. E is the third degree of C major, so the same pitch collection connects directly to E Phrygian. The chord can then resolve smoothly to A major seventh: the bass motion E-A gives the progression its own dominant-to-tonic direction even though the upper dominant chord is G7.",
        instruction:
          "Study the Phrygian construction. Clear the grid. In bar 1 write E3-G3-B3-D4-F4. In bar 2 write A3-C-sharp4-E4-G-sharp4. Leave bars 3-4 empty and play the loop. First listen only to the bass E-A; then listen to how the G7 upper structure changes meaning when E is underneath it.",
        recognition:
          "Can you hear the E bass as the harmonic anchor rather than hearing only a rootless G7?",
        source: {
          reference: "Chapter Four - Figure 4-7",
          focus:
            "The Phrygian chord is formed by placing the dominant chord's thirteenth in the bass; G7/E is the chapter's central example.",
          exampleIds: ["l04.phrygian"],
        },
        terms: [
          {
            term: "Phrygian chord",
            definition:
              "Here, a dominant seventh sonority with its thirteenth placed in the bass instead of the dominant root.",
          },
          {
            term: "Thirteenth",
            definition:
              "The scale degree a sixth above the root, named as a compound interval when treated as a chord extension.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the Phrygian chord and resolution",
        successLabel: "You heard how one bass note can reinterpret an entire dominant sonority",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the Phrygian construction",
          complete: studiedSource(experiments, "l04.phrygian"),
        },
        {
          label: "G7 over E resolves to A major seventh",
          complete: exactStudy(harmonySequence, [
            [0, [52, 55, 59, 62, 65]],
            [8, [57, 61, 64, 68]],
          ]),
        },
        {
          label: "You entered both chords yourself",
          complete: changedControl(experiments, "harmony.note-edit", 9),
        },
        {
          label: "You listened to the bass-led reinterpretation",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.sus-phrygian.d",
        letter: "D",
        title: "Compress II-V into one suspended colour",
        learn:
          "Use a suspended or Phrygian sonority to contain the pull of a II-V progression inside one chord.",
        explanation:
          "A slash-chord spelling such as Dm7/G shows why suspended harmony can stand in for a II-V. The upper notes are the II chord while G in the bass supplies the V root. Instead of hearing two separate blocks, the two functions are folded into one sonority.\n\nThe same idea can be used with a Phrygian chord: a II-V pair can be reharmonized as one sustained colour when the bass and upper structure preserve the important relationship. This is a reharmonization device, so the test is musical continuity, not whether every original root remains present.",
        instruction:
          "Study the II-V compression idea. Clear the grid. Write D3-F3-A3-C4 in bar 1 and G3-B3-D4-F4 in bar 2. In bar 3 replace the two-chord idea with G3-D4-F4-A4-C5, heard as Dm7/G or Gsus. In bar 4 write C3-E3-G3-B3. Play all four bars and compare the separate II-V with the compressed suspended version before the tonic.",
        recognition:
          "Does bar 3 preserve enough of both II and V to make the arrival on C feel prepared even though there is only one chord?",
        source: {
          reference: "Chapter Four - Figure 4-8 and practice discussion",
          focus:
            "Sus and Phrygian sonorities can reharmonize a II-V pair as a single sustained chord.",
          exampleIds: ["l04.ii-v-compression"],
        },
        terms: [
          {
            term: "Reharmonization",
            definition:
              "Changing the chordal treatment of a passage while preserving a workable relationship to its musical direction.",
          },
          {
            term: "II-V compression",
            definition:
              "Folding the upper material of II and the bass or function of V into one sustained sonority.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare separate and compressed II-V",
        successLabel: "You heard a two-chord function condensed into one suspended sonority",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the reharmonization principle",
          complete: studiedSource(experiments, "l04.ii-v-compression"),
        },
        {
          label: "The separate II-V, compressed chord and tonic are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 53, 57, 60]],
            [8, [55, 59, 62, 65]],
            [16, [55, 62, 65, 69, 72]],
            [24, [48, 52, 55, 59]],
          ]),
        },
        {
          label: "You entered the comparison yourself",
          complete: changedControl(experiments, "harmony.note-edit", 17),
        },
        {
          label: "You listened to both versions",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
