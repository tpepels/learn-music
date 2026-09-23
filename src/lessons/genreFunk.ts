import { chordMidi } from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function soundingBass(sequence: Array<number | null>) {
  return sequence
    .map((midi, step) => ({ midi, step }))
    .filter((event): event is { midi: number; step: number } => event.midi !== null);
}

function harmonyActiveSteps(sequence: number[][]) {
  return sequence.filter((notes) => notes.length > 0).length;
}

function harmonyOffbeats(sequence: number[][]) {
  return sequence.filter((notes, step) => notes.length > 0 && step % 2 === 1).length;
}

function harmonyFits(
  sequence: number[][],
  progression: Array<keyof typeof chordMidi | null>,
) {
  return sequence.every((notes, step) => {
    if (notes.length === 0) return true;
    const chord = progression[Math.floor(step / 8)];
    if (!chord) return false;
    const allowed = new Set(chordMidi[chord]);
    return notes.every((note) => allowed.has(note));
  });
}

const lesson = lessonContentSchema.parse({
  id: "genre.funk",
  number: 31,
  title: "Funk: interlocking rhythm",
  eyebrow: "Genre lens · Funk",
  hero: "Make several simple parts behave like one rhythmic machine.",
  description:
    "Explore funk through sixteenth-note motion, ghost notes, syncopated bass, short harmony attacks, and parts that take turns leaving space for one another.",
  overview:
    "Funk is broader than any single pattern or era. These exercises focus on interlocking rhythm: each part can be simple on its own while the combined timing creates complexity. Precision and space matter as much as note count.",
});

