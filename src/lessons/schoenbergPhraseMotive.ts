import {
  SCHOENBERG_STUDY_IDS,
  studyBlockNoteCount,
  studyBlocksAreIdentical,
  studyBlocksAreRelated,
} from "../music/study";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
  type LessonContext,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.phrase-motive",
  number: 1,
  title: "Form & phrase",
  eyebrow: "Schoenberg · Chapters I-II",
  hero: "Learn how a small musical unit becomes comprehensible, varied and usable.",
  description:
    "A phrase is the smallest structural unit that can be heard as a coherent musical thought. The lesson moves from recognising complete phrases to constructing them with chord tones, changing note-values, upbeats, passing notes, repetitions and embellishment.",
  overview:
    "This lesson now follows that progression in detail. Analyse literature examples, then work through the practical sequence of Examples 5-11 before constructing your own phrase study.",
});

function revisedStepCount(values: string[]): number {
  const editsByStep = new Map<string, Set<string>>();
  values.forEach((entry) => {
    const separator = entry.indexOf(":");
    if (separator < 0) return;
    const step = entry.slice(0, separator);
    const value = entry.slice(separator + 1);
    const seen = editsByStep.get(step) ?? new Set<string>();
    seen.add(value);
    editsByStep.set(step, seen);
  });
  return [...editsByStep.values()].filter((valuesForStep) => valuesForStep.size >= 2).length;
}

function inspectedTwoNotations(
  experiments: LessonContext["experiments"],
): boolean {
  return (experiments["study.notation"]?.values.length ?? 0) >= 2;
}

export const schoenbergPhraseMotiveLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.analyse,
        letter: "A",
        title: "Phrase as a comprehensible unit",
        learn:
          "Hear the phrase as a small structural unit, then locate the characteristic material that helps it hold together.",
        explanation:
          "Form begins with organization: musical events must be related strongly enough that the listener can retain and connect them. Subdivision helps because an idea that is too extended or insufficiently articulated becomes difficult to grasp. The phrase is the first practical unit of that organization - a group of integrated events with enough completeness to be heard as one musical thought.\n\nA phrase is not defined by a fixed number of notes or measures. Its size depends on metre and tempo, and it often crosses metrical divisions instead of filling them neatly. What matters is continuity through the body of the phrase and a perceptible differentiation at the end. That punctuation may come from rhythmic reduction, a relaxation of contour, smaller intervals, fewer notes, or another audible change that makes the boundary clear.",
        instruction:
          "First play the entire phrase without selecting anything. Listen for where it seems to begin, how it continues, and where its energy starts to relax. Then mark steps 1-4 as the opening characteristic idea and compare at least two notation views.\n\nThe bracket is only an analytical aid: it identifies material that helps the phrase cohere. Do not treat four notes, one bar, or any other fixed length as the definition of a phrase.",
        recognition:
          "Can you hear one small unit being established and then carried forward toward an ending?",
        source: {
          reference: "Chapters I-II - The Concept of Form / The Phrase",
          focus:
            "Schoenberg links comprehensible form to logic, coherence and subdivision, then defines the phrase as the smallest structural unit with continuity and punctuation.",
        },
        terms: [
          {
            term: "Phrase",
            definition:
              "Schoenberg's smallest structural unit: a musical unit with a degree of completeness and continuity.",
          },
          {
            term: "Comprehensibility",
            definition:
              "The listener's ability to grasp relationships, subdivisions and functions in the music.",
          },
          {
            term: "Punctuation",
            definition:
              "A differentiated ending that makes the close of a phrase perceptible.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Analyse the phrase",
        successLabel: "You identified characteristic material inside the phrase",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.analyse];
        const selected = state?.selectedSteps ?? [];
        return [
          { label: "You listened to the whole phrase", complete: heardPlayback(experiments) },
          {
            label: "You marked all four notes of the opening idea",
            complete: [0, 1, 2, 3].every((step) => selected.includes(step)),
          },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.compare,
        letter: "B",
        title: "Literature: phrase identity can survive change",
        learn:
          "Hear how phrases can differ greatly in surface while remaining intelligible musical units.",
        explanation:
          "The literature examples deliberately resist a single formula for phrase construction. Their lengths, contours and rhythmic surfaces differ, yet each can still be heard as a coherent unit because melodic motion, rhythm and implied harmony cooperate. Internal repetitions or characteristic figures may help bind the phrase, but they are features inside the larger unit rather than a substitute for it.\n\nEx. 2e, from the opening of Beethoven's Eroica, is useful because the material is simple enough to hear the organization directly. The two slurred spans create internal grouping, while the arpeggiated contour and harmonic stability make the whole line intelligible as one phrase rather than as isolated notes.",
        instruction:
          "Play Ex. 2e several times. Follow the two internal spans, but listen past the slurs to the complete phrase: where does the line feel stable, where does it continue, and where does it finally settle?\n\nThen audition Exact repeat, Related change and Unrelated change below. Choose the version that changes enough to avoid mere duplication while preserving enough contour, rhythm or harmonic implication to remain part of the same musical thought.",
        recognition:
          "Which version sounds changed while still belonging to the same musical thought?",
        source: {
          reference: "Example 2e - Beethoven, Symphony No. 3-I",
          focus:
            "The complete melodic line reproduced in Schoenberg's Ex. 2e is re-engraved as native playable notation. The study workspace underneath is a separate transfer exercise, not a substitute for the source.",
          exampleIds: ["s01.ex2e"],
        },
        terms: [
          {
            term: "Phrase identity",
            definition:
              "The perceptible unity of a phrase despite variation in its surface details.",
          },
          {
            term: "Relationship",
            definition:
              "The musical connection that lets changed material remain intelligible as belonging to what came before.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Compare phrase relationships",
        successLabel: "You separated related change from mere repetition and replacement",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.compare];
        const variants = experiments["study.variant"]?.values ?? [];
        return [
          {
            label: "You compared exact, related and unrelated versions",
            complete: ["exact", "related", "unrelated"].every((variant) =>
              variants.includes(variant),
            ),
          },
          { label: "You listened while comparing", complete: heardPlayback(experiments) },
          { label: "You chose the related change", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.repair,
        letter: "C",
        title: "Beethoven: repair the relationship",
        learn:
          "Keep a phrase recognisable while changing its continuation.",
        explanation:
          "A phrase may contain features that recur and act as points of recognition. Those features can be rhythmic, intervallic, registral or contour-based; their importance depends on how they are treated. Preserving every detail is unnecessary, but changing every important feature at once weakens the relationship between one part of the phrase and the next.\n\nEx. 2e shows a clear contour and internal grouping. Ex. 4c is more strongly identified by repeated-note rhythm before the line begins to rise. Together they show two different ways a continuation can remain related: it may preserve the general melodic shape, or it may preserve a characteristic rhythmic behaviour while changing the pitches more freely.",
        instruction:
          "Study Ex. 2e and Ex. 4c before editing. Decide which characteristic you are going to preserve - for example the direction of the contour, a repeated-note rhythm, or the way the line moves away from and back toward a central pitch.\n\nLeave steps 1-4 unchanged. Rewrite steps 5-8 so the continuation clearly retains at least one characteristic feature, but changes enough pitch or direction that it is not a literal copy. Play the whole eight-step phrase after every substantial edit.",
        recognition:
          "Does the second half still sound like the same phrase family without simply repeating the first half?",
        source: {
          reference: "Example 2e - Beethoven, Symphony No. 3-I · Example 4c - Beethoven, Symphony No. 3, Scherzo",
          focus:
            "These are the examples Schoenberg chose. Ex. 2e is natively transcribed; Ex. 4c exposes the book's analytical features interactively and is explicitly marked partial until a verified note-for-note transcription is complete.",
          exampleIds: ["s01.ex2e", "s01.ex4c"],
        },
        terms: [
          {
            term: "Contour",
            definition:
              "The pattern of upward, downward and repeated motion in a melodic line.",
          },
          {
            term: "Related continuation",
            definition:
              "Later material that changes the source while preserving enough characteristic features to remain connected.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Repair the phrase",
        successLabel: "The continuation now belongs to the opening",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.repair];
        const notes = state?.notes ?? [];
        return [
          { label: "You changed at least two continuation notes", complete: changedControl(experiments, "study.note-edit", 2) },
          { label: "You listened to the repaired phrase", complete: heardPlayback(experiments) },
          {
            label: "Both four-note units contain enough material",
            complete:
              studyBlockNoteCount(notes, 0) >= 3 &&
              studyBlockNoteCount(notes, 4) >= 3,
          },
          { label: "The continuation is related to the source", complete: studyBlocksAreRelated(notes, 0, 4) },
          { label: "It is not a literal copy", complete: !studyBlocksAreIdentical(notes, 0, 4) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.compose,
        letter: "D",
        title: "Ex. 5 - make melody from chord tones",
        learn:
          "Invent several different melodic units while keeping the harmony fixed.",
        explanation:
          "Early phrase-writing becomes easier when the variables are separated. By fixing the harmony first, you can concentrate on melodic contour and rhythm without having to solve harmony at the same time. The purpose is technical fluency: repeated sketches gradually make the coordination of melodic, rhythmic and harmonic factors less awkward.\n\nExample 5 uses only the tonic harmony of F major. Different arrangements of F-A-C create different melodic units even though the harmonic material never changes. This is the point of the restriction: learn how much variety contour alone can produce before adding more resources.",
        instruction:
          "Play Ex. 5a and identify its three structural pitches: F, A and C. Notice that changing their order changes the melodic profile without changing the harmony.\n\nIn the study below, use the equivalent C-major tonic material C-E-G. Write at least six notes in steps 1-8, make the contour purposeful rather than random, listen to it, and then revise at least one step after hearing the result.",
        recognition:
          "How many genuinely different melodic shapes can the same three chord tones produce?",
        source: {
          reference: "Example 5 - Melodic units derived from broken chords",
          exampleIds: ["s01.ex5a", "s01.ex5"],
          focus:
            "Ex. 5a is reproduced as native playable notation from the book, followed by an analysis map of the larger Ex. 5 group. The PLAY / LAB construction then transposes the same practice constraint from F major to C major.",
        },
        terms: [
          {
            term: "Predetermined harmony",
            definition:
              "A fixed harmonic basis chosen before inventing the melodic phrase.",
          },
          {
            term: "Broken chord",
            definition:
              "Chord tones sounded successively as melody rather than simultaneously.",
          },
        ],
        workspace: "composition-study",
        checksLabel: "Build from one harmony",
        successLabel: "You made melody without changing the harmonic material",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const notes = compositionStudy[SCHOENBERG_STUDY_IDS.compose]?.notes ?? [];
        const active = notes.slice(0, 8).filter((note): note is number => note !== null);
        const onlyTriad = active.every((note) => [0, 4, 7].includes(note % 12));
        return [
          { label: "You entered at least six notes", complete: active.length >= 6 },
          { label: "Every active note belongs to C-E-G", complete: active.length >= 6 && onlyTriad },
          { label: "You listened to the phrase", complete: heardPlayback(experiments) },
          { label: "You revised at least one step after trying it", complete: revisedStepCount(experiments["study.note-edit"]?.values ?? []) >= 1 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.noteValues,
        letter: "E",
        title: "Ex. 6 - smaller note values",
        learn:
          "Hear how rhythm alone can produce a different phrase character while the pitch material stays restricted.",
        explanation:
          "Example 6 keeps the same basic harmonic restriction but changes the rhythmic scale. Smaller note-values create more events within the same span, so the line feels more active even before any new pitch resource is introduced.\n\nThis separates two compositional variables that are easy to confuse: pitch content may remain almost unchanged while rhythm alters density, momentum and phrase character. The exercise is therefore about hearing rhythmic activity as an independent source of variation.",
        instruction:
          "Play Ex. 6a and compare it with Ex. 5a. The pitch material remains simple, but the shorter note-values make the phrase more active. Then inspect the Staff and Degrees views below and choose the statement that describes the change.",
        recognition:
          "Does the phrase feel more active even though it still lives inside the same simple harmonic world?",
        source: {
          reference: "Example 6 - Smaller note values",
          exampleIds: ["s01.ex5a", "s01.ex6a", "s01.ex6"],
          focus:
            "Ex. 6a is reproduced as native playable notation from the book. The analysis map covers the larger Ex. 6 group; the PLAY / LAB reduction underneath is separate application material.",
        },
        terms: [
          { term: "Note-value", definition: "The notated duration of a note." },
          { term: "Rhythmic activity", definition: "How frequently musical events occur through time." },
        ],
        workspace: "composition-study",
        checksLabel: "Identify the change",
        successLabel: "You heard rhythmic density change without a new harmony",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.noteValues];
        return [
          { label: "You listened to the reduction", complete: heardPlayback(experiments) },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "You identified smaller note values", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.upbeats,
        letter: "F",
        title: "Ex. 7 - upbeats and varied note values",
        learn:
          "Hear how pickup motion and mixed durations can make the same restricted pitch material more flexible.",
        explanation:
          "Example 7 still avoids new harmonic pitches, but it loosens the rhythmic treatment. Mixed note-values and upbeats change where events fall in relation to the beat, giving the line a more flexible entrance and a less mechanical surface.\n\nThe important point is that fluency does not require immediate melodic complication. A phrase can become more animated through duration and metric placement alone while the pitch material remains structurally simple.",
        instruction:
          "Play Ex. 7a and hear how the B-flat upbeat leads into the longer F-D span. Then inspect the rests and mixed durations in Staff view and choose the answer that best describes what this adds to the earlier studies.",
        recognition:
          "Can a phrase become more fluid before you add any new harmonic pitch?",
        source: {
          reference: "Example 7 - Added upbeats and various note values",
          exampleIds: ["s01.ex7a", "s01.ex7"],
          focus:
            "Ex. 7a is now present as native playable notation. The group analysis shows Schoenberg's broader use of upbeats and mixed values; the application reduction is kept distinct from the printed source.",
        },
        terms: [
          { term: "Upbeat", definition: "An unaccented pickup that leads into a stronger metric position." },
          { term: "Metric placement", definition: "Where an event falls relative to strong and weak beats." },
        ],
        workspace: "composition-study",
        checksLabel: "Hear metric flexibility",
        successLabel: "You identified upbeats and mixed note values as the new resource",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.upbeats];
        const durations = state?.durations ?? [];
        const notes = state?.notes ?? [];
        return [
          { label: "You listened to the reduction", complete: heardPlayback(experiments) },
          { label: "The reduction contains rests and mixed durations", complete: notes.includes(null) && new Set(durations).size > 1 },
          { label: "You identified upbeats and varied values", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.passingNotes,
        letter: "G",
        title: "Ex. 8 - add passing notes",
        learn:
          "Hear passing notes as a way of adding fluency between structural chord tones.",
        explanation:
          "Example 8 begins to enrich the earlier broken-chord studies with non-chord tones. Passing notes connect structural pitches by step, filling larger intervals and giving the melody a more continuous surface without replacing the underlying harmonic framework.\n\nThis is a useful distinction: the chord tones remain the structural points, while the added note belongs to the motion between them. The added detail should make the line more fluent, not make the harmonic basis harder to perceive.",
        instruction:
          "Play Ex. 8a and follow F-A-B-flat-C. The added B-flat connects the structural tones by step. Then compare the study below and choose the technique being added.",
        recognition:
          "Which notes feel like connective motion rather than new harmonic pillars?",
        source: {
          reference: "Example 8 - Varying Ex. 5 by adding passing notes",
          exampleIds: ["s01.ex8a", "s01.ex8"],
          focus:
            "Ex. 8a is reproduced natively from the book so the passing motion can be read and heard directly. The group map and PLAY / LAB reduction then generalize that device.",
        },
        terms: [
          { term: "Passing note", definition: "A non-chord tone that connects more structural pitches by step." },
          { term: "Fluency", definition: "Smoother melodic motion produced by connecting and elaborating structural tones." },
        ],
        workspace: "composition-study",
        checksLabel: "Identify passing motion",
        successLabel: "You heard added notes as connection rather than replacement",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.passingNotes];
        const notes = state?.notes ?? [];
        const hasNonTriad = notes.some(
          (note) => note !== null && ![0, 4, 7].includes(note % 12),
        );
        return [
          { label: "You listened to the reduction", complete: heardPlayback(experiments) },
          { label: "The reduction contains connective non-chord tones", complete: hasNonTriad },
          { label: "You identified passing notes", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.repetitions,
        letter: "H",
        title: "Ex. 9 - passing notes plus repetition",
        learn:
          "Hear how local note repetition can join passing motion to a more articulated rhythmic surface.",
        explanation:
          "Example 9 combines resources that were previously isolated. The varied note-values and upbeat character of Ex. 7 remain, while passing notes and local pitch repetitions add continuity and articulation.\n\nBecause the techniques are introduced progressively, you can hear what each one contributes. Repetition can emphasize or group a pitch; passing motion can connect structural tones. Their combination produces a richer surface without requiring a new harmonic foundation.",
        instruction:
          "Play the reduction and look for adjacent repeated pitches as well as stepwise connecting motion. Choose the description that matches Ex. 9.",
        recognition:
          "Can you hear repetition acting as articulation inside an otherwise flowing line?",
        source: {
          reference: "Example 9 - Varying Ex. 7 by adding passing notes and note repetitions",
          exampleIds: ["s01.ex9"],
          focus:
            "The example combines the rhythmic flexibility of Ex. 7 with connective passing notes and local repetitions.",
        },
        terms: [
          { term: "Note repetition", definition: "Immediate or local recurrence of the same pitch as part of the melodic rhythm." },
          { term: "Articulation", definition: "The way events are separated, grouped or emphasized within a phrase." },
        ],
        workspace: "composition-study",
        checksLabel: "Hear the combined technique",
        successLabel: "You identified passing motion plus local repetition",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.repetitions];
        const notes = state?.notes ?? [];
        const repeated = notes.some(
          (note, index) => index > 0 && note !== null && note === notes[index - 1],
        );
        return [
          { label: "You listened to the reduction", complete: heardPlayback(experiments) },
          { label: "You found local note repetition in the material", complete: repeated },
          { label: "You identified passing notes plus repetition", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.embellishment,
        letter: "I",
        title: "Exs. 10-11 - embellish, but do not obscure",
        learn:
          "Hear the trade-off in embellishment: extra detail can create flexibility and richness, but too many small notes can obscure the harmony.",
        explanation:
          "Examples 10 and 11 push embellishment further. Changing notes, appoggiatura-like figures and denser small-note motion can give a melody flexibility and richness of detail, but the benefit has a limit.\n\nWhen too many small notes compete for attention, the structural pitches and implied harmony become difficult to hear. The compositional question is therefore not simply whether ornament is attractive, but whether the underlying line remains legible through the decoration.",
        instruction:
          "Play the denser study and compare Staff with Degrees. Then choose the statement that best describes the risk created by too much embellishment.",
        recognition:
          "At what point does detail stop clarifying the line and start competing with the harmonic skeleton?",
        source: {
          reference: "Examples 10-11 - Embellishing Ex. 8 / varying Ex. 7 with appoggiaturas and changing notes",
          exampleIds: ["s01.ex10-11"],
          focus:
            "Schoenberg values the added flexibility and richness but warns that excessive small-note detail may obscure the harmony.",
        },
        terms: [
          { term: "Changing note", definition: "An ornamental non-chord tone that decorates or redirects a melodic line." },
          { term: "Appoggiatura", definition: "An accented non-chord tone that resolves by step." },
          { term: "Overburden", definition: "Schoenberg's warning that too much ornamental detail can obscure the underlying harmony." },
        ],
        workspace: "composition-study",
        checksLabel: "Judge embellishment",
        successLabel: "You heard both the benefit and the cost of added detail",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.embellishment];
        const notes = state?.notes ?? [];
        const hasChromaticDetail = notes.some(
          (note) => note !== null && ![0, 2, 4, 5, 7, 9, 11].includes(note % 12),
        );
        return [
          { label: "You listened to the denser reduction", complete: heardPlayback(experiments) },
          { label: "You inspected more than one notation", complete: inspectedTwoNotations(experiments) },
          { label: "The reduction includes chromatic ornamental detail", complete: hasChromaticDetail },
          { label: "You identified the risk of obscuring the harmony", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.build,
        letter: "J",
        title: "Make your own phrase study",
        learn:
          "Constrain the material, make a phrase, then revise it until melody, rhythm and harmony coordinate naturally.",
        explanation:
          "The sequence of Examples 5-11 is a practice method rather than a catalogue of effects. Start with a predetermined harmony, make many short sketches, and add one source of complexity at a time. The progression moves from chord-tone contours to smaller values, mixed rhythm and upbeats, then to passing notes, repetitions and richer embellishment.\n\nThe goal is coordination. A successful phrase should make melody, rhythm and harmony feel mutually supportive rather than independently assembled. Repetition of the exercise matters: awkward early sketches are expected, and revision after listening is part of acquiring fluency.",
        instruction:
          "Build the first half in steps 1-8 over the tonic framework C-E-G. Give it a recognisable contour and rhythmic character. You may add passing or changing notes, but keep the structural pitches audible.\n\nThen write a related continuation in steps 9-16. It should belong to the first half without merely copying it. Use at least three notes in each half, listen to the complete phrase, revise at least one step after hearing it, and compare two notation views before finishing.",
        recognition:
          "Can you explain which notes are structural, which are connective or ornamental, and why the second half still belongs to the first?",
        source: {
          reference: "Comment on Examples + Examples 5-11",
          exampleIds: ["s01.ex5", "s01.ex7", "s01.ex10-11"],
          focus:
            "This is Schoenberg's stated practice method translated into PLAY / LAB: many constrained phrase sketches, gradually adding rhythmic and melodic resources.",
        },
        terms: [
          { term: "Phrase study", definition: "A short compositional exercise made to practise coordination of melody, rhythm and harmony." },
          { term: "Structural tone", definition: "A pitch that belongs to the underlying harmonic or motivic framework rather than serving mainly as decoration." },
          { term: "Revision", definition: "Reworking the phrase after hearing whether its elements actually function together." },
        ],
        workspace: "composition-study",
        checksLabel: "Construct the phrase study",
        successLabel: "Your phrase coordinates structure, connection and variation",
      }),
      evaluate: ({ compositionStudy, experiments }) => {
        const state = compositionStudy[SCHOENBERG_STUDY_IDS.build];
        const notes = state?.notes ?? [];
        const noteEdits = experiments["study.note-edit"]?.values ?? [];
        return [
          { label: "You wrote at least six notes in the exercise", complete: changedControl(experiments, "study.note-edit", 6) },
          { label: "You listened to your construction", complete: heardPlayback(experiments) },
          { label: "You revised at least one step after hearing it", complete: revisedStepCount(noteEdits) >= 1 },
          { label: "You compared more than one notation", complete: inspectedTwoNotations(experiments) },
          {
            label: "Both halves contain at least three notes",
            complete:
              studyBlockNoteCount(notes, 0, 8) >= 3 &&
              studyBlockNoteCount(notes, 8, 8) >= 3,
          },
          { label: "The two halves are recognisably related", complete: studyBlocksAreRelated(notes, 0, 8) },
          { label: "The continuation changes the source", complete: !notes.slice(0, 8).every((note, index) => note === notes[index + 8]) },
        ];
      },
    },
  ],
};
