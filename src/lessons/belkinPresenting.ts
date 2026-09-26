import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function analysed(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum = 1,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

function melodyEdits(experiments: LessonContext["experiments"]): number {
  return experiments["melody.edit"]?.changes ?? 0;
}

function arrangementEdits(experiments: LessonContext["experiments"]): number {
  return experiments["arrangement.edit"]?.changes ?? 0;
}

function sounding(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function lastSoundingIndex(sequence: Array<number | null>): number {
  for (let index = sequence.length - 1; index >= 0; index -= 1) {
    if (sequence[index] !== null) return index;
  }
  return -1;
}

function sharedPitches(a: Array<number | null>, b: Array<number | null>): number {
  const first = sounding(a);
  const second = sounding(b);
  return new Set(second.filter((note) => first.includes(note))).size;
}

function sameBlock(a: Array<number | null>, b: Array<number | null>): boolean {
  return a.length === b.length && a.every((note, index) => note === b[index]);
}

const lesson = lessonContentSchema.parse({
  id: "belkin.presenting",
  number: 2,
  title: "Presenting",
  eyebrow: "Belkin · Composition craft",
  hero:
    "Group related phrases so the listener learns the musical idea, while phrase length, cadence and intensity create a larger hierarchy.",
  description:
    "Presenting is not simple repetition. Related phrases establish familiarity, then differences in punctuation, length, register and intensity make the group progress toward a stronger formal arrival.",
  overview:
    "This lesson moves from phrase-to-phrase similarity to larger groups. You will preserve identity across related phrases, alter pacing through phrase length, then build a paragraph whose final phrase carries the strongest articulation.",
});

export const belkinPresentingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "belkin.presenting.a",
        letter: "A",
        title: "Present one idea twice",
        learn:
          "Successive phrases become a stable presentation when the listener can hear what they share before being asked to process larger contrasts.",
        explanation:
          `Listeners automatically compare neighbouring phrases. Shared motives, accompaniment, length, register, texture and harmonic region all contribute to familiarity. Stability is useful because it lets the musical idea become memorable; the second phrase can then vary details without sounding like a new subject.

The point is not literal duplication. A related second phrase should preserve enough salient information to be recognised while changing something meaningful - contour, ending, register or local intensity. Because the material remains familiar, those differences become easier to hear.`,
        instruction:
          "Study all three presentation principles. In the Motif workspace, use steps 1-8 as the first phrase and 9-16 as a related second phrase. Put at least three sounding notes in each half. Make the two halves share at least two pitches, but do not make them exact copies. Make at least six edits and listen through both phrases without stopping.",
        recognition:
          "Does the second phrase sound like another statement of the same musical thought rather than either a literal repeat or an unrelated new idea?",
        source: {
          reference: "Belkin, Chapter 6",
          focus:
            "Related phrases establish familiarity and formal stability while allowing controlled progression.",
          exampleIds: ["b02.presenting-stability"],
        },
        terms: [
          {
            term: "Presenting",
            definition:
              "Grouping related phrases so the listener becomes familiar with the material and can hear their hierarchy.",
          },
          {
            term: "Phrase group",
            definition:
              "Several phrases perceived as one larger unit because of shared material and coordinated punctuation.",
          },
        ],
        workspace: "motif",
        checksLabel: "Present a stable idea",
        successLabel: "The two phrases now sound related without being duplicates",
      }),
      evaluate: ({ melody, experiments }) => {
        const first = melody.slice(0, 8);
        const second = melody.slice(8, 16);
        return [
          {
            label: "You studied how phrase groups establish familiarity",
            complete: analysed(experiments, "b02.presenting-stability", 3),
          },
          {
            label: "Both phrases contain enough material to compare",
            complete: sounding(first).length >= 3 && sounding(second).length >= 3,
          },
          {
            label: "The phrases share audible pitch material",
            complete: sharedPitches(first, second) >= 2,
          },
          {
            label: "The second phrase is not an exact copy",
            complete: !sameBlock(first, second),
          },
          {
            label: "You revised and listened to the pair",
            complete: melodyEdits(experiments) >= 6 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.presenting.b",
        letter: "B",
        title: "Change pacing with phrase length",
        learn:
          "Phrase length is an expressive variable. Shortening successive phrases can increase pressure, while lengthening them can create delay or relaxation.",
        explanation:
          `Asymmetry is not automatically irregular or unstable. When the listener can still hear the relationship between phrases, a difference in length becomes part of the pacing. A shorter answering phrase can feel as though the music is breathing faster and pressing toward a goal. A longer one can postpone closure and make time feel more spacious.

Here we isolate shortening. The second phrase should retain material from the first but occupy a smaller span. The goal is to hear acceleration at the formal level, not merely to play faster notes.`,
        instruction:
          "Study all three phrase-length effects. In the Motif workspace, make the first phrase occupy at least six of steps 1-8. In steps 9-16, write a related response that uses at least three sounding notes but whose last sounding note occurs earlier than the last sounding note of the first phrase. Keep at least one pitch in common. Make at least six edits and listen to how the shorter response changes the pacing.",
        recognition:
          "Does the second phrase feel more urgent because it completes its thought in less space, rather than merely sounding incomplete?",
        source: {
          reference: "Belkin, Chapter 6 - Phrase length",
          focus:
            "Successively shorter or longer phrases change the perceived pacing of a larger phrase group.",
          exampleIds: ["b02.phrase-length"],
        },
        terms: [
          {
            term: "Phrase-length asymmetry",
            definition:
              "A deliberate difference in the durations of related phrases used to shape pacing and formal energy.",
          },
        ],
        workspace: "motif",
        checksLabel: "Alter the pacing",
        successLabel: "The response is recognisably related but reaches its end sooner",
      }),
      evaluate: ({ melody, experiments }) => {
        const first = melody.slice(0, 8);
        const second = melody.slice(8, 16);
        const firstLast = lastSoundingIndex(first);
        const secondLast = lastSoundingIndex(second);
        return [
          {
            label: "You studied shortening and lengthening as pacing tools",
            complete: analysed(experiments, "b02.phrase-length", 3),
          },
          {
            label: "The first phrase establishes a broad span",
            complete: sounding(first).length >= 3 && firstLast >= 5,
          },
          {
            label: "The response is substantial but shorter",
            complete:
              sounding(second).length >= 3 &&
              secondLast >= 0 &&
              secondLast < firstLast,
          },
          {
            label: "The phrases remain related",
            complete: sharedPitches(first, second) >= 1,
          },
          {
            label: "You revised and listened to the pacing",
            complete: melodyEdits(experiments) >= 6 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.presenting.c",
        letter: "C",
        title: "Group four phrases into a paragraph",
        learn:
          "A paragraph is more than a chain of phrases: several related phrases form one larger thought whose final articulation is clearly strongest.",
        explanation:
          `A paragraph contains more than two phrases, keeps recognisable thematic material in circulation, and reserves its strongest articulation for the end. What follows that boundary should be able to sound like a new direction. The internal phrases can vary in intensity, length and detail, but their common identity must remain audible.

The Arrangement workspace cannot reproduce Belkin's score examples, so here density acts as one controlled dimension of hierarchy. Recurrent layers establish continuity across four phrase regions, while the last region grows into the local climax before the final release.`,
        instruction:
          "Study all four paragraph requirements. Treat bars 1-2, 3-4, 5-6 and 7-8 as four phrase regions. Keep at least one layer active at the start of all four regions so they belong together. Make bar 7 the fullest phrase opening, with at least three active layers. Make at least eight arrangement edits and listen through the complete eight bars.",
        recognition:
          "Do the four regions feel like one accumulating paragraph, with the last phrase carrying greater weight instead of sounding like four unrelated mini-sections?",
        source: {
          reference: "Belkin, Chapter 6 - The paragraph",
          focus:
            "A paragraph groups more than two related phrases under a hierarchy whose last articulation is strongest.",
          exampleIds: ["b02.paragraph"],
        },
        terms: [
          {
            term: "Paragraph",
            definition:
              "A group of more than two related phrases forming one higher-level formal unit with its strongest articulation at the end.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Build one larger thought",
        successLabel: "Four related phrase regions now accumulate toward the last one",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const starts = [arrangement[0], arrangement[2], arrangement[4], arrangement[6]];
        const commonLayer = ["drums", "bass", "chords", "melody"].some((layer) =>
          starts.every((bar) => bar[layer as keyof typeof bar]),
        );
        const finalCount = Object.values(arrangement[6]).filter(Boolean).length;
        const earlierMax = Math.max(
          ...starts.slice(0, 3).map((bar) => Object.values(bar).filter(Boolean).length),
        );
        return [
          {
            label: "You studied the requirements of a paragraph",
            complete: analysed(experiments, "b02.paragraph", 4),
          },
          {
            label: "A shared layer ties all four phrase regions together",
            complete: commonLayer,
          },
          {
            label: "The final phrase opening is texturally substantial",
            complete: finalCount >= 3,
          },
          {
            label: "The final phrase reaches at least the strongest density so far",
            complete: finalCount >= earlierMax,
          },
          {
            label: "You shaped and heard the complete group",
            complete: arrangementEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.presenting.d",
        letter: "D",
        title: "Make the final phrase culminate",
        learn:
          "Related phrases become a hierarchy when repetition leads somewhere. The last phrase should confirm the group with the clearest local culmination and punctuation.",
        explanation:
          `Familiar material lets the listener compare successive statements. That comparison becomes formally useful when later phrases intensify or clarify something heard earlier. Register, rhythmic activity and cadence can all contribute to a local climax, while the final punctuation tells us that the larger unit is complete.

This exercise makes the hierarchy audible in one line. Four compact four-step groups should share material, but the last group must contain the highest pitch of the complete passage and finish with a longer final event. The constraints are intentionally simple so you can hear how register and rhythmic repose cooperate.`,
        instruction:
          "Study the higher-level grouping analysis. In the Motif workspace, treat each block of four steps as a phrase. Put at least two sounding notes in every block and reuse at least one pitch across all four. Make the highest pitch of the entire passage occur in steps 13-16. Give the final sounding note a duration of at least two steps. Make at least eight edits and listen from the beginning.",
        recognition:
          "Does the last phrase feel like the culmination of material you already know, and does its ending carry more final weight than the earlier phrase boundaries?",
        source: {
          reference: "Belkin, Chapter 6 - Higher-level grouping",
          focus:
            "Familiarity, progression and stronger final punctuation turn related phrases into a hierarchical formal unit.",
          exampleIds: ["b02.period-paragraph"],
        },
        terms: [
          {
            term: "Local climax",
            definition:
              "The point of greatest intensity within a phrase group, distinguished by one or more salient musical dimensions.",
          },
        ],
        workspace: "motif",
        checksLabel: "Culminate the group",
        successLabel: "The final phrase now carries the passage's peak and strongest repose",
      }),
      evaluate: ({ melody, melodyDurations, experiments }) => {
        const blocks = [0, 4, 8, 12].map((start) => melody.slice(start, start + 4));
        const all = sounding(melody);
        const final = sounding(blocks[3]);
        const highest = all.length ? Math.max(...all) : -Infinity;
        const finalLastGlobal = lastSoundingIndex(melody);
        const pitchSets = blocks.map((block) => new Set(sounding(block)));
        const sharedAcrossAll = all.some((pitch) => pitchSets.every((set) => set.has(pitch)));
        return [
          {
            label: "You studied familiarity, hierarchy and culmination",
            complete: analysed(experiments, "b02.period-paragraph", 3),
          },
          {
            label: "All four phrase blocks contain material",
            complete: blocks.every((block) => sounding(block).length >= 2),
          },
          {
            label: "One pitch links all four phrases",
            complete: sharedAcrossAll,
          },
          {
            label: "The highest pitch occurs in the final phrase",
            complete: final.includes(highest),
          },
          {
            label: "The final sounding event is lengthened",
            complete:
              finalLastGlobal >= 12 &&
              (melodyDurations[finalLastGlobal] ?? 1) >= 2,
          },
          {
            label: "You revised and heard the complete hierarchy",
            complete: melodyEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
  ],
};
