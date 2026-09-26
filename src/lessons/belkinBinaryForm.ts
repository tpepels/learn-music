import { activeLayerCount, arrangementLayers, type ArrangementBar } from "../music/model";
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

function sharedPitches(a: Array<number | null>, b: Array<number | null>): number {
  const first = sounding(a);
  const second = sounding(b);
  return new Set(second.filter((note) => first.includes(note))).size;
}

function sameBlock(a: Array<number | null>, b: Array<number | null>): boolean {
  return a.length === b.length && a.every((note, index) => note === b[index]);
}

function layerDifference(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function sharedLayers(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] && right[layer]).length;
}

function activityChanges(bars: ArrangementBar[]): number {
  return bars.slice(1).reduce(
    (total, bar, index) => total + layerDifference(bars[index], bar),
    0,
  );
}

const lesson = lessonContentSchema.parse({
  id: "belkin.binary-form",
  number: 3,
  title: "Binary form",
  eyebrow: "Belkin · Composition craft",
  hero:
    "Build two-part form from one main idea: articulate the middle clearly, increase activity in the second half, and make the final return or cadence more conclusive.",
  description:
    "Binary form is not an unrelated A section followed by a new B idea. The two halves share principal material, while the second half becomes less stable and more active so the form develops rather than simply repeats.",
  overview:
    "This lesson isolates four structural jobs: shared identity across the two halves, greater second-half activity, rounded return after instability, and a final cadence that outweighs the first ending.",
});

