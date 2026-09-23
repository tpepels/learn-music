import {
  isChordTone,
  isCMajorMidi,
  type ChordProgression,
} from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
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
  hero: "Make a note rub against the chord, then give it somewhere to go.",
  description:
    "Put the melody you have been developing back over its chord progression. Now each note can be judged by what is sounding underneath it, not only by whether it belongs to the key.",
  overview:
    "The chord underneath changes what a melody note means. One note can feel settled over one harmony and exposed over the next. Use that difference to decide where the line rests and where it moves.",
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
          "Chord tones are the notes already inside the current harmony. Landing on them at important moments makes melody and chords feel connected instead of like two unrelated clips playing together.",
        instruction:
          "Press Play: you now hear your groove, chord progression, and melody together. Make sure all four chord slots are filled, then put a chord tone on melody steps 1, 5, 9, and 13—the start of each chord region.",
        recognition:
          "At each chord change, listen to the melody note first. Does it settle into the chord, or does it immediately ask to move?",
        terms: [
          { term: "Chord tone", definition: "A melody note that is part of the chord sounding underneath it." },
          { term: "Non-chord tone", definition: "A melody note that is not contained in the current chord." },
          { term: "Structural beat", definition: "A metrically or formally important position where stable notes often carry extra weight." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Anchor the changes",
        successLabel: "The melody now lands inside each harmony",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => [
        { label: "You placed or revised the four harmonic landings", complete: changedControl(experiments, "melody.edit", 4) },
        { label: "You listened to the melody against the chords", complete: heardPlayback(experiments) },
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
          "Hold the middle note in your ear. Does it sound like a destination, or like a bridge between the notes on either side?",
        terms: [
          { term: "Passing tone", definition: "A non-chord note that connects two more stable notes by stepwise motion." },
          { term: "Stepwise motion", definition: "Melodic movement by a semitone or whole tone." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Connect the anchors",
        successLabel: "Passing notes now create smooth motion through the chords",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => {
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
          { label: "You revised the line to create passing motion", complete: changedControl(experiments, "melody.edit", 2) },
          { label: "You listened to the passing tones in context", complete: heardPlayback(experiments) },
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
          "Does the middle note feel like a detour while the repeated outer note still feels like the point of rest?",
        terms: [
          { term: "Neighbour note", definition: "A non-chord or decorative note approached by step and followed by a return to the original note." },
          { term: "Decoration", definition: "A note whose role is to embellish a more structurally important pitch." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Decorate one stable pitch",
        successLabel: "The melody now uses a clear neighbour-note gesture",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => {
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

        return [
          { label: "You revised the melody to make the neighbour gesture", complete: changedControl(experiments, "melody.edit", 2) },
          { label: "You listened to the detour and return", complete: heardPlayback(experiments) },
          { label: "A stable–neighbour–stable figure exists", complete: found },
        ];
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
          "Pause mentally on the non-chord note, then hear the next step. Does the second note answer the tension the first one created?",
        terms: [
          { term: "Tension", definition: "A note or harmony that sounds unstable relative to its context and creates expectation." },
          { term: "Resolution", definition: "Movement from tension into a more stable note or harmony." },
          { term: "Target tone", definition: "A destination pitch deliberately approached by the melodic line." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Aim the tension",
        successLabel: "Non-chord notes now have clear destinations",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => {
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
          { label: "You revised the line to create directed tension", complete: changedControl(experiments, "melody.edit", 2) },
          { label: "You listened to tension resolve into the chord", complete: heardPlayback(experiments) },
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
