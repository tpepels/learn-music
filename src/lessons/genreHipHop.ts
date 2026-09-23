import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function soundingBass(sequence: Array<number | null>) {
  return sequence
    .map((midi, step) => ({ midi, step }))
    .filter((event): event is { midi: number; step: number } => event.midi !== null);
}

function activeLayers(bar: {
  drums: boolean;
  bass: boolean;
  chords: boolean;
  melody: boolean;
}) {
  return Number(bar.drums) + Number(bar.bass) + Number(bar.chords) + Number(bar.melody);
}

const lesson = lessonContentSchema.parse({
  id: "genre.hip-hop",
  number: 30,
  title: "Hip-hop: pocket, weight & space",
  eyebrow: "Genre lens · Hip-hop",
  hero: "Make the beat feel intentional by deciding where not to play.",
  description:
    "Explore broad hip-hop tendencies through pocket, velocity, sparse low end, and arrangement space. The point is not to imitate one era or subgenre, but to hear how placement and absence can give a beat weight.",
  overview:
    "Hip-hop covers radically different production traditions. These exercises focus on transferable ideas—backbeat, syncopated kick placement, dynamic feel, and space between events—rather than treating one drum pattern as the genre.",
});

export const genreHipHopLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "genre.hip-hop.a",
        letter: "A",
        title: "Break the four-on-the-floor habit",
        learn: "Keep a strong backbeat while making the kick pattern less symmetrical.",
        explanation:
          "A backbeat can remain stable while the kick creates the pocket around it. Removing the automatic kick on every quarter note makes each remaining hit carry more rhythmic meaning.",
        instruction:
          "Set the tempo between 72 and 104 BPM. Keep snares on steps 5 and 13. Use 3–6 kick hits total, include at least one kick away from the four quarter-note positions, and do not keep kicks on all four quarter-note beats. Keep at least six hats so the subdivisions stay audible.",
        recognition:
          "Where does the groove lean forward or hang back once the kick is no longer marking every beat?",
        terms: [
          { term: "Pocket", definition: "The felt placement and relationship of rhythmic parts that makes a groove sit comfortably in time." },
          { term: "Backbeat", definition: "The strong snare or clap emphasis on beats 2 and 4 in 4/4." },
          { term: "Syncopated kick", definition: "A kick pattern that places important hits away from only the main quarter-note beats." },
        ],
        workspace: "groove-feel",
        checksLabel: "Build a beat with space",
        successLabel: "The kick now shapes a pocket around the backbeat",
      }),
      evaluate: ({ bpm, A }) => {
        const kicks = A.kick
          .map((active, step) => ({ active, step }))
          .filter(({ active }) => active);
        return [
          {
            label: "Tempo is between 72 and 104 BPM",
            complete: bpm >= 72 && bpm <= 104,
          },
          {
            label: "Snare keeps beats 2 and 4",
            complete: A.snare[4] && A.snare[12],
          },
          {
            label: "Kick uses 3–6 hits",
            complete: kicks.length >= 3 && kicks.length <= 6,
          },
          {
            label: "At least one kick is syncopated",
            complete: kicks.some(({ step }) => step % 4 !== 0),
          },
          {
            label: "The kick is not four-on-the-floor",
            complete: ![0, 4, 8, 12].every((step) => A.kick[step]),
          },
          {
            label: "At least six hats keep the subdivision audible",
            complete: A.hat.filter(Boolean).length >= 6,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.hip-hop.b",
        letter: "B",
        title: "Turn equal hits into a pocket",
        learn: "Use dynamics and a little timing feel to stop the grid from sounding mechanically flat.",
        explanation:
          "The same note positions can feel very different when important hits are stronger and supporting hits are quieter. Swing can add another layer of asymmetry, but it is only useful when the beat benefits from it.",
        instruction:
          "Keep the beat from A. Make the main snares clearly stronger than the hats. Add one quiet extra snare away from beats 2 and 4. Give the hats at least a 30% velocity range. Set swing somewhere between 5% and 25%, then compare it briefly with 0% before choosing the amount you prefer.",
        recognition:
          "If you remove the velocity differences, what disappears first: bounce, depth, or simply loudness?",
        terms: [
          { term: "Ghost note", definition: "A deliberately quiet rhythmic note that supports motion without becoming a main accent." },
          { term: "Velocity contrast", definition: "Differences in MIDI note strength used to shape accents and background notes." },
          { term: "Swing", definition: "Unequal timing between alternating subdivisions." },
        ],
        workspace: "groove-feel",
        checksLabel: "Shape the feel",
        successLabel: "The same grid now has a more deliberate dynamic pocket",
      }),
      evaluate: ({ A, grooveFeelSettings, experiments }) => {
        const snare = grooveFeelSettings.velocities.snare;
        const hats = A.hat
          .map((active, step) => active ? grooveFeelSettings.velocities.hat[step] : null)
          .filter((value): value is number => value !== null);
        const ghost = A.snare
          .map((active, step) => ({ active, step }))
          .filter(({ active, step }) => active && step !== 4 && step !== 12);

        return [
          {
            label: "Main snares are stronger than the average hat",
            complete:
              hats.length > 0 &&
              snare[4] > hats.reduce((sum, value) => sum + value, 0) / hats.length &&
              snare[12] > hats.reduce((sum, value) => sum + value, 0) / hats.length,
          },
          {
            label: "A quiet ghost snare supports the groove",
            complete: ghost.some(({ step }) => snare[step] <= 0.4),
          },
          {
            label: "Hat velocities span at least 30%",
            complete:
              hats.length > 1 &&
              Math.max(...hats) - Math.min(...hats) >= 0.3,
          },
          {
            label: "You compared straight timing with swing",
            complete:
              (experiments["groove.swing"]?.min ?? Infinity) <= 0.02 &&
              (experiments["groove.swing"]?.max ?? 0) >= 0.05,
          },
          {
            label: "Final swing is between 5% and 25%",
            complete:
              grooveFeelSettings.swing >= 0.05 &&
              grooveFeelSettings.swing <= 0.25,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.hip-hop.c",
        letter: "C",
        title: "Make the bass leave holes",
        learn: "Use a small number of low notes as punctuation instead of filling every subdivision.",
        explanation:
          "Sparse bass can make a beat feel heavier because each low note arrives into clear space. A line does not need constant activity to feel connected to the drums.",
        instruction:
          "In the four-bar bass roll, use only 4–9 note attacks. Leave at least one offbeat bass note, use at least two pitches, and keep more than two thirds of the 32 eighth-note positions empty.",
        recognition:
          "Which rest makes the next bass note feel biggest? If every note feels equally important, remove one.",
        terms: [
          { term: "Negative space", definition: "Intentional silence or reduced activity that gives surrounding events more impact." },
          { term: "Punctuation", definition: "Using isolated musical events to mark or answer parts of a phrase." },
        ],
        workspace: "bass",
        checksLabel: "Use low-end space",
        successLabel: "The bass now gets weight from where it does not play",
      }),
      evaluate: ({ bassSequence }) => {
        const notes = soundingBass(bassSequence);
        return [
          {
            label: "Bass uses 4–9 attacks",
            complete: notes.length >= 4 && notes.length <= 9,
          },
          {
            label: "At least one attack is on an eighth-note offbeat",
            complete: notes.some(({ step }) => step % 2 === 1),
          },
          {
            label: "At least two bass pitches are used",
            complete: new Set(notes.map(({ midi }) => midi)).size >= 2,
          },
          {
            label: "More than two thirds of the grid remains empty",
            complete: bassSequence.filter((note) => note === null).length >= 22,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.hip-hop.d",
        letter: "D",
        title: "Let one section breathe",
        learn: "Create contrast by letting the beat carry a section with fewer harmonic layers.",
        explanation:
          "A sparse section can make the groove itself become the foreground. When harmony or melody returns later, it reads as an event rather than constant wallpaper.",
        instruction:
          "In Arrangement, make one bar contain drums and bass but no chords or melody. Elsewhere, make a bar contain at least three layers. Use at least three different layer combinations across the eight bars.",
        recognition:
          "When the harmony disappears, does the beat feel emptier or more focused? What does its return change?",
        terms: [
          { term: "Foreground", definition: "The musical element the listener perceives as most prominent at a moment." },
          { term: "Layer economy", definition: "Using only the parts needed for a section instead of keeping every layer active." },
        ],
        workspace: "arrangement",
        checksLabel: "Contrast beat and full texture",
        successLabel: "The arrangement now gives the beat a section of its own",
      }),
      evaluate: ({ arrangement }) => {
        const signatures = new Set(
          arrangement.map((bar) =>
            [bar.drums, bar.bass, bar.chords, bar.melody]
              .map((active) => active ? "1" : "0")
              .join(""),
          ),
        );
        return [
          {
            label: "A bar contains drums + bass without chords or melody",
            complete: arrangement.some(
              (bar) => bar.drums && bar.bass && !bar.chords && !bar.melody,
            ),
          },
          {
            label: "A fuller bar contains at least three layers",
            complete: arrangement.some((bar) => activeLayers(bar) >= 3),
          },
          {
            label: "The arrangement uses at least three layer combinations",
            complete: signatures.size >= 3,
          },
        ];
      },
    },
  ],
};
