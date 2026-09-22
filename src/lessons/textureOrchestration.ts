import {
  activeLayerCount,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "composition.texture-orchestration",
  number: 18,
  title: "Texture & orchestration",
  eyebrow: "Composition · Orchestration",
  hero: "Solve musical-space problems before reaching for the mixer.",
  description:
    "Place bass, chords, and melody in different registers, open chord voicings, use octave doubling deliberately, and shape density across the arrangement.",
  overview:
    "Orchestration is the decision of who plays what, where, and with how many layers. Register and spacing can create clarity before EQ; doubling can strengthen a line but also increase density; silence and sparse texture are compositional resources.",
});

export const textureOrchestrationLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.texture-orchestration.a",
        letter: "A",
        title: "Separate the registers",
        learn: "Give bass, harmony, and melody different vertical territories before trying to solve collisions with EQ.",
        explanation:
          "Register is where a part sits from low to high. Two well-written parts can still obscure one another if they occupy the same register. Moving one an octave is often a compositional solution, not a mixing trick.",
        instruction:
          "Set bass to LOWER (−12), chords to ORIGINAL, and melody to HIGHER (+12). Play the arrangement and compare the separation with all three at ORIGINAL.",
        recognition:
          "The layers should become easier to identify because their pitch ranges overlap less.",
        terms: [
          { term: "Register", definition: "The general low, middle, or high pitch region occupied by a musical part." },
          { term: "Register collision", definition: "When multiple parts occupy similar pitch space and become harder to distinguish." },
          { term: "Orchestration", definition: "Deciding which musical material is assigned to which instruments, registers, and combinations." },
        ],
        workspace: "texture",
        checksLabel: "Separate the vertical space",
        successLabel: "Bass, harmony, and melody now occupy distinct registers",
      }),
      evaluate: ({ textureSettings }) => [
        {
          label: "Bass is one octave lower",
          complete: textureSettings.bassOctave === -1,
        },
        {
          label: "Chords remain in the original register",
          complete: textureSettings.chordsOctave === 0,
        },
        {
          label: "Melody is one octave higher",
          complete: textureSettings.melodyOctave === 1,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.texture-orchestration.b",
        letter: "B",
        title: "Open the chord spacing",
        learn: "Increase vertical space inside a chord without changing its harmonic identity.",
        explanation:
          "Open voicing spreads chord tones over a wider range. Raising one voice by an octave can make harmony feel larger and reduce congestion in the middle register.",
        instruction:
          "Keep the separated registers and turn OPEN CHORD VOICING on. Compare it with the closed version while the progression plays.",
        recognition:
          "The chord should feel wider and less compact even though the chord symbol has not changed.",
        terms: [
          { term: "Open voicing", definition: "A chord spacing where notes are distributed over a wider register rather than packed closely together." },
          { term: "Closed voicing", definition: "A chord with its voices arranged as closely together as practical." },
          { term: "Spacing", definition: "The pitch distance between simultaneous voices." },
        ],
        workspace: "texture",
        checksLabel: "Widen the harmony",
        successLabel: "The chord texture now has more internal space",
      }),
      evaluate: ({ textureSettings }) => [
        {
          label: "Open chord voicing is enabled",
          complete: textureSettings.openChords,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.texture-orchestration.c",
        letter: "C",
        title: "Double the melody deliberately",
        learn: "Use octave doubling to strengthen a line and hear the cost in density.",
        explanation:
          "Doubling the same melody at the octave keeps pitch-class identity but adds another register and more energy. It can make a lead feel larger, but constant doubling can also reduce contrast.",
        instruction:
          "Turn MELODY OCTAVE DOUBLE on. Compare one melody voice with the doubled version, then keep the doubling enabled for this exercise.",
        recognition:
          "The melody should become broader and brighter, with the same contour reinforced an octave above.",
        terms: [
          { term: "Doubling", definition: "Assigning the same musical line to more than one voice or register." },
          { term: "Octave doubling", definition: "Repeating the same pitches twelve semitones higher or lower." },
          { term: "Weight", definition: "The perceived strength or size of a part created by register, doubling, timbre, and level." },
        ],
        workspace: "texture",
        checksLabel: "Strengthen the foreground",
        successLabel: "The melody now uses a deliberate octave double",
      }),
      evaluate: ({ textureSettings }) => [
        {
          label: "Melody octave doubling is enabled",
          complete: textureSettings.melodyOctaveDouble,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.texture-orchestration.d",
        letter: "D",
        title: "Shape density across the arrangement",
        learn: "Use orchestration and silence to make some bars sparse and others dense.",
        explanation:
          "Texture changes when the number of simultaneous layers changes. A dense climax is more effective when nearby material is sparse enough to create contrast.",
        instruction:
          "Keep the register separation. In Arrangement, make sure at least one bar uses 0–2 layers and at least one bar uses 3–4 layers. Return here and listen to how register and density work together.",
        recognition:
          "Sparse bars should expose individual parts; dense bars should feel like expansion rather than simply muddier playback.",
        terms: [
          { term: "Texture", definition: "The way simultaneous musical layers combine into a sparse, dense, transparent, or complex whole." },
          { term: "Density", definition: "How much musical activity or how many layers are present at once." },
          { term: "Foreground / background", definition: "The perceptual hierarchy between material meant to attract attention and material meant to support it." },
        ],
        workspace: "texture",
        checksLabel: "Create textural contrast",
        successLabel: "The arrangement now uses both register and density as compositional tools",
      }),
      evaluate: ({ textureSettings, arrangement }) => [
        {
          label: "Bass/chords/melody remain vertically separated",
          complete:
            textureSettings.bassOctave === -1 &&
            textureSettings.chordsOctave === 0 &&
            textureSettings.melodyOctave === 1,
        },
        {
          label: "At least one sparse bar uses 0–2 layers",
          complete: arrangement.some((bar) => activeLayerCount(bar) <= 2),
        },
        {
          label: "At least one dense bar uses 3–4 layers",
          complete: arrangement.some((bar) => activeLayerCount(bar) >= 3),
        },
      ],
    },
  ],
};
