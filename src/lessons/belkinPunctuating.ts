import { activeLayerCount, arrangementLayers, type ArrangementBar } from "../music/model";
import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function analysed(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum = 1,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

function melodyEdits(experiments: LessonContext["experiments"]): number {
  return experiments["melody.edit"]?.changes ?? 0;
}

function arrangementEdits(experiments: LessonContext["experiments"]): number {
  return experiments["arrangement.edit"]?.changes ?? 0;
}

function sounding(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function layerDifference(
  left: ArrangementBar,
  right: ArrangementBar,
): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

const lesson = lessonContentSchema.parse({
  id: "belkin.punctuating",
  number: 1,
  title: "Punctuating",
  eyebrow: "Belkin · Composition craft",
  hero:
    "Shape musical punctuation by coordinating melody, rhythm, harmony, texture and energy instead of treating every cadence as a chord formula.",
  description:
    "Punctuation makes musical structure audible. A cadence becomes convincing when several dimensions cooperate, and different boundaries need different degrees of finality.",
  overview:
    "The goal is control: create a breath without stopping the piece, make an important section boundary unmistakable, connect phrases through elision, and reserve the strongest sense of completion for the point that actually needs it.",
});

export const belkinPunctuatingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "belkin.punctuating.a",
        letter: "A",
        title: "Make the line itself arrive",
        learn:
          "A cadence is not produced by harmony alone. Melodic contour and rhythmic relaxation can make an arrival audible even before the accompaniment tells you what chord it is.",
        explanation:
          "A useful cadence coordinates several dimensions, but melody and rhythm already carry a great deal of formal information. A line can relax by narrowing its intervals, moving toward a prepared register, arriving on a stronger beat, lengthening its final event or simply reducing activity. The important distinction is between an event that feels like another note in the stream and one that lets the listener breathe.

Do not merely place a long note at the end. Shape the preceding motion so the final event feels prepared. If the phrase is jagged, a smoother approach can create repose; if the phrase is active, a reduction in rhythmic activity can do the same job.",
        instruction:
          "Study all four cadence dimensions. In the Melody workspace, write at least four sounding notes. Make the final sounding note last at least twice as long as a normal step and shape the approach so it feels like a release rather than an arbitrary stop. Make at least five edits, listen, then revise once after hearing the whole phrase.",
        recognition:
          "Can you hear the phrase ending from the line and timing alone, even if you momentarily ignore the harmony underneath it?",
        source: {
          reference: "Belkin, Chapter 5",
          focus:
            "Punctuation arises from coordinated melodic, harmonic, rhythmic, dynamic and textural evidence.",
          exampleIds: ["b01.punctuation-dimensions"],
        },
        terms: [
          {
            term: "Punctuation",
            definition:
              "An audible articulation that tells the listener that a musical unit is pausing, ending or giving way to another.",
          },
          {
            term: "Cadential strength",
            definition:
              "The degree of finality created by the combined musical evidence at an arrival.",
          },
        ],
        workspace: "melody",
        checksLabel: "Shape a real arrival",
        successLabel: "The phrase now relaxes into an audible point of punctuation",
      }),
      evaluate: ({ melody, melodyDurations, experiments }) => {
        const indices = melody.flatMap((note, index) => note === null ? [] : [index]);
        const lastIndex = indices.at(-1);
        return [
          {
            label: "You inspected the cadence dimensions",
            complete: analysed(experiments, "b01.punctuation-dimensions", 4),
          },
          {
            label: "The phrase has enough material to establish motion",
            complete: sounding(melody).length >= 4,
          },
          {
            label: "The final sounding event is rhythmically relaxed",
            complete:
              lastIndex !== undefined &&
              (melodyDurations[lastIndex] ?? 1) >= 2,
          },
          {
            label: "You reshaped the line rather than accepting the first version",
            complete: melodyEdits(experiments) >= 5,
          },
          {
            label: "You listened to the complete phrase",
            complete: heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.punctuating.b",
        letter: "B",
        title: "Use texture to change cadential weight",
        learn:
          "Texture can reinforce or soften a boundary. A thinning texture often feels like energy being released, while a sudden enlargement can turn an arrival into an accent or climax.",
        explanation:
          "Changes of density, register and timbre can contribute strongly to punctuation, but they work best when they support what the rhythm and phrase are already doing. A change of instrumentation in the middle of an otherwise continuous thought can sound arbitrary; the same change at a prepared boundary can make the structure suddenly obvious.

Here the Arrangement grid stands in for textural density. You are not trying to make a production trick. You are testing how much the perceived weight of a boundary changes when several layers continue through it versus when the texture deliberately opens up.",
        instruction:
          "Study the cadential-shaping analysis. In Arrangement, keep bars 1-6 active enough to establish continuity. Make bar 7 relatively full, then make bar 8 noticeably thinner by removing at least one layer. Make at least five arrangement edits and listen through the whole eight-bar span. If the final thinning feels too abrupt, revise the preceding bar so the release sounds prepared.",
        recognition:
          "Does the texture change make the last boundary clearer without sounding like somebody accidentally muted tracks?",
        source: {
          reference: "Belkin, Chapter 5",
          focus:
            "Texture and dynamics can reinforce punctuation when coordinated with the phrase.",
          exampleIds: ["b01.cadential-shaping"],
        },
        terms: [
          {
            term: "Textural punctuation",
            definition:
              "A formal articulation strengthened by a change in density, register, instrumentation or timbral weight.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Make the boundary audible",
        successLabel: "The ending now releases textural energy deliberately",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You studied ways to strengthen and weaken an arrival",
          complete: analysed(experiments, "b01.cadential-shaping", 3),
        },
        {
          label: "You made several arrangement decisions",
          complete: arrangementEdits(experiments) >= 5,
        },
        {
          label: "The final bar is thinner than the bar before it",
          complete:
            activeLayerCount(arrangement[7]) < activeLayerCount(arrangement[6]),
        },
        {
          label: "The final two bars are audibly different",
          complete: layerDifference(arrangement[6], arrangement[7]) >= 1,
        },
        {
          label: "You listened through the boundary",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.punctuating.c",
        letter: "C",
        title: "Join two phrases by elision",
        learn:
          "A phrase ending does not always need empty space after it. In an elision, the point of arrival also becomes the beginning of the next phrase.",
        explanation:
          "Elision is useful because it gives one event two formal jobs. The listener hears an arrival, but before the music can settle completely the same sounding event has already become part of the next gesture. This keeps continuity high without erasing the boundary.

The shared event still needs to make musical sense in both directions. Its duration can bridge the join, while the material after it changes enough to reveal that a new phrase has begun. If nothing changes after the shared event, the boundary disappears; if everything changes too violently, the overlap no longer feels like a connection.",
        instruction:
          "Study the elision analysis. In the Motif workspace, use step 8 as a sounding note that sustains across step 9. Leave step 9 empty so the held note bridges the visual phrase boundary, then begin a changed continuation on step 10 or later. Write at least six sounding notes overall, make at least six edits, and listen through the join.",
        recognition:
          "Can you hear the held event first as an arrival and then, without silence, as the springboard into the next phrase?",
        source: {
          reference: "Belkin, Chapter 5 - Elision",
          focus:
            "An elision lets the final event of one phrase also function as the beginning of the next.",
          exampleIds: ["b01.elision"],
        },
        terms: [
          {
            term: "Elision",
            definition:
              "An overlap in which the end of one formal unit simultaneously serves as the beginning of the next.",
          },
        ],
        workspace: "motif",
        checksLabel: "Make the join overlap",
        successLabel: "The phrase boundary now connects through one shared sounding event",
      }),
      evaluate: ({ melody, melodyDurations, experiments }) => [
        {
          label: "You studied the dual function of an elision",
          complete: analysed(experiments, "b01.elision", 3),
        },
        {
          label: "Step 8 contains the shared event",
          complete: melody[7] !== null,
        },
        {
          label: "The shared event sustains across the boundary",
          complete: (melodyDurations[7] ?? 1) >= 2 && melody[8] === null,
        },
        {
          label: "The complete passage contains enough material to hear two gestures",
          complete: sounding(melody).length >= 6,
        },
        {
          label: "You revised and listened to the connection",
          complete:
            melodyEdits(experiments) >= 6 &&
            heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "belkin.punctuating.d",
        letter: "D",
        title: "Build a hierarchy of endings",
        learn:
          "Not every pause should sound equally final. Larger forms depend on a hierarchy in which local breaths remain subordinate to the boundary that actually closes the section.",
        explanation:
          "A useful way to think about punctuation is comparatively: which arrival is stronger, and why? If every phrase closes with maximum weight, the music repeatedly loses momentum. If every boundary is weak, the listener cannot tell where the larger units are.

The strongest cadence does not have to use every possible signal at once. What matters is that the combined evidence at the final boundary is clearly more conclusive than the internal ones. One dimension can even contradict another to produce a qualified close that says, in effect, 'yes, but continue.'",
        instruction:
          "Study the punctuation hierarchy. Use Arrangement to create two internal breaths and a clearly stronger final boundary. Make at least six edits. Keep bars 3 and 5 related to what precedes them so the piece continues, but make bar 8 the largest textural release: it should have fewer active layers than both bars 3 and 5. Listen from bar 1 without stopping and adjust until the final boundary feels categorically stronger.",
        recognition:
          "Without looking at the grid, can you tell which boundary is merely a breath and which one actually closes the span?",
        source: {
          reference: "Belkin, Chapter 5 - Degrees of punctuation",
          focus:
            "Different formal levels need different degrees of cadential weight.",
          exampleIds: ["b01.punctuation-hierarchy"],
        },
        terms: [
          {
            term: "Cadential hierarchy",
            definition:
              "An ordering of musical arrivals from mild local articulation to the strongest level of formal completion.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Reserve the strongest close",
        successLabel: "The final punctuation now outweighs the internal breaths",
      }),
      evaluate: ({ arrangement, experiments }) => [
        {
          label: "You compared several levels of punctuation",
          complete: analysed(experiments, "b01.punctuation-hierarchy", 4),
        },
        {
          label: "You shaped several formal boundaries",
          complete: arrangementEdits(experiments) >= 6,
        },
        {
          label: "The final bar is lighter than the first internal boundary",
          complete:
            activeLayerCount(arrangement[7]) < activeLayerCount(arrangement[2]),
        },
        {
          label: "The final bar is also lighter than the second internal boundary",
          complete:
            activeLayerCount(arrangement[7]) < activeLayerCount(arrangement[4]),
        },
        {
          label: "You heard the hierarchy in one continuous pass",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
