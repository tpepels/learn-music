import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "harmony.seventh-chords",
  number: 27,
  title: "Seventh chords",
  eyebrow: "Composition · Harmony",
  hero: "A triad plus one note can change the whole texture.",
  description:
    "Add sevenths to diatonic triads, distinguish major-7, minor-7, dominant-7, and half-diminished colour, then build ii7–V7–Imaj7 and a I–vi–ii–V turnaround.",
  overview:
    "A seventh chord adds another stacked third above a triad. In C major this creates Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, and Bm7♭5. The seventh enriches colour and creates additional semitone or stepwise voice-leading between chords.",
});

export const seventhChordsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.a",
        letter: "A",
        title: "Turn I into Imaj7",
        learn: "Hear the colour added by the seventh above a major triad.",
        explanation:
          "C major is C-E-G. Cmaj7 adds B. That B sits a semitone below the root C, creating gentle internal tension even though the chord still has tonic function.",
        instruction:
          "Put Cmaj7 in bar 1 and Cmaj7 in bar 4. Audition Cmaj7 and compare its colour with the plain C-major triad you learned earlier.",
        recognition:
          "Cmaj7 should still sound like tonic, but softer, richer, or more suspended than the simpler C triad.",
        terms: [
          { term: "Seventh chord", definition: "A four-note chord formed by adding another third above a triad." },
          { term: "Major seventh", definition: "An interval of eleven semitones; in Cmaj7, B is a major seventh above C." },
          { term: "Imaj7", definition: "A major-seventh chord built on tonic in a major key." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Add the seventh",
        successLabel: "The tonic now has major-seventh colour",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "Bar 1 contains Cmaj7", complete: chordProgression[0] === "Cmaj7" },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.b",
        letter: "B",
        title: "Make V7 resolve to Imaj7",
        learn: "Hear why the dominant seventh intensifies a major-key cadence.",
        explanation:
          "G7 adds F to the G-B-D triad. In a G7→Cmaj7 resolution, B rises to C while F commonly falls to E. Those two half-step tendencies make the cadence especially clear.",
        instruction:
          "Set bar 2 to G7 and bar 3 to Cmaj7. Play through the middle of the progression and focus on G7→Cmaj7.",
        recognition:
          "G7 should sound more unstable than G major. Cmaj7 should release most of that tension while keeping its own gentle B-to-C colour.",
        terms: [
          { term: "Dominant seventh chord", definition: "A major triad plus a minor seventh; G7 is G-B-D-F." },
          { term: "Guide tones", definition: "Chord tones—especially thirds and sevenths—that strongly define a chord's quality and resolution." },
          { term: "Half-step voice leading", definition: "A voice moving by one semitone between chords." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Strengthen the cadence",
        successLabel: "G7 now resolves clearly into Cmaj7",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "G7 resolves directly to Cmaj7",
          complete:
            chordProgression[1] === "G7" &&
            chordProgression[2] === "Cmaj7",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.c",
        letter: "C",
        title: "Build ii7–V7–Imaj7",
        learn: "Extend the classic ii–V–I progression with seventh-chord voice leading.",
        explanation:
          "Dm7–G7–Cmaj7 keeps the same predominant–dominant–tonic functions as Dm–G–C, but the added sevenths create more shared notes and smoother inner movement.",
        instruction:
          "Set bars 1–3 to Dm7 → G7 → Cmaj7. Put Cmaj7 in bar 4 to let the resolution settle.",
        recognition:
          "The progression should feel strongly directed but less block-like than simple triads because several chord tones can move by step.",
        terms: [
          { term: "ii7–V7–Imaj7", definition: "A seventh-chord version of the predominant–dominant–tonic progression in major." },
          { term: "Common-tone voice leading", definition: "Keeping a shared pitch in the same voice while other notes move around it." },
          { term: "Inner voice", definition: "A note or melodic line between the highest and lowest voices of a chord texture." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Connect the seventh chords",
        successLabel: "The ii7–V7–Imaj7 cadence is complete",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression begins Dm7 → G7 → Cmaj7",
          complete:
            chordProgression[0] === "Dm7" &&
            chordProgression[1] === "G7" &&
            chordProgression[2] === "Cmaj7",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.seventh-chords.d",
        letter: "D",
        title: "Use a I–vi–ii–V turnaround",
        learn: "Build a progression designed to lead naturally back to its own beginning.",
        explanation:
          "Cmaj7–Am7–Dm7–G7 is a common I–vi–ii–V turnaround. The final dominant does not resolve inside the four bars; it points into Cmaj7 when the loop restarts.",
        instruction:
          "Set the four bars to Cmaj7 → Am7 → Dm7 → G7 and loop it.",
        recognition:
          "The final G7 should make the restart on Cmaj7 feel like a necessary continuation rather than an arbitrary repeat.",
        terms: [
          { term: "Turnaround", definition: "A progression near the end of a phrase that leads efficiently back to the beginning or tonic." },
          { term: "I–vi–ii–V", definition: "A common functional turnaround moving tonic → tonic substitute → predominant → dominant." },
          { term: "Tonic substitute", definition: "A chord sharing enough tonic-family notes or function to provide relative stability without being I itself." },
        ],
        workspace: "seventh-harmony",
        checksLabel: "Make the loop resolve on restart",
        successLabel: "You built a functional seventh-chord turnaround",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is Cmaj7 → Am7 → Dm7 → G7",
          complete:
            chordProgression[0] === "Cmaj7" &&
            chordProgression[1] === "Am7" &&
            chordProgression[2] === "Dm7" &&
            chordProgression[3] === "G7",
        },
      ],
    },
  ],
};
