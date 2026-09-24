import {
  SCHOENBERG_SENTENCE_IDS,
  studySentenceHalvesRelated,
  studySentenceHarmonyIsComplementary,
  studySentenceHasImmediateRepetition,
} from "../music/study";
import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.beginning-sentence",
  number: 4,
  title: "Beginning the sentence",
  eyebrow: "Schoenberg · Construction of simple themes",
  hero: "Present an idea clearly enough that the continuation has something to develop.",
  description:
    "Chapter V introduces the sentence as one of two principal ways of constructing a complete theme. Its beginning characteristically states a basic idea and repeats it immediately; that repetition may be exact, transposed or harmonically complementary without obscuring the relationship.",
  overview:
    "These short studies reduce the procedures Schoenberg discusses around Examples 35–41. They are interactive teaching miniatures, not literal transcriptions. Hear why immediate repetition establishes the presentation, compare exact and transposed forms, then add the tonic/dominant relationship Schoenberg calls complementary repetition.",
});

function visitedAll(
  values: string[],
  required: string[],
): boolean {
  return required.every((value) => values.includes(value));
}

function editedSourceSteps(values: string[]): number {
  return new Set(
    values
      .map((value) => Number(value.split(":")[0]))
      .filter((step) => Number.isFinite(step) && step >= 0 && step < 8),
  ).size;
}

export const schoenbergBeginningSentenceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.recognise,
        letter: "A",
        title: "Hear immediate repetition",
        learn:
          "Recognise the formal gesture that begins a sentence: a basic idea followed immediately by a recognisable repetition.",
        explanation:
          "Schoenberg says the construction of the beginning determines the construction of what follows. In the sentence, the opening idea is normally repeated immediately. The repetition is not valuable merely because material returns; it establishes the idea firmly enough for a later continuation to develop it.",
        instruction:
          "Audition Immediate repetition, Delayed return and Contrasting second phrase. Listen through the boundary at step 9. Choose the opening that most clearly behaves as the beginning of a sentence.",
        recognition:
          "Does the second half confirm the opening idea immediately, or does it postpone or replace it?",
        terms: [
          {
            term: "Sentence",
            definition:
              "A theme type whose beginning characteristically presents a basic idea and immediately repeats it before the continuation develops the material.",
          },
          {
            term: "Basic idea",
            definition:
              "The opening musical material that establishes the motive and phrase character the sentence will work with.",
          },
          {
            term: "Immediate repetition",
            definition:
              "A recognisable restatement directly after the basic idea, without an intervening contrasting phrase.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Recognise the sentence opening",
        successLabel: "You heard immediate repetition as a formal function",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.recognise];
        const modes = experiments["study.sentence-mode"]?.values ?? [];
        return [
          {
            label: "You compared all three opening behaviours",
            complete: visitedAll(modes, ["immediate", "delayed", "contrast"]),
          },
          {
            label: "You listened through the complete opening",
            complete: heardPlayback(experiments),
          },
          {
            label: "You identified immediate repetition as the sentence beginning",
            complete:
              state?.decision === "related" &&
              state?.sentenceMode === "immediate",
          },
          {
            label: "The selected opening actually preserves the basic idea",
            complete: studySentenceHasImmediateRepetition(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.repetition,
        letter: "B",
        title: "Exact or transposed repetition",
        learn:
          "Hear that immediate repetition can move to a new pitch level without ceasing to be the same formal idea.",
        explanation:
          "Schoenberg's literature examples show that the repeated opening phrase need not be mechanically identical. Slight melodic changes are possible, and repetition can be transposed while the interval pattern and phrase identity remain clear. What matters is that the listener still hears repetition rather than a new contrasting thought.",
        instruction:
          "Compare Exact repetition, Transposed repetition and Contrasting second phrase. Use Staff and Degrees to check what your ear hears. Choose the version that changes absolute pitch while preserving the interval pattern.",
        recognition:
          "If every pitch moves but the internal distances stay the same, can you still hear the second phrase as the first idea repeated?",
        terms: [
          {
            term: "Exact repetition",
            definition:
              "A restatement that preserves the pitch and rhythmic content of the basic idea.",
          },
          {
            term: "Transposed repetition",
            definition:
              "A restatement at another pitch level that preserves the internal interval relationships of the idea.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Compare repetition types",
        successLabel: "You separated pitch level from formal identity",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.repetition];
        const modes = experiments["study.sentence-mode"]?.values ?? [];
        return [
          {
            label: "You compared exact, transposed and contrasting versions",
            complete: visitedAll(modes, ["exact", "transposed", "contrast"]),
          },
          {
            label: "You listened while comparing pitch level",
            complete: heardPlayback(experiments),
          },
          {
            label: "You chose transposed repetition",
            complete:
              state?.decision === "related" &&
              state?.sentenceMode === "transposed",
          },
          {
            label: "The transposed half retains the same interval pattern",
            complete: studySentenceHasImmediateRepetition(state?.notes ?? []),
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
        id: SCHOENBERG_SENTENCE_IDS.harmony,
        letter: "C",
        title: "Complementary repetition",
        learn:
          "Keep the motivic relationship while letting the repeated phrase acquire a different harmonic function.",
        explanation:
          "Schoenberg describes a classical relationship between two similar phrases as complementary repetition: a tonic form is answered by a dominant form. Rhythm and melodic contour can remain closely related while harmony gives the repetition direction. This is repetition doing two jobs at once - confirming the idea and moving the theme.",
        instruction:
          "Compare Tonic → tonic, Tonic → dominant and Contrasting second phrase. Listen for the low supporting harmony as well as the melody. Choose the version that keeps the repeated idea audible while changing its support from I to V.",
        recognition:
          "Can the melody still sound like a repetition while the harmony makes the second phrase feel less settled?",
        terms: [
          {
            term: "Tonic form",
            definition:
              "An appearance of the phrase associated with tonic harmony or tonic function.",
          },
          {
            term: "Dominant form",
            definition:
              "A related appearance adapted to dominant harmony or dominant function.",
          },
          {
            term: "Complementary repetition",
            definition:
              "A repetition in which closely related melodic/rhythmic material appears in complementary harmonic forms, especially tonic and dominant.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear harmonic function inside repetition",
        successLabel: "You heard repetition and harmonic movement at the same time",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.harmony];
        const modes = experiments["study.sentence-mode"]?.values ?? [];
        return [
          {
            label: "You compared both harmonic repetitions and the contrast",
            complete: visitedAll(modes, [
              "tonic-repeat",
              "complementary",
              "contrast",
            ]),
          },
          {
            label: "You listened to melody and harmonic support together",
            complete: heardPlayback(experiments),
          },
          {
            label: "You chose tonic-to-dominant complementary repetition",
            complete:
              state?.decision === "related" &&
              state?.sentenceMode === "complementary",
          },
          {
            label: "The selected harmony moves from I to V",
            complete: studySentenceHarmonyIsComplementary(
              state?.harmony ?? [],
            ),
          },
          {
            label: "The two melodic halves still sound related",
            complete: studySentenceHalvesRelated(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.compose,
        letter: "D",
        title: "Construct a sentence beginning",
        learn:
          "Write a basic idea and establish it through immediate repetition before any continuation begins.",
        explanation:
          "At this stage we are deliberately stopping halfway through the sentence. Schoenberg separates the beginning from the continuation because the opening presentation creates the material and expectations the continuation must answer. Your job is therefore clarity: establish one idea, then repeat it in a way that remains unmistakably related.",
        instruction:
          "Reshape at least three notes of the supplied basic idea in steps 1–8. Choose Exact repetition, Transposed repetition or Tonic → dominant. The second half regenerates from your basic idea. Listen to the full presentation, compare at least two notation views, and revise any pitch that weakens the relationship.",
        recognition:
          "By step 16, is the listener more certain what the basic idea is - and is there still a reason for the music to continue?",
        terms: [
          {
            term: "Presentation",
            definition:
              "The opening function of a sentence in which the basic idea is stated and immediately repeated.",
          },
          {
            term: "Formal function",
            definition:
              "The role material performs within a larger form, such as presenting, continuing or cadencing.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Construct the presentation",
        successLabel: "Your basic idea is established and ready for continuation",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.compose];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          {
            label: "You reshaped at least three source notes",
            complete: editedSourceSteps(noteEdits) >= 3,
          },
          {
            label: "You chose an immediate-repetition strategy",
            complete: ["exact", "transposed", "complementary"].includes(
              state?.sentenceMode ?? "",
            ),
          },
          {
            label: "You listened to the complete presentation",
            complete: heardPlayback(experiments),
          },
          {
            label: "You compared more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
          {
            label: "The repetition remains related to the basic idea",
            complete: studySentenceHalvesRelated(state?.notes ?? []),
          },
          {
            label: "The presentation begins with an intact source idea",
            complete:
              (state?.notes.slice(0, 8).filter((note) => note !== null).length ??
                0) >= 5,
          },
        ];
      },
    },
  ],
};
