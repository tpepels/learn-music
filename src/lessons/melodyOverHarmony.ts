import {
  isChordTone,
  isCMajorMidi,
  type ChordProgression,
  type MelodySequence,
} from "../music/model";
import {
  MELODY_HARMONY_BAR_COUNT,
  MELODY_HARMONY_BAR_EIGHTHS,
  MELODY_HARMONY_PLAYBACK_EIGHTHS,
  melodyHarmonyFrame,
} from "../music/melodyHarmonyTimeline";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function sourceStartForBar(bar: number): number {
  return (bar % 2) * MELODY_HARMONY_BAR_EIGHTHS;
}

function barHasChordTone(
  melody: MelodySequence,
  progression: ChordProgression,
  bar: number,
): boolean {
  const chord = progression[bar];
  if (!chord) return false;

  const start = sourceStartForBar(bar);
  return melody
    .slice(start, start + MELODY_HARMONY_BAR_EIGHTHS)
    .some((note) => note !== null && isChordTone(note, chord));
}

function countPassingToneMoments(
  melody: MelodySequence,
  progression: ChordProgression,
): number {
  let passing = 0;

  for (let bar = 0; bar < MELODY_HARMONY_BAR_COUNT; bar += 1) {
    const chord = progression[bar];
    if (!chord) continue;
    const start = sourceStartForBar(bar);

    for (let local = 1; local < MELODY_HARMONY_BAR_EIGHTHS - 1; local += 1) {
      const prev = melody[start + local - 1];
      const note = melody[start + local];
      const next = melody[start + local + 1];

      if (prev === null || note === null || next === null) continue;

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
  }

  return passing;
}

function hasNeighbourMoment(
  melody: MelodySequence,
  progression: ChordProgression,
): boolean {
  for (let bar = 0; bar < MELODY_HARMONY_BAR_COUNT; bar += 1) {
    const chord = progression[bar];
    if (!chord) continue;
    const start = sourceStartForBar(bar);

    for (let local = 0; local < MELODY_HARMONY_BAR_EIGHTHS - 2; local += 1) {
      const a = melody[start + local];
      const b = melody[start + local + 1];
      const c = melody[start + local + 2];

      if (
        a !== null &&
        b !== null &&
        c !== null &&
        a === c &&
        Math.abs(b - a) <= 2 &&
        Math.abs(b - a) > 0 &&
        isChordTone(a, chord)
      ) {
        return true;
      }
    }
  }

  return false;
}

function countResolutionMoments(
  melody: MelodySequence,
  progression: ChordProgression,
): number {
  let resolutions = 0;

  for (let bar = 0; bar < MELODY_HARMONY_BAR_COUNT; bar += 1) {
    const chord = progression[bar];
    if (!chord) continue;
    const start = sourceStartForBar(bar);

    for (let local = 0; local < MELODY_HARMONY_BAR_EIGHTHS - 1; local += 1) {
      const note = melody[start + local];
      const next = melody[start + local + 1];

      if (
        note !== null &&
        next !== null &&
        !isChordTone(note, chord) &&
        isChordTone(next, chord) &&
        Math.abs(next - note) <= 2
      ) {
        resolutions += 1;
      }
    }
  }

  return resolutions;
}

function finalPlaybackNote(
  melody: MelodySequence,
  progression: ChordProgression,
): { note: number; chord: NonNullable<ChordProgression[number]> } | null {
  if (melody.length === 0) return null;

  for (
    let playbackStep = MELODY_HARMONY_PLAYBACK_EIGHTHS - 1;
    playbackStep >= 0;
    playbackStep -= 1
  ) {
    const frame = melodyHarmonyFrame(playbackStep, melody.length);
    const note = melody[frame.melodyStep];
    const chord = progression[frame.barIndex];

    if (note !== null && chord) {
      return { note, chord };
    }
  }

  return null;
}

const lesson = lessonContentSchema.parse({
  id: "composition.melody-over-harmony",
  number: 15,
  title: "Melody over harmony",
  eyebrow: "Composition · Melody",
  hero: "Make a note rub against the chord, then give it somewhere to go.",
  description:
    "Put the two-bar melody you have been developing back over the four-bar chord progression. The melody repeats once, so the same notes can behave differently when bars 3–4 place new harmony underneath them.",
  overview:
    "The chord underneath changes what a melody note means. Your 16 eighth-note melody occupies bars 1–2 and then repeats unchanged through bars 3–4. Compare both harmonic passes: a note can feel settled the first time and exposed the second.",
});

export const melodyOverHarmonyLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.a",
        letter: "A",
        title: "Land inside each harmony",
        learn: "Anchor each bar with at least one melody note that belongs to the chord beneath it.",
        explanation:
          "Chord tones are the notes already inside the current harmony. Because your two-bar melody repeats over a four-bar progression, the same eight-note half is heard under two different chords. You are listening for whether each bar contains at least one point where melody and harmony clearly agree.",
        instruction:
          "Press Play and use the Bars 1–2 / Bars 3–4 views. Fill all four chord slots, then make sure every bar contains at least one sounding melody note that belongs to that bar’s chord.",
        recognition:
          "Compare the first and repeated passes. Which melody notes remain stable when the harmony changes underneath them, and which ones change character?",
        terms: [
          { term: "Chord tone", definition: "A melody note that is part of the chord sounding underneath it." },
          { term: "Non-chord tone", definition: "A melody note that is not contained in the current chord." },
          { term: "Harmonic context", definition: "The chord or harmony sounding underneath a note at a particular moment." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Anchor all four bars",
        successLabel: "Every harmony bar now contains a stable melody point",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => [
        { label: "You placed or revised melody notes for the harmony", complete: changedControl(experiments, "melody.edit", 4) },
        { label: "You listened across the complete four-bar harmony", complete: heardPlayback(experiments) },
        {
          label: "All four chord slots are filled",
          complete: chordProgression.every(Boolean),
        },
        ...[0, 1, 2, 3].map((bar) => ({
          label: "Bar " + (bar + 1) + " contains a melody chord tone",
          complete: barHasChordTone(melody, chordProgression, bar),
        })),
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.b",
        letter: "B",
        title: "Use passing tones",
        learn: "Connect stable notes with stepwise non-chord tones rather than jumping between chord tones only.",
        explanation:
          "A passing tone connects two more stable notes by step. It can be harmonically unstable for a moment while still sounding convincing because the melodic line makes its direction clear. With a repeating melody, the same three-note figure may act differently in the second harmonic pass.",
        instruction:
          "Create at least two in-key passing-tone moments somewhere in the four-bar playback. Keep each figure inside one bar: a non-chord note between two nearby notes moving in the same direction.",
        recognition:
          "Switch between the two harmonic passes. Does the middle note sound like a destination, or like a bridge between the notes on either side?",
        terms: [
          { term: "Passing tone", definition: "A non-chord note that connects two more stable notes by stepwise motion." },
          { term: "Stepwise motion", definition: "Melodic movement by a semitone or whole tone." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Connect the anchors",
        successLabel: "Passing notes now create smooth motion through the harmony",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => [
        { label: "You revised the line to create passing motion", complete: changedControl(experiments, "melody.edit", 2) },
        { label: "You listened to the passing tones in context", complete: heardPlayback(experiments) },
        {
          label: "At least two in-key passing-tone moments occur in the four-bar playback",
          complete: countPassingToneMoments(melody, chordProgression) >= 2,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.c",
        letter: "C",
        title: "Leave and return with a neighbour note",
        learn: "Create a tiny tension by stepping away from a stable pitch and returning to it.",
        explanation:
          "A neighbour note decorates a stable note by moving one step away and then returning. The listener hears the outside note as temporary because the surrounding pitch remains the reference point. Its effect still depends on the chord sounding in that bar.",
        instruction:
          "Create at least one three-note neighbour figure inside a single bar context: stable chord tone → one step away → the same stable note. Check both harmonic passes.",
        recognition:
          "Does the middle note feel like a detour while the repeated outer note still feels like the point of rest?",
        terms: [
          { term: "Neighbour note", definition: "A decorative note approached by step and followed by a return to the original note." },
          { term: "Decoration", definition: "A note whose role is to embellish a more structurally important pitch." },
        ],
        workspace: "melody-harmony",
        checksLabel: "Decorate one stable pitch",
        successLabel: "The melody now uses a clear neighbour-note gesture",
      }),
      evaluate: ({ melody, chordProgression, experiments }) => [
        { label: "You revised the melody to make the neighbour gesture", complete: changedControl(experiments, "melody.edit", 2) },
        { label: "You listened to the detour and return", complete: heardPlayback(experiments) },
        {
          label: "A stable–neighbour–stable figure exists in at least one bar",
          complete: hasNeighbourMoment(melody, chordProgression),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.melody-over-harmony.d",
        letter: "D",
        title: "Create and resolve tension",
        learn: "Use non-chord notes deliberately because of where they go next.",
        explanation:
          "Tension is the temporary instability created when a melodic note does not fully agree with the harmony underneath it. Resolution gives that instability direction by moving to a more stable chord tone, often by step. Repeating the melody over new harmony makes that relationship especially easy to hear.",
        instruction:
          "Create at least two places where a non-chord note resolves on the very next eighth-note step to a chord tone within the same bar. End the four-bar playback on a note that belongs to the harmony sounding there.",
        recognition:
          "Pause mentally on the non-chord note, then hear the next step. Does the second note answer the tension the first one created in that bar?",
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
        const final = finalPlaybackNote(melody, chordProgression);

        return [
          { label: "You revised the line to create directed tension", complete: changedControl(experiments, "melody.edit", 2) },
          { label: "You listened to tension resolve into the chord", complete: heardPlayback(experiments) },
          {
            label: "At least two tensions resolve by step inside their bars",
            complete: countResolutionMoments(melody, chordProgression) >= 2,
          },
          {
            label: "The final sounding melody note belongs to its actual final-bar chord",
            complete: Boolean(final && isChordTone(final.note, final.chord)),
          },
        ];
      },
    },
  ],
};
