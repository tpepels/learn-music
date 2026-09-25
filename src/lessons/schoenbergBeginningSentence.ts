import {
  SCHOENBERG_SENTENCE_IDS,
  studySentenceHalvesRelated,
  studySentenceHarmonyIsComplementary,
  studySentenceHasImmediateRepetition,
} from "../music/study";
import { heardPlayback, studiedSource } from "./learningEvidence";
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
  eyebrow: "Schoenberg · Beginning the Sentence",
  hero: "Establish the basic motive immediately, then learn how tonic and dominant forms can answer one another without becoming mechanical copies.",
  description:
    "A sentence usually establishes its basic idea through immediate repetition. The answering phrase may change pitch, contour, harmony and accompaniment while preserving enough relationship for the opening to remain unmistakable.",
  overview:
    "Begin a sentence by establishing the basic idea through immediate repetition. Then learn how the answering phrase can change pitch, contour, harmony and accompaniment while preserving a clear tonic-form / dominant-form relationship.",
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
          "Hear the first distinction between the two theme types: the sentence repeats its opening idea immediately, while the period postpones that larger repetition.",
        explanation:
          "The sentence and period can begin from similarly simple material, but they organize repetition differently. A sentence normally confirms its opening idea immediately: the second phrase is recognisably the same basic idea, repeated exactly, transposed or harmonically adapted. A period delays that larger return while the antecedent moves through more contrasting material.

The distinction is functional, not merely numerical. What matters is when the listener receives confirmation of the opening idea. Immediate repetition strengthens the basic idea early and leaves later space for continuation; delayed repetition creates a different expectation and therefore a different thematic design.",
        instruction:
          "Audition Immediate repetition, Delayed return and Contrasting second phrase from the beginning through the boundary at step 9. Focus on when the first idea is confirmed rather than on which version simply sounds most familiar.

Choose the opening that most clearly behaves as a sentence beginning. You should be able to point to the second phrase and say why it functions as immediate repetition of the basic idea rather than contrast or postponed return.",
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
          "Immediate repetition does not require the second phrase to occupy the same absolute pitches. A short basic idea can be repeated exactly, transposed to another pitch level, or adjusted slightly in melody or harmony while remaining unmistakably the same idea. The listener recognises the relation through preserved interval pattern, rhythm, contour or harmonic function.

This flexibility is essential because repetition also has to serve musical direction. A transposed repetition can move the phrase toward a new harmonic area without sacrificing identity. The requirement is therefore perceptual clarity: the second phrase must sound like a return of the opening idea before its differences are heard as variation.",
        instruction:
          "Compare Exact repetition, Transposed repetition and Contrasting second phrase. Listen first without looking at Degrees and decide which version still sounds like the opening idea despite moving to a new pitch level.

Then use Staff and Degrees to verify what your ear detected. Choose the version that changes absolute pitch while preserving the interval pattern strongly enough for the second phrase to function as repetition rather than contrast.",
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
              "A repetition transferred to another pitch level while preserving enough internal relationships to remain recognisable.",
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
          "Complementary repetition lets the second phrase remain recognisably the same basic idea while assigning it a different harmonic function. Rhythm and contour often provide the strongest continuity, while individual pitches are adjusted to fit the new harmony. A tonic-form answered by a dominant-form makes this relation especially easy to hear.

The useful principle is that harmonic contrast need not destroy thematic identity. The answer should sound both familiar and directional: familiar because its motivic features are preserved, directional because the harmonic support changes its function and creates expectation for what follows.",
        instruction:
          "Compare Tonic → tonic, Tonic → dominant and Contrasting second phrase while listening to the supporting bass as carefully as the melody. Notice that the tonic-to-dominant version changes function without requiring the melodic idea to become unrecognisable.

