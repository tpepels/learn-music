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

function newPitchCount(
  source: Array<number | null>,
  destination: Array<number | null>,
): number {
  const sourceSet = new Set(sounding(source));
  return new Set(sounding(destination).filter((note) => !sourceSet.has(note))).size;
}

function layerDifference(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function sharedLayers(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] && right[layer]).length;
}

const lesson = lessonContentSchema.parse({
  id: "belkin.contrasting",
  number: 4,
  title: "Contrasting",
  eyebrow: "Belkin · Composition craft",
  hero:
    "Control novelty instead of treating contrast as an on/off switch: decide how much needs to change, in which dimensions, and how strongly.",
  description:
    "Contrast renews attention and throws important ideas into relief, but too much novelty too often breaks continuity. The practical skill is to estimate the required degree of contrast and then revise specific musical dimensions until the result fits its formal location.",
  overview:
    "You will build mild, moderate and strong contrasts, repair an abrupt formal bump, strengthen material that has become too similar, and learn to lead familiar material toward different destinations.",
});

export const belkinContrastingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "belkin.contrasting.a",
        letter: "A",
        title: "Build three degrees of contrast",
        learn:
          "The strength of a contrast depends on how many musical dimensions change, how far they change, and how quickly those changes arrive.",
        explanation:
          `A single alteration rarely tells the whole story. Register, timbre, rhythm, articulation, harmony, dynamics, tempo and texture all contribute to character, and changes in some dimensions are perceptually more striking than changes in others.

A useful composing habit is therefore to think comparatively rather than vaguely. Instead of deciding that a new idea simply feels "different", ask whether the moment needs a small refresh, a substantial change of direction or a major rupture. You can then add or remove novelty deliberately while preserving enough continuity for the listener to keep the larger thread in memory.`,
        instruction:
          "Study all four contrast principles. In Arrangement, use bar 1 as a reference with at least two active layers. Make bar 3 a mild variant that changes exactly one layer state, bar 5 a moderate contrast that changes at least two layer states, and bar 7 a strong contrast that changes at least three. Make at least eight edits and listen through the whole span.",
        recognition:
          "Can you hear three genuinely different degrees of novelty rather than four arbitrary arrangements?",
        source: {
          reference: "Belkin, Chapter 11",
          focus:
            "Contrast can be roughly quantified by considering how many musical dimensions change, by how much and how quickly.",
          exampleIds: ["b04.contrast-scale"],
        },
        terms: [
          {
            term: "Degree of contrast",
            definition:
              "A practical estimate of how much novelty separates two musical states across all relevant dimensions.",
          },
          {
            term: "Continuity",
            definition:
              "The retained musical identity that allows new material to remain connected to what the listener already knows.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Grade the contrast",
        successLabel: "The passage now contains clearly mild, moderate and strong degrees of contrast",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You studied how contrast is distributed across musical dimensions",
          complete: analysed(experiments, "b04.contrast-scale", 4),
        },
        {
          label: "The reference state is substantial enough to compare",
          complete: activeLayerCount(arrangement[0]) >= 2,
        },
        {
          label: "The mild variant changes one layer",
          complete: layerDifference(arrangement[0], arrangement[2]) === 1,
        },
        {
          label: "The moderate variant changes at least two layers",
          complete: layerDifference(arrangement[0], arrangement[4]) >= 2,
        },
        {
          label: "The strong variant changes at least three layers",
          complete: layerDifference(arrangement[0], arrangement[6]) >= 3,
        },
        {
          label: "You revised and heard the complete contrast scale",
          complete: arrangementEdits(experiments) >= 8 && heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.contrasting.b",
        letter: "B",
        title: "Remove a formal bump",
        learn:
          "When too many dimensions change at once inside a small span, the listener can hear a bump instead of a convincing continuation.",
        explanation:
          `An abrupt change may be exactly right at a large structural boundary, but the same amount of novelty can feel disproportionate inside a short phrase. The repair is not to remove all contrast. It is to identify which changes are doing the most perceptual work and keep only enough of them to refresh the phrase.

This is a diagnostic skill. Listing what changes turns a vague judgement into something editable. Two different revisions can be equally successful if both reduce the amount of simultaneous novelty to a level that suits the context.`,
        instruction:
          "Study the three repair principles. In Arrangement, treat bars 3 and 4 as two successive states inside one phrase. Give bar 3 at least two active layers. Make bar 4 genuinely different, but limit the jump to one or two changed layer states and keep at least one layer in common. Make at least five arrangement edits and listen across the join.",
        recognition:
          "Does bar 4 refresh the phrase without sounding as though a different piece suddenly started?",
        source: {
          reference: "Belkin, Chapter 11 - Revising contrast",
          focus:
            "An overstrong contrast can be repaired by identifying the changed dimensions and reducing how many change at once or how far they move.",
          exampleIds: ["b04.reduce-bump"],
        },
        terms: [
          {
            term: "Formal bump",
            definition:
              "A disproportionate discontinuity caused by more novelty than the local formal context can convincingly absorb.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Smooth the local contrast",
        successLabel: "The join now changes character without breaking the phrase",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const difference = layerDifference(arrangement[2], arrangement[3]);
        return [
          {
            label: "You studied how to diagnose and reduce an excessive contrast",
            complete: analysed(experiments, "b04.reduce-bump", 3),
          },
          {
            label: "The first state has an established texture",
            complete: activeLayerCount(arrangement[2]) >= 2,
          },
          {
            label: "The next state changes, but not all at once",
            complete: difference >= 1 && difference <= 2,
          },
          {
            label: "Some continuity survives the change",
            complete: sharedLayers(arrangement[2], arrangement[3]) >= 1,
          },
          {
            label: "You revised and listened across the join",
            complete: arrangementEdits(experiments) >= 5 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.contrasting.c",
        letter: "C",
        title: "Add enough novelty",
        learn:
          "Contrast can also be too weak. When continuation becomes monotonous, introduce new features while preserving a recognisable connection to the original idea.",
        explanation:
          `Continuity is necessary, but excessive sameness makes later material feel inert. A useful contrasting continuation often keeps some familiar feature while changing several others. The retained feature gives the listener a point of reference; the new features create a sense that the music is moving away from its starting state.

The aim is not maximum difference. It is enough difference for the formal moment. In a short passage, one common pitch collection or recognisable gesture can provide sufficient glue while contour, register or pitch detail become more adventurous.`,
        instruction:
          "Study the three novelty principles. In Motif, use steps 1-8 as the source and 9-16 as a contrasting continuation. Put at least three sounding notes in each half. Reuse at least one pitch from the first half, introduce at least two pitches not heard there, and do not copy the first half literally. Make at least six edits and listen through both halves.",
        recognition:
          "Does the second half feel newly interesting while still sounding as though it belongs to the same musical thought?",
        source: {
          reference: "Belkin, Chapter 11 - Increasing contrast",
          focus:
            "When material is too similar, contrast can be raised by changing several dimensions while retaining enough common material for continuity.",
          exampleIds: ["b04.raise-contrast"],
        },
        terms: [
          {
            term: "Coherent novelty",
            definition:
              "New musical information that refreshes attention while retaining enough familiar material to preserve continuity.",
          },
        ],
        workspace: "motif",
        checksLabel: "Increase the novelty",
        successLabel: "The continuation now moves away from the source without losing its family resemblance",
      }),
      evaluate: ({ melody, experiments }) => {
        const first = melody.slice(0, 8);
        const second = melody.slice(8, 16);
        return [
          {
            label: "You studied how to raise contrast without losing continuity",
            complete: analysed(experiments, "b04.raise-contrast", 3),
          },
          {
            label: "Both halves contain enough material to compare",
            complete: sounding(first).length >= 3 && sounding(second).length >= 3,
          },
          {
            label: "The continuation retains a familiar pitch",
            complete: sharedPitches(first, second) >= 1,
          },
          {
            label: "The continuation introduces real novelty",
            complete: newPitchCount(first, second) >= 2 && !sameBlock(first, second),
          },
          {
            label: "You revised and heard the complete contrast",
            complete: melodyEdits(experiments) >= 6 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.contrasting.d",
        letter: "D",
        title: "Lead the same source somewhere new",
        learn:
          "Repeating the same contrast after the same material weakens its effect. A larger form becomes richer when familiar material can lead to different destinations.",
        explanation:
          `Contrast depends partly on expectation. Once the listener has heard a particular source followed by a particular contrasting state, repeating the same succession is less surprising the next time. Familiarity reduces the effective degree of contrast.

This does not mean abandoning recurrence. The familiar source can remain a unifying landmark while its destination changes. The result is a useful large-form technique: memory supplies continuity, but the new destination prevents the form from becoming mechanically predictable.`,
        instruction:
          "Study all three destination principles. In Arrangement, make bar 1 a stable source with at least two active layers. Use bar 4 as one contrasting destination and bar 8 as another. Each destination must differ from bar 1 in at least two layer states while retaining at least one source layer, and the two destinations must differ from each other in at least two states. Make at least eight edits and listen through the whole form.",
        recognition:
          "Does the repeated source feel like a familiar landmark while the two destinations produce genuinely different expectations?",
        source: {
          reference: "Belkin, Chapter 11 - Repeated contrasts",
          focus:
            "The same preceding material need not always lead to the same contrasting destination; varying the destination preserves surprise while reinforcing larger unity.",
          exampleIds: ["b04.varied-destinations"],
        },
        terms: [
          {
            term: "Destination",
            definition:
              "The contrasting musical state reached after familiar material, whose character and degree of novelty shape the larger form.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Vary the destination",
        successLabel: "The familiar source now leads convincingly to two different contrasting states",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You studied why repeated contrasts lose surprise",
          complete: analysed(experiments, "b04.varied-destinations", 3),
        },
        {
          label: "The source state is clearly established",
          complete: activeLayerCount(arrangement[0]) >= 2,
        },
        {
          label: "Both destinations contrast with the source",
          complete:
            layerDifference(arrangement[0], arrangement[3]) >= 2 &&
            layerDifference(arrangement[0], arrangement[7]) >= 2,
        },
        {
          label: "Both destinations retain some common ground",
          complete:
            sharedLayers(arrangement[0], arrangement[3]) >= 1 &&
            sharedLayers(arrangement[0], arrangement[7]) >= 1,
        },
        {
          label: "The destinations are meaningfully different from one another",
          complete: layerDifference(arrangement[3], arrangement[7]) >= 2,
        },
        {
          label: "You revised and heard the complete route",
          complete: arrangementEdits(experiments) >= 8 && heardPlayback(experiments),
        },
      ],
    },
  ],
};
