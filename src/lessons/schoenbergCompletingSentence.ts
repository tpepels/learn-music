import {
  SCHOENBERG_COMPLETION_IDS,
  studyCompletionHasCadence,
  studyCompletionHasDevelopment,
  studyCompletionHasLiquidation,
  studyCompletionHasSequence,
  studyCompletionSourceIntact,
} from "../music/study";
import {
  heardPlayback,
  heardSourceExample,
  inspectedSourceSegment,
} from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.completing-sentence",
  number: 5,
  title: "Completing the sentence",
  eyebrow: "Schoenberg · Chapter VIII · Completion of the Sentence",
  hero: "Carry an established beginning through development, condensation and liquidation to an intelligible close.",
  description:
    "Chapter VIII begins from a completed sentence opening and studies what the continuation must do. Schoenberg's Examples 52-61 show increasingly varied ways to use remote motive-forms, sequence-like treatment, inserted repetition, extension, condensation and liquidation before a cadence.",
  overview:
    "The lesson follows the chapter in two stages: first isolate continuation, sequence and liquidation as audible functions; then analyse the book's Examples 52-61 as native, playable source material before rebuilding a complete sentence yourself.",
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

export const schoenbergCompletingSentenceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.function,
        letter: "A",
        title: "Continuation changes the job of the material",
        learn:
          "Hear the point at which the sentence stops establishing its idea and begins developing more remote motive-forms.",
        explanation:
          "Schoenberg says the beginning of the sentence contains repetition, while the continuation demands more remotely varied motive-forms. Development can include growth and extension, but equally reduction, condensation and intensification. The contrast is functional: repetition confirms the idea; continuation works on it.",
        instruction:
          "Compare Keep repeating the opening, Developed continuation and New unrelated material. Listen through the boundary at step 17 and choose the second half that changes the formal behaviour without abandoning the established motive.",
        recognition:
          "After the beginning, does the music begin to work on what you already know, merely present it again, or replace it?",
        source: {
          reference: "Chapter VIII - opening paragraphs on continuation and motive-forms",
          focus:
            "Schoenberg contrasts the repeated beginning with a continuation based on more remote motive-forms and explicitly includes reduction and condensation within development.",
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
              "A process that can include growth and extension as well as reduction, condensation and intensification.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the change of function",
        successLabel: "You distinguished development from repetition and replacement",
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
            label: "The selected continuation develops the basic idea",
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
          "Hear why sequence-like procedures are effective in continuation when their pattern is already derived from the motive.",
        explanation:
          "Schoenberg says sequence-like procedures are common in the continuation of a sentence. The sequential pattern is usually not the untouched basic motive but a transformation or condensation of preceding motive-forms. Repetition at changing pitch levels then creates both connection and forward motion.",
        instruction:
          "Compare Repeat one fragment, Sequential treatment and New unrelated material. Follow steps 17-28 in Staff and Degrees and choose the version in which one derived interval pattern moves through new pitch levels.",
        recognition:
          "Can you hear the same derived pattern being carried forward rather than simply looped in place?",
        source: {
          reference: "Chapter VIII - paragraph on sequence-like procedures",
          focus:
            "Schoenberg links sequence to transformed or condensed motive-forms and treats it as a common continuation procedure rather than as a separate decorative device.",
        },
        terms: [
          {
            term: "Sequence-like procedure",
            definition:
              "Repetition of a derived pattern at changing pitch levels inside the continuation.",
          },
          {
            term: "Condensation",
            definition:
              "Concentration of motive material into a shorter form that can be developed further.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Recognise sequential treatment",
        successLabel: "You heard repetition become directional development",
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
            label: "The continuation contains the same interval pattern in sequence",
            complete: studyCompletionHasSequence(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.liquidation,
        letter: "C",
        title: "Liquidation creates a boundary",
        learn:
          "Hear the gradual elimination of characteristic features as a positive formal process rather than as arbitrary deletion.",
        explanation:
          "Schoenberg defines liquidation as the gradual elimination of characteristic features until only relatively uncharacteristic residues remain. It is generally supported by shortening. Together with a cadence or half cadence, liquidation counteracts the tendency of motive-forms to proliferate indefinitely and gives the sentence an adequate boundary.",
        instruction:
          "Compare Keep full motive-forms, Liquidate toward cadence and Abrupt cut to cadence. Listen to steps 17-32 and choose the version in which characteristic material becomes progressively less insistent before the V → I close.",
        recognition:
          "Does the material seem to spend itself gradually so that the cadence feels prepared rather than imposed?",
        source: {
          reference: "Chapter VIII - definition of liquidation and delimitation",
          focus:
            "The book explicitly defines liquidation as gradual elimination of characteristic features and links it with phrase shortening and cadence.",
        },
        terms: [
          {
            term: "Liquidation",
            definition:
              "Gradual elimination of characteristic motive-features until comparatively neutral residue remains.",
          },
          {
            term: "Residue",
            definition:
              "The less characteristic material left after progressive reduction.",
          },
          {
            term: "Delimitation",
            definition:
              "Creation of a perceptible formal boundary, here strengthened by liquidation and cadence.",
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
            complete: visitedAll(modes, ["unliquidated", "liquidation", "abrupt"]),
          },
          { label: "You listened through the cadence", complete: heardPlayback(experiments) },
          {
            label: "You chose gradual liquidation",
            complete:
              state?.decision === "related" &&
              state?.completionMode === "liquidation",
          },
          {
            label: "Characteristic material becomes sparser before the cadence",
            complete: studyCompletionHasLiquidation(state?.notes ?? []),
          },
          {
            label: "The practice sentence reaches V → I",
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
        title: "First attempt - complete the sentence",
        learn:
          "Combine establishment, development, liquidation and cadence before comparing your solution with Schoenberg's examples.",
        explanation:
          "The chapter does not prescribe one immutable eight-measure formula. Schoenberg repeatedly allows different lengths and combinations of devices. This first attempt gives you a concrete sentence to compare against the source examples that follow.",
        instruction:
          "Start with Sequence → liquidation → cadence. Listen to all 32 steps, then edit at least two pitches in steps 17-24 so the continuation sounds less mechanical while still deriving from the beginning. Compare two notation views.",
        recognition:
          "Does the whole sentence sound like one process - establish, develop, reduce, close - rather than four adjacent tricks?",
        source: {
          reference: "Chapter VIII - practical construction before the literature examples",
          focus:
            "This is a PLAY / LAB application of the chapter's procedures, deliberately placed before Examples 52-61 so the book models can revise your first solution.",
        },
        terms: [
          {
            term: "Completion of the sentence",
            definition:
              "Carrying the established beginning through continuation and liquidation to an adequate cadence or half cadence.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Complete a first sentence",
        successLabel: "Your first sentence develops, liquidates and closes",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.compose];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          { label: "You used the complete continuation plan", complete: state?.completionMode === "complete" },
          { label: "You revised at least two continuation pitches", complete: editedContinuationSteps(noteEdits) >= 2 },
          { label: "You listened to the complete sentence", complete: heardPlayback(experiments) },
          { label: "The opening remains intact", complete: studyCompletionSourceIntact(state?.notes ?? []) },
          { label: "The second half develops the established material", complete: studyCompletionHasDevelopment(state?.notes ?? []) },
          { label: "The continuation liquidates before the close", complete: studyCompletionHasLiquidation(state?.notes ?? []) },
          {
            label: "The practice sentence ends with V → I support",
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
        id: SCHOENBERG_COMPLETION_IDS.ex52,
        letter: "E",
        title: "Ex. 52 - see the whole process in one model",
        learn:
          "Trace tonic form, dominant form, reduced motive-forms and liquidation inside one complete sentence model.",
        explanation:
          "Example 52 is especially useful because Schoenberg labels the formal/motivic stages directly. The opening establishes related forms, later motive-forms become shorter and less characteristic, and the close is prepared by liquidation rather than by an abrupt stop.",
        instruction:
          "Play the native Ex. 52 extraction. Click Beginning, Reduced motive-forms and Liquidation in turn, then choose the statement that best describes the direction of the example. Afterward compare the practice reduction below.",
        recognition:
          "Can you hear the sentence becoming less like its opening as it approaches the cadence, without losing the thread of the motive?",
        source: {
          reference: "Example 52 - sentence models with labelled motive-forms and liquidation",
          focus:
            "The native two-staff extraction follows the labels Schoenberg prints. Inner voices not needed for this formal analysis are omitted rather than invented.",
          exampleIds: ["s05-ex52"],
        },
        terms: [
          { term: "Reduced motive-form", definition: "A shorter or less complete derivative of earlier motive material." },
          { term: "Liquidation", definition: "Progressive loss of characteristic features before the close." },
        ],
        workspace: "composition-study",
        checksLabel: "Trace the complete process",
        successLabel: "You followed Ex. 52 from establishment into liquidation",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.ex52];
        return [
          { label: "You played the native Ex. 52 source", complete: heardSourceExample(experiments, "s05-ex52") },
          { label: "You inspected the reduced motive-forms", complete: inspectedSourceSegment(experiments, "s05-ex52", "reduce") },
          { label: "You inspected the liquidation", complete: inspectedSourceSegment(experiments, "s05-ex52", "liquidation") },
          { label: "You identified reduction leading into liquidation", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex53_56,
        letter: "F",
        title: "Exs. 53-56 - remote forms need help becoming comprehensible",
        learn:
          "Recognise repetition, sequence and condensation as ways of making more remote motive-forms intelligible in continuation.",
        explanation:
          "Schoenberg's comment on these examples stresses that remote motive-forms may require additional repetition. The continuation can then use sequence-like treatment, contraction and liquidation. Examples 53-56 are not four unrelated recipes; they show different balances of the same problem: enough transformation to move forward, enough repetition to remain comprehensible.",
        instruction:
          "Play the native Exs. 53-56 comparative extraction and inspect Remote forms, Sequence-like and Condense / liquidate. Choose the statement that explains why repetition can increase inside a developmental continuation.",
        recognition:
          "When a motive-form becomes more remote, can another repetition make the new form understandable without turning the continuation back into presentation?",
        source: {
          reference: "Examples 53-56 - remote motive-forms, sequence-like procedure and liquidation",
          focus:
            "The native comparative extraction preserves the procedures Schoenberg marks across the examples while keeping omitted inner piano voices out of the reconstruction.",
          exampleIds: ["s05-ex53-56"],
        },
        terms: [
          { term: "Remote motive-form", definition: "A derivative that differs more strongly from the basic motive and may need repetition to establish its relation." },
          { term: "Sequence-like procedure", definition: "Repetition of a derived pattern at changing pitch levels." },
        ],
        workspace: "composition-study",
        checksLabel: "Connect remoteness and repetition",
        successLabel: "You heard repetition serve comprehensibility inside development",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.ex53_56];
        return [
          { label: "You played the native Exs. 53-56 source study", complete: heardSourceExample(experiments, "s05-ex53-56") },
          { label: "You inspected its sequence-like stage", complete: inspectedSourceSegment(experiments, "s05-ex53-56", "sequence") },
          { label: "You inspected its condensation/liquidation stage", complete: inspectedSourceSegment(experiments, "s05-ex53-56", "liquidate") },
          { label: "You identified why remote forms can need repetition", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex57_58,
        letter: "G",
        title: "Exs. 57-58 - sentence function survives unequal units",
        learn:
          "Separate formal function from mechanical symmetry by hearing sentence processes in literature examples with unequal spans.",
        explanation:
          "The literature examples in this part of the chapter show that the presentation/continuation logic is more fundamental than a fixed bar count. Repetition may be exact, varied or extended; continuation can contract or expand according to the motive and cadence.",
        instruction:
          "Play the native melodic/formal extraction of Exs. 57-58 and switch between Presentation and Continuation. Choose the statement that best describes why unequal lengths do not invalidate the sentence.",
        recognition:
          "Can you identify the change of behaviour even when the formal boundary is not exactly halfway through a symmetrical eight-bar block?",
        source: {
          reference: "Examples 57-58 - literature sentences with varied proportions",
          focus:
            "The native extraction reproduces the upper melodic/formal layer used for analysis. The original piano accompaniment is omitted rather than replaced with guessed notes.",
          exampleIds: ["s05-ex57-58"],
        },
        terms: [
          { term: "Proportion", definition: "Relative length of formal units; Schoenberg treats it flexibly when motive and cadence require it." },
          { term: "Formal function", definition: "The role material performs - establishing, continuing, liquidating or closing - independent of a fixed measure count." },
        ],
        workspace: "composition-study",
        checksLabel: "Hear function beyond symmetry",
        successLabel: "You distinguished sentence function from equal bar-count",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.ex57_58];
        return [
          { label: "You played the native Exs. 57-58 extraction", complete: heardSourceExample(experiments, "s05-ex57-58") },
          { label: "You inspected the presentation", complete: inspectedSourceSegment(experiments, "s05-ex57-58", "presentation") },
          { label: "You inspected the continuation", complete: inspectedSourceSegment(experiments, "s05-ex57-58", "continuation") },
          { label: "You identified function rather than fixed symmetry", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex59,
        letter: "H",
        title: "Ex. 59 - inserted repetition explains apparent irregularity",
        learn:
          "Hear a longer phrase as a regular process that has been extended by repetition rather than as arbitrary irregular construction.",
        explanation:
          "Schoenberg uses Mozart examples to show that apparent irregularities often arise from insertions or repetitions. The added span can be understood because its relation to the surrounding motive-forms is audible; the analysis explains the extension rather than merely counting an unusual number of measures.",
        instruction:
          "Play the native Ex. 59 extraction. Select Inserted repetition, then Close. Choose the explanation that treats the extra span as a motivated extension rather than as unrelated material.",
        recognition:
          "If you mentally remove the inserted repetition, does a more ordinary sentence proportion become audible underneath it?",
        source: {
          reference: "Example 59 - Mozart, Piano Sonata K.330-I",
          focus:
            "The native melodic/formal extraction makes the inserted repetition audible as an extension. It is not a replacement composition with a Mozart label.",
          exampleIds: ["s05-ex59"],
        },
        terms: [
          { term: "Insertion", definition: "Additional material placed inside an otherwise intelligible construction, often explainable as repetition or extension." },
          { term: "Apparent irregularity", definition: "An unusual length whose cause can be understood through motivic/formal analysis rather than treated as arbitrary." },
        ],
        workspace: "composition-study",
        checksLabel: "Explain the extension",
        successLabel: "You heard inserted repetition behind the apparent irregularity",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.ex59];
        return [
          { label: "You played the native Ex. 59 source extraction", complete: heardSourceExample(experiments, "s05-ex59") },
          { label: "You isolated the inserted repetition", complete: inspectedSourceSegment(experiments, "s05-ex59", "insert") },
          { label: "You identified the insertion as the source of the extension", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex60,
        letter: "I",
        title: "Ex. 60 - extension need not destroy sentence direction",
        learn:
          "Hear how a continuation may be lengthened or harmonically unusual while still moving toward a formal close.",
        explanation:
          "The group collected under Ex. 60 contains sentence variants with unusual beginnings, extensions and harmonic placements. Schoenberg's analytical point is not that these are exceptions beyond explanation: their motive-forms and cadential direction still disclose the sentence process.",
        instruction:
          "Play the native Ex. 60 extraction and inspect Extension and Cadential drive. Choose the statement that distinguishes extension from another presentation of the opening.",
        recognition:
          "Does the added span keep increasing motion toward the boundary, or does it restart the theme?",
        source: {
          reference: "Example 60 - Beethoven piano-sonata sentence variants",
          focus:
            "The native extraction preserves the extension/continuation behaviour from the printed examples. Detailed accompaniment and harmonies not safely reconstructed from the source are left out, not guessed.",
          exampleIds: ["s05-ex60"],
        },
        terms: [
          { term: "Extension", definition: "Lengthening of a formal process without changing its essential function." },
          { term: "Cadential drive", definition: "Increasing tendency of the continuation toward its harmonic and melodic close." },
        ],
        workspace: "composition-study",
        checksLabel: "Hear extension as continuation",
        successLabel: "You kept the sentence direction through a longer span",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.ex60];
        return [
          { label: "You played the native Ex. 60 source extraction", complete: heardSourceExample(experiments, "s05-ex60") },
          { label: "You inspected the extension", complete: inspectedSourceSegment(experiments, "s05-ex60", "extension") },
          { label: "You inspected the cadential drive", complete: inspectedSourceSegment(experiments, "s05-ex60", "cadence") },
          { label: "You identified extension as continuation rather than restart", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.ex61,
        letter: "J",
        title: "Ex. 61 - developing variation becomes liquidation",
        learn:
          "Follow a chain in which each motive-form grows out of the previous one until characteristic detail has been reduced enough for the cadence.",
        explanation:
          "Example 61 is especially important for the relation between developing variation and liquidation. Instead of alternating between an unchanged motive and separate decorations, the material changes successively. The later forms are products of the preceding forms, and the process eventually yields less characteristic residue.",
        instruction:
          "Play the native Ex. 61 extraction. Inspect Developing variation and Liquidation separately. Choose the statement that best describes the continuity between them.",
        recognition:
          "Can you hear liquidation as the late stage of an ongoing transformational chain rather than as a separate editing trick added at the end?",
        source: {
          reference: "Example 61 - Beethoven, Piano Sonata Op.2/2-II",
          focus:
            "The native melodic extraction follows the progressive transformation Schoenberg brackets in the source and makes its final condensation audible.",
          exampleIds: ["s05-ex61"],
        },
        terms: [
          { term: "Developing variation", definition: "Successive transformation in which one motive-form produces material for the next." },
          { term: "Liquidation", definition: "The stage at which characteristic features are progressively removed until a close becomes possible." },
        ],
        workspace: "composition-study",
        checksLabel: "Follow the transformational chain",
        successLabel: "You connected developing variation directly to liquidation",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.ex61];
        return [
          { label: "You played the native Ex. 61 source extraction", complete: heardSourceExample(experiments, "s05-ex61") },
          { label: "You inspected the developing-variation span", complete: inspectedSourceSegment(experiments, "s05-ex61", "develop") },
          { label: "You inspected the liquidation span", complete: inspectedSourceSegment(experiments, "s05-ex61", "liquidate") },
          { label: "You identified liquidation as the end of the developing chain", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.compare,
        letter: "K",
        title: "Compare the book's solutions",
        learn:
          "Recognise that Schoenberg's sentence examples share functions without sharing one fixed surface formula.",
        explanation:
          "Examples 52-61 vary widely in proportion and surface. What remains stable is the logic: establish material, move into more developmental behaviour, often shorten or intensify it, and prepare a boundary. Some examples clarify remote material by repeating it; others extend, insert or progressively liquidate.",
        instruction:
          "Replay Ex. 52, Ex. 59 and Ex. 61. In each source score select the segment that explains how the music gets from continuation to ending. Then listen to the practice sentence below once more.",
        recognition:
          "Can you describe the common formal direction without forcing all three examples into the same bar-by-bar template?",
        source: {
          reference: "Comparative review - Examples 52, 59 and 61",
          focus:
            "The three native source extractions deliberately contrast a labelled model, an inserted repetition and a developing-variation chain.",
          exampleIds: ["s05-ex52", "s05-ex59", "s05-ex61"],
        },
        terms: [
          { term: "Formal prototype", definition: "A recurring functional process that can appear in different proportions and surface details without becoming one rigid template." },
        ],
        workspace: "composition-study",
        checksLabel: "Compare three source solutions",
        successLabel: "You recognised one formal direction across different surfaces",
      }),
      evaluate: ({ experiments }) => [
        { label: "You replayed Ex. 52", complete: heardSourceExample(experiments, "s05-ex52") },
        { label: "You replayed Ex. 59", complete: heardSourceExample(experiments, "s05-ex59") },
        { label: "You replayed Ex. 61", complete: heardSourceExample(experiments, "s05-ex61") },
        { label: "You isolated Ex. 52 liquidation", complete: inspectedSourceSegment(experiments, "s05-ex52", "liquidation") },
        { label: "You isolated Ex. 59 insertion", complete: inspectedSourceSegment(experiments, "s05-ex59", "insert") },
        { label: "You isolated Ex. 61 developing variation", complete: inspectedSourceSegment(experiments, "s05-ex61", "develop") },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.final,
        letter: "L",
        title: "Rebuild your sentence after the book",
        learn:
          "Revise your first sentence with the book's actual solutions in your ear: repetition for clarity, sequence for direction, extension where justified, liquidation for boundary.",
        explanation:
          "The source examples show why a canonical sentence cannot be reduced to a fixed eight-bar stencil. Their commonality is functional and motivic. Your revision should therefore have a clear presentation/continuation relationship while remaining free to choose the specific developmental route that best suits the material.",
        instruction:
          "Edit at least three pitches in steps 17-24 of the full sentence. Keep the beginning recognisable, preserve a genuine developmental relation, and retain a gradual reduction into the final cadence. Listen to the whole sentence and compare at least two notation views.",
        recognition:
          "Does your revision now sound less like a classroom template and more like one continuous transformation of the opening idea?",
        source: {
          reference: "Synthesis of Chapter VIII and Examples 52-61",
          focus:
            "This final construction is your application of the chapter. The source examples remain available in E-K when you want to compare a specific solution.",
        },
        terms: [
          { term: "Sentence process", definition: "The functional progression from establishment through continuation and reduction to closure, realised flexibly rather than by one mandatory surface pattern." },
        ],
        workspace: "composition-study",
        checksLabel: "Revise the complete sentence",
        successLabel: "Your final sentence develops its source and earns its close",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.final];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          { label: "You revised at least three continuation pitches", complete: editedContinuationSteps(noteEdits) >= 3 },
          { label: "You listened to the revised sentence", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: (experiments["study.notation"]?.values.length ?? 0) >= 2 },
          { label: "The opening remains recognisable", complete: studyCompletionSourceIntact(state?.notes ?? []) },
          { label: "The continuation genuinely develops the source", complete: studyCompletionHasDevelopment(state?.notes ?? []) },
          { label: "The late continuation liquidates", complete: studyCompletionHasLiquidation(state?.notes ?? []) },
          {
            label: "The sentence retains a closing V → I support",
            complete: studyCompletionHasCadence(
              state?.notes ?? [],
              state?.harmony ?? [],
            ),
          },
        ];
      },
    },
  ],
};
