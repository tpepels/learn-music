import {
  SCHOENBERG_COMPLETION_IDS,
  studyCompletionHasCadence,
  studyCompletionHasDevelopment,
  studyCompletionHasLiquidation,
  studyCompletionHasSequence,
  studyCompletionSourceIntact,
} from "../music/study";
import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.completing-sentence",
  number: 5,
  title: "Completing the sentence",
  eyebrow: "Schoenberg · Chapter VIII · Completion of the Sentence",
  hero: "Carry an established beginning through development, shortening and liquidation until a cadence can genuinely end the sentence.",
  description:
    "Chapter VIII is much richer than a simple presentation-continuation formula. Schoenberg defines liquidation, relates it to shortening and cadence, develops sequence-like procedures, then uses Examples 52-61 to show how real sentences expand, overlap, interpolate repetitions, exchange voices and depart from the eight-measure practice form without losing musical logic.",
  overview:
    "A-D establish the core techniques. E-K then follow Schoenberg's actual Examples 52-61 in the order of his discussion. L rebuilds the sentence after those examples. Source maps reproduce Schoenberg's own labels and written analysis; PLAY / LAB studies underneath are separate application material.",
});

function visitedAll(values: string[], required: string[]): boolean {
  return required.every((value) => values.includes(value));
}

function editedContinuationSteps(values: string[]): number {
  return new Set(
    values
      .map((value) => Number(value.split(":")[0]))
      .filter((step) => Number.isFinite(step) && step >= 16 && step < 24),
  ).size;
}

function studiedSource(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimumSegments: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  const visited = new Set(
    values.filter((value) => value.startsWith(sourceId + ":")),
  );
  return visited.size >= minimumSegments;
}

function inspectedTwoNotations(
  experiments: LessonContext["experiments"],
): boolean {
  return (experiments["study.notation"]?.values.length ?? 0) >= 2;
}

export const schoenbergCompletingSentenceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.function,
        letter: "A",
        title: "Continuation changes the job of the material",
        learn:
          "Hear why the second half of a sentence must do more than repeat the already-established beginning.",
        explanation:
          "Schoenberg says the beginning of the sentence already includes repetition. The continuation therefore demands more remotely varied motive-forms. He treats the sentence as a higher construction that not only states an idea but immediately begins a kind of development.",
        instruction:
          "Read the Chapter VIII source map, then compare Keep repeating the opening, Developed continuation and New unrelated material. Choose the version that develops the established motive without replacing it.",
        recognition:
          "After the opening is established, does the music begin to work on it, merely repeat it, or abandon it?",
        source: {
          reference: "Chapter VIII - Completion of the Sentence",
          focus:
            "Schoenberg explicitly contrasts the already-repeated beginning with a continuation that requires more remotely varied motive-forms.",
          exampleIds: ["s05.chapter"],
        },
        terms: [
          {
            term: "Continuation",
            definition:
              "The part after the repeated beginning in which more remotely varied motive-forms develop the established material.",
          },
          {
            term: "Development",
            definition:
              "For Schoenberg, development includes growth and extension but also reduction, condensation and intensification.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the functional change",
        successLabel: "You distinguished continuation from repetition and replacement",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.function];
        const modes = experiments["study.completion-mode"]?.values ?? [];
        return [
          {
            label: "You compared repetition, continuation and foreign material",
            complete: visitedAll(modes, [
              "repeat-presentation",
              "developed-continuation",
              "foreign-continuation",
            ]),
          },
          { label: "You listened beyond the beginning", complete: heardPlayback(experiments) },
          {
            label: "You chose the developed continuation",
            complete:
              state?.decision === "related" &&
              state?.completionMode === "developed-continuation",
          },
          {
            label: "The continuation develops material from the source",
            complete: studyCompletionHasDevelopment(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.sequence,
        letter: "B",
        title: "Sequence a transformed or condensed pattern",
        learn:
          "Hear sequence-like procedure as directional continuation rather than static repetition.",
        explanation:
          "Schoenberg says sequence-like procedures are very useful in sentence continuations. The pattern is usually already a transformation or condensation of preceding motive-forms. With a correct harmonic connection it may begin on different scale degrees; quasi-sequential repetitions may also vary the interval or other features.",
        instruction:
          "Use the Chapter VIII map, then compare Repeat one fragment, Sequential treatment and New unrelated material. Follow steps 17-28 and choose the version in which one derived pattern moves through new pitch levels.",
        recognition:
          "Can you hear one pattern being carried forward rather than copied in place?",
        source: {
          reference: "Chapter VIII - Comment on Examples: sequence-like procedures",
          focus:
            "Schoenberg distinguishes strict sequence from freer quasi-sequential repetition and says the pattern normally derives from preceding motive-forms.",
          exampleIds: ["s05.chapter"],
        },
        terms: [
          {
            term: "Sequence-like procedure",
            definition:
              "Repetition of a derived pattern at changing pitch levels, with strict or freer preservation of its features.",
          },
          {
            term: "Condensation",
            definition:
              "Compression of motive content into a more concentrated form that can be developed further.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Recognise sequential treatment",
        successLabel: "You heard a derived pattern create forward motion",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.sequence];
        const modes = experiments["study.completion-mode"]?.values ?? [];
        return [
          {
            label: "You compared static, sequential and foreign continuations",
            complete: visitedAll(modes, [
              "static-fragment",
              "sequence",
              "foreign-continuation",
            ]),
          },
          { label: "You listened to the changing pitch levels", complete: heardPlayback(experiments) },
          {
            label: "You chose sequential treatment",
            complete:
              state?.decision === "related" &&
              state?.completionMode === "sequence",
          },
          {
            label: "The continuation contains a repeated interval pattern in sequence",
            complete: studyCompletionHasSequence(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.liquidation,
        letter: "C",
        title: "Liquidation removes the need to continue",
        learn:
          "Hear shortening and loss of characteristic features prepare a real ending.",
        explanation:
          "Schoenberg defines liquidation as gradual elimination of characteristic features until only relatively uncharacteristic residues remain. He says it is generally supported by shortening of the phrase. Together with a cadence or half cadence, this process can provide adequate delimitation.",
        instruction:
          "Study the Chapter VIII map, then compare Keep full motive-forms, Liquidate toward cadence and Abrupt cut to cadence. Choose the version that progressively reduces the motive before the V-I ending.",
        recognition:
          "Does the motive gradually lose its insistence so the cadence feels prepared rather than imposed?",
        source: {
          reference: "Chapter VIII - Liquidation and delimitation",
          focus:
            "The definition, shortening principle and connection to cadence come directly from Schoenberg's text.",
          exampleIds: ["s05.chapter"],
        },
        terms: [
          {
            term: "Liquidation",
            definition:
              "Gradual elimination of characteristic features until only material remains that no longer strongly demands continuation.",
          },
          {
            term: "Residue",
            definition:
              "Less characteristic material left after progressive reduction of the motive.",
          },
          {
            term: "Delimitation",
            definition:
              "The production of an adequate formal boundary or ending.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear liquidation produce an ending",
        successLabel: "You heard gradual reduction lead into cadence",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.liquidation];
        const modes = experiments["study.completion-mode"]?.values ?? [];
        return [
          {
            label: "You compared no liquidation, gradual liquidation and abrupt ending",
            complete: visitedAll(modes, [
              "unliquidated",
              "liquidation",
              "abrupt",
            ]),
          },
          { label: "You listened through the cadence", complete: heardPlayback(experiments) },
          {
            label: "You chose gradual liquidation",
            complete:
              state?.decision === "related" &&
              state?.completionMode === "liquidation",
          },
          {
            label: "Characteristic material becomes sparser",
            complete: studyCompletionHasLiquidation(state?.notes ?? []),
          },
          {
            label: "The study reaches its cadential support",
            complete: studyCompletionHasCadence(
              state?.notes ?? [],
              state?.harmony ?? [],
            ),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.compose,
        letter: "D",
        title: "First attempt - complete a sentence",
        learn:
          "Build a complete presentation-development-liquidation-cadence process before examining Schoenberg's detailed examples.",
        explanation:
          "The eight-measure practice form is an abstraction, but it is useful because it lets the basic procedures be heard clearly. Schoenberg immediately goes beyond it in the following examples.",
        instruction:
          "Start with Sequence → liquidation → cadence. Listen to all 32 steps, then edit at least two pitches in steps 17-24 so the continuation sounds less mechanical while preserving its connection to the source. Compare at least two notation views.",
        recognition:
          "Does the whole sentence feel like one process rather than four adjacent tricks?",
        source: {
          reference: "Chapter VIII - the eight-measure practice form",
          focus:
            "Schoenberg presents a simple practice form before showing how Examples 52-61 depart from it.",
          exampleIds: ["s05.chapter"],
        },
        terms: [
          {
            term: "Practice form",
            definition:
              "Schoenberg's deliberately simplified model used to learn procedures that real art forms may treat more freely.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Build the practice sentence",
        successLabel: "Your first sentence develops, liquidates and closes",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.compose];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          { label: "You used the complete continuation plan", complete: state?.completionMode === "complete" },
          { label: "You revised at least two continuation pitches", complete: editedContinuationSteps(noteEdits) >= 2 },
          { label: "You listened to the complete sentence", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "The basic idea remains intact at the beginning", complete: studyCompletionSourceIntact(state?.notes ?? []) },
          { label: "The second half develops the material", complete: studyCompletionHasDevelopment(state?.notes ?? []) },
          { label: "The continuation liquidates", complete: studyCompletionHasLiquidation(state?.notes ?? []) },
          { label: "The sentence closes cadentially", complete: studyCompletionHasCadence(state?.notes ?? [], state?.harmony ?? []) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex52,
        letter: "E",
        title: "Ex. 52 - watch full phrases become residues",
        learn:
          "Follow Schoenberg's printed labels from tonic/dominant forms through ascension, reduction and melodic residues.",
        explanation:
          "Schoenberg uses Ex. 52 to make liquidation visible. He states that two-measure phrases are reduced or condensed to one measure, and in Ex. 52c four measures are condensed to two. The printed analysis labels tonic form, dominant form, climactic ascension, reduction and melodic residues.",
        instruction:
          "Open every Ex. 52 source-analysis tab in order. Then play the fixed liquidation study below. Compare the full motive-forms at the start with the increasingly sparse material near the cadence.",
        recognition:
          "Can you hear shortening as part of the formal process rather than as arbitrary deletion?",
        source: {
          reference: "Example 52a-c - reduction, condensation and melodic residues",
          focus:
            "The interactive map reproduces Schoenberg's printed labels and his explicit explanation of the phrase reductions.",
          exampleIds: ["s05.ex52"],
        },
        terms: [
          { term: "Climactic ascension", definition: "Schoenberg's printed label for the rising intensification in Ex. 52a before reduction." },
          { term: "Condensation", definition: "Compression of a longer unit into a shorter one while retaining enough of its musical content to remain related." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace Ex. 52",
        successLabel: "You followed the source from full phrase to residue",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Ex. 52 analysis", complete: studiedSource(experiments, "s05.ex52", 5) },
        { label: "You listened to the liquidation application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex53,
        letter: "F",
        title: "Ex. 53 - remote forms can require more space",
        learn:
          "Understand why a sentence may grow longer when a remote motive-form needs repetition before it becomes comprehensible.",
        explanation:
          "Schoenberg calls the motive-form in Ex. 53b, m. 5 a very remote variation. Its repetitions account for the twelve-measure length. Ex. 53a also shows the later material becoming reduced and finally residual.",
        instruction:
          "Open all four Ex. 53 source-analysis tabs. Then play the developmental application below. Listen for the difference between extending because material needs establishment and merely filling time.",
        recognition:
          "Would the remote form be intelligible if it appeared only once?",
        source: {
          reference: "Example 53a-b - remote variation, reduction and residues",
          focus:
            "Schoenberg explicitly connects the extra repetitions to comprehensibility and to the extended length of the sentence.",
          exampleIds: ["s05.ex53"],
        },
        terms: [
          { term: "Remote motive-form", definition: "A derivative that differs substantially from the basic motive and therefore may need contextual reinforcement or repetition." },
        ],
        workspace: "composition-study",
        checksLabel: "Explain the extra length",
        successLabel: "You connected extension to comprehensibility",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Ex. 53 analysis", complete: studiedSource(experiments, "s05.ex53", 4) },
        { label: "You listened to the developmental application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex54_56,
        letter: "G",
        title: "Exs. 54-56 - progressive variation into sequence",
        learn:
          "See one broken-chord source transformed progressively until it can support contrasting sentence continuations.",
        explanation:
          "Schoenberg says Exs. 54-56 are based on the broken-chord form Ex. 7b. Ex. 54 progressively varies it; the continuations use sequence-like procedures and mostly free transpositions. He also supplies alternative endings because different cadential regions change the formal effect.",
        instruction:
          "Work through all five source-analysis tabs. Then play the sequence application. Notice that the sequential pattern is itself already a transformed or condensed motive-form.",
        recognition:
          "Can you trace the sequence back through progressive variation to the earlier broken-chord source?",
        source: {
          reference: "Examples 54-56 - progressive variation and quasi-sequential continuation",
          focus:
            "The map follows Schoenberg's comment on the common Ex. 7b source, progressive variation, free transposition and alternative endings.",
          exampleIds: ["s05.ex54-56"],
        },
        terms: [
          { term: "Quasi-sequential", definition: "Schoenberg's term for sequence-like repetition in which some features may be freely varied rather than strictly transposed." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace the progression",
        successLabel: "You connected progressive variation to sequence-like continuation",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Exs. 54-56 analysis", complete: studiedSource(experiments, "s05.ex54-56", 5) },
        { label: "You listened to the sequence application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex57_58,
        letter: "H",
        title: "Exs. 57-58 - the practice form is only an abstraction",
        learn:
          "Hear why masterwork sentences may depart from equal proportions while retaining the same formal logic.",
        explanation:
          "Introducing Examples 57-61, Schoenberg says the eight-measure practice form is only an abstraction. In almost all of these literature examples the continuation uses condensed phrases that give way to a cadence contour, with closing measures often reduced to residues of the basic motive.",
        instruction:
          "Open all four source-analysis tabs, then listen to the developmental application. Do not count equal blocks first; listen for establishment, more remote continuation and movement toward cadence.",
        recognition:
          "Can a sentence remain clear when its proportions are unequal?",
        source: {
          reference: "Example 57 - Bach, St Matthew Passion No. 12 aria · Example 58 - Haydn piano sonatas",
          focus:
            "Schoenberg opens his literature section with Bach and a large group of Haydn sonata sentences to show why the eight-measure practice form is an abstraction rather than a template.",
          exampleIds: ["s05.ex57-58"],
        },
        terms: [
          { term: "Cadence contour", definition: "The characteristic melodic motion toward a cadence discussed in the preceding period chapter and reused here." },
        ],
        workspace: "composition-study",
        checksLabel: "Hear form beyond equal blocks",
        successLabel: "You heard function survive unequal proportions",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Exs. 57-58 analysis", complete: studiedSource(experiments, "s05.ex57-58", 4) },
        { label: "You listened to the application without relying on equal blocks", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex59,
        letter: "I",
        title: "Ex. 59 - diagnose extension by omission",
        learn:
          "Use Schoenberg's own analytical test: remove suspected insertions mentally and see whether the underlying practice-form span reappears.",
        explanation:
          "Schoenberg describes Mozart's technique of producing irregularity through interpolation of incidental repetitions. For Ex. 59 he repeatedly asks which measures could be omitted. The point is diagnostic: the omitted material reveals what caused the extension.",
        instruction:
          "Start by playing the complete native Ex. 59a from Mozart's K. 280-I and use its analysis spans to locate mm. 5-6 and Schoenberg's tested insertion in mm. 7-11. Then work through the Ex. 59 source map for 59b-i before playing the separate application.",
        recognition:
          "If the inserted material vanished, can you still perceive the simpler structural span underneath?",
        source: {
          reference: "Example 59a-i - Mozart piano sonatas K. 280, 282, 283, 310, 311, 330, 333 and The Marriage of Figaro",
          focus:
            "Ex. 59a (K. 280-I) is reproduced as a complete native grand-staff score. The source map continues Schoenberg's omission, overlap, sequence and repetition analysis across the rest of the Mozart group.",
          exampleIds: ["s05.ex59a", "s05.ex59"],
        },
        terms: [
          { term: "Interpolation", definition: "Insertion of additional material into an otherwise simpler formal span." },
          { term: "Omission test", definition: "An analytical procedure - used explicitly by Schoenberg here - of mentally removing measures to identify what produced an extension." },
        ],
        workspace: "composition-study",
        checksLabel: "Diagnose the extension",
        successLabel: "You found the simpler form underneath Mozart's insertions",
      }),
      evaluate: ({ experiments }) => [
        { label: "You played or inspected native Mozart Ex. 59a", complete:
            (experiments["source.play"]?.values ?? []).includes("s05.ex59a") ||
            (experiments["source.note"]?.values ?? []).some((value) => value.startsWith("s05.ex59a:")) ||
            (experiments["source.analysis"]?.values ?? []).some((value) => value.startsWith("s05.ex59a:")) },
        { label: "You worked through Schoenberg's Ex. 59 analysis", complete: studiedSource(experiments, "s05.ex59", 5) },
        { label: "You listened to the extension application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex60,
        letter: "J",
        title: "Ex. 60 - learn from unusual cases without making them rules",
        learn:
          "Study exceptional endings, beginnings and extensions while preserving Schoenberg's distinction between masterwork evidence and safe student procedure.",
        explanation:
          "Schoenberg calls several features of Ex. 60 unusual: an ending on VI, anticipation of VI through deceptive cadence, a remarkable beginning on VII-II, and extensions produced in different ways. He explicitly says some alternatives would be safer for a student. The lesson is analytical breadth, not permission to imitate every singularity mechanically.",
        instruction:
          "Open all five Ex. 60 tabs. Then play the quasi-sequential application. For each source tab ask: is Schoenberg presenting a normal procedure, an analyzable exception, or a warning?",
        recognition:
          "Can you understand why an exceptional passage works without mistaking the exception for a default recipe?",
        source: {
          reference: "Example 60a-i - Schubert piano sonatas and string quartets",
          focus:
            "Schoenberg's Schubert group supplies the unusual VI ending, deceptive-cadence anticipation, VII-II beginning, quasi-sequential insertions and independent additions discussed here.",
          exampleIds: ["s05.ex60"],
        },
        terms: [
          { term: "Deceptive cadence", definition: "A cadential motion in which an expected dominant-to-tonic resolution is redirected, here helping anticipate VI." },
        ],
        workspace: "composition-study",
        checksLabel: "Separate rule from exception",
        successLabel: "You analysed the unusual cases without turning them into formulas",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Ex. 60 analysis", complete: studiedSource(experiments, "s05.ex60", 5) },
        { label: "You listened to the quasi-sequential application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex61,
        letter: "K",
        title: "Ex. 61 - developing variation can hide the simple skeleton",
        learn:
          "Trace a sentence in which melody, accompaniment and motive-forms change roles while the underlying process remains comprehensible.",
        explanation:
          "Schoenberg says Ex. 61a is less complicated than it first appears and notes that melody need not always occupy the highest voice. In Ex. 61b, one-measure phrases are reduced to half-measure residues; he calls it a clear illustration of the style of 'developing variation'. Ex. 61d shows another kind of extension through insertion and refrain-like return.",
        instruction:
          "Open all five Ex. 61 tabs. Then play the liquidation application. Listen for the important distinction: developing variation changes the material progressively, while liquidation eventually strips characteristic detail away.",
        recognition:
          "Can the surface become increasingly different while the formal and motivic connection remains intelligible?",
        source: {
          reference: "Example 61a-d - Brahms, Cello Sonata Op. 38 and Violin Sonata Op. 78-II",
          focus:
            "The Brahms examples support Schoenberg's remarks on voice exchange, developing variation, half-measure residues and insertion.",
          exampleIds: ["s05.ex61"],
        },
        terms: [
          { term: "Developing variation", definition: "Schoenberg's term for progressive transformation in which later motive-forms grow out of earlier ones and influence what follows." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace developing variation",
        successLabel: "You separated progressive development from final liquidation",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Ex. 61 analysis", complete: studiedSource(experiments, "s05.ex61", 5) },
        { label: "You listened to the liquidation application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.final,
        letter: "L",
        title: "Rebuild the sentence after Examples 52-61",
        learn:
          "Use the chapter's complete lesson: establish clearly, develop as remotely as comprehensibility permits, justify extensions, liquidate and delimit.",
        explanation:
          "Schoenberg's examples show that the practice form is a foundation, not a cage. Longer or irregular sentences become intelligible when their extra length follows motivic and formal logic - remote forms may need repetition, sequences may extend, insertions may be diagnosed, and residues can prepare cadence.",
        instruction:
          "Build a fresh complete sentence. Edit at least four continuation pitches in steps 17-24, listen to the full form, and compare at least two notation views. Keep the ending only if you can explain why the continuation is related, why any extension is justified, and why liquidation makes the cadence possible.",
        recognition:
          "Can you explain the whole sentence as a chain of musical causes rather than as a fixed 4+4 template?",
        source: {
          reference: "Synthesis of Chapter VIII and Examples 52-61",
          focus:
            "This final application uses Schoenberg's generalization: clear establishment permits remoter derivatives, while varied/sequential repetition, shortening, residues and cadence account for larger real forms.",
          exampleIds: [
            "s05.ex52",
            "s05.ex53",
            "s05.ex54-56",
            "s05.ex57-58",
            "s05.ex59",
            "s05.ex60",
            "s05.ex61",
          ],
        },
        terms: [
          {
            term: "Formal logic",
            definition:
              "The intelligible ordering of motive-forms according to their relationship and function rather than merely chronological succession.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Complete the Chapter VIII sentence",
        successLabel: "Your sentence establishes, develops, liquidates and closes",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.final];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          { label: "You revised at least four continuation pitches", complete: editedContinuationSteps(noteEdits) >= 4 },
          { label: "You listened to the rebuilt sentence", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "The source remains recognisable at the beginning", complete: studyCompletionSourceIntact(state?.notes ?? []) },
          { label: "The second half develops the material", complete: studyCompletionHasDevelopment(state?.notes ?? []) },
          { label: "The continuation liquidates", complete: studyCompletionHasLiquidation(state?.notes ?? []) },
          { label: "The sentence reaches a cadence", complete: studyCompletionHasCadence(state?.notes ?? [], state?.harmony ?? []) },
          {
            label: "You revisited every literature-example group",
            complete: [
              "s05.ex52",
              "s05.ex53",
              "s05.ex54-56",
              "s05.ex57-58",
              "s05.ex59",
              "s05.ex60",
              "s05.ex61",
            ].every((sourceId) => studiedSource(experiments, sourceId, 1)),
          },
        ];
      },
    },
  ],
};
