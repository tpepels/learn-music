import {
  SCHOENBERG_VARIATION_IDS,
  studyTransformationFeature,
  studyVariationIsChanged,
  studyVariationSharesIdentity,
} from "../music/study";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.developing-variation",
  number: 2,
  title: "Developing variation",
  eyebrow: "Schoenberg · The motive",
  hero: "Change the idea without discarding the idea.",
  description:
    "Chapter III treats variation as controlled change: alter rhythm, intervallic content, order, ornament or position while retaining characteristic features that keep the motive comprehensible.",
  overview:
    "The interactive miniatures simplify the transformation categories Schoenberg demonstrates in Examples 17–23. They are reductions for manipulation rather than literal transcriptions. The aim is to hear what is retained, what is changed, and why successive motive-forms can still belong to one basic idea.",
});

const correctFeaturePairs = Object.entries(studyTransformationFeature).map(
  ([transformation, feature]) => transformation + ":" + feature,
);

export const schoenbergDevelopingVariationLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.analyse,
        letter: "A",
        title: "Hear what changed",
        learn:
          "Separate the changed feature from the features that still carry the motive's identity.",
        explanation:
          "Schoenberg first establishes a basic motive, then shows that repetition alone is insufficient. Variation changes some features while characteristic ones remain. His Chapter III examples isolate rhythmic change, changes of interval or order, auxiliary notes, reduction and displacement so that a motive can appear in many forms without becoming arbitrary.",
        instruction:
          "Audition Rhythm, Intervals / direction, Auxiliary note, Reduction and Beat position. For each version, choose the feature that changed most clearly. Switch between Staff, Piano roll and Degrees when the answer is easier to see than to name.",
        recognition:
          "Can you name what changed without losing track of what still makes the right-hand figure sound related to the left-hand motive?",
        terms: [
          {
            term: "Developing variation",
            definition:
              "Successive transformation of a basic idea so that new motive-forms grow from it while preserving comprehensible relationships.",
          },
          {
            term: "Characteristic feature",
            definition:
              "A rhythmic, intervallic, contour or other property important enough to help a motive remain recognisable.",
          },
          {
            term: "Motive-form",
            definition:
              "One particular transformed appearance of the basic motive.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Identify the changing feature",
        successLabel: "You can hear variation as controlled change",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.analyse];
        const viewed = experiments["study.transformation"]?.values ?? [];
        const answers = experiments["study.feature-answer"]?.values ?? [];
        const correctAnswers = new Set(
          answers.filter((answer) => correctFeaturePairs.includes(answer)),
        );
        return [
          {
            label: "You auditioned all five transformation types",
            complete: [
              "rhythm",
              "interval",
              "auxiliary",
              "reduction",
              "displacement",
            ].every((value) => viewed.includes(value)),
          },
          {
            label: "You listened while comparing motive-forms",
            complete: heardPlayback(experiments),
          },
          {
            label: "You correctly identified at least four changed features",
            complete: correctAnswers.size >= 4,
          },
          {
            label: "You used more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
          {
            label: "A motive-form is selected for inspection",
            complete: state?.transformation !== "source",
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.rhythm,
        letter: "B",
        title: "Change rhythm, retain pitch identity",
        learn:
          "Alter temporal shape while keeping the pitch sequence recognisably tied to the source.",
        explanation:
          "Schoenberg lists changes of note length, repetitions, rhythmic figures, displacement to other beats, upbeats and metre as rhythmic means of variation. Here we isolate two of the most audible: changing note lengths and shifting the same idea away from its original metric position.",
        instruction:
          "Compare Rhythm with Beat position. Keep the source motive on the left and choose one version for the right. Hear it in Staff view, then inspect the same timing in Piano roll or Degrees. Decide which kind of rhythmic change gives the motive more forward motion.",
        recognition:
          "If the pitches are familiar but the accent pattern changes, does the motive still feel like the same idea?",
        terms: [
          {
            term: "Rhythmic variation",
            definition:
              "Changing duration, repetition or spacing while preserving enough of the motive's other features for identity to remain clear.",
          },
          {
            term: "Displacement",
            definition:
              "Moving familiar material to a different position in the bar or beat pattern.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Reshape the rhythm",
        successLabel: "You changed timing without replacing the motive",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.rhythm];
        const viewed = experiments["study.transformation"]?.values ?? [];
        return [
          {
            label: "You compared rhythmic change with displacement",
            complete:
              viewed.includes("rhythm") && viewed.includes("displacement"),
          },
          {
            label: "You listened to the alternatives",
            complete: heardPlayback(experiments),
          },
          {
            label: "You kept one rhythmic motive-form selected",
            complete:
              state?.transformation === "rhythm" ||
              state?.transformation === "displacement",
          },
          {
            label: "You inspected the rhythm in more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.intervals,
        letter: "C",
        title: "Change pitch detail, retain rhythmic identity",
        learn:
          "Alter intervallic content, add a neighbouring note, or reduce material while keeping the rhythmic frame intelligible.",
        explanation:
          "The Chapter III list also changes original order and direction, adds or omits intervals, fills intervals with auxiliary notes, and reduces material by omission or condensation. These are not interchangeable tricks: each changes a different aspect of the pitch idea while the surrounding rhythm can preserve continuity.",
        instruction:
          "Audition Intervals / direction, Auxiliary note and Reduction. The rhythmic frame stays comparatively stable while the pitch material changes. Listen to all three, inspect the Staff view, and leave selected the version that most clearly sounds new while still belonging to the source.",
        recognition:
          "Which version changes the surface most while leaving enough contour, rhythm or anchor pitches for the source to remain audible?",
        terms: [
          {
            term: "Auxiliary note",
            definition:
              "An added neighbouring or connecting note that elaborates an interval or melodic feature.",
          },
          {
            term: "Reduction",
            definition:
              "A motive-form produced by omitting or condensing material rather than adding more.",
          },
          {
            term: "Intervallic variation",
            definition:
              "Changing pitch distances, order or direction while retaining other characteristic features.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Transform the pitch idea",
        successLabel: "The rhythm now carries identity through pitch change",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.intervals];
        const viewed = experiments["study.transformation"]?.values ?? [];
        return [
          {
            label: "You compared all three pitch transformations",
            complete: ["interval", "auxiliary", "reduction"].every((value) =>
              viewed.includes(value),
            ),
          },
          {
            label: "You listened before deciding",
            complete: heardPlayback(experiments),
          },
          {
            label: "You left a transformed pitch version selected",
            complete:
              state?.transformation === "interval" ||
              state?.transformation === "auxiliary" ||
              state?.transformation === "reduction",
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.compose,
        letter: "D",
        title: "Build and revise a motive-form",
        learn:
          "Combine transformations because the continuation needs them, not merely to demonstrate a technique.",
        explanation:
          "Schoenberg's larger principle is adaptation: motive-forms change according to the needs of the developing music. A convincing variation therefore does not need to preserve every feature. It needs enough relationship to remain comprehensible while the changed features create a useful new continuation.",
        instruction:
          "Choose two or three transformations. PLAY / LAB will apply them to the second half while keeping the source on the left. Listen, switch notation, then revise at least one pitch manually in Piano roll if the generated result needs a clearer relationship or better direction.",
        recognition:
          "Can you explain in one sentence what your version preserved and what it changed?",
        terms: [
          {
            term: "Adaptation",
            definition:
              "Changing a motive-form in response to its musical context rather than applying a transformation mechanically.",
          },
          {
            term: "Preservation",
            definition:
              "Retaining selected characteristic features so the relationship to the basic motive remains perceptible.",
          },
          {
            term: "Revision",
            definition:
              "Changing a compositional solution after listening to how its relationships actually function.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Develop the motive",
        successLabel: "Your motive-form changes the idea without abandoning it",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.compose];
        const notes = state?.notes ?? [];
        const durations = state?.durations ?? [];
        return [
          {
            label: "You combined at least two transformations",
            complete: (state?.operations.length ?? 0) >= 2,
          },
          {
            label: "You listened to the developed motive-form",
            complete: heardPlayback(experiments),
          },
          {
            label: "You revised the generated result in Piano roll",
            complete: changedControl(experiments, "study.note-edit"),
          },
          {
            label: "You compared more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
          {
            label: "The motive-form is genuinely changed",
            complete: studyVariationIsChanged(notes, durations),
          },
          {
            label: "The motive-form still shares audible identity with the source",
            complete: studyVariationSharesIdentity(notes),
          },
        ];
      },
    },
  ],
};
