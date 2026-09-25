import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.melody-theme",
  number: 9,
  title: "Melody & theme",
  eyebrow: "Schoenberg · Melody & Theme",
  hero:
    "Write lines that remain balanced and intelligible while learning why a self-contained melody and a theme that demands continuation are not the same thing.",
  description:
    "Melodic writing begins with continuity, contour, register and harmonic intelligibility. Instrumental writing can exceed vocal limits, but technical freedom does not remove the need for balance or phrase direction.",
  overview:
    "Start from singable melodic behaviour, shape a wave and climax, use instrumental freedom deliberately, then decide whether the result behaves as a self-contained melody or as thematic material that asks for consequences.",
});

function activeNotes(melody: Array<number | null>): number[] {
  return melody.filter((note): note is number => note !== null);
}

function melodicRange(melody: Array<number | null>): number {
  const notes = activeNotes(melody);
  return notes.length ? Math.max(...notes) - Math.min(...notes) : 0;
}

function adjacentIntervals(melody: Array<number | null>): number[] {
  const notes = activeNotes(melody);
  return notes.slice(1).map((note, index) => note - notes[index]);
}

function stepwiseRatio(melody: Array<number | null>): number {
  const intervals = adjacentIntervals(melody);
  if (!intervals.length) return 0;
  return intervals.filter((interval) => Math.abs(interval) <= 2).length /
    intervals.length;
}

function hasCompensatedLeap(melody: Array<number | null>): boolean {
  const notes = activeNotes(melody);
  for (let index = 0; index < notes.length - 2; index += 1) {
    const leap = notes[index + 1] - notes[index];
    const next = notes[index + 2] - notes[index + 1];
    if (
      Math.abs(leap) >= 5 &&
      Math.abs(next) <= 2 &&
      Math.sign(leap) !== Math.sign(next)
    ) {
      return true;
    }
  }
  return false;
}

function hasWave(melody: Array<number | null>): boolean {
  const notes = activeNotes(melody);
  if (notes.length < 6) return false;
  const intervals = notes.slice(1).map((note, index) => note - notes[index]);
  const directions = intervals
    .map((interval) => Math.sign(interval))
    .filter((direction) => direction !== 0);
  return directions.some(
    (direction, index) =>
      index > 0 && direction !== directions[index - 1],
  );
}

function highestNotePosition(melody: Array<number | null>): number {
  const notes = melody
    .map((note, index) => ({ note, index }))
    .filter((entry): entry is { note: number; index: number } =>
      entry.note !== null,
    );
  if (!notes.length) return -1;
  const highest = Math.max(...notes.map((entry) => entry.note));
  return notes.find((entry) => entry.note === highest)?.index ?? -1;
}

export const schoenbergMelodyThemeLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.melody-theme.a",
        letter: "A",
        title: "Start from singable melodic behaviour",
        learn:
          "Use connected motion, a manageable register and clear phrase direction as a practical foundation for melody.",
        explanation:
          "Vocal melody provides a useful starting discipline because the voice exposes awkwardness immediately. Stepwise motion and moderate intervals make tones easier to connect; a manageable register keeps the line from sounding like unrelated fragments; and a clear relation to harmony helps chromatic or dissonant notes remain intelligible. These are tendencies rather than prohibitions.\n\nA melody also needs balance across time. Constant ascent eventually exhausts its register, while a sequence of large unrelated leaps is difficult to retain. Smooth connection does not mean avoiding all leaps: it means placing exceptional intervals in a line whose surrounding motion gives them context and whose overall contour can still be grasped as one phrase.",
        instruction:
          "In the Melody workspace, write or revise at least eight sounding notes. Keep the total range within about an octave and make at least half of the successive melodic movements stepwise - a tone or semitone. Leave some rests if the phrase needs them.\n\nPlay the complete line rather than auditioning notes one at a time. Hum or mentally sing it back after playback. Revise at least six melody steps in this exercise and remove any interval that feels like a technical event rather than part of one connected line.",
        recognition:
          "Can you remember and mentally sing the contour after one hearing, including where the line breathes and where its less ordinary intervals occur?",
        source: {
          reference: "Chapter XI - vocal melody",
          focus:
            "Singability provides a starting discipline: smooth linkage, balanced contour, controlled register and harmonic support help a line remain intelligible.",
          exampleIds: ["s09.vocal-melody"],
        },
        terms: [
          {
            term: "Singability",
            definition:
              "The degree to which a melodic line can be connected, remembered and physically or mentally sung as one coherent gesture.",
          },
          {
            term: "Compass",
            definition:
              "The total pitch range occupied by a melodic line.",
          },
        ],
        workspace: "melody",
        checksLabel: "Make the line sing",
        successLabel: "The melody now has connected motion and a manageable range",
      }),
      evaluate: ({ melody, experiments }) => [
        {
          label: "You substantially revised the line here",
          complete: changedControl(experiments, "melody.edit", 6),
        },
        {
          label: "You listened to the complete melody",
          complete: heardPlayback(experiments),
        },
        {
          label: "The melody contains at least eight sounding notes",
          complete: activeNotes(melody).length >= 8,
        },
        {
          label: "The melodic compass stays within about an octave",
          complete: melodicRange(melody) >= 4 && melodicRange(melody) <= 12,
        },
        {
          label: "At least half of adjacent movements are stepwise",
          complete: stepwiseRatio(melody) >= 0.5,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.melody-theme.b",
        letter: "B",
        title: "Shape the melody in waves",
        learn:
          "Balance upward and downward motion so a high point feels approached, reached and left rather than appearing as an arbitrary extreme.",
        explanation:
          "A well-balanced line often progresses in waves. Ascents are answered by descents, intermediate high points prepare stronger ones, and motion in one direction is eventually countered by motion in the other. This gives the listener a large contour to remember in addition to the local intervals between notes.\n\nRegister has expressive weight. A high point becomes less significant if the melody lives at that height constantly, while reserving the upper register can make a climax perceptible without any change in volume. The approach and recession matter as much as the highest note itself: a climax that arrives without preparation can sound like a random leap.",
        instruction:
          "Reshape the melody so it contains at least one clear change of direction and one high point after the opening quarter of the phrase. Let the line move away from that high point afterward instead of ending at its maximum pitch.\n\nKeep at least eight sounding notes and revise at least four steps. Play from the beginning after every large edit. In the finished line, point to the approach, the highest point and the recession as three audible stages of one wave.",
        recognition:
          "Does the highest note feel earned by the contour around it, and can you hear the line recede after reaching it?",
        source: {
          reference: "Chapter XI - melodic balance and register",
          focus:
            "Balanced melodies often progress in waves; register and high points gain meaning through preparation, contrast and recession.",
          exampleIds: ["s09.vocal-melody"],
        },
        terms: [
          {
            term: "Climax",
            definition:
              "A point of especially high structural or expressive intensity, often associated with a registral high point.",
          },
          {
            term: "Melodic wave",
            definition:
              "A larger contour in which rises are balanced by recessions and changes of direction.",
          },
        ],
        workspace: "melody",
        checksLabel: "Shape the contour",
        successLabel: "The melody now approaches and leaves a recognisable high point",
      }),
      evaluate: ({ melody, experiments }) => {
        const high = highestNotePosition(melody);
        const laterNotes = high >= 0
          ? melody.slice(high + 1).filter((note): note is number => note !== null)
          : [];
        const highPitch = high >= 0 ? melody[high] : null;
        return [
          {
            label: "You reshaped the contour here",
            complete: changedControl(experiments, "melody.edit", 4),
          },
          {
            label: "You listened to the complete wave",
            complete: heardPlayback(experiments),
          },
          {
            label: "The line changes direction",
            complete: hasWave(melody),
          },
          {
            label: "The high point occurs after the opening",
            complete: high >= 4,
          },
          {
            label: "The melody recedes after its high point",
            complete:
              highPitch !== null &&
              laterNotes.some((note) => note < highPitch),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.melody-theme.c",
        letter: "C",
        title: "Use instrumental freedom deliberately",
        learn:
          "Allow wider leaps or more agile motion without losing continuity, balance or the sense that one gesture leads to the next.",
        explanation:
          "Instrumental melody is freed from some physical limitations of singing. Instruments can repeat rapidly, sustain beyond a breath, leap across a wider compass or articulate figures that would be awkward for a voice. But increased technical possibility does not make every succession melodically convincing. Range, fingering, articulation and timbre replace vocal breath as practical constraints.\n\nA useful test is to imagine the line as if an idealised voice with impossible technique still had to make musical sense of it. Large leaps gain coherence when surrounding motion responds to them; a leap followed by stepwise motion in the opposite direction is one common way to restore balance. Freedom is most effective when the exceptional gesture has a clear structural reason.",
        instruction:
          "Introduce one deliberate leap of at least a fourth into the melody, then compensate for it with stepwise motion in the opposite direction. Keep the rest of the phrase sufficiently connected that the leap sounds like an expressive event rather than a break in the line.\n\nMake at least four fresh edits and play the entire phrase after placing the leap. If the gesture destroys the melodic wave, move it, reduce it or change what follows until the line absorbs the larger interval.",
        recognition:
          "Does the wider leap create a meaningful event while the motion immediately around it restores continuity?",
        source: {
          reference: "Chapter XI - instrumental melody",
          focus:
            "Instrumental technique allows freer melodic motion, but instrument-specific limits and melodic balance still govern whether that freedom is convincing.",
          exampleIds: ["s09.instrumental-melody"],
        },
        terms: [
          {
            term: "Compensated leap",
            definition:
              "A larger melodic interval followed or prepared by motion that restores balance, often stepwise motion in the opposite direction.",
          },
          {
            term: "Instrumental idiom",
            definition:
              "Melodic and technical behaviour that fits the physical and expressive resources of a particular instrument.",
          },
        ],
        workspace: "melody",
        checksLabel: "Control the leap",
        successLabel: "The instrumental freedom now belongs to one coherent line",
      }),
      evaluate: ({ melody, experiments }) => [
        {
          label: "You experimented with the instrumental contour",
          complete: changedControl(experiments, "melody.edit", 4),
        },
        {
          label: "You listened to the leap in the complete phrase",
          complete: heardPlayback(experiments),
        },
        {
          label: "The melody contains a compensated leap",
          complete: hasCompensatedLeap(melody),
        },
        {
          label: "The line still contains enough connected material",
          complete: activeNotes(melody).length >= 8 && stepwiseRatio(melody) >= 0.35,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.melody-theme.d",
        letter: "D",
        title: "Decide whether the idea closes or demands consequences",
        learn:
          "Distinguish a self-contained melodic line from thematic material whose unrest and implications make continuation necessary.",
        explanation:
          "A melody and a theme are not interchangeable labels. A melody tends toward a balanced, relatively self-contained line: its phrasing and contour can provide a satisfying identity even when heard alone. A theme can instead establish a structural problem or unrest whose meaning depends on what later music does with it. Its value lies partly in the consequences it implies.\n\nThe distinction is one of formal tendency rather than beauty. A memorable tune is not automatically a useful theme, and a strong theme need not sound complete in isolation. When writing a self-contained melody, closure should be audible in the line itself. When writing thematic material, unresolved direction can be productive because it creates a reason for continuation and development.",
        instruction:
          "For this exercise, finish the current line as a self-contained melody rather than an open theme. Keep at least eight sounding notes, preserve the wave you developed, and make the final sounding note C, E or G so the ending has a stable relation to the current C-major context.\n\nMake at least four fresh edits and listen to the whole phrase. Then revisit the Melody versus Theme analysis and imagine removing the closing gesture. Notice how quickly a self-contained melody can become material that demands continuation when its resting point disappears.",
        recognition:
          "Does the final gesture let the line stand on its own, and can you also hear how a less settled ending would turn the same material into a question for later music to answer?",
        source: {
          reference: "Chapter XI - melody versus theme",
          focus:
            "Melody tends toward self-containment, while a theme can establish implications and unrest whose consequences are realised in later continuation.",
          exampleIds: [
            "s09.vocal-melody",
            "s09.instrumental-melody",
            "s09.melody-theme",
          ],
        },
        terms: [
          {
            term: "Melody",
            definition:
              "A concentrated principal line whose contour, rhythm and phrasing can form a comparatively self-contained musical idea.",
          },
          {
            term: "Theme",
            definition:
              "Material with a structural role that implies consequences and gains fuller meaning through continuation or development.",
          },
          {
            term: "Formal tendency",
            definition:
              "The way a musical idea seems to point toward rest, continuation, contrast or development.",
          },
        ],
        workspace: "melody",
        checksLabel: "Complete the melodic line",
        successLabel: "The line now demonstrates audible self-containment",
      }),
      evaluate: ({ melody, experiments }) => {
        const notes = activeNotes(melody);
        const last = notes.at(-1);
        return [
          {
            label: "You revised the ending in this exercise",
            complete: changedControl(experiments, "melody.edit", 4),
          },
          {
            label: "You listened to the complete line",
            complete: heardPlayback(experiments),
          },
          {
            label: "The melody contains enough material to establish itself",
            complete: notes.length >= 8,
          },
          {
            label: "The contour retains more than one direction",
            complete: hasWave(melody),
          },
          {
            label: "The final note gives a stable C-major resting point",
            complete: last !== undefined && [0, 4, 7].includes(last % 12),
          },
        ];
      },
    },
  ],
};
