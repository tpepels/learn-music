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
  type LessonContext,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.beginning-sentence",
  number: 4,
  title: "Beginning the sentence",
  eyebrow: "Schoenberg · Chapter V · Construction of Simple Themes (1)",
  hero: "Establish the basic motive immediately, then learn how tonic and dominant forms can answer one another without becoming mechanical copies.",
  description:
    "Chapter V introduces the sentence and period as two principal ways of articulating a complete musical idea, then focuses on the beginning of the sentence. Immediate repetition is the characteristic solution, but Schoenberg's Examples 35-41 show that the answer can change pitch, contour, harmony and accompaniment while preserving the relationship.",
  overview:
    "The lesson first keeps the earlier PLAY / LAB ear-training and construction work, then follows Schoenberg's tonic-form / dominant-form examples directly. Examples 35-41 are treated in the order of the book: their source-derived analytical structure is built into the guide, followed by a separate playable application study.",
});

function visitedAll(values: string[], required: string[]): boolean {
  return required.every((value) => values.includes(value));
}

function editedSourceSteps(values: string[]): number {
  return new Set(
    values
      .map((value) => Number(value.split(":")[0]))
      .filter((step) => Number.isFinite(step) && step >= 0 && step < 8),
  ).size;
}

function inspectedTwoNotations(
  experiments: LessonContext["experiments"],
): boolean {
  return (experiments["study.notation"]?.values.length ?? 0) >= 2;
}

export const schoenbergBeginningSentenceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.recognise,
        letter: "A",
        title: "Sentence or period? Listen to when repetition happens",
        learn:
          "Hear Schoenberg's first distinction between the two theme types: the sentence repeats its opening idea immediately, while the period postpones that large-scale repetition.",
        explanation:
          "Schoenberg says the distinction between sentence and period lies in the treatment of the second phrase and in the continuation after it. For the sentence, the opening idea is normally repeated immediately. In the period, repetition is postponed while more remote, contrasting motive-forms help complete the antecedent. Here we isolate only that timing distinction before the later period lessons.",
        instruction:
          "Audition Immediate repetition, Delayed return and Contrasting second phrase. Listen through the boundary at step 9. Choose the opening that most clearly behaves as the beginning of a sentence.",
        recognition:
          "Does the second phrase confirm the opening idea immediately, or does the music postpone that confirmation?",
        source: {
          reference:
            "Chapter V - 'The Period and the Sentence' and 'The Beginning of the Sentence'",
          exampleIds: ["s04.period-sentence"],
          focus:
            "Schoenberg places the distinction before the examples: immediate repetition characterises the sentence opening; postponement of repetition is central to the period.",
        },
        terms: [
          {
            term: "Sentence",
            definition:
              "A theme type whose opening characteristically presents a basic idea and repeats it immediately before the continuation develops the material.",
          },
          {
            term: "Period",
            definition:
              "A theme type in which the first large repetition is postponed; the antecedent moves through more remote motive-forms before the consequent answers it.",
          },
          {
            term: "Immediate repetition",
            definition:
              "A recognisable restatement directly after the basic idea, without an intervening contrasting phrase.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the sentence opening",
        successLabel: "You identified immediate repetition as the decisive opening behaviour",
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
        title: "Immediate repetition can be exact or transposed",
        learn:
          "Hear why repetition remains intelligible even when the phrase moves to another pitch level.",
        explanation:
          "Schoenberg says that when the beginning is a short phrase, the following phrase may be an unvaried or a transposed repetition. Slight changes in melody or harmony are also possible if they do not obscure the repetition. His later literature examples cited in this paragraph show exact repetition, harmonic variation, rhythmic variation and sequence-like transposition.",
        instruction:
          "Compare Exact repetition, Transposed repetition and Contrasting second phrase. Use Staff and Degrees to check what your ear hears. Choose the version that changes absolute pitch while preserving the interval pattern.",
        recognition:
          "If every pitch moves but the internal distances stay the same, can the second phrase still function as repetition rather than contrast?",
        source: {
          reference:
            "Chapter V - beginning of the sentence; literature references to Exs. 53a, 57d, 58d/e/g, 59d/f/g, 60c and 61c",
          exampleIds: ["s04.period-sentence"],
          focus:
            "Schoenberg explicitly allows unvaried repetition, transposition, slight melodic change and slight harmonic change, provided the repetition remains perceptible.",
        },
        terms: [
          {
            term: "Exact repetition",
            definition:
              "A restatement preserving the pitch and rhythmic content of the basic idea.",
          },
          {
            term: "Transposed repetition",
            definition:
              "A restatement at another pitch level that preserves the internal interval relationships of the idea.",
          },
          {
            term: "Sequence",
            definition:
              "A repetition transferred to another pitch level; Schoenberg points to sequential cases among the cited literature examples.",
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
            complete: inspectedTwoNotations(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.harmony,
        letter: "C",
        title: "The dominant form - complementary repetition",
        learn:
          "Preserve rhythm and contour strongly enough to hear repetition while changed harmony creates contrast and direction.",
        explanation:
          "Schoenberg compares the relation to dux and comes in fugue and calls it complementary repetition. In the classical cases he discusses, rhythm and melodic contour are preserved while contrast enters through changed harmony and the melodic adjustments that harmony requires. He then lists several tonic-form / dominant-form harmonic schemes.",
        instruction:
          "Compare Tonic → tonic, Tonic → dominant and Contrasting second phrase. Listen for the low supporting harmony as well as the melody. Choose the version that keeps the repeated idea audible while changing its support from I to V.",
        recognition:
          "Can the melody still sound like repetition while the harmony makes the second phrase function as an answer rather than a copy?",
        source: {
          reference:
            "Chapter V - 'The Dominant Form: The Complementary Repetition'",
          exampleIds: ["s04.dominant-form"],
          focus:
            "Schoenberg states that rhythm and contour are preserved, while harmony and the necessary melodic adaptation provide contrast. His preferred terminology is tonic form and dominant form.",
        },
        terms: [
          {
            term: "Tonic form",
            definition:
              "Schoenberg's term for an appearance of the phrase associated with tonic harmony or tonic function.",
          },
          {
            term: "Dominant form",
            definition:
              "Schoenberg's term for the related answer adapted to dominant harmony or dominant function.",
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
        title: "First attempt - construct the beginning",
        learn:
          "Put the chapter's basic rule into practice before studying Schoenberg's detailed literature examples.",
        explanation:
          "Schoenberg repeatedly treats composition as a practical discipline. At this point the central requirement is clear: establish the basic motive in the opening phrase and repeat it immediately in a way that remains unmistakably related. This first attempt gives you something concrete to compare with Examples 35-41.",
        instruction:
          "Reshape at least three notes of the supplied basic idea in steps 1-8. Choose Exact repetition, Transposed repetition or Tonic → dominant. The second half regenerates from your basic idea. Listen to the full opening and compare at least two notation views.",
        recognition:
          "By step 16, is the listener more certain what the basic idea is, while still hearing enough movement to want a continuation?",
        source: {
          reference:
            "Chapter V - practical principle immediately before the tonic/dominant literature examples",
          exampleIds: ["s04.dominant-form"],
          focus:
            "This is an application of Schoenberg's stated construction rule rather than a transcription: the opening must clearly present its basic motive and establish it through immediate repetition.",
        },
        terms: [
          {
            term: "Beginning of the sentence",
            definition:
              "Schoenberg's term for the opening construction in which the basic motive is presented and immediately repeated.",
          },
          {
            term: "Formal function",
            definition:
              "A modern analytical term for the role material performs within a larger form; here, the opening establishes material for what follows.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Construct the first version",
        successLabel: "You built a clear sentence opening before studying the models",
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
            label: "You listened to the complete opening",
            complete: heardPlayback(experiments),
          },
          {
            label: "You compared more than one notation",
            complete: inspectedTwoNotations(experiments),
          },
          {
            label: "The repetition remains related to the basic idea",
            complete: studySentenceHalvesRelated(state?.notes ?? []),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex35,
        letter: "E",
        title: "Ex. 35 - the simplest tonic / dominant answer",
        learn:
          "Hear the clearest version of complementary repetition before the later examples complicate it.",
        explanation:
          "Schoenberg says that in Exs. 35a and 35b the first phrase employs only tonic harmony and the second only dominant harmony. He also says the melody is modified enough to conform with the harmony. These examples make the tonic-form / dominant-form relation unusually easy to hear.",
        instruction:
          "Step through Schoenberg's Ex. 35 source map first. Then play the application study across step 9, follow the I → V support, and choose the statement that matches the book's analysis.",
        recognition:
          "Does the answer feel like the same phrase adapted to a different harmonic function rather than a literal pitch copy?",
        source: {
          reference:
            "Example 35a Beethoven Op.2/1-I; Example 35b Beethoven Op.10/2-I",
          exampleIds: ["s04.ex35"],
          focus:
            "Schoenberg chooses these because the first phrase is supported only by I and the second only by V, making complementary repetition especially clear. The interactive line is a reduction of that relation, not a transcription.",
        },
        terms: [
          {
            term: "Tonic form",
            definition:
              "The first phrase in the complementary pair, here associated with tonic harmony.",
          },
          {
            term: "Dominant form",
            definition:
              "The answering phrase, here associated with dominant harmony and melodic adjustment.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the simplest complementary pair",
        successLabel: "You identified the tonic-form / dominant-form relationship",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.ex35];
        return [
          { label: "You listened to the Ex. 35 reduction", complete: heardPlayback(experiments) },
          { label: "You identified tonic form answered by dominant form", complete: state?.decision === "related" },
          { label: "The reduction begins on I and answers on V", complete: state?.harmony?.[0] === "I" && state?.harmony?.[8] === "V" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex36_37,
        letter: "F",
        title: "Exs. 36-37 - complementary harmony can be richer",
        learn:
          "Move beyond the simplest I → V answer and hear tonic / dominant forms that contain internal harmonic motion.",
        explanation:
          "Schoenberg analyses Ex. 36 as a tonic form based on I-V-I answered by a dominant form based on V-I-V. In Ex. 37 he notes that the dominant form includes passing harmonies. Complementary repetition therefore does not mean each phrase must sit on one chord; the larger functional relationship can remain clear while internal harmony becomes richer.",
        instruction:
          "Study the Exs. 36-37 source map first. Then play the application study and listen for the internal I-V-I / V-I-V motion before choosing the matching statement.",
        recognition:
          "Can you hear a tonic-form / dominant-form relationship even when each phrase contains more than one harmony?",
        source: {
          reference:
            "Example 36 Beethoven String Quartet Op.18/4-I, mm.34-37; Example 37 Beethoven String Quartet Op.18/6-IV, mm.45-48",
          exampleIds: ["s04.ex36-37"],
          focus:
            "Ex. 36 expands the complementary pair to I-V-I / V-I-V. Ex. 37 shows that the dominant form may also include passing harmonies.",
        },
        terms: [
          {
            term: "Passing harmony",
            definition:
              "Intermediate harmonic motion connecting more structural harmonies without replacing the larger function of the phrase.",
          },
          {
            term: "Harmonic skeleton",
            definition:
              "A modern descriptive term for the main functional harmonies beneath intervening passing motion.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear richer complementary harmony",
        successLabel: "You heard function surviving internal harmonic motion",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.ex36_37];
        return [
          { label: "You listened through both harmonic forms", complete: heardPlayback(experiments) },
          { label: "You identified passing harmony inside complementary repetition", complete: state?.decision === "related" },
          { label: "The reduction contains more than one harmonic change per form", complete: (state?.harmony.filter((entry) => entry !== null).length ?? 0) >= 6 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex38_39,
        letter: "G",
        title: "Exs. 38-39 - do not answer mechanically",
        learn:
          "Preserve the complementary function without mechanically reproducing every passing harmony or part-writing detail.",
        explanation:
          "Schoenberg says that in Ex. 38 the passing harmonies of the tonic form are not mechanically preserved in the dominant form. In Ex. 39 the tonic form consists of I-IV while the dominant form is basically V-I, though elaborate part-writing disguises the simplicity. These examples teach abstraction: retain the structural relation, not every local event.",
        instruction:
          "Study Schoenberg's Exs. 38-39 source map first. Then play the application study and compare the busier tonic side with the simpler dominant answer.",
        recognition:
          "Can the second phrase be a convincing answer even when it does not reproduce the first phrase's internal harmonic route event by event?",
        source: {
          reference:
            "Example 38 Mozart String Quartet K.464-I; Example 39 Mozart String Quartet K.465-I, mm.23-26",
          exampleIds: ["s04.ex38-39"],
          focus:
            "Schoenberg explicitly points out non-mechanical preservation in Ex. 38 and the simpler underlying V-I dominant form hidden by elaborate part-writing in Ex. 39.",
        },
        terms: [
          {
            term: "Part-writing",
            definition:
              "The detailed motion of the individual voices that realizes the underlying harmony.",
          },
          {
            term: "Mechanical preservation",
            definition:
              "Literal copying of local events whether or not the musical function requires it - precisely what Schoenberg says these examples avoid.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Separate structure from surface detail",
        successLabel: "You heard the functional answer beneath different surface motion",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.ex38_39];
        return [
          { label: "You listened to the Exs. 38-39 reduction", complete: heardPlayback(experiments) },
          { label: "You identified function rather than mechanical copying", complete: state?.decision === "related" },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex40,
        letter: "H",
        title: "Ex. 40 - contour can be strict or freer",
        learn:
          "Compare two kinds of dominant-form answer: one following the tonic contour closely, another preserving rhythm while contour changes more freely.",
        explanation:
          "In the Comment on Examples, Schoenberg says the tonic form of Ex. 40a is followed by a dominant form whose melody follows the contour of the first phrase exactly. In Exs. 40b and 40c the rhythm is preserved while the contour is treated more freely. This is a precise demonstration of which feature can carry identity when another is allowed to change.",
        instruction:
          "Use the Ex. 40 source map to compare Schoenberg's 40a and 40b-c distinction first. Then play all 32 application steps: the first pair isolates stricter contour, the second isolates freer contour with preserved rhythm.",
        recognition:
          "In the second pair, can rhythm preserve phrase identity even when the melodic contour no longer copies the first phrase exactly?",
        source: {
          reference: "Example 40a-c - from Example 30",
          exampleIds: ["s04.ex40"],
          focus:
            "Schoenberg contrasts exact following of the tonic phrase's contour in 40a with 40b-c, where rhythm is preserved but contour is treated more freely.",
        },
        terms: [
          {
            term: "Contour",
            definition:
              "The pattern of rising, falling and repeated pitch motion in a melodic line.",
          },
          {
            term: "Rhythmic preservation",
            definition:
              "Retention of the timing pattern even when pitch contour changes.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Compare contour and rhythm",
        successLabel: "You heard two different carriers of phrase identity",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.ex40];
        return [
          { label: "You listened to both Ex. 40 reductions", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified strict contour versus rhythm-preserved freer contour", complete: state?.decision === "related" },
          { label: "The comparison contains both 16-step pairs", complete: (state?.notes.length ?? 0) === 32 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex41,
        letter: "I",
        title: "Ex. 41 - answer the main harmonies, not every detail",
        learn:
          "Learn why a literal harmonic answer can become impractical and how regular accompaniment can act as a unifying factor.",
        explanation:
          "Schoenberg says the dominant forms in Ex. 41 are varied more than the harmonic change alone requires. When a tonic form contains too many harmonies, a literal dominant-form answer may be impracticable. He proposes answering only the main harmonies; he also stresses that a definite, regular accompaniment can animate the harmony, express character and powerfully unify the passage.",
        instruction:
          "Read the Ex. 41 source map first. Then compare the two application pairs: the first exaggerates a busy literal answer, while the second exposes the clearer main-harmony relation Schoenberg recommends.",
        recognition:
          "Does the second pair feel clearer because the answer preserves the main relation instead of trying to duplicate every local harmonic event?",
        source: {
          reference: "Example 41a-c - from Example 30",
          exampleIds: ["s04.ex41"],
          focus:
            "Schoenberg's comment is explicit: answer only the main harmonies when a literal answer is impracticable, and use consistent accompaniment as a strong unifying factor.",
        },
        terms: [
          {
            term: "Main harmonies",
            definition:
              "The structurally important harmonic functions retained when local harmonic detail is too dense to answer literally.",
          },
          {
            term: "Accompanimental characteristic",
            definition:
              "A consistent pattern or behaviour in the accompaniment that contributes to character and unity.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Simplify the harmonic answer",
        successLabel: "You identified the structural harmonic relation beneath surface detail",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.ex41];
        return [
          { label: "You listened to both Ex. 41 reductions", complete: heardPlayback(experiments) },
          { label: "You identified main-harmony answering and consistent accompaniment", complete: state?.decision === "related" },
          { label: "The comparison contains both 16-step pairs", complete: (state?.notes.length ?? 0) === 32 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.final,
        letter: "J",
        title: "Rebuild the beginning after Examples 35-41",
        learn:
          "Apply the book's actual models: preserve the relationship you need, but do not copy features mechanically when harmony or phrase function requires adaptation.",
        explanation:
          "Examples 35-41 progressively loosen the answer. The simplest cases make tonic and dominant forms almost transparent; later examples admit passing harmonies, non-mechanical harmonic correspondence, freer contour with preserved rhythm, and simplification to main harmonies. The general lesson is controlled preservation, not literal duplication.",
        instruction:
          "Build a fresh opening. Edit at least four notes in the basic idea, choose Exact repetition, Transposed repetition or Tonic → dominant, listen, compare two notation views, then revise until the answer sounds related without feeling mechanically copied.",
        recognition:
          "Can you name which feature carries the relationship in your answer - pitch pattern, contour, rhythm, harmonic function, or some combination?",
        source: {
          reference: "Synthesis of Chapter V and Examples 35-41",
          exampleIds: ["s04.ex35", "s04.ex40", "s04.ex41"],
          focus:
            "This final exercise applies the progression Schoenberg demonstrates across the examples: from simple complementary repetition to increasingly flexible, functionally controlled answers.",
        },
        terms: [
          {
            term: "Controlled preservation",
            definition:
              "A modern summary of the chapter's technique: retain the features needed for comprehensibility while adapting others to harmony and function.",
          },
          {
            term: "Complementary answer",
            definition:
              "A related second phrase whose changed harmonic function supplies contrast without obscuring repetition.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Apply the Chapter V models",
        successLabel: "Your answer is recognisably related without being mechanically copied",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.final];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          {
            label: "You reshaped at least four source notes",
            complete: editedSourceSteps(noteEdits) >= 4,
          },
          {
            label: "You chose an immediate-repetition strategy",
            complete: ["exact", "transposed", "complementary"].includes(
              state?.sentenceMode ?? "",
            ),
          },
          {
            label: "You listened to the rebuilt opening",
            complete: heardPlayback(experiments),
          },
          {
            label: "You compared more than one notation",
            complete: inspectedTwoNotations(experiments),
          },
          {
            label: "The answer remains related to the basic idea",
            complete: studySentenceHalvesRelated(state?.notes ?? []),
          },
          {
            label: "A complementary choice really uses I → V",
            complete:
              state?.sentenceMode !== "complementary" ||
              studySentenceHarmonyIsComplementary(state?.harmony ?? []),
          },
        ];
      },
    },
  ],
};
