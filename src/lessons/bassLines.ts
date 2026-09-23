import {
  bassChordToneMidis,
  bassRootMidi,
} from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const barStarts = [0, 8, 16, 24];
const beatThree = [4, 12, 20, 28];
const approaches = [7, 15, 23, 31];

const lesson = lessonContentSchema.parse({
  id: "composition.bass-lines",
  number: 12,
  title: "Bass lines",
  eyebrow: "Composition · Bass",
  hero: "Turn chord roots into a line that also belongs to the groove.",
  description:
    "Add a bass line underneath the groove and harmony already in your project. Start with roots, then use chord tones, rhythm, and approach notes to turn those anchors into a line.",
  overview:
    "The bass tells the ear where the harmony is while also living inside the groove. Start with the roots, then let the line move through chord tones, offbeats and approach notes without losing the progression underneath.",
});

export const bassLinesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.bass-lines.a",
        letter: "A",
        title: "Anchor each chord root",
        learn: "Make the harmony audible from the lowest line before adding decoration.",
        explanation:
          "The root is the strongest harmonic anchor for a bass line. Placing the current chord root on the downbeat makes the progression easy to hear even if the upper chord instrument disappears.",
        instruction:
          "Press Play so your groove and harmony are audible. Put each chord root on the first eighth-note of its bar: steps 1, 9, 17, and 25. Leave the rest mostly empty at first and hear what the roots add to the piece.",
        recognition:
          "Mute the chord part mentally and follow only the bass. Can you still tell where each harmony changes?",
        terms: [
          { term: "Bass line", definition: "The low melodic/rhythmic line that often connects harmony to the groove." },
          { term: "Root note", definition: "The note that gives a chord its name and strongest harmonic identity." },
          { term: "Downbeat", definition: "The first and usually strongest beat of a bar." },
        ],
        workspace: "bass",
        checksLabel: "Anchor the harmony",
        successLabel: "Every bar begins with its chord root",
      }),
      evaluate: ({ chordProgression, bassSequence, experiments }) => [
        { label: "You placed the four anchors in this exercise", complete: changedControl(experiments, "bass.edit", 4) },
        { label: "You listened to the roots under the track", complete: heardPlayback(experiments) },
        ...barStarts.map((step, bar) => ({
          label: "Bar " + (bar + 1) + " begins on its chord root",
          complete: Boolean(
            chordProgression[bar] &&
              bassSequence[step] === bassRootMidi(chordProgression[bar]!),
          ),
        })),
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.bass-lines.b",
        letter: "B",
        title: "Outline chord tones",
        learn: "Use thirds and fifths so the bass describes harmony without repeating only roots.",
        explanation:
          "A bass line can outline a chord by moving among its root, third, and fifth instead of repeating only the root. Because those notes already belong to the harmony, the line can become more melodic without losing the listener’s sense of the chord underneath it. The choice of chord tone also changes the bass contour and can make the transition into the next harmony smoother or more active.",
        instruction:
          "Keep the four root downbeats. Add a chord tone on beat 3 of every bar: steps 5, 13, 21, and 29. Try thirds and fifths rather than simply repeating the root.",
        recognition:
          "Do the extra notes make the line sing a little more without making the chord change harder to hear?",
        terms: [
          { term: "Chord tone", definition: "A note that belongs directly to the current chord, such as its root, third, or fifth." },
          { term: "Arpeggiation", definition: "Playing chord tones one after another instead of simultaneously." },
        ],
        workspace: "bass",
        checksLabel: "Outline the chords",
        successLabel: "The bass now describes more than just the roots",
      }),
      evaluate: ({ chordProgression, bassSequence, experiments }) => [
        { label: "You added chord-tone movement in this exercise", complete: changedControl(experiments, "bass.edit", 4) },
        { label: "You listened to the outline with the harmony", complete: heardPlayback(experiments) },
        ...beatThree.map((step, bar) => {
          const chord = chordProgression[bar];
          return {
            label: "Bar " + (bar + 1) + " uses a chord tone on beat 3",
            complete: Boolean(
              chord &&
                bassSequence[step] !== null &&
                bassChordToneMidis(chord).includes(bassSequence[step]!),
            ),
          };
        }),
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.bass-lines.c",
        letter: "C",
        title: "Approach the next chord",
        learn: "Use an offbeat note just before a change to pull the ear toward the next root.",
        explanation:
          "An approach note sits close to the destination note and arrives just before it. In bass writing this creates forward motion because the listener hears a short melodic pull into the next chord change.",
        instruction:
          "Add approach notes on at least two of the final eighth-notes before a bar change: steps 8, 16, 24, or 32. Choose a pitch one or two semitones from the root that follows.",
        recognition:
          "Compare the bar ending with and without the approach note. Does the next root feel more inevitable when the approach is present?",
        terms: [
          { term: "Approach note", definition: "A note close to a target pitch that is used immediately before the target to create direction." },
          { term: "Chromatic approach", definition: "Approaching a target from a note outside the key, usually a semitone above or below." },
          { term: "Anticipation", definition: "Creating forward pull by placing important motion just before an expected arrival." },
        ],
        workspace: "bass",
        checksLabel: "Lead into the changes",
        successLabel: "The bass now points forward into later chords",
      }),
      evaluate: ({ chordProgression, bassSequence, experiments }) => {
        const completed = approaches.filter((step, index) => {
          const nextBar = (index + 1) % 4;
          const nextChord = chordProgression[nextBar];
          const note = bassSequence[step];
          return Boolean(
            nextChord &&
              note !== null &&
              Math.abs(note! - bassRootMidi(nextChord)) <= 2,
          );
        }).length;

        return [
          { label: "You tried approach notes in this exercise", complete: changedControl(experiments, "bass.edit", 2) },
          { label: "You listened to the approach into the next root", complete: heardPlayback(experiments) },
          {
            label: "At least two bar changes use close approach notes",
            complete: completed >= 2,
          },
          {
            label: "At least one approach happens on an eighth-note offbeat",
            complete: approaches.some((step) => bassSequence[step] !== null),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.bass-lines.d",
        letter: "D",
        title: "Write a complete bass phrase",
        learn: "Balance harmonic clarity, rhythm, contour, and forward motion in one four-bar line.",
        explanation:
          "A useful bass part is neither only harmony nor only rhythm. It tells the listener where the chords are, locks into the pulse, creates small melodic shapes, and decides when leaving space is stronger than adding another note.",
        instruction:
          "Keep all four root downbeats. Build a line with at least 10 notes total, at least 3 offbeat notes, and more than one pitch. Use chord tones for stability and approach notes selectively before changes.",
        recognition:
          "Can the bass stand alone for a loop? You should still hear the chord changes, but the line should also have a contour you could hum back.",
        terms: [
          { term: "Contour", definition: "The overall up-and-down shape of a melodic line." },
          { term: "Rhythmic lock", definition: "The way a bass part aligns or deliberately interacts with the drum groove." },
          { term: "Space", definition: "Intentional silence that lets rhythm, harmony, and other parts remain readable." },
        ],
        workspace: "bass",
        checksLabel: "Complete the phrase",
        successLabel: "The bass now works as harmony, rhythm, and melody at once",
      }),
      evaluate: ({ chordProgression, bassSequence, experiments }) => {
        const notes = bassSequence.filter((note) => note !== null);
        const offbeats = bassSequence.filter(
          (note, step) => note !== null && step % 2 === 1,
        ).length;

        return [
          { label: "You developed the bass phrase in this exercise", complete: changedControl(experiments, "bass.edit", 4) },
          { label: "You listened to the complete bass line in context", complete: heardPlayback(experiments) },
          {
            label: "All four bar starts still land on chord roots",
            complete: barStarts.every((step, bar) =>
              Boolean(
                chordProgression[bar] &&
                  bassSequence[step] === bassRootMidi(chordProgression[bar]!),
              ),
            ),
          },
          {
            label: "The phrase contains at least 10 notes",
            complete: notes.length >= 10,
          },
          {
            label: "At least three notes use eighth-note offbeats",
            complete: offbeats >= 3,
          },
          {
            label: "The line uses more than one pitch",
            complete: new Set(notes).size >= 3,
          },
        ];
      },
    },
  ],
};
