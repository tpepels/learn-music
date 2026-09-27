import {
  aHarmonicMinorPitchClasses,
  isAHarmonicMinorMidi,
} from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
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
  hero: "Keep the minor phrase moving, then raise scale degree 7 and hear it lean harder toward tonic.",
  description:
    "Change one note of natural minor to create a leading tone. Hear the stronger pull to tonic, the unusual augmented-second colour, and the dominant harmony that results from that alteration.",
  overview:
    "Harmonic minor changes only one degree from natural minor: scale degree 7 rises by one semitone. That places a leading tone one semitone below tonic and creates much stronger dominant-to-tonic motion.",
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
          "Harmonic minor raises scale degree 7 of natural minor by one semitone while the other six degrees stay unchanged. This is not a key change; it is a common minor-key alteration used to create a leading tone and strengthen dominant-to-tonic motion.",
        instruction:
          "Start from A natural minor. Change only scale degree 7 so that it sits one semitone below tonic; keep the other six pitch classes unchanged.",
        recognition:
          "Play G→A, then G♯→A. Which first note makes A feel more inevitable?",
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
      evaluate: ({ selectedPitchClasses, experiments }) => [
        { label: "You replaced the natural seventh with the raised seventh", complete: changedControl(experiments, "pitch-class.select", 2) },
        { label: "You listened to the altered scale colour", complete: heardPlayback(experiments) },
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
          "A leading tone sits one semitone below tonic and has a strong tendency to resolve upward. Composers can delay, decorate, or avoid that resolution, but hearing the basic pull first makes later chromatic writing easier to understand.",
        instruction:
          "Place scale degree 7 immediately followed by tonic somewhere in the melody. Derive both pitches from A harmonic minor and keep every sounding note inside that scale.",
        recognition:
          "Pause on G♯ for a moment before A. How long can you leave it hanging before you want the resolution?",
        terms: [
          { term: "Semitone resolution", definition: "Movement by the smallest chromatic interval into a more stable pitch." },
          { term: "Tendency tone", definition: "A note with a strong contextual pull toward another note." },
          { term: "Resolution", definition: "Movement from a comparatively unstable sound into a more stable one." },
        ],
        workspace: "harmonic-minor",
        checksLabel: "Make G♯ lead to A",
        successLabel: "The raised seventh now resolves like a true leading tone",
      }),
      evaluate: ({ melody, experiments }) => {
        const sounding = notes(melody);
        const resolves = melody.some(
          (note, index) =>
            note !== null &&
            note % 12 === 8 &&
            melody[index + 1] !== null &&
            melody[index + 1]! % 12 === 9,
        );
        return [
          { label: "You wrote the leading-tone resolution here", complete: changedControl(experiments, "melody.edit", 2) },
          { label: "You listened to G♯ resolve into A", complete: heardPlayback(experiments) },
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
          "Harmonic minor places ♭6 next to raised 7. Those adjacent scale degrees are three semitones apart: an augmented second. It gives the scale a distinctive melodic colour and is one reason melodic minor developed as an alternative for smoother lines.",
        instruction:
          "Write the three-note gesture ♭6 → 7 → 1 somewhere in the melody. Derive the actual pitches from A harmonic minor rather than copying note names.",
        recognition:
          "Compare F→G and F→G♯. How much larger does the second jump feel, and what happens when G♯ then moves to A?",
        terms: [
          { term: "Augmented second", definition: "An interval spanning three semitones but spelled as two adjacent scale degrees, such as F to G♯." },
          { term: "Interval", definition: "The measured distance between two pitches." },

        ],
        workspace: "harmonic-minor",
        checksLabel: "Hear the characteristic gap",
        successLabel: "The F–G♯–A colour of harmonic minor is now audible",
      }),
      evaluate: ({ melody, experiments }) => [
        { label: "You wrote the F–G♯–A gesture in this exercise", complete: changedControl(experiments, "melody.edit", 3) },
        { label: "You listened to the augmented-second colour", complete: heardPlayback(experiments) },
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
          "The raised seventh is especially useful near phrase endings because it intensifies arrival on tonic. It does not need to appear constantly; one well-placed leading tone near the end can define the harmonic-minor sound.",
        instruction:
          "Write at least eight notes in A harmonic minor. Include the raised seventh and resolve it directly to tonic somewhere in the second half. End the phrase on tonic.",
        recognition:
          "Does G♯ feel like a colour that belongs to the phrase, or like a scale exercise pasted into it? Move it if the latter is true.",
        terms: [
          { term: "Cadential", definition: "Relating to a cadence or phrase-ending gesture." },
          { term: "Voice leading", definition: "The way individual notes move from one harmony or melodic position to the next." },
          { term: "Tonal confirmation", definition: "A gesture that makes the listener hear a particular tonic more clearly." },
        ],
        workspace: "harmonic-minor",
        checksLabel: "Use the alteration musically",
        successLabel: "The raised seventh now strengthens a complete A-minor phrase",
      }),
      evaluate: ({ melody, experiments }) => {
        const sounding = notes(melody);
        const secondHalfResolution = melody.slice(8).some(
          (note, index) =>
            note !== null &&
            note % 12 === 8 &&
            melody[index + 9] !== null &&
            melody[index + 9]! % 12 === 9,
        );
        return [
          { label: "You developed the cadential phrase in this exercise", complete: changedControl(experiments, "melody.edit", 4) },
          { label: "You listened to the leading tone inside the phrase", complete: heardPlayback(experiments) },
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
