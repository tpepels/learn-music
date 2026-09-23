import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function activeLayers(bar: {
  drums: boolean;
  bass: boolean;
  chords: boolean;
  melody: boolean;
}) {
  return Number(bar.drums) + Number(bar.bass) + Number(bar.chords) + Number(bar.melody);
}

const lesson = lessonContentSchema.parse({
  id: "genre.ambient",
  number: 32,
  title: "Ambient: space, sustain & attention",
  eyebrow: "Genre lens · Ambient",
  hero: "Let duration, silence, and space become part of the composition.",
  description:
    "Use slower pacing, sustained notes, sparse arrangement, and long spatial effects to hear how attention changes when fewer events are allowed to last longer.",
  overview:
    "Ambient music is not simply 'slow music with reverb'. These exercises focus on transferable ideas: sustain, negative space, gradual change, and timbre as structure. Treat them as compositional options rather than genre rules.",
});

export const genreAmbientLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "genre.ambient.a",
        letter: "A",
        title: "Turn the synth into a slow layer",
        learn: "Use envelope shape to make notes arrive and disappear gradually.",
        explanation:
          "A long attack removes the sharp front edge of a note. A long release lets it continue after the key event ends. Together they can make the boundary between individual notes less important than the changing texture they create.",
        instruction:
          "Set the tempo between 60 and 90 BPM. Use triangle or sawtooth, keep Brightness between 800 and 4000 Hz, set Attack to at least 0.5 seconds and Release to at least 1.5 seconds, then use Play current melody once.",
        recognition:
          "Do you still hear separate notes, or do you start hearing one evolving layer? Which envelope control changes that perception most?",
        terms: [
          { term: "Attack", definition: "How long a sound takes to rise from silence after it begins." },
          { term: "Release", definition: "How long a sound takes to fade after the note ends." },
          { term: "Sustain", definition: "The continuation of a sound over time rather than only its initial attack." },
        ],
        workspace: "synth",
        checksLabel: "Slow the envelope",
        successLabel: "The synth now behaves as a sustained layer rather than a short voice",
      }),
      evaluate: ({ bpm, synthSettings, experiments }) => [
        {
          label: "Tempo is between 60 and 90 BPM",
          complete: bpm >= 60 && bpm <= 90,
        },
        {
          label: "Waveform is triangle or sawtooth",
          complete:
            synthSettings.waveform === "triangle" ||
            synthSettings.waveform === "sawtooth",
        },
        {
          label: "Brightness stays in a warm-to-open middle range",
          complete:
            synthSettings.cutoff >= 800 &&
            synthSettings.cutoff <= 4000,
        },
        {
          label: "Attack is at least 0.5 seconds",
          complete: synthSettings.attack >= 0.5,
        },
        {
          label: "Release is at least 1.5 seconds",
          complete: synthSettings.release >= 1.5,
        },
        {
          label: "You auditioned the actual melody with this envelope",
          complete:
            (experiments["synth.phrase-audition"]?.changes ?? 0) >= 1,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.ambient.b",
        letter: "B",
        title: "Make note length do the work",
        learn: "Use fewer starts and longer durations so the phrase changes through sustain rather than constant new events.",
        explanation:
          "A piano roll can create space in two different ways: rests between notes and notes that remain present for a long time. Long notes shift attention from rhythm toward colour, register, and overlap.",
        instruction:
          "In the melody roll, keep only 3–8 note starts across the 16 steps. Make at least two notes last four eighth-note cells or longer, and leave at least eight onset positions empty. Do not add notes merely to fill the grid.",
        recognition:
          "Which feels more spacious: a long note, or a rest? They create different kinds of emptiness.",
        terms: [
          { term: "Note duration", definition: "The amount of musical time a note continues after its onset." },
          { term: "Negative space", definition: "Intentional silence or reduced activity around musical events." },
          { term: "Onset", definition: "The moment a note begins." },
        ],
        workspace: "melody",
        checksLabel: "Compose with duration",
        successLabel: "The melody now uses sustain and silence as structural material",
      }),
      evaluate: ({ melody, melodyDurations }) => {
        const starts = melody
          .map((midi, step) => ({ midi, step }))
          .filter(
            (event): event is { midi: number; step: number } =>
              event.midi !== null,
          );
        return [
          {
            label: "The phrase uses 3–8 note starts",
            complete: starts.length >= 3 && starts.length <= 8,
          },
          {
            label: "At least two notes last a half note or longer",
            complete:
              starts.filter(
                ({ step }) => (melodyDurations[step] ?? 1) >= 4,
              ).length >= 2,
          },
          {
            label: "At least eight onset positions remain empty",
            complete: melody.filter((midi) => midi === null).length >= 8,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.ambient.c",
        letter: "C",
        title: "Arrange by thinning the texture",
        learn: "Create movement by changing density slowly rather than relying on a dramatic drop or build.",
        explanation:
          "When events are sparse, a single layer entering or leaving can become a major structural change. The arrangement can breathe without needing every section to escalate toward a climax.",
        instruction:
          "Across the eight bars, make at least two bars use only one or two layers and at least two other bars use two or three layers. Include at least one bar without drums, and avoid using all four layers in every bar.",
        recognition:
          "Can you hear the arrangement change even when the total number of events stays low?",
        terms: [
          { term: "Textural density", definition: "The amount of simultaneous musical material present at a moment." },
          { term: "Gradual form", definition: "Form shaped by slow changes in texture, timbre, or density rather than sharp section boundaries." },
        ],
        workspace: "arrangement",
        checksLabel: "Shape low-density form",
        successLabel: "The arrangement now moves through small changes in texture",
      }),
      evaluate: ({ arrangement }) => {
        const densities = arrangement.map(activeLayers);
        return [
          {
            label: "At least two bars use one or two layers",
            complete:
              densities.filter(
                (density) => density >= 1 && density <= 2,
              ).length >= 2,
          },
          {
            label: "At least two bars use two or three layers",
            complete:
              densities.filter(
                (density) => density >= 2 && density <= 3,
              ).length >= 2,
          },
          {
            label: "At least one bar has no drums",
            complete: arrangement.some((bar) => !bar.drums),
          },
          {
            label: "The full four-layer texture is not constant",
            complete: densities.some((density) => density < 4),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.ambient.d",
        letter: "D",
        title: "Make the room audible, then hide the effect",
        learn: "Exaggerate spatial processing first, then reduce it until the space feels larger than the effect itself.",
        explanation:
          "Long reverb can turn separate notes into a shared acoustic field, but obvious wash can erase all articulation. Hearing an excessive version first makes a subtler final setting easier to judge.",
        instruction:
          "While the arrangement plays, push Reverb Decay above 7 seconds once. Then bring it back to 4–6.5 seconds with 15–80 ms pre-delay. Send at least 20% of chords and 15% of melody to reverb. Leave enough dry signal that attacks still exist.",
        recognition:
          "At what point does the reverb stop sounding like an effect and start sounding like the environment the music occupies?",
        terms: [
          { term: "Reverb decay", definition: "How long the reverberant tail takes to fade." },
          { term: "Pre-delay", definition: "The delay between the dry sound and the start of the reverberant field." },
          { term: "Wet/dry balance", definition: "The relationship between processed signal and original signal." },
        ],
        workspace: "effects",
        checksLabel: "Turn effect into environment",
        successLabel: "The track now has a long space without losing all articulation",
      }),
      evaluate: ({ effectsSettings, mixerSettings, experiments }) => [
        {
          label: "You heard an exaggerated reverb tail above 7 seconds",
          complete:
            (experiments["effects.reverbDecay"]?.max ?? 0) >= 7,
        },
        {
          label: "Final decay is between 4 and 6.5 seconds",
          complete:
            effectsSettings.reverbDecay >= 4 &&
            effectsSettings.reverbDecay <= 6.5,
        },
        {
          label: "Pre-delay is between 15 and 80 ms",
          complete:
            effectsSettings.reverbPreDelay >= 0.015 &&
            effectsSettings.reverbPreDelay <= 0.08,
        },
        {
          label: "Chords feed at least 20% reverb",
          complete: mixerSettings.chords.reverb >= 0.2,
        },
        {
          label: "Melody feeds at least 15% reverb",
          complete: mixerSettings.melody.reverb >= 0.15,
        },
      ],
    },
  ],
};
