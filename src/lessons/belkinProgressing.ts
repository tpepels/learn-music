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

function groupPeak(sequence: Array<number | null>): number | null {
  const notes = sounding(sequence);
  return notes.length ? Math.max(...notes) : null;
}

function soundingCount(sequence: Array<number | null>): number {
  return sounding(sequence).length;
}

function layerDifference(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function averageSoundingDuration(
  melody: Array<number | null>,
  durations: number[],
  start: number,
  end: number,
): number | null {
  const values = melody
    .slice(start, end)
    .flatMap((note, localIndex) =>
      note === null ? [] : [durations[start + localIndex] ?? 1],
    );
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const lesson = lessonContentSchema.parse({
  id: "belkin.progressing",
  number: 6,
  title: "Progressing",
  eyebrow: "Belkin · Composition craft",
  hero:
    "Give a passage direction by shaping clear long-range progressions in pitch, rhythm, register, texture or intensity, then prepare climaxes so they feel inevitable rather than inserted.",
  description:
    "Progression means more than chord progression. Any perceptible incremental pattern can create expectation and suspense. Strong large-scale writing balances a clear overall direction with enough local variation to avoid mechanical predictability.",
  overview:
    "You will create a rising local progression with mild irregularity, build larger waves of intensity, hold back one element for a culminating peak, and accelerate the final approach to a climax.",
});

export const belkinProgressingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "belkin.progressing.a",
        letter: "A",
        title: "Make the direction obvious, not mechanical",
        learn:
          "A local progression needs a perceptible direction, but literal repetition quickly becomes predictable. Keep the overall trajectory clear while varying the details.",
        explanation:
          `Progression is an incremental pattern that the listener can follow. Rising melodic peaks are one of the clearest examples: each phrase reaches slightly higher than the last, so expectation accumulates toward a goal.

But a completely literal sequence can lose attention as soon as its rule becomes obvious. Small changes in rhythm, phrase length, contour or motivic detail restore suspense without hiding the larger direction. The listener should be able to predict the general destination without predicting every event on the way there.`,
        instruction:
          "Study all four local-progression principles. In Melody, treat steps 1-4, 5-8, 9-12 and 13-16 as four successive units. Put at least two sounding notes in each. Make the highest note of each unit rise above the previous unit, but vary the amount of material so the four units do not all contain exactly the same number of notes. Make at least eight edits and listen to the complete ascent.",
        recognition:
          "Can you hear one unmistakable rising trajectory while the individual units remain just unpredictable enough to keep your attention?",
        source: {
          reference: "Belkin, Chapter 13",
          focus:
            "Local progressions should have a clear overall direction while mild variation prevents literal sequence from becoming mechanical.",
          exampleIds: ["b06.local-progression"],
        },
        terms: [
          {
            term: "Progression",
            definition:
              "Any clearly incremental musical pattern that creates a sense of direction across time.",
          },
          {
            term: "Local progression",
            definition:
              "A short-range incremental process, such as rising peaks or a sequence, whose direction is audible within one passage.",
          },
        ],
        workspace: "melody",
        checksLabel: "Shape a rising trajectory",
        successLabel: "The line now rises clearly while the individual units avoid literal repetition",
      }),
      evaluate: ({ melody, experiments }) => {
        const groups = [
          melody.slice(0, 4),
          melody.slice(4, 8),
          melody.slice(8, 12),
          melody.slice(12, 16),
        ];
        const peaks = groups.map(groupPeak);
        const counts = groups.map(soundingCount);
        return [
          {
            label: "You studied how local progressions combine direction and variation",
            complete: analysed(experiments, "b06.local-progression", 4),
          },
          {
            label: "Every unit contains enough material to establish a phrase",
            complete: counts.every((count) => count >= 2),
          },
          {
            label: "The successive peaks rise consistently",
            complete:
              peaks.every((peak): peak is number => peak !== null) &&
              (peaks[0] as number) < (peaks[1] as number) &&
              (peaks[1] as number) < (peaks[2] as number) &&
              (peaks[2] as number) < (peaks[3] as number),
          },
          {
            label: "The local units are not mechanically identical in density",
            complete: new Set(counts).size >= 2,
          },
          {
            label: "You revised and heard the complete progression",
            complete: melodyEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.progressing.b",
        letter: "B",
        title: "Build intensity in waves",
        learn:
          "A long progression does not need to be a straight line. Local releases and detours can let the music breathe while successive peaks continue to intensify.",
        explanation:
          `On a larger scale, the listener can remember salient high points even when other activity intervenes. This makes it possible to build several waves rather than one uninterrupted ramp. Each wave can relax locally, then rise to a stronger peak.

The important thing is hierarchy. If every peak has the same weight, repetition makes later ones feel weaker. Graduating the peaks gives the entire span a larger direction and helps the listener hear separate events as parts of one gesture.`,
        instruction:
          "Study the long-range progression analysis. In Arrangement, make bars 2, 5 and 8 three successive peaks. Each peak must contain more active layers than the previous one. Make bar 3 lighter than bar 2 and bar 6 lighter than bar 5 so the form breathes between waves. Make at least eight edits and listen through all three rises.",
        recognition:
          "Do the local dips feel like breaths inside one larger build, with each new peak clearly outweighing the previous one?",
        source: {
          reference: "Belkin, Chapter 13 - Long-range progression",
          focus:
            "Successive salient events can form a progression over a large span even when local contrasts and releases intervene.",
          exampleIds: ["b06.long-range"],
        },
        terms: [
          {
            term: "Hierarchy of peaks",
            definition:
              "A graduated series of climactic points in which later peaks carry greater weight than earlier ones.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Build three waves",
        successLabel: "The passage now breathes locally while each successive peak grows stronger",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const firstPeak = activeLayerCount(arrangement[1]);
        const secondPeak = activeLayerCount(arrangement[4]);
        const thirdPeak = activeLayerCount(arrangement[7]);
        return [
          {
            label: "You studied how large progressions can contain local detours",
            complete: analysed(experiments, "b06.long-range", 4),
          },
          {
            label: "The three peaks increase in intensity",
            complete: firstPeak < secondPeak && secondPeak < thirdPeak,
          },
          {
            label: "The first wave releases before the next rise",
            complete: activeLayerCount(arrangement[2]) < firstPeak,
          },
          {
            label: "The second wave also releases before the final rise",
            complete: activeLayerCount(arrangement[5]) < secondPeak,
          },
          {
            label: "You revised and heard the complete long-range build",
            complete: arrangementEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.progressing.c",
        letter: "C",
        title: "Hold something back for the peak",
        learn:
          "A climax becomes more powerful when the build-up prepares it and one distinctive element is withheld until the culmination.",
        explanation:
          `A high point by itself is not a climax. The listener needs to feel the accumulation that makes the peak necessary. Preparation can come from rising register, increasing density, faster rhythm, growing dissonance or other coordinated progressions.

One especially effective device is restraint: do not reveal every available resource too early. If the music already sounds maximally full long before the peak, there is nowhere left to go. Holding one conspicuous element in reserve lets the climax crown an already strong build with genuinely new sensation.`,
        instruction:
          "Study all four climax-preparation principles. In Arrangement, keep bars 1-7 below full four-layer density. Make bar 7 contain exactly three active layers, then make bar 8 contain all four, changing only the one withheld layer at the final step. Make at least seven edits and listen from the beginning so the last addition feels prepared.",
        recognition:
          "Does the final layer feel like the crown of a build that was already strong, rather than simply another track being switched on?",
        source: {
          reference: "Belkin, Chapter 13 - Climax",
          focus:
            "Climaxes depend on accumulated preparation; withholding a distinctive element until the peak can make the culmination uniquely strong.",
          exampleIds: ["b06.climax-preparation"],
        },
        terms: [
          {
            term: "Climax",
            definition:
              "The high point of a prepared progression, whose force comes primarily from the accumulation leading into it.",
          },
          {
            term: "Culmination",
            definition:
              "The point at which a progression reaches its most salient or intense goal.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Reserve the final resource",
        successLabel: "The climax now arrives as the prepared completion of the build",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You studied what makes a climax feel prepared",
          complete: analysed(experiments, "b06.climax-preparation", 4),
        },
        {
          label: "The pre-climax state is strong but not yet complete",
          complete: activeLayerCount(arrangement[6]) === 3,
        },
        {
          label: "Full density is withheld until the final bar",
          complete:
            arrangement.slice(0, 7).every((bar) => activeLayerCount(bar) < 4) &&
            activeLayerCount(arrangement[7]) === 4,
        },
        {
          label: "Only the reserved element changes at the final step",
          complete: layerDifference(arrangement[6], arrangement[7]) === 1,
        },
        {
          label: "You revised and heard the complete build into the peak",
          complete: arrangementEdits(experiments) >= 7 && heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.progressing.d",
        letter: "D",
        title: "Accelerate into the goal",
        learn:
          "Near a major climax, simplifying and accelerating the progression can make the destination feel imminent.",
        explanation:
          `Once the listener understands the direction of a progression, compressing its final stages can create the feeling that the goal is suddenly closer. A pattern that first takes more time can begin to recur more quickly, like shifting into a higher gear.

The last arrival should still release the accumulated pressure. This exercise therefore separates the fast approach from the point of arrival: the later pre-climax events become shorter than the early ones, while the final sounding event regains duration and acts as the goal rather than another accelerated step.`,
        instruction:
          "Study the final-approach analysis. In Melody, write at least three sounding notes in steps 1-8 and at least four in steps 9-16. Make the average duration of the later pre-climax notes shorter than the early notes. Give the final sounding note a duration of at least two units so the acceleration resolves into an arrival. Make at least eight edits and listen through the entire approach.",
        recognition:
          "Do the later events feel as though they are arriving faster and faster at a goal that finally has room to land?",
        source: {
          reference: "Belkin, Chapter 13 - Final approach to climax",
          focus:
            "Simplification and acceleration near a culmination can make the goal feel imminent; the climax still needs enough arrival weight to release the build-up.",
          exampleIds: ["b06.accelerating-climax"],
        },
        terms: [
          {
            term: "Acceleration",
            definition:
              "A progressive increase in the rate at which important events or repetitions occur.",
          },
          {
            term: "Preparation",
            definition:
              "The accumulated musical evidence that makes a later climax feel necessary and expected.",
          },
        ],
        workspace: "melody",
        checksLabel: "Accelerate into the climax",
        successLabel: "The approach now tightens toward a final event that releases the accumulated momentum",
      }),
      evaluate: ({ melody, melodyDurations, experiments }) => {
        const soundingIndices = melody.flatMap((note, index) => note === null ? [] : [index]);
        const finalIndex = soundingIndices.at(-1);
        const earlyAverage = averageSoundingDuration(melody, melodyDurations, 0, 8);
        const lateAverage =
          finalIndex !== undefined
            ? averageSoundingDuration(melody, melodyDurations, 8, finalIndex)
            : null;
        return [
          {
            label: "You studied how acceleration can announce a climax",
            complete: analysed(experiments, "b06.accelerating-climax", 3),
          },
          {
            label: "The early span establishes a slower rate",
            complete: sounding(melody.slice(0, 8)).length >= 3,
          },
          {
            label: "The later span contains enough events to accelerate",
            complete: sounding(melody.slice(8, 16)).length >= 4,
          },
          {
            label: "The pre-climax events become shorter on average",
            complete:
              earlyAverage !== null &&
              lateAverage !== null &&
              lateAverage < earlyAverage,
          },
          {
            label: "The final event regains arrival weight",
            complete:
              finalIndex !== undefined &&
              (melodyDurations[finalIndex] ?? 1) >= 2,
          },
          {
            label: "You revised and heard the complete acceleration",
            complete: melodyEdits(experiments) >= 8 && heardPlayback(experiments),
          },
        ];
      },
    },
  ],
};
