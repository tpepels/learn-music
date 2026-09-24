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
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.connecting-motive-forms",
  number: 3,
  title: "Connecting motive-forms",
  eyebrow: "Schoenberg · Connecting motive-forms",
  hero: "Make several changed ideas sound as though they belong to one thought.",
  description:
    "Chapter IV shifts from transforming a motive to connecting its different forms. Schoenberg emphasizes common content, rhythmic similarity and coherent harmony as sources of relationship, while contrast prevents the phrase from becoming monotonous.",
  overview:
    "The study phrases reduce the procedures shown around Examples 30–34 into short interactive forms. They are not literal transcriptions. Listen for common factors, compare a useful connection with too much sameness or too much foreign material, repair a broken chain, then build a four-form phrase from one basic motive.",
});

export const schoenbergConnectingMotiveFormsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.compare,
        letter: "A",
        title: "Common content, enough contrast",
        learn:
          "Hear why coherence needs shared material, but a phrase also needs enough difference to keep moving.",
        explanation:
          "Schoenberg describes common content as a chief source of relationship and coherence. Motive-forms derived from the same basic motive provide that content; rhythmic similarities can act as a further unifying element. But mere repetition becomes stiff or monotonous, so connection and contrast have to coexist.",
        instruction:
          "Audition Too much sameness, Connected motive-forms and Disconnected ideas. Listen to all four forms as one phrase, then choose the version in which the relationship stays audible without collapsing into exact repetition.",
        recognition:
          "Can you hear one family of ideas across the phrase even though no later form simply has to copy the first?",
        terms: [
          {
            term: "Common content",
            definition:
              "Musical material shared between motive-forms that makes their relationship perceptible.",
          },
          {
            term: "Coherence",
            definition:
              "The sense that successive musical events belong together and follow an intelligible logic.",
          },
          {
            term: "Contrast",
            definition:
              "Difference strong enough to create interest and function without destroying the relationship to earlier material.",
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
          {
            label: "You listened to the complete four-form phrases",
            complete: heardPlayback(experiments),
          },
          {
            label: "You chose the phrase with common content and contrast",
            complete: state?.decision === "related",
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.bridge,
        letter: "B",
        title: "Choose the connecting form",
        learn:
          "Use an intermediate motive-form to make two related regions feel continuously connected.",
        explanation:
          "Chapter IV treats connection as a matter of common factors rather than identical surfaces. A useful intervening motive-form can retain enough rhythmic, intervallic or contour material to make the move toward a new form feel prepared instead of abrupt.",
        instruction:
          "The first and third forms are fixed. Compare Weak bridge, Connecting bridge and Foreign insertion in the second position. Listen to the whole phrase and choose the middle form that best preserves a perceptible line of relationship from a to a².",
        recognition:
          "Does the second form make the third sound prepared, or does the phrase feel as though it jumps to a new idea?",
        terms: [
          {
            term: "Connecting motive-form",
            definition:
              "A derived form whose shared features help link one appearance of the motive to another.",
          },
          {
            term: "Unifying element",
            definition:
              "A recurring rhythmic, intervallic, harmonic or contour feature that helps separate events be heard as related.",
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
          {
            label: "You listened through the destination, not only the bridge",
            complete: heardPlayback(experiments),
          },
          {
            label: "You chose the connecting motive-form",
            complete: state?.decision === "related",
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.repair,
        letter: "C",
        title: "Repair a broken chain",
        learn:
          "Restore relationship inside a phrase without turning every form into an exact copy.",
        explanation:
          "Schoenberg's examples show phrases built from several related motive-forms. Some preserve essential rhythmic features while direction or pitch level changes; others use shifts, upbeats, reduction or omission. The important point is not one permitted recipe, but that the forms remain demonstrably connected to the same basic motive.",
        instruction:
          "a and a¹ establish the family, but a² breaks away. Edit steps 9–12 in Piano roll until a² shares enough contour, interval pattern or pitch content with the basic motive to belong again. Keep a³ as the later comparison and listen to all four forms.",
        recognition:
          "After your repair, does a² sound like a changed member of the same family rather than a replacement idea?",
        terms: [
          {
            term: "Derived form",
            definition:
              "A version whose material can be traced back to the basic motive through preserved and altered features.",
          },
          {
            term: "Omission",
            definition:
              "Removing a feature or note while retaining enough other material for the relation to remain comprehensible.",
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
          {
            label: "You edited the broken motive-form",
            complete: changedControl(experiments, "study.note-edit", 2),
          },
          {
            label: "You listened to the repaired phrase",
            complete: heardPlayback(experiments),
          },
          {
            label: "The original basic motive is still intact",
            complete: studyConnectionSourceIntact(notes),
          },
          {
            label: "All three later forms relate to the basic motive",
            complete: studyConnectionRelatedFormCount(notes) === 3,
          },
          {
            label: "The phrase still contains genuine variation",
            complete: studyConnectionChangedFormCount(notes, durations) >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_CONNECTION_IDS.compose,
        letter: "D",
        title: "Build a phrase from four motive-forms",
        learn:
          "Use several different transformations while keeping one basic motive audible across the whole phrase.",
        explanation:
          "The point of Chapter IV is larger than producing isolated variations. A basic motive can generate many phrase beginnings and continuations when its forms share enough common factors. The transformations now have to function together as a phrase, not merely pass individual technique checks.",
        instruction:
          "Choose three different transformations for a¹, a² and a³. Listen to the resulting phrase, inspect at least two notations, then revise at least one pitch in Piano roll if a connection feels weak or mechanically generated. Keep all four forms related while making the later three genuinely different from a.",
        recognition:
          "Can you hear the basic motive's identity across all four forms while also hearing a reason for the phrase to continue?",
        terms: [
          {
            term: "Phrase construction",
            definition:
              "Combining related motive-forms so that small musical units form a coherent larger statement.",
          },
          {
            term: "Relationship",
            definition:
              "The audible connection created by preserved common factors across changed motive-forms.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Construct the connected phrase",
        successLabel: "One basic motive now generates a varied four-form phrase",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_CONNECTION_IDS.compose];
        const notes = state?.notes ?? [];
        const durations = state?.durations ?? [];
        return [
          {
            label: "You assigned three transformations to the later forms",
            complete: (state?.operations.length ?? 0) >= 3,
          },
          {
            label: "You listened to the complete phrase",
            complete: heardPlayback(experiments),
          },
          {
            label: "You revised at least one generated pitch",
            complete: changedControl(experiments, "study.note-edit"),
          },
          {
            label: "You inspected more than one notation",
            complete:
              (experiments["study.notation"]?.values.length ?? 0) >= 2,
          },
          {
            label: "Every later form remains related to the basic motive",
            complete: studyConnectionRelatedFormCount(notes) === 3,
          },
          {
            label: "All three later forms are genuinely changed",
            complete: studyConnectionChangedFormCount(notes, durations) === 3,
          },
        ];
      },
    },
  ],
};
