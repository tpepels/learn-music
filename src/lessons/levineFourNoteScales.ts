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
  id: "levine.four-note-scales",
  number: 18,
  title: "Four-note scales",
  eyebrow: "Jazz Piano · Chapter 18",
  hero: "Reduce larger scales to four-note cells that outline a chord strongly enough to move quickly, transpose freely and survive across several harmonies.",
  description:
    "Build minor-sixth four-note scales, use them over major and melodic-minor harmony, invent diminished subsets, and practice characteristic four-note cells from melodic minor and major scales.",
  overview:
    "A useful four-note scale is not chosen by a universal formula. It is a compact pitch set whose notes sound convincing over the harmony at hand. Some sets are highly characteristic of one parent scale; others work over many chords because symmetrical or modal relationships make them interchangeable.",
});

export const levineFourNoteScalesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.four-note-scales.a",
        letter: "A",
        title: "Build a minor-sixth four-note scale",
        learn:
          "Use root, minor third, fifth and sixth of melodic minor, then hear the same four notes over a dominant sharp-nine chord.",
        explanation:
          "The basic minor-sixth four-note scale takes the root, third, fifth and sixth of a melodic-minor key. In C melodic minor that gives C-E-flat-G-A. The notes outline a C minor-sixth chord directly.\n\nThe same collection also works over C7 sharp nine: C is the root, E-flat is the sharp nine, G is the fifth and A is the thirteenth. A compact scale can therefore change harmonic meaning without changing its notes.",
        instruction:
          "Study the minor-sixth construction. Clear the grid. Write C4-E-flat4-G4-A4 on steps 1-4. In bar 3 repeat those same four melody notes while adding the C7 guide-tone shell E3-B-flat3 underneath each note. Play both versions and listen to the change from minor-sixth colour to altered dominant colour.",
        recognition:
          "Can you hear the same four notes function as a minor-sixth outline first and as dominant extensions second?",
        source: {
          reference: "Chapter Eighteen - Figures 18-1 through 18-9",
          focus:
            "Minor-sixth scales use root, third, fifth and sixth of melodic minor; the same four-note collection can also be applied to dominant sharp-nine harmony.",
          exampleIds: ["l18.minor-sixth"],
        },
        terms: [
          {
            term: "Minor-sixth scale",
            definition:
              "A four-note collection formed from the root, minor third, fifth and natural sixth of melodic minor.",
          },
          {
            term: "Four-note scale",
            definition:
              "A deliberately reduced pitch collection used melodically over one or more harmonies.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Reinterpret one minor-sixth collection",
        successLabel: "You heard one four-note scale support both minor and altered-dominant harmony",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the minor-sixth construction",
          complete: studiedSource(experiments, "l18.minor-sixth"),
        },
        {
          label: "The scale alone and over C7 sharp nine are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60,63,67,69]),
            [16,[52,58,60]],[17,[52,58,63]],[18,[52,58,67]],[19,[52,58,69]],
          ]),
        },
        {
          label: "You entered both harmonic readings",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the reinterpretation",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.four-note-scales.b",
        letter: "B",
        title: "Use one minor-sixth cell across major-key harmony",
        learn:
          "Keep D-F-A-B over Dm7 and G7, then switch to A-C-E-F-sharp on C major to remove the tonic's natural-fourth friction.",
        explanation:
          "In a major key, build a minor-sixth scale on scale degree two. In C major that produces D-F-A-B. The collection can work across several diatonic chords because its four notes are drawn from the parent key.\n\nOn C major seventh, however, F is the natural fourth and can sound sharply exposed when held. A useful alternative is the minor-sixth scale built on the sixth degree: A-C-E-F-sharp. That replacement changes the tonic colour toward C Lydian by introducing F-sharp.",
        instruction:
          "Study the major-key application. Clear the grid. Over Dm7, put F3-C4 under D4-F4-A4-B4 on steps 1-4. Over G7, put F3-B3 under the same D-F-A-B line on steps 9-12. Over C major, put E3-B3 under A4-C5-E5-F-sharp5 on steps 17-20. Play all three settings.",
        recognition:
          "Can you hear why the C-major bar changes collection instead of simply carrying F into the tonic?",
        source: {
          reference: "Chapter Eighteen - Figures 18-10 through 18-13",
          focus:
            "Major-scale harmony uses the minor-sixth scale from degree two across many chords, but major seventh often switches to the degree-six minor-sixth scale to avoid the natural fourth and create Lydian colour.",
          exampleIds: ["l18.major-key-application"],
        },
        terms: [
          {
            term: "Degree-two minor-sixth scale",
            definition:
              "The four-note minor-sixth collection built on the second degree of a major key.",
          },
          {
            term: "Lydian tonic colour",
            definition:
              "Major harmony with a raised fourth, used here when the degree-six minor-sixth scale supplies the sharp eleven.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Move the four-note cell through II-V-I",
        successLabel: "You kept one compact cell across II-V and changed it deliberately for the tonic",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the major-key application",
          complete: studiedSource(experiments, "l18.major-key-application"),
        },
        {
          label: "The II, V and tonic settings are written",
          complete: exactStudy(harmonySequence, [
            [0,[53,60,62]],[1,[53,60,65]],[2,[53,60,69]],[3,[53,60,71]],
            [8,[53,59,62]],[9,[53,59,65]],[10,[53,59,69]],[11,[53,59,71]],
            [16,[52,59,69]],[17,[52,59,72]],[18,[52,59,76]],[19,[52,59,78]],
          ]),
        },
        {
          label: "You entered all three harmonic settings",
          complete: changedControl(experiments, "harmony.note-edit", 36),
        },
        {
          label: "You listened across the II-V-I",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.four-note-scales.c",
        letter: "C",
        title: "Invent a diminished four-note subset",
        learn:
          "Choose four notes from C half-step/whole-step diminished and keep the same subset over dominant-flat-nine roots separated by minor thirds.",
        explanation:
          "Diminished harmony offers many possible four-note scales because its eight-note collection is symmetrical. There is no single required subset. The practical rule is to choose a small group of notes that sounds good and then exploit the minor-third symmetry of the parent scale.\n\nC7 flat nine, E-flat7 flat nine, F-sharp7 flat nine and A7 flat nine all draw from the same C half-step/whole-step diminished collection. A four-note subset can therefore survive while the dominant root changes.",
        instruction:
          "Study the diminished-subset idea. Clear the grid. Use C4-D-flat4-E4-G4 as your four-note subset. In bar 1 write it alone. In bar 2 put the C7 guide tones E3-B-flat3 underneath each note. In bar 3 put the E-flat7 guide tones G3-D-flat4 underneath the same four melody notes. Leave bar 4 empty and play the three versions.",
        recognition:
          "Can you hear the four-note line remain coherent while the dominant root changes by a minor third?",
        source: {
          reference: "Chapter Eighteen - Figure 18-14",
          focus:
            "Diminished symmetry permits many invented four-note subsets, and the same material can serve dominant-flat-nine chords whose roots are separated by minor thirds.",
          exampleIds: ["l18.diminished-subsets"],
        },
        terms: [
          {
            term: "Diminished subset",
            definition:
              "A small pitch collection selected from an eight-note diminished scale for melodic use.",
          },
          {
            term: "Symmetrical interchange",
            definition:
              "Reusing the same pitch material when a symmetrical parent scale supports several roots related by its repeating interval.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Reuse one diminished subset over two dominants",
        successLabel: "You exploited diminished symmetry without changing the melodic cell",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied diminished four-note subsets",
          complete: studiedSource(experiments, "l18.diminished-subsets"),
        },
        {
          label: "The subset and both dominant settings are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60,61,64,67]),
            [8,[52,58,60]],[9,[52,58,61]],[10,[52,58,64]],[11,[52,58,67]],
            [16,[55,61,60]],[17,[55,61]],[18,[55,61,64]],[19,[55,61,67]],
          ]),
        },
        {
          label: "You entered the scale and both harmonic contexts",
          complete: changedControl(experiments, "harmony.note-edit", 27),
        },
        {
          label: "You listened to the minor-third interchange",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.four-note-scales.d",
        letter: "D",
        title: "Hear two cells characteristic of melodic minor",
        learn:
          "Compare 1-3-5-7 with 3-5-7-9 inside C melodic minor.",
        explanation:
          "Some four-note collections are especially characteristic because their exact interval content occurs only in one melodic-minor key. In C melodic minor, two useful examples are 1-3-5-7 and 3-5-7-9.\n\nThose spell C-E-flat-G-B and E-flat-G-B-D. The first sounds like a compact minor-major-seventh outline. The second shifts the same upper material upward and exposes the natural ninth. Both can be carried through chords derived from the same melodic-minor parent.",
        instruction:
          "Study the characteristic melodic-minor cells. Clear the grid. Write C4-E-flat4-G4-B4 in bar 1 and E-flat4-G4-B4-D5 in bar 2. In bar 3 alternate the two cells on successive beats. Leave bar 4 empty and play the loop.",
        recognition:
          "Can you hear the shared E-flat-G-B core while C and D distinguish the two four-note cells?",
        source: {
          reference: "Chapter Eighteen - Figures 18-23 and 18-24",
          focus:
            "The 1-3-5-7 and 3-5-7-9 four-note cells are presented as characteristic of one melodic-minor key and applied across harmony derived from that parent scale.",
          exampleIds: ["l18.melodic-minor-cells"],
        },
        terms: [
          {
            term: "Characteristic cell",
            definition:
              "A small pitch collection whose interval content strongly identifies a particular parent scale.",
          },
          {
            term: "1-3-5-7",
            definition:
              "A four-note selection taking root, third, fifth and seventh from a scale.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare the two melodic-minor cells",
        successLabel: "You heard two compact patterns identify the same melodic-minor parent",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the characteristic melodic-minor cells",
          complete: studiedSource(experiments, "l18.melodic-minor-cells"),
        },
        {
          label: "Both four-note cells and the alternation are written",
          complete: exactStudy(harmonySequence, [
            [0,[60,63,67,71]],
            [8,[63,67,71,74]],
            [16,[60,63,67,71]],
            [20,[63,67,71,74]],
          ]),
        },
        {
          label: "You entered both characteristic cells",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to their shared parent colour",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.four-note-scales.e",
        letter: "E",
        title: "Turn C-D-F-G into four modes",
        learn:
          "Rotate one four-note major-scale subset through all four starting points and judge the result by ear.",
        explanation:
          "There are thousands of possible four-note scales, but theory does not decide which ones are worth using. A practical method is to select four notes from a parent scale, rotate the collection through its modes, and try the results over real harmony.\n\nC-D-F-G is one such subset of C major. Its four modes are C-D-F-G, D-F-G-C, F-G-C-D and G-C-D-F. The notes stay the same while the tonal emphasis and melodic contour change.",
        instruction:
          "Study the experiment method. Clear the grid. Write C4-D4-F4-G4 in bar 1, D4-F4-G4-C5 in bar 2, F4-G4-C5-D5 in bar 3, and G4-C5-D5-F5 in bar 4. Play all four rotations and decide which ones you would actually use.",
        recognition:
          "Can you hear the collection remain recognizable while each new starting note changes its melodic pull?",
        source: {
          reference: "Chapter Eighteen - Figure 18-25 and concluding discussion",
          focus:
            "The chapter ends by encouraging invention: select four notes from a scale, practice all modes of the set, try them over chords, and keep only combinations that sound convincing.",
          exampleIds: ["l18.invent-and-rotate"],
        },
        terms: [
          {
            term: "Four-note mode",
            definition:
              "A rotation of the same four pitch classes in which a different member is treated as the starting point.",
          },
          {
            term: "Ear-led selection",
            definition:
              "Choosing whether to keep a theoretical pitch collection by listening to its actual musical effect.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Rotate and evaluate one invented scale",
        successLabel: "You treated theory as a generator of options and your ear as the final filter",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the four-note experiment method",
          complete: studiedSource(experiments, "l18.invent-and-rotate"),
        },
        {
          label: "All four modes of C-D-F-G are written",
          complete: exactStudy(harmonySequence, [
            [0,[60]],[1,[62]],[2,[65]],[3,[67]],
            [8,[62]],[9,[65]],[10,[67]],[11,[72]],
            [16,[65]],[17,[67]],[18,[72]],[19,[74]],
            [24,[67]],[25,[72]],[26,[74]],[27,[77]],
          ]),
        },
        {
          label: "You entered all four rotations",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to each modal starting point",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
