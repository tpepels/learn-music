import {
  barUsesAllChordTones,
  everyActiveBarWritten,
  harmonyActiveSteps,
  harmonyOffbeats,
  writtenHarmonyFitsChords,
} from "./harmonyApplication";
import { changedControl, heardPlayback } from "./learningEvidence";
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
  id: "harmony.minor-cadences",
  number: 26,
  title: "Minor-key progressions",
  eyebrow: "Harmony · A minor",
  hero: "Write the notes that make A minor leave home and come back.",
  description:
    "Use i, iv and the major V7 inside a real four-bar accompaniment. You will place G♯ yourself, hear E7 resolve, and compare tonic versus deceptive endings.",
  overview:
    "Your groove and minor melody remain in the loop while you add the harmony beneath them. A minor can use the white-key chords of natural minor and still bring in G♯ when E7 needs a stronger pull home.",
});

export const minorCadencesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.a",
        letter: "A",
        title: "Write i → iv",
        learn: "Make tonic-to-predominant motion in A minor with your own notes.",
        explanation:
          "Am is i and Dm is iv. The move changes the chord tones while staying completely inside A natural minor.",
        instruction:
          "Set Am → Dm → Am → Am. Write all three notes of Am in bar 1 and all three notes of Dm in bar 2. Put the notes where you want them rhythmically and keep the loop playing.",
        recognition:
          "Loop Am→Dm. Which chord lets the phrase rest, and which one feels like the start of a journey away?",
        terms: [
          { term: "i", definition: "The minor tonic chord; A minor in the key of A minor." },
          { term: "iv", definition: "The minor predominant chord; D minor in A minor." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Write i–iv",
        successLabel: "The minor departure is in the MIDI you wrote",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "You listened to both endings before settling", complete: heardPlayback(experiments) },
        { label: "You listened to the descending accompaniment", complete: heardPlayback(experiments) },
        { label: "You listened to the altered dominant resolve", complete: heardPlayback(experiments) },
        { label: "You listened to the minor progression in context", complete: heardPlayback(experiments) },
        { label: "Bars 1–2 are Am → Dm", complete: chordProgression[0] === "Am" && chordProgression[1] === "Dm" },
        { label: "Am and Dm contain all their written chord tones", complete: barUsesAllChordTones(harmonySequence, chordProgression, 0) && barUsesAllChordTones(harmonySequence, chordProgression, 1) },
        { label: "You edited the harmony notes", complete: edits(experiments) >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.b",
        letter: "B",
        title: "Build i–iv–V7–i",
        learn: "Create the strong minor dominant by writing G♯ into E7.",
        explanation:
          "E7 is not diatonic to A natural minor because it contains G♯. That altered note is the leading tone: it creates a much stronger pull back to A.",
        instruction:
          "Set Am → Dm → E7 → Am. Rewrite every bar. In bar 3, make sure E, G♯, B and D all appear somewhere. Leave a G♯ close to the final Am so you can hear the leading-tone pull.",
        recognition:
          "Replace G♯ with G for one pass, then put G♯ back. Which version makes the return to Am pull harder?",
        terms: [
          { term: "V7", definition: "A dominant seventh chord built on scale degree 5; E7 in A minor." },
          { term: "Leading tone", definition: "A note one semitone below tonic that strongly tends to resolve upward; G♯ in A minor." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Write the cadence",
        successLabel: "Your E7 now contains the leading tone you can hear",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Progression is Am → Dm → E7 → Am", complete: chordProgression.join("|") === "Am|Dm|E7|Am" },
        { label: "Every bar contains every chord tone", complete: [0, 1, 2, 3].every((bar) => barUsesAllChordTones(harmonySequence, chordProgression, bar)) },
        { label: "All written notes fit their current chord", complete: writtenHarmonyFitsChords(harmonySequence, chordProgression) },
        { label: "You rewrote the MIDI for the cadence", complete: edits(experiments) >= 4 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.c",
        letter: "C",
        title: "Make the Andalusian descent",
        learn: "Turn Am–G–F–E7 into an actual descending accompaniment.",
        explanation:
          "The Andalusian cadence traces a descending harmonic path in minor. The final E7 contains G♯ and points back toward Am when the loop restarts.",
        instruction:
          "Set Am → G → F → E7. Rewrite the notes so every bar fits, use at least eight active time positions, and put at least two harmony events on offbeat eighths. Listen to the descending roots while your own rhythm continues through them.",
        recognition:
          "Follow the roots A–G–F–E while ignoring the chord labels. Does the accompaniment still feel like one line moving downward?",
        terms: [
          { term: "Andalusian cadence", definition: "A common descending minor-key progression, often i–VII–VI–V." },
          { term: "Descending bass", definition: "A bass or root line that moves downward across successive harmonies." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Make it descend",
        successLabel: "The Andalusian cadence is now a played accompaniment",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Progression is Am → G → F → E7", complete: chordProgression.join("|") === "Am|G|F|E7" },
        { label: "Every bar contains written chord tones", complete: everyActiveBarWritten(harmonySequence, chordProgression) && writtenHarmonyFitsChords(harmonySequence, chordProgression) },
        { label: "The accompaniment uses at least eight positions and two offbeats", complete: harmonyActiveSteps(harmonySequence) >= 8 && harmonyOffbeats(harmonySequence) >= 2 },
        { label: "You rewrote the accompaniment", complete: edits(experiments) >= 4 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.d",
        letter: "D",
        title: "Compare tonic and deceptive endings",
        learn: "Hear the same E7 expectation resolve two different ways.",
        explanation:
          "E7→Am closes strongly. E7→F keeps the phrase open by redirecting the dominant into VI. Comparing the two endings on the same material makes the difference much clearer.",
        instruction:
          "Build Am → Dm → E7 → Am first and play it. Then change only bar 4 to F, rewrite bar 4 with F/A/C, and leave the final version as Am → Dm → E7 → F.",
        recognition:
          "Play the Am ending and the F ending back to back. Which one closes the door, and which one leaves the phrase open?",
        terms: [
          { term: "Deceptive resolution", definition: "A dominant harmony resolving somewhere other than tonic, preserving motion instead of closing." },
          { term: "VI", definition: "The major chord on scale degree 6 in A minor; F major." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Compare the endings",
        successLabel: "You heard and wrote both minor resolutions",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Final progression is Am → Dm → E7 → F", complete: chordProgression.join("|") === "Am|Dm|E7|F" },
        { label: "You tried Am and F in the final bar during this exercise", complete: triedChord(experiments, 3, "Am") && triedChord(experiments, 3, "F") },
        { label: "The final F chord is written with all its chord tones", complete: barUsesAllChordTones(harmonySequence, chordProgression, 3) },
        { label: "The finished accompaniment fits all four chords", complete: writtenHarmonyFitsChords(harmonySequence, chordProgression) },
      ],
    },
  ],
};
