import { chordFunction } from "../music/model";
import {
  barUsesAllChordTones,
  everyActiveBarWritten,
  harmonyActiveSteps,
  harmonyOffbeats,
  writtenHarmonyFitsChords,
} from "./harmonyApplication";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function edits(experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"]) {
  return experiments["harmony.note-edit"]?.changes ?? 0;
}

const lesson = lessonContentSchema.parse({
  id: "harmony.function",
  number: 16,
  title: "Harmonic function",
  eyebrow: "Harmony · Composition",
  hero: "Hear where the chords want to go."
  description:
    "Change the chords under the same groove and melody, then rewrite the notes that make those chords. Listen for home, departure, pull and return as movement through the phrase.",
  overview:
    "Chord function is about direction. Some harmonies let the phrase rest, some move away, and some make the next chord feel strongly expected. The useful part is hearing that pull while you write the notes.",
});

export const harmonicFunctionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.a",
        letter: "A",
        title: "Write home → departure → tension → return",
        learn: "Connect harmonic function to notes you actually perform.",
        explanation:
          "C–F–G–C gives you a clear route away from home and back again. The change matters because the notes under each bar change, and G leaves the ear wanting the return to C.",
        instruction:
          "Set C → F → G → C. Rewrite the harmony piano roll so every bar contains all chord tones and at least eight time positions contain harmony overall. Keep Play running while you replace notes that no longer belong.",
        recognition:
          "Stop after each bar in your head: which chord feels settled, which one feels like movement, and which one makes you expect what comes next?",
        terms: [
          { term: "Tonic", definition: "Harmony that feels like the tonal home or point of stability." },
          { term: "Predominant", definition: "Harmony that commonly moves away from tonic and prepares dominant." },
          { term: "Dominant", definition: "Harmony that creates a strong expectation of resolution toward tonic." },
          { term: "Function", definition: "The directional role a harmony plays within a key." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Write the function",
        successLabel: "The chord movement is now in the part you wrote",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        {
          label: "Progression is C → F → G → C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "F" &&
            chordProgression[2] === "G" &&
            chordProgression[3] === "C",
        },
        {
          label: "Every bar contains all of its chord tones",
          complete: [0, 1, 2, 3].every((bar) =>
            barUsesAllChordTones(harmonySequence, chordProgression, bar),
          ),
        },
        {
          label: "The part occupies at least eight time positions",
          complete: harmonyActiveSteps(harmonySequence) >= 8,
        },
        {
          label: "You actually rewrote the harmony in this exercise",
          complete: edits(experiments) >= 4,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.b",
        letter: "B",
        title: "Rewrite it as ii–V–I",
        learn: "Hear a different predominant while preserving dominant-to-tonic direction.",
        explanation:
          "Dm is ii in C major. Moving Dm→G→C creates predominant→dominant→tonic with different voice content from F→G→C.",
        instruction:
          "Change the first three bars to Dm → G → C and keep C in bar 4. Rewrite the notes in the changed bars until every written note belongs to its chord and bars 1–3 each contain all chord tones.",
        recognition:
          "Compare F→G→C with Dm→G→C. What changes in the first move, and what stays the same about the G→C arrival?",
        terms: [
          { term: "ii chord", definition: "The minor chord on scale degree 2; D minor in C major." },
          { term: "Cadential motion", definition: "Harmonic movement that creates and then resolves expectation near a phrase ending." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Reharmonize",
        successLabel: "You rebuilt the phrase as ii–V–I",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        {
          label: "The phrase begins Dm → G → C",
          complete:
            chordProgression[0] === "Dm" &&
            chordProgression[1] === "G" &&
            chordProgression[2] === "C",
        },
        {
          label: "The first three bars contain every chord tone",
          complete: [0, 1, 2].every((bar) =>
            barUsesAllChordTones(harmonySequence, chordProgression, bar),
          ),
        },
        {
          label: "No written note fights the chord above it",
          complete: writtenHarmonyFitsChords(harmonySequence, chordProgression),
        },
        {
          label: "You edited the MIDI rather than only the labels",
          complete: edits(experiments) >= 3,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.c",
        letter: "C",
        title: "Redirect the expected resolution",
        learn: "Make a deceptive resolution happen in the actual accompaniment.",
        explanation:
          "G normally points strongly toward C. Moving from G to Am redirects that expectation toward vi. Hearing the effect requires the notes under G to become the notes of Am, not merely changing a chord label.",
        instruction:
          "Create C → G → Am → F. Rewrite the harmony so every bar contains playable chord tones, use at least eight time positions, and place at least two harmony events on offbeat eighths.",
        recognition:
          "Compare G→C with G→Am. Which one closes the phrase, and which one sounds as if the music still has somewhere to go?",
        terms: [
          { term: "Deceptive resolution", definition: "A dominant harmony resolving somewhere other than the expected tonic, often to vi." },
          { term: "vi chord", definition: "The chord on scale degree 6; A minor in C major." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Redirect it",
        successLabel: "The deceptive move is part of your accompaniment",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        {
          label: "Progression is C → G → Am → F",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "G" &&
            chordProgression[2] === "Am" &&
            chordProgression[3] === "F",
        },
        {
          label: "Every active bar has written harmony that fits",
          complete:
            everyActiveBarWritten(harmonySequence, chordProgression) &&
            writtenHarmonyFitsChords(harmonySequence, chordProgression),
        },
        {
          label: "The accompaniment has rhythm, including offbeats",
          complete:
            harmonyActiveSteps(harmonySequence) >= 8 &&
            harmonyOffbeats(harmonySequence) >= 2,
        },
        {
          label: "You rewrote the changed harmony",
          complete: edits(experiments) >= 4,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.d",
        letter: "D",
        title: "Write the secondary dominant",
        learn: "Hear chromatic function by placing the altered note yourself.",
        explanation:
          "D7 contains F♯, a note outside C major. That F♯ pulls upward to G and temporarily makes G feel like a goal. G then resumes its dominant role and points back to C.",
        instruction:
          "Set D7 → G → C in bars 1–3 and choose C, Em, or Am in bar 4. In the piano roll, write every tone of D7—including F♯—then rewrite the remaining bars so every sounding note fits its chord.",
        recognition:
          "Replace F♯ with F for one pass, then restore it. Which version makes G feel more strongly prepared?",
        terms: [
          { term: "Secondary dominant", definition: "A dominant chord that temporarily points to a chord other than the main tonic." },
          { term: "Tonicization", definition: "Briefly making a non-tonic chord sound like a local point of arrival." },
          { term: "Chromatic note", definition: "A pitch outside the prevailing diatonic scale, used here for harmonic direction." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Write the chromatic pull",
        successLabel: "F♯ now creates the secondary dominant you can hear",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        {
          label: "D7 resolves to G and G resolves to C",
          complete:
            chordProgression[0] === "D7" &&
            chordProgression[1] === "G" &&
            chordProgression[2] === "C",
        },
        {
          label: "Bar 4 returns to tonic function",
          complete: Boolean(
            chordProgression[3] &&
              chordFunction[chordProgression[3]] === "tonic",
          ),
        },
        {
          label: "D7 contains all four written chord tones",
          complete: barUsesAllChordTones(harmonySequence, chordProgression, 0),
        },
        {
          label: "The whole written accompaniment fits its current chords",
          complete:
            everyActiveBarWritten(harmonySequence, chordProgression) &&
            writtenHarmonyFitsChords(harmonySequence, chordProgression),
        },
        {
          label: "You edited the harmony rather than only choosing D7",
          complete: edits(experiments) >= 4,
        },
      ],
    },
  ],
};