Choose the version that keeps the repeated idea audible while moving its support from I to V. Then state which features of the melody made the repetition clear despite the harmonic change.",
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
              "An appearance of the phrase associated primarily with tonic harmony or tonic function.",
          },
          {
            term: "Dominant form",
            definition:
              "The related answering form adapted primarily to dominant harmony or dominant function.",
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
          "Construct a sentence opening in which the basic idea is established immediately and unmistakably.",
        explanation:
          "The central requirement of a sentence beginning is clarity of establishment. The opening phrase presents the basic idea; the next phrase confirms it immediately through repetition that may be exact, transposed or harmonically adapted. By the end of the beginning, the listener should know what material the sentence is about.

That confirmation should not make the music feel finished. A successful beginning strengthens identity while still leaving enough harmonic or melodic tension for continuation. This first construction gives you a practical baseline before the literature sources show how freely composers can satisfy the same function.",
        instruction:
          "Reshape at least three notes of the supplied basic idea in steps 1-8 so that it has a clear contour and rhythmic identity. Then choose Exact repetition, Transposed repetition or Tonic → dominant for the answering phrase.

Listen to the full 16-step beginning and compare at least two notation views. Revise if the second phrase sounds either unrelated or so final that no continuation seems necessary. The goal is immediate confirmation plus forward pressure.",
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
              "The opening construction in which the basic idea is presented and immediately repeated.",
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
        title: "Hear the simplest tonic / dominant answer",
        learn:
          "Hear the clearest version of complementary repetition before the later examples complicate it.",
        explanation:
          "The two Beethoven sources make complementary repetition unusually easy to hear. In each, the first phrase has tonic function and the answering phrase moves to dominant function. Melodic details change where the new harmony requires them, but the repeated phrase remains perceptually obvious.

This shows why 'same phrase' and 'same pitches' are not equivalent. The answer can preserve rhythm, contour and phrase shape while changing particular notes to express its new harmonic role. The stronger the functional relation, the less need there is for a mechanical pitch-for-pitch copy.",
        instruction:
          "Play the two Beethoven sources below. In the F-minor passage, listen for the E-natural adjustment that helps the answer fit C-dominant harmony. In the shorter 2/4 passage, hear the same tonic-form / dominant-form relation in a more compressed phrase.

Compare the two and identify which features carry repetition most strongly. The important result is to hear harmonic function changing while phrase identity remains intact.",
        recognition:
          "Does the answer feel like the same phrase adapted to a different harmonic function rather than a literal pitch copy?",
        source: {
          reference:
            "Example 35a Beethoven Op.2/1-I; Example 35b Beethoven Op.10/2-I",
          exampleIds: ["s04.ex35a", "s04.ex35b", "s04.ex35"],
          focus:
            "Both Ex. 35a and Ex. 35b are now present as native playable grand-staff transcriptions of the complete excerpts Schoenberg prints. The source map summarizes the comparison; the PLAY / LAB study below remains separate application.",
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
          {
            label: "You studied both Beethoven source scores",
            complete:
              studiedSource(experiments, "s04.ex35a") &&
              studiedSource(experiments, "s04.ex35b"),
          },
          { label: "You listened to the comparison study", complete: heardPlayback(experiments) },
          { label: "You identified tonic form answered by dominant form", complete: state?.decision === "related" },
          { label: "The application begins on I and answers on V", complete: state?.harmony?.[0] === "I" && state?.harmony?.[8] === "V" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex36_37,
        letter: "F",
        title: "Complementary harmony can be richer",
        learn:
          "Move beyond the simplest I → V answer and hear tonic / dominant forms that contain internal harmonic motion.",
        explanation:
          "Complementary repetition can remain clear even when each phrase contains internal harmonic motion. One source outlines a tonic form based on I-V-I and answers it with V-I-V; another enriches the dominant form with passing harmonies. The listener still hears the larger tonic/dominant relation because the structural functions remain complementary.

This prevents an overly simple interpretation of sentence beginnings. 'Tonic form' and 'dominant form' describe the larger harmonic role of the phrases, not a requirement that every event in the first phrase be tonic and every event in the second be dominant.",
        instruction:
          "Compare the two complementary-harmony sources below and first identify the larger tonic-form / dominant-form relation. Then listen inside each phrase for the I-V-I / V-I-V motion and for passing harmonies that enrich the surface.

Choose the statement that best distinguishes large-scale function from local harmonic detail.",
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
        title: "Do not answer mechanically",
        learn:
          "Preserve the complementary function without mechanically reproducing every passing harmony or part-writing detail.",
        explanation:
          "A convincing answer preserves the structural relation, not necessarily every local harmonic event. Passing harmonies in the first phrase may disappear or be replaced in the second if copying them would make the answer awkward. Beneath more elaborate part-writing, a comparatively simple relation such as I-IV answered by V-I can still govern the pair.

This is a general compositional principle: preserve what makes the function intelligible and allow subordinate details to adapt. Mechanical copying can actually weaken clarity when the harmonic job of the second phrase is different.",
        instruction:
          "Compare the two sources below and listen for the difference between a busier tonic side and a simpler dominant answer. Try to hear the structural harmonic relation before following every passing event.

Then decide why the simpler answer is more convincing than a literal reconstruction of every detail. The exercise is about hierarchy: main harmonies define the function, while passing harmonies remain subordinate.",
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
              "Literal copying of local events even when the new harmonic or formal function calls for adaptation.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Separate structure from surface detail",
        successLabel: "You heard the functional answer beneath different surface motion",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_SENTENCE_IDS.ex38_39];
        return [
          { label: "You listened to the non-mechanical answer study", complete: heardPlayback(experiments) },
          { label: "You identified function rather than mechanical copying", complete: state?.decision === "related" },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.ex40,
        letter: "H",
        title: "Contour can be strict or freer",
        learn:
          "Compare two kinds of dominant-form answer: one following the tonic contour closely, another preserving rhythm while contour changes more freely.",
        explanation:
          "Complementary repetition can preserve different features with different degrees of strictness. One answer follows the tonic contour closely, making melodic resemblance the main carrier of identity. Freer answers retain the rhythm while changing contour more substantially.

The comparison shows that phrase identity is not tied to one privileged surface feature. If rhythm is strong and distinctive enough, it can preserve the sense of repetition even when melodic direction changes. What matters is that some characteristic relation remains perceptually dominant.",
        instruction:
          "Compare the strict and freer contour sources below. First listen for melodic shape, then replay them listening mainly for rhythm.

In the 32-step study, compare the stricter pair with the freer one. Decide when contour stops carrying the relationship and rhythm takes over as the main evidence that the answer belongs to the opening.",
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
          { label: "You listened to both contour treatments", complete: heardPlayback(experiments) },
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
        title: "Answer the main harmonies, not every detail",
        learn:
          "Learn why a literal harmonic answer can become impractical and how regular accompaniment can act as a unifying factor.",
        explanation:
          "When the tonic form contains many local harmonies, a literal harmonic answer may become overloaded or obscure the larger relation. The answer can instead respond to the main structural harmonies, allowing subordinate events to be simplified or reorganised. This often makes the complementary function clearer rather than less faithful.

A definite and regular accompaniment can help unify the pair by supplying continuity underneath these adjustments. The accompaniment is therefore not merely decoration; its consistency can make a freer melodic and harmonic answer easier to comprehend.",
        instruction:
          "Compare the two pairs below. In the first, listen for the strain created by trying to answer too many local harmonic events; in the second, hear how concentrating on the main harmonies clarifies the larger relation.

Also notice the role of regular accompaniment in holding the texture together. Choose the interpretation that explains both harmonic simplification and the unifying effect of the accompaniment.",
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
          { label: "You listened to both harmonic-answer studies", complete: heardPlayback(experiments) },
          { label: "You identified main-harmony answering and consistent accompaniment", complete: state?.decision === "related" },
          { label: "The comparison contains both 16-step pairs", complete: (state?.notes.length ?? 0) === 32 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_SENTENCE_IDS.final,
        letter: "J",
        title: "Rebuild the beginning after the source studies",
        learn:
          "Preserve the relationship you need, but do not copy features mechanically when the harmony or phrase function requires adaptation.",
        explanation:
          "The source sequence progressively loosens what must be preserved in the answer. The clearest cases expose tonic and dominant functions almost transparently; later passages admit passing harmonies, non-mechanical correspondence, freer contour with preserved rhythm, and simplification to only the main harmonic pillars.

Across all of them, the same principle survives: repeat enough characteristic material for the answer to be heard as the same basic idea, but adapt whatever must change to serve the new harmonic and formal function. Literal duplication is only one possible solution, not the goal.",
        instruction:
          "Build a fresh opening and give the basic idea a clear rhythmic and melodic identity. Edit at least four notes, then choose Exact repetition, Transposed repetition or Tonic → dominant as the answering strategy.

Listen to the full opening, compare two notation views, and revise until you can explain which feature carries the relationship. Keep the answer only when it sounds immediately related but still contributes harmonic or melodic direction toward a continuation.",
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
              "Retain the features needed for comprehensibility while adapting others to the new harmony and formal function.",
          },
          {
            term: "Complementary answer",
            definition:
              "A related second phrase whose changed harmonic function supplies contrast without obscuring repetition.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Apply the sentence-opening principles",
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
