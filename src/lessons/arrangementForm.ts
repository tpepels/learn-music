import {
  activeLayerCount,
  arrangementLayers,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "form.arrangement",
  number: 6,
  title: "Arrangement & form",
  eyebrow: "Composition · Production",
  hero: "Turn loops into music that changes over time.",
  description:
    "Use eight bars as a small structural canvas. You will shape texture, create contrast between sections, build toward a high point, and then release energy.",
  overview:
    "Arrangement decides when musical materials enter, leave, repeat, and change. Form is the larger pattern those decisions create. Even with the same groove, chords, and melody, changing layer density can create an intro, build, contrast, climax, and release.",
});

function totalLayers(arrangement: { [key: string]: boolean }[], start: number, end: number): number {
  return arrangement.slice(start, end).reduce(
    (total, bar) => total + Object.values(bar).filter(Boolean).length,
    0,
  );
}

function barsDiffer(
  first: Record<string, boolean>,
  second: Record<string, boolean>,
): boolean {
  return arrangementLayers.some((layer) => first[layer] !== second[layer]);
}

export const arrangementFormLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "form.arrangement.a",
        letter: "A",
        title: "Shape texture with layer density",
        learn: "Hear arrangement as the addition and removal of musical layers.",
        explanation:
          "Texture describes how many musical parts are present and how they interact. A sparse texture can make an intro feel exposed; a denser texture usually increases weight and energy.",
        instruction:
          "Make bars 1-2 sparse with no more than two active layers per bar. Make bars 3-4 denser with at least three active layers per bar. Press Play and listen to the change in weight.",
        recognition:
          "You should clearly hear less information at the beginning and a fuller sound when more layers enter, even though the tempo does not change.",
        terms: [
          { term: "Texture", definition: "The number and relationship of simultaneous musical layers." },
          { term: "Density", definition: "How much musical activity or how many layers are present in a span of time." },
          { term: "Layer", definition: "One musical role in an arrangement, such as drums, bass, chords, or melody." },
        ],
        workspace: "arrangement",
        checksLabel: "Shape density",
        successLabel: "The first four bars now grow in density",
      }),
      evaluate: ({ arrangement }) => [
        { label: "Bars 1-2 stay sparse", complete: activeLayerCount(arrangement[0]) <= 2 && activeLayerCount(arrangement[1]) <= 2 && activeLayerCount(arrangement[0]) > 0 },
        { label: "Bars 3-4 are denser", complete: activeLayerCount(arrangement[2]) >= 3 && activeLayerCount(arrangement[3]) >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "form.arrangement.b",
        letter: "B",
        title: "Create A/B contrast",
        learn: "Build a simple two-section form from contrasting textures.",
        explanation:
          "Form is the large-scale organisation of music. In a simple A/B form, one section establishes an identity and the next section changes enough that the listener perceives a new region.",
        instruction:
          "Treat bars 1-4 as section A and bars 5-8 as section B. Make at least two corresponding bars differ between the halves, while keeping at least one shared layer across both sections.",
        recognition:
          "At bar 5 you should hear a clear structural change, but not a completely unrelated track. Some shared material should connect B back to A.",
        terms: [
          { term: "Form", definition: "The large-scale organisation of sections across a piece of music." },
          { term: "Section", definition: "A substantial span of music with a recognisable role or identity." },
          { term: "A/B form", definition: "A form made from two contrasting sections, A followed by B." },
          { term: "Contrast", definition: "A deliberate difference that makes one musical event or section stand apart from another." },
        ],
        workspace: "arrangement",
        checksLabel: "Create contrast",
        successLabel: "The eight bars now have two sections",
      }),
      evaluate: ({ arrangement }) => {
        const changedPairs = [0, 1, 2, 3].filter((index) =>
          barsDiffer(arrangement[index], arrangement[index + 4]),
        ).length;
        const sharedLayer = arrangementLayers.some((layer) =>
          arrangement.slice(0, 4).some((bar) => bar[layer]) &&
          arrangement.slice(4, 8).some((bar) => bar[layer]),
        );
        return [
          { label: "At least two A/B bar pairs differ", complete: changedPairs >= 2 },
          { label: "At least one layer connects both sections", complete: sharedLayer },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "form.arrangement.c",
        letter: "C",
        title: "Build toward a climax",
        learn: "Use increasing density to create a larger structural arrival.",
        explanation:
          "A build increases tension or expectation before an important arrival. A climax is a point of especially high intensity. Production often creates this with additional layers, brighter sound, louder dynamics, or faster rhythmic activity.",
        instruction:
          "Make bars 5, 6, and 7 increase or maintain layer density, with bar 7 containing all four layers. Keep bar 5 lighter than bar 7.",
        recognition:
          "The later bars should feel as though they are accumulating energy. Bar 7 should sound like the fullest point so far.",
        terms: [
          { term: "Build", definition: "A passage that gradually increases expectation or energy before an arrival." },
          { term: "Climax", definition: "A point of especially high musical intensity or importance." },
          { term: "Energy curve", definition: "The perceived rise and fall of intensity across time." },
        ],
        workspace: "arrangement",
        checksLabel: "Build energy",
        successLabel: "The arrangement now reaches a clear high point",
      }),
      evaluate: ({ arrangement }) => {
        const d5 = activeLayerCount(arrangement[4]);
        const d6 = activeLayerCount(arrangement[5]);
        const d7 = activeLayerCount(arrangement[6]);
        return [
          { label: "Bars 5-7 do not lose density", complete: d5 <= d6 && d6 <= d7 },
          { label: "Bar 7 contains all four layers", complete: d7 === 4 },
          { label: "Bar 5 is lighter than the climax", complete: d5 < d7 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "form.arrangement.d",
        letter: "D",
        title: "Release after the climax",
        learn: "Create tension and release at the level of form.",
        explanation:
          "Tension and release operate at many scales: between notes, between chords, and across an entire arrangement. After a dense climax, removing layers can make the next bar feel larger emotionally precisely because less is happening.",
        instruction:
          "Keep bar 7 as the four-layer climax. Reduce bar 8 to one or two layers. Play all eight bars and listen for the moment the texture opens after the peak.",
        recognition:
          "Bar 7 should feel maximally full; bar 8 should feel like space suddenly returns. That drop in density is structural release.",
        terms: [
          { term: "Tension", definition: "A sense of instability, expectation, or unresolved energy." },
          { term: "Release", definition: "The reduction or resolution of tension." },
          { term: "Drop", definition: "In many electronic styles, a marked structural arrival often created by a dramatic change in energy or texture." },
        ],
        workspace: "arrangement",
        checksLabel: "Complete the arc",
        successLabel: "The eight bars now have a full energy arc",
      }),
      evaluate: ({ arrangement }) => [
        { label: "Bar 7 remains the four-layer climax", complete: activeLayerCount(arrangement[6]) === 4 },
        { label: "Bar 8 drops to one or two layers", complete: activeLayerCount(arrangement[7]) >= 1 && activeLayerCount(arrangement[7]) <= 2 },
        { label: "The second half contains more activity than the opening", complete: totalLayers(arrangement, 4, 8) > totalLayers(arrangement, 0, 4) },
      ],
    },
  ],
};
