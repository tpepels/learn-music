import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.accompaniment",
  number: 7,
  title: "The accompaniment",
  eyebrow: "Schoenberg · Accompaniment",
  hero:
    "Make the supporting parts function as part of the composition instead of treating them as notes added underneath a finished melody.",
  description:
    "Accompaniment clarifies harmony, supplies a unifying motion, contributes to character and can sometimes disappear entirely. Its rhythm, voice leading and bass line need their own musical logic.",
  overview:
    "Move from transparency and omission to a repeated accompanimental motive, active supporting motion and a bass line that behaves like a second melody.",
});

function activeHarmonySteps(sequence: number[][]): number {
  return sequence.filter((notes) => notes.length > 0).length;
}

function harmonyOffbeats(sequence: number[][]): number {
  return sequence.filter(
    (notes, step) => notes.length > 0 && step % 2 === 1,
  ).length;
}

function barRhythmSignature(sequence: number[][], bar: number): string {
  return sequence
    .slice(bar * 8, bar * 8 + 8)
    .map((notes) => (notes.length ? "1" : "0"))
    .join("");
}

function repeatedAccompanimentRhythm(sequence: number[][]): boolean {
  const signatures = Array.from({ length: 4 }, (_, bar) =>
    barRhythmSignature(sequence, bar),
  ).filter((signature) => signature.includes("1"));

  return signatures.some(
    (signature, index) => signatures.indexOf(signature) !== index,
  );
}

