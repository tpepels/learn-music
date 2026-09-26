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
  id: "levine.stride-bud-powell",
  number: 17,
  title: "Stride and Bud Powell voicings",
  eyebrow: "Jazz Piano · Chapter 17",
  hero: "Separate bass and chord attacks for stride, then strip the left hand down to skeletal bebop voicings that leave the right hand free.",
  description:
    "Practice root-chord-fifth-chord stride, walking tenths, extra harmony inside a bar, and low two-note Bud Powell-style shells.",
  overview:
    "The chapter places two very different left-hand traditions side by side. Stride creates a self-contained rhythmic accompaniment by alternating bass notes and chords. Bud Powell voicings do almost the opposite: they reduce the left hand to a sparse harmonic skeleton so the right hand has maximum melodic range.",
});

export const levineStrideBudPowellLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.stride-bud-powell.a",
        letter: "A",
        title: "Build the stride pulse",
        learn:
          "Alternate a low bass note with a mid-register chord on every beat: root, chord, fifth, chord.",
        explanation:
          "Stride turns the left hand into both bass player and accompanist. On beats one and three, play a single low note - usually the root or fifth. On beats two and four, jump upward to a triad or seventh-chord voicing. The wide leap is part of the sound.\n\nThe first practice goal is rhythmic independence, not speed. Keep the bass short enough that it does not blur into the chord, and practice without relying on the sustain pedal to hide the jump.",
        instruction:
          "Study the stride pattern. Clear the grid. Write four one-bar stride patterns: C with C2 / E3-G3-C4 / G2 / E3-G3-C4; A7 with A2 / G3-C-sharp4-E4 / E2 / G3-C-sharp4-E4; D7 with D2 / C3-F-sharp3-A3 / A2 / C3-F-sharp3-A3; G7 with G2 / F3-B3-D4 / D2 / F3-B3-D4. Put the events on beats 1-4 of each bar and play the full loop.",
        recognition:
          "Can you hear a clear low-high-low-high pulse without the bass notes smearing into the chords?",
        source: {
          reference: "Chapter Seventeen - Figures 17-1 through 17-3",
          focus:
            "Stride alternates root or fifth bass notes on beats one and three with chords on beats two and four, later using richer left-hand voicings.",
          exampleIds: ["l17.stride-pulse"],
        },
        terms: [
          {
            term: "Stride",
            definition:
              "A left-hand piano style that alternates low bass notes with higher chord attacks to provide both rhythm and harmony.",
          },
          {
            term: "Bass-chord alternation",
            definition:
              "The low-high left-hand motion that places bass on strong beats and chord voicings between them.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build four bars of stride",
        successLabel: "You created the low-high stride pulse across a complete progression",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the stride pulse",
          complete: studiedSource(experiments, "l17.stride-pulse"),
        },
        {
          label: "The four stride bars are written",
          complete: exactStudy(harmonySequence, [
            [0,[36]],[2,[52,55,60]],[4,[43]],[6,[52,55,60]],
            [8,[45]],[10,[55,61,64]],[12,[40]],[14,[55,61,64]],
            [16,[38]],[18,[48,54,57]],[20,[45]],[22,[48,54,57]],
            [24,[43]],[26,[53,59,62]],[28,[38]],[30,[53,59,62]],
          ]),
        },
        {
          label: "You entered the bass and chord attacks",
          complete: changedControl(experiments, "harmony.note-edit", 32),
        },
        {
          label: "You listened to the complete stride loop",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.stride-bud-powell.b",
        letter: "B",
        title: "Walk tenths through a chromatic bass line",
        learn:
          "Pair each bass note with a third an octave higher so the outer voices form a chain of tenths.",
        explanation:
          "Walking tenths replace the large bass-to-chord jump with two voices moving together. The left hand outlines a bass line while the upper note sits roughly a tenth above it. The ear can follow both the bass contour and the top voice as one contrapuntal gesture.\n\nThe hand does not need to hold every interval literally if the span is uncomfortable. Arpeggiate or release notes as needed. The musical point is the two-voice contour, not physical strain.",
        instruction:
          "Study the walking-tenths idea. Clear the grid. On steps 1-4 write C2-E3, D2-F3, D-sharp2-F-sharp3, and E2-G3. Repeat the same four pairs on steps 9-12 one octave higher as a complete two-voice line if comfortable. Play slowly and listen to the chromatic E-F-F-sharp-G top line against the rising bass.",
        recognition:
          "Can you hear the two outer voices as a connected line rather than four isolated intervals?",
        source: {
          reference: "Chapter Seventeen - Figures 17-4 through 17-6",
          focus:
            "Walking tenths create moving two-voice left-hand lines; the examples analyze the outer-note patterns and allow practical arpeggiation when the hand cannot span the interval.",
          exampleIds: ["l17.walking-tenths"],
        },
        terms: [
          {
            term: "Walking tenths",
            definition:
              "A stride-related left-hand device in which a moving bass is paired with an upper note around a tenth above it.",
          },
          {
            term: "Outer voices",
            definition:
              "The lowest and highest notes of a voicing or texture, whose contours are often easiest to hear.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write the walking-tenths line",
        successLabel: "You heard the bass and upper tenth move as two connected voices",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied walking tenths",
          complete: studiedSource(experiments, "l17.walking-tenths"),
        },
        {
          label: "The four chromatic tenths are written",
          complete: exactStudy(harmonySequence, [
            [0,[36,52]],[1,[38,53]],[2,[39,54]],[3,[40,55]],
            [8,[48,64]],[9,[50,65]],[10,[51,66]],[11,[52,67]],
          ]),
        },
        {
          label: "You entered both versions of the line",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the two-voice contour",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.stride-bud-powell.c",
        letter: "C",
        title: "Add harmony inside a single tonic bar",
        learn:
          "Turn a static C-major bar into motion by inserting Dm7 and G7 on later beats.",
        explanation:
          "Stride does not have to repeat the same chord four times. A tonic bar can contain extra harmonic motion on beats three and four. A common way to enrich C major is to insert its II-V - D minor seventh followed by G7 - before the next bar.\n\nThis keeps the left-hand rhythm unchanged while making the harmony more active. The accompaniment still sounds like stride because the bass-chord alternation remains clear.",
        instruction:
          "Study the within-bar harmony options. Clear the grid. In bar 1 write C2 on beat 1, E3-G3-C4 on beat 2, G2 on beat 3, and E3-G3-C4 on beat 4. In bar 2 keep C2 and the C chord on beats 1-2, then write D3-F3-A3-C4 on beat 3 and G2-F3-B3-D4 on beat 4. Leave bars 3-4 empty and play the comparison.",
        recognition:
          "Does the second bar feel more mobile even though its four-beat stride framework is unchanged?",
        source: {
          reference: "Chapter Seventeen - Figure 17-7",
          focus:
            "A tonic bar can gain harmonic interest by inserting II, V, or both on later beats while keeping the stride texture intact.",
          exampleIds: ["l17.within-bar-harmony"],
        },
        terms: [
          {
            term: "Harmonic insertion",
            definition:
              "Adding a short chord or progression inside a bar without changing the larger destination.",
          },
          {
            term: "II-V",
            definition:
              "A minor-seventh chord on scale degree two followed by the dominant seventh on scale degree five.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare static and enriched tonic bars",
        successLabel: "You added harmonic motion without changing the stride pulse",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied within-bar harmonic motion",
          complete: studiedSource(experiments, "l17.within-bar-harmony"),
        },
        {
          label: "The static and enriched bars are written",
          complete: exactStudy(harmonySequence, [
            [0,[36]],[2,[52,55,60]],[4,[43]],[6,[52,55,60]],
            [8,[36]],[10,[52,55,60]],[12,[50,53,57,60]],[14,[43,53,59,62]],
          ]),
        },
        {
          label: "You entered both accompaniment versions",
          complete: changedControl(experiments, "harmony.note-edit", 20),
        },
        {
          label: "You listened to the added harmonic motion",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.stride-bud-powell.d",
        letter: "D",
        title: "Strip the left hand down to Bud Powell shells",
        learn:
          "Compare low two-note shells with a denser modern rootless voicing and hear how much right-hand space the skeletal version creates.",
        explanation:
          "Bud Powell-style left-hand voicings are deliberately sparse. They often contain only two notes - sometimes three - and emphasize roots, thirds or tenths, sixths and sevenths. Their lower register keeps the harmonic skeleton audible without occupying the middle of the keyboard.\n\nThat space matters because the right hand can then roam across a much wider melodic range. The trade-off is that the left hand sounds more exposed and less lush than later four-note rootless systems.",
        instruction:
          "Study the skeletal voicing idea. Clear the grid. Write G2-F3 for Gm7 in bar 1, C3-B-flat3 for C7 in bar 2, and F2-A3 for F major in bar 3. In bar 4 write the denser rootless F-major colour E3-G3-A3-D4. Play the loop and compare how much mid-register space each approach occupies.",
        recognition:
          "Can you hear the first three chords as harmonically sufficient even though each uses only two left-hand notes?",
        source: {
          reference: "Chapter Seventeen - Bud Powell voicings discussion and Figures 17-16 through 17-24",
          focus:
            "Bud Powell voicings are low, skeletal two- or three-note structures built mainly from roots, thirds or tenths, sixths and sevenths, leaving wide melodic space for the right hand.",
          exampleIds: ["l17.bud-powell-shells"],
        },
        terms: [
          {
            term: "Bud Powell voicing",
            definition:
              "A sparse bebop-era left-hand voicing, usually two or three notes, that outlines the harmony while leaving the middle and upper keyboard open.",
          },
          {
            term: "Skeletal voicing",
            definition:
              "A deliberately reduced chord shape containing only the tones needed to imply its harmonic function.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare skeletal and dense left-hand harmony",
        successLabel: "You heard how sparse low shells create more room for the right hand",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied Bud Powell-style shells",
          complete: studiedSource(experiments, "l17.bud-powell-shells"),
        },
        {
          label: "Three skeletal shells and one dense comparison are written",
          complete: exactStudy(harmonySequence, [
            [0,[43,53]],[8,[48,58]],[16,[41,57]],[24,[52,55,57,62]],
          ]),
        },
        {
          label: "You entered all four left-hand shapes",
          complete: changedControl(experiments, "harmony.note-edit", 10),
        },
        {
          label: "You listened to the register contrast",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
