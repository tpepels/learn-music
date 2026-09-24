import {
  SCHOENBERG_STUDY_IDS,
  studyBlockNoteCount,
  studyBlocksAreIdentical,
  studyBlocksAreRelated,
} from "../music/study";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.phrase-motive",
  number: 1,
  title: "Phrase, motive & comprehensibility",
  eyebrow: "Schoenberg · Construction of themes",
  hero: "Hear what makes one idea remain itself while the music moves.",
  description:
    "Start from Schoenberg's opening distinction between phrase and motive. A phrase has enough completeness to be heard as a unit; a motive supplies characteristic rhythmic and intervallic features that can recur, vary and generate continuation.",
  overview:
    "The point is not to memorise a definition. Listen for identity, inspect the same notes in several notations, compare repetition with variation, repair a weak continuation, then write a short phrase whose second idea is recognisably related to the first.",
});

export const schoenbergPhraseMotiveLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.analyse,
        letter: "A",
        title: "Find the characteristic idea",
        learn:
          "Distinguish the small motive from the larger phrase that contains it.",
        explanation:
          "Schoenberg treats the phrase as a small structural unit with a degree of completeness. Inside it, the motive is shorter: its characteristic rhythm and intervals make it recognisable when it returns. Repetition first makes those features easy to hear.",
        instruction:
          "Play the phrase. In the study score, mark steps 1–4 as the opening motive. Then switch between Staff, Piano roll and Degrees and notice that the notation changes while the musical identity does not.",
        recognition:
          "Can you hear the opening four-note shape return before you look at the brackets?",
        terms: [
          {
            term: "Phrase",
            definition:
              "A small musical unit heard with a degree of completeness, often comparable to a short spoken phrase.",
          },
          {
            term: "Motive",
            definition:
              "A compact rhythmic and intervallic idea whose characteristic features can recur and generate larger material.",
          },
          {
            term: "Comprehensibility",
            definition:
              "The listener's ability to grasp relationships, repetitions, contrasts and connections in the music.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Analyse the phrase",
        successLabel: "You identified the motive inside the larger phrase",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.analyse];
        const selected = state?.selectedSteps ?? [];
        return [
          {
            label: "You listened to the phrase",
            complete: heardPlayback(experiments),
          },
          {
            label: "You marked all four notes of the opening motive",
            complete: [0, 1, 2, 3].every((step) => selected.includes(step)),
          },
          {
            label: "You inspected more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.compare,
        letter: "B",
        title: "Same, related, or unrelated?",
        learn:
          "Hear the difference between literal repetition and a changed motive that preserves identity.",
        explanation:
          "For Schoenberg, variation is not random change. Some features can alter while characteristic ones remain. Exact repetition gives maximum identity; a useful motive-form changes something while preserving enough intervallic or rhythmic character to be understood as related.",
        instruction:
          "Audition Exact repeat, Related change and Unrelated change against the same source motive. Choose the version that changes pitch level but preserves the source's internal interval pattern.",
        recognition:
          "Which version sounds new without sounding like a new idea?",
        terms: [
          {
            term: "Motive-form",
            definition:
              "A transformed appearance of a motive that preserves a perceptible relationship to its source.",
          },
          {
            term: "Variation",
            definition:
              "Change that retains enough characteristic material for the relationship to remain comprehensible.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Compare motive-forms",
        successLabel: "You heard variation as related change rather than mere difference",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.compare];
        const variants = experiments["study.variant"]?.values ?? [];
        return [
          {
            label: "You compared all three continuations",
            complete: ["exact", "related", "unrelated"].every((variant) =>
              variants.includes(variant),
            ),
          },
          {
            label: "You listened while comparing",
            complete: heardPlayback(experiments),
          },
          {
            label: "You chose the transformed but related motive",
            complete: state?.decision === "related",
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.repair,
        letter: "C",
        title: "Repair the continuation",
        learn:
          "Replace arbitrary notes with a continuation that grows from the established motive.",
        explanation:
          "A phrase becomes more comprehensible when later material has a relationship to what came before. Schoenberg's examples connect motive-forms by preserving characteristic intervals, direction, rhythm or contour while allowing variation.",
        instruction:
          "Keep steps 1–4 as the source. Edit steps 5–8 so they are clearly related but not an exact copy. A transposition works; so does a version that preserves most of the contour or interval pattern. Play the result before continuing.",
        recognition:
          "Does step 5 sound like a continuation of an idea you already know, rather than the beginning of a different melody?",
        terms: [
          {
            term: "Continuation",
            definition:
              "Material that carries an established musical idea forward rather than simply restating it.",
          },
          {
            term: "Contour",
            definition:
              "The pattern of upward, downward and repeated motion in a melodic line.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Repair the relation",
        successLabel: "The second unit now grows from the first",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.repair];
        const notes = state?.notes ?? [];
        return [
          {
            label: "You changed the continuation here",
            complete: changedControl(experiments, "study.note-edit", 2),
          },
          {
            label: "You listened to the repaired phrase",
            complete: heardPlayback(experiments),
          },
          {
            label: "Both four-note units contain enough material",
            complete:
              studyBlockNoteCount(notes, 0) >= 3 &&
              studyBlockNoteCount(notes, 4) >= 3,
          },
          {
            label: "The continuation is related to the source motive",
            complete: studyBlocksAreRelated(notes, 0, 4),
          },
          {
            label: "The continuation is not a literal copy",
            complete: !studyBlocksAreIdentical(notes, 0, 4),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.compose,
        letter: "D",
        title: "Compose and revise an eight-step phrase",
        learn:
          "Use one small idea to generate a related continuation, then judge it by ear.",
        explanation:
          "The book's method repeatedly moves between analysis and construction. The practical test of a motive is whether it can generate more music while remaining recognisable. There is no single correct phrase; the constraint is relationship, not a prescribed melody.",
        instruction:
          "Write a motive in steps 1–4 and a related but changed continuation in steps 5–8. Use at least three notes in each unit. Listen, revise at least one note if needed, and compare Staff, Piano roll and Degrees before deciding you are finished.",
        recognition:
          "If you heard only steps 5–8, could you still explain what they inherited from steps 1–4?",
        terms: [
          {
            term: "Construction",
            definition:
              "Building a larger musical unit from related smaller materials.",
          },
          {
            term: "Revision",
            definition:
              "Reconsidering a compositional solution after hearing how its relationships function.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Construct the phrase",
        successLabel: "Your continuation changes the idea without losing it",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.compose];
        const notes = state?.notes ?? [];
        return [
          {
            label: "You wrote the phrase in this exercise",
            complete: changedControl(experiments, "study.note-edit", 6),
          },
          {
            label: "You listened to your construction",
            complete: heardPlayback(experiments),
          },
          {
            label: "Both units contain at least three notes",
            complete:
              studyBlockNoteCount(notes, 0) >= 3 &&
              studyBlockNoteCount(notes, 4) >= 3,
          },
          {
            label: "The continuation is recognisably related",
            complete: studyBlocksAreRelated(notes, 0, 4),
          },
          {
            label: "The continuation changes the source",
            complete: !studyBlocksAreIdentical(notes, 0, 4),
          },
        ];
      },
    },
  ],
};
