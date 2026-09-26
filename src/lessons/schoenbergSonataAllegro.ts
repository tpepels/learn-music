import {
  activeLayerCount,
  arrangementLayers,
  type ArrangementBar,
} from "../music/model";
import { harmonicFunction } from "../music/harmony";
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
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

function arrangementEdits(experiments: LessonContext["experiments"]): number {
  return experiments["arrangement.edit"]?.changes ?? 0;
}

function harmonicEdits(experiments: LessonContext["experiments"]): number {
  return Object.entries(experiments).reduce(
    (total, [key, value]) =>
      total + (key.startsWith("harmony.chord.") ? value.changes : 0),
    0,
  );
}

function formEdits(experiments: LessonContext["experiments"]): number {
  return Object.entries(experiments).reduce(
    (total, [key, value]) =>
      total + (key.startsWith("form.") ? value.changes : 0),
    0,
  );
}

function melodyEdits(experiments: LessonContext["experiments"]): number {
  return experiments["melody.edit"]?.changes ?? 0;
}

function differenceCount(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function sharedCount(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] && right[layer]).length;
}

function sounding(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function sameBlock(a: Array<number | null>, b: Array<number | null>): boolean {
  return a.every((note, index) => note === b[index]);
}

function sharedPitches(a: Array<number | null>, b: Array<number | null>): number {
  const first = sounding(a);
  const second = sounding(b);
  return second.filter((note) => first.includes(note)).length;
}

const lesson = lessonContentSchema.parse({
  id: "schoenberg.sonata-allegro",
  number: 18,
  title: "Sonata-allegro",
  eyebrow: "Schoenberg · Large forms",
  hero:
    "Coordinate exposition, elaboration and recapitulation so thematic contrast, harmonic instability and return create one large argument.",
  description:
    "Sonata-allegro expands the same principles already learned in smaller forms. The exposition presents stable contrasting groups, the elaboration puts familiar material into unstable changing contexts, and the recapitulation restores the principal tonal region while adapting earlier material to its new function.",
  overview:
    "The form is not a fixed box of bar counts. Its large sections are defined by what they do: present and contrast, destabilise and work out, prepare return, then restore and complete.",
});

export const schoenbergSonataAllegroLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.sonata-allegro.a",
        letter: "A",
        title: "Build an exposition with four functions",
        learn:
          "An exposition needs a principal region, directed transition, stable subordinate region and closing function - not simply four different ideas placed in sequence.",
        explanation:
          "The exposition establishes the thematic and tonal material whose relationships will matter for the rest of the movement. A principal theme or group gives the listener a stable point of departure. A transition then makes the music fluid and directs it toward another region. The subordinate group establishes a contrasting stable area, and closing material confirms that the exposition has reached its destination rather than simply running out of notes.

These functions need not occupy equal lengths, and a theme can itself be a sentence, period, ternary unit or larger group. What matters is the contrast between stable thematic regions and the connective motion between them. The eight-bar Arrangement workspace is used here as a compressed map: bars 1-2 act as principal presentation, 3-4 as transition, 5-6 as subordinate group and 7-8 as closing confirmation. Layer density is only one audible variable, but it lets you make each function distinct without inventing a fake source melody.",
        instruction:
          "Study the exposition analysis. In Arrangement, treat bars 1-2 as the principal group, bars 3-4 as transition, bars 5-6 as the subordinate group and bars 7-8 as closing material. Give bar 1 at least two active layers. Make bars 3-4 change the texture relative to bars 1-2, then let bars 5-6 establish a new stable combination that shares at least one layer with the opening but differs in at least two. Make bars 7-8 related to the subordinate group rather than introducing a third unrelated texture. Perform at least six arrangement edits and play all eight bars continuously.",
        recognition:
          "Can you hear two stable thematic regions separated by a moving passage, followed by an ending that confirms the second region rather than starting another contrast?",
        source: {
          reference: "Chapter XX - The Exposition",
          focus:
            "The exposition coordinates principal material, transition, subordinate group and closing material into a stable large-scale presentation.",
          exampleIds: ["s18.exposition"],
        },
        terms: [
          {
            term: "Exposition",
            definition:
              "The opening large section that presents principal material, transition, subordinate material and the main contrasts later sections will work with.",
          },
          {
            term: "Principal group",
            definition:
              "The stable opening thematic region that establishes the movement's primary identity and tonal point of departure.",
          },
          {
            term: "Closing group",
            definition:
              "Material that confirms the exposition's destination after the subordinate region has been established.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Shape the exposition",
        successLabel: "The eight-bar model now has presentation, motion, contrast and closure",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const principal = arrangement[0];
        const transition = arrangement[2];
        const subordinate = arrangement[4];
        const closing = arrangement[6];
        return [
          {
            label: "You studied the exposition functions",
            complete: analysed(experiments, "s18.exposition", 4),
          },
          {
            label: "You shaped the arrangement substantially",
            complete: arrangementEdits(experiments) >= 6,
          },
          { label: "You listened through the exposition", complete: heardPlayback(experiments) },
          {
            label: "The principal region is established",
            complete: activeLayerCount(principal) >= 2,
          },
          {
            label: "The transition changes the opening texture",
            complete: differenceCount(principal, transition) >= 1,
          },
          {
            label: "The subordinate region contrasts but stays connected",
            complete:
              differenceCount(principal, subordinate) >= 2 &&
              sharedCount(principal, subordinate) >= 1,
          },
          {
            label: "Closing material remains related to the subordinate region",
            complete: sharedCount(subordinate, closing) >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.sonata-allegro.b",
        letter: "B",
        title: "Elaborate instead of inventing again",
        learn:
          "The central elaboration gains energy from familiar material placed in changing contexts, not from replacing the exposition with a completely unrelated collection of themes.",
        explanation:
          "The central section is often called the development, but its practical task is better understood as elaboration or working-out. Material already presented can be sequenced, varied, fragmented, transferred to new registers, combined differently and placed over changing harmony. The contrast with the exposition comes especially from instability: regions change more freely, phrases can overlap and the material no longer behaves like a stable theme being presented for the first time.

A convincing elaboration usually combines continuity with acceleration of events. Several segments can use the same source motive while changing interval, direction or rhythm; later segments may become shorter and more liquidated as the return approaches. Simply adding a brand-new melody avoids the compositional problem rather than solving it. In this compact Motif study, the first block is the exposed material, two later blocks are related transformations, and the final block begins to reduce the material toward retransition.",
        instruction:
          "Study all five elaboration principles. In the Motif workspace, make steps 1-4 a source block with at least three sounding notes. Make steps 5-8 and 9-12 two different related variants: each should share at least one pitch with the source and neither should be an exact copy. Use steps 13-16 as a reduced continuation with no more than two sounding notes. Make at least eight melody edits and listen after each major version. Aim for continuous working-out - the source should remain traceable even while the later blocks become more mobile and compressed.",
        recognition:
          "Can you trace the opening idea through both transformed blocks, and does the final reduction feel like intensified working-out moving toward return rather than simple exhaustion?",
        source: {
          reference: "Chapter XX - The Elaboration",
          focus:
            "The central elaboration works with earlier thematic material in unstable changing regions, often intensifying through sequence, shortening and liquidation.",
          exampleIds: ["s18.elaboration"],
        },
        terms: [
          {
            term: "Elaboration",
            definition:
              "Developmental working-out that varies and recombines established thematic elements in changing formal and harmonic contexts.",
          },
          {
            term: "Working-out",
            definition:
              "Active treatment of familiar material through sequence, variation, fragmentation, combination and other transformations.",
          },
          {
            term: "Roving harmony",
            definition:
              "Harmonic motion that avoids settling for long in one stable region and contributes to developmental instability.",
          },
        ],
        workspace: "motif",
        checksLabel: "Work out the exposed material",
        successLabel: "The middle now develops one source through changing related forms",
      }),
      evaluate: ({ melody, experiments }) => {
        const source = melody.slice(0, 4);
        const first = melody.slice(4, 8);
        const second = melody.slice(8, 12);
        const residue = melody.slice(12, 16);
        return [
          {
            label: "You studied the elaboration process",
            complete: analysed(experiments, "s18.elaboration", 5),
          },
          {
            label: "You developed several variants",
            complete: melodyEdits(experiments) >= 8,
          },
          { label: "You listened through the working-out", complete: heardPlayback(experiments) },
          {
            label: "The source block is substantial",
            complete: sounding(source).length >= 3,
          },
          {
            label: "The first variant remains related but changed",
            complete:
              sharedPitches(source, first) >= 1 &&
              !sameBlock(source, first),
          },
          {
            label: "The second variant also derives from the source",
            complete:
              sharedPitches(source, second) >= 1 &&
              !sameBlock(source, second),
          },
          {
            label: "The final block is liquidated",
            complete: sounding(residue).length <= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.sonata-allegro.c",
        letter: "C",
        title: "Turn elaboration into retransition",
        learn:
          "The retransition must stop the elaboration from roaming indefinitely and convert instability into a clear expectation of the principal return.",
        explanation:
          "After an elaboration has moved through changing regions, the music needs a convincing way back. The retransition does not simply announce that the development is over. It neutralises the previous modulatory momentum, reduces remaining motivic obligations and focuses harmonic expectation on the returning tonic. A prolonged dominant or another strong preparatory harmony can make the recapitulation feel inevitable before its first note appears.

The effectiveness of this passage depends on timing. A dominant reached too early and held without enough musical life can become inert; a return introduced before instability has been sufficiently reduced can feel arbitrary. Motive, register, rhythm and dynamics can all help mark the junction. This exercise isolates the harmonic side of the problem: move through at least one non-tonic function, then end with an unresolved dominant whose only convincing next event would be the return.",
        instruction:
          "Study the retransition analysis. In Harmonic Function, create at least three sounding chords and edit at least three slots. Begin away from a final tonic closure, include at least two different harmonic functions, and make the last sounding chord dominant-function. Do not resolve that final dominant inside the four-slot progression. Play the route repeatedly and compare versions with a tonic ending against versions that stop on dominant preparation. Keep the version in which the absent recapitulation is most strongly implied by what you hear.",
        recognition:
          "When playback stops on the last chord, do you mentally expect the principal theme and tonic to arrive next?",
        source: {
          reference: "Chapter XX - The Retransition",
          focus:
            "Retransition neutralizes developmental instability, liquidates remaining material and concentrates expectation before recapitulation.",
          exampleIds: ["s18.retransition"],
        },
        terms: [
          {
            term: "Retransition",
            definition:
              "The passage that converts developmental instability into direct preparation for the recapitulation.",
          },
          {
            term: "Dominant preparation",
            definition:
              "Sustained or repeated dominant-function harmony that creates a strong expectation of tonic return.",
          },
          {
            term: "Recapitulation",
            definition:
              "The large returning section that restores principal material and reorganizes earlier contrasts within the home tonal region.",
          },
        ],
        workspace: "harmonic-function",
        checksLabel: "Prepare the recapitulation",
        successLabel: "The harmonic route now points clearly toward an absent tonic return",
      }),
      evaluate: ({ harmonicProgression, experiments }) => {
        const chords = harmonicProgression.filter((chord) => chord !== null);
        const functions = chords.map((chord) => harmonicFunction(chord));
        const last = [...harmonicProgression].reverse().find((chord) => chord !== null);
        return [
          {
            label: "You studied retransition into recapitulation",
            complete: analysed(experiments, "s18.retransition", 4),
          },
          {
            label: "You revised the harmonic preparation",
            complete: harmonicEdits(experiments) >= 3,
          },
          { label: "You listened to the unresolved preparation", complete: heardPlayback(experiments) },
          {
            label: "The route contains enough harmonic motion",
            complete: chords.length >= 3 && new Set(functions).size >= 2,
          },
          {
            label: "The final harmony remains dominant",
            complete: Boolean(last && harmonicFunction(last) === "dominant"),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.sonata-allegro.d",
        letter: "D",
        title: "Hear the whole sonata-allegro argument",
        learn:
          "At the largest scale, exposition, elaboration, retransition and recapitulation must sound like different functions of one argument rather than four equally weighted sections.",
        explanation:
          "Sonata-allegro can be understood as a large three-part design: exposition, elaboration and recapitulation, with transition and retransition supplying the connective work. The exposition is comparatively stable and presents contrasting thematic groups. The elaboration destabilises that material through changing contexts. The retransition focuses the accumulated motion toward return. The recapitulation then restores the principal region and brings subordinate material into a home-key context, often with substantial changes rather than literal repetition.

The return therefore combines familiarity with recomposition. At minimum, the subordinate group has to be adapted to its new tonal function; transitions may be altered, compressed or intensified, and a coda may follow once the essential balance has already been restored. The four-block Phrase & Form study compresses these functions into exposition, elaboration, retransition and recapitulation. It is not a bar-for-bar sonata template. The goal is to hear a large curve from stability through instability and preparation back to recognisable return.",
        instruction:
          "Study the complete architecture and recapitulation analysis. In Phrase & Form, set the four macro blocks to A → B → C → A′ and treat them as exposition, elaboration, retransition and recapitulation. Give A at least two active layers. Make B differ from A in at least two layers while retaining one connection. Make C sparser than B and keep at least one shared layer so it sounds like preparation rather than a new theme. Make A′ recover at least two layers from A while changing at least one. Perform at least seven form edits, then play all sixteen bars continuously and judge the entire stability-instability-preparation-return curve.",
        recognition:
          "Without looking at the labels, can you hear the final block as a necessary return after a contrasting middle and a thinning preparation?",
        source: {
          reference: "Chapter XX - Sonata-Allegro; Recapitulation and Coda",
          focus:
            "The form coordinates exposition, elaboration and recapitulation; the return restores the home region while adapting earlier material, with coda added only after essential balance is restored.",
          exampleIds: ["s18.sonata-architecture", "s18.recapitulation-coda"],
        },
        terms: [
          {
            term: "Sonata-allegro",
            definition:
              "A large form built from exposition, central elaboration and recapitulation, connected by transitional functions.",
          },
          {
            term: "Recapitulatory adaptation",
            definition:
              "Changes made to returning exposition material so it can fulfil its new tonal and formal role in the home region.",
          },
          {
            term: "Large-scale function",
            definition:
              "The perceptual job of a major section - presentation, instability, preparation, return or completion - rather than its exact length.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Hear the large curve",
        successLabel: "The model now moves from exposition through instability to prepared return",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [exposition, elaboration, retransition, recapitulation] = formSettings.layers;
        return [
          {
            label: "You studied the complete sonata-allegro architecture",
            complete:
              analysed(experiments, "s18.sonata-architecture", 4) &&
              analysed(experiments, "s18.recapitulation-coda", 4),
          },
          {
            label: "You shaped the large-scale curve",
            complete: formEdits(experiments) >= 7,
          },
          { label: "You listened through the complete form model", complete: heardPlayback(experiments) },
          {
            label: "The macro plan reads A → B → C → A′",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "C" &&
              formSettings.sections[3] === "A′",
          },
          {
            label: "Elaboration departs while retaining a connection",
            complete:
              activeLayerCount(exposition) >= 2 &&
              differenceCount(exposition, elaboration) >= 2 &&
              sharedCount(exposition, elaboration) >= 1,
          },
          {
            label: "Retransition reduces the developmental texture",
            complete:
              sharedCount(elaboration, retransition) >= 1 &&
              activeLayerCount(retransition) < activeLayerCount(elaboration),
          },
          {
            label: "Recapitulation restores and adapts the opening",
            complete:
              sharedCount(exposition, recapitulation) >= 2 &&
              differenceCount(exposition, recapitulation) >= 1,
          },
        ];
      },
    },
  ],
};
