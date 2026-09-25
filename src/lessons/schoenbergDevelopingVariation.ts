import {
  SCHOENBERG_VARIATION_IDS,
  studyVariationIsChanged,
  studyVariationSharesIdentity,
} from "../music/study";
import { changedControl, heardPlayback, studiedSource } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.developing-variation",
  number: 2,
  title: "The motive - treatment & variation",
  eyebrow: "Schoenberg · Chapter III · The Motive",
  hero: "Learn what a motive can preserve while rhythm, interval, harmony and context change.",
  description:
    "A motive needs a small number of characteristic features that remain perceptible as the material changes. The lesson moves from exact and modified repetition into systematic changes of rhythm, interval, metric placement, harmony and melodic adaptation.",
  overview:
    "Work from recognisable motive identity toward progressively freer variation. The lesson moves from characteristic features to exact transformations, rhythmic change, embellishment, metric displacement, harmonic adaptation and finally combined treatment.",
});

function inspectedTwoNotations(
  experiments: LessonContext["experiments"],
): boolean {
  return (experiments["study.notation"]?.values.length ?? 0) >= 2;
}

function viewed(
  experiments: LessonContext["experiments"],
  required: string[],
): boolean {
  const values = experiments["study.transformation"]?.values ?? [];
  return required.every((value) => values.includes(value));
}

export const schoenbergDevelopingVariationLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.motive,
        letter: "A",
        title: "Exs. 12-13 - what constitutes a motive?",
        learn:
          "Hear how a very small number of characteristic rhythmic or intervallic features can be enough to establish a motive.",
        explanation:
          "Almost any rhythmicized succession of notes can function as a basic motive, but too many unrelated features weaken its identity. Ex. 12 contrasts simple rhythmic shapes with the repeated-note character of Beethoven's Fifth, while Ex. 13 shows how successive thirds can dominate a larger passage. A few strongly treated features are enough.",
        instruction:
          "Play Example 12b and compare its repeated-note character with the Brahms material in Example 13. Ask what actually carries the motive's identity in each case. Then inspect Staff and Degrees below and choose the statement that best matches what you hear.",
        recognition:
          "What is doing the identifying work here - sheer length and complexity, or a small feature that keeps returning?",
        source: {
          reference:
            "Examples 12-13 - Ex. 12a Op.14/1-I; Ex. 12b Beethoven Symphony No.5-I; Ex. 12c Beethoven Symphony No.5-III; Ex. 13 Brahms Symphony No.4-I",
          exampleIds: ["s02.ex12b", "s02.ex12-13"],
          focus:
            "Schoenberg chose these examples to contrast different carriers of motivic identity. Ex. 12b is re-engraved as native playable notation; the companion map preserves Schoenberg's analytical comparison across Exs. 12-13.",
        },
        terms: [
          {
            term: "Motive",
            definition:
              "A characteristic rhythmic and intervallic idea whose features can generate later material.",
          },
          {
            term: "Characteristic feature",
            definition:
              "A feature important enough to help identify the motive when it returns or changes.",
          },
          {
            term: "Economy",
            definition:
              "Using a limited number of characteristic features rather than overloading the basic motive.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Identify what defines the motive",
        successLabel: "You heard how a few features can carry identity",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.motive];
        return [
          { label: "You listened to the Ex. 12 reduction", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified economy of characteristic features", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.exact,
        letter: "B",
        title: "Ex. 14 - exact repetition can transform",
        learn:
          "Understand how note relationships can remain exact under inversion, retrograde, diminution and augmentation.",
        explanation:
          "Exact repetition does not have to mean literal repetition of absolute pitches and durations. Transposition, inversion, retrograde, diminution and augmentation can preserve the underlying relationships strictly enough to remain exact transformations. Ex. 14 isolates these operations.",
        instruction:
          "Play Example 14b Diminution and Example 14c Augmentation. Hear the same G-E-C-A-F-D-C-sharp-G succession at two rhythmic scales. Then compare Inversion, Retrograde, Diminution and Augmentation below and ask which musical relationships each operation preserves.",
        recognition:
          "Can the motive remain structurally the same even when every absolute pitch or duration changes?",
        source: {
          reference: "Example 14 - inversion, retrograde, retrograde inversion, diminution and augmentation",
          exampleIds: ["s02.ex14b", "s02.ex14c", "s02.ex14"],
          focus:
            "The source map exposes the operations Schoenberg prints in Ex. 14. The transformation controls below then let you audition those operations as a separate PLAY / LAB application.",
        },
        terms: [
          {
            term: "Exact repetition",
            definition:
              "In Schoenberg's usage here, repetition that strictly preserves relevant features and note relationships, even under systematic transformation.",
          },
          {
            term: "Inversion",
            definition:
              "Reversal of interval direction around a reference pitch.",
          },
          {
            term: "Retrograde",
            definition:
              "Presentation of the succession in reverse order.",
          },
          {
            term: "Diminution / augmentation",
            definition:
              "Systematic shortening or lengthening of note-values while preserving proportional relationships.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Compare exact transformations",
        successLabel: "You separated literal identity from preserved relationships",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.exact];
        return [
          {
            label: "You played the diminution example",
            complete: studiedSource(experiments, "s02.ex14b"),
          },
          {
            label: "You played the augmentation example",
            complete: studiedSource(experiments, "s02.ex14c"),
          },
          {
            label: "You auditioned inversion, retrograde, diminution and augmentation",
            complete: viewed(experiments, [
              "inversion",
              "retrograde",
              "diminution",
              "augmentation",
            ]),
          },
          { label: "You listened while comparing", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          {
            label: "One exact transformation remains selected",
            complete: [
              "inversion",
              "retrograde",
              "diminution",
              "augmentation",
            ].includes(state?.transformation ?? ""),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.literature,
        letter: "C",
        title: "Exs. 15-16 - motive-forms in real music",
        learn:
          "See how several kinds of change can operate together in actual musical continuation rather than as isolated classroom tricks.",
        explanation:
          "After the isolated transformations of Ex. 14, Exs. 15-16 show motive-forms in context. Transposition, changes of direction, embellishment, rhythmic change, filled-in intervals, chains and sequences can interact while one basic motive remains recognisable.",
        instruction:
          "Play the four-part study and follow the recurring contour in Staff or Degrees. Choose the statement that best describes what remains recognisable while several transformations interact.",
        recognition:
          "Can you still hear one family of material after pitch level, direction, rhythm and detail have all shifted?",
        source: {
          reference:
            "Examples 15-16 - including Ex. 15c Beethoven Op.2/3-II and Ex. 16b Beethoven Op.22-III, Menuetto",
          exampleIds: ["s02.ex15-16"],
          focus:
            "The source map preserves Schoenberg's labelled transformation categories from Exs. 15-16. The four-part study below is separate application material for hearing cumulative treatment.",
        },
        terms: [
          {
            term: "Motive-form",
            definition:
              "A particular transformed appearance of the basic motive.",
          },
          {
            term: "Chain",
            definition:
              "A linked succession of motive-forms in which one transformed form leads into another.",
          },
          {
            term: "Sequence",
            definition:
              "Repetition of a pattern at another pitch level.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Recognise cumulative treatment",
        successLabel: "You heard several transformations as one motivic family",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.literature];
        return [
          { label: "You listened to the literature-style reduction", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified cumulative transformation", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.rhythm,
        letter: "D",
        title: "Ex. 17 - change the rhythm systematically",
        learn:
          "Use one broken-chord motive to isolate rhythmic changes while pitch identity stays easy to compare.",
        explanation:
          "Examples 17-29 deliberately keep the pitch source to a broken chord so each transformation can be heard clearly. Ex. 17 begins with rhythmic changes: changing note lengths, repeating notes and repeating rhythmic features. The restricted pitch material acts as experimental control.",
        instruction:
          "Play Example 17a as the baseline: four equal quarter notes. Then compare the rhythmic alternatives and use the controls for Note lengths / rhythm and Note repetition. Listen for how strongly each rhythmic change alters the motive's character.",
        recognition:
          "How much can the temporal shape change before the broken-chord identity stops being obvious?",
        source: {
          reference: "Example 17 - Developing variations of a motive based on a broken chord: Rhythmic changes",
          exampleIds: ["s02.ex17a", "s02.ex17"],
          focus:
            "Ex. 17a is reproduced natively as the printed C-A-F-A quarter-note baseline. The source map then preserves the larger set of rhythmic resources Schoenberg explores; the controls below are separate PLAY / LAB application.",
        },
        terms: [
          {
            term: "Rhythmic variation",
            definition:
              "Change in note length, repetition or rhythmic pattern while other identifying material remains available.",
          },
          {
            term: "Experimental control",
            definition:
              "A modern description of Schoenberg's didactic setup: keeping the broken-chord pitch source stable makes each transformation easier to compare.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear rhythmic treatment",
        successLabel: "You heard rhythm change while pitch identity stayed controlled",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.rhythm];
        return [
          { label: "You compared note-length change and note repetition", complete: viewed(experiments, ["rhythm", "repetition"]) },
          { label: "You listened to the alternatives", complete: heardPlayback(experiments) },
          {
            label: "A rhythmic variant remains selected",
            complete: ["rhythm", "repetition"].includes(state?.transformation ?? ""),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.intervals,
        letter: "E",
        title: "Exs. 18-21 - change interval content",
        learn:
          "Distinguish addition, reordering, embellishment and reduction as different ways of changing intervallic material.",
        explanation:
          "The sequence is carefully staged. Ex. 18 adds ancillary notes. Ex. 19 changes the original order. Ex. 20 embellishes Ex. 19. Ex. 21 demonstrates reduction, omission and condensation. Development can therefore proceed by subtraction as well as addition.",
        instruction:
          "Compare Example 18a and Example 19a. Hear B-flat inserted between C and A in Example 18a, then hear the broken-chord tones reordered as A-F-C-F in Example 19a. Continue through the later embellishment and reduction stages, then try Ancillary notes, Order / direction and Reduction / condensation below.",
        recognition:
          "Do you hear development as one generic kind of 'variation', or can you distinguish addition, reordering and reduction?",
        source: {
          reference:
            "Examples 18-21 - Addition of ancillary notes; Changing the original order; Embellishing Ex. 19; Reduction, omission, condensation",
          exampleIds: ["s02.ex18a", "s02.ex19a", "s02.ex18-21"],
          focus:
            "Native Exs. 18a and 19a put the first two printed operations directly in the lesson. The source map continues the sequence through Exs. 20-21, so the application follows Schoenberg's order rather than collapsing the procedures together.",
        },
        terms: [
          {
            term: "Ancillary note",
            definition:
              "Schoenberg's preferred term here for a note added to fill or decorate an interval.",
          },
          {
            term: "Condensation",
            definition:
              "Reduction of material into a shorter or more concentrated motive-form.",
          },
          {
            term: "Omission",
            definition:
              "Removal of part of the source material as a deliberate variation procedure.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Separate interval procedures",
        successLabel: "You distinguished addition, reordering and reduction",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.intervals];
        return [
          { label: "You compared ancillary notes, reordering and reduction", complete: viewed(experiments, ["auxiliary", "interval", "reduction"]) },
          { label: "You listened before deciding", complete: heardPlayback(experiments) },
          {
            label: "One interval procedure remains selected",
            complete: ["auxiliary", "interval", "reduction"].includes(state?.transformation ?? ""),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.metric,
        letter: "F",
        title: "Exs. 22-24 - move the motive against the metre",
        learn:
          "Hear the difference between adding an upbeat, shifting familiar features to other beats and changing metric grouping.",
        explanation:
          "Ex. 22 adds upbeats and repeats features. Ex. 23 shifts features to other beats. Ex. 24 changes the metre, a much more disruptive operation. The three examples separate different ways of changing where the listener feels the motive in relation to the beat.",
        instruction:
          "Compare Add upbeat, Shift to other beats and Change metre / grouping. Use Piano roll to see placement and Staff to hear the rhythmic effect. Notice that moving the same material within the bar can change its character even when the pitches remain familiar.",
        recognition:
          "Is the motive itself different, or has its relationship to the metric frame changed?",
        source: {
          reference:
            "Examples 22-24 - Addition of upbeats and repetition of features; Shift to other beats; Change of metre",
          exampleIds: ["s02.ex22-24"],
          focus:
            "The source map keeps Schoenberg's distinction between pickup, beat displacement and metre change. The grid below applies those categories without claiming to reproduce Ex. 24's notation.",
        },
        terms: [
          {
            term: "Upbeat",
            definition:
              "A pickup before a stronger metric position.",
          },
          {
            term: "Displacement",
            definition:
              "Shifting familiar features to different beats without replacing the basic motive.",
          },
          {
            term: "Metre change",
            definition:
              "Changing the metric organization itself rather than only moving notes within it.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear metric transformation",
        successLabel: "You separated pickup, displacement and regrouping",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.metric];
        return [
          { label: "You compared upbeat, displacement and metre", complete: viewed(experiments, ["upbeat", "displacement", "metre"]) },
          { label: "You listened to the metric alternatives", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          {
            label: "One metric treatment remains selected",
            complete: ["upbeat", "displacement", "metre"].includes(state?.transformation ?? ""),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.harmony,
        letter: "G",
        title: "Ex. 25 - adapt the motive to richer harmony",
        learn:
          "Hear that motivic preservation may require melodic adjustment when the harmonic context changes.",
        explanation:
          "The next category is harmonic change. Ex. 25 adapts the motive to richer harmony, including inversions and additions at the end. The melody is not an untouchable object laid over new chords; it can be adjusted so motive and harmony remain coherent together.",
        instruction:
          "Listen to the melody against the changing harmonic support. Choose the statement that best describes how the melodic form adapts when the harmony becomes richer.",
        recognition:
          "Does preserving the motive mean freezing every pitch, or preserving its identity while adapting to the harmonic situation?",
        source: {
          reference: "Example 25 - Adaptation to richer harmony (cf. Ex. 21d)",
          exampleIds: ["s02.ex25"],
          focus:
            "The source map records Schoenberg's Ex. 25 point about richer harmony and melodic adaptation. The simplified PLAY / LAB support below is application material, not the printed example.",
        },
        terms: [
          {
            term: "Harmonic adaptation",
            definition:
              "Adjustment of a motive-form so that its melodic details fit a changed harmonic context while its identity remains perceptible.",
          },
          {
            term: "Inversion (harmony)",
            definition:
              "A chord voicing in which a chord tone other than the root appears in the bass.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Relate motive and harmony",
        successLabel: "You treated harmony as part of motivic adaptation",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.harmony];
        return [
          { label: "You listened to the harmonic reduction", complete: heardPlayback(experiments) },
          { label: "You identified harmonic adaptation", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.substitution,
        letter: "H",
        title: "Exs. 26-27 - insert and substitute harmony",
        learn:
          "Follow the same motive through harmonic insertions and substitutions rather than treating every chord change as a new idea.",
        explanation:
          "Harmony can be changed by inserting material in the middle, as in Ex. 26, or by substituting a different chord or succession, as in Ex. 27. The harmonic route itself becomes a variable while motivic continuity is maintained.",
        instruction:
          "Play the reduction with its simplified support. Choose the description that matches Examples 26-27. Then switch notation once so you can separate the melodic relation from the harmonic change you are hearing.",
        recognition:
          "Can the harmony take a different route while the motive still sounds like one continuing object?",
        source: {
          reference: "Examples 26-27 - harmonic insertion in the middle; substitution of a different chord or succession",
          exampleIds: ["s02.ex26-27"],
          focus:
            "The source map follows Schoenberg's distinction between harmonic insertion and substitution. The simplified support below lets you hear that distinction without presenting itself as Exs. 26-27.",
        },
        terms: [
          {
            term: "Harmonic insertion",
            definition:
              "Addition of harmonic motion inside an existing span rather than only changing its ending.",
          },
          {
            term: "Substitution",
            definition:
              "Replacement of an expected chord or chord succession by another harmonic route.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Recognise harmonic route changes",
        successLabel: "You heard insertion and substitution as variation resources",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.substitution];
        return [
          { label: "You listened to the insertion/substitution reduction", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified harmonic insertion or substitution", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.adaptation,
        letter: "I",
        title: "Exs. 28-29 - adapt melody to a moving context",
        learn:
          "Connect transposition and sequence with adaptation to passing harmony and accompaniment.",
        explanation:
          "The final examples adapt the melody through transposition, passing harmonies and semi-contrapuntal treatment of the accompaniment. Variation now involves the relationship between motive, harmony and accompanying voice rather than one isolated melodic line.",
        instruction:
          "Listen to the sequential treatment and changing support. Choose the statement that includes all three resources at work: transposition, passing harmony and semi-contrapuntal accompaniment.",
        recognition:
          "Do you hear the motive as something that can be re-fitted to a changing musical environment rather than merely transformed in isolation?",
        source: {
          reference: "Examples 28-29 - transposition; passing harmonies; semi-contrapuntal treatment of the accompaniment",
          exampleIds: ["s02.ex28-29"],
          focus:
            "The source map preserves Schoenberg's three stated resources: transposition, passing harmonies and semi-contrapuntal accompaniment. The application study below cannot yet reproduce Ex. 29's full contrapuntal notation and is labelled accordingly.",
        },
        terms: [
          {
            term: "Passing harmony",
            definition:
              "Intermediate harmonic motion connecting more structural harmonies.",
          },
          {
            term: "Semi-contrapuntal accompaniment",
            definition:
              "Schoenberg's term here for accompaniment treated with enough independent motion to interact contrapuntally with the motive.",
          },
          {
            term: "Adaptation",
            definition:
              "Modification of the melodic form in response to its harmonic and contrapuntal context.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Connect motive, harmony and accompaniment",
        successLabel: "You followed the motive into a changing context",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.adaptation];
        return [
          { label: "You listened to the adaptation reduction", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified transposition plus harmonic/accompanimental adaptation", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.compose,
        letter: "J",
        title: "Exs. 17-29 - make a systematic variation series",
        learn:
          "Keep one source simple enough that every transformation can be heard and judged clearly.",
        explanation:
          "The final exercise keeps the source intentionally plain so the available transformations remain easy to hear and compare. The aim is not to make the source impressive; it is to make each change intelligible and to keep the resulting motive recognisably related.",
        instruction:
          "Choose at least three transformations for the second half. Include one rhythmic or metric change and one pitch/order change. Listen, inspect another notation, then revise at least one pitch manually in Piano roll. Keep only a result whose relation to the broken-chord source you can still explain.",
        recognition:
          "Can you identify exactly what was preserved, exactly what changed, and why the result still functions as a motive-form?",
        source: {
          reference: "Comment on Examples + Examples 17-29",
          exampleIds: ["s02.ex17", "s02.ex18-21", "s02.ex22-24", "s02.ex28-29"],
          focus:
            "This reproduces Schoenberg's didactic method rather than any one printed variant: a deliberately simple broken-chord motive becomes a laboratory for systematic changes of rhythm, interval, position, harmony and adaptation.",
        },
        terms: [
          {
            term: "Developing variation",
            definition:
              "A succession of motive-forms in which change produces material for further continuation rather than only local decoration.",
          },
          {
            term: "Local variant",
            definition:
              "Schoenberg's distinction for a variation that has little or no influence on subsequent continuation.",
          },
          {
            term: "Preservation",
            definition:
              "Retention of selected characteristic features so the transformed result remains comprehensible as related material.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Build the systematic variation",
        successLabel: "Your motive-form is changed, related and consciously constructed",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_VARIATION_IDS.compose];
        const notes = state?.notes ?? [];
        const durations = state?.durations ?? [];
        const operations = state?.operations ?? [];
        const hasRhythmic = operations.some((operation) =>
          ["rhythm", "repetition", "displacement", "upbeat", "metre", "diminution", "augmentation"].includes(operation),
        );
        const hasPitch = operations.some((operation) =>
          ["interval", "auxiliary", "reduction", "inversion", "retrograde", "transposition"].includes(operation),
        );
        return [
          { label: "You combined at least three transformations", complete: operations.length >= 3 },
          { label: "Your set includes rhythmic/metric and pitch treatment", complete: hasRhythmic && hasPitch },
          { label: "You listened to the motive-form", complete: heardPlayback(experiments) },
          { label: "You revised the generated result in Piano roll", complete: changedControl(experiments, "study.note-edit") },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "The motive-form is genuinely changed", complete: studyVariationIsChanged(notes, durations) },
          { label: "The motive-form still shares identity with the source", complete: studyVariationSharesIdentity(notes) },
        ];
      },
    },
  ],
};
