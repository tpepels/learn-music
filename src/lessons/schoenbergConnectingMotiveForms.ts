import {
  SCHOENBERG_CONNECTION_IDS,
  studyConnectionChangedFormCount,
  studyConnectionRelatedFormCount,
  studyConnectionSourceIntact,
} from "../music/study";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.connecting-motive-forms",
  number: 3,
  title: "Connecting motive-forms & building phrases",
  eyebrow: "Schoenberg · Chapter IV · Connecting Motive-Forms",
  hero: "Turn related motive-forms into complete musical units rather than a row of isolated transformations.",
  description:
    "Connecting motive-forms requires enough shared content to preserve logic and enough contrast to create movement. Rhythm, harmony, melodic balance and phrase shape all help turn related variants into complete musical units.",
  overview:
    "Build phrases from related motive-forms by balancing common content with enough change to create motion. The exercises move from basic connection and melodic balance toward increasingly remote but still comprehensible variants.",
});

function inspectedTwoNotations(
  experiments: LessonContext["experiments"],
): boolean {
  return (experiments["study.notation"]?.values.length ?? 0) >= 2;
}

export const schoenbergConnectingMotiveFormsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.compare,
        letter: "A",
        title: "Common content, rhythm and coherent harmony",
        learn:
          "Hear the balance between common factors that create relationship and contrast that prevents the phrase from becoming stiff.",
        explanation:
          "Musical logic can come from common content, rhythmic similarity and coherent harmony. Common content links forms derived from the same basic motive; rhythmic similarities act as unifying elements; coherent harmony reinforces the relationship. Connection does not require literal repetition.",
        instruction:
          "Audition Too much sameness, Connected motive-forms and Disconnected ideas. Listen to all four forms as one phrase, then choose the version in which the relationship stays audible without collapsing into exact repetition.",
        recognition:
          "Can you hear one family of material across the phrase even though the later forms do not merely copy the first?",
        source: {
          reference: "Chapter IV opening - common content, rhythmic similarities and coherent harmony",
          exampleIds: ["s03.chapter"],
          focus:
            "These are Schoenberg's stated sources of logic and relationship before he turns to the phrase-building examples.",
        },
        terms: [
          {
            term: "Common content",
            definition:
              "Material shared by motive-forms derived from the same basic motive.",
          },
          {
            term: "Unifying element",
            definition:
              "A recurring feature, especially rhythmic similarity, that helps separate events be heard as related.",
          },
          {
            term: "Coherent harmony",
            definition:
              "Harmonic organization regular enough to reinforce motivic relationship and comprehensibility.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Balance connection and contrast",
        successLabel: "You heard coherence without mere repetition",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.compare];
        const variants = experiments["study.variant"]?.values ?? [];
        return [
          {
            label: "You compared sameness, connection and disconnection",
            complete: ["exact", "related", "unrelated"].every((variant) =>
              variants.includes(variant),
            ),
          },
          { label: "You listened to the complete four-form phrases", complete: heardPlayback(experiments) },
          { label: "You chose common content with contrast", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.bridge,
        letter: "B",
        title: "Connect one motive-form to the next",
        learn:
          "Use common factors to make a changed form feel prepared rather than abruptly inserted.",
        explanation:
          "Chapter IV describes connection in terms of shared factors, not identical surfaces. A useful intermediate form can carry enough rhythm, interval, contour or pitch content from one form toward another that the succession remains intelligible.",
        instruction:
          "The first and third forms are fixed. Compare Weak bridge, Connecting bridge and Foreign insertion in the second position. Listen through the destination and choose the form that best preserves a perceptible line of relationship.",
        recognition:
          "Does the middle form make the later form sound prepared, or does the phrase suddenly seem to start a different thought?",
        source: {
          reference: "Chapter IV - connection depends on common factors between motive-forms",
          exampleIds: ["s03.chapter"],
          focus:
            "The interactive bridge is a modern manipulation exercise built directly from Schoenberg's principle of shared factors.",
        },
        terms: [
          {
            term: "Connecting motive-form",
            definition:
              "A derived form whose shared features help link one appearance of the motive to another.",
          },
          {
            term: "Relationship",
            definition:
              "The perceptible connection created by common factors across changed material.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Connect the phrase",
        successLabel: "The middle form now prepares what follows",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.bridge];
        const variants = experiments["study.variant"]?.values ?? [];
        return [
          {
            label: "You compared all three possible bridges",
            complete: ["exact", "related", "unrelated"].every((variant) =>
              variants.includes(variant),
            ),
          },
          { label: "You listened through the destination", complete: heardPlayback(experiments) },
          { label: "You chose the connecting motive-form", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.repair,
        letter: "C",
        title: "Repair a broken chain",
        learn:
          "Restore a demonstrable relationship to the basic motive without turning every form into an exact copy.",
        explanation:
          "Different kinds of evidence can preserve derivation: rhythmic features, transposed shapes, ancillary notes, shifts, reductions and omissions. The aim is not one fixed recipe, but a chain of forms that can still be traced back to the same basic motive.",
        instruction:
          "a and a¹ establish the family, but a² breaks away. Edit steps 9-12 in Piano roll until a² shares enough contour, interval pattern or pitch content with the source to belong again. Listen to all four forms.",
        recognition:
          "After your repair, does a² sound like a changed member of the same family rather than a replacement idea?",
        source: {
          reference: "Chapter IV and Examples 31-34 - retained, shifted, reduced and omitted features",
          exampleIds: ["s03.ex31", "s03.ex32", "s03.ex33", "s03.ex34"],
          focus:
            "The repair task translates Schoenberg's demand for traceable derivation into an editable phrase.",
        },
        terms: [
          {
            term: "Derived form",
            definition:
              "A form whose material can be traced back to the basic motive through preserved and altered features.",
          },
          {
            term: "Omission",
            definition:
              "Removal of material while enough other features remain to preserve the relation.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Restore the connection",
        successLabel: "All four forms now belong to the same basic motive",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.repair];
        const notes = state?.notes ?? [];
        const durations = state?.durations ?? [];
        return [
          { label: "You edited the broken motive-form", complete: changedControl(experiments, "study.note-edit", 2) },
          { label: "You listened to the repaired phrase", complete: heardPlayback(experiments) },
          { label: "The original basic motive remains intact", complete: studyConnectionSourceIntact(notes) },
          { label: "All three later forms relate to the source", complete: studyConnectionRelatedFormCount(notes) === 3 },
          { label: "The phrase still contains genuine variation", complete: studyConnectionChangedFormCount(notes, durations) >= 2 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.compose,
        letter: "D",
        title: "Make the forms function as a phrase",
        learn:
          "Treat transformation as phrase construction: the forms now have to work together as a complete musical unit.",
        explanation:
          "Examples 30-34 show how one basic motive can generate many different phrases. Some can begin a theme, some continue it, and some can serve contrasting or subordinate functions. Whatever the derivation, the result still needs the character of a complete musical unit.",
        instruction:
          "Choose three transformations for a¹, a² and a³. Listen to the resulting phrase, inspect two notations, then revise at least one pitch if a connection feels weak or mechanical. Keep all forms related while giving the phrase a reason to continue.",
        recognition:
          "Does this sound like a phrase with an internal direction, or merely four demonstrations placed next to each other?",
        source: {
          reference: "Building Phrases - introduction to Examples 30-34 and Chapter IV conclusion",
          exampleIds: ["s03.chapter", "s03.ex30"],
          focus:
            "Schoenberg explicitly shifts the goal from isolated derivatives to true phrases - complete musical units that can serve different structural functions.",
        },
        terms: [
          {
            term: "Complete musical unit",
            definition:
              "Schoenberg's description of the phrase-like result that motive derivation should ultimately produce.",
          },
          {
            term: "Structural function",
            definition:
              "The role a phrase may serve, such as beginning, continuation, contrast or subordinate material.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Construct the connected phrase",
        successLabel: "One motive now generates a functioning phrase",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.compose];
        const notes = state?.notes ?? [];
        const durations = state?.durations ?? [];
        return [
          { label: "You assigned three transformations to later forms", complete: (state?.operations.length ?? 0) >= 3 },
          { label: "You listened to the complete phrase", complete: heardPlayback(experiments) },
          { label: "You revised at least one generated pitch", complete: changedControl(experiments, "study.note-edit") },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "Every later form remains related to the source", complete: studyConnectionRelatedFormCount(notes) === 3 },
          { label: "All three later forms are genuinely changed", complete: studyConnectionChangedFormCount(notes, durations) === 3 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.wave,
        letter: "E",
        title: "Shape the melodic wave before the examples",
        learn:
          "Hear a well-balanced melodic progression: elevations answered by depressions, intermediate high points, recessions and compensated leaps.",
        explanation:
          "A balanced melody often progresses in waves. Elevations are answered by depressions; a climax is approached through lesser high points and recessions; upward motion is balanced by downward motion; large intervals are compensated by stepwise motion in the opposite direction; and the melody normally stays within a manageable compass.",
        instruction:
          "Play the melody and follow its two rises and recessions in Staff view. Switch once to Degrees, then choose the description that best matches the contour.",
        recognition:
          "Can you hear the second, higher point as prepared by the earlier rise and recession rather than as an isolated jump?",
        source: {
          reference: "Chapter IV - paragraph on well-balanced melodic progression in waves",
          exampleIds: ["s03.chapter"],
          focus:
            "The source map preserves Schoenberg's verbal description: rise, recession, a higher point, and return toward a central range. The study below is the separate audible application.",
        },
        terms: [
          {
            term: "Climax",
            definition:
              "The principal high point approached through lesser high points and recessions.",
          },
          {
            term: "Recession",
            definition:
              "A downward or relaxing motion that interrupts and balances an ascent.",
          },
          {
            term: "Compass",
            definition:
              "The overall pitch range within which the melody moves.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the melodic wave",
        successLabel: "You heard balance as directional phrase shape",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.wave];
        return [
          { label: "You listened to the melodic wave", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified rise, recession and return", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex30,
        letter: "F",
        title: "Ex. 30 - grow a phrase from one derivative",
        learn:
          "See the first phrase-building example as a demonstration that one derived broken-chord figure can generate a larger complete unit.",
        explanation:
          "Example 30 builds a complete phrase from a broken-chord derivative of Ex. 21d. Motive features remain traceable across the phrase, showing how isolated motive-forms can become continuous phrase material.",
        instruction:
          "Play the reduction and follow the four related cells. Choose the statement that best captures why Ex. 30 is placed first in the phrase-building sequence.",
        recognition:
          "Do the later cells feel like consequences of one derivative rather than new material introduced each time?",
        source: {
          reference: "Example 30 - A phrase built from a broken-chord derivative (Ex. 21d)",
          exampleIds: ["s03.ex30"],
          focus:
            "The source map records the phrase-building role of Ex. 30. The PLAY / LAB chain below applies the same principle without claiming to be Schoenberg's notation.",
        },
        terms: [
          {
            term: "Derivative",
            definition:
              "Material produced from an earlier motive-form and then used as a source for further construction.",
          },
          {
            term: "Phrase building",
            definition:
              "Extending related motive-forms until they function together as a larger musical unit.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Trace the derivative through the phrase",
        successLabel: "You heard one derivative generate a larger unit",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.ex30];
        return [
          { label: "You listened to the Ex. 30 reduction", complete: heardPlayback(experiments) },
          { label: "You traced it in more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified one derivative growing into a phrase", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex31,
        letter: "G",
        title: "Ex. 31 - retain essential rhythmic features",
        learn:
          "Hear how ancillary notes can vary the original form while its essential rhythmic features keep the motive-forms closely related.",
        explanation:
          "In Ex. 31 the original form is varied by adding ancillary notes while retaining all notes of the basic motive. The motive-forms remain closely related because their essential rhythmic features are preserved.",
        instruction:
          "Play the complete first bar of Ex. 31a and hear its eighth-eighth-dotted-quarter-eighth-eighth-sixteenth-sixteenth profile. Then compare the changed cells below and listen for how that rhythmic identity survives even when pitch and detail change.",
        recognition:
          "If the pitch surface changes, can the rhythm still tell you immediately that the forms belong together?",
        source: {
          reference: "Example 31 - Closely related motive-forms; essential rhythmic features retained",
          exampleIds: ["s03.ex31a", "s03.ex31"],
          focus:
            "The first bar of Ex. 31a is now reproduced as native playable notation, so the printed rhythmic profile is present before the analysis map generalizes across the remaining motive-forms. The study below is separate application material.",
        },
        terms: [
          {
            term: "Ancillary note",
            definition:
              "An added note that elaborates the motive without replacing its basic material.",
          },
          {
            term: "Essential rhythmic feature",
            definition:
              "A characteristic duration or accent pattern retained strongly enough to unify changed motive-forms.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear rhythm unify changed forms",
        successLabel: "You identified rhythm as the retained essential feature",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.ex31];
        return [
          { label: "You listened to the Ex. 31 reduction", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified retained essential rhythm", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex32,
        letter: "H",
        title: "Ex. 32 - preserve rhythm, change direction and pitch level",
        learn:
          "Hear how strict rhythmic preservation can hold motive-forms together despite changes of interval, direction and transposition.",
        explanation:
          "Ex. 32 preserves the rhythm while interval and direction change. The motive-forms therefore remain closely related. Combined with transposition to other scale degrees, this procedure can generate much longer thematic spans.",
        instruction:
          "Play the four cells. Their duration pattern stays fixed while contour and pitch level change. Choose the statement that best describes the relationship.",
        recognition:
          "How far can pitch direction change before the repeated rhythm becomes the main carrier of identity?",
        source: {
          reference: "Example 32 - Rhythm strictly preserved; changes of direction and transposition",
          exampleIds: ["s03.ex32"],
          focus:
            "The source map preserves the relationship named in Ex. 32: strict rhythmic identity with changed direction and pitch level. The study below applies it separately.",
        },
        terms: [
          {
            term: "Transposition",
            definition:
              "Movement of a motive-form to another pitch level while preserving its internal relationships.",
          },
          {
            term: "Direction",
            definition:
              "The upward or downward course of intervals within the motive-form.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Separate rhythm from pitch direction",
        successLabel: "You heard strict rhythm preserve relationship",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.ex32];
        return [
          { label: "You listened to the Ex. 32 reduction", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified strict rhythm with changed direction/transposition", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex33,
        letter: "I",
        title: "Ex. 33 - combine farther-reaching changes",
        learn:
          "Hear a more remote family resemblance when rhythm, ancillary notes, intervals and direction all change together.",
        explanation:
          "Ex. 33 produces more far-reaching variations by combining rhythmic changes with ancillary notes and changes of interval and direction. Some attempts will sound stiff or overcrowded; making many such sketches is still useful because it exposes which combinations remain clear and which do not.",
        instruction:
          "Play the cells and compare them with Exs. 31-32. Choose the statement that best explains why the more complicated variants still belong to the same family.",
        recognition:
          "Can you still trace the derivation even when several characteristic features are being altered at once?",
        source: {
          reference: "Example 33 - farther-reaching variations through combined changes",
          exampleIds: ["s03.ex33"],
          focus:
            "The source map records Schoenberg's farther-reaching combined changes in Ex. 33. The study below deliberately combines parameters as application.",
        },
        terms: [
          {
            term: "Farther-reaching variation",
            definition:
              "A more remote motive-form produced by changing several features while retaining enough derivation to remain comprehensible.",
          },
          {
            term: "Sketch",
            definition:
              "A technical compositional trial used to explore methods of variation even when the immediate result is not yet elegant.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Trace remote derivation",
        successLabel: "You heard several changes remain part of one derivational process",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.ex33];
        return [
          { label: "You listened to the Ex. 33 reduction", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified combined, farther-reaching variation", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex34,
        letter: "J",
        title: "Ex. 34 - remote forms must still become phrases",
        learn:
          "Use rhythmic shifting, added upbeats, reduction and omission without letting remote motive-forms become incomprehensible.",
        explanation:
          "Ex. 34 combines rhythmic shifts, added upbeats, reduction and omission of features. These rearrangements can provide material for continuation and contrast, but remote variants can endanger comprehensibility. The result still needs to behave as a true phrase - a complete musical unit rather than a collection of transformations.",
        instruction:
          "Play the passage and notice the rests, shifted entries and thinning material. Choose the statement that captures both requirements: remote transformations can be useful, but the result still has to read as a phrase.",
        recognition:
          "Does the reduction still have enough continuity to sound intentionally derived, or have the shifts and omissions broken comprehensibility?",
        source: {
          reference: "Example 34 - Rhythmic shifts, added upbeats, reduction, omission of features",
          exampleIds: ["s03.ex34"],
          focus:
            "The source map follows Ex. 34's shifts, upbeats, reduction and omission, together with Schoenberg's warning that the result must remain comprehensible and phrase-like.",
        },
        terms: [
          {
            term: "Rhythmic shifting",
            definition:
              "Moving characteristic material to new metric positions.",
          },
          {
            term: "Remote motive-form",
            definition:
              "A derivative whose relationship to the source is less immediate because several features have changed.",
          },
          {
            term: "Comprehensibility",
            definition:
              "The listener's ability to follow the relationship and formal function despite variation.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Balance remoteness and comprehensibility",
        successLabel: "You heard why remote variation still has to produce a phrase",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.ex34];
        return [
          { label: "You listened to the Ex. 34 reduction", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified remote variation plus the phrase requirement", complete: state?.decision === "related" },
        ];
      },
    },
  ],
};
