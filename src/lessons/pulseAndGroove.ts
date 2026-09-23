import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const lesson = lessonContentSchema.parse({
  id: "rhythm.pulse-and-groove",
  number: 1,
  title: "Pulse & groove",
  eyebrow: "Rhythm · Production",
  hero: "Build a beat, then make it move.",
  description:
    "Start with a bare pulse. Add the backbeat and subdivision, then disturb the grid just enough to make the loop feel less mechanical.",
  overview:
    "A drum pattern is a set of relationships. The kick can make the main pulse obvious, the snare can answer it, and the hi-hat can expose the spaces between beats. Once that frame is clear, an offbeat hit has something to push against.",
});

export const pulseAndGrooveLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.a",
        letter: "A",
        title: "Four-on-the-floor",
        learn: "Feel where the four beats sit before adding detail.",
        explanation:
          "In 4/4, the bar is counted 1, 2, 3, 4. A kick on every beat gives you the simplest possible floor: nothing is hidden and nothing pulls against the count yet.",
        instruction:
          "Start playback. Put the kick on beats 1, 2, 3, and 4—steps 1, 5, 9, and 13 on this grid. Count aloud once with the loop.",
        recognition:
          "Listen for whether the count stays obvious even if you stop watching the playhead.",
        terms: [
          { term: "Beat", definition: "The regular pulse you count along with: 1, 2, 3, 4." },
          { term: "Bar", definition: "A repeating group of beats. In 4/4, one bar contains four beats." },
          { term: "4/4", definition: "A metre with four quarter-note beats per bar." },
          { term: "Four-on-the-floor", definition: "A kick drum on every beat of a 4/4 bar." },
        ],
        workspace: "drums",
        checksLabel: "Build",
        successLabel: "Four-on-the-floor is in place",
      }),
      evaluate: ({ A, experiments }) => [
        { label: "You listened to the pattern", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "Kick on beat 1", complete: A.kick[0] },
        { label: "Kick on beat 2", complete: A.kick[4] },
        { label: "Kick on beat 3", complete: A.kick[8] },
        { label: "Kick on beat 4", complete: A.kick[12] },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.b",
        letter: "B",
        title: "Add the backbeat",
        learn: "Hear how beats 2 and 4 change the body movement of the loop.",
        explanation:
          "A backbeat puts a strong snare or clap on beats 2 and 4. The kick keeps the floor underneath you; the snare gives the bar its answer and often becomes the place your hands want to clap.",
        instruction:
          "Keep the kick running. Add snare on beats 2 and 4, then briefly mute one of those snares and put it back. Hear what disappears from the groove.",
        recognition:
          "Focus on the difference between four equal kicks and the same pulse with a clear 2-and-4 response.",
        terms: [
          { term: "Backbeat", definition: "A strong accent, usually a snare or clap, on beats 2 and 4 in 4/4." },
          { term: "Accent", definition: "A note or beat that is made more prominent than the surrounding ones." },
        ],
        workspace: "drums",
        checksLabel: "Add",
        successLabel: "The backbeat is audible",
      }),
      evaluate: ({ A, experiments }) => [
        { label: "You listened to the backbeat in context", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "You added, removed, and restored the backbeat while listening", complete: (experiments["drums.A.snare.edit"]?.changes ?? 0) >= 4 },
        { label: "Four-on-the-floor remains intact", complete: [0, 4, 8, 12].every((step) => A.kick[step]) },
        { label: "Snare on beat 2", complete: A.snare[4] },
        { label: "Snare on beat 4", complete: A.snare[12] },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.c",
        letter: "C",
        title: "Subdivide with eighth notes",
        learn: "Hear the smaller pulse between the numbered beats.",
        explanation:
          "Split each beat in two and you get eighth notes: 1-and-2-and-3-and-4-and. A steady hi-hat can make that smaller pulse audible even when the kick and snare stay simple.",
        instruction:
          "While the loop plays, add hi-hats on every eighth-note position. Count 1-and-2-and-3-and-4-and and check that every syllable has a hat.",
        recognition:
          "Listen for the hats turning four large beats into eight evenly spaced points.",
        terms: [
          { term: "Subdivision", definition: "Dividing a beat into smaller equal rhythmic units." },
          { term: "Eighth note", definition: "Half of a quarter-note beat in 4/4; two eighth notes fit inside one beat." },
        ],
        workspace: "drums",
        checksLabel: "Subdivide",
        successLabel: "The eighth-note grid is clear",
      }),
      evaluate: ({ A, experiments }) => [
        { label: "You listened to the subdivision", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "You built the eighth-note hat line in this exercise", complete: (experiments["drums.A.hat.edit"]?.changes ?? 0) >= 8 },
        { label: "Backbeat remains on 2 and 4", complete: A.snare[4] && A.snare[12] },
        { label: "Eight evenly spaced hi-hats", complete: [0, 2, 4, 6, 8, 10, 12, 14].every((step) => A.hat[step]) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.d",
        letter: "D",
        title: "Create syncopation",
        learn: "Move one kick off the obvious grid and decide where it feels best.",
        explanation:
          "Syncopation works because the strong beats are already clear. An extra hit between them can pull the groove forward, make it stumble pleasantly, or simply clutter it. The position matters more than the label.",
        instruction:
          "Keep the loop running. Try an extra kick in at least three different offbeat positions. Remove the ones that feel clumsy and leave at least one position you would actually keep in the groove.",
        recognition:
          "Ignore the grid for a moment: which offbeat makes you lean into the next beat, and which one just sounds busy?",
        terms: [
          { term: "Offbeat", definition: "A rhythmic position between or away from the main counted beats." },
          { term: "Syncopation", definition: "Emphasis on a normally weak or unexpected rhythmic position." },
        ],
        workspace: "drums",
        checksLabel: "Explore",
        successLabel: "You created a syncopated groove",
      }),
      evaluate: ({ A, experiments }) => [
        { label: "You listened while trying the offbeats", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "You tried at least three kick edits before settling", complete: (experiments["drums.A.kick.edit"]?.changes ?? 0) >= 3 },
        { label: "Main four kicks remain", complete: [0, 4, 8, 12].every((step) => A.kick[step]) },
        { label: "Backbeat remains", complete: A.snare[4] && A.snare[12] },
        { label: "At least one offbeat kick is kept", complete: A.kick.some((active, step) => active && step % 4 !== 0) },
      ],
    },
  ],
};
