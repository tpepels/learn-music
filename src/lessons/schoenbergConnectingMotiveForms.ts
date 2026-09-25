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
          "Musical logic can arise from several kinds of common factor at once. Shared pitch or interval content links forms to the same source; rhythmic similarity can make changed forms feel immediately related; coherent harmony can reinforce the connection even when the melodic surface changes. No single factor has to remain identical in every derivative.

The practical problem is balance. Too much sameness produces stiffness and mere repetition; too little shared material makes the succession sound arbitrary. A convincing phrase keeps enough common ground for the listener to follow the derivation while allowing enough contrast for the music to move.",
        instruction:
          "Audition Too much sameness, Connected motive-forms and Disconnected ideas all the way through rather than judging the first changed cell alone. Listen for which version lets each new form feel like a consequence of what came before.

Choose the version in which relationship remains audible without collapsing into exact repetition. Be able to name at least one common factor - rhythm, contour, interval content, pitch content or harmonic direction - that helps the chain hold together.",
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
          "Connection is easier to hear when change is distributed rather than abrupt. An intermediate motive-form can preserve one feature from the earlier form while already introducing another feature that belongs to the later form. Rhythm, interval shape, contour and pitch content can all serve this bridging function.

This makes the bridge more than a compromise between two endpoints. It can actively prepare the destination so that a remote form sounds earned when it arrives. The listener should be able to hear a chain of relationships, not simply notice that all three forms came from the same original source on paper.",
        instruction:
          "The first and third forms are fixed. Compare Weak bridge, Connecting bridge and Foreign insertion in the middle position, but do not stop listening at the bridge itself.

Continue into the destination and ask whether the middle form made that arrival more intelligible. Choose the bridge that preserves a perceptible line of relationship across all three forms rather than merely sounding pleasant in isolation.",
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
          "A broken connection does not have to be repaired by restoring a literal copy. Derivation can remain audible through rhythmic features, transposed shapes, ancillary notes, displacement, reduction or omission. Different forms may preserve different evidence as long as the chain remains comprehensible.

The useful question is therefore diagnostic: what exactly makes the offending form sound foreign? Repair only enough of that relationship to restore continuity. If every detail is forced back toward the source, the phrase loses the very variation that should make it progress.",
        instruction:
          "a and a¹ establish the family, but a² breaks the chain. Listen once before editing and decide whether the problem is mainly contour, interval pattern, pitch content or rhythmic placement.

Edit steps 9-12 in Piano roll until a² shares enough evidence with the family to belong again. Then listen to all four forms from the beginning. Stop when the repair restores continuity without turning a² into a duplicate.",
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
          "Motive-forms are not valuable merely because their derivation can be demonstrated. Once they are combined, they must also fulfil phrase functions: one form may establish the idea, another continue it, another intensify or contrast it, and another help the unit close. Derivation supplies coherence, but phrase direction supplies purpose.

This is the point where motivic technique and form meet. A phrase built from perfectly related forms can still fail if it sounds like a catalogue. The forms must create an intelligible progression with a sense of beginning, continuation and enough completion to be grasped as one unit.",
        instruction:
          "Choose three transformations for a¹, a² and a³, but assign them phrase jobs rather than treating them as three independent demonstrations. Decide which form should feel like continuation, which should intensify or redirect the phrase, and which should help it settle.

Listen to the complete result, inspect two notations, then revise at least one pitch if a connection feels weak or mechanical. Keep the derivation clear while making the four forms sound like one purposeful phrase.",
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
          "Melodic coherence depends not only on motivic derivation but also on the larger shape of the line. A balanced progression often moves in waves: elevations are answered by depressions, higher points are approached through lesser peaks and recessions, and long motion in one direction is eventually balanced by motion in the other.

Large leaps can be made more intelligible when they are compensated by stepwise motion in the opposite direction, and a manageable overall compass helps the listener retain the line. These are not rigid formulas; they are ways of preventing a succession of locally related motive-forms from producing an ungainly global contour.",
        instruction:
          "Play the complete melody once without analysing it, then follow its rises and recessions in Staff view. Notice where an intermediate high point prepares the later, stronger one and where downward motion provides relief.

Switch to Degrees and compare the same contour abstractly. Choose the description that best matches the large melodic wave rather than focusing on one isolated interval.",
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
        title: "Grow a phrase from one derivative",
        learn:
          "See the first phrase-building example as a demonstration that one derived broken-chord figure can generate a larger complete unit.",
        explanation:
          "A single derivative can provide enough material for a complete phrase when its characteristic features are redistributed across a longer span. The point is not to repeat the derivative cell unchanged, but to let it generate successive related events whose local differences still point back to the same source.

This creates continuity at two levels: the listener can recognise the derivation from cell to cell, while the accumulation of those cells forms a larger phrase with its own direction. The derivative becomes material for form rather than an object displayed repeatedly.",
        instruction:
          "Play the study through all four related cells and listen for both levels at once: the local resemblance between cells and the larger direction of the phrase.

