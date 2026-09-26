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

function sameBlock(a: Array<number | null>, b: Array<number | null>): boolean {
  return a.length === b.length && a.every((note, index) => note === b[index]);
}

function layerDifference(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function sharedLayers(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] && right[layer]).length;
}

function adjacentDifferences(arrangement: ArrangementBar[]): number[] {
  return arrangement.slice(1).map((bar, index) => layerDifference(arrangement[index], bar));
}

const lesson = lessonContentSchema.parse({
  id: "belkin.connecting",
  number: 5,
  title: "Connecting",
  eyebrow: "Belkin · Composition craft",
  hero:
    "Compose transitions by controlling what changes and what stays familiar, so one character can evolve into another with exactly the amount of continuity or surprise you want.",
  description:
    "A convincing transition is not filler between important ideas. It is the musical process that makes one state lead to the next. Smooth transitions preserve common ground and stagger changes across dimensions; more abrupt transitions deliberately increase the rate or size of those changes.",
  overview:
    "You will build a one-change-at-a-time transition, use common material as structural glue, shorten a transition to increase surprise, and use a climax as a prepared turning point.",
});

export const belkinConnectingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "belkin.connecting.a",
        letter: "A",
        title: "Change one thing at a time",
        learn:
          "A smooth transition becomes convincing when the destination is known in advance and the differences between departure and arrival are introduced gradually rather than all at once.",
        explanation:
          `Before writing a transition, define both endpoints. Then identify the dimensions that differ - register, timbre, tempo, texture, articulation, pitch, harmony and rhythm are all part of the musical character even when some are not visually prominent in notation.

For a genuinely smooth transition, the important discipline is local: each step should introduce only a small amount of novelty. The greater the contrast between the endpoints, the more time the transition usually needs. This lets the listener update expectations without losing the thread.`,
        instruction:
          "Study all four smooth-transition principles. In Arrangement, make bars 1 and 8 differ in at least three layer states. Connect them so every adjacent pair of bars changes at most one layer state, and make at least three of those joins actually change something. Make at least eight edits and listen from the first state all the way to the destination.",
        recognition:
          "Can you hear the character changing continuously, without any single bar feeling like an unexplained jump?",
        source: {
          reference: "Belkin, Chapter 12",
          focus:
            "Smooth transition begins with known endpoints, a list of differences, and gradual changes in which only a small amount of novelty is introduced at each step.",
          exampleIds: ["b05.gradual-transition"],
        },
        terms: [
          {
            term: "Transition",
            definition:
              "A directed musical process that changes one established state into another.",
          },
          {
            term: "Common ground",
            definition:
              "Musical features that remain stable or familiar while other dimensions change.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Make the change continuous",
        successLabel: "The endpoints are strongly different, but the route between them now unfolds one step at a time",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const differences = adjacentDifferences(arrangement);
        return [
          {
            label: "You studied the full smooth-transition procedure",
            complete: analysed(experiments, "b05.gradual-transition", 4),
          },
          {
            label: "The departure and arrival are genuinely contrasting",
            complete: layerDifference(arrangement[0], arrangement[7]) >= 3,
          },
          {
            label: "No adjacent step changes more than one layer",
            complete: differences.every((difference) => difference <= 1),
          },
          {
            label: "The transition actually evolves across several steps",
            complete: differences.filter((difference) => difference === 1).length >= 3,
          },
          {
            label: "You revised and heard the entire transition",
            complete: arrangementEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.connecting.b",
        letter: "B",
        title: "Use common material as glue",
        learn:
          "A transition feels consequent when something familiar remains active while new features appear. The listener's memory becomes part of the connection.",
        explanation:
          `New material does not need to resemble the old material in every respect. A single salient common element can be enough to bind the two states while rhythm, contour, register or accompaniment evolve around it.

The useful question is not simply whether the start and end share something, but whether the transition makes that relation audible. A common pitch, contour fragment or rhythmic gesture can pass through the middle of the transition and act as a perceptual handhold while the rest of the music changes.`,
        instruction:
          "Study the three common-ground principles. In Motif, use steps 1-4 as the departure and 13-16 as the arrival, with at least two sounding notes in each. Make the two ideas different but give them at least one pitch in common. Use that shared pitch somewhere in steps 5-12 as part of the bridge. Put at least three sounding notes in the bridge, make at least six edits, and listen through the complete connection.",
        recognition:
          "Even though the final idea is different, can you hear the shared pitch acting as a thread through the transition?",
        source: {
          reference: "Belkin, Chapter 12 - Common elements",
          focus:
            "Transitions use familiar elements as structural glue while introducing novelty, allowing the new state to feel associated with what preceded it.",
          exampleIds: ["b05.common-ground"],
        },
        terms: [
          {
            term: "Structural glue",
            definition:
              "A retained or recalled feature that makes a new musical state feel connected to earlier material.",
          },
        ],
        workspace: "motif",
        checksLabel: "Carry something familiar through",
        successLabel: "The bridge now connects two different ideas through audible common ground",
      }),
      evaluate: ({ melody, experiments }) => {
        const departure = melody.slice(0, 4);
        const bridge = melody.slice(4, 12);
        const arrival = melody.slice(12, 16);
        const departureSet = new Set(sounding(departure));
        const shared = [...new Set(sounding(arrival).filter((note) => departureSet.has(note)))];
        return [
          {
            label: "You studied how familiar material can bind a transition",
            complete: analysed(experiments, "b05.common-ground", 3),
          },
          {
            label: "Both endpoints are established",
            complete: sounding(departure).length >= 2 && sounding(arrival).length >= 2,
          },
          {
            label: "The endpoints are not literal copies",
            complete: !sameBlock(departure, arrival),
          },
          {
            label: "A common pitch links departure and arrival",
            complete: shared.length >= 1,
          },
          {
            label: "The bridge carries that common ground forward",
            complete:
              sounding(bridge).length >= 3 &&
              shared.some((pitch) => sounding(bridge).includes(pitch)),
          },
          {
            label: "You revised and heard the complete connection",
            complete: melodyEdits(experiments) >= 6 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.connecting.c",
        letter: "C",
        title: "Control the amount of surprise",
        learn:
          "Once you can make a seamless transition, you can make it more dramatic by shortening the route or changing more than one dimension at a time.",
        explanation:
          `Smoothness is not always the goal. The same departure and arrival can be connected with different degrees of surprise. A longer route with small steps emphasises continuity; a shorter route or a larger local change increases drama.

The advantage of thinking in terms of transition rate is control. Instead of relying on accident, you can decide where the listener should feel a stronger jolt and how large that jolt should be. Even a dramatic transition usually benefits from some retained feature so the change still belongs to the same musical world.`,
        instruction:
          "Study all three surprise-control principles. In Arrangement, make bars 1 and 8 differ in at least three layer states. This time include at least one adjacent jump of two or three changed layer states, but never change all four at once. Keep some continuity around the middle by making either bar 3 share a layer with bar 1 or bar 5 share a layer with bar 8. Make at least seven edits and listen through the shorter, more dramatic route.",
        recognition:
          "Does the transition now feel noticeably more sudden than the previous one without collapsing into a completely unrelated cut?",
        source: {
          reference: "Belkin, Chapter 12 - Controlling surprise",
          focus:
            "The degree of continuity can be adjusted by changing more dimensions at once, making larger local changes or shortening the transition.",
          exampleIds: ["b05.control-surprise"],
        },
        terms: [
          {
            term: "Rate of change",
            definition:
              "How quickly musical dimensions evolve during a transition; increasing the rate usually increases surprise.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Increase the transition rate",
        successLabel: "The route is now shorter and more dramatic while retaining some continuity",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const differences = adjacentDifferences(arrangement);
        return [
          {
            label: "You studied how transition rate controls surprise",
            complete: analysed(experiments, "b05.control-surprise", 3),
          },
          {
            label: "The endpoints remain strongly contrasting",
            complete: layerDifference(arrangement[0], arrangement[7]) >= 3,
          },
          {
            label: "At least one join is deliberately more abrupt",
            complete: differences.some((difference) => difference >= 2 && difference <= 3),
          },
          {
            label: "No join becomes a total four-layer reset",
            complete: differences.every((difference) => difference <= 3),
          },
          {
            label: "Some common ground survives around the middle",
            complete:
              sharedLayers(arrangement[0], arrangement[2]) >= 1 ||
              sharedLayers(arrangement[4], arrangement[7]) >= 1,
          },
          {
            label: "You revised and heard the more dramatic route",
            complete: arrangementEdits(experiments) >= 7 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.connecting.d",
        letter: "D",
        title: "Turn through a climax",
        learn:
          "A cadence or climax can justify a more abrupt transformation because the listener already hears it as a significant turning point.",
        explanation:
          `Not every transition needs to be smoothed across its entire length. A prepared climax can become the hinge between two characters: the old material builds toward the peak, and the peak simultaneously releases or redirects energy into the new state.

The turning point works because the abruptness has been prepared. The listener has been led toward a significant arrival, so a larger change there feels motivated rather than arbitrary. Overlap can make the change even more forceful by letting the peak belong both to the ending gesture and to the beginning of what follows.`,
        instruction:
          "Study the turning-point analysis. In Arrangement, make bar 4 a local peak with at least three active layers and more layers than bar 3. Let bar 5 change at least two layer states from the peak but keep at least one peak layer sounding. By bar 8, establish a new state that differs from bar 1 in at least two layers and shares at least one layer with bar 5. Make at least seven edits and listen through the turning point.",
        recognition:
          "Does the change after the peak feel earned by the build-up, with the climax acting as a hinge rather than a random edit?",
        source: {
          reference: "Belkin, Chapter 12 - Turning points",
          focus:
            "Cadences and climaxes can support more abrupt transformation, especially when the point of arrival overlaps with the beginning of the new character.",
          exampleIds: ["b05.turning-point"],
        },
        terms: [
          {
            term: "Turning point",
            definition:
              "A significant cadence or climax that can redirect the music into a new state with more abrupt change than an ordinary transition.",
          },
          {
            term: "Overlap",
            definition:
              "A join in which the event completing one process simultaneously participates in the next one.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Make the climax redirect the form",
        successLabel: "The peak now turns convincingly into a different musical state",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You studied how climaxes and cadences can become turning points",
          complete: analysed(experiments, "b05.turning-point", 3),
        },
        {
          label: "The turning point is prepared as a local peak",
          complete:
            activeLayerCount(arrangement[3]) >= 3 &&
            activeLayerCount(arrangement[3]) > activeLayerCount(arrangement[2]),
        },
        {
          label: "The new state changes strongly at the peak",
          complete: layerDifference(arrangement[3], arrangement[4]) >= 2,
        },
        {
          label: "The turning point overlaps into the new state",
          complete: sharedLayers(arrangement[3], arrangement[4]) >= 1,
        },
        {
          label: "The final state establishes a new character without losing the bridge",
          complete:
            layerDifference(arrangement[0], arrangement[7]) >= 2 &&
            sharedLayers(arrangement[4], arrangement[7]) >= 1,
        },
        {
          label: "You revised and heard the full build-turn-release arc",
          complete: arrangementEdits(experiments) >= 7 && heardPlayback(experiments),
        },
      ],
    },
  ],
};
