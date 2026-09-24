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
    "Schoenberg begins with comprehensibility, logic and coherence, then treats the phrase as the smallest structural unit. His phrase examples move from literature to practical studies: chord tones, changing note-values, upbeats, passing notes, repetitions and embellishment.",
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
          "Chapter I defines form in terms of organization, logic and coherence. Chapter II then calls the phrase the smallest structural unit, comparable to something sung in one breath. Schoenberg stresses continuity and forward movement, with phrase endings normally differentiated enough to create punctuation.",
        instruction:
          "Play the phrase once without looking for labels. Then mark steps 1-4 as the opening characteristic idea and switch between at least two notation views. Treat the bracket as analysis of the phrase, not as a claim that every phrase is four notes long.",
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
          "Read Schoenberg's literature examples as evidence that phrases can differ greatly in surface while remaining intelligible units.",
        explanation:
          "Examples 1-2 collect short phrases from Beethoven and other composers. They differ in length, contour and rhythmic activity. The point is not that one contour defines a phrase; it is that a phrase can be grasped as a unit through the coordination of melodic, rhythmic and harmonic factors.",
        instruction:
          "Compare Exact repeat, Related change and Unrelated change in the reduction below. Then choose Related change. Relate what you hear to the book's Ex. 2e, Beethoven Symphony No. 3-I, and Ex. 2g, Beethoven Symphony No. 9-I: very different surfaces can still read as coherent phrase material.",
        recognition:
          "Which version sounds changed while still belonging to the same musical thought?",
        source: {
          reference: "Examples 1-2 - especially Ex. 2e Beethoven Symphony No. 3-I and Ex. 2g Symphony No. 9-I",
          focus:
            "The book places very different literature excerpts side by side to show that phrase identity is not tied to one fixed length or rhythmic surface. The interactive miniature is a reduction of that comparison, not a transcription.",
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
          "Use the kind of family resemblance visible in Schoenberg's Beethoven phrase examples to repair a weak continuation.",
        explanation:
          "Schoenberg's examples include Beethoven's Symphony No. 3 in both Ex. 2 and Ex. 4. The exact notes differ from our miniature, but the analytical question transfers directly: can later material preserve enough contour, interval direction or rhythmic character to sound connected without simply copying?",
        instruction:
          "Keep steps 1-4 as the source. Rewrite steps 5-8 until they are recognisably related but not identical. A transposition works, but so can a contour-preserving change. Listen after every substantial edit.",
        recognition:
          "Does step 5 feel like the continuation of a known thought rather than the start of another melody?",
        source: {
          reference: "Ex. 2e Beethoven Symphony No. 3-I; Ex. 4c Beethoven Symphony No. 3 - Scherzo",
          focus:
            "Use the Beethoven excerpts as analysis models for phrase relation and rhythmic character. The editable miniature isolates that relationship rather than reproducing the orchestral score.",
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
          "Experience Schoenberg's first practical phrase exercise: several melodic units can be invented from one fixed harmony.",
        explanation:
          "In his Comment on Examples, Schoenberg recommends making many phrase sketches over a predetermined harmony. Example 5 takes the tonic of F major and creates different melodic contours from arrangements of the chord tones. The limitation is deliberate: invention is practised while harmony stays fixed.",
        instruction:
          "Our interactive version transposes the exercise to C major. Write at least six notes in steps 1-8 using only C, E and G. Try more than one contour, listen, and revise at least one step after hearing it.",
        recognition:
          "How many genuinely different melodic shapes can the same three chord tones produce?",
        source: {
          reference: "Example 5 - Melodic units derived from broken chords",
          focus:
            "Schoenberg keeps one tonic harmony fixed and varies the arrangement of its chord tones. We transpose the practice from F major to C major.",
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
          "After the simple broken-chord contours of Ex. 5, Schoenberg's Ex. 6 uses smaller note-values. His comment is explicit: the smaller values produce different results even though the harmonic basis has not changed.",
        instruction:
          "Play the reduction, then inspect Staff and Degrees. Which feature is responsible for the new result compared with the simpler Ex. 5 approach? Choose the matching answer below.",
        recognition:
          "Does the phrase feel more active even though it still lives inside the same simple harmonic world?",
        source: {
          reference: "Example 6 - Smaller note values",
          focus:
            "The exercise changes rhythmic scale before adding richer pitch material. Our reduction keeps chord-tone material and compresses the note values.",
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
          "Example 7 remains confined to chord tones but combines different note-values and adds upbeats. Schoenberg uses it to show how much variety can be created before passing notes or chromatic embellishment are introduced.",
        instruction:
          "Play the reduction and look at the rests and mixed durations in Staff view. Choose the answer that best describes what Ex. 7 adds to the earlier chord-tone studies.",
        recognition:
          "Can a phrase become more fluid before you add any new harmonic pitch?",
        source: {
          reference: "Example 7 - Added upbeats and various note values",
          focus:
            "Schoenberg still restricts the melody to chord tones; variety comes from metric placement and duration.",
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
          "Schoenberg says Exs. 8 and 9 build on Exs. 5 and 7 and show how simple melodic and rhythmic additions contribute fluency and vitality. Ex. 8 specifically varies Ex. 5 by adding passing notes.",
        instruction:
          "Play the reduction. The chord-tone skeleton is still audible, but stepwise tones now connect it. Choose the technique Schoenberg is adding.",
        recognition:
          "Which notes feel like connective motion rather than new harmonic pillars?",
        source: {
          reference: "Example 8 - Varying Ex. 5 by adding passing notes",
          focus:
            "The book keeps the earlier chord-tone framework and inserts connective notes to create greater fluency.",
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
          "Example 9 varies Ex. 7 by adding passing notes and note repetitions. This matters because Schoenberg is not adding complexity all at once: each example preserves earlier resources and adds another controllable device.",
        instruction:
          "Play the reduction and look for adjacent repeated pitches as well as stepwise connecting motion. Choose the description that matches Ex. 9.",
        recognition:
          "Can you hear repetition acting as articulation inside an otherwise flowing line?",
        source: {
          reference: "Example 9 - Varying Ex. 7 by adding passing notes and note repetitions",
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
          "Hear the trade-off Schoenberg points out: embellishment can create flexibility and richness, but too many small notes can obscure the harmony.",
        explanation:
          "Examples 10 and 11 continue the previous studies with more elaborate embellishment, changing notes and appoggiatura-like figures. Schoenberg explicitly warns that this richer detail can overburden the melody with small notes and obscure the harmonic basis.",
        instruction:
          "Play the denser reduction and compare Staff with Degrees. Then choose the statement that matches Schoenberg's warning about these later examples.",
        recognition:
          "At what point does detail stop clarifying the line and start competing with the harmonic skeleton?",
        source: {
          reference: "Examples 10-11 - Embellishing Ex. 8 / varying Ex. 7 with appoggiaturas and changing notes",
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
          { label: "You identified Schoenberg's warning about obscuring harmony", complete: state?.decision === "related" },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: SCHOENBERG_STUDY_IDS.build,
        letter: "J",
        title: "Make your own phrase study",
        learn:
          "Use Schoenberg's Chapter II practice method: constrain the material, make a phrase, then revise it until the elements coordinate naturally.",
        explanation:
          "Schoenberg says a beginning composer's invention often does not flow freely and recommends making many phrase sketches over predetermined harmony. The sequence of Exs. 5-11 is a practical ladder: chord tones first, then rhythmic variety, upbeats, passing notes, repetitions and finally richer embellishment.",
        instruction:
          "Write a phrase in steps 1-8 and a related continuation in steps 9-16. Start with C-E-G as structural tones, but you may add passing or changing notes. Use at least three notes in each half, listen, revise at least one step, and inspect two notation views before finishing.",
        recognition:
          "Can you explain which notes are structural, which are connective or ornamental, and why the second half still belongs to the first?",
        source: {
          reference: "Comment on Examples + Examples 5-11",
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
