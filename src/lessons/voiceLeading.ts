import { harmonicVoiceLeadingDistance } from "../music/harmony";
import { type ChordInversion } from "../music/model";
import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function comparedInversions(
  experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"],
  values: string[],
): boolean {
  return [0, 1, 2, 3].some((slot) => {
    const tried = experiments["voicing.slot." + slot]?.values ?? [];
    return values.every((value) => tried.includes(value));
  });
}

const lesson = lessonContentSchema.parse({
  id: "harmony.voice-leading",
  number: 11,
  title: "Voicing & voice leading",
  eyebrow: "Composition · Harmony",
  hero: "Make one chord grow into the next instead of jumping there.",
  description:
    "Keep the same chord progression but rearrange the notes inside each triad. Learn root position, first and second inversion, then use those inversions to reduce unnecessary movement between chords.",
  overview:
    "The chord symbol does not tell you where its notes have to sit. Reorder the same notes and the bass line changes, common tones can stay in place, and the progression can move with much less effort.",
});

export const voiceLeadingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.voice-leading.a",
        letter: "A",
        title: "Hear root position",
        learn: "Establish the reference sound: every triad with its root as the lowest note.",
        explanation:
          "A root-position triad places the chord root at the bottom, with the third and fifth above it. This is the clearest way to hear chord identity, but moving every chord in root position can make the parts jump farther than necessary.",
        instruction:
          "Set all four chords to Root. Play the progression and listen to the bass of each chord as well as the overall amount of vertical movement.",
        recognition:
          "The lowest note should match each chord name. Root-position progressions often sound solid but can jump noticeably between registers.",
        terms: [
          { term: "Voicing", definition: "The specific vertical arrangement and register of the notes inside a chord." },
          { term: "Root position", definition: "A chord voicing with the root as its lowest note." },
          { term: "Voice", definition: "One individual note-line inside a chord texture, followed from chord to chord." },
        ],
        workspace: "voicing",
        checksLabel: "Set the reference voicing",
        successLabel: "You now have a root-position baseline to compare against",
      }),
      evaluate: ({ harmonicProgression, voicingSettings, experiments }) => [
        { label: "You listened to the root-position baseline", complete: heardPlayback(experiments) },
        {
          label: "All four chord slots contain harmony",
          complete: harmonicProgression.filter(Boolean).length === 4,
        },
        {
          label: "All four chords are in root position",
          complete: voicingSettings.inversions.every((value) => value === 0),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.voice-leading.b",
        letter: "B",
        title: "Use first inversion",
        learn: "Put the third in the bass and hear how the same chord changes shape without changing identity.",
        explanation:
          "First inversion keeps the same three chord tones but places the third at the bottom. Composers use it to create smoother bass motion, change emphasis, and avoid every chord sounding like a new block dropped into place.",
        instruction:
          "Put at least one of the middle two chords into 1st inversion. Audition root position and 1st inversion back-to-back and listen especially to the lowest note.",
        recognition:
          "The chord quality stays recognisable, but its lowest note changes. The transition into or out of the inverted chord may require less movement.",
        terms: [
          { term: "First inversion", definition: "A triad with its third as the lowest note." },
          { term: "Chord bass", definition: "The lowest sounding note of a chord voicing; it is not always the chord root." },
        ],
        workspace: "voicing",
        checksLabel: "Invert one chord",
        successLabel: "You changed the bass note without changing the chord itself",
      }),
      evaluate: ({ voicingSettings, experiments }) => [
        { label: "You compared Root and 1st inversion on the same chord", complete: comparedInversions(experiments, ["0", "1"]) },
        { label: "You listened to the changed bass note", complete: heardPlayback(experiments) },
        {
          label: "At least one chord uses first inversion",
          complete: voicingSettings.inversions.includes(1),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.voice-leading.c",
        letter: "C",
        title: "Use second inversion",
        learn: "Put the fifth in the bass and compare its stability and movement with the other two positions.",
        explanation:
          "Second inversion places the fifth at the bottom. It can be useful for smooth bass lines, passing motion, pedal textures, or specific cadential effects. Its musical function depends on context rather than the inversion label alone.",
        instruction:
          "On one middle chord, audition Root, 1st, and 2nd inversion back-to-back while the loop plays. Then settle the progression with at least one 1st inversion and a different chord in 2nd inversion.",
        recognition:
          "Compare the three bass-note choices on the same chord. Which one makes the smallest move from the chord before it?",
        terms: [
          { term: "Second inversion", definition: "A triad with its fifth as the lowest note." },
          { term: "Passing inversion", definition: "An inversion used to connect surrounding harmonies with smoother stepwise motion." },
        ],
        workspace: "voicing",
        checksLabel: "Use both inversion types",
        successLabel: "The progression now contains root, first, and second-inversion shapes",
      }),
      evaluate: ({ voicingSettings, experiments }) => [
        { label: "You auditioned all three inversion positions on one chord", complete: comparedInversions(experiments, ["0", "1", "2"]) },
        { label: "You listened before choosing the final voicings", complete: heardPlayback(experiments) },
        {
          label: "A first inversion remains in the progression",
          complete: voicingSettings.inversions.includes(1),
        },
        {
          label: "At least one different chord uses second inversion",
          complete: voicingSettings.inversions.includes(2),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.voice-leading.d",
        letter: "D",
        title: "Minimise voice movement",
        learn: "Choose inversions because of where each note wants to go next.",
        explanation:
          "Voice leading treats the notes inside chords as horizontal lines. Smooth voice leading often keeps common tones still and moves the other voices by small intervals. This can make a progression sound connected even when the chord symbols are unchanged.",
        instruction:
          "Use the Total voice movement meter as feedback. Try at least four inversion changes across the four chords, including at least two non-root positions, and keep adjusting until the movement is substantially below the all-root baseline.",
        recognition:
          "Follow one note through the progression. How many voices can stay put or move by a step instead of making a large jump?",
        terms: [
          { term: "Voice leading", definition: "The way individual notes move from one chord to the next." },
          { term: "Common tone", definition: "A pitch shared by adjacent chords that can remain in the same voice." },
          { term: "Stepwise motion", definition: "Movement by a small interval, usually a semitone or whole tone." },
        ],
        workspace: "voicing",
        checksLabel: "Connect the voices",
        successLabel: "The same harmony now moves with less unnecessary distance",
      }),
      evaluate: ({ harmonicProgression, tonalContext, voicingSettings, experiments }) => {
        const inversions = voicingSettings.inversions as ChordInversion[];
        const current = harmonicVoiceLeadingDistance(harmonicProgression, tonalContext, inversions);
        const baseline = harmonicVoiceLeadingDistance(harmonicProgression, tonalContext, [0, 0, 0, 0]);
        const explored = [0, 1, 2, 3].reduce(
          (total, slot) => total + (experiments["voicing.slot." + slot]?.changes ?? 0),
          0,
        );
        return [
          { label: "You listened while reducing voice movement", complete: heardPlayback(experiments) },
          {
            label: "You tried at least four inversion changes while searching",
            complete: explored >= 4,
          },
          {
            label: "At least two chords use inversions",
            complete: inversions.filter((value) => value !== 0).length >= 2,
          },
          {
            label: "Voice movement is lower than the all-root baseline",
            complete: baseline > 0 && current < baseline,
          },
          {
            label: "Movement is substantially reduced",
            complete: baseline > 0 && current <= Math.max(12, baseline * 0.65),
          },
        ];
      },
    },
  ],
};
