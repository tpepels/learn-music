import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function block(melody: Array<number | null>, start: number) {
  return melody.slice(start, start + 4);
}

function countNotes(notes: Array<number | null>) {
  return notes.filter((note) => note !== null).length;
}

function equalBlocks(
  left: Array<number | null>,
  right: Array<number | null>,
) {
  return left.every((note, index) => note === right[index]);
}

const lesson = lessonContentSchema.parse({
  id: "composition.motif-development",
  number: 14,
  title: "Motif development",
  eyebrow: "Composition · Development",
  hero: "Keep one small idea alive across the phrase."
  description:
    "Take one short idea and develop it through repetition, transposition, fragmentation, and response. The goal is coherence: later material should feel related without becoming a copy-and-paste loop.",
  overview:
    "A short idea becomes useful when you can recognise it after it changes. Repeat it first so the ear learns it, then move, shorten and answer it without losing the family resemblance.",
});

export const motifDevelopmentLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.motif-development.a",
        letter: "A",
        title: "State and repeat a motif",
        learn: "Establish identity through exact repetition before changing anything.",
        explanation:
          "A motif is usually short enough to recognize after one hearing. Exact repetition teaches the listener what matters: pitch shape, rhythm, or both. Once that identity is clear, later variations are easier to hear as related.",
        instruction:
          "Write at least three notes in steps 1–4. Then make steps 5–8 an exact repetition. Use the Repeat button or copy the notes manually.",
        recognition:
          "Look away from the piano roll. Does the second block register immediately as the same idea?",
        terms: [
          { term: "Motif", definition: "A short recognizable musical idea used as source material for a larger passage." },
          { term: "Repetition", definition: "Restating material without changing its essential pitch/rhythm identity." },
          { term: "Identity", definition: "The features that make a musical idea recognizable when it returns." },
        ],
        workspace: "motif",
        checksLabel: "Establish the motif",
        successLabel: "The source idea is now recognizable through repetition",
      }),
      evaluate: ({ melody }) => {
        const source = block(melody, 0);
        const repeat = block(melody, 4);
        return [
          {
            label: "Source motif contains at least three notes",
            complete: countNotes(source) >= 3,
          },
          {
            label: "Steps 5–8 repeat the source exactly",
            complete: countNotes(source) >= 3 && equalBlocks(source, repeat),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.motif-development.b",
        letter: "B",
        title: "Transpose the idea",
        learn: "Move the motif to a different pitch level while preserving its internal shape.",
        explanation:
          "Transposition keeps the interval pattern of an idea but starts it on a different pitch. This is one of the simplest ways to continue a phrase while preserving recognizable material.",
        instruction:
          "Keep steps 1–8. In steps 9–12, transpose the source motif up exactly 2 semitones. The rhythm/rest positions should stay the same.",
        recognition:
          "Hum the first block, then the transposed one. Is the contour recognisable even though every pitch is higher?",
        terms: [
          { term: "Transposition", definition: "Moving every note of an idea by the same interval." },
          { term: "Interval pattern", definition: "The sequence of pitch distances that defines a melodic shape." },
        ],
        workspace: "motif",
        checksLabel: "Move the motif",
        successLabel: "The motif now exists at a new pitch level",
      }),
      evaluate: ({ melody }) => {
        const source = block(melody, 0);
        const transposed = block(melody, 8);
        return [
          {
            label: "Source motif still contains at least three notes",
            complete: countNotes(source) >= 3,
          },
          {
            label: "Steps 9–12 are the motif transposed +2 semitones",
            complete: source.every((note, index) =>
              note === null
                ? transposed[index] === null
                : transposed[index] === note + 2,
            ),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.motif-development.c",
        letter: "C",
        title: "Fragment the motif",
        learn: "Use only part of an established idea so the listener gets recognition without a full restatement.",
        explanation:
          "Fragmentation extracts a small piece of a motif—often its first few notes or rhythm—and uses that fragment independently. It creates continuity while leaving more space for change.",
        instruction:
          "In steps 13–16, use only one or two notes from the source motif and leave at least two rests. The notes you keep should come directly from steps 1–4.",
        recognition:
          "Does the fragment remind you of the motif before you consciously identify which notes survived?",
        terms: [
          { term: "Fragmentation", definition: "Developing a motif by using only a smaller piece of it." },
          { term: "Fragment", definition: "A recognizable subset of a larger musical idea." },
        ],
        workspace: "motif",
        checksLabel: "Reduce the idea",
        successLabel: "A small fragment now carries the motif's identity",
      }),
      evaluate: ({ melody }) => {
        const source = block(melody, 0).filter(
          (note): note is number => note !== null,
        );
        const fragment = block(melody, 12);
        const notes = fragment.filter(
          (note): note is number => note !== null,
        );

        return [
          {
            label: "Fragment contains one or two notes",
            complete: notes.length >= 1 && notes.length <= 2,
          },
          {
            label: "Fragment leaves at least two rests",
            complete: fragment.filter((note) => note === null).length >= 2,
          },
          {
            label: "Fragment notes come from the source motif",
            complete: notes.length > 0 && notes.every((note) => source.includes(note)),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.motif-development.d",
        letter: "D",
        title: "Create call and response",
        learn: "Use transformed material to answer the original phrase instead of simply repeating it.",
        explanation:
          "Call and response creates a conversational relationship between two phrases. The response should be related enough to make sense after the call, but different enough to feel like an answer rather than an echo.",
        instruction:
          "Treat steps 1–8 as the call and steps 9–16 as the response. Keep at least four notes in the response, make it different from the call, and end the response on C, E, or G.",
        recognition:
          "Play only the call, then only the response. Do they sound related enough to belong together and different enough to feel conversational?",
        terms: [
          { term: "Call and response", definition: "A phrase relationship where one idea is followed by a related answering idea." },
          { term: "Response", definition: "Material that follows and reacts to an earlier statement." },
          { term: "Closure", definition: "The sense that a phrase has reached a temporary or final resting point." },
        ],
        workspace: "motif",
        checksLabel: "Make the phrase converse",
        successLabel: "The developed material now functions as an answer",
      }),
      evaluate: ({ melody }) => {
        const call = melody.slice(0, 8);
        const response = melody.slice(8, 16);
        const responseNotes = response.filter(
          (note): note is number => note !== null,
        );
        const last = [...responseNotes].at(-1);
        return [
          {
            label: "Response contains at least four notes",
            complete: responseNotes.length >= 4,
          },
          {
            label: "Response is not an exact copy of the call",
            complete: !call.every((note, index) => note === response[index]),
          },
          {
            label: "Response ends on C, E, or G",
            complete: last !== undefined && [0, 4, 7].includes(last % 12),
          },
        ];
      },
    },
  ],
};
