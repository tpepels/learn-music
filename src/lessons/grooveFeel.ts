import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function activeVelocities(
  active: boolean[],
  velocities: number[],
): number[] {
  return velocities.filter((_, step) => active[step]);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const lesson = lessonContentSchema.parse({
  id: "rhythm.groove-feel",
  number: 13,
  title: "Velocity, accents & swing",
  eyebrow: "Rhythm · Feel",
  hero: "The notes can stay on the grid while the groove changes completely.",
  description:
    "Shape how hard individual drum hits speak, add quiet ghost notes, and delay alternating subdivisions with swing. The rhythm stays recognisable while its feel changes substantially.",
  overview:
    "A programmed groove is shaped by more than note positions. How hard each hit speaks and how evenly the subdivisions are spaced can change the feel without changing the pattern itself.",
});

export const grooveFeelLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.groove-feel.a",
        letter: "A",
        title: "Give the pulse weight",
        learn: "Use velocity so the structural beats speak more strongly than the time-keeping layer.",
        explanation:
          "MIDI velocity represents how forcefully a note is played. On drums it usually changes loudness and often timbre as well. Equal velocity makes every event compete for attention; accents create a hierarchy the body can follow.",
        instruction:
          "Select KICK in the velocity editor. Keep kicks on steps 1, 5, 9, and 13 and raise those four to at least 105/127. Keep the average hi-hat velocity below the average kick velocity, then compare the groove.",
        recognition:
          "Turn the kick accents down briefly, then restore them. Which version makes the body find the pulse faster?",
        terms: [
          { term: "Velocity", definition: "A MIDI value, usually 1–127, representing how strongly a note is played." },
          { term: "Accent", definition: "A note intentionally played stronger than surrounding notes." },
          { term: "Dynamic hierarchy", definition: "Using different strengths so some rhythmic events feel structurally more important than others." },
        ],
        workspace: "groove-feel",
        checksLabel: "Weight the pulse",
        successLabel: "The groove now has a clear dynamic foreground and background",
      }),
      evaluate: ({ A, grooveFeelSettings }) => {
        const kick = grooveFeelSettings.velocities.kick;
        const hats = activeVelocities(A.hat, grooveFeelSettings.velocities.hat);
        const kicks = activeVelocities(A.kick, kick);

        return [
          {
            label: "Four structural kick beats are active",
            complete: [0, 4, 8, 12].every((step) => A.kick[step]),
          },
          {
            label: "Those four kick accents are at least 105/127",
            complete: [0, 4, 8, 12].every((step) => kick[step] >= 105 / 127),
          },
          {
            label: "Hi-hats are lighter on average than kicks",
            complete: hats.length > 0 && average(hats) < average(kicks),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.groove-feel.b",
        letter: "B",
        title: "Shape an accent pattern",
        learn: "Turn identical eighth notes into a phrase by alternating strong and weak hat strokes.",
        explanation:
          "A steady subdivision does not need equal emphasis. Drummers naturally phrase repeated hi-hats through accents. In MIDI, velocity is how producers imitate that dynamic contour instead of leaving a robotic row of identical notes.",
        instruction:
          "Select HI-HAT. Keep eighth-note hats on steps 1, 3, 5, 7, 9, 11, 13, and 15. Make the hats on beats 1–4 (steps 1, 5, 9, 13) at least 75/127, while the hats between those beats stay at 60/127 or lower.",
        recognition:
          "Listen only to the hats for one loop. Can you hear a repeating strong–soft contour instead of eight identical ticks?",
        terms: [
          { term: "Accent pattern", definition: "A repeating arrangement of stronger and weaker notes over an otherwise regular rhythm." },
          { term: "Dynamic contour", definition: "The rise and fall of note strength over time." },
        ],
        workspace: "groove-feel",
        checksLabel: "Phrase the hi-hats",
        successLabel: "The hats now have a repeating strong–soft contour",
      }),
      evaluate: ({ A, grooveFeelSettings }) => {
        const hat = grooveFeelSettings.velocities.hat;
        const strong = [0, 4, 8, 12];
        const weak = [2, 6, 10, 14];

        return [
          {
            label: "All eight eighth-note hats are present",
            complete: [...strong, ...weak].every((step) => A.hat[step]),
          },
          {
            label: "Beat hats are at least 75/127",
            complete: strong.every((step) => hat[step] >= 75 / 127),
          },
          {
            label: "Between-beat hats are 60/127 or softer",
            complete: weak.every((step) => hat[step] <= 60 / 127),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.groove-feel.c",
        letter: "C",
        title: "Add a ghost note",
        learn: "Use a very quiet extra snare hit to add motion without creating another backbeat.",
        explanation:
          "A ghost note is deliberately much quieter than the main notes around it. Drummers use ghost strokes between accents to create texture and forward motion. In programmed drums, the distinction comes from both placement and low velocity.",
        instruction:
          "Select SNARE. Keep the main backbeats on steps 5 and 13. Add at least one extra snare away from those steps and lower its velocity to 45/127 or less. Keep both main backbeats at 80/127 or more.",
        recognition:
          "Close your eyes and ask whether the extra snare reads as another backbeat. If it does, make it quieter until it becomes part of the motion.",
        terms: [
          { term: "Ghost note", definition: "A deliberately quiet note used for texture and rhythmic motion rather than as a main accent." },
          { term: "Backbeat", definition: "The strong snare or clap emphasis commonly placed on beats 2 and 4 in 4/4 music." },
        ],
        workspace: "groove-feel",
        checksLabel: "Hide motion under the backbeat",
        successLabel: "A quiet ghost stroke now adds movement without stealing the backbeat",
      }),
      evaluate: ({ A, grooveFeelSettings }) => {
        const snare = grooveFeelSettings.velocities.snare;
        const ghostSteps = A.snare
          .map((active, step) => ({ active, step }))
          .filter(({ active, step }) => active && step !== 4 && step !== 12);

        return [
          {
            label: "Main backbeats remain on steps 5 and 13",
            complete: A.snare[4] && A.snare[12],
          },
          {
            label: "Main backbeats are at least 80/127",
            complete: snare[4] >= 80 / 127 && snare[12] >= 80 / 127,
          },
          {
            label: "At least one extra snare is a quiet ghost note",
            complete: ghostSteps.some(({ step }) => snare[step] <= 45 / 127),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.groove-feel.d",
        letter: "D",
        title: "Swing the subdivision",
        learn: "Change timing feel without moving the visible MIDI notes away from the grid.",
        explanation:
          "Swing delays alternating subdivisions so equal eighth notes are heard as a long–short pair. Many DAWs and drum machines provide a global swing or groove amount. Small changes can alter feel dramatically even though the note positions still look quantized.",
        instruction:
          "Keep at least six hi-hat notes active and set SWING between 15% and 35%. Compare 0% with your swung value while the pattern loops. Return to a value where you clearly hear the long–short feel without it becoming exaggerated.",
        recognition:
          "Switch between straight and swung timing. Where does your head or foot start moving differently even though the step lights stay in the same places?",
        terms: [
          { term: "Swing", definition: "Unequal timing between alternating subdivisions, commonly creating a long–short rhythmic feel." },
          { term: "Straight", definition: "Evenly spaced subdivisions with no swing offset." },
          { term: "Groove", definition: "The combined timing, accents, dynamics, and repetition that create a characteristic rhythmic feel." },
          { term: "Quantized", definition: "Aligned to a timing grid in a sequencer or DAW." },
        ],
        workspace: "groove-feel",
        checksLabel: "Change the timing feel",
        successLabel: "The same grid now has an audible swung feel",
      }),
      evaluate: ({ A, grooveFeelSettings, experiments }) => [
        {
          label: "You compared straight and swung timing",
          complete:
            (experiments["groove.swing"]?.min ?? Infinity) <= 0.02 &&
            (experiments["groove.swing"]?.max ?? 0) >= 0.15,
        },
        {
          label: "At least six hi-hat notes define the subdivision",
          complete: A.hat.filter(Boolean).length >= 6,
        },
        {
          label: "Swing is between 15% and 35%",
          complete:
            grooveFeelSettings.swing >= 0.15 &&
            grooveFeelSettings.swing <= 0.35,
        },
        {
          label: "The pattern contains real velocity contrast",
          complete:
            Math.max(...grooveFeelSettings.velocities.hat) -
              Math.min(...grooveFeelSettings.velocities.hat) >=
            0.12,
        },
      ],
    },
  ],
};
