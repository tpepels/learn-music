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
        title: "What makes a motive recognisable?",
        learn:
          "Hear how a very small number of characteristic rhythmic or intervallic features can be enough to establish a motive.",
        explanation:
          "Almost any rhythmicized succession of notes can function as a basic motive, but a motive becomes useful only when some of its features are characteristic enough to be remembered. Those features may lie in rhythm, interval, contour, repetition or a combination of them. Beethoven's Fifth makes rhythm unusually prominent; the Brahms passage shows how a particular intervallic behaviour can bind a much larger span.

Economy matters because later variation needs something definite to preserve. If the basic motive contains too many unrelated peculiarities, every return either has to copy too much or becomes hard to recognise. A small number of strongly treated features gives the composer room to change surface detail while keeping identity audible.",
        instruction:
          "Play the Beethoven repeated-note motive and the Brahms third-based material below. Before choosing anything, identify one feature in each passage that you could remove without destroying its identity, and one feature whose removal would make the relation much harder to hear.

Then compare Staff and Degrees. Decide whether rhythm, interval pattern, contour or sheer amount of material is doing most of the identifying work, and choose the statement that best matches what you hear.",
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
          { label: "You listened to the motive comparison", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified economy of characteristic features", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_VARIATION_IDS.exact,
        letter: "B",
        title: "Transform a motive without changing its relationships",
        learn:
          "Understand how note relationships can remain exact under inversion, retrograde, diminution and augmentation.",
        explanation:
          "Exact repetition does not have to mean copying the same absolute pitches at the same durations. A transformation can be exact when the relevant relationships are preserved systematically: transposition keeps interval relations while changing pitch level; inversion reverses interval direction; retrograde reverses order; diminution and augmentation preserve rhythmic proportion while changing scale.

The important distinction is between a rule-governed transformation and a freer variation. In the former, you can describe precisely what operation maps the source onto the result. That makes the relationship intelligible even when the transformed version sounds very different on the surface.",
        instruction:
          "Play the Diminution and Augmentation sources below and hear the same pitch succession at two rhythmic scales. Notice that the durations change while the proportional relationship between them remains controlled.

Then compare Inversion, Retrograde, Diminution and Augmentation in the study. For each operation, state to yourself what changes and what remains exact. The goal is not to memorise names but to hear why each result still has a demonstrable structural relation to the source.",
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
        title: "Hear several transformations working together",
        learn:
          "See how several kinds of change can operate together in actual musical continuation rather than as isolated classroom tricks.",
        explanation:
          "Once the individual operations are understood, real continuation rarely uses them one at a time. Transposition, changes of direction, embellishment, rhythmic alteration, filled-in intervals, chains and sequences can interact within the same passage. The listener may therefore recognise the source through several partial correspondences rather than one perfectly preserved feature.

This is where motivic technique becomes compositional rather than mechanical. A transformation is useful only if it helps the phrase continue, intensify, contrast or connect. The question shifts from 'which operation is this?' to 'what keeps this material intelligibly related while the music moves forward?'",
        instruction:
          "Play the four-part study from beginning to end before isolating any one cell. Follow the recurring contour in Staff or Degrees and listen for places where rhythm, pitch level or detail changes while some family resemblance survives.

Then choose the statement that best describes what carries the relation across the whole continuation. Do not require every segment to preserve the same feature in exactly the same way.",
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
        title: "Change the rhythm systematically",
        learn:
          "Use one broken-chord motive to isolate rhythmic changes while pitch identity stays easy to compare.",
        explanation:
          "The systematic variation series deliberately keeps the pitch source simple so that one variable can be changed without obscuring the result. With a broken chord as the common source, differences in note length, repetition and rhythmic pattern become much easier to hear than they would be in a melodically elaborate idea.

This kind of restriction is a compositional laboratory. The aim is not to write the finished piece yet, but to learn exactly how much character rhythm can contribute when pitch identity remains comparatively stable. Once that is audible, rhythmic treatment can later be combined with intervallic and harmonic change.",
        instruction:
          "Play the four-quarter-note baseline until its neutral rhythmic shape is clear. Then compare Note lengths / rhythm and Note repetition while keeping the broken-chord identity in mind.

Listen for what each change does to emphasis, momentum and grouping. Decide whether you still recognise the motive because of its pitches alone or whether the new rhythm has begun to create a substantially different character.",
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
        title: "Change interval content without losing identity",
        learn:
          "Distinguish addition, reordering, embellishment and reduction as different ways of changing intervallic material.",
        explanation:
          "The intervallic series is staged so that several distinct procedures do not collapse into the vague idea of 'making it different'. Ancillary notes add material between structural tones; reordering changes succession; embellishment decorates an already altered form; reduction, omission and condensation deliberately remove or compress material.

The final procedures are especially important because development is not synonymous with accumulation. A motive can become more useful by becoming shorter, leaner or more concentrated. What matters is whether enough characteristic relationship remains for the derivative to function as part of the same family.",
        instruction:
          "Compare the ancillary-note source with the reordered broken-chord source below. First hear B-flat inserted between C and A without replacing the structural tones; then hear the same limited pitch resource reorganised as A-F-C-F.

Continue through the embellishment and reduction stages before using the controls. When you try Ancillary notes, Order / direction and Reduction / condensation, identify the procedure by what it does to the source rather than by how complicated the result sounds.",
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
        title: "Move the motive against the metre",
        learn:
          "Hear the difference between adding an upbeat, shifting familiar features to other beats and changing metric grouping.",
        explanation:
          "Metric treatment changes the relationship between a familiar motive and the temporal frame around it. Adding an upbeat changes how the motive approaches a strong beat; displacement moves familiar features onto different metric positions; changing the metre reorganises the frame itself.

These are not equivalent operations. A motive can survive considerable displacement because its internal features remain intact, while a metre change can alter grouping more fundamentally. Hearing the difference helps separate 'the motive changed' from 'the motive is being heard in a new metric context'.",
        instruction:
          "Compare Add upbeat, Shift to other beats and Change metre / grouping. Use Piano roll to see where events fall and Staff to relate that placement to the notated beat structure.

Keep the pitch material in your ear while you compare them. Ask whether the identity is being altered internally or whether the same identity is simply acquiring a different accent pattern and sense of arrival.",
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
        title: "Adapt the motive to richer harmony",
        learn:
          "Hear that motivic preservation may require melodic adjustment when the harmonic context changes.",
        explanation:
          "Harmonic variation changes the environment in which the motive has to function. When the supporting harmony becomes richer or changes inversion, a literal preservation of every melodic pitch may create awkward non-chord tones or weaken the intended harmonic direction. The motive may therefore need local adjustment.

The principle is controlled adaptation rather than obedience to a fixed pitch string. Preserve enough rhythm, contour or intervallic character that the motive remains recognisable, while allowing pitches to respond to the new harmony. Motive and harmony should sound as though they belong to one musical process.",
        instruction:
          "Listen first to the melody by itself, then to the same material against the changing harmonic support. Notice where the new harmony makes a literal melodic copy feel less natural.

Choose the statement that best describes the adaptation. The relevant question is not whether every pitch is preserved, but whether the motive's characteristic identity remains audible after it has been fitted to the new harmonic situation.",
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
        title: "Insert and substitute harmony",
        learn:
          "Follow the same motive through harmonic insertions and substitutions rather than treating every chord change as a new idea.",
        explanation:
          "Harmonic development can alter the route between structural points without discarding the motive. An insertion lengthens or redirects the path by adding harmonic motion; substitution replaces part of the expected support with another chord or succession. In both cases the melodic material must continue to make sense across the altered route.

This creates a useful separation between motivic continuity and harmonic continuity. The motive can tell the listener 'this is still the same musical thought' even when the harmony takes a less direct path, provided the adaptation remains coherent.",
        instruction:
          "Play the study with its simplified harmonic support and first locate the point where the route changes. Compare insertion with substitution and identify whether harmony has been added between structural points or replaced by a different path.

Then switch notation once and listen again. Keep the melodic relation separate from the harmonic one: the exercise is complete only when you can explain what changed in the support and why the motive still sounds continuous.",
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
        title: "Adapt melody to a moving harmonic context",
        learn:
          "Connect transposition and sequence with adaptation to passing harmony and accompaniment.",
        explanation:
          "The final stage treats the motive as part of a texture rather than as an isolated line. Transposition can move the motive to a new level, passing harmonies can create motion underneath it, and a more independent accompaniment can contribute its own directional line instead of merely filling chords.

At this point variation concerns coordination between voices. The melodic form may need to change because of harmony, while the accompaniment may itself become active enough to influence phrasing and continuity. The motive remains the reference point, but the surrounding musical context now participates in its development.",
        instruction:
          "Listen to the sequential treatment once for the motive, then again for the support underneath it. Track how pitch level changes, where passing harmony creates motion, and where the accompaniment behaves like an independent line rather than a static chordal background.

Choose the statement that accounts for all three resources together. The aim is to hear a coordinated texture, not three unrelated techniques applied at once.",
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
        title: "Build a systematic variation series",
        learn:
          "Keep one source simple enough that every transformation can be heard and judged clearly.",
        explanation:
          "The final exercise returns to a deliberately plain source because systematic practice works best when every operation can be heard and explained. A simple motive lets you compare rhythmic, metric, intervallic and ordering changes without losing track of what each one contributed.

The goal is not maximal transformation. It is controlled freedom: change enough to create a useful new motive-form, but preserve enough characteristic material that the relation can still be demonstrated. If you cannot say what was preserved, the variation is probably too remote for this exercise.",
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