export const belkinBinaryFormLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "belkin.binary-form.a",
        letter: "A",
        title: "Keep one idea across two halves",
        learn:
          "Binary form depends on comparison: both halves use the same main idea, so the listener can hear how the second section changes its function and context.",
        explanation:
          `Calling a form 'binary' can suggest two different blocks, but the important relation is not unrelated A followed by unrelated B. Both sections draw on one main body of material. A strong middle punctuation makes the division clear, while motivic continuity keeps the whole piece coherent.

The second half therefore needs to sound recognisably connected to the first without merely copying it. Familiar pitches or gestures can return in a changed order, contour or register. That continuity is what allows later instability to feel like development of something known.`,
        instruction:
          "Study all three binary-identity principles. In the Motif workspace, use steps 1-8 as the first half and 9-16 as the second. Put at least three sounding notes in each half. Reuse at least two pitches from the first half in the second, but do not copy the halves exactly. Make at least six edits and listen through the full sixteen steps.",
        recognition:
          "Can you hear the second half as a changed continuation of the first idea rather than as a new tune pasted onto it?",
        source: {
          reference: "Belkin, Chapter 9",
          focus:
            "Both halves of binary form derive from one main idea and are separated by strong middle punctuation.",
          exampleIds: ["b03.binary-identity"],
        },
        terms: [
          {
            term: "Binary form",
            definition:
              "A two-part form whose sections share principal material while differing in stability, activity and formal function.",
          },
        ],
        workspace: "motif",
        checksLabel: "Keep one formal identity",
        successLabel: "Both halves now share recognisable material without duplicating one another",
      }),
      evaluate: ({ melody, experiments }) => {
        const first = melody.slice(0, 8);
        const second = melody.slice(8, 16);
        return [
          {
            label: "You studied the defining binary-form relation",
            complete: analysed(experiments, "b03.binary-identity", 3),
          },
          {
            label: "Both halves contain enough material to compare",
            complete: sounding(first).length >= 3 && sounding(second).length >= 3,
          },
          {
            label: "The halves share principal pitch material",
            complete: sharedPitches(first, second) >= 2,
          },
          {
            label: "The second half is not a literal copy",
            complete: !sameBlock(first, second),
          },
          {
            label: "You revised and heard the complete two-part span",
            complete: melodyEdits(experiments) >= 6 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.binary-form.b",
        letter: "B",
        title: "Raise the temperature in the second half",
        learn:
          "The second section should normally be less stable and more active than the first. That increase gives the whole binary form a developing trajectory.",
        explanation:
          `The intensified second half can come from more frequent harmonic change, less regular phrase structure, greater registral movement, denser texture or more fragmentary material. The exact device depends on the style. What matters is that the second part does more with familiar material instead of remaining at the same level of activity.

Here arrangement changes stand in for that formal activity. The first four bars should establish a relatively stable combination. The last four should retain at least one layer from the opening but change state more often from bar to bar.`,
        instruction:
          "Study all three second-half principles. In Arrangement, make bars 1-4 relatively stable, then make bars 5-8 more active. Keep at least one layer from bar 1 present in bar 5, but create more layer-state changes across bars 5-8 than across bars 1-4. Make at least eight arrangement edits and listen through all eight bars.",
        recognition:
          "Does the second half feel like the same material under greater pressure, with events changing more quickly than in the opening?",
        source: {
          reference: "Belkin, Chapter 9 - Second section",
          focus:
            "The second section increases activity and instability while preserving relation to the first.",
          exampleIds: ["b03.second-half"],
        },
        terms: [
          {
            term: "Formal activity",
            definition:
              "The rate and intensity of meaningful change in harmony, phrase structure, texture, register or thematic treatment.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Intensify the second half",
        successLabel: "The second section now changes more actively while retaining continuity",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const first = arrangement.slice(0, 4);
        const second = arrangement.slice(4, 8);
        return [
          {
            label: "You studied how the second section raises activity",
            complete: analysed(experiments, "b03.second-half", 3),
          },
          {
            label: "The two halves remain connected",
            complete: sharedLayers(arrangement[0], arrangement[4]) >= 1,
          },
          {
            label: "The second half changes more frequently",
            complete: activityChanges(second) > activityChanges(first),
          },
          {
            label: "The second half contains audible activity",
            complete: second.some((bar) => activeLayerCount(bar) >= 2),
          },
          {
            label: "You shaped and listened to the full form",
            complete: arrangementEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.binary-form.c",
        letter: "C",
        title: "Make a rounded return",
        learn:
          "Rounded binary gains dramatic shape by leaving the opening's stability, passing through a more unsettled region, then bringing opening material back as resolution.",
        explanation:
          `The return matters because its function has changed. At the beginning, familiar material establishes home; later, after instability, the same material can sound like recovery. The contrast is therefore not simply between themes but between formal states: departure and return.

A convincing rounded return needs enough difference in the middle to make homecoming perceptible. If the middle never departs, the reprise has little dramatic meaning. If it abandons all connection, the return can feel arbitrary. This arrangement study keeps the relation audible through shared layers.`,
        instruction:
          "Study all three rounded-binary stages. In Arrangement, make bar 1 a clear opening with at least two active layers. Make bar 5 differ from bar 1 in at least two layer states. Then make bar 7 return to at least two of bar 1's active layers. Make at least seven edits and listen from bar 1 through the return.",
        recognition:
          "When bar 7 arrives, does it feel like recovery of something established earlier because the middle genuinely moved away from it?",
        source: {
          reference: "Belkin, Chapter 9 - Rounded binary",
          focus:
            "Instability in the second section gives the later return of opening material a resolving function.",
          exampleIds: ["b03.rounded-return"],
        },
        terms: [
          {
            term: "Rounded binary",
            definition:
              "A binary form in which opening material returns within the second section after a more unstable departure.",
          },
          {
            term: "Reprise",
            definition:
              "The return of previously heard material, now functioning as formal recovery or resolution.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Depart and return",
        successLabel: "The opening identity now returns after a clearly contrasting middle",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You studied departure, return and changed function",
          complete: analysed(experiments, "b03.rounded-return", 3),
        },
        {
          label: "The opening is clearly established",
          complete: activeLayerCount(arrangement[0]) >= 2,
        },
        {
          label: "The middle departs from the opening",
          complete: layerDifference(arrangement[0], arrangement[4]) >= 2,
        },
        {
          label: "The later bar recovers opening layers",
          complete: sharedLayers(arrangement[0], arrangement[6]) >= 2,
        },
        {
          label: "You revised and heard the departure-return arc",
          complete: arrangementEdits(experiments) >= 7 && heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.binary-form.d",
        letter: "D",
        title: "Make the final ending more conclusive",
        learn:
          "The first ending may articulate the midpoint strongly, but the final ending should carry greater formal weight so the whole piece feels complete.",
        explanation:
          `Related endings invite comparison. If both cadences are identical in every respect, the form can sound as though it simply stopped twice. A more conclusive final cadence can be created by stronger harmonic resolution, longer preparation, greater rhythmic repose, register, texture or other coordinated signals.

This exercise isolates rhythmic weight while keeping motivic relation obvious. The last note of each half should be the same pitch, but the final one should last longer. That is not a universal formula for binary form; it is a controlled way to hear how two related endings can acquire different formal weights.`,
        instruction:
          "Study all three ending-hierarchy principles. In the Motif workspace, place a sounding note somewhere in steps 5-8 and use the same pitch as the final sounding note in steps 13-16. Give the final ending a longer duration than the first-half ending. Keep at least three sounding notes in each half, make at least six edits, and listen to both endings in one pass.",
        recognition:
          "Do the two endings clearly belong to the same piece, while the second one feels more final rather than simply repeated?",
        source: {
          reference: "Belkin, Chapter 9 - Endings",
          focus:
            "The midpoint and final cadence can be motivically related while differing clearly in formal weight.",
          exampleIds: ["b03.finality"],
        },
        terms: [
          {
            term: "Open ending",
            definition:
              "An articulation strong enough to mark a boundary while still leaving a clear reason for the form to continue.",
          },
          {
            term: "Final ending",
            definition:
              "The more conclusive articulation that completes the entire form rather than only one section.",
          },
        ],
        workspace: "motif",
        checksLabel: "Differentiate the endings",
        successLabel: "The second ending now resolves the form more strongly than the first",
      }),
      evaluate: ({ melody, melodyDurations, experiments }) => {
        const firstIndices = melody.slice(0, 8).flatMap((note, index) => note === null ? [] : [index]);
        const secondIndices = melody.slice(8, 16).flatMap((note, index) => note === null ? [] : [index + 8]);
        const firstEnd = firstIndices.at(-1);
        const finalEnd = secondIndices.at(-1);
        return [
          {
            label: "You studied the hierarchy between the two endings",
            complete: analysed(experiments, "b03.finality", 3),
          },
          {
            label: "Both halves contain enough material to establish an ending",
            complete:
              sounding(melody.slice(0, 8)).length >= 3 &&
              sounding(melody.slice(8, 16)).length >= 3,
          },
          {
            label: "The endings use the same pitch",
            complete:
              firstEnd !== undefined &&
              finalEnd !== undefined &&
              melody[firstEnd] === melody[finalEnd],
          },
          {
            label: "The final ending carries more rhythmic weight",
            complete:
              firstEnd !== undefined &&
              finalEnd !== undefined &&
              (melodyDurations[finalEnd] ?? 1) >
                (melodyDurations[firstEnd] ?? 1),
          },
          {
            label: "You revised and heard both endings",
            complete: melodyEdits(experiments) >= 6 && heardPlayback(experiments),
          },
        ];
      },
    },
  ],
};
