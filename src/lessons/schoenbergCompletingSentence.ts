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
  eyebrow: "Schoenberg · Completing the Sentence",
  hero: "Carry an established beginning through development, shortening and liquidation until a cadence can genuinely end the sentence.",
  description:
    "Completing a sentence involves more than attaching a continuation to a presentation. Development, sequence, shortening, liquidation and cadence interact, while real sentences may expand, overlap, interpolate repetitions and depart from the simple eight-measure model without losing musical logic.",
  overview:
    "Move from an established beginning into development, sequence, shortening and liquidation, then shape those processes toward a convincing cadence. Later examples show how real sentences expand, overlap and depart from the simple eight-measure model.",
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
          "The beginning of a sentence has already spent time establishing the basic idea through repetition. If the second half simply continues to repeat the same form with the same degree of closeness, the music risks becoming static. Continuation therefore normally requires more remote motive-forms and a stronger sense of development.

This does not mean introducing unrelated material. The continuation grows out of what has already been established, but it changes the material's function: instead of confirming identity, it begins to transform, compress, redirect and eventually prepare closure. The sentence becomes a process rather than a pair of repeated blocks.",
        instruction:
          "Compare Keep repeating the opening, Developed continuation and New unrelated material from the start of the sentence. Listen especially to what happens after the basic idea has already been confirmed.

Choose the version that changes function at the right moment: it should stop merely restating the opening, begin working on its material, and still sound derived rather than foreign.",
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
              "Development includes growth and extension, but also reduction, condensation and intensification of established material.",
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
          "Sequence-like procedures are especially effective in continuations because they combine recognisable repetition with directional movement. The pattern that is repeated is usually not the untouched basic motive but a transformed or condensed derivative, so the continuation already sounds developmentally removed from the presentation.

A strict sequence preserves the pattern closely at successive pitch levels, while quasi-sequential treatment can vary intervals or other features. What matters is the sense that one derived unit is being carried forward through changing harmonic space rather than simply copied in place.",
        instruction:
          "Study the continuation overview below, then compare Repeat one fragment, Sequential treatment and New unrelated material. Follow steps 17-28 and listen for whether one derived pattern is actually moving through new pitch levels.

Choose the version that creates forward motion without losing its connection to the established motive. A static repetition should feel too stationary; unrelated material should feel like a replacement rather than development.",
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
          "Liquidation is not simply making the motive shorter. It gradually removes the characteristic features that make the motive insist on continuation, often while phrase units themselves contract. What remains is comparatively neutral residue that no longer demands another full repetition of the idea.

This reduction works especially well near a cadence because motivic pressure and harmonic pressure can relax together. The cadence supplies tonal closure, while liquidation prepares the listener to accept that closure by reducing the amount of distinctive material still asking to be developed.",
        instruction:
          "Study the liquidation overview below, then compare Keep full motive-forms, Liquidate toward cadence and Abrupt cut to cadence. Listen for the difference between gradual loss of characteristic detail and a cadence that simply appears after unchanged material.

Choose the version in which the motive becomes progressively less insistent before the V-I ending. The ending should feel prepared both motivically and harmonically.",
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
          "Build a complete presentation-development-liquidation-cadence process.",
        explanation:
          "The eight-measure practice form is deliberately simplified so that the main functions can be heard separately: presentation establishes the idea, continuation develops it, liquidation removes characteristic detail, and cadence creates a boundary. Its value lies in clarifying those functions, not in prescribing a fixed length.

Real sentences can expand, contract or redistribute these functions while remaining intelligible. Once the process is understood, an irregular sentence can still be heard as coherent because each extra measure or compression has a formal reason rather than merely filling a numerical template.",
        instruction:
          "Start with Sequence → liquidation → cadence and listen to all 32 steps without editing. Identify where establishment ends, where directional development begins, where the material starts to lose characteristic detail, and where the cadence takes over.

