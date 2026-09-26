import { changedControl, heardPlayback, studiedSource } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function sameNotes(actual: number[] | undefined, expected: number[]): boolean {
  if (!actual || actual.length !== expected.length) return false;
  const left = [...actual].sort((a, b) => a - b);
  const right = [...expected].sort((a, b) => a - b);
  return left.every((note, index) => note === right[index]);
}

function exactStudy(
  sequence: LessonContext["harmonySequence"],
  entries: Array<[number, number[]]>,
): boolean {
  const expectedSteps = new Set(entries.map(([step]) => step));
  return (
    entries.every(([step, notes]) => sameNotes(sequence[step], notes)) &&
    sequence.every((notes, step) => notes.length === 0 || expectedSteps.has(step))
  );
}

const lesson = lessonContentSchema.parse({
  id: "levine.practice-practice-practice",
  number: 23,
  title: "Practice, practice, practice",
  eyebrow: "Jazz Piano · Chapter 23",
  hero: "Turn the course into a practice system: transpose everything, identify weak spots, combine skills, apply them inside tunes, vary learned phrases and train your ear away from the page.",
  description:
    "Practice in multiple keys, target weaknesses, coordinate simultaneous tasks, put techniques into progressions, transform motifs rather than reciting them, and use listening and ear work as daily practice.",
  overview:
    "Efficient practice is specific. Work slowly enough to stay in control, make hard keys and weak techniques visible, combine skills only after each part works alone, and move every exercise into musical context. Patterns and licks are useful as an inner library, but they should support spontaneous playing rather than replace it.",
});

export const levinePracticePracticePracticeLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.practice-practice-practice.a",
        letter: "A",
        title: "Move the same II-V-I into another key",
        learn:
          "Play one rootless II-V-I in C, then transpose the same voice-leading logic into F.",
        explanation:
          "Practicing every idea in every key is more useful than memorizing one keyboard shape. The chord function and voice-leading rule should survive the transposition even though every note moves.\n\nA good long-term routine rotates a tune or voicing through unfamiliar keys, then keeps the best alternate key in the repertoire rather than treating transposition as an isolated drill.",
        instruction:
          "Study the all-keys practice strategy. Clear the grid. In bars 1-2 write the C-major rootless II-V-I: F3-A3-C4-E4, then F3-A3-B3-E4, then E3-G3-A3-D4 on steps 1, 5 and 7. In bars 3-4 transpose the same logic to F major: B-flat3-D4-F4-A4, then B-flat3-D4-E4-A4, then A3-C4-D4-G4 on steps 17, 21 and 23. Play both keys.",
        recognition:
          "Can you hear the same functional motion even though none of the absolute pitches are the same?",
        source: {
          reference: "Chapter Twenty-Three - opening discussion and Practice everything in every key",
          focus:
            "The chapter recommends practicing voicings, licks, styles, patterns and tunes in every key, preferably inside real musical contexts rather than only as isolated technical drills.",
          exampleIds: ["l23.all-keys"],
        },
        terms: [
          {
            term: "All-keys practice",
            definition:
              "Systematically moving the same musical idea through different tonal centers until the rule is independent of one keyboard shape.",
          },
          {
            term: "Alternate key",
            definition:
              "A transposed key retained as a practical performance option after exploring a tune beyond its original key.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transpose one complete II-V-I rule",
        successLabel: "You preserved the voice-leading logic across two keys",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the all-keys practice strategy",
          complete: studiedSource(experiments, "l23.all-keys"),
        },
        {
          label: "Both rootless II-V-I progressions are written",
          complete: exactStudy(harmonySequence, [
            [0,[53,57,60,64]],[4,[53,57,59,64]],[6,[52,55,57,62]],
            [16,[58,62,65,69]],[20,[58,62,64,69]],[22,[57,60,62,67]],
          ]),
        },
        {
          label: "You entered all six voicings",
          complete: changedControl(experiments, "harmony.note-edit", 24),
        },
        {
          label: "You listened to both keys",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practice-practice-practice.b",
        letter: "B",
        title: "Spend the grid on your weakest key",
        learn:
          "Choose one key or voicing that slows you down and give the entire loop to that weakness instead of repeating what already feels easy.",
        explanation:
          "A weakness becomes useful practice material once you identify it precisely. If one key takes longer than the others, isolate that key. If one voicing inversion causes hesitation, repeat that inversion. Then recheck it later rather than spending equal time on every already-secure version.\n\nThis exercise is deliberately open. The completion check measures whether you built and heard a substantial study, not whether you chose the same weak key as someone else.",
        instruction:
          "Study the weakness-targeting method. Clear the grid. Choose a key, voicing or chord family that currently feels slow. Build at least three different shapes or positions from that one weak area, using at least 12 note entries in total. Spread them across the loop, play them, and revise anything that still makes you hesitate.",
        recognition:
          "After one focused pass, can you name exactly what still feels slow instead of merely saying the whole key is difficult?",
        source: {
          reference: "Chapter Twenty-Three - Practice to your weaknesses",
          focus:
            "The chapter recommends monitoring which keys or voicings cause trouble, timing or comparing them against easier versions, and spending limited practice time where the difference is greatest.",
          exampleIds: ["l23.weaknesses"],
        },
        terms: [
          {
            term: "Targeted practice",
            definition:
              "Allocating practice time to a clearly identified weakness instead of repeating material that is already secure.",
          },
          {
            term: "Diagnostic comparison",
            definition:
              "Comparing a difficult key or voicing with an easy one to identify exactly where fluency breaks down.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build a focused weakness study",
        successLabel: "You used the practice loop diagnostically rather than generically",
      }),
      evaluate: ({ experiments }) => [
        {
          label: "You studied the weakness-targeting method",
          complete: studiedSource(experiments, "l23.weaknesses"),
        },
        {
          label: "You entered enough material to test the weak area",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the complete diagnostic loop",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practice-practice-practice.c",
        letter: "C",
        title: "Practice two jobs at the same time",
        learn:
          "Keep a left-hand guide-tone shell steady while the right hand plays a four-note sequence through II-V-I.",
        explanation:
          "Coordination grows fastest when the component tasks are learned separately and then combined. A right-hand scale sequence, left-hand voicing pattern and harmonic progression can eventually be practiced together, but speed should only increase after the combined version is accurate.\n\nIf the coordination falls apart, slow down immediately. Accuracy is the route to speed, not the reward for forcing the tempo.",
        instruction:
          "Study the coordination routine. Clear the grid. On steps 1-4 hold the Dm7 shell F3-C4 under D4-F4-A4-B4 one melody note at a time. On steps 9-12 hold the G7 shell F3-B3 under G4-A4-B4-D5. On steps 17-20 hold the C-major shell E3-B3 under C5-D5-E5-G5. Play the whole three-stage sequence evenly.",
        recognition:
          "Can each hand keep its own role without the right-hand pattern disturbing the left-hand shell?",
        source: {
          reference: "Chapter Twenty-Three - Figures 23-1 through 23-3 and Practice more than one thing at the same time",
          focus:
            "The chapter combines right-hand sequences with left-hand voicings, stride and walking tenths, recommending that each element be learned separately before the combined exercise is practiced in all keys.",
          exampleIds: ["l23.coordination"],
        },
        terms: [
          {
            term: "Layered practice",
            definition:
              "Combining two or more already-learned skills so coordination becomes part of the practice task.",
          },
          {
            term: "Accuracy before speed",
            definition:
              "Keeping the tempo slow enough that coordination stays controlled, then allowing speed to develop from reliable motion.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Coordinate a shell and a moving line",
        successLabel: "You kept two simultaneous musical jobs independent and accurate",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the coordination routine",
          complete: studiedSource(experiments, "l23.coordination"),
        },
        {
          label: "The three shell-plus-line stages are written",
          complete: exactStudy(harmonySequence, [
            [0,[53,60,62]],[1,[53,60,65]],[2,[53,60,69]],[3,[53,60,71]],
            [8,[53,59,67]],[9,[53,59,69]],[10,[53,59,71]],[11,[53,59,74]],
            [16,[52,59,72]],[17,[52,59,74]],[18,[52,59,76]],[19,[52,59,79]],
          ]),
        },
        {
          label: "You entered all three coordinated stages",
          complete: changedControl(experiments, "harmony.note-edit", 36),
        },
        {
          label: "You listened at a controlled pace",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practice-practice-practice.d",
        letter: "D",
        title: "Put a voicing technique inside a progression",
        learn:
          "Carry one rootless voicing language through I-VI-II-V instead of practicing each chord as an isolated object.",
        explanation:
          "A voicing learned around the cycle is only partly learned. The next step is to put it into tunes or realistic progressions, where the previous and next chord determine which position is actually useful.\n\nThe four-bar I-VI-II-V loop below forces the shapes to function as a connected harmonic sentence. Listen for the transitions, not just the correctness of each individual chord.",
        instruction:
          "Study context-based practice. Clear the grid. Write E3-G3-B3-D4 for C major in bar 1, G3-C-sharp4-E4-A4 for A7 in bar 2, F3-A3-C4-E4 for Dm7 in bar 3, and F3-A3-B3-E4 for G7 in bar 4. Play the loop repeatedly and notice which transition feels least automatic.",
        recognition:
          "Can you hear the four voicings as one progression rather than four flash-card answers?",
        source: {
          reference: "Chapter Twenty-Three - Practice within the context of tunes and Figures 23-4 through 23-20",
          focus:
            "The chapter repeatedly places voicings, substitutions, scales, motifs and other techniques into tune contexts so they become usable musical vocabulary rather than isolated exercises.",
          exampleIds: ["l23.context"],
        },
        terms: [
          {
            term: "Context practice",
            definition:
              "Applying a technique inside a progression or tune so the surrounding harmony determines how it is actually used.",
          },
          {
            term: "Transition fluency",
            definition:
              "The ability to move into and out of a voicing smoothly, not merely find it from rest.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Turn four voicings into one harmonic sentence",
        successLabel: "You practiced the transitions instead of only the isolated shapes",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied context-based practice",
          complete: studiedSource(experiments, "l23.context"),
        },
        {
          label: "The complete I-VI-II-V loop is written",
          complete: exactStudy(harmonySequence, [
            [0,[52,55,59,62]],
            [8,[55,61,64,69]],
            [16,[53,57,60,64]],
            [24,[53,57,59,64]],
          ]),
        },
        {
          label: "You entered the four connected voicings",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the transitions",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practice-practice-practice.e",
        letter: "E",
        title: "Vary the lick before it becomes a script",
        learn:
          "Keep a recognizable four-note idea, then change its starting degree, contour and key.",
        explanation:
          "Patterns and licks can coordinate the fingers, ear and harmonic reflexes, but they should become an inner library rather than a memorized solo. A useful drill is to keep enough of the original idea that its identity survives while changing one feature at a time.\n\nStarting the phrase on a fifth, then on a ninth, or transposing it into another key trains flexibility without throwing away the original pattern.",
        instruction:
          "Study the phrase-variation method. Clear the grid. Write G4-A4-B4-E5 on steps 1-4. In bar 2 write D5-B4-A4-G4 on steps 9-12, beginning from the ninth instead. In bar 3 transpose the first contour to F major as C5-D5-E5-A5 on steps 17-20. In bar 4 write G5-E5-D5-C5 on steps 25-28. Play all four versions.",
        recognition:
          "Can you still hear one family of ideas even though starting note, direction and key keep changing?",
        source: {
          reference: "Chapter Twenty-Three - Figures 23-16 through 23-19 and lick-practice discussion",
          focus:
            "The chapter recommends practicing related phrases with altered starting degrees, rhythms and harmonic settings, while warning that learned licks should not replace the player's main musical ideas.",
          exampleIds: ["l23.phrase-variation"],
        },
        terms: [
          {
            term: "Inner library",
            definition:
              "Learned musical material available unconsciously as support for improvisation rather than recited as a fixed script.",
          },
          {
            term: "Phrase variation",
            definition:
              "Changing starting degree, contour, rhythm, harmony or key while preserving enough of a phrase to keep it recognizable.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Create four related phrase versions",
        successLabel: "You kept the motif recognizable without turning it into a fixed solo",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied phrase variation",
          complete: studiedSource(experiments, "l23.phrase-variation"),
        },
        {
          label: "All four related phrases are written",
          complete: exactStudy(harmonySequence, [
            [0,[67]],[1,[69]],[2,[71]],[3,[76]],
            [8,[74]],[9,[71]],[10,[69]],[11,[67]],
            [16,[72]],[17,[74]],[18,[76]],[19,[81]],
            [24,[79]],[25,[76]],[26,[74]],[27,[72]],
          ]),
        },
        {
          label: "You entered all four phrase variants",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened for family resemblance",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practice-practice-practice.f",
        letter: "F",
        title: "Transcribe a tiny phrase by ear",
        learn:
          "Use the grid as scratch paper for a four-note phrase you can already sing, then correct it by listening rather than by reading.",
        explanation:
          "Ear work starts with listening closely enough to sing the phrase. Then find the bass or tonal center, locate the notes one at a time, and keep moving instead of getting trapped on one uncertain chord or pitch. Repeated listening often solves what the first pass could not.\n\nYou do not need a long solo. A four-note fragment is enough to practice the process. If no recording is handy, sing a short phrase yourself first, then find those notes without looking at notation.",
        instruction:
          "Study the listen-and-transcribe method. Clear the grid. Choose a four-note phrase from a recording or sing one from memory. Enter at least four notes by ear, play them back, and make corrections until the grid matches what you can sing. Do not copy the notes from a score.",
        recognition:
          "Can you sing the phrase before touching the keyboard, and can you explain which note needed the most correction?",
        source: {
          reference: "Chapter Twenty-Three - Listen, listen, listen; Transcribing; Play along with records",
          focus:
            "The closing practice advice emphasizes live listening, learning tunes from recordings, finding melody and bass first, using repeated listening to solve uncertain harmony, and playing along with records.",
          exampleIds: ["l23.listen-transcribe"],
        },
        terms: [
          {
            term: "Ear-first practice",
            definition:
              "Hearing and singing musical material before locating it physically or naming it theoretically.",
          },
          {
            term: "Transcribe",
            definition:
              "Work out music from listening, identifying its pitches, rhythms and harmony without relying on a written score.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build and verify a phrase by ear",
        successLabel: "You used listening as the primary source of the notes",
      }),
      evaluate: ({ experiments }) => [
        {
          label: "You studied the listen-and-transcribe method",
          complete: studiedSource(experiments, "l23.listen-transcribe"),
        },
        {
          label: "You entered a phrase substantial enough to check",
          complete: changedControl(experiments, "harmony.note-edit", 4),
        },
        {
          label: "You played the phrase back and checked it",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
