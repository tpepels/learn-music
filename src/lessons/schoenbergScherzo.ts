import {
  activeLayerCount,
  arrangementLayers,
  type ArrangementBar,
} from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function signature(layers: ArrangementBar): string {
  return arrangementLayers.map((layer) => (layers[layer] ? "1" : "0")).join("");
}

function differenceCount(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function sharedCount(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] && right[layer]).length;
}

function formLayerEdits(experiments: LessonContext["experiments"]): number {
  return Object.entries(experiments).reduce(
    (total, [key, value]) =>
      total + (key.startsWith("form.layer.") ? value.changes : 0),
    0,
  );
}

function analysed(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

function activeHarmonyBars(sequence: number[][]): number {
  return Array.from({ length: 4 }, (_, bar) =>
    sequence.slice(bar * 8, bar * 8 + 8).some((entry) => entry.length > 0),
  ).filter(Boolean).length;
}

function harmonicPatternCount(sequence: number[][]): number {
  return new Set(
    Array.from({ length: 4 }, (_, bar) =>
      sequence
        .slice(bar * 8, bar * 8 + 8)
        .map((entry) => (entry.length ? "1" : "0"))
        .join(""),
    ),
  ).size;
}

const lesson = lessonContentSchema.parse({
  id: "schoenberg.scherzo",
  number: 14,
  title: "The scherzo",
  eyebrow: "Schoenberg · Small forms",
  hero:
    "Use rapid character and unstable middle-section motion without losing the thematic thread that makes the return meaningful.",
  description:
    "The scherzo keeps the ternary logic of departure and return but increases rhythmic energy and gives the middle section more developmental freedom. Fast surface motion, slower harmonic pacing, sequence, liquidation and a prepared re-entry all become part of the form.",
  overview:
    "Build a quick, characteristic opening, push its material through a more unstable middle, then reduce and prepare that activity so the returning section sounds inevitable rather than merely repeated.",
});

export const schoenbergScherzoLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.scherzo.a",
        letter: "A",
        title: "Establish a rapid thematic character",
        learn:
          "Make the opening idea concise and rhythmically characteristic enough to remain recognisable at high speed.",
        explanation:
          "A scherzo is an instrumental form whose quick tempo and pronounced rhythmic character affect the way thematic material has to work. Fast music gives the listener less time to process each local event, so a successful opening needs a clear profile. The theme may still be built as a sentence or period, but its notated spans can be larger because the actual musical time passes quickly.

The same speed also changes harmony. Surface notes can move rapidly while the underlying harmony changes more slowly, allowing the ear to grasp direction without being overwhelmed. The result is not simply 'more notes'. A scherzo needs an economical thematic skeleton whose rhythm, contour or repeated gesture remains audible through later transformation. Energy comes from focused character and pacing, not indiscriminate density.",
        instruction:
          "Study all four characteristics of the scherzo opening, then use the Motif workspace to sharpen the first four steps of your melody into a compact source idea with at least three sounding notes. Reuse at least two of those pitches in steps 5-8, but do not copy the block exactly. Make at least five melody edits and play the whole phrase several times. The second block should feel like the same energetic material pushed forward, not a new tune and not an exact echo.",
        recognition:
          "Can you recognise the opening idea through its rhythm or contour when the later block changes, or is its identity too weak to survive transformation?",
        source: {
          reference: "Chapter XVI - The A-Section",
          focus:
            "Rapid instrumental character, clear rhythmic profile and sentence/period construction support the scherzo opening.",
          exampleIds: ["s14.scherzo-form"],
        },
        terms: [
          {
            term: "Scherzo",
            definition:
              "A fast, strongly characterised instrumental movement commonly organised as a ternary design with a contrasting middle or trio.",
          },
          {
            term: "Thematic skeleton",
            definition:
              "The simplest pitch-and-rhythm outline that still carries the identity of a theme.",
          },
          {
            term: "Surface motion",
            definition:
              "Local note activity that may move much faster than the underlying harmonic or formal structure.",
          },
        ],
        workspace: "motif",
        checksLabel: "Sharpen the opening idea",
        successLabel: "The theme now has an identity strong enough for rapid development",
      }),
      evaluate: ({ melody, experiments }) => {
        const first = melody.slice(0, 4);
        const second = melody.slice(4, 8);
        const firstNotes = first.filter((n): n is number => n !== null);
        const secondNotes = second.filter((n): n is number => n !== null);
        const shared = secondNotes.filter((n) => firstNotes.includes(n)).length;
        const exact = first.every((note, index) => note === second[index]);
        return [
          {
            label: "You studied the scherzo opening principles",
            complete: analysed(experiments, "s14.scherzo-form", 4),
          },
          {
            label: "You shaped the thematic source here",
            complete: changedControl(experiments, "melody.edit", 5),
          },
          { label: "You listened to the phrase repeatedly", complete: heardPlayback(experiments) },
          {
            label: "The source idea contains at least three notes",
            complete: firstNotes.length >= 3,
          },
          {
            label: "The next block keeps material but does not merely copy it",
            complete: shared >= 2 && !exact,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.scherzo.b",
        letter: "B",
        title: "Make the middle unstable",
        learn:
          "Create a middle section whose harmony and repeated patterns move more restlessly than the opening while remaining derived from it.",
        explanation:
          "The contrasting middle of a scherzo can approach a development section. Instead of presenting an entirely new idea, it often carries familiar material through changing harmonic regions. Short patterns may be sequenced, imitated or reshaped while the harmony becomes less stable. This creates contrast through process: the listener hears the same family of material under more unsettled conditions.

Because the tempo is fast, the harmonic route must still be intelligible. Rapid surface figuration can continue over a harmony long enough to register before the next move. The middle should therefore distinguish surface activity from structural harmonic motion. Too little change leaves the section static; too much produces noise rather than development. The best result feels mobile but directed.",
        instruction:
          "Work through the modulatory-middle analysis, then revise the Harmony sequencer. Make at least eight harmonic note edits, keep all four bars active, and create at least three different bar-level rhythmic patterns of harmonic activity. Do not fill every step: preserve enough space that stable and moving regions can be heard. Play the entire four-bar span with the melody, listening for a clear increase in harmonic mobility rather than simply more simultaneous notes.",
        recognition:
          "Does the middle sound as though familiar material is passing through changing conditions, or does the harmony feel either static or randomly busy?",
        source: {
          reference: "Chapter XVI - The Modulatory Contrasting Middle Section",
          focus:
            "The middle develops opening material through unstable harmony, sequence and transformed patterns.",
          exampleIds: ["s14.modulatory-middle", "s14.scherzo-form"],
        },
        terms: [
          {
            term: "Modulatory middle",
            definition:
              "A contrasting middle section whose harmonic motion passes through changing tonal regions rather than remaining comparatively stable.",
          },
          {
            term: "Sequence",
            definition:
              "The repetition of a pattern at successively different pitch levels, often used to propel harmonic movement.",
          },
          {
            term: "Developmental process",
            definition:
              "A passage in which existing material is transformed and redirected rather than simply restated.",
          },
        ],
        workspace: "harmony-song",
        checksLabel: "Destabilise the middle",
        successLabel: "The middle now moves through a more developmental harmonic process",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the modulatory-middle process",
          complete: analysed(experiments, "s14.modulatory-middle", 3),
        },
        {
          label: "You made a substantial harmonic revision",
          complete: changedControl(experiments, "harmony.note-edit", 8),
        },
        { label: "You listened through the harmonic span", complete: heardPlayback(experiments) },
        {
          label: "All four bars contain harmonic information",
          complete: activeHarmonyBars(harmonySequence) === 4,
        },
        {
          label: "The harmonic activity changes across the middle",
          complete: harmonicPatternCount(harmonySequence) >= 3,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.scherzo.c",
        letter: "C",
        title: "Liquidate toward the return",
        learn:
          "Reduce the active material near the end of the middle so motion stops progressing while expectation of the return increases.",
        explanation:
          "A developmental middle cannot continue intensifying indefinitely. Near the return, complex motive-forms can be reduced to residues: a small interval, a repeated note, a scale fragment, a broken chord or another neutral figure. This liquidation weakens the independent identity of the middle and makes room for the principal theme to re-enter. The process is reduction with a formal purpose.

At the same time, harmony can stop travelling. A pedal or repeated tone creates repose because one element ceases to progress, yet it can also create suspense because the listener expects the theme to return. Those two sensations are compatible: local motion decreases while formal expectation increases. A successful retransition therefore sounds less busy than the middle's peak but more expectant than a full cadence.",
        instruction:
          "Study all four liquidation points, then return to the melody. Keep the first half comparatively active, but make the last four steps contain no more than two sounding notes and at least two rests. Reuse at least one pitch from the opening motive so the residue still belongs to the theme. Make at least four melody edits in this exercise and play the whole phrase into the reduced ending. The final fragment should feel like energy being stripped away in preparation, not like the piece has already finished.",
        recognition:
          "As the material thins, do you hear less local activity but more expectation for something familiar to re-enter?",
        source: {
          reference: "Chapter XVI - liquidation and preparation of the return",
          focus:
            "The middle reduces motive-forms and may settle on a pedal-like state that combines repose with suspense before the return.",
          exampleIds: ["s14.modulatory-middle"],
        },
        terms: [
          {
            term: "Liquidation",
            definition:
              "The gradual reduction of a motive to simpler residues so its independent thematic identity weakens.",
          },
          {
            term: "Pedal point",
            definition:
              "A sustained or repeated pitch held while other musical activity changes around it.",
          },
          {
            term: "Retransitional suspense",
            definition:
              "Expectation created when forward motion slows but the return of principal material has not yet arrived.",
          },
        ],
        workspace: "melody",
        checksLabel: "Reduce toward the return",
        successLabel: "The end of the middle now creates repose and expectation",
      }),
      evaluate: ({ melody, experiments }) => {
        const openingPitches = melody
          .slice(0, 4)
          .filter((n): n is number => n !== null);
        const tail = melody.slice(12, 16);
        const tailNotes = tail.filter((n): n is number => n !== null);
        return [
          {
            label: "You studied the liquidation process",
            complete: analysed(experiments, "s14.modulatory-middle", 4),
          },
          {
            label: "You reduced the ending in this exercise",
            complete: changedControl(experiments, "melody.edit", 4),
          },
          { label: "You listened into the reduced ending", complete: heardPlayback(experiments) },
          {
            label: "The final four steps are reduced to one or two notes",
            complete: tailNotes.length >= 1 && tailNotes.length <= 2,
          },
          {
            label: "The residue retains a pitch from the opening idea",
            complete: tailNotes.some((note) => openingPitches.includes(note)),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.scherzo.d",
        letter: "D",
        title: "Return, extend and close",
        learn:
          "Make the recapitulation recognisable, then decide whether an extension or coda is needed to complete the movement's energy.",
        explanation:
          "The returning scherzo need not be a literal copy. It can alter register, add a countermelody, redistribute voices, condense a span or extend the close. Recognition is still essential, because the listener must hear the large ternary form completing itself after the unstable middle. Variation serves the return only when the principal identity remains unmistakable.

After the return, an episode, codetta or coda may prolong the ending. Such additions work when they resolve or intensify energy already present in the movement rather than introducing another large formal question. A coda can recall the motive, liquidate it again, or reinforce the tonic. The decisive distinction is function: return restores the principal section; coda completes what that restored section has set in motion.",
        instruction:
          "Study the return-and-coda analysis, then use Phrase & Form to set A → B → A′ → A′. Give A at least two active layers. Make B differ from A by at least two layers but share at least one. Make the returning A′ share at least two layers with A while changing at least one, and make the final block preserve at least two layers from A′ as an extension rather than a new C section. Make at least four form edits and play all sixteen bars without stopping.",
        recognition:
          "Can you hear the exact moment the principal material returns, and does the final extension complete that return rather than compete with it?",
        source: {
          reference: "Chapter XVI - Recapitulation, Extensions and Coda",
          focus:
            "The return may be reconstructed, while extensions, episodes or a coda can complete the movement without obscuring its principal identity.",
          exampleIds: ["s14.return-coda", "s14.scherzo-form"],
        },
        terms: [
          {
            term: "Reconstructed recapitulation",
            definition:
              "A return that clearly restores principal material while changing its surface, proportion or voice distribution.",
          },
          {
            term: "Coda",
            definition:
              "A closing section added after the principal formal return to complete or reinforce the ending.",
          },
          {
            term: "Episode",
            definition:
              "A subsidiary passage inserted into a larger form, often providing local contrast or extension.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Complete the scherzo arc",
        successLabel: "The return is clear and the ending now completes its energy",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b, aPrime, extension] = formSettings.layers;
        return [
          {
            label: "You studied return, extension and coda functions",
            complete: analysed(experiments, "s14.return-coda", 4),
          },
          {
            label: "You made a substantial formal edit pass",
            complete: formLayerEdits(experiments) >= 4,
          },
          { label: "You listened through the complete design", complete: heardPlayback(experiments) },
          {
            label: "The labels read A → B → A′ → A′",
            complete: formSettings.sections.join("|") === "A|B|A′|A′",
          },
          {
            label: "The middle contrasts without severing continuity",
            complete:
              activeLayerCount(a) >= 2 &&
              differenceCount(a, b) >= 2 &&
              sharedCount(a, b) >= 1,
          },
          {
            label: "The return is recognisable but reconstructed",
            complete: sharedCount(a, aPrime) >= 2 && signature(a) !== signature(aPrime),
          },
          {
            label: "The extension remains in the returning family",
            complete: sharedCount(aPrime, extension) >= 2,
          },
        ];
      },
    },
  ],
};