Then edit at least two pitches in steps 17-24 so the continuation sounds less mechanical while preserving its derivation. Compare at least two notation views and keep revising until the second half feels like one continuous process rather than three adjacent techniques.",
        recognition:
          "Does the whole sentence feel like one process rather than four adjacent tricks?",
        source: {
          reference: "Chapter VIII - the eight-measure practice form",
          focus:
            "A simple practice form is useful as a baseline before looking at the many ways real sentences depart from it.",
          exampleIds: ["s05.chapter"],
        },
        terms: [
          {
            term: "Practice form",
            definition:
              "A deliberately simplified model used to learn formal procedures that real music may treat more freely.",
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
        title: "Watch full phrases become residues",
        learn:
          "Follow the progression from tonic and dominant forms through ascension, reduction and melodic residues.",
        explanation:
          "The first literature source makes liquidation unusually visible because the scale of the units changes in front of you. Full phrase forms are followed by shorter condensations, and a longer span is compressed into a smaller one. The material does not disappear at once; it passes through recognisable stages of reduction.

The surrounding motion also matters. A climactic ascent intensifies the continuation before the texture is thinned, so reduction feels like the consequence of accumulated energy rather than arbitrary deletion. By the cadence, only melodic residues remain strongly enough to recall the source.",
        instruction:
          "Work through the liquidation source in order. First identify the full phrase forms, then the shortened or condensed versions, and finally the residues near the cadence.

Compare the beginning and end directly. Listen for which characteristic features disappear first and which remain longest, and ask how the preceding intensification makes the later reduction feel formally necessary.",
        recognition:
          "Can you hear shortening as part of the formal process rather than as arbitrary deletion?",
        source: {
          reference: "Example 52a-c - reduction, condensation and melodic residues",
          focus:
            "The interactive map reproduces Schoenberg's printed labels and his explicit explanation of the phrase reductions.",
          exampleIds: ["s05.ex52"],
        },
        terms: [
          { term: "Climactic ascension", definition: "A rising intensification before the material begins to reduce and liquidate." },
          { term: "Condensation", definition: "Compression of a longer unit into a shorter one while retaining enough of its musical content to remain related." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace the liquidation process",
        successLabel: "You followed the phrase from full form to residue",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the liquidation analysis", complete: studiedSource(experiments, "s05.ex52", 5) },
        { label: "You listened to the liquidation application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex53,
        letter: "F",
        title: "Remote forms can require more space",
        learn:
          "Understand why a sentence may grow longer when a remote motive-form needs repetition before it becomes comprehensible.",
        explanation:
          "A remote motive-form can be so different from the basic idea that one statement is not enough for the listener to understand its role. Repetition may therefore be needed not because the composer wants more length, but because the new derivative itself requires establishment before the sentence can move on.

This gives irregular length a functional explanation. Extension can arise from comprehensibility: a remote form needs space to become intelligible, after which the sentence can resume reduction and move toward residue and cadence. The extra measures are justified by what the material needs to communicate.",
        instruction:
          "Work through the remote-variation source and identify the point where a substantially changed motive-form appears. Ask whether you would understand its relation to the sentence if it occurred only once.

Then listen for how repetition gives that form enough context to become established before later reduction begins. Distinguish necessary extension from mere duration: every added span should have a comprehensibility or developmental function.",
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
        { label: "You worked through the remote-variation analysis", complete: studiedSource(experiments, "s05.ex53", 4) },
        { label: "You listened to the developmental application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex54_56,
        letter: "G",
        title: "Develop progressive variation into sequence",
        learn:
          "See one broken-chord source transformed progressively until it can support contrasting sentence continuations.",
        explanation:
          "These sources show progressive variation as a chain rather than a single leap. A simple broken-chord form is altered step by step until a more developed derivative emerges that is suitable for sequence-like continuation. Each stage remains close enough to the previous one that the path of transformation can still be followed.

Once that derivative becomes a sequential pattern, repetition at new pitch levels extends the continuation and can lead toward different cadential regions. The sequence therefore grows out of motivic development instead of functioning as a generic device pasted onto the sentence.",
        instruction:
          "Work through the progressive-variation sources in order and identify what each stage changes from the previous one. Do not jump directly from the original broken chord to the final sequence.

Then listen to the sequential treatment and trace its pattern backward through those stages. The goal is to hear sequence as the continuation of motivic development, with the repeated unit already transformed before it begins moving through new pitch levels.",
        recognition:
          "Can you trace the sequence back through progressive variation to the earlier broken-chord source?",
        source: {
          reference: "Examples 54-56 - progressive variation and quasi-sequential continuation",
          focus:
            "The map follows Schoenberg's comment on the common Ex. 7b source, progressive variation, free transposition and alternative endings.",
          exampleIds: ["s05.ex54-56"],
        },
        terms: [
          { term: "Quasi-sequential", definition: "Sequence-like repetition in which some features are freely varied rather than reproduced by strict transposition." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace the progression",
        successLabel: "You connected progressive variation to sequence-like continuation",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the progressive-variation analysis", complete: studiedSource(experiments, "s05.ex54-56", 5) },
        { label: "You listened to the sequence application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex57_58,
        letter: "H",
        title: "The practice form is only an abstraction",
        learn:
          "Hear why masterwork sentences may depart from equal proportions while retaining the same formal logic.",
        explanation:
          "The eight-measure model is useful for learning function, but literature does not need to preserve its proportions literally. A sentence can spend more or less time establishing material, can condense continuation at different rates, and can reach its cadence through unequal phrase lengths while still preserving the same formal logic.

What matters is the sequence of functions. Establishment gives way to more remote or condensed continuation, which in turn moves toward cadential contour and residue. Counting equal blocks is therefore less informative than hearing what each span is doing.",
        instruction:
          "Work through the Bach and Haydn sources without imposing an eight-measure grid on them. First locate the established idea, then the point where continuation becomes more remote or condensed, and finally the motion that prepares cadence.

Only after hearing those functions should you notice the proportions. Ask whether the unequal lengths make sense because of what the material is doing rather than because they happen to add up neatly.",
        recognition:
          "Can a sentence remain clear when its proportions are unequal?",
        source: {
          reference: "Example 57 - Bach, St Matthew Passion No. 12 aria · Example 58 - Haydn piano sonatas",
          focus:
            "Schoenberg opens his literature section with Bach and a large group of Haydn sonata sentences to show why the eight-measure practice form is an abstraction rather than a template.",
          exampleIds: ["s05.ex57-58"],
        },
        terms: [
          { term: "Cadence contour", definition: "A characteristic melodic shape that helps direct the phrase toward a cadence." },
        ],
        workspace: "composition-study",
        checksLabel: "Hear form beyond equal blocks",
        successLabel: "You heard function survive unequal proportions",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Bach and Haydn analysis", complete: studiedSource(experiments, "s05.ex57-58", 4) },
        { label: "You listened to the application without relying on equal blocks", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex59,
        letter: "I",
        title: "Diagnose extension by omission",
        learn:
          "Use an omission test: mentally remove suspected insertions and see whether a simpler underlying span reappears.",
        explanation:
          "One way to understand an irregularly long sentence is to test whether some passage behaves like an insertion rather than part of the underlying skeleton. In Mozart, incidental repetitions can interpolate extra material without destroying the simpler phrase relation beneath them.

The omission test makes this visible: mentally remove the suspected insertion and ask whether a more regular span reappears. If it does, the extension has been diagnosed rather than merely counted. The added measures can then be understood by their local motivic or sequential function.",
        instruction:
          "Play the Mozart K. 280-I source and first hear the complete 14-measure passage as music. Then locate mm. 5-6 and the inserted passage in mm. 7-11 and imagine the sentence without that insertion.

Continue through the remaining Mozart analyses and compare different causes of extension: omission tests, overlap, sequence and repetition. In each case, ask what simpler structural span becomes visible once the added process is identified.",
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
          { term: "Omission test", definition: "An analytical procedure of mentally removing a passage to reveal the simpler structural span underneath an extension." },
        ],
        workspace: "composition-study",
        checksLabel: "Diagnose the extension",
        successLabel: "You found the simpler form underneath Mozart's insertions",
      }),
      evaluate: ({ experiments }) => [
        { label: "You played or inspected the Mozart K. 280-I source", complete:
            (experiments["source.play"]?.values ?? []).includes("s05.ex59a") ||
            (experiments["source.note"]?.values ?? []).some((value) => value.startsWith("s05.ex59a:")) ||
            (experiments["source.analysis"]?.values ?? []).some((value) => value.startsWith("s05.ex59a:")) },
        { label: "You worked through the Mozart extension analysis", complete: studiedSource(experiments, "s05.ex59", 5) },
        { label: "You listened to the extension application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex60,
        letter: "J",
        title: "Learn from unusual cases without making them rules",
        learn:
          "Study exceptional endings, beginnings and extensions without treating every unusual solution as a reusable formula.",
        explanation:
          "The Schubert cases are valuable precisely because they resist being turned into simple rules. They include unusual beginnings, endings and extensions: motion toward VI, deceptive preparation of that region, a beginning on VII-II, and several different ways of expanding the sentence.

An exceptional solution is useful only when its context explains it. The pedagogical task is therefore diagnostic rather than imitative: identify what normal expectation is being bent, what musical evidence keeps the passage coherent, and why copying the surface feature elsewhere might fail.",
        instruction:
          "Work through the Schubert cases one at a time and identify what makes each one unusual before deciding whether it is useful as a model. Separate the underlying function from the striking surface event.

Then listen to the quasi-sequential study and classify the cases: normal procedure, contextual exception, or warning against mechanical imitation. Keep the reason for your classification tied to formal and harmonic function.",
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
        { label: "You worked through the Schubert-case analysis", complete: studiedSource(experiments, "s05.ex60", 5) },
        { label: "You listened to the quasi-sequential application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex61,
        letter: "K",
        title: "Developing variation can hide the simple skeleton",
        learn:
          "Trace a sentence in which melody, accompaniment and motive-forms change roles while the underlying process remains comprehensible.",
        explanation:
          "The Brahms sources show how a dense surface can conceal a relatively simple formal process. Melody need not remain in the highest voice, accompaniment can participate actively, and motive-forms can move between textural roles while still belonging to one intelligible sentence.

One passage progressively reduces one-measure phrases to half-measure residues, making developing variation and later liquidation especially clear. Another expands the form through insertion and refrain-like return. The important task is to hear the simple skeleton through the changing texture.",
        instruction:
          "Work through all five Brahms analysis tabs and identify where the melody actually resides, how motive-forms are transformed, and where the surface complexity can be reduced to a simpler formal skeleton.

Then play the liquidation application. Compare progressive developing variation with liquidation: the first keeps producing characteristic new forms, while the second eventually removes enough characteristic detail to make closure possible.",
        recognition:
          "Can the surface become increasingly different while the formal and motivic connection remains intelligible?",
        source: {
          reference: "Example 61a-d - Brahms, Cello Sonata Op. 38 and Violin Sonata Op. 78-II",
          focus:
            "The Brahms examples support Schoenberg's remarks on voice exchange, developing variation, half-measure residues and insertion.",
          exampleIds: ["s05.ex61"],
        },
        terms: [
          { term: "Developing variation", definition: "Progressive transformation in which later motive-forms grow out of earlier ones and influence what follows." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace developing variation",
        successLabel: "You separated progressive development from final liquidation",
      }),
      evaluate: ({ experiments }) => [
        { label: "You worked through the Brahms analysis", complete: studiedSource(experiments, "s05.ex61", 5) },
        { label: "You listened to the liquidation application", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.final,
        letter: "L",
        title: "Rebuild the sentence after the literature studies",
        learn:
          "Use the complete process: establish clearly, develop as remotely as comprehensibility permits, justify extensions, liquidate and delimit.",
        explanation:
          "The practice form is a foundation for hearing functions, not a cage for measuring every sentence. Longer or irregular forms remain comprehensible when their extra length can be explained by musical causes: a remote derivative may need repetition, a sequence may extend directional motion, an insertion may enlarge a span, or liquidation may take time to reduce characteristic material.

The final standard is causal coherence. Every major extension or compression should answer a musical need, and the ending should emerge from the developmental process rather than being attached because the nominal measure count has been reached.",
        instruction:
          "Build a fresh complete sentence and listen once before editing so you can hear its default process. Then edit at least four continuation pitches in steps 17-24, preserving enough derivation for the second half to remain connected while making its development less mechanical.

Compare at least two notation views and listen to the entire form after each substantial revision. Keep the result only if you can explain three things: how the continuation derives from the beginning, why any extension earns its length, and how liquidation prepares the cadence instead of merely preceding it.",
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
        checksLabel: "Complete the full sentence process",
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
