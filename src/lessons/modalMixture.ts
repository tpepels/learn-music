import {
  barUsesAllChordTones,
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

function triedChord(
  experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"],
  slot: number,
  chord: string,
): boolean {
  return experiments["harmony.chord." + slot]?.values.includes(chord) ?? false;
}

const lesson = lessonContentSchema.parse({
  id: "harmony.modal-mixture",
  number: 28,
  title: "Borrowed chords & modal mixture",
  eyebrow: "Harmony · Chromatic colour",
  hero: "Change one note outside the key and hear how much colour it adds.",
  description:
    "Stay with the groove while focusing on C-major harmony again. Bring Fm and B♭ into that harmony by writing the chromatic notes yourself, without the earlier A-minor melody masking the colour.",
  overview:
    "C can remain home while one chord borrows notes from C minor. The effect often comes from a single changed pitch—A to A♭, or B to B♭—so make that note change yourself and listen to the line it creates.",
});

export const modalMixtureLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.a",
        letter: "A",
        title: "Change F into Fm",
        learn: "Hear the borrowed A♭ by changing one chord tone yourself.",
        explanation:
          "F major is F–A–C. F minor is F–A♭–C. In C major, that single A→A♭ change creates the borrowed minor iv colour while C can remain the tonal home.",
        instruction:
          "Hear one semitone create the borrowed colour. Put C in bar 1, write F/A/C in bar 2 and play it, then turn F into Fm by replacing A with A♭. Leave Fm selected and keep C in bar 3 for the return.",
        recognition:
          "Keep F and C fixed while moving A down to A♭. How much of the colour comes from that one semitone?",
        terms: [
          { term: "Modal mixture", definition: "Borrowing notes or chords from a parallel mode while retaining the same tonic." },
          { term: "Minor iv", definition: "The minor chord on scale degree 4 borrowed into a major key; Fm in C major." },
          { term: "Parallel minor", definition: "The minor key sharing the same tonic as a major key; C minor is parallel to C major." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Borrow the note",
        successLabel: "You changed A into A♭ and heard minor iv",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Bar 2 finishes on borrowed Fm", complete: chordProgression[1] === "Fm" },
        { label: "You compared F and Fm in bar 2", complete: triedChord(experiments, 1, "F") && triedChord(experiments, 1, "Fm") },
        { label: "F, A♭ and C are all written in the Fm bar", complete: barUsesAllChordTones(harmonySequence, chordProgression, 1) },
        { label: "You edited the MIDI notes", complete: edits(experiments) >= 2 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.b",
        letter: "B",
        title: "Write ♭VII",
        learn: "Put B♭ into the key and hear a less dominant kind of motion.",
        explanation:
          "B♭ major is borrowed into C major as ♭VII. It removes the leading-tone B natural from the harmony and creates a broader, more modal sound than G→C dominant motion.",
        instruction:
          "Borrow ♭VII for a broader kind of motion: write C → B♭ → F → C. Give bar 2 B♭/D/F over at least two time positions and make every sounding note fit its chord.",
        recognition:
          "Play the B♭ bar by itself, then inside the loop. Does it sound foreign alone but convincing once C frames the phrase?",
        terms: [
          { term: "♭VII", definition: "A major chord built on the lowered seventh scale degree; B♭ major in C." },
          { term: "Modal motion", definition: "Harmonic motion shaped more by scale colour and roots than by classical dominant-to-tonic pull." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Write ♭VII",
        successLabel: "B♭ is now a note you placed, not a symbol you clicked",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Progression is C → B♭ → F → C", complete: chordProgression.join("|") === "C|B♭|F|C" },
        { label: "The B♭ bar contains all three chord tones", complete: barUsesAllChordTones(harmonySequence, chordProgression, 1) },
        { label: "The B♭ bar uses at least two time positions", complete: harmonyActiveSteps(harmonySequence, 1) >= 2 },
        { label: "All written notes fit the current harmony", complete: writtenHarmonyFitsChords(harmonySequence, chordProgression) },
        { label: "You rewrote the changed harmony", complete: edits(experiments) >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.c",
        letter: "C",
        title: "Write IV → iv → I",
        learn: "Make the chromatic inner line A→A♭→G audible.",
        explanation:
          "C→F→Fm→C contains a small chromatic line inside the chords: A in F major falls to A♭ in F minor, which can then fall to G in C. That one line explains much of the progression's expressive quality.",
        instruction:
          "Follow the inner voice through C → F → Fm → C. Write every chord and keep A in bar 2, A♭ in bar 3, and G in the final C close enough in register to hear A → A♭ → G as one chromatic line.",
        recognition:
          "Isolate A→A♭→G once, then restore the other chord tones. Can you still follow that inner line inside the full harmony?",
        terms: [
          { term: "Chromatic voice leading", definition: "A melodic line inside harmony that moves by semitone through notes outside the main scale." },
          { term: "Inner voice", definition: "A moving note line inside a chordal texture rather than the highest or lowest voice." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Write the inner line",
        successLabel: "The borrowed chord now has an audible chromatic reason",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Progression is C → F → Fm → C", complete: chordProgression.join("|") === "C|F|Fm|C" },
        { label: "F and Fm both contain all their chord tones", complete: barUsesAllChordTones(harmonySequence, chordProgression, 1) && barUsesAllChordTones(harmonySequence, chordProgression, 2) },
        { label: "The final C chord is actually written", complete: barUsesAllChordTones(harmonySequence, chordProgression, 3) },
        { label: "Written notes fit each chord", complete: writtenHarmonyFitsChords(harmonySequence, chordProgression) },
        { label: "You edited the harmony", complete: edits(experiments) >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.d",
        letter: "D",
        title: "Compose with two borrowed colours",
        learn: "Use B♭ and Fm as material inside an accompaniment you shape yourself.",
        explanation:
          "Borrowed harmony is useful when it becomes part of a phrase rather than a vocabulary test. B♭ broadens the major key; Fm darkens the approach home; C keeps the tonal centre clear.",
        instruction:
          "Combine both borrowed colours in C → B♭ → Fm → C. Write all three chord tones in every bar, occupy at least ten time positions with at least three offbeat events, and make the rhythm connect the borrowed chords into one accompaniment.",
        recognition:
          "After B♭ and Fm, does C still sound like home? If not, change the rhythm or spacing until the borrowed colours feel like detours instead of a new key.",
        terms: [
          { term: "Borrowed colour", definition: "Chromatic harmony imported briefly for expression while the original tonic remains perceptually stable." },
          { term: "Tonal centre", definition: "The pitch or chord that continues to feel like home despite temporary chromatic notes." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Compose",
        successLabel: "You turned modal mixture into a four-bar accompaniment",
      }),
      evaluate: ({ chordProgression, harmonySequence, experiments }) => [
        { label: "Progression is C → B♭ → Fm → C", complete: chordProgression.join("|") === "C|B♭|Fm|C" },
        { label: "Every bar contains all of its chord tones", complete: [0, 1, 2, 3].every((bar) => barUsesAllChordTones(harmonySequence, chordProgression, bar)) },
        { label: "The accompaniment uses at least ten time positions", complete: harmonyActiveSteps(harmonySequence) >= 10 },
        { label: "At least three harmony events are offbeat", complete: harmonyOffbeats(harmonySequence) >= 3 },
        { label: "You edited the accompaniment in this exercise", complete: edits(experiments) >= 4 },
      ],
    },
  ],
};
