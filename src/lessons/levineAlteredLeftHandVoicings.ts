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
  id: "levine.altered-left-hand-voicings",
  number: 8,
  title: "Altering notes in left-hand voicings",
  eyebrow: "Jazz Piano · Chapter 8",
  hero: "Alter the compact rootless shapes without losing their register, voice leading or harmonic identity.",
  description:
    "Extend the two basic left-hand positions to half-diminished, altered dominant, sharp-eleven, minor-major, diminished, suspended and Phrygian sounds.",
  overview:
    "The number of available shapes grows quickly here. The practical selection rules remain simple: favour smooth motion, avoid muddy low registers and hand collisions, and let the melody supply a colour tone when duplicating it would make the voicing worse.",
});

export const levineAlteredLeftHandVoicingsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.altered-left-hand-voicings.a",
        letter: "A",
        title: "Flatten the fifth for half-diminished",
        learn:
          "Turn familiar D-minor-seven shapes into D half-diminished by lowering only the fifth.",
        explanation:
          "A half-diminished chord is a minor seventh with a flat fifth. The first two practical left-hand shapes can therefore be made directly from the Dm7 positions you already know: keep the third, seventh and ninth, but lower A to A-flat.

There are more possible positions than these two. The choice depends on where the harmony came from, where it is going, the register, and the melody. The useful habit is to recognize the altered interval inside a familiar shape instead of treating every half-diminished voicing as unrelated material.",
        instruction:
          "Study the half-diminished options. Clear the grid. In bar 1 write the familiar Dm7 A-position F3-A3-C4-E4. In bar 2 lower only the fifth to make F3-A-flat3-C4-E4. In bar 3 write the alternate D half-diminished position C4-E4-F4-A-flat4. Leave bar 4 empty and play all three.",
        recognition:
          "Can you hear that one semitone change converts the familiar minor-seven colour into half-diminished while the rest of the shape stays recognizable?",
        source: {
          reference: "Chapter Eight - Figures 8-1 and 8-2",
          focus:
            "Half-diminished voicings are developed by flattening the fifth inside familiar left-hand positions, with several register choices available.",
          exampleIds: ["l08.half-diminished"],
        },
        terms: [
          {
            term: "Half-diminished",
            definition:
              "A minor seventh chord with its fifth lowered by a semitone.",
          },
          {
            term: "Flat fifth",
            definition:
              "The fifth of the chord lowered by one semitone.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Alter the minor-seven shape",
        successLabel: "You converted a familiar rootless voicing into half-diminished with one pitch change",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the half-diminished positions",
          complete: studiedSource(experiments, "l08.half-diminished"),
        },
        {
          label: "The minor-seven and two half-diminished shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 57, 60, 64]],
            [8, [53, 56, 60, 64]],
            [16, [60, 64, 65, 68]],
          ]),
        },
        {
          label: "You entered the altered shapes yourself",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the flattened fifth",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.altered-left-hand-voicings.b",
        letter: "B",
        title: "Alter the dominant from inside the voicing",
        learn:
          "Hear flat nine, flat thirteen and the combined altered sound as changes to the same rootless G7 framework.",
        explanation:
          "Start from the rootless G7 shape F-A-B-E. Lowering A to A-flat gives the flat ninth. Lowering E to E-flat gives the flat thirteenth, which is enharmonically the same piano key as the sharp fifth. Applying both altered directions more strongly gives the altered-dominant colour.

The altered symbol implies a wider altered collection rather than one fixed four-note stack. In these left-hand shapes, a practical route is to raise the ninth and lower the thirteenth while preserving the dominant function.",
        instruction:
          "Study the dominant alterations. Clear the grid. Write F3-A3-B3-E4 in bar 1 for the unaltered G7 shape. In bar 2 write F3-A-flat3-B3-E4 for G7 flat nine. In bar 3 write F3-A3-B3-E-flat4 for G7 flat thirteen. In bar 4 write F3-B-flat3-B3-E-flat4 for an altered G7 colour. Play the four bars and listen to each changed pitch against the stable F and B.",
        recognition:
          "Can you separate the effect of lowering the ninth from lowering the thirteenth before hearing both alterations together?",
        source: {
          reference: "Chapter Eight - Figures 8-3 through 8-7",
          focus:
            "Dominant left-hand voicings are altered by changing ninths and thirteenths, and altered G7 can share exactly the same sounding notes as D-flat7 through tritone substitution.",
          exampleIds: ["l08.dominant-alterations"],
        },
        terms: [
          {
            term: "Flat thirteenth",
            definition:
              "The thirteenth lowered by a semitone; on G7 it is E-flat, enharmonically the same key as the sharp fifth.",
          },
          {
            term: "Altered dominant",
            definition:
              "A dominant chord using altered upper tensions such as flat or sharp ninths and altered fifths or thirteenths.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare dominant alterations",
        successLabel: "You heard each alteration as a specific pitch change inside one dominant framework",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the altered-dominant family",
          complete: studiedSource(experiments, "l08.dominant-alterations"),
        },
        {
          label: "Natural, flat-nine, flat-thirteen and altered G7 shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 57, 59, 64]],
            [8, [53, 56, 59, 64]],
            [16, [53, 57, 59, 63]],
            [24, [53, 58, 59, 63]],
          ]),
        },
        {
          label: "You entered all four dominant colours",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the alteration sequence",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.altered-left-hand-voicings.c",
        letter: "C",
        title: "Move the third to sharp eleven",
        learn:
          "Turn a rootless G7 voicing into G7 sharp eleven, then hear the same upper structure as minor-major harmony over D.",
        explanation:
          "The sharp eleven of G is C-sharp. In the compact F-A-B-E dominant shape, B is the closest note to C-sharp, so moving B upward produces F-A-C-sharp-E. This voicing omits the ordinary third of G7, which is acceptable here because altered dominant colour loosens the requirement that every defining tone be present in every voicing.

The same four upper notes also form a rootless D minor-major-nine sound: F, A, C-sharp and E are the minor third, fifth, major seventh and ninth of D. Adding D underneath makes that second identity explicit.",
        instruction:
          "Study the sharp-eleven and minor-major relationship. Clear the grid. In bar 1 write F3-A3-B3-E4. In bar 2 move B3 to C-sharp4, giving F3-A3-C-sharp4-E4. In bar 3 add D3 underneath the same four notes. Leave bar 4 empty and play the three sounds.",
        recognition:
          "Can you hear the same F-A-C-sharp-E upper structure as altered dominant colour without D and as minor-major harmony when D becomes the bass?",
        source: {
          reference: "Chapter Eight - Figures 8-8 through 8-11",
          focus:
            "Sharp-eleven dominant voicings can omit the third, and the same upper structure can also function as a rootless minor-major voicing.",
          exampleIds: ["l08.sharp-eleven-minor-major"],
        },
        terms: [
          {
            term: "Sharp eleven",
            definition:
              "The eleventh raised by a semitone; on G7 this pitch is C-sharp.",
          },
          {
            term: "Minor-major seventh",
            definition:
              "A minor chord with a major seventh, often used as tonic-minor colour rather than as a II chord.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Reinterpret the sharp-eleven shape",
        successLabel: "You heard one upper structure support two different harmonic readings",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the sharp-eleven and minor-major relationship",
          complete: studiedSource(experiments, "l08.sharp-eleven-minor-major"),
        },
        {
          label: "The G7, G7 sharp-eleven and D minor-major shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 57, 59, 64]],
            [8, [53, 57, 61, 64]],
            [16, [50, 53, 57, 61, 64]],
          ]),
        },
        {
          label: "You changed and re-rooted the voicing",
          complete: changedControl(experiments, "harmony.note-edit", 13),
        },
        {
          label: "You listened to both harmonic readings",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.altered-left-hand-voicings.d",
        letter: "D",
        title: "Derive G7 flat nine from diminished harmony",
        learn:
          "Raise one note of an F diminished-seventh stack and arrive at a familiar rootless G7 flat-nine voicing.",
        explanation:
          "A diminished seventh chord is a chain of minor thirds. A practical left-hand transformation starts with F diminished seventh, F-A-flat-B-D. Raising the top D by a whole step to E gives F-A-flat-B-E.

That resulting pitch set is exactly the rootless G7 flat-nine voicing already used in this chapter. The connection is useful because it turns what looks like a new dominant shape into a small alteration of a symmetrical diminished chord.",
        instruction:
          "Study the diminished transformation. Clear the grid. In bar 1 write F3-A-flat3-B3-D4. In bar 2 raise only D4 to E4. In bar 3 write the alternate G7 flat-nine position B3-E4-F4-A-flat4. Leave bar 4 empty and play the sequence.",
        recognition:
          "Can you hear the second chord as both a transformed diminished shape and a dominant flat-nine voicing?",
        source: {
          reference: "Chapter Eight - Figure 8-12",
          focus:
            "Raising the top note of an F diminished-seventh stack by a whole step produces the same rootless voicing used for G7 flat nine.",
          exampleIds: ["l08.diminished-derivation"],
        },
        terms: [
          {
            term: "Diminished seventh",
            definition:
              "A four-note symmetrical chord built by stacking minor thirds.",
          },
          {
            term: "Symmetrical",
            definition:
              "Built from a repeating interval pattern, so the same structure recurs under inversion.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transform diminished into dominant",
        successLabel: "You derived a dominant flat-nine voicing from one whole-step change",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the diminished derivation",
          complete: studiedSource(experiments, "l08.diminished-derivation"),
        },
        {
          label: "The diminished chord and both G7 flat-nine positions are written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 56, 59, 62]],
            [8, [53, 56, 59, 64]],
            [16, [59, 64, 65, 68]],
          ]),
        },
        {
          label: "You entered the transformation yourself",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the diminished-dominant connection",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.altered-left-hand-voicings.e",
        letter: "E",
        title: "Reuse familiar shapes for sus and Phrygian",
        learn:
          "Recognize D-minor rootless shapes inside Gsus, then build the compact E-Phrygian left-hand structure.",
        explanation:
          "A Gsus chord can contain the same upper notes as Dm7 because the suspended dominant combines the sound of II and V. That means familiar D-minor left-hand positions can be reused instead of memorizing another unrelated family.

For an E-Phrygian left-hand voicing, read upward from the bass as root, flat ninth, fourth and fifth: E-F-A-B. When choosing among these and the other new shapes, favour smooth motion, avoid a register so low that it becomes muddy, and leave room for the right hand. If the melody already supplies an optional colour tone, the left hand does not have to duplicate it.",
        instruction:
          "Study the reuse and selection rules. Clear the grid. In bar 1 write the three-note Gsus shape F3-A3-C4. In bar 2 expand it to F3-A3-C4-E4, the same upper notes as the familiar Dm7 A-position. In bar 3 write the E-Phrygian shape E3-F3-A3-B3. Leave bar 4 empty. Play the loop and keep every voicing in the clear middle register.",
        recognition:
          "Can you feel the old D-minor hand shape inside Gsus, then hear how the adjacent E-F in the Phrygian shape creates a different tension?",
        source: {
          reference: "Chapter Eight - Figures 8-13 through 8-15 and concluding discussion",
          focus:
            "Sus and Phrygian left-hand voicings reuse earlier structures, while final voicing choice is guided by smoothness, register, melody and hand separation.",
          exampleIds: ["l08.sus-phrygian-selection"],
        },
        terms: [
          {
            term: "Hand separation",
            definition:
              "Keeping the left-hand voicing low enough to support the harmony but not so high that it collides with the right-hand melody.",
          },
          {
            term: "Optional colour tone",
            definition:
              "An extension or alteration that may be omitted from the accompaniment when the melody already supplies it or the voicing becomes crowded.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Reuse and place the left-hand shapes",
        successLabel: "You reused earlier voicing vocabulary instead of memorizing every new chord from zero",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the sus, Phrygian and selection rules",
          complete: studiedSource(experiments, "l08.sus-phrygian-selection"),
        },
        {
          label: "The compact sus, expanded sus and Phrygian shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [53, 57, 60]],
            [8, [53, 57, 60, 64]],
            [16, [52, 53, 57, 59]],
          ]),
        },
        {
          label: "You entered the three shapes yourself",
          complete: changedControl(experiments, "harmony.note-edit", 11),
        },
        {
          label: "You listened in the intended register",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
