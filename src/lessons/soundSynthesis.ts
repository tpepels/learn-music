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
  hero: "Learn why the same note can sound completely different.",
  description:
    "Keep pitch constant while changing waveform, filter, and envelope. You will hear timbre as something you can deliberately shape rather than as a mysterious preset choice.",
  overview:
    "A subtractive synthesizer begins with a harmonically rich oscillator and shapes it with a filter and amplitude envelope. Waveform affects the raw spectrum; the filter controls brightness; attack and release control how the sound enters and leaves.",
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
          "Audition C with sine, triangle, square, and sawtooth. Compare them using the same note. Finish on sawtooth so the next exercise starts with a harmonically rich sound.",
        recognition:
          "A sine is very pure, triangle is soft but slightly richer, square sounds hollow and bright, and sawtooth is dense and buzzy because it contains many harmonics.",
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
      evaluate: ({ synthSettings }) => [
        { label: "Sawtooth is selected for the next stage", complete: synthSettings.waveform === "sawtooth" },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.b",
        letter: "B",
        title: "Filter the brightness",
        learn: "Connect spectral brightness to low-pass cutoff.",
        explanation:
          "A low-pass filter lets low frequencies through while reducing frequencies above its cutoff. Lowering the cutoff removes upper harmonics from a sawtooth wave, making the sound darker without changing the played note.",
        instruction:
          "Play C repeatedly while moving Brightness from high to low. Finish with the cutoff between 800 and 2500 Hz so the difference from the raw sawtooth is obvious.",
        recognition:
          "When the cutoff falls, the sound loses edge and sparkle. The pitch remains C, but the timbre becomes darker and more muffled.",
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
      evaluate: ({ synthSettings }) => [
        { label: "Sawtooth remains selected", complete: synthSettings.waveform === "sawtooth" },
        { label: "Cutoff is between 800 and 2500 Hz", complete: synthSettings.cutoff >= 800 && synthSettings.cutoff <= 2500 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.c",
        letter: "C",
        title: "Shape the envelope",
        learn: "Hear how onset and decay change a sound's perceived character.",
        explanation:
          "An amplitude envelope describes how loudness changes over time. Attack controls how quickly a note reaches its level; release controls how long it fades after the note ends. These time shapes strongly affect whether a sound feels percussive, plucked, or pad-like.",
        instruction:
          "Raise Attack above 0.35 seconds and Release above 0.9 seconds. Compare that slow shape with very short settings, then return to the slow version.",
        recognition:
          "A slow attack removes the immediate 'hit' at the front of a note. A long release leaves a tail after the key is released, making notes overlap and feel smoother.",
        terms: [
          { term: "Envelope", definition: "A time-varying shape that controls a parameter such as amplitude." },
          { term: "Attack", definition: "How long a sound takes to rise from silence after a note begins." },
          { term: "Release", definition: "How long a sound takes to fade after a note ends." },
          { term: "ADSR", definition: "Attack, Decay, Sustain, Release: a common four-stage envelope model." },
        ],
        workspace: "synth",
        checksLabel: "Shape time",
        successLabel: "The sound now has a slow envelope",
      }),
      evaluate: ({ synthSettings }) => [
        { label: "Attack is at least 0.35 seconds", complete: synthSettings.attack >= 0.35 },
        { label: "Release is at least 0.9 seconds", complete: synthSettings.release >= 0.9 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "sound.synthesis.d",
        letter: "D",
        title: "Design a warm pad",
        learn: "Combine oscillator, filter, and envelope decisions into one intentional sound.",
        explanation:
          "Subtractive synthesis works by starting with spectral material and then removing or shaping parts of it. A pad usually favours a soft onset, sustained body, and lingering release rather than a sharp transient.",
        instruction:
          "Create a warm pad: use triangle or sawtooth, keep cutoff between 900 and 4500 Hz, Attack at least 0.4 seconds, and Release at least 1.1 seconds. Audition C-E-G as a small chord outline.",
        recognition:
          "The sound should swell rather than click into existence, remain relatively smooth instead of harsh, and fade gradually after each note.",
        terms: [
          { term: "Subtractive synthesis", definition: "Sound design that begins with a waveform and shapes it by filtering or reducing parts of its spectrum." },
          { term: "Pad", definition: "A sustained, usually smooth sound used to support harmony or atmosphere." },
          { term: "Transient", definition: "The short, often bright burst of energy at the beginning of many sounds." },
        ],
        workspace: "synth",
        checksLabel: "Design",
        successLabel: "You designed a pad from first principles",
      }),
      evaluate: ({ synthSettings }) => [
        { label: "Waveform is triangle or sawtooth", complete: synthSettings.waveform === "triangle" || synthSettings.waveform === "sawtooth" },
        { label: "Cutoff is warm rather than fully open", complete: synthSettings.cutoff >= 900 && synthSettings.cutoff <= 4500 },
        { label: "Attack is slow", complete: synthSettings.attack >= 0.4 },
        { label: "Release is long", complete: synthSettings.release >= 1.1 },
      ],
    },
  ],
};
