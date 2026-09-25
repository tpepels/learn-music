import {
  SCHOENBERG_PERIOD_IDS,
  studyPeriodHasCadentialClose,
  studyPeriodHasContrast,
  studyPeriodHasReturn,
} from "../music/study";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.period",
  number: 6,
  title: "The period - antecedent & consequent",
  eyebrow: "Schoenberg · The Period",
  hero:
    "Delay the return of the opening idea, make the first half genuinely contrasting, then let the consequent return and close more strongly.",
  description:
    "A period differs from a sentence chiefly in when repetition occurs. The opening phrase is followed by more remote but related material to form an antecedent; only then does the consequent bring the opening back and reshape it toward a stronger cadence.",
  overview:
    "Build the period as a chain of functions rather than an eight-measure diagram: opening idea, contrasting continuation, caesura, return, and stronger close.",
});

function studiedSource(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimumSegments: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >=
    minimumSegments;
}

function inspectedTwoNotations(
  experiments: LessonContext["experiments"],
): boolean {
  return (experiments["study.notation"]?.values.length ?? 0) >= 2;
}

export const schoenbergPeriodLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_PERIOD_IDS.distinguish,
        letter: "A",
        title: "Hear postponed repetition",
        learn:
          "Distinguish a period from a sentence by listening for when the opening idea returns.",
        explanation:
          "A sentence normally confirms its opening idea immediately. A period does something different: after the first phrase, the music moves into more remote but still coherent motive-forms, postponing the larger repetition. That delay creates the first half of the period, the antecedent. Only after contrast has been established does the second half bring back recognisable opening material.\n\nThe timing of repetition is therefore more important than an abstract A/B label. Immediate repetition strengthens one basic idea early; postponed repetition creates an expectation that the consequent later satisfies. If the intervening material is completely unrelated, the return loses logic. If nothing intervenes, the structure behaves more like a sentence opening.",
        instruction:
          "Read the source map, then audition Immediate repetition, Postponed return and Unrelated continuation in the study below. Listen through the whole sixteen-step span before deciding.\n\nChoose Postponed return only when you can hear three stages: an opening idea, contrasting but related material, and the beginning of a recognisable return. Switch notation once so you can verify what your ear is following rather than deciding from button labels alone.",
        recognition:
          "Do you hear the opening confirmed immediately, or does related contrast intervene before the opening begins to return?",
        source: {
          reference: "Chapters VI-VII - antecedent and consequent of the period",
          focus:
            "The period postpones repetition: contrasting motive-forms complete the antecedent before the consequent returns and modifies earlier material.",
          exampleIds: ["s06.period-overview"],
        },
        terms: [
          {
            term: "Period",
            definition:
              "A thematic structure in which an antecedent is followed by a consequent that returns and modifies earlier material.",
          },
          {
            term: "Antecedent",
            definition:
              "The first half of a period: opening material plus a contrasting continuation leading to a caesura.",
          },
          {
            term: "Consequent",
            definition:
              "The answering half that returns enough of the antecedent to be recognised and moves toward stronger closure.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the form",
        successLabel: "You can hear postponed repetition as the defining period relation",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_PERIOD_IDS.distinguish];
        return [
          {
            label: "You compared the different repetition timings",
            complete:
              (experiments["study.sentence-mode"]?.values ?? []).includes("delayed"),
          },
          {
            label: "You listened to the comparison",
            complete: heardPlayback(experiments),
          },
          {
            label: "You identified postponed return as the period behaviour",
            complete: state?.decision === "related",
          },
          {
            label: "You inspected the period overview",
            complete: studiedSource(experiments, "s06.period-overview", 2),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_PERIOD_IDS.antecedent,
        letter: "B",
        title: "Build contrast inside the antecedent",
        learn:
          "Let the antecedent move away from its opening without losing the thread that connects the two phrases.",
        explanation:
          "Because the period postpones repetition, the second phrase of the antecedent has to create contrast. More remote motive-forms can do this through increased activity, a different register or direction, a changed contour, or even reduction into longer and fewer notes. Contrast is not synonymous with novelty: the new phrase should still grow from recognisable material.\n\nThe antecedent also needs punctuation. Its caesura is heard through both melody and harmony, often with a change of contour, a recession from a previous high point, a reduction of activity, or motion toward dominant function. If the remote derivative arrives too abruptly, a shared feature such as an upbeat or connective motive can bridge the gap.",
        instruction:
          "Work through the five source-analysis tabs before judging the study. Then play the first sixteen steps as one antecedent: steps 1-8 establish the opening, while steps 9-16 move into contrasting material and approach a caesura.\n\nCompare Staff and Degrees. Identify what changed in the second phrase - activity, contour, register, interval content or reduction - and what still connects it to the opening. Do not treat the midpoint simply as a barline; listen for punctuation.",
        recognition:
          "Does the second phrase create enough contrast to move forward while still sounding derived from the opening, and does its ending feel like a caesura rather than a full stop?",
        source: {
          reference: "Chapter VI - construction of the antecedent",
          focus:
            "The later antecedent phrase uses more remote motive-forms; contrast can come from rhythmic activity, contour, register or reduction, while the caesura supplies punctuation.",
          exampleIds: ["s06.antecedent"],
        },
        terms: [
          {
            term: "Caesura",
            definition:
              "A perceptible punctuation inside a form, comparable to a comma or semicolon rather than a final ending.",
          },
          {
            term: "Remote motive-form",
            definition:
              "A derivative that changes more features of the basic motive while retaining enough relation to remain comprehensible.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Trace the antecedent",
        successLabel: "You can hear contrast and punctuation working together",
      }),
      evaluate: ({ compositionStudy, experiments }) => [
        {
          label: "You worked through the antecedent analysis",
          complete: studiedSource(experiments, "s06.antecedent", 4),
        },
        {
          label: "You listened through the antecedent",
          complete: heardPlayback(experiments),
        },
        {
          label: "You compared two notation views",
          complete: inspectedTwoNotations(experiments),
        },
        {
          label: "The study contains a contrasting second phrase",
          complete: studyPeriodHasContrast(
            compositionStudy[SCHOENBERG_PERIOD_IDS.antecedent]?.notes ?? [],
          ),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_PERIOD_IDS.consequent,
        letter: "C",
        title: "Return, then change what the cadence needs",
        learn:
          "Make the consequent recognisable as a return without forcing it to copy the antecedent all the way to the cadence.",
        explanation:
          "The consequent is a modified repetition of the antecedent. An unchanged complete copy is unusual because the second half has a different formal job: it must produce the stronger close. The opening of the consequent can therefore recall the antecedent quite closely while the harmony and melody begin to deviate before the final cadence.\n\nCadence affects melodic contour as well as harmony. Activity may intensify through smaller values, or longer notes may deliberately resist that tendency; either way, the closing shape normally differentiates itself from the material before it. A characteristic rhythm can preserve identity even when the melodic contour changes substantially.",
        instruction:
          "Work through the consequent analysis and then play all 32 steps. Listen for the return at step 17 before concentrating on the ending. The consequent should first remind you of the antecedent and then begin changing as closure approaches.\n\nSwitch notation once. Compare steps 1-8 with 17-24 for the return, then compare the antecedent ending with steps 25-32. Locate the point where cadential function starts forcing melodic or harmonic change.",
        recognition:
          "Can you hear both facts at once: this is recognisably the earlier material returning, and the ending has changed because the music now needs a stronger cadence?",
        source: {
          reference: "Chapter VII - consequent and cadence contour",
          focus:
            "The consequent returns the antecedent but normally changes before the cadence; rhythm can preserve identity while harmony and contour adapt toward closure.",
          exampleIds: ["s06.consequent"],
        },
        terms: [
          {
            term: "Cadence contour",
            definition:
              "The melodic shape associated with approaching and articulating a cadence.",
          },
          {
            term: "Modified repetition",
            definition:
              "A return recognisable as earlier material even though some features are changed to serve a new function.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Hear return and closure",
        successLabel: "The consequent now reads as a return with a different formal destination",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_PERIOD_IDS.consequent];
        return [
          {
            label: "You worked through the consequent analysis",
            complete: studiedSource(experiments, "s06.consequent", 4),
          },
          {
            label: "You listened through antecedent and consequent",
            complete: heardPlayback(experiments),
          },
          {
            label: "You compared two notation views",
            complete: inspectedTwoNotations(experiments),
          },
          {
            label: "The consequent returns the opening relation",
            complete: studyPeriodHasReturn(state?.notes ?? []),
          },
          {
            label: "The study closes through V to I",
            complete: studyPeriodHasCadentialClose(
              state?.notes ?? [],
              state?.harmony ?? [],
            ),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_PERIOD_IDS.compose,
        letter: "D",
        title: "Write a complete period",
        learn:
          "Coordinate contrast, caesura, return and stronger closure in one comprehensible period.",
        explanation:
          "The eight-measure practice form is useful because it separates the jobs clearly: the opening phrase establishes material, the rest of the antecedent creates coherent contrast and reaches a caesura, the consequent restores enough of the opening to satisfy the delayed repetition, and its later phrase adapts toward stronger closure. The functions matter more than equal arithmetic.\n\nA convincing period therefore needs two kinds of memory. Local memory connects the contrasting phrase to the opening; longer-range memory lets the consequent sound like a return after that contrast. The cadence then has permission to diverge because the relationship has already been re-established.",
        instruction:
          "Use the 32-step period as a starting point. In Piano roll, change at least four notes while preserving its four functions: opening, contrasting antecedent continuation, recognisable consequent return, and cadential close.\n\nDo not simply decorate every section equally. Make the antecedent contrast audible, keep the beginning of the consequent related to the opening, and leave the final V-I close intact. Play all 32 steps after each substantial revision and inspect one other notation view before finishing.",
        recognition:
          "With the screen ignored, can you hear a first-half question-like punctuation, a return of familiar material, and a second ending that closes more decisively?",
        source: {
          reference: "Chapters VI-VII - practice of period construction",
          focus:
            "The practice period coordinates postponed repetition, coherent antecedent contrast, caesura, modified return and a stronger consequent cadence.",
          exampleIds: [
            "s06.period-overview",
            "s06.antecedent",
            "s06.consequent",
          ],
        },
        terms: [
          {
            term: "Antecedent-consequent relation",
            definition:
              "The long-range relation in which the second half answers the first by returning its material and changing its ending.",
          },
          {
            term: "Comprehensibility",
            definition:
              "The listener's ability to retain and connect the musical relationships across the whole period.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Complete the period",
        successLabel: "Your period now contrasts, returns and closes",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_PERIOD_IDS.compose];
        return [
          {
            label: "You revised the period rather than accepting the preset",
            complete: changedControl(experiments, "study.note-edit", 4),
          },
          {
            label: "You listened to the complete period",
            complete: heardPlayback(experiments),
          },
          {
            label: "You checked more than one notation",
            complete: inspectedTwoNotations(experiments),
          },
          {
            label: "The antecedent contains contrast",
            complete: studyPeriodHasContrast(state?.notes ?? []),
          },
          {
            label: "The consequent recalls the opening",
            complete: studyPeriodHasReturn(state?.notes ?? []),
          },
          {
            label: "The period retains its cadential close",
            complete: studyPeriodHasCadentialClose(
              state?.notes ?? [],
              state?.harmony ?? [],
            ),
          },
        ];
      },
    },
  ],
};