export const genreFunkLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "genre.funk.a",
        letter: "A",
        title: "Turn the hat into a sixteenth-note engine",
        learn: "Use dense subdivisions and velocity hierarchy instead of relying on swing for movement.",
        explanation:
          "Sixteenth-note timekeeping can create continuous motion while accents keep the pattern from becoming a typewriter. Quiet snare ghosts add another layer underneath the main backbeat.",
        instruction:
          "Set the tempo between 88 and 125 BPM. Keep swing at 12% or less. Use at least 12 hi-hat hits across the 16-step bar and give the active hats at least a 25% velocity range. Keep snares on steps 5 and 13 and add at least one quieter ghost snare elsewhere.",
        recognition:
          "Listen to the hats as a phrase, not a metronome. Which accents make the subdivision feel grouped rather than flat?",
        terms: [
          { term: "Sixteenth-note subdivision", definition: "Dividing each quarter-note beat into four equal parts." },
          { term: "Ghost note", definition: "A quiet supporting note that adds motion without becoming a main accent." },
          { term: "Interlocking rhythm", definition: "Several parts fitting together so their combined placements form the groove." },
        ],
        workspace: "groove-feel",
        checksLabel: "Create sixteenth-note motion",
        successLabel: "The grid now moves through accents and ghosting rather than equal hits",
      }),
      evaluate: ({ bpm, A, grooveFeelSettings }) => {
        const hats = A.hat
          .map((active, step) =>
            active ? grooveFeelSettings.velocities.hat[step] : null,
          )
          .filter((value): value is number => value !== null);
        const ghostSnareSteps = A.snare
          .map((active, step) => ({ active, step }))
          .filter(({ active, step }) => active && step !== 4 && step !== 12);

        return [
          {
            label: "Tempo is between 88 and 125 BPM",
            complete: bpm >= 88 && bpm <= 125,
          },
          {
            label: "At least 12 sixteenth-note hats are active",
            complete: hats.length >= 12,
          },
          {
            label: "Hat velocities span at least 25%",
            complete:
              hats.length > 1 &&
              Math.max(...hats) - Math.min(...hats) >= 0.25,
          },
          {
            label: "Backbeat remains on steps 5 and 13",
            complete: A.snare[4] && A.snare[12],
          },
          {
            label: "At least one ghost snare is quieter than the backbeat",
            complete: ghostSnareSteps.some(
              ({ step }) =>
                grooveFeelSettings.velocities.snare[step] <
                Math.min(
                  grooveFeelSettings.velocities.snare[4],
                  grooveFeelSettings.velocities.snare[12],
                ),
            ),
          },
          {
            label: "Swing stays subtle",
            complete: grooveFeelSettings.swing <= 0.12,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.funk.b",
        letter: "B",
        title: "Make the bass carry its own rhythm",
        learn: "Build a busy bass phrase that does not simply trace the kick.",
        explanation:
          "In an interlocking groove, bass is a rhythmic instrument as much as a harmonic one. Offbeat attacks and changing pitches let it answer the drums while still defining the harmony underneath.",
        instruction:
          "Write 10–18 bass attacks over the four bars. Put at least five on eighth-note offbeats, use at least three pitches, and give every bar at least two bass attacks. Listen for a line you could tap independently from the kick.",
        recognition:
          "Can you tap the bass rhythm while ignoring the kick? If not, which notes are merely doubling rather than contributing a second pattern?",
        terms: [
          { term: "Rhythmic independence", definition: "A part having a recognisable rhythm of its own while still fitting the ensemble." },
          { term: "Syncopation", definition: "Emphasis on weaker beats or subdivisions." },
        ],
        workspace: "bass",
        checksLabel: "Give bass an independent pattern",
        successLabel: "The bass now contributes its own syncopated layer",
      }),
      evaluate: ({ bassSequence }) => {
        const notes = soundingBass(bassSequence);
        const perBar = [0, 1, 2, 3].map(
          (bar) =>
            notes.filter(
              ({ step }) => step >= bar * 8 && step < bar * 8 + 8,
            ).length,
        );
        return [
          {
            label: "Bass uses 10–18 attacks",
            complete: notes.length >= 10 && notes.length <= 18,
          },
          {
            label: "At least five attacks are on eighth-note offbeats",
            complete: notes.filter(({ step }) => step % 2 === 1).length >= 5,
          },
          {
            label: "At least three pitches appear",
            complete: new Set(notes.map(({ midi }) => midi)).size >= 3,
          },
          {
            label: "Every bar contains at least two bass attacks",
            complete: perBar.every((count) => count >= 2),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.funk.c",
        letter: "C",
        title: "Turn held harmony into rhythmic stabs",
        learn: "Change the role of the chords by shortening and syncopating them without needing a new progression.",
        explanation:
          "The same harmony can behave like a pad or like percussion. Short attacks placed between beats make the chord part participate in the groove instead of floating above it.",
        instruction:
          "Keep the current four-chord progression. Rewrite the harmony as short stabs: use at least 12 active time positions, put at least six of them on eighth-note offbeats, give every bar at least two attacks, and keep most written note lengths to a quarter note or shorter.",
        recognition:
          "Compare one long chord with several short attacks on the same harmony. Which version makes the chord part feel more like part of the rhythm section?",
        terms: [
          { term: "Chord stab", definition: "A short, clearly attacked chord used rhythmically." },
          { term: "Comping", definition: "Rhythmic chordal accompaniment that supports and interacts with the groove." },
        ],
        workspace: "harmony-song",
        checksLabel: "Make harmony rhythmic",
        successLabel: "The chord part now behaves as a rhythmic layer",
      }),
      evaluate: ({
        chordProgression,
        harmonySequence,
        harmonyDurations,
      }) => {
        const perBar = [0, 1, 2, 3].map(
          (bar) =>
            harmonySequence
              .slice(bar * 8, bar * 8 + 8)
              .filter((notes) => notes.length > 0).length,
        );
        const writtenDurations = harmonySequence.flatMap((notes, step) =>
          notes.map((midi) => harmonyDurations[step]?.[midi] ?? 1),
        );
        const shortCount = writtenDurations.filter(
          (duration) => duration <= 2,
        ).length;

        return [
          {
            label: "All four chord slots are filled",
            complete: chordProgression.every(Boolean),
          },
          {
            label: "At least 12 harmony positions are active",
            complete: harmonyActiveSteps(harmonySequence) >= 12,
          },
          {
            label: "At least six attacks are on eighth-note offbeats",
            complete: harmonyOffbeats(harmonySequence) >= 6,
          },
          {
            label: "Every bar contributes at least two attacks",
            complete: perBar.every((count) => count >= 2),
          },
          {
            label: "At least eight written notes are quarter-note length or shorter",
            complete: shortCount >= 8,
          },
          {
            label: "Written notes still fit the chords above them",
            complete: harmonyFits(harmonySequence, chordProgression),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.funk.d",
        letter: "D",
        title: "Make parts take turns",
        learn: "Use arrangement gaps so bass and chords can answer one another instead of competing constantly.",
        explanation:
          "Interlock is easier to hear when every layer does not speak at once. Removing one part for a bar can reveal the rhythmic job another part was already doing.",
        instruction:
          "In Arrangement, create one bar with drums + bass but no chords, another with drums + chords but no bass, and another with drums + bass + chords together. Melody is optional. Listen to how the groove changes when each harmonic part gets a turn.",
        recognition:
          "Which bar feels busiest even if it does not contain the most layers? That is the difference between density and rhythmic interaction.",
        terms: [
          { term: "Call and response", definition: "One musical gesture being answered by another." },
          { term: "Density", definition: "How much musical activity or how many layers are present at a moment." },
        ],
        workspace: "arrangement",
        checksLabel: "Let the parts answer each other",
        successLabel: "Bass and chords now get separate as well as shared space",
      }),
      evaluate: ({ arrangement }) => [
        {
          label: "A bar features drums + bass without chords",
          complete: arrangement.some(
            (bar) => bar.drums && bar.bass && !bar.chords,
          ),
        },
        {
          label: "A different bar features drums + chords without bass",
          complete: arrangement.some(
            (bar) => bar.drums && !bar.bass && bar.chords,
          ),
        },
        {
          label: "Another bar combines drums + bass + chords",
          complete: arrangement.some(
            (bar) => bar.drums && bar.bass && bar.chords,
          ),
        },
      ],
    },
  ],
};
