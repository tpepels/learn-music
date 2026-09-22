import {
  isChordTone,
  isCMajorMidi,
  type ChordProgression,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function chordForStep(
  step: number,
  progression: ChordProgression,
) {
  return progression[Math.floor(step / 4)] ?? null;
}

const lesson = lessonContentSchema.parse({
  id: "composition.melody-over-harmony",
  number: 15,
  title: "Melody over harmony",
  eyebrow: "Composition · Melody",
  hero: "Write tension against chords, then decide where it resolves.",
  description:
    "See each melody note in relation to the chord beneath it. Strong beats can anchor with chord tones while passing, neighbour, and chromatic notes create controlled tension between those anchors.",
  overview:
    "A melody does not exist independently of harmony. The same pitch may sound settled over one chord and tense over another. Composers use that relationship deliberately: chord tones stabilize, non-chord tones create motion, and resolution gives tension direction.",
});

export const melodyOverHarmonyLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.a",
        letter: "A",
        title: "Land on chord tones",
        learn: "Anchor important moments of the melody in the harmony beneath them.",
        explanation:
          "Chord tones belong directly to the current harmony. Putting them at important structural moments makes the melody and progression sound connected instead of accidentally superimposed.",
        instruction:
          "Make sure all four chord slots are filled. Put a chord tone on melody steps 1, 5, 9, and 13—the first step of each chord region.",
        recognition:
          "Each chord change should feel supported by the melody rather than immediately rubbing against it.",
        terms: [
          { term: "Chord tone", definition: "A melody note that is part of the chord sounding underneath it." },
          { term: "Non-chord tone", definition: "A melody note that is not contained in the current chord." },
          { term: "Structural beat", definition: "A metrically or formally important position where stable notes often carry extra weight." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Anchor the changes",
        successLabel: "The melody now lands inside each harmony",
      }),
      evaluate: ({ melody, chordProgression }) => [
        {
          label: "All four chord slots are filled",
          complete: chordProgression.every(Boolean),
        },
        ...[0, 4, 8, 12].map((step) => {
          const chord = chordForStep(step, chordProgression);
          const note = melody[step];
          return {
            label: "Step " + (step + 1) + " is a chord tone",
            complete: Boolean(chord && note !== null && isChordTone(note, chord)),
          };
        }),
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.b",
        letter: "B",
        title: "Use passing tones",
        learn: "Connect stable notes with stepwise non-chord tones rather than jumping between chord tones only.",
        explanation:
          "A passing tone fills the space between two more stable notes by step. It creates motion because it is heard as part of a line rather than as a destination.",
        instruction:
          "Create at least two in-key passing tones inside chord regions. A passing tone should be a non-chord note between two nearby notes, moving in the same direction.",
        recognition:
          "The middle note should feel like motion through the harmony, not a place where the phrase wants to stop.",
        terms: [
          { term: "Passing tone", definition: "A non-chord note that connects two more stable notes by stepwise motion." },
          { term: "Stepwise motion", definition: "Melodic movement by a semitone or whole tone." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Connect the anchors",
        successLabel: "Passing notes now create smooth motion through the chords",
      }),
      evaluate: ({ melody, chordProgression }) => {
        let passing = 0;

        for (let step = 1; step < melody.length - 1; step += 1) {
          const prev = melody[step - 1];
          const note = melody[step];
          const next = melody[step + 1];
          const chord = chordForStep(step, chordProgression);

          if (
            prev === null ||
            note === null ||
            next === null ||
            !chord ||
            Math.floor((step - 1) / 4) !== Math.floor(step / 4) ||
            Math.floor((step + 1) / 4) !== Math.floor(step / 4)
          ) {
            continue;
          }

          const up = prev < note && note < next;
          const down = prev > note && note > next;
          const stepwise =
            Math.abs(note - prev) <= 2 && Math.abs(next - note) <= 2;

          if (
            (up || down) &&
            stepwise &&
            isCMajorMidi(note) &&
            !isChordTone(note, chord)
          ) {
            passing += 1;
          }
        }

        return [
          {
            label: "At least two in-key passing tones connect nearby notes",
            complete: passing >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.c",
        letter: "C",
        title: "Leave and return with a neighbour note",
        learn: "Create a tiny tension by stepping away from a stable pitch and returning to it.",
        explanation:
          "A neighbour note decorates a stable note by moving one step away and then returning. The listener hears the outside note as temporary because the surrounding pitch remains the reference point.",
        instruction:
          "Create at least one three-note neighbour figure inside a chord region: stable note → one step away → same stable note.",
        recognition:
          "The middle note should feel like a brief detour around a pitch that clearly remains the centre of the gesture.",
        terms: [
          { term: "Neighbour note", definition: "A non-chord or decorative note approached by step and followed by a return to the original note." },
          { term: "Decoration", definition: "A note whose role is to embellish a more structurally important pitch." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Decorate one stable pitch",
        successLabel: "The melody now uses a clear neighbour-note gesture",
      }),
      evaluate: ({ melody, chordProgression }) => {
        let found = false;

        for (let step = 0; step < melody.length - 2; step += 1) {
          const a = melody[step];
          const b = melody[step + 1];
          const c = melody[step + 2];
          const chord = chordForStep(step, chordProgression);

          if (
            a !== null &&
            b !== null &&
            c !== null &&
            chord &&
            Math.floor(step / 4) === Math.floor((step + 2) / 4) &&
            a === c &&
            Math.abs(b - a) <= 2 &&
            Math.abs(b - a) > 0 &&
            isChordTone(a, chord)
          ) {
            found = true;
          }
        }

        return [{ label: "A stable–neighbour–stable figure exists", complete: found }];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.d",
        letter: "D",
        title: "Create and resolve tension",
        learn: "Use non-chord notes deliberately because of where they go next.",
        explanation:
          "Tension is useful when it has direction. A non-chord note can sound expressive rather than wrong when the listener hears it resolve into a nearby chord tone.",
        instruction:
          "Create at least two places where a non-chord note resolves on the very next step to a chord tone. End the phrase on a chord tone of the final active chord.",
        recognition:
          "The tense notes should sound temporary. The following chord tones should feel like small arrivals.",
        terms: [
          { term: "Tension", definition: "A note or harmony that sounds unstable relative to its context and creates expectation." },
          { term: "Resolution", definition: "Movement from tension into a more stable note or harmony." },
          { term: "Target tone", definition: "A destination pitch deliberately approached by the melodic line." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Aim the tension",
        successLabel: "Non-chord notes now have clear destinations",
      }),
      evaluate: ({ melody, chordProgression }) => {
        let resolutions = 0;
        for (let step = 0; step < melody.length - 1; step += 1) {
          const note = melody[step];
          const next = melody[step + 1];
          const chord = chordForStep(step, chordProgression);
          const nextChord = chordForStep(step + 1, chordProgression);
          if (
            note !== null &&
            next !== null &&
            chord &&
            nextChord &&
            !isChordTone(note, chord) &&
            isChordTone(next, nextChord) &&
            Math.abs(next - note) <= 2
          ) {
            resolutions += 1;
          }
        }

        const finalStep = [...melody]
          .map((note, step) => ({ note, step }))
          .reverse()
          .find(({ note }) => note !== null);
        const finalChord = finalStep
          ? chordForStep(finalStep.step, chordProgression)
          : null;

        return [
          {
            label: "At least two tensions resolve by step",
            complete: resolutions >= 2,
          },
          {
            label: "Final melody note belongs to its chord",
            complete: Boolean(
              finalStep &&
                finalStep.note !== null &&
                finalChord &&
                isChordTone(finalStep.note, finalChord),
            ),
          },
        ];
      },
    },
  ],
};
