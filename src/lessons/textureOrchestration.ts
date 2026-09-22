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
  hero: "Move the parts before you EQ them.",
  description:
    "Place bass, chords, and melody in different registers, open chord voicings, use octave doubling deliberately, and shape density across the arrangement.",
  overview:
    "Before fixing collisions with EQ, change where the parts live. Move a bass line down, open the chord spacing, double a melody only when the extra register helps, and leave parts out when space does more than another layer.",
});

export const textureOrchestrationLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.texture-orchestration.a",
        letter: "A",
        title: "Separate the registers",
        learn: "Give bass, harmony and melody enough register space to be heard separately.",
        explanation:
          "Register is where a part sits from low to high. Two well-written parts can still obscure one another if they occupy the same register. Moving one an octave is often a compositional solution, not a mixing trick.",
        instruction:
          "First make the register problem worse: put BASS one octave higher and MELODY one octave lower and listen to them crowd the middle. Then reverse it: BASS lower, CHORDS original, MELODY higher. Leave the separated version in place.",
        recognition:
          "Compare the crowded and separated versions. Which part becomes easier to follow first when the registers move apart?",
        terms: [
          { term: "Register", definition: "The general low, middle, or high pitch region occupied by a musical part." },
          { term: "Register collision", definition: "When multiple parts occupy similar pitch space and become harder to distinguish." },
          { term: "Orchestration", definition: "Deciding which musical material is assigned to which instruments, registers, and combinations." },
        ],
        workspace: "texture",
        checksLabel: "Separate the vertical space",
        successLabel: "Bass, harmony, and melody now occupy distinct registers",
      }),
      evaluate: ({ textureSettings, experiments }) => [
        {
          label: "You tried the deliberately crowded opposite registers first",
          complete:
            experiments["texture.bassOctave"]?.values.includes("1") === true &&
            experiments["texture.melodyOctave"]?.values.includes("-1") === true,
        },
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
          "Turn OPEN CHORD VOICING on, off, and on again while the progression plays. Listen to whether the wider spacing helps this arrangement or simply makes it thinner; leave it on for this exercise.",
        recognition:
          "Switch the voicing on and off. Does the wider spacing make the harmony breathe, or does it leave a hole in the middle?",
        terms: [
          { term: "Open voicing", definition: "A chord spacing where notes are distributed over a wider register rather than packed closely together." },
          { term: "Closed voicing", definition: "A chord with its voices arranged as closely together as practical." },
          { term: "Spacing", definition: "The pitch distance between simultaneous voices." },
        ],
        workspace: "texture",
        checksLabel: "Widen the harmony",
        successLabel: "The chord texture now has more internal space",
      }),
      evaluate: ({ textureSettings, experiments }) => [
        {
          label: "You compared closed and open voicing during this exercise",
          complete:
            experiments["texture.openChords"]?.values.includes("true") === true &&
            experiments["texture.openChords"]?.values.includes("false") === true,
        },
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
          "Turn MELODY OCTAVE DOUBLE on, then off, then on again while the phrase loops. Listen for the point where extra size becomes extra brightness rather than just extra loudness.",
        recognition:
          "Toggle the octave double. Does it make the line feel larger, or does it simply make the top end busier?",
        terms: [
          { term: "Doubling", definition: "Assigning the same musical line to more than one voice or register." },
          { term: "Octave doubling", definition: "Repeating the same pitches twelve semitones higher or lower." },
          { term: "Weight", definition: "The perceived strength or size of a part created by register, doubling, timbre, and level." },
        ],
        workspace: "texture",
        checksLabel: "Strengthen the foreground",
        successLabel: "The melody now uses a deliberate octave double",
      }),
      evaluate: ({ textureSettings, experiments }) => [
        {
          label: "You auditioned both single and octave-doubled melody",
          complete:
            experiments["texture.melodyOctaveDouble"]?.values.includes("true") === true &&
            experiments["texture.melodyOctaveDouble"]?.values.includes("false") === true,
        },
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
          "In the sparse bar, which part comes into focus? In the dense bar, does the added weight feel like expansion or just congestion?",
        terms: [
          { term: "Texture", definition: "The way simultaneous musical layers combine into a sparse, dense, transparent, or complex whole." },
          { term: "Density", definition: "How much musical activity or how many layers are present at once." },
          { term: "Foreground / background", definition: "The perceptual hierarchy between material meant to attract attention and material meant to support it." },
        ],
        workspace: "texture",
        checksLabel: "Create textural contrast",
        successLabel: "Register and density now shape the arrangement",
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
