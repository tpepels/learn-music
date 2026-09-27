import {
  barUsesAllHarmonicChordTones,
  harmonyActiveSteps,
  harmonyOffbeats,
  writtenHarmonyFitsHarmonicProgression,
} from "./harmonyApplication";
import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function edits(experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"]) {
  return experiments["harmony.note-edit"]?.changes ?? 0;
}

function triedChord(
  experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"],
  slot: number,
  chord: string,
): boolean {
  return experiments["harmony.chord." + slot]?.values.includes(chord) ?? false;
}

const lesson = lessonContentSchema.parse({
  id: "harmony.seventh-chords",
  number: 27,
  title: "Seventh chords",
  eyebrow: "Harmony · Colour",
  hero: "Add one note to the triad and hear the chord change colour.",
  description:
    "Keep your groove as rhythmic context, but leave the previous A-minor melody out while the harmony returns to C major. Compare triads with sevenths, then write ii7–V7–Imaj7 and a full turnaround.",
  overview:
    "A seventh chord is a triad with one more note. Add that note, remove it, and follow where it wants to move into the next chord. The colour is easier to understand as a note than as a longer chord symbol.",
});

export const seventhChordsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.a",
        letter: "A",
        title: "Turn C into Cmaj7",
        learn: "Hear exactly what a major seventh adds to a triad.",
        explanation:
          "A maj7 chord keeps the major triad and adds a note eleven semitones above the root. The harmonic function can remain tonic while the extra note adds colour and a close semitone relationship with the octave root.",
        instruction:
          "In bar 1, choose plain C and play it once. Then change the bar to Cmaj7, derive the added major seventh from the interval definition, and write the complete four-note chord yourself.",
        recognition:
          "Mute B, then add it back. Does Cmaj7 feel like the same home chord with more tension inside it, or like a completely different chord?",
        terms: [
          { term: "Major seventh", definition: "An interval eleven semitones above the root." },
          { term: "maj7", definition: "A major triad with a major seventh added above its root." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Add the seventh",
        successLabel: "You added and heard the B inside Cmaj7",
      }),
      evaluate: ({
        chordProgression,
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => [
        { label: "You listened to the seventh-chord change in context", complete: heardPlayback(experiments) },
        { label: "Bar 1 finishes on Cmaj7", complete: chordProgression[0] === "Cmaj7" },
        { label: "You compared plain C with Cmaj7 in this exercise", complete: triedChord(experiments, 0, "C") && triedChord(experiments, 0, "Cmaj7") },
        { label: "C, E, G and B are all written in bar 1", complete: barUsesAllHarmonicChordTones(harmonySequence, harmonicProgression, tonalContext, 0) },
        { label: "You edited the MIDI notes", complete: edits(experiments) >= 1 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.b",
        letter: "B",
        title: "Make V7 resolve",
        learn: "Write the guide tones that strengthen G7→Cmaj7.",
        explanation:
          "A dominant seventh contains two guide tones whose small contrary motions help make V7→I feel directed: the leading tone rises to tonic while the chordal seventh falls by step. Derive those voices from the two chord symbols.",
        instruction:
          "Put G7 in bar 2 and Cmaj7 in bar 3 and write all four notes of both chords from their symbols. Then identify the two guide tones and keep them in a register where you can follow their stepwise resolution by ear.",
        recognition:
          "Compare G→C with G7→Cmaj7. Which inner notes make the second move feel more directed?",
        terms: [
          { term: "Dominant seventh", definition: "A major triad with a minor seventh added above its root." },
          { term: "Guide tone", definition: "A chord tone whose small motion strongly communicates harmonic direction." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Write V7–I",
        successLabel: "The dominant seventh now resolves through notes you placed",
      }),
      evaluate: ({
        chordProgression,
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => [
        { label: "You listened to the seventh-chord change in context", complete: heardPlayback(experiments) },
        { label: "G7 resolves directly to Cmaj7", complete: chordProgression[1] === "G7" && chordProgression[2] === "Cmaj7" },
        { label: "Both seventh chords contain all four chord tones", complete: barUsesAllHarmonicChordTones(harmonySequence, harmonicProgression, tonalContext, 1) && barUsesAllHarmonicChordTones(harmonySequence, harmonicProgression, tonalContext, 2) },
        { label: "Written notes fit the current chords", complete: writtenHarmonyFitsHarmonicProgression(harmonySequence, harmonicProgression, tonalContext) },
        { label: "You rewrote the changed bars", complete: edits(experiments) >= 2 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.c",
        letter: "C",
        title: "Write ii7–V7–Imaj7",
        learn: "Build minor 7 as well as dominant 7 and maj7, then use all three in ii7–V7–Imaj7.",
        explanation:
          "A minor-seventh chord is a minor triad plus a minor seventh, ten semitones above the root. That gives Dm7 its D–F–A triad plus C. Now the three seventh-chord families used here are explicit: ii7 is minor 7, V7 is a dominant seventh, and Imaj7 is major 7. Their different chord qualities combine with the functional direction ii→V→I.",
        instruction:
          "Set bars 1–3 to Dm7 → G7 → Cmaj7 and keep Cmaj7 in bar 4. Derive each four-note chord from its triad quality and seventh, then rewrite the piano roll so bars 1–3 contain all four chord tones. Spread some notes across time instead of using only one vertical block.",
        recognition:
          "Listen only for the seventh in each chord. Does it sound like part of the harmony, and can you hear where it moves next?",
        terms: [
          { term: "Minor seventh chord", definition: "A minor triad with a minor seventh, ten semitones above the root, added to it." },
          { term: "ii7–V7–Imaj7", definition: "A common functional progression using minor-7, dominant-7 and major-7 chords on predominant, dominant and tonic." },
          { term: "Voice leading", definition: "The way individual chord tones move from one harmony to the next." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Write the progression",
        successLabel: "You wrote ii7–V7–Imaj7 as a four-note chord part",
      }),
      evaluate: ({
        chordProgression,
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => [
        { label: "You listened to the seventh-chord change in context", complete: heardPlayback(experiments) },
        { label: "Progression begins Dm7 → G7 → Cmaj7", complete: chordProgression[0] === "Dm7" && chordProgression[1] === "G7" && chordProgression[2] === "Cmaj7" },
        { label: "The first three bars contain all four chord tones", complete: [0, 1, 2].every((bar) => barUsesAllHarmonicChordTones(harmonySequence, harmonicProgression, tonalContext, bar)) },
        { label: "The written notes fit their chords", complete: writtenHarmonyFitsHarmonicProgression(harmonySequence, harmonicProgression, tonalContext) },
        { label: "You rewrote the harmony", complete: edits(experiments) >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.d",
        letter: "D",
        title: "Compose the turnaround",
        learn: "Make I–vi–ii–V function as a repeating accompaniment rather than four blocks.",
        explanation:
          "A turnaround gains meaning from both harmony and performance. The final G7 remains unresolved inside the bar sequence because the next loop supplies Cmaj7.",
        instruction:
          "Set Cmaj7 → Am7 → Dm7 → G7. Write all four chord tones in every bar, use at least ten time positions overall, and put at least two events on offbeat eighths. Loop it and shape a rhythm that makes the return to bar 1 feel intentional.",
        recognition:
          "Let the loop stop mentally on G7. Does it feel finished? Then hear the next Cmaj7 and notice what the loop was waiting for.",
        terms: [
          { term: "Turnaround", definition: "Harmony near the end of a phrase that leads back toward its beginning." },
          { term: "Loop resolution", definition: "A resolution completed by the beginning of the next loop rather than before the current one ends." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Compose the loop",
        successLabel: "The turnaround is a performed four-bar part",
      }),
      evaluate: ({
        chordProgression,
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => [
        { label: "You listened to the seventh-chord change in context", complete: heardPlayback(experiments) },
        { label: "Progression is Cmaj7 → Am7 → Dm7 → G7", complete: chordProgression.join("|") === "Cmaj7|Am7|Dm7|G7" },
        { label: "Every bar contains all four chord tones", complete: [0, 1, 2, 3].every((bar) => barUsesAllHarmonicChordTones(harmonySequence, harmonicProgression, tonalContext, bar)) },
        { label: "The accompaniment uses at least ten time positions", complete: harmonyActiveSteps(harmonySequence) >= 10 },
        { label: "At least two harmony events are offbeat", complete: harmonyOffbeats(harmonySequence) >= 2 },
        { label: "You edited the accompaniment in this exercise", complete: edits(experiments) >= 4 },
      ],
    },
  ],
};