Choose the statement that best explains how one derivative can generate a complete unit. A correct answer should account for continuity as well as transformation.",
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
          { label: "You listened to the derivative phrase study", complete: heardPlayback(experiments) },
          { label: "You traced it in more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified one derivative growing into a phrase", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex31,
        letter: "G",
        title: "Retain essential rhythmic features",
        learn:
          "Hear how ancillary notes can vary the original form while its essential rhythmic features keep the motive-forms closely related.",
        explanation:
          "Ancillary notes can change the pitch surface considerably without destroying identity when the essential rhythmic profile remains stable. The added notes decorate or fill the intervallic content, but the listener still recognises the same temporal pattern underneath.

This is a useful example of unequal feature importance. Pitch detail is allowed to become more elaborate because rhythm is taking on a stronger unifying role. The closer the rhythmic correspondence, the farther some other features can move before the relationship becomes obscure.",
        instruction:
          "Play the complete rhythmic source until its duration profile is familiar. Then compare the changed cells without looking at the note names first and ask whether the rhythm alone is enough to identify the family.

Finally inspect the pitches and ancillary notes. Listen for how much surface change becomes possible because the rhythmic skeleton remains unusually stable.",
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
          { label: "You listened to the retained-rhythm study", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified retained essential rhythm", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex32,
        letter: "H",
        title: "Preserve rhythm while changing direction and pitch level",
        learn:
          "Hear how strict rhythmic preservation can hold motive-forms together despite changes of interval, direction and transposition.",
        explanation:
          "Rhythm can remain fixed even while intervals, contour direction and pitch level change. In such cases the repeated temporal profile becomes the principal carrier of identity, allowing the melodic surface to range much more freely than it could if every feature changed at once.

Transposition extends this principle over larger spans. A recognisable rhythmic form can appear at different scale degrees and with different intervallic detail while still sounding like one family. This provides a practical way to generate thematic length without relying on literal melodic repetition.",
        instruction:
          "Play the four cells and first listen only for the repeated duration pattern. Then replay them while following contour and pitch level.

Choose the statement that best describes why the cells remain related. The key is to separate the stable rhythmic identity from the freer melodic changes layered onto it.",
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
          { label: "You listened to the preserved-rhythm study", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified strict rhythm with changed direction/transposition", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex33,
        letter: "I",
        title: "Combine farther-reaching changes",
        learn:
          "Hear a more remote family resemblance when rhythm, ancillary notes, intervals and direction all change together.",
        explanation:
          "More remote motive-forms arise when several kinds of change are combined: rhythm may shift while ancillary notes are added and interval size or direction also changes. Family resemblance then becomes distributed across partial clues rather than carried by one nearly exact feature.

Such combinations are inherently risky. A result may be technically derived yet still sound stiff, crowded or opaque. Producing several versions is therefore part of the method: comparison reveals which combinations preserve enough comprehensibility and which have crossed the point where derivation is no longer audible.",
        instruction:
          "Play the cells after revisiting the two simpler source groups above. Identify which features have now changed simultaneously and which traces of the source remain.

Choose the statement that best explains the family resemblance. Do not accept 'they use similar notes' as sufficient if rhythm, contour and interval treatment no longer support the connection.",
        recognition:
          "Can you still trace the derivation even when several characteristic features are being altered at once?",
        source: {
          reference: "Example 33 - farther-reaching variations through combined changes",
          exampleIds: ["s03.ex31", "s03.ex32", "s03.ex33"],
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
          { label: "You listened to the remote-variation study", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified combined, farther-reaching variation", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.ex34,
        letter: "J",
        title: "Remote forms must still become phrases",
        learn:
          "Use rhythmic shifting, added upbeats, reduction and omission without letting remote motive-forms become incomprehensible.",
        explanation:
          "Rhythmic shifts, added upbeats, reduction and omission can push a motive-form far from its starting point. Those procedures are useful because they create material for continuation, contrast and formal differentiation, but the same freedom can make the derivation difficult to follow.

The final test is therefore formal as well as motivic. A remote form must still participate in a comprehensible phrase: entries should feel connected, reductions should seem purposeful, and omissions should help shape direction rather than merely fragment the material. Technical derivation alone does not guarantee musical logic.",
        instruction:
          "Play the passage from beginning to end and notice the rests, shifted entries and progressive thinning. Ask where each change helps the phrase continue and where it risks interrupting continuity.

Choose the statement that captures both requirements: remote transformations can create useful contrast, but the result still has to be graspable as one phrase rather than as disconnected evidence of derivation.",
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
          { label: "You listened to the remote-phrase study", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified remote variation plus the phrase requirement", complete: state?.decision === "related" },
        ];
      },
    },
  ],
};
