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
  id: "levine.comping",
  number: 21,
  title: "Comping",
  eyebrow: "Jazz Piano · Chapter 21",
  hero: "Support the soloist from inside the rhythm section: place chords deliberately, leave space, alter harmony carefully and keep your register out of the soloist's way.",
  description:
    "Practice behind-, on- and ahead-of-the-beat placement, sparse accompaniment, contextual harmonic colour, root choice with a bassist, and a repeated bossa-nova comping pattern.",
  overview:
    "Comping is accompaniment, not a parallel solo. The central skill is judgment: listen first, choose when to play, decide how dense the harmony should be, and let rhythm, register and harmonic colour respond to the person you are supporting.",
});

export const levineCompingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.comping.a",
        letter: "A",
        title: "Move the chord from late to centered to early",
        learn:
          "Hear how a half-beat delay can drag while a centered attack feels firmer and an anticipation creates extra forward energy.",
        explanation:
          "Comping rhythm changes the feel even when the voicing stays identical. A chord that lands on the and after the beat can feel laid back, but repeating that habit on every change makes the time sag. Playing on the beat restores the center. Anticipating the next beat by an eighth note creates more propulsion.\n\nNone of these placements is forbidden. The point is to hear the difference and choose it rather than falling into one timing habit.",
        instruction:
          "Study the timing map. Clear the grid. Write C6 as C4-E4-G4-A4 on step 2, one eighth after the start of bar 1. Write the same voicing on step 9, exactly at the start of bar 2. Then write it on step 16, the final eighth of bar 2, so it anticipates bar 3. Leave the rest empty and play the loop.",
        recognition:
          "Can you hear the first attack as late, the second as centered and the third as pulling into the next bar?",
        takeaway:
          "Comping placement changes feel even when the chord does not: late relaxes, centered firms up, anticipation pushes forward.",
        hint:
          "Tap a steady beat and keep the voicing identical. Move only its attack relative to the beat so your ear is comparing timing, not harmony.",
        source: {
          reference: "Chapter Twenty-One - Figures 21-1 through 21-4",
          focus:
            "The opening examples compare chords played a half beat behind, directly on, and a half beat ahead of the harmonic change.",
          exampleIds: ["l21.timing"],
        },
        terms: [
          {
            term: "Behind the beat",
            definition:
              "Placing an accompaniment attack slightly after the expected beat while the underlying pulse stays steady.",
          },
          {
            term: "Anticipation",
            definition:
              "Playing the next harmony just before its nominal beat to create forward energy.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare three time placements",
        successLabel: "You heard timing itself reshape the energy of an unchanged voicing",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the three timing placements",
          complete: studiedSource(experiments, "l21.timing"),
        },
        {
          label: "Late, centered and anticipated attacks are written",
          complete: exactStudy(harmonySequence, [
            [1,[60,64,67,69]],
            [8,[60,64,67,69]],
            [15,[60,64,67,69]],
          ]),
        },
        {
          label: "You entered all three voicings",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the timing contrast",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.comping.b",
        letter: "B",
        title: "Make room for the soloist",
        learn:
          "Compare a bar crowded with four chord attacks to a bar with only two well-placed responses.",
        explanation:
          "The accompanist can play many notes or very few. Density only becomes a problem when it competes with the soloist. A useful default is to listen for openings and answer them rather than filling every beat.\n\nThis exercise exaggerates the difference. The busy bar is not automatically wrong, but the sparse bar makes it easier to hear how silence becomes part of the accompaniment.",
        instruction:
          "Study the space-and-response map. Clear the grid. Use the same short melody twice: C5-D5-E5-G5 on steps 1, 3, 5 and 7 of bar 1, then again on steps 17, 19, 21 and 23 of bar 3. In bar 1 crowd every melody attack with E3-G3-B3-D4 underneath it. In bar 3 leave the melody alone and answer it with that chord only on steps 20 and 24. Play the loop and compare how clearly the melody speaks.",
        recognition:
          "Which version lets the melody read more clearly - the chords on every note, or the two answers placed after parts of the phrase?",
        takeaway:
          "Good comping is a conversation: silence and well-placed responses can support a solo more than constant chord attacks.",
        hint:
          "Follow the melody instead of the chords. Let one short phrase finish, then place your response in the gap rather than directly on every melody note.",
        source: {
          reference: "Chapter Twenty-One - opening discussion, Figure 21-6 and ensemble advice",
          focus:
            "Comping should stimulate and support the soloist while staying out of the way; short attacks and deliberate gaps can create useful space.",
          exampleIds: ["l21.space-response"],
        },
        terms: [
          {
            term: "Comping density",
            definition:
              "How frequently and how fully accompaniment chords occupy the available rhythmic space.",
          },
          {
            term: "Response",
            definition:
              "An accompaniment gesture placed as an answer to, rather than on top of, the soloist's phrase.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare busy and sparse accompaniment",
        successLabel: "You used silence as part of the comping texture",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the space-and-response principle",
          complete: studiedSource(experiments, "l21.space-response"),
        },
        {
          label: "The busy and sparse versions are written",
          complete: exactStudy(harmonySequence, [
            [0,[52,55,59,62,72]],[2,[52,55,59,62,74]],[4,[52,55,59,62,76]],[6,[52,55,59,62,79]],
            [16,[72]],[18,[74]],[19,[52,55,59,62]],[20,[76]],[22,[79]],[23,[52,55,59,62]],
          ]),
        },
        {
          label: "You entered the melody and both density levels",
          complete: changedControl(experiments, "harmony.note-edit", 32),
        },
        {
          label: "You listened to the added space",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.comping.c",
        letter: "C",
        title: "Alter harmony, then listen for collisions",
        learn:
          "Compare a plain major colour with Lydian colour, and a dominant with its tritone substitute.",
        explanation:
          "Comping invites reharmonization, but alterations are guidelines rather than automatic replacements. Major tonic harmony can often accept a raised fourth. Dominant harmony can often accept a tritone substitute. Both choices may still clash with the soloist's actual note.\n\nThe test is musical: make the alteration, hear its colour, and be ready to simplify or move on if it conflicts with the line above it.",
        instruction:
          "Study the alteration guidelines. Clear the grid. In bar 1 write E3-G3-B3-D4 with melody G4. In bar 2 change G3 to F-sharp3 for Lydian colour but put melody F4 above it so you can hear the semitone collision. In bar 3 write F3-A3-B3-E4 for G9 with melody D5. In bar 4 use the D-flat7 substitute F3-A-flat3-B3-E-flat4 under that same D5. Play all four and decide where the altered comping helps and where the melody makes it too exposed.",
        recognition:
          "Can you hear both altered choices as plausible colours while also hearing why a melody note could force you back to the simpler version?",
        takeaway:
          "An alteration is only useful if it supports the melody; theoretical permission does not override an audible collision.",
        hint:
          "Hold the melody note in your ear and A/B the plain and altered voicing underneath it. If the clash dominates the line, simplify the comping.",
        source: {
          reference: "Chapter Twenty-One - alteration guidelines and Figures 21-5 through 21-6",
          focus:
            "The chapter offers context-sensitive guidelines for Lydian colour, altered dominants and tritone substitution, while warning that the soloist may make any alteration inappropriate.",
          exampleIds: ["l21.alterations"],
        },
        terms: [
          {
            term: "Comping alteration",
            definition:
              "A reharmonized or extended chord colour chosen by the accompanist while the underlying form remains recognizable.",
          },
          {
            term: "Collision",
            definition:
              "An unwanted clash between the accompanist's altered note and the soloist's simultaneous pitch.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare two conservative and two altered colours",
        successLabel: "You treated harmonic alteration as a listening decision rather than a fixed rule",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the alteration guidelines",
          complete: studiedSource(experiments, "l21.alterations"),
        },
        {
          label: "The four harmonic colours are written",
          complete: exactStudy(harmonySequence, [
            [0,[52,55,59,62,67]],
            [8,[52,54,59,62,65]],
            [16,[53,57,59,64,74]],
            [24,[53,56,59,63,74]],
          ]),
        },
        {
          label: "You entered all four voicings with melody context",
          complete: changedControl(experiments, "harmony.note-edit", 20),
        },
        {
          label: "You listened for colour and possible friction",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.comping.d",
        letter: "D",
        title: "Compare roots with rootless comping",
        learn:
          "Hear how low roots strengthen self-contained harmony but rootless shapes leave more space for a bassist.",
        explanation:
          "There is no universal ban on roots when comping with a bass player. Many pianists avoid them much of the time, while others use them freely. The real question is whether the piano and bass are supporting or crowding one another.\n\nCompare rooted and rootless versions of the same Dm9 and G9 colours. The only conceptual change should be whether the low fundamental is present; the remaining chord tones stay available in the middle register for a fair register comparison.",
        instruction:
          "Study the roots-and-register map. Clear the grid. Write rooted Dm9 as D3-F3-A3-C4-E4 in bar 1, then remove only D3 for the rootless version F3-A3-C4-E4 in bar 2. Write rooted G9 as G2-F3-A3-B3-E4 in bar 3, then remove only G2 for F3-A3-B3-E4 in bar 4. Play the loop and focus on what changes when the fundamental disappears.",
        recognition:
          "Can you hear why the rooted shapes may be useful alone but can occupy space a bassist might already be filling?",
        takeaway:
          "Roots in comping are a register and ensemble choice, not a universal rule; rootless shapes often make more room for a bassist.",
        hint:
          "Compare the same function with and without the low root. Imagine a bass instrument already occupying that register and notice which version leaves more space.",
        source: {
          reference: "Chapter Twenty-One - root-position discussion, register advice and bass-solo guidance",
          focus:
            "Root use with a bassist is presented as a stylistic choice rather than a prohibition, with strong attention to register and to staying clear of the soloist.",
          exampleIds: ["l21.roots-register"],
        },
        terms: [
          {
            term: "Rootless comping",
            definition:
              "Accompaniment voicings that omit the chord root because another instrument or the harmonic context can supply it.",
          },
          {
            term: "Register",
            definition:
              "The pitch region occupied by a musical part, which affects whether accompaniment supports or masks other instruments.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare rooted and rootless left-hand weight",
        successLabel: "You heard root choice as an ensemble-spacing decision",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied root and register choices",
          complete: studiedSource(experiments, "l21.roots-register"),
        },
        {
          label: "Rooted and rootless minor and dominant shapes are written",
          complete: exactStudy(harmonySequence, [
            [0,[50,53,57,60,64]],
            [8,[53,57,60,64]],
            [16,[43,53,57,59,64]],
            [24,[53,57,59,64]],
          ]),
        },
        {
          label: "You entered both rooted and rootless comparisons",
          complete: changedControl(experiments, "harmony.note-edit", 18),
        },
        {
          label: "You listened to the low-register contrast",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.comping.e",
        letter: "E",
        title: "Keep a bossa pattern while the harmony changes",
        learn:
          "Hold one two-bar rhythmic identity steady, then transpose its voicing without rewriting the groove.",
        explanation:
          "Bossa-nova piano accompaniment is less rigid than salsa, but it still depends on a recognizable repeated rhythmic pattern. A two-bar cell can be practiced over many chords until the pulse is automatic.\n\nThe specific study below is an application pattern rather than a fixed formula. Its purpose is to separate two jobs: keep the rhythm stable and change only the pitches needed by the harmony.",
        instruction:
          "Study the bossa-comping map. Clear the grid. With E3-G3-B3-D4, attack on steps 1, 4, 7, 9, 12 and 15 across bars 1-2. Repeat exactly those relative attack positions in bars 3-4 with F3-A3-C4-E4. Play the four-bar loop without adding extra attacks.",
        recognition:
          "Can you keep the rhythmic cell unchanged while your ear follows the harmonic change?",
        takeaway:
          "A bossa comping pattern can keep one rhythmic identity while the chord voicing changes underneath it.",
        hint:
          "Clap the two-bar rhythm without pitches first. Once it is steady, transpose only the voicing and leave every attack in the same place.",
        source: {
          reference: "Chapter Twenty-One - Bossa nova section and Figures 21-7 through 21-13",
          focus:
            "Bossa comping uses repeated one- or two-bar patterns with more freedom than salsa; practice the rhythm over many chords, then vary it only when the musical phrase calls for change.",
          exampleIds: ["l21.bossa"],
        },
        terms: [
          {
            term: "Bossa comping",
            definition:
              "A repeated piano accompaniment pattern shaped by Brazilian rhythmic practice and coordinated with the rhythm section.",
          },
          {
            term: "Rhythmic identity",
            definition:
              "The recognizable attack pattern that remains stable even while chord tones change.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Repeat one two-bar pattern over two harmonies",
        successLabel: "You separated harmonic change from rhythmic change",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the bossa-comping principle",
          complete: studiedSource(experiments, "l21.bossa"),
        },
        {
          label: "The repeated two-bar attack pattern is written",
          complete: exactStudy(harmonySequence, [
            [0,[52,55,59,62]],[3,[52,55,59,62]],[6,[52,55,59,62]],
            [8,[52,55,59,62]],[11,[52,55,59,62]],[14,[52,55,59,62]],
            [16,[53,57,60,64]],[19,[53,57,60,64]],[22,[53,57,60,64]],
            [24,[53,57,60,64]],[27,[53,57,60,64]],[30,[53,57,60,64]],
          ]),
        },
        {
          label: "You entered both repeated patterns",
          complete: changedControl(experiments, "harmony.note-edit", 48),
        },
        {
          label: "You listened for one continuous rhythmic identity",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