function activeBassNotes(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

export const schoenbergAccompanimentLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.accompaniment.a",
        letter: "A",
        title: "Use accompaniment only when it has a job",
        learn:
          "Hear how removing support can create transparency when the melodic idea remains clear, and why ambiguity may require the support to return.",
        explanation:
          "Accompaniment is not automatically required at every moment. A harmonically self-sufficient melodic segment can stand alone, and the resulting transparency may itself become an expressive contrast. Pickups, openings and short internal figures are especially capable of remaining unaccompanied when their harmonic meaning is already obvious.\n\nThe opposite is equally important. When the harmony or rhythm becomes difficult to infer, accompaniment stops being decorative and becomes functional. The useful question is therefore not 'where can I add chords?' but 'what does the listener need here?' Silence and support are both compositional choices.",
        instruction:
          "In the Arrangement workspace, create at least one bar in which Melody sounds without Bass or Chords, and at least one later bar in which Melody is supported by Bass or Chords. Keep some continuity between the two so you are comparing support, not two unrelated arrangements.\n\nPlay across the boundary several times. Listen first to the exposed melody, then to the supported version. Keep the contrast only if the unaccompanied bar remains intelligible and the returning support makes a clear musical contribution.",
        recognition:
          "When the support disappears, does the melody remain understandable and gain transparency, or does the harmony become unclear enough that accompaniment is actually needed?",
        source: {
          reference: "Chapter IX - omissibility and function of accompaniment",
          focus:
            "Accompaniment should be functional; harmonically self-sufficient passages may remain unaccompanied, while ambiguous passages need support.",
          exampleIds: [
            "s07.accompaniment-function",
            "s07.accompaniment-space",
          ],
        },
        terms: [
          {
            term: "Transparency",
            definition:
              "Clarity created by reducing simultaneous material so individual musical functions are easier to hear.",
          },
          {
            term: "Harmonic ambiguity",
            definition:
              "A passage whose tonal or chordal meaning is difficult to infer from the principal line alone.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Use support deliberately",
        successLabel: "The accompaniment now enters because it contributes something",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const exposed = arrangement.some(
          (bar) => bar.melody && !bar.chords && !bar.bass,
        );
        const supported = arrangement.some(
          (bar) => bar.melody && (bar.chords || bar.bass),
        );
        return [
          {
            label: "You changed the support plan in this exercise",
            complete: changedControl(experiments, "arrangement.edit", 2),
          },
          {
            label: "You listened across the transparency change",
            complete: heardPlayback(experiments),
          },
          {
            label: "At least one melodic bar is deliberately exposed",
            complete: exposed,
          },
          {
            label: "At least one melodic bar receives harmonic support",
            complete: supported,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.accompaniment.b",
        letter: "B",
        title: "Give the accompaniment its own motive",
        learn:
          "Create a simple recurring rhythmic identity that survives as the harmony changes underneath it.",
        explanation:
          "An accompaniment can unify a passage by behaving motivically. Its motive usually needs less variety than the principal melody: a characteristic rhythm or figuration can repeat while its pitches adapt to successive harmonies. That regular motion gives the listener a stable background against which melodic change becomes easier to understand.\n\nThe pattern should not become a prison. A useful accompanimental motive is simple enough to modify, liquidate or abandon when a cadence, change of theme or change of character requires a different texture. Consistency creates unity; flexibility prevents the support from fighting the form.",
        instruction:
          "In the Harmony sequencer, write a recurring rhythmic pattern in at least two bars. Use the same active step positions while allowing the pitches to fit the local harmony. Aim for a pattern with both sound and space rather than a solid block on every step.\n\nPlay all four bars and follow the accompaniment rather than the melody. Adjust at least four harmony steps in this exercise and keep the pattern only if you can tap its rhythm back from memory after the harmony has changed.",
        recognition:
          "Can you recognise the accompaniment by its rhythm even when its pitches change with the harmony?",
        source: {
          reference: "Chapter IX - motive of the accompaniment",
          focus:
            "A simple accompanimental motive, often primarily rhythmic, can unify changing harmony while remaining flexible enough to be modified or liquidated.",
          exampleIds: ["s07.accompaniment-motive"],
        },
        terms: [
          {
            term: "Motive of the accompaniment",
            definition:
              "A recurring rhythmic or figurative pattern that gives the supporting texture a consistent identity.",
          },
          {
            term: "Motus",
            definition:
              "The characteristic ongoing motion supplied by a recurring rhythmic or textural pattern.",
          },
        ],
        workspace: "harmony-song",
        checksLabel: "Make the support memorable",
        successLabel: "The accompaniment now has a recurring rhythmic identity",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You wrote the accompanimental pattern in this exercise",
          complete: changedControl(experiments, "harmony.note-edit", 4),
        },
        {
          label: "You listened to the pattern across the harmony",
          complete: heardPlayback(experiments),
        },
        {
          label: "The accompaniment uses more than isolated downbeats",
          complete: activeHarmonySteps(harmonySequence) >= 8,
        },
        {
          label: "At least two bars share the same rhythmic shape",
          complete: repeatedAccompanimentRhythm(harmonySequence),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.accompaniment.c",
        letter: "C",
        title: "Keep the supporting voices alive",
        learn:
          "Use motion and space inside the accompaniment instead of stacking every harmony as a motionless block.",
        explanation:
          "Clear harmony does not require lifeless part-writing. Supporting voices can move fluently, answer gaps in the principal line and create complementary rhythm while the root progression remains understandable. This produces an active texture without forcing the accompaniment to compete with the melody.\n\nOne practical danger is overcrowding. If every step contains a full sonority, the support can obscure phrasing and character. Intermittent entries, afterbeats and complementary motion let harmony remain present while leaving the melody room to articulate its own rhythm.",
        instruction:
          "Keep the recurring identity from the previous exercise but make the texture less block-like. Use at least two offbeat harmony entries and leave audible gaps. Spread activity through at least three bars instead of concentrating everything in one place.\n\nPlay the loop and listen for the spaces between entries. If the accompaniment begins to sound like a second lead line, simplify it. If it feels inert, move one entry off the beat or let a supporting voice answer a gap.",
        recognition:
          "Does the support have its own motion while still leaving the principal line clearly in front?",
        source: {
          reference: "Chapter IX - types of accompaniment and voice leading",
          focus:
            "Complementary rhythm, intermittent support and fluent secondary voices can animate harmony without obscuring the principal material.",
          exampleIds: [
            "s07.accompaniment-function",
            "s07.accompaniment-motive",
          ],
        },
        terms: [
          {
            term: "Complementary rhythm",
            definition:
              "Supporting activity placed partly in gaps or weak positions so it complements rather than duplicates the main rhythm.",
          },
          {
            term: "Voice leading",
            definition:
              "The way individual pitches in one part move into pitches of the following harmony.",
          },
        ],
        workspace: "harmony-song",
        checksLabel: "Animate the support",
        successLabel: "The accompaniment now moves without crowding the melody",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You revised the accompaniment texture here",
          complete: changedControl(experiments, "harmony.note-edit", 4),
        },
        {
          label: "You listened to the active supporting motion",
          complete: heardPlayback(experiments),
        },
        {
          label: "The accompaniment includes offbeat motion",
          complete: harmonyOffbeats(harmonySequence) >= 2,
        },
        {
          label: "Activity is distributed through at least three bars",
          complete:
            Array.from({ length: 4 }, (_, bar) =>
              harmonySequence
                .slice(bar * 8, bar * 8 + 8)
                .some((notes) => notes.length > 0),
            ).filter(Boolean).length >= 3,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.accompaniment.d",
        letter: "D",
        title: "Treat the bass as a second melody",
        learn:
          "Make the lowest voice clarify harmony while also forming a coherent line with contour, continuity and direction.",
        explanation:
          "The bass has a special double responsibility. Its notes strongly affect how harmony is heard, but a bass line that merely jumps from root to root can be rhythmically and melodically clumsy. Thinking of it as a second melody encourages attention to repeated notes, register, leaps and the shape of the whole line.\n\nRoot position remains useful when harmonic identity needs emphasis, but inversions and other chord tones can improve fluency. The best choice is not automatically the nearest pitch or the root: it is the note that keeps the harmony clear while allowing the bass to make a convincing musical progression.",
        instruction:
          "In the Bass workspace, write or revise at least six steps. Build a line with at least eight sounding notes and at least three different pitches. Preserve clear harmonic anchors, but avoid letting the entire line sit on one repeated pitch.\n\nPlay the bass with the track, then mentally follow only the lowest line. Revise any leap or repetition that sounds accidental. The finished bass should make sense as a contour you could trace even without seeing the chord symbols.",
        recognition:
          "Can you follow the bass as a line with its own shape while it still makes the harmonic changes easier to hear?",
        source: {
          reference: "Chapter IX - treatment of the bass line",
          focus:
            "The bass should participate in harmonic function while maintaining melodic coherence, continuity and an appropriate register.",
          exampleIds: ["s07.accompaniment-bass"],
        },
        terms: [
          {
            term: "Bass line",
            definition:
              "The lowest musical line, which strongly influences harmonic interpretation while also having melodic shape.",
          },
          {
            term: "Inversion",
            definition:
              "A chord position in which a chord tone other than the root appears in the bass.",
          },
        ],
        workspace: "bass",
        checksLabel: "Make the bass musical",
        successLabel: "The bass now functions as harmony and as a coherent line",
      }),
      evaluate: ({ bassSequence, experiments }) => {
        const notes = activeBassNotes(bassSequence);
        return [
          {
            label: "You revised the bass line in this exercise",
            complete: changedControl(experiments, "bass.edit", 6),
          },
          {
            label: "You listened to the bass in context",
            complete: heardPlayback(experiments),
          },
          {
            label: "The bass contains enough material to form a line",
            complete: notes.length >= 8,
          },
          {
            label: "The bass uses at least three different pitches",
            complete: new Set(notes).size >= 3,
          },
          {
            label: "The line spans more than a single repeated note",
            complete:
              notes.length > 1 && Math.max(...notes) - Math.min(...notes) >= 3,
          },
        ];
      },
    },
  ],
};
