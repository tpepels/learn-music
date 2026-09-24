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
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.completing-sentence",
  number: 5,
  title: "Completing the sentence",
  eyebrow: "Schoenberg · Construction of simple themes",
  hero: "After the idea is established, develop it until it no longer demands continuation.",
  description:
    "Chapter VIII turns the established sentence beginning into a complete theme. The continuation develops more remote motive-forms; sequence-like treatment can drive the music forward, while liquidation gradually removes characteristic features so that a cadence can delimit the sentence.",
  overview:
    "Examples 52–61 are now represented in the lesson through source-derived interactive analysis maps before the 32-step application studies. The maps preserve Schoenberg's analytical distinctions; the study sequences are explicitly separate practice material, not source transcriptions.",
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
        title: "From repetition to continuation",
        learn:
          "Hear the change in behaviour after the beginning: the motive is no longer merely confirmed, but developed into more remote forms.",
        explanation:
          "Schoenberg contrasts the repeated beginning with what follows. Once the basic idea has been established, the continuation calls for more remotely varied motive-forms. Development can include growth and extension, but also reduction, condensation and intensification. The point is not novelty for its own sake: the new forms still have to follow the requirements of comprehensibility and musical logic.",
        instruction:
          "Start with the Chapter VIII and Ex. 52 source maps. Then compare Keep repeating the opening, Developed continuation and New unrelated material in the study workspace. Choose the second half that changes behaviour without abandoning the basic motive.",
        recognition:
          "After step 16, does the music begin to work on the established material, or does it simply restate it - or replace it?",
        source: {
          reference: "Chapter VIII and Example 52 - Completion of the Sentence",
          focus:
            "Use Schoenberg's own functional labels first: tonic form, dominant form, climactic ascension, reduction and melodic residues. The 32-step workspace then isolates the change from presentation to continuation.",
          exampleIds: ["s05.chapter", "s05.ex52"],
        },
        terms: [
          {
            term: "Continuation",
            definition:
              "The part following the repeated beginning in which more remotely varied motive-forms develop the established material.",
          },
          {
            term: "Development",
            definition:
              "For Schoenberg, development includes not only growth, augmentation and extension but also reduction, condensation and intensification.",
          },
          {
            term: "Delimitation",
            definition:
              "The creation of a sufficiently clear ending or boundary for a formal unit.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the change of behaviour",
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
          {
            label: "You listened beyond the sentence beginning",
            complete: heardPlayback(experiments),
          },
          {
            label: "You chose the developed continuation",
            complete:
              state?.decision === "related" &&
              state?.completionMode === "developed-continuation",
          },
          {
            label: "The continuation develops material from the basic idea",
            complete: studyCompletionHasDevelopment(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.sequence,
        letter: "B",
        title: "Sequence the condensed pattern",
        learn:
          "Use a transformed or condensed motive-form as a pattern that can reappear at new pitch levels.",
        explanation:
          "Schoenberg notes that sequence-like procedures are common in the continuation of a sentence. The pattern used for sequential treatment is usually a transformation or condensation of preceding motive-forms. With a suitable harmonic progression, such a pattern may begin on different scale degrees.",
        instruction:
          "Study the Exs. 53-56 source map first. Then compare Repeat one fragment, Sequential treatment and New unrelated material. Follow steps 17–28 and choose the version in which the same interval pattern moves to new pitch levels.",
        recognition:
          "Can you hear one pattern being carried forward through changing pitch levels?",
        source: {
          reference: "Examples 53-56 - extended and sequence-like continuations",
          focus:
            "Schoenberg's examples show that remote motive-forms and sequence-like repetition can extend the continuation beyond a mechanically equal practice model.",
          exampleIds: ["s05.ex53-56"],
        },
        terms: [
          {
            term: "Sequence-like procedure",
            definition:
              "Repetition of a pattern at changing pitch levels, commonly used by Schoenberg in sentence continuations.",
          },
          {
            term: "Pattern",
            definition:
              "The motive-form used as the model for sequential repetition; it is often already transformed or condensed from earlier material.",
          },
          {
            term: "Condensation",
            definition:
              "A reduction of material into a more concentrated form that can be developed further.",
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
          {
            label: "You listened to the changing pitch levels",
            complete: heardPlayback(experiments),
          },
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
          {
            label: "You inspected more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_COMPLETION_IDS.liquidation,
        letter: "C",
        title: "Liquidate toward the cadence",
        learn:
          "End development by gradually eliminating characteristic features until the material no longer demands further continuation.",
        explanation:
          "Schoenberg defines liquidation as a gradual elimination of characteristic features. Eventually only relatively uncharacteristic residues remain. He stresses that this often goes together with shortening of the phrase; combined with a cadence or half cadence, the process can give the sentence an adequate boundary. Liquidation is therefore not simply deleting notes at random - it prepares the ending.",
        instruction:
          "Study Ex. 52 and the Exs. 57-61 source map first. Then compare Keep full motive-forms, Liquidate toward cadence and Abrupt cut to cadence. Choose the version in which characteristic material is reduced progressively before the V → I ending.",
        recognition:
          "Does the motive seem to spend its remaining energy and make the cadence feel earned, rather than simply stopping?",
        source: {
          reference: "Example 52 and Examples 57-61 - reduction, residues and delimitation",
          focus:
            "The book's literature examples show shortening, inserted repetitions, developing variation and residual material preparing cadence. Study those source maps before the liquidation comparison.",
          exampleIds: ["s05.ex52", "s05.ex57-61"],
        },
        terms: [
          {
            term: "Liquidation",
            definition:
              "The gradual elimination of characteristic features until only material remains that no longer strongly demands continuation.",
          },
          {
            term: "Residue",
            definition:
              "The less characteristic material left after the motive has been progressively reduced.",
          },
          {
            term: "Cadence",
            definition:
              "A harmonic and melodic close that, together with liquidation, can delimit the end of the sentence.",
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
          {
            label: "You listened through the cadence",
            complete: heardPlayback(experiments),
          },
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
            label: "The liquidation arrives at a V → I cadence",
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
        title: "Complete the sentence",
        learn:
          "Join the beginning, developmental continuation, liquidation and cadence into one intelligible sentence.",
        explanation:
          "Schoenberg treats these procedures as means rather than a rigid formula. A simple sentence can often be eight measures, but the exact proportions may vary. What matters here is the logic of the succession: the beginning establishes material, the continuation develops more remote motive-forms, liquidation reduces their characteristic features, and the cadence supplies delimitation.",
        instruction:
          "Review the Ex. 52, Exs. 53-56 and Exs. 57-61 source maps. Then use Sequence → liquidation → cadence as the application study. Listen to all 32 steps and edit at least two pitches in steps 17–24 while preserving connection to the source idea.",
        recognition:
          "Does the whole sentence now feel like one process - establishment, development, reduction, close - rather than four adjacent tricks?",
        source: {
          reference: "Synthesis of Chapter VIII and Examples 52-61",
          focus:
            "Revisit the source maps before composing: Ex. 52 names the functions, Exs. 53-56 show extension, and Exs. 57-61 show how literature bends proportions while preserving formal logic.",
          exampleIds: ["s05.ex52", "s05.ex53-56", "s05.ex57-61"],
        },
        terms: [
          {
            term: "Completion of the sentence",
            definition:
              "The process of carrying the repeated beginning through continuation, development and liquidation to an adequate cadence or half cadence.",
          },
          {
            term: "Formal logic",
            definition:
              "The intelligible ordering of motive-forms according to their role and relationship, rather than a merely chronological succession of ideas.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Complete one whole sentence",
        successLabel: "Your sentence develops, liquidates and closes",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_COMPLETION_IDS.compose];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          {
            label: "You used the complete continuation plan",
            complete: state?.completionMode === "complete",
          },
          {
            label: "You revised at least two continuation pitches",
            complete: editedContinuationSteps(noteEdits) >= 2,
          },
          {
            label: "You listened to the complete 32-step sentence",
            complete: heardPlayback(experiments),
          },
          {
            label: "You compared more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
          {
            label: "The basic idea remains present at the beginning",
            complete: studyCompletionSourceIntact(state?.notes ?? []),
          },
          {
            label: "The second half develops the established material",
            complete: studyCompletionHasDevelopment(state?.notes ?? []),
          },
          {
            label: "The continuation liquidates before the close",
            complete: studyCompletionHasLiquidation(state?.notes ?? []),
          },
          {
            label: "The sentence ends with the cadential V → I support",
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
