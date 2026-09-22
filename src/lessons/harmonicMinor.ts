import {
  aHarmonicMinorPitchClasses,
  isAHarmonicMinorMidi,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function notes(melody: Array<number | null>): number[] {
  return melody.filter((note): note is number => note !== null);
}

const lesson = lessonContentSchema.parse({
  id: "harmony.harmonic-minor",
  number: 25,
  title: "Harmonic minor & leading tone",
  eyebrow: "Piano · Tonality",
  hero: "Raise one note and the whole cadence changes.",
  description:
    "Change A natural minor's G into G♯. Hear the leading tone, the unusual augmented-second colour, and the much stronger pull from dominant harmony back to tonic.",
  overview:
    "Harmonic minor raises scale degree 7 of natural minor. In A minor, G becomes G♯. That single chromatic alteration places the seventh degree only one semitone below A, creating a leading tone and enabling a major or dominant-seventh V chord: E or E7.",
});

export const harmonicMinorLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.harmonic-minor.a",
        letter: "A",
        title: "Raise the seventh",
        learn: "Turn natural minor into harmonic minor by replacing ♭7 with a leading tone.",
        explanation:
          "A natural minor contains G. A harmonic minor raises that note to G♯. The other six pitch classes stay the same. This is not a key change; it is a common minor-key alteration used to strengthen dominant-to-tonic motion.",
        instruction:
          "Select A, B, C, D, E, F, and G♯. Deselect G and every other chromatic pitch.",
        recognition:
          "Compare G→A with G♯→A. G is a whole tone below A; G♯ is only a semitone below and sounds much more urgent.",
        terms: [
          { term: "Harmonic minor", definition: "A minor scale with a raised seventh degree: 1, 2, ♭3, 4, 5, ♭6, 7." },
          { term: "Raised seventh", definition: "Scale degree 7 moved up one semitone from natural minor." },
          { term: "Leading tone", definition: "A note one semitone below the tonic that strongly tends to resolve upward to it." },
          { term: "Chromatic alteration", definition: "Changing a scale note by a semitone without necessarily changing the overall key." },
        ],
        workspace: "harmonic-minor",
        checksLabel: "Build harmonic minor",
        successLabel: "G♯ has replaced G as the seventh degree",
      }),
      evaluate: ({ selectedPitchClasses }) => [
        {
          label: "All seven A-harmonic-minor pitch classes are selected",
          complete: aHarmonicMinorPitchClasses.every((pitch) =>
            selectedPitchClasses.includes(pitch),
          ),
        },
        {
          label: "No other pitch classes are selected",
          complete:
            selectedPitchClasses.length === 7 &&
            selectedPitchClasses.every((pitch) =>
              (aHarmonicMinorPitchClasses as readonly string[]).includes(pitch),
            ),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.harmonic-minor.b",
        letter: "B",
        title: "Resolve the leading tone",
        learn: "Hear why scale degree 7 is called a leading tone.",
        explanation:
          "The semitone from G♯ to A is one of the strongest melodic tendencies in A minor. Composers can delay, decorate, or avoid that resolution, but hearing the basic pull first makes later chromatic writing easier to understand.",
        instruction:
          "Place G♯ immediately followed by A somewhere in the melody. Keep every sounding note inside A harmonic minor.",
        recognition:
          "The G♯ should feel unstable by itself. The A immediately after it should sound like release and arrival.",
        terms: [
          { term: "Semitone resolution", definition: "Movement by the smallest chromatic interval into a more stable pitch." },
          { term: "Tendency tone", definition: "A note with a strong contextual pull toward another note." },
          { term: "Resolution", definition: "Movement from a comparatively unstable sound into a more stable one." },
        ],
        workspace: "harmonic-minor",
        checksLabel: "Make G♯ lead to A",
        successLabel: "The raised seventh now resolves like a true leading tone",
      }),
      evaluate: ({ melody }) => {
        const sounding = notes(melody);
        const resolves = melody.some(
          (note, index) =>
            note !== null &&
            note % 12 === 8 &&
            melody[index + 1] !== null &&
            melody[index + 1]! % 12 === 9,
        );
        return [
          { label: "Every note belongs to A harmonic minor", complete: sounding.every(isAHarmonicMinorMidi) },
          { label: "G♯ resolves directly upward to A", complete: resolves },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.harmonic-minor.c",
        letter: "C",
        title: "Hear the augmented second",
        learn: "Recognise the distinctive large step between ♭6 and raised 7 in harmonic minor.",
        explanation:
          "A harmonic minor contains F followed by G♯. That distance is three semitones: an augmented second. It gives the scale a distinctive melodic colour and is one reason melodic minor developed as an alternative for smoother lines.",
        instruction:
          "Place F immediately followed by G♯ somewhere in the melody, then continue to A.",
        recognition:
          "F→G♯ sounds noticeably wider than an ordinary whole step; G♯→A then contracts into a tight semitone resolution.",
        terms: [
          { term: "Augmented second", definition: "An interval spanning three semitones but spelled as two adjacent scale degrees, such as F to G♯." },
          { term: "Interval", definition: "The measured distance between two pitches." },
          { term: "Melodic minor", definition: "A minor-scale variant historically used to smooth melodic motion by raising degrees 6 and 7 when ascending." },
        ],
        workspace: "harmonic-minor",
        checksLabel: "Hear the characteristic gap",
        successLabel: "The F–G♯–A colour of harmonic minor is now audible",
      }),
      evaluate: ({ melody }) => [
        {
          label: "F moves directly to G♯",
          complete: melody.some(
            (note, index) =>
              note !== null &&
              note % 12 === 5 &&
              melody[index + 1] !== null &&
              melody[index + 1]! % 12 === 8,
          ),
        },
        {
          label: "G♯ then resolves to A",
          complete: melody.some(
            (note, index) =>
              note !== null &&
              note % 12 === 8 &&
              melody[index + 1] !== null &&
              melody[index + 1]! % 12 === 9,
          ),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.harmonic-minor.d",
        letter: "D",
        title: "Write a cadential minor phrase",
        learn: "Use the leading tone as part of a phrase rather than as an isolated scale exercise.",
        explanation:
          "The raised seventh is especially useful near phrase endings because it intensifies arrival on tonic. It does not need to appear constantly; one well-placed G♯ near the end can define the harmonic-minor sound.",
        instruction:
          "Write at least eight notes in A harmonic minor. Include at least one G♯ and make a G♯→A resolution somewhere in the second half. End the phrase on A.",
        recognition:
          "The phrase should mostly sound like A minor, with the G♯ creating a moment of extra forward pull before tonic.",
        terms: [
          { term: "Cadential", definition: "Relating to a cadence or phrase-ending gesture." },
          { term: "Voice leading", definition: "The way individual notes move from one harmony or melodic position to the next." },
          { term: "Tonal confirmation", definition: "A gesture that makes the listener hear a particular tonic more clearly." },
        ],
        workspace: "harmonic-minor",
        checksLabel: "Use the alteration musically",
        successLabel: "The raised seventh now strengthens a complete A-minor phrase",
      }),
      evaluate: ({ melody }) => {
        const sounding = notes(melody);
        const secondHalfResolution = melody.slice(8).some(
          (note, index) =>
            note !== null &&
            note % 12 === 8 &&
            melody[index + 9] !== null &&
            melody[index + 9]! % 12 === 9,
        );
        return [
          { label: "At least eight notes are present", complete: sounding.length >= 8 },
          { label: "Every note belongs to A harmonic minor", complete: sounding.every(isAHarmonicMinorMidi) },
          { label: "A G♯→A resolution occurs in the second half", complete: secondHalfResolution },
          {
            label: "The phrase ends on A",
            complete: sounding.length > 0 && sounding[sounding.length - 1] % 12 === 9,
          },
        ];
      },
    },
  ],
};
