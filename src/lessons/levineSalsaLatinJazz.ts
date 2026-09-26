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
  id: "levine.salsa-latin-jazz",
  number: 20,
  title: "Salsa and Latin jazz",
  eyebrow: "Jazz Piano · Chapter 20",
  hero: "Lock harmony to clave: hear the two-bar rhythmic framework first, then place montuno, bass tumbao and solo figures inside it.",
  description:
    "Practice forward and reverse son clave, offbeat montuno rhythm, stable repeated montunos over changing harmony, bass-tumbao coordination and rhythm-first soloing.",
  overview:
    "The defining lesson is rhythmic discipline. A salsa texture is an interlocking system: clave, montuno, bass and percussion each occupy their own pattern. The pianist's job is not to fill every space but to establish a repeated groove and stay inside it until the music actually calls for a change.",
});

export const levineSalsaLatinJazzLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.salsa-latin-jazz.a",
        letter: "A",
        title: "Hear 3-2 and 2-3 son clave",
        learn:
          "Tap the five clave attacks in forward order, then reverse the two bars without changing the internal rhythm.",
        explanation:
          "Son clave is a two-bar five-note framework. In forward, or 3-2, clave the three-side comes first: beat 1, the and of 2, and beat 4. The second bar answers on beats 2 and 3. Reverse, or 2-3, clave simply swaps those bars.\n\nUse one piano note as a neutral rhythm marker. The pitch is unimportant here; the spacing of the attacks is the lesson.",
        instruction:
          "Study the clave map. Clear the grid. For 3-2 clave, put C4 on steps 1, 4 and 7 of bar 1, then on beats 2 and 3 of bar 2. In bars 3-4 write the reverse 2-3 order: beats 2 and 3 first, then beat 1, the and of 2, and beat 4. Play all four bars and count the two-bar cycle aloud.",
        recognition:
          "Can you feel that 3-2 and 2-3 contain the same two rhythmic halves in opposite order?",
        source: {
          reference: "Chapter Twenty - Figures 20-3 through 20-6",
          focus:
            "Son clave is a strict two-bar rhythmic framework with forward 3-2 and reverse 2-3 forms; the rumba clave delays the final attack of the three-side by a half beat.",
          exampleIds: ["l20.clave"],
        },
        terms: [
          {
            term: "Clave",
            definition:
              "A two-bar rhythmic framework whose attack pattern organizes the interlocking parts of Afro-Cuban and salsa music.",
          },
          {
            term: "3-2 / 2-3",
            definition:
              "Names for the order of the three-attack and two-attack bars of son clave.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write both son-clave directions",
        successLabel: "You heard the same five attacks with the two bars reversed",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied forward and reverse clave",
          complete: studiedSource(experiments, "l20.clave"),
        },
        {
          label: "Both two-bar clave patterns are written",
          complete: exactStudy(harmonySequence, [
            [0,[60]],[3,[60]],[6,[60]],[10,[60]],[12,[60]],
            [18,[60]],[20,[60]],[24,[60]],[27,[60]],[30,[60]],
          ]),
        },
        {
          label: "You entered all ten clave attacks",
          complete: changedControl(experiments, "harmony.note-edit", 10),
        },
        {
          label: "You listened through both clave directions",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.salsa-latin-jazz.b",
        letter: "B",
        title: "Build an offbeat montuno",
        learn:
          "Establish a two-bar repeated chord pattern whose first attacks define the groove and whose later attacks stay mostly off the beat.",
        explanation:
          "A montuno is an ostinato-like piano figure. It may last two, four or more bars, but once established it usually repeats until a new section arrives. The repetition is not a limitation - it is the groove.\n\nA common reverse-clave pattern begins clearly, then places most later attacks on the ands. Ties and sustained notes can carry the figure across bar lines, so the listener feels a continuous rhythmic cycle instead of eight isolated quarter notes.",
        instruction:
          "Study the montuno rhythm. Clear the grid. Use the C-major dyad E4-G4 as a neutral harmonic cell. In bars 1-2 place it on steps 1, 3, 4, 6, 8, 10, 12, 14 and 16. Repeat the identical two-bar rhythm in bars 3-4, transposing the dyad to F4-A4. Play the loop without adding extra attacks.",
        recognition:
          "Can you keep the repeated offbeat pattern steady when the pitches change underneath it?",
        source: {
          reference: "Chapter Twenty - Figures 20-11 through 20-20",
          focus:
            "Montunos are repeated ostinato-like piano figures, often two bars long, with characteristic offbeat placement and ties that must stay aligned with the chosen clave direction.",
          exampleIds: ["l20.montuno"],
        },
        terms: [
          {
            term: "Montuno",
            definition:
              "A repeated piano ostinato used as a rhythmic-harmonic engine in salsa and related Afro-Cuban styles.",
          },
          {
            term: "Offbeat",
            definition:
              "A rhythmic position between the numbered beats, commonly counted as an 'and'.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Repeat the montuno without changing its rhythm",
        successLabel: "You kept the groove stable while transposing the harmonic cell",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied montuno construction",
          complete: studiedSource(experiments, "l20.montuno"),
        },
        {
          label: "The repeated two-bar montuno rhythm is written",
          complete: exactStudy(harmonySequence, [
            [0,[64,67]],[2,[64,67]],[3,[64,67]],[5,[64,67]],[7,[64,67]],
            [9,[64,67]],[11,[64,67]],[13,[64,67]],[15,[64,67]],
            [16,[65,69]],[18,[65,69]],[19,[65,69]],[21,[65,69]],[23,[65,69]],
            [25,[65,69]],[27,[65,69]],[29,[65,69]],[31,[65,69]],
          ]),
        },
        {
          label: "You entered both repeated montuno cycles",
          complete: changedControl(experiments, "harmony.note-edit", 36),
        },
        {
          label: "You listened without changing the groove",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.salsa-latin-jazz.c",
        letter: "C",
        title: "Keep one montuno shape through changing harmony",
        learn:
          "Use the same rhythmic cell over minor-sixth, minor-seventh, dominant and I-V harmony instead of inventing a new rhythm for each chord.",
        explanation:
          "Montuno rhythm can stay stable while the chord quality changes. The chapter applies the same basic rhythmic pattern to minor-sixth, minor-seventh and dominant-seventh harmony, then carries it through simple progressions such as I-V.\n\nThis is a useful discipline: harmony may move, but changing the accompaniment pattern every bar destroys the pocket. Keep the rhythmic identity first and alter only the notes required by the chord.",
        instruction:
          "Study the harmony-within-groove examples. Clear the grid. On steps 1, 4, 6 and 8 of each bar write these four-note cells: bar 1 C minor-sixth C4-E-flat4-G4-A4; bar 2 C minor-seventh C4-E-flat4-G4-B-flat4; bar 3 C7 C4-E4-G4-B-flat4; bar 4 G7 B3-D4-F4-G4. Keep the attack positions identical in every bar.",
        recognition:
          "Can you hear four different harmonic colours while the rhythmic identity remains unchanged?",
        source: {
          reference: "Chapter Twenty - Figures 20-15 through 20-25",
          focus:
            "The same montuno rhythm is applied to several chord qualities and simple progressions; once a montuno begins, groove and repetition take priority over constant variation.",
          exampleIds: ["l20.harmonic-montunos"],
        },
        terms: [
          {
            term: "Pocket",
            definition:
              "The stable rhythmic placement that makes a repeated groove feel settled and danceable.",
          },
          {
            term: "Harmonic variation",
            definition:
              "Changing the chord tones while preserving the rhythmic pattern of the accompaniment.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Hold the rhythm through four harmonic colours",
        successLabel: "You changed harmony without disturbing the montuno pattern",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied montunos over changing harmony",
          complete: studiedSource(experiments, "l20.harmonic-montunos"),
        },
        {
          label: "The four harmonies use one attack pattern",
          complete: exactStudy(harmonySequence, [
            [0,[60,63,67,69]],[3,[60,63,67,69]],[5,[60,63,67,69]],[7,[60,63,67,69]],
            [8,[60,63,67,70]],[11,[60,63,67,70]],[13,[60,63,67,70]],[15,[60,63,67,70]],
            [16,[60,64,67,70]],[19,[60,64,67,70]],[21,[60,64,67,70]],[23,[60,64,67,70]],
            [24,[59,62,65,67]],[27,[59,62,65,67]],[29,[59,62,65,67]],[31,[59,62,65,67]],
          ]),
        },
        {
          label: "You entered all four harmonic versions",
          complete: changedControl(experiments, "harmony.note-edit", 64),
        },
        {
          label: "You listened for the unchanging rhythmic pocket",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.salsa-latin-jazz.d",
        letter: "D",
        title: "Lock montuno and tumbao together",
        learn:
          "Coordinate a repeated right-hand pattern with a bass line that emphasizes the and of two and beat four.",
        explanation:
          "In a salsa rhythm section, piano and bass do not duplicate each other continuously. Each part has its own pattern and the parts interlock. The bass pattern is called a tumbao and commonly gives strong weight to beat four.\n\nA useful coordination exercise is to line up the hands at selected points - especially the and of two - while allowing the remaining notes to fall in different places. The result should feel like two gears meshing, not one hand shadowing the other.",
        instruction:
          "Study the piano-and-bass lock. Clear the grid. In each bar put the right-hand dyad E4-G4 on steps 1, 4, 6 and 8. Add C2 to the same event on step 4 and G2 to the event on step 7. Repeat the pattern for four bars, changing the bar-3/4 bass root to F2 and C3 while keeping the right-hand rhythm identical.",
        recognition:
          "Can you feel the hands coincide at selected points while the rest of the pattern remains interlocked rather than doubled?",
        source: {
          reference: "Chapter Twenty - Figures 20-26 through 20-30",
          focus:
            "The bass tumbao and piano montuno are complementary rhythm-section parts; practicing them together develops the ability to lock with the bass player while preserving each pattern's separate role.",
          exampleIds: ["l20.tumbao-lock"],
        },
        terms: [
          {
            term: "Tumbao",
            definition:
              "A repeating Afro-Cuban bass pattern that interlocks with clave and montuno rather than simply marking every beat.",
          },
          {
            term: "Interlocking",
            definition:
              "Two rhythmic parts fitting together so their attacks complement rather than duplicate one another.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Coordinate right-hand montuno and left-hand bass",
        successLabel: "You kept two separate rhythmic roles locked into one groove",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied montuno-tumbao coordination",
          complete: studiedSource(experiments, "l20.tumbao-lock"),
        },
        {
          label: "The four-bar interlocking pattern is written",
          complete: exactStudy(harmonySequence, [
            [0,[64,67]],[3,[36,64,67]],[5,[64,67]],[6,[43]],[7,[64,67]],
            [8,[64,67]],[11,[36,64,67]],[13,[64,67]],[14,[43]],[15,[64,67]],
            [16,[64,67]],[19,[41,64,67]],[21,[64,67]],[22,[48]],[23,[64,67]],
            [24,[64,67]],[27,[41,64,67]],[29,[64,67]],[30,[48]],[31,[64,67]],
          ]),
        },
        {
          label: "You entered the two-hand rhythm section",
          complete: changedControl(experiments, "harmony.note-edit", 40),
        },
        {
          label: "You listened for the interlocking accents",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.salsa-latin-jazz.e",
        letter: "E",
        title: "Make the solo rhythm larger than the melody",
        learn:
          "Use octaves and chord punches on a C7 field instead of filling the bar with a continuous single-note bebop line.",
        explanation:
          "In a dense salsa rhythm section, a delicate single-note line can disappear. The chapter recommends a more rhythmic solo vocabulary: octaves, large chords, repeated figures and clear rests.\n\nThe point is not simply to play louder. A strong attack pattern leaves space for percussion and bass while giving the piano enough weight to be heard as part of the groove.",
        instruction:
          "Study the rhythm-first solo idea. Clear the grid. In bar 1 write C4-C5 octaves on steps 1 and 4, then E4-G4-B-flat4-C5 as a chord on step 7. In bar 2 write D4-D5 octaves on steps 2 and 6, then E4-G4-B-flat4-D5 on step 8. Repeat those two bars once and play the four-bar phrase.",
        recognition:
          "Does the phrase feel stronger because of the attack pattern and rests rather than because it contains more notes?",
        source: {
          reference: "Chapter Twenty - Figures 20-31 and 20-32",
          focus:
            "Salsa piano solos are described as rhythm-first, using octaves, large chords and repeated figures so the piano remains clear inside a dense rhythm section.",
          exampleIds: ["l20.rhythmic-soloing"],
        },
        terms: [
          {
            term: "Rhythm-first soloing",
            definition:
              "Improvising in a way that gives attack placement, repetition and space at least as much importance as melodic density.",
          },
          {
            term: "Chord punch",
            definition:
              "A short, emphatic chord attack used as a rhythmic event.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build a spacious octave-and-chord phrase",
        successLabel: "You made rhythmic shape carry the solo instead of continuous note density",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied rhythm-first salsa soloing",
          complete: studiedSource(experiments, "l20.rhythmic-soloing"),
        },
        {
          label: "The four-bar octave-and-chord phrase is written",
          complete: exactStudy(harmonySequence, [
            [0,[60,72]],[3,[60,72]],[6,[64,67,70,72]],
            [9,[62,74]],[13,[62,74]],[15,[64,67,70,74]],
            [16,[60,72]],[19,[60,72]],[22,[64,67,70,72]],
            [25,[62,74]],[29,[62,74]],[31,[64,67,70,74]],
          ]),
        },
        {
          label: "You entered the complete rhythmic solo phrase",
          complete: changedControl(experiments, "harmony.note-edit", 32),
        },
        {
          label: "You listened to the rests and larger attacks",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
