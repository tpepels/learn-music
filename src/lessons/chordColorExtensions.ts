import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const pc = (midi: number) => ((midi % 12) + 12) % 12;

function hasPitchClasses(notes: number[], required: number[]) {
  const pcs = new Set(notes.map(pc));
  return required.every((pitchClass) => pcs.has(pitchClass));
}

function findStep(
  sequence: number[][],
  required: number[],
  start = 0,
): number {
  return sequence.findIndex(
    (notes, step) => step >= start && hasPitchClasses(notes, required),
  );
}

const lesson = lessonContentSchema.parse({
  id: "harmony.chord-colour",
  number: 30,
  title: "Chord colour & extensions",
  eyebrow: "Harmony · Voicing",
  hero: "Add colour without losing the chord underneath it.",
  description:
    "Build suspended chords, add9 voicings and ninth chords directly in the harmony roll, then use colour tones deliberately instead of treating every extra note as automatically richer.",
  overview:
    "Triads define a chord clearly, but additional notes can create suspension, openness or tension. The useful skill is hearing what each added tone does and whether the voicing still communicates the underlying harmony.",
});

export const chordColorExtensionsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chord-colour.a",
        letter: "A",
        title: "Suspend and resolve",
        learn: "Hear suspension as a temporary replacement, not just a four-note chord.",
        explanation:
          "Csus4 replaces E with F, producing C–F–G. Resolving F down to E restores C major. The movement is the point: suspension creates a small tension that becomes meaningful when it resolves.",
        instruction:
          "In the harmony roll place C4–F4–G4 together on one step, then within the next two eighth-note steps place C4–E4–G4 together. Play the transition several times.",
        recognition:
          "Focus on F moving to E. Does the second chord feel more settled even though only one pitch changed?",
        terms: [
          { term: "Suspension", definition: "A non-chord or replacement tone that delays a more stable chord tone." },
          { term: "sus4", definition: "A chord in which the third is replaced by the fourth." },
          { term: "Resolution", definition: "The movement of a tense or unstable tone toward a more stable one." },
        ],
        workspace: "harmony-song",
        checksLabel: "Create the resolution",
        successLabel: "You made chord colour audible as motion",
      }),
      evaluate: ({ harmonySequence, experiments }) => {
        const sus = findStep(harmonySequence, [0, 5, 7]);
        const resolved =
          sus >= 0
            ? harmonySequence
                .slice(sus + 1, sus + 3)
                .some((notes) => hasPitchClasses(notes, [0, 4, 7]))
            : false;
        return [
          { label: "A Csus4 voicing appears", complete: sus >= 0 },
          { label: "It resolves to C major within two steps", complete: resolved },
          { label: "You listened to the resolution", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chord-colour.b",
        letter: "B",
        title: "Add the ninth without replacing the triad",
        learn: "Hear the difference between an added colour tone and a suspension.",
        explanation:
          "Cadd9 keeps C, E and G and adds D. Because the third remains, the major quality stays explicit while D adds openness above the triad.",
        instruction:
          "Place C, E, G and D together on one harmony step. Try D in more than one octave if the grid allows it, then keep the version where the chord sounds open rather than crowded.",
        recognition:
          "Compare C major and Cadd9. Can you still hear C major clearly underneath the added D?",
        terms: [
          { term: "add9", definition: "A triad with the ninth added while retaining the third and without requiring a seventh." },
          { term: "Colour tone", definition: "An additional pitch used to alter the character of a chord without obscuring its basic function." },
          { term: "Voicing", definition: "The register and spacing chosen for the notes of a chord." },
        ],
        workspace: "harmony-song",
        checksLabel: "Add the colour",
        successLabel: "You built an add9 chord from the notes themselves",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "A Cadd9 voicing contains C, D, E and G",
          complete: findStep(harmonySequence, [0, 2, 4, 7]) >= 0,
        },
        { label: "You listened to the added ninth", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chord-colour.c",
        letter: "C",
        title: "Stack a major ninth chord",
        learn: "Hear how seventh and ninth extensions accumulate harmonic information.",
        explanation:
          "Cmaj9 contains the C-major triad plus B, the major seventh, and D, the ninth. Five-note chords can sound spacious or congested depending on register and spacing.",
        instruction:
          "Build a voicing containing C, E, G, B and D on one harmony step. Then move at least one upper note by an octave and compare the two spacings before settling on one.",
        recognition:
          "Which spacing lets you hear the colour tones without turning the middle register into a cluster?",
        terms: [
          { term: "Major seventh", definition: "A note eleven semitones above the root; B above C." },
          { term: "Ninth", definition: "The scale degree a compound second above the root; D above C." },
          { term: "Extension", definition: "A chord tone beyond the basic triad, commonly the seventh, ninth, eleventh or thirteenth." },
        ],
        workspace: "harmony-song",
        checksLabel: "Build the extension",
        successLabel: "You constructed a five-note extended chord",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "A Cmaj9 voicing contains C, D, E, G and B",
          complete: findStep(harmonySequence, [0, 2, 4, 7, 11]) >= 0,
        },
        { label: "You listened to the extended voicing", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chord-colour.d",
        letter: "D",
        title: "Use colour selectively",
        learn: "Make extension a compositional decision rather than a default setting.",
        explanation:
          "If every chord is maximally extended, colour stops creating contrast. A useful arrangement often mixes simple and richer voicings so one harmonic moment can open up more than another.",
        instruction:
          "Write at least four harmony events across the phrase. Make at least two events extended voicings with four or more different pitch classes, include one five-note voicing, and keep at least one event to a plain triad of three pitch classes.",
        recognition:
          "Which chord deserves the richest voicing? If every event attracts equal attention, simplify one.",
        terms: [
          { term: "Harmonic density", definition: "The amount of pitch information sounding within a harmonic event." },
          { term: "Contrast", definition: "A perceptible difference between musical events or sections." },
          { term: "Selective extension", definition: "Using additional chord tones only where their colour serves the musical role." },
        ],
        workspace: "harmony-song",
        checksLabel: "Shape harmonic density",
        successLabel: "Your phrase now uses simple and extended harmony for contrast",
      }),
      evaluate: ({ harmonySequence, experiments }) => {
        const active = harmonySequence.filter((notes) => notes.length > 0);
        const pcCounts = active.map((notes) => new Set(notes.map(pc)).size);
        return [
          { label: "At least four harmony events are written", complete: active.length >= 4 },
          { label: "At least two events use four or more pitch classes", complete: pcCounts.filter((count) => count >= 4).length >= 2 },
          { label: "At least one event is a five-note colour chord", complete: pcCounts.some((count) => count >= 5) },
          { label: "At least one event remains a plain triad", complete: pcCounts.some((count) => count === 3) },
          { label: "You listened to the contrast", complete: heardPlayback(experiments) },
        ];
      },
    },
  ],
};
