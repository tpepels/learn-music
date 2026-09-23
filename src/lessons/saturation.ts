import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "production.saturation",
  number: 20,
  title: "Saturation & distortion",
  eyebrow: "Production · Harmonics",
  hero: "Add colour until you hear it, then decide how much to keep.",
  description:
    "Drive signals into nonlinear processing, hear the added harmonics, use wet/dry blending for parallel colour, and learn why saturation is often subtle while distortion can be an obvious effect.",
  overview:
    "Drive changes the shape of the sound and creates extra harmonics. Wet/dry decides how much of that colour you keep. Push it far enough to recognise the effect, then back off to the amount the part can use.",
});

export const saturationLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.saturation.a",
        letter: "A",
        title: "Give the bass harmonic weight",
        learn: "Use moderate saturation to make low notes generate audible upper harmonics.",
        explanation:
          "Very low fundamentals can disappear on small speakers. Saturation creates harmonics above the fundamental, helping the ear infer the bass pitch even when the deepest frequency is reproduced weakly.",
        instruction:
          "Start on BASS with Wet near 0%. Raise it until the added harmonics are obvious, move back and forth between almost dry and clearly saturated, then choose a blend that adds audible weight without replacing the clean tone.",
        recognition:
          "On a quiet playback, does the bass remain easier to follow with some saturation? At what point does useful weight turn into fuzz?",
        terms: [
          { term: "Saturation", definition: "Mild nonlinear processing that adds harmonics and softens waveform peaks." },
          { term: "Harmonic", definition: "A frequency at an integer multiple of a fundamental frequency that contributes to timbre." },
          { term: "Drive", definition: "How strongly a signal is pushed into a nonlinear processor." },
        ],
        workspace: "saturation",
        checksLabel: "Add useful harmonics",
        successLabel: "The bass now has controlled harmonic density",
      }),
      evaluate: ({ saturationSettings }) => [
        {
          label: "Bass drive is moderate",
          complete:
            saturationSettings.bass.drive >= 0.15 &&
            saturationSettings.bass.drive <= 0.4,
        },
        {
          label: "Bass wet blend is between 25% and 55%",
          complete:
            saturationSettings.bass.wet >= 0.25 &&
            saturationSettings.bass.wet <= 0.55,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.saturation.b",
        letter: "B",
        title: "Make parallel drum crunch",
        learn: "Blend a strongly distorted drum signal underneath the cleaner transient.",
        explanation:
          "Parallel distortion lets the clean path keep transient definition while the distorted path contributes density and aggression. The wet control is therefore as important as Drive.",
        instruction:
          "Overdrive the DRUMS on purpose. Use strong Drive and push Wet until the transients are obviously crushed; then retreat until the clean attack returns over a gritty parallel layer.",
        recognition:
          "Listen to the front edge of the kick and snare. Can you keep that attack while adding grit underneath it?",
        terms: [
          { term: "Parallel processing", definition: "Blending a processed signal with an unprocessed version of the same source." },
          { term: "Transient", definition: "The short initial burst of energy at the start of a sound, such as a drum hit." },
          { term: "Distortion", definition: "Stronger nonlinear waveform reshaping that can become an audible effect in its own right." },
        ],
        workspace: "saturation",
        checksLabel: "Keep clean attack plus dirty body",
        successLabel: "The drum bus now uses parallel distortion rather than all-or-nothing fuzz",
      }),
      evaluate: ({ saturationSettings }) => [
        {
          label: "Drum drive is clearly strong",
          complete:
            saturationSettings.drums.drive >= 0.45 &&
            saturationSettings.drums.drive <= 0.8,
        },
        {
          label: "Wet blend stays parallel rather than fully distorted",
          complete:
            saturationSettings.drums.wet >= 0.15 &&
            saturationSettings.drums.wet <= 0.4,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.saturation.c",
        letter: "C",
        title: "Use subtle colour on harmony",
        learn: "Hear saturation as timbral colour rather than only as an obvious distorted effect.",
        explanation:
          "On sustained material, a small amount of nonlinear colour can make harmonics richer without announcing 'distortion'. This is common on synths, keys, buses, and analogue-style channel strips.",
        instruction:
          "Colour the CHORDS more quietly than the rhythm section. Compare almost dry with a clearly saturated version, then back off until the effect is easier to miss than on drums or bass.",
        recognition:
          "Toggle between dry and the final setting. Is the difference easier to feel than to identify as distortion?",
        terms: [
          { term: "Colour", definition: "A tonal character added by processing that changes timbre without changing the notes." },
          { term: "Soft clipping", definition: "A gradual rounding of waveform peaks rather than an abrupt hard limit." },
        ],
        workspace: "saturation",
        checksLabel: "Keep the effect understated",
        successLabel: "The chord colour is present without becoming obvious distortion",
      }),
      evaluate: ({ saturationSettings }) => [
        {
          label: "Chord drive stays moderate",
          complete:
            saturationSettings.chords.drive >= 0.1 &&
            saturationSettings.chords.drive <= 0.35,
        },
        {
          label: "Chord wet blend is 30% or less",
          complete:
            saturationSettings.chords.wet > 0 &&
            saturationSettings.chords.wet <= 0.3,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.saturation.d",
        letter: "D",
        title: "Create different amounts of colour",
        learn: "Use saturation selectively so every channel does not acquire the same texture.",
        explanation:
          "Processing every track identically reduces contrast. Producers often saturate the low end or drums more strongly while leaving foreground detail cleaner.",
        instruction:
          "Orchestrate the distortion across the full mix. Keep saturation active on at least two channels at different amounts, let drums carry more obvious colour than melody, and decide by ear whether bass or chords need any at all.",
        recognition:
          "Listen to drums, bass, chords and melody as separate textures. Do they still have different amounts of roughness and clarity?",
        terms: [
          { term: "Processing contrast", definition: "Using different amounts or types of processing so parts retain distinct roles." },
          { term: "Articulation", definition: "The clarity of note attacks, endings, and small performance details." },
        ],
        workspace: "saturation",
        checksLabel: "Use distortion selectively",
        successLabel: "Different layers now have deliberately different harmonic colour",
      }),
      evaluate: ({ saturationSettings }) => {
        const active = Object.values(saturationSettings).filter(
          (settings) => settings.wet >= 0.08 && settings.drive >= 0.08,
        ).length;
        return [
          {
            label: "At least two channels use saturation",
            complete: active >= 2,
          },
          {
            label: "Drums are wetter than melody",
            complete:
              saturationSettings.drums.wet >
              saturationSettings.melody.wet,
          },
          {
            label: "Melody remains below 20% wet",
            complete: saturationSettings.melody.wet < 0.2,
          },
        ];
      },
    },
  ],
};
