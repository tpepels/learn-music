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
  hero: "Decide what enters, what leaves, and when.",
  description:
    "Use the same groove, bass, chords, and melody to make eight bars breathe. First hear simple density changes, then shape your own rise and release.",
  overview:
    "Arrangement is what happens after the loop works. A part can disappear for two bars, return at the right moment, or stay silent so another part matters more. The order of those choices is what gives a short loop a sense of direction.",
});

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
        learn: "Hear how much the arrangement changes when only the number of parts changes.",
        explanation:
          "You can create a lift without writing a new note. Two bars with one or two parts leave more space; bringing in three or four parts makes the same material feel larger.",
        instruction:
          "Make bars 1–2 sparse and bars 3–4 fuller. Play through the change, then toggle one layer in bar 3 off and on so you can hear exactly what that entry contributes.",
        recognition:
          "Listen to the boundary between bars 2 and 3. Which entering part makes the biggest difference to the sense of lift?",
        terms: [
          { term: "Texture", definition: "The number and relationship of simultaneous musical layers." },
          { term: "Density", definition: "How much musical activity or how many layers are present in a span of time." },
          { term: "Layer", definition: "One musical role in an arrangement, such as drums, bass, chords, or melody." },
        ],
        workspace: "arrangement",
        checksLabel: "Shape density",
        successLabel: "The first four bars now grow in density",
      }),
      evaluate: ({ arrangement, experiments }) => [
        { label: "You listened to the density change", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "You changed the layer plan and tested an entry", complete: (experiments["arrangement.edit"]?.changes ?? 0) >= 2 },
        { label: "Bars 1-2 stay sparse", complete: activeLayerCount(arrangement[0]) <= 2 && activeLayerCount(arrangement[1]) <= 2 && activeLayerCount(arrangement[0]) > 0 },
        { label: "Bars 3-4 are denser", complete: activeLayerCount(arrangement[2]) >= 3 && activeLayerCount(arrangement[3]) >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "form.arrangement.b",
        letter: "B",
        title: "Create A/B contrast",
        learn: "Make bar 5 feel like a new section without making it sound like a different song.",
        explanation:
          "A section change needs both memory and contrast. Keep something from the first four bars so the track still has an identity, but change enough at bar 5 that the ear notices a new region.",
        instruction:
          "Treat bars 1–4 as A and bars 5–8 as B. Keep at least one layer connecting both halves, but change at least two corresponding bars. Play across bar 5 more than once and adjust the change if it feels either invisible or too abrupt.",
        recognition:
          "At bar 5, can you hear a new section before you look at the screen? What still tells you it is the same track?",
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
      evaluate: ({ arrangement, experiments }) => {
        const changedPairs = [0, 1, 2, 3].filter((index) =>
          barsDiffer(arrangement[index], arrangement[index + 4]),
        ).length;
        const sharedLayer = arrangementLayers.some((layer) =>
          arrangement.slice(0, 4).some((bar) => bar[layer]) &&
          arrangement.slice(4, 8).some((bar) => bar[layer]),
        );
        return [
          { label: "You listened across the section boundary", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
          { label: "You edited the A/B contrast in this exercise", complete: (experiments["arrangement.edit"]?.changes ?? 0) >= 2 },
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
        learn: "Use entries to make one bar feel earned instead of merely louder.",
        explanation:
          "A build works when the ear notices accumulation. Adding one part, then another, can create expectation before a fuller moment even when the notes and tempo stay unchanged.",
        instruction:
          "Use bars 5–7 as a build. Let each bar keep or add density, and make bar 7 the fullest of the three. Play the run several times and decide which layer deserves to arrive last.",
        recognition:
          "Listen to bars 5–7 with your eyes off the layer buttons. Does bar 7 feel prepared, or does it simply appear?",
        terms: [
          { term: "Build", definition: "A passage that gradually increases expectation or energy before an arrival." },
          { term: "Climax", definition: "A point of especially high musical intensity or importance." },
          { term: "Energy curve", definition: "The perceived rise and fall of intensity across time." },
        ],
        workspace: "arrangement",
        checksLabel: "Build energy",
        successLabel: "The arrangement now reaches a clear high point",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const d5 = activeLayerCount(arrangement[4]);
        const d6 = activeLayerCount(arrangement[5]);
        const d7 = activeLayerCount(arrangement[6]);
        return [
          { label: "You listened through the build", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
          { label: "You shaped the build with fresh layer edits", complete: (experiments["arrangement.edit"]?.changes ?? 0) >= 2 },
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
        title: "Shape your own eight-bar arc",
        learn: "Choose where the track becomes fullest and where it lets go.",
        explanation:
          "There is no rule that the biggest moment must be bar 7. What matters is contrast: a fuller moment has more impact when the surrounding bars leave it somewhere to grow from and somewhere to fall away into.",
        instruction:
          "Rewrite the eight bars into an arrangement you would keep. Use at least six active bars, at least three different layer combinations, one sparse bar and one bar with three or four layers. Put the peak wherever you want, but make at least one later bar clearly lighter. Keep playback running and make at least four arrangement edits before you settle.",
        recognition:
          "Can you point to the moment the track opens up, the moment it is fullest, and the moment it breathes again without relying on bar numbers?",
        terms: [
          { term: "Tension", definition: "A sense of instability, expectation, or unresolved energy." },
          { term: "Release", definition: "The reduction or resolution of tension." },
          { term: "Drop", definition: "In many electronic styles, a marked structural arrival often created by a dramatic change in energy or texture." },
        ],
        workspace: "arrangement",
        checksLabel: "Make an arrangement",
        successLabel: "The eight bars now have a shape you chose",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const densities = arrangement.map(activeLayerCount);
        const activeBars = densities.filter((density) => density > 0).length;
        const signatures = new Set(
          arrangement
            .filter((bar) => activeLayerCount(bar) > 0)
            .map((bar) => arrangementLayers.map((layer) => (bar[layer] ? "1" : "0")).join("")),
        );
        const peakDensity = Math.max(...densities);
        const peakIndex = densities.findIndex((density) => density === peakDensity);
        const releaseAfterPeak = densities
          .slice(peakIndex + 1)
          .some((density) => density > 0 && density <= peakDensity - 1);

        return [
          { label: "You listened while shaping the full eight bars", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
          { label: "You made at least four arrangement edits in this pass", complete: (experiments["arrangement.edit"]?.changes ?? 0) >= 4 },
          { label: "At least six bars contain music", complete: activeBars >= 6 },
          { label: "The arrangement uses at least three different layer combinations", complete: signatures.size >= 3 },
          { label: "There is both a sparse bar and a fuller bar", complete: densities.some((density) => density >= 1 && density <= 2) && peakDensity >= 3 },
          { label: "A later bar releases some density after the peak", complete: peakIndex >= 0 && releaseAfterPeak },
        ];
      },
    },
  ],
};
