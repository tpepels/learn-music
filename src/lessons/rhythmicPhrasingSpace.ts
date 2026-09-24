import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function onsets(melody: Array<number | null>) {
  return melody
    .map((note, step) => ({ note, step }))
    .filter((item): item is { note: number; step: number } => item.note !== null);
}

const lesson = lessonContentSchema.parse({
  id: "rhythm.phrasing-space",
  number: 31,
  title: "Rhythmic phrasing & space",
  eyebrow: "Rhythm · Melody",
  hero: "Make the silence and placement part of the phrase.",
  description:
    "Move beyond filling the grid: use rests, anticipation, delayed entry and note duration to shape where a melodic phrase breathes and where it pushes against the beat.",
  overview:
    "Rhythmic character is not only a drum pattern. A melody can arrive early, enter late, hold through empty space or leave room entirely. Those choices change phrasing even when the pitches stay simple.",
});

export const rhythmicPhrasingSpaceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.phrasing-space.a",
        letter: "A",
        title: "Write with rests",
        learn: "Treat empty grid cells as intentional musical material.",
        explanation:
          "A phrase with fewer attacks can be easier to hear, remember and answer. Rests separate ideas and let the rhythm section remain audible.",
        instruction:
          "Write a melody with five to nine onsets across the 16 eighth-note steps. Leave at least seven steps empty. Play several loops before deciding whether any extra note is necessary.",
        recognition:
          "Which empty step makes the phrase easier to understand? Add a note there, listen, then remove it again.",
        terms: [
          { term: "Rest", definition: "An intentional span of musical silence." },
          { term: "Onset", definition: "The moment a note begins." },
          { term: "Phrasing", definition: "The shaping of musical events into perceptible gestures." },
        ],
        workspace: "melody",
        checksLabel: "Leave space",
        successLabel: "Your melody now uses silence as part of its rhythm",
      }),
      evaluate: ({ melody, experiments }) => {
        const count = onsets(melody).length;
        return [
          { label: "The phrase uses five to nine onsets", complete: count >= 5 && count <= 9 },
          { label: "At least seven eighth-note steps remain empty", complete: melody.filter((note) => note === null).length >= 7 },
          { label: "You listened to the spaces", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.phrasing-space.b",
        letter: "B",
        title: "Anticipate the second bar",
        learn: "Create forward motion by arriving just before a structural beat.",
        explanation:
          "An anticipation places an important event before the beat where the listener expects it. On this eighth-note grid, step 8 can push into the second bar before its downbeat on step 9.",
        instruction:
          "Put a melody note on step 8 and leave step 9 empty. Keep at least four other notes elsewhere in the phrase. Play the loop and compare that early arrival with placing the same pitch on step 9.",
        recognition:
          "Does step 8 feel like it leans into the bar line? Notice how leaving step 9 empty makes the anticipation easier to hear.",
        terms: [
          { term: "Anticipation", definition: "A note that arrives before the beat or harmony where it is expected." },
          { term: "Downbeat", definition: "The strongest beat at the beginning of a bar." },
          { term: "Syncopation", definition: "Rhythmic emphasis that shifts attention away from the most expected beats." },
        ],
        workspace: "melody",
        checksLabel: "Arrive early",
        successLabel: "Your melody now pushes across the bar line",
      }),
      evaluate: ({ melody, experiments }) => [
        { label: "Step 8 contains an anticipation", complete: melody[7] !== null },
        { label: "The second-bar downbeat is left empty", complete: melody[8] === null },
        { label: "The phrase contains at least five onsets overall", complete: onsets(melody).length >= 5 },
        { label: "You listened across the bar line", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.phrasing-space.c",
        letter: "C",
        title: "Enter late",
        learn: "Make delayed entry create shape instead of always starting on beat one.",
        explanation:
          "Not every phrase has to announce itself on the downbeat. A delayed entrance creates pickup space and can make the rhythm section establish the pulse before the melody answers.",
        instruction:
          "Leave step 1 empty and make the first melody onset land on step 2, 3 or 4. In the second half, leave step 9 empty and make the first onset after the midpoint land on step 10, 11 or 12.",
        recognition:
          "Does the groove feel more exposed before the melody enters? Compare the delayed version with a note on each downbeat.",
        terms: [
          { term: "Delayed entry", definition: "Beginning a phrase after the expected structural starting point." },
          { term: "Pickup space", definition: "Time left open before a phrase begins." },
          { term: "Response", definition: "A musical gesture that follows and relates to an earlier event." },
        ],
        workspace: "melody",
        checksLabel: "Enter after the beat",
        successLabel: "Your phrase now uses delayed arrival as a rhythmic choice",
      }),
      evaluate: ({ melody, experiments }) => {
        const events = onsets(melody);
        const first = events[0]?.step ?? -1;
        const secondHalf = events.find((item) => item.step >= 8)?.step ?? -1;
        return [
          { label: "The phrase begins after step 1", complete: first >= 1 && first <= 3 },
          { label: "The second half also enters late", complete: secondHalf >= 9 && secondHalf <= 11 },
          { label: "Both structural downbeats are empty", complete: melody[0] === null && melody[8] === null },
          { label: "You listened to the delayed entries", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.phrasing-space.d",
        letter: "D",
        title: "Shape time with duration",
        learn: "Combine onset rhythm with held notes so the phrase does not behave like sixteen equal cells.",
        explanation:
          "The onset says when a note begins; duration says how long it occupies the phrase. Long notes can bridge empty cells while short notes create articulation and momentum.",
        instruction:
          "Write five to ten onsets. Give at least one note a duration of three eighth-note cells or more, keep at least one note short at one cell, include at least one offbeat onset, and leave at least four cells without a new note.",
        recognition:
          "Listen to the longest note. Does it connect two rhythmic areas, or does it prevent the phrase from breathing?",
        terms: [
          { term: "Duration", definition: "How long a note continues after its onset." },
          { term: "Sustain", definition: "The continuation of a note through later time positions." },
          { term: "Articulation", definition: "How distinctly or smoothly successive notes are shaped." },
        ],
        workspace: "melody",
        checksLabel: "Shape the durations",
        successLabel: "Your phrase now combines attack, sustain and silence",
      }),
      evaluate: ({ melody, melodyDurations, experiments }) => {
        const events = onsets(melody);
        const activeDurations = events.map(({ step }) => melodyDurations[step] ?? 1);
        return [
          { label: "The phrase uses five to ten onsets", complete: events.length >= 5 && events.length <= 10 },
          { label: "At least one note lasts three eighths or more", complete: activeDurations.some((duration) => duration >= 3) },
          { label: "At least one note remains short", complete: activeDurations.some((duration) => duration === 1) },
          { label: "At least one onset lands off the main quarter-note pulse", complete: events.some(({ step }) => step % 2 === 1) },
          { label: "At least four cells contain no new onset", complete: melody.filter((note) => note === null).length >= 4 },
          { label: "You listened to attack, sustain and space", complete: heardPlayback(experiments) },
        ];
      },
    },
  ],
};
