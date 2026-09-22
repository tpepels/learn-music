import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "sound.synthesis",
  number: 5,
  title: "Sound & synthesis",
  eyebrow: "Production · Sound design",
  hero: "Keep the notes. Change what kind of instrument they become.",
  description:
    "Keep the melody you wrote in the previous lesson, but change what is playing it. Holding the notes fixed makes waveform, brightness, and envelope easier to hear as sound-design choices rather than new composition.",
  overview:
    "A subtractive synth starts with an oscillator, removes brightness with a filter, then shapes the note in time with an envelope. Those three decisions can turn the same MIDI phrase into a pluck, a lead or a pad.",
});

export const soundSynthesisLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.a",
        letter: "A",
        title: "Compare oscillator waveforms",
        learn: "Hear timbre independently from pitch.",
        explanation:
          "An oscillator produces a repeating waveform. Different waveforms contain different combinations of harmonics, so C4 can sound soft, hollow, bright, or buzzy without changing its pitch.",
        instruction:
          "Click sine, triangle, square, and sawtooth so the same C is actually auditioned with every waveform. Go back and forth if you cannot yet describe the difference. Finish on sawtooth.",
        recognition:
          "Use the same C for every waveform. Which one has the least edge? Which one feels hollow? Which one gives the filter the most bright material to remove?",
        terms: [
          { term: "Oscillator", definition: "A synthesizer component that generates a repeating waveform and therefore a pitched sound." },
          { term: "Waveform", definition: "The shape of an oscillator's repeating cycle, such as sine, square, or sawtooth." },
          { term: "Timbre", definition: "The sound quality that lets two sources playing the same pitch still sound different." },
          { term: "Harmonic", definition: "A frequency related to the fundamental pitch by a whole-number multiple." },
        ],
        workspace: "synth",
        checksLabel: "Compare",
        successLabel: "You have a bright raw oscillator",
      }),
      evaluate: ({ synthSettings, experiments }) => {
        const heard = experiments["synth.waveform"]?.values ?? [];
        return [
          { label: "Sine, triangle, square, and sawtooth were all auditioned", complete: ["sine", "triangle", "square", "sawtooth"].every((waveform) => heard.includes(waveform)) },
          { label: "Sawtooth is selected for the next stage", complete: synthSettings.waveform === "sawtooth" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.b",
        letter: "B",
        title: "Filter the brightness",
        learn: "Hear how filter cutoff changes brightness without changing pitch.",
        explanation:
          "A low-pass filter lets low frequencies through while reducing frequencies above its cutoff. Lowering the cutoff removes upper harmonics from a sawtooth wave, making the sound darker without changing the played note.",
        instruction:
          "Move Brightness through a wide range while repeatedly auditioning the same note. Deliberately hear the almost-fully-open sound and a much darker one before settling somewhere between 800 and 2500 Hz.",
        recognition:
          "Sweep slowly. At what point does the note stop losing useful brightness and start sounding covered over?",
        terms: [
          { term: "Filter", definition: "A processor that changes a sound by attenuating selected frequency ranges." },
          { term: "Low-pass filter", definition: "A filter that passes lower frequencies and reduces higher frequencies." },
          { term: "Cutoff frequency", definition: "The frequency around which a filter begins to reduce the signal." },
          { term: "Spectrum", definition: "The distribution of energy across frequencies in a sound." },
        ],
        workspace: "synth",
        checksLabel: "Shape the spectrum",
        successLabel: "The sound is deliberately darker",
      }),
      evaluate: ({ synthSettings, experiments }) => {
        const sweep = experiments["synth.cutoff"];
        return [
          { label: "Sawtooth remains selected", complete: synthSettings.waveform === "sawtooth" },
          { label: "You swept at least 5000 Hz of filter range", complete: sweep?.min !== null && sweep?.max !== null && (sweep!.max! - sweep!.min!) >= 5000 },
          { label: "You auditioned notes while shaping the filter", complete: (experiments["synth.note-audition"]?.changes ?? 0) >= 2 },
          { label: "Final cutoff is deliberately dark", complete: synthSettings.cutoff >= 800 && synthSettings.cutoff <= 2500 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.c",
        letter: "C",
        title: "Turn the phrase into a pluck",
        learn: "Use envelope shape to change the role of the same musical material.",
        explanation:
          "An amplitude envelope describes how loudness changes over time. Attack controls how quickly a note reaches its level; release controls how long it fades after the note ends. These time shapes strongly affect whether a sound feels percussive, plucked, or pad-like.",
        instruction:
          "Switch to triangle, set Attack to 0.08 seconds or less and Release to 0.4 seconds or less, then use Play current melody. Compare the result with the darker sustained sawtooth from B: the notes should now speak separately and rhythmically.",
        recognition:
          "Listen between notes. Can you hear clean gaps, and does each onset feel separate enough to carry the rhythm?",
        terms: [
          { term: "Envelope", definition: "A time-varying shape that controls a parameter such as amplitude." },
          { term: "Attack", definition: "How long a sound takes to rise from silence after a note begins." },
          { term: "Release", definition: "How long a sound takes to fade after a note ends." },
          { term: "ADSR", definition: "Attack, Decay, Sustain, Release: a common four-stage envelope model." },
        ],
        workspace: "synth",
        checksLabel: "Shape time",
        successLabel: "The same melody now behaves like a pluck",
      }),
      evaluate: ({ synthSettings, experiments }) => [
        { label: "Triangle gives the phrase a softer harmonic starting point", complete: synthSettings.waveform === "triangle" },
        { label: "Attack is fast enough for a clear onset", complete: synthSettings.attack <= 0.08 },
        { label: "Release leaves rhythmic space", complete: synthSettings.release <= 0.4 },
        { label: "You auditioned the actual melody with the pluck", complete: (experiments["synth.phrase-audition"]?.changes ?? 0) >= 1 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.d",
        letter: "D",
        title: "Turn the same phrase into a pad",
        learn: "Choose synthesis settings for a contrasting musical role, not just a target value.",
        explanation:
          "Subtractive synthesis works by starting with spectral material and then removing or shaping parts of it. A pad usually favours a soft onset, sustained body, and lingering release rather than a sharp transient.",
        instruction:
          "Without changing the notes, turn the plucked phrase into a warm sustained layer: use triangle or sawtooth, keep cutoff between 900 and 4500 Hz, set Attack to at least 0.4 seconds and Release to at least 1.1 seconds, then play the current melody again.",
        recognition:
          "Play the same phrase again. Do the note starts still define the rhythm, or has the sound become a continuous bed behind it?",
        terms: [
          { term: "Subtractive synthesis", definition: "Sound design that begins with a waveform and shapes it by filtering or reducing parts of its spectrum." },
          { term: "Pad", definition: "A sustained, usually smooth sound used to support harmony or atmosphere." },
          { term: "Transient", definition: "The short, often bright burst of energy at the beginning of many sounds." },
        ],
        workspace: "synth",
        checksLabel: "Design",
        successLabel: "You designed a pad from first principles",
      }),
      evaluate: ({ synthSettings, experiments }) => [
        { label: "Waveform is triangle or sawtooth", complete: synthSettings.waveform === "triangle" || synthSettings.waveform === "sawtooth" },
        { label: "Cutoff is warm rather than fully open", complete: synthSettings.cutoff >= 900 && synthSettings.cutoff <= 4500 },
        { label: "Attack is slow", complete: synthSettings.attack >= 0.4 },
        { label: "Release is long", complete: synthSettings.release >= 1.1 },
        { label: "You auditioned the same melody in its new pad role", complete: (experiments["synth.phrase-audition"]?.changes ?? 0) >= 1 },
      ],
    },
  ],
};
