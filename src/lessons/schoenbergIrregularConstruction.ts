import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function notes(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function analysedSegments(
  experiments: LessonContext["experiments"],
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(
    values.filter((value) => value.startsWith("s12.irregular-construction:")),
  ).size >= minimum;
}

function offCentreBreak(sequence: Array<number | null>): boolean {
  for (let index = 3; index <= 11; index += 1) {
    if (index === 7 || index === 8) continue;
    if (sequence[index] === null && sequence[index + 1] === null) return true;
  }
  return false;
}

function hasUnequalActivity(sequence: Array<number | null>): boolean {
  const left = notes(sequence.slice(0, 8)).length;
  const right = notes(sequence.slice(8, 16)).length;
  return Math.abs(left - right) >= 2;
}

const lesson = lessonContentSchema.parse({
  id: "schoenberg.irregular-construction",
  number: 12,
  title: "Uneven, irregular & asymmetrical construction",
  eyebrow: "Schoenberg · Small forms",
  hero:
    "Let phrase length follow the musical idea, then restore balance through cadence, repetition and proportion.",
  description:
    "Regular four- and eight-measure designs are training models, not laws. Unequal units can sound fluent and inevitable when their motives, punctuation and harmonic direction explain the extra or missing space.",
  overview:
    "Learn to distinguish irregularity from disorder. A phrase can be 3+3, 4+6, 5+7 or something still less regular and remain coherent if the ear can understand why each span lasts as long as it does.",
});

export const schoenbergIrregularConstructionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.irregular-construction.a",
        letter: "A",
        title: "Separate unevenness from disorder",
        learn:
          "Hear that unequal lengths can still produce a clear musical balance when functions remain intelligible.",
        explanation:
          "Regular construction is useful because repetition and symmetry make relationships easy to hear. But regularity is not identical with coherence. A phrase can contain an odd number of measures, or a period can divide into unequal parts, without losing its identity. The important question is whether the musical functions remain clear: where an idea begins, where it continues, where punctuation occurs, and why one span needs more room than another.\n\nUnevenness becomes convincing when it grows from material. A motive may naturally require an extra repetition, a sequence may need one more stage, or a cadence may be prolonged so that an arrival feels proportionate to the preceding tension. Conversely, arbitrary additions merely make counting irregular. The listener should not have to know the number of measures to accept the result; the phrase should explain its own length through audible relationships.",
        instruction:
          "Work through all five analysis points, then play your current sixteen-step melody once without editing. Now make at least four edits that create an unequal distribution of activity between the first and second halves: one half should contain at least two more sounding notes than the other. Keep at least eight sounding notes overall and at least four different pitches. Listen again and decide whether the imbalance sounds purposeful or simply unfinished; revise until the phrase still has a clear beginning and ending.",
        recognition:
          "Does the phrase feel proportioned because the musical idea explains the unequal spans, or do you merely notice that one side is busier?",
        source: {
          reference: "Chapter XIV - Uneven, Irregular and Asymmetrical Construction",
          focus:
            "Unequal units and uneven totals can remain coherent when motive, repetition, cadence and proportion justify them.",
          exampleIds: ["s12.irregular-construction"],
        },
        terms: [
          {
            term: "Uneven construction",
            definition:
              "A design whose total length or component units are not organised in the most regular even-numbered pattern.",
          },
          {
            term: "Asymmetry",
            definition:
              "A relation in which corresponding formal parts have unequal lengths or proportions.",
          },
          {
            term: "Proportion",
            definition:
              "The perceived relationship between the sizes and weights of musical parts.",
          },
        ],
        workspace: "melody",
        checksLabel: "Make unevenness coherent",
        successLabel: "The phrase is unequal without sounding arbitrary",
      }),
      evaluate: ({ melody, experiments }) => [
        {
          label: "You studied the principles of irregular construction",
          complete: analysedSegments(experiments, 5),
        },
        {
          label: "You reshaped the phrase in this exercise",
          complete: changedControl(experiments, "melody.edit", 4),
        },
        { label: "You listened to the result", complete: heardPlayback(experiments) },
        {
          label: "The two halves now carry unequal activity",
          complete: hasUnequalActivity(melody),
        },
        {
          label: "The phrase still contains enough material to be coherent",
          complete: notes(melody).length >= 8 && new Set(notes(melody)).size >= 4,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.irregular-construction.b",
        letter: "B",
        title: "Move the internal punctuation",
        learn:
          "Break the phrase somewhere other than its exact midpoint and make that new boundary sound intentional.",
        explanation:
          "Asymmetry becomes especially audible when a phrase boundary moves away from the expected midpoint. That does not mean inserting silence at a random position. The new punctuation needs to be prepared by contour, rhythm or harmonic implication, and the material after the break must sound like a continuation or answer rather than a separate fragment. The listener should hear two unequal functions, not one phrase damaged in the middle.\n\nA useful way to test the construction is to remove the visual grid from attention. If the first span reaches a local point of rest and the second begins with enough connection to continue the argument, unequal lengths can feel natural. The displaced boundary can even increase fluency because the phrase no longer seems forced into a symmetrical container. What matters is balance of function rather than equality of duration.",
        instruction:
          "Create a real internal break away from the exact centre of the sixteen-step melody. Place at least two consecutive rests somewhere between steps 4 and 12, but not exactly across the middle boundary. Keep at least three sounding notes before the break and at least three after it. Make at least three fresh melody edits around the boundary, then play the phrase from the beginning. Adjust the notes immediately before and after the rests until the first span sounds punctuated and the second sounds connected rather than accidental.",
        recognition:
          "Can you hear where the first span ends without counting, and does the continuation after the break feel like the next part of the same thought?",
        source: {
          reference: "Chapter XIV - unequal divisions",
          focus:
            "Asymmetrical designs can divide a coherent whole into unequal parts without losing formal balance.",
          exampleIds: ["s12.irregular-construction"],
        },
        terms: [
          {
            term: "Punctuation",
            definition:
              "A perceptible articulation or point of rest that separates one musical span from the next.",
          },
          {
            term: "Unequal division",
            definition:
              "A formal split in which the two resulting spans have different lengths.",
          },
        ],
        workspace: "melody",
        checksLabel: "Place an unequal boundary",
        successLabel: "The off-centre punctuation now sounds deliberate",
      }),
      evaluate: ({ melody, experiments }) => {
        const breakFound = offCentreBreak(melody);
        return [
          {
            label: "You reshaped the boundary rather than only adding silence",
            complete: changedControl(experiments, "melody.edit", 3),
          },
          { label: "You listened across the new break", complete: heardPlayback(experiments) },
          {
            label: "There is a two-step break away from the exact midpoint",
            complete: breakFound,
          },
          {
            label: "Both sides retain musical substance",
            complete:
              notes(melody.slice(0, 8)).length >= 3 &&
              notes(melody.slice(8, 16)).length >= 3,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.irregular-construction.c",
        letter: "C",
        title: "Earn an extension",
        learn:
          "Use repetition or continuation to make one part longer for a musical reason instead of merely filling space.",
        explanation:
          "One common source of irregular length is internal repetition. A figure may be repeated sequentially, varied, or prolonged because the harmony or contour has not yet reached its goal. The extra span then has a function: it intensifies a process that was already under way. The resulting phrase can be asymmetric while remaining easy to follow because the repeated material explains why the music continues.\n\nAn extension should therefore increase expectation or clarify direction. If an idea has already arrived and is simply copied again, the added length may feel redundant. If the repeated figure changes too drastically, it stops behaving like an extension and begins a new idea. A convincing extension balances recognition and progression: the listener hears both that the material is related and that the repetition is moving somewhere.",
        instruction:
          "Use the Motif workspace and treat steps 1-4 as the idea that earns an extension. Keep at least three sounding notes there. In a later four-step block, reuse at least two pitches from the opening but change at least one note or rest so it is not an exact copy. Make at least four edits while comparing the two blocks, then play the complete phrase. The later block should sound like a prolongation or intensification of the original idea, not a pasted duplicate and not unrelated replacement material.",
        recognition:
          "When the related block appears, do you hear why the phrase needs the extra span and where that continuation is trying to lead?",
        source: {
          reference: "Chapter XIV - internal repetition and extension",
          focus:
            "Sequential or varied internal repetitions can enlarge one part and create asymmetry while preserving coherence.",
          exampleIds: ["s12.irregular-construction"],
        },
        terms: [
          {
            term: "Internal repetition",
            definition:
              "A repeated or varied unit inside a larger phrase that can prolong one formal function.",
          },
          {
            term: "Extension",
            definition:
              "Additional material that lengthens an existing function rather than beginning a new principal section.",
          },
        ],
        workspace: "motif",
        checksLabel: "Justify the extra span",
        successLabel: "The extension now grows from existing material",
      }),
      evaluate: ({ melody, experiments }) => {
        const opening = notes(melody.slice(0, 4));
        const later = notes(melody.slice(8, 12));
        const shared = later.filter((note) => opening.includes(note)).length;
        const exact = melody.slice(0, 4).every((note, i) => note === melody[8 + i]);
        return [
          {
            label: "You revised the related later block",
            complete: changedControl(experiments, "melody.edit", 4),
          },
          { label: "You listened to the extension in context", complete: heardPlayback(experiments) },
          {
            label: "The opening idea contains enough material",
            complete: opening.length >= 3,
          },
          {
            label: "The later block retains at least two opening pitches",
            complete: shared >= 2,
          },
          {
            label: "The extension is varied rather than copied exactly",
            complete: !exact,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.irregular-construction.d",
        letter: "D",
        title: "Balance an irregular phrase",
        learn:
          "Combine unequal activity, off-centre punctuation and a convincing close into one phrase that sounds free but controlled.",
        explanation:
          "Irregular construction is most useful when it disappears into the musical experience. The listener may notice that a phrase breathes unusually or that a continuation lasts longer than expected without needing to identify a numerical scheme. That fluency comes from compensating relationships: a longer first span may be answered by a stronger cadence, a short continuation may carry greater rhythmic density, or an extension may be balanced by a concise ending.\n\nThe final test is not whether the phrase avoids symmetry but whether every deviation has a purpose. Regularity should remain available whenever it serves the idea. Deliberate irregularity is harder, not easier, because the composer must replace the support of a familiar template with stronger control of motive, pacing and punctuation. The phrase should feel inevitable after hearing even if its proportions are difficult to predict beforehand.",
        instruction:
          "Make a final sixteen-step phrase with at least eight sounding notes, at least four pitch classes, unequal activity between the two halves, and a two-step internal break away from the exact midpoint. End on C, E or G so the final gesture has a stable resting point. Make at least six edits during this pass and listen from start to finish twice: once following the internal boundary and once ignoring structure entirely. Keep revising until the phrase feels complete without needing the regular eight-plus-eight expectation.",
        recognition:
          "Does the finished phrase sound naturally proportioned even though its internal spans are unequal, and can you hear what compensates for that asymmetry?",
        source: {
          reference: "Chapter XIV - complete irregular construction",
          focus:
            "Irregularity succeeds through balance, proportion and musical necessity rather than arbitrary avoidance of regular lengths.",
          exampleIds: ["s12.irregular-construction"],
        },
        terms: [
          {
            term: "Compensation",
            definition:
              "Balancing one formal irregularity with another musical factor such as stronger closure, greater density or a shorter answering span.",
          },
          {
            term: "Fluency",
            definition:
              "The sense that musical events proceed naturally and continuously without sounding forced by a template.",
          },
        ],
        workspace: "melody",
        checksLabel: "Complete the irregular phrase",
        successLabel: "The phrase now sounds free in length but controlled in form",
      }),
      evaluate: ({ melody, experiments }) => {
        const sounding = notes(melody);
        const last = sounding.at(-1);
        return [
          {
            label: "You made a substantial final revision",
            complete: changedControl(experiments, "melody.edit", 6),
          },
          { label: "You listened through the complete phrase", complete: heardPlayback(experiments) },
          {
            label: "The phrase has enough material and pitch variety",
            complete: sounding.length >= 8 && new Set(sounding.map((n) => n % 12)).size >= 4,
          },
          {
            label: "Activity is distributed asymmetrically",
            complete: hasUnequalActivity(melody),
          },
          {
            label: "An off-centre break articulates the form",
            complete: offCentreBreak(melody),
          },
          {
            label: "The phrase ends on a stable C-major chord tone",
            complete: last !== undefined && [0, 4, 7].includes(last % 12),
          },
        ];
      },
    },
  ],
};
