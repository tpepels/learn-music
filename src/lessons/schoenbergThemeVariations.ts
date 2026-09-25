import { activeLayerCount, arrangementLayers } from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function sounding(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function analysed(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

function block(sequence: Array<number | null>, start: number): Array<number | null> {
  return sequence.slice(start, start + 4);
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
  id: "schoenberg.theme-variations",
  number: 15,
  title: "Theme & variations",
  eyebrow: "Schoenberg · Small forms",
  hero:
    "Preserve the theme's structural identity while each variation applies one clear transforming idea.",
  description:
    "Theme and variations turns repetition into the organising principle of a whole piece. A clear theme leaves room for transformation; each variation preserves the course of events while a systematic variation motive changes character, texture, rhythm or counterpoint.",
  overview:
    "Start with a theme simple enough to transform, choose a unifying device for each variation, preserve the proportions that make the theme recognisable, then order several variations so the set itself has direction.",
});

export const schoenbergThemeVariationsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.theme-variations.a",
        letter: "A",
        title: "Write a theme with room to grow",
        learn:
          "Make the theme clear and self-sufficient without using every striking possibility before the variations begin.",
        explanation:
          "A variation theme has a paradoxical job. It must be characteristic enough to remain recognisable, yet simple enough to leave room for later additions. If every measure already contains extreme register, dense ornament, rapid harmonic change and several unrelated motives, later variations have nowhere obvious to go. The theme should instead expose its structure clearly: coherent motive-forms, definite subdivision, audible phrasing and a harmonic plan the listener can remember.

Simplicity here does not mean blandness. A strong theme contains relationships that can be reinterpreted. Its rhythm may suggest diminution or augmentation; its contour may invite inversion; its harmony may support new figuration; its inner voices may later become contrapuntal material. The theme works as a framework whose main proportions and events remain useful even when its surface character changes radically.",
        instruction:
          "Study all four principles of a variation theme, then revise the Melody workspace into a clear sixteen-step theme. Keep between eight and fourteen sounding notes, use at least four different pitches, and keep the range between five and fourteen semitones. Make at least six melody edits while listening. Avoid filling every step or making every note a new extreme. The final line should have enough identity to remember after one hearing but enough space that you can imagine changing its rhythm, texture or register later.",
        recognition:
          "Can you sing or remember the theme's main shape after one hearing, and can you also imagine several ways to transform it without destroying that shape?",
        source: {
          reference: "Chapter XVII - Structural Constitution of the Theme",
          focus:
            "A useful variation theme has clear subdivision, closely related motive-forms, understandable harmony and enough simplicity to permit later transformation.",
          exampleIds: ["s15.variation-theme"],
        },
        terms: [
          {
            term: "Variation theme",
            definition:
              "The structural source whose proportions, events and characteristic features provide the reference for a set of variations.",
          },
          {
            term: "Self-sufficiency",
            definition:
              "The ability of a theme or variation to function as a coherent complete musical unit in its own right.",
          },
          {
            term: "Structural feature",
            definition:
              "A relationship of phrasing, harmony, proportion or motive important enough to persist beneath surface change.",
          },
        ],
        workspace: "melody",
        checksLabel: "Prepare a transformable theme",
        successLabel: "The theme is clear, memorable and still leaves room for variation",
      }),
      evaluate: ({ melody, experiments }) => {
        const notes = sounding(melody);
        const range = notes.length ? Math.max(...notes) - Math.min(...notes) : 0;
        return [
          {
            label: "You studied what makes a useful variation theme",
            complete: analysed(experiments, "s15.variation-theme", 4),
          },
          {
            label: "You revised the theme substantially",
            complete: changedControl(experiments, "melody.edit", 6),
          },
          { label: "You listened to the complete theme", complete: heardPlayback(experiments) },
          {
            label: "The theme is neither empty nor overcrowded",
            complete: notes.length >= 8 && notes.length <= 14,
          },
          {
            label: "The theme has controlled pitch variety",
            complete: new Set(notes).size >= 4 && range >= 5 && range <= 14,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.theme-variations.b",
        letter: "B",
        title: "Choose one motive of variation",
        learn:
          "Unify a variation by applying one characteristic treatment systematically instead of changing every parameter at once.",
        explanation:
          "In a theme-and-variations movement, the word variation names more than local motive transformation. Each complete variation needs an identity of its own. A useful way to achieve that unity is a motive of variation: a recurring figure or procedure applied throughout the variation and altered only as harmony and structure require. It might be a rhythmic figure, an ornamental pattern, a contrapuntal treatment or another consistent device.

The strongest device often grows from something latent in the theme itself. That creates a double connection: the variation follows the theme's formal course and its new surface also derives from the same musical material. Systematic treatment is more important than novelty at every moment. If the first phrase uses one procedure, the second another and the cadence a third unrelated trick, the variation may become a collage rather than one transformed version of the theme.",
        instruction:
          "Work through all four motive-of-variation principles. In the Motif workspace, keep steps 1-4 as a source block with at least three sounding notes. Rewrite steps 5-8 so they share at least two pitches with the source but are not an exact copy. Then use a similar treatment in steps 9-12 rather than inventing a completely new gesture. Make at least six melody edits and listen repeatedly. You should be able to name the single procedure that gives the changed blocks their common identity.",
        recognition:
          "If you hid the pitches and listened only for the treatment, would the changed blocks still sound as though one variation principle governs them?",
        source: {
          reference: "Chapter XVII - The Motive of Variation",
          focus:
            "Each variation gains unity from a systematic motive or procedure that remains recognisable while adapting to harmony and structure.",
          exampleIds: ["s15.variation-motive"],
        },
        terms: [
          {
            term: "Motive of variation",
            definition:
              "A characteristic figure or procedure applied systematically so one complete variation has a unified surface identity.",
          },
          {
            term: "Systematic variation",
            definition:
              "Transformation governed by a consistent procedure rather than unrelated local changes.",
          },
          {
            term: "Derived device",
            definition:
              "A variation procedure whose characteristic material grows from a feature already present in the theme.",
          },
        ],
        workspace: "motif",
        checksLabel: "Unify the variation",
        successLabel: "The changed material now follows one recognisable variation principle",
      }),
      evaluate: ({ melody, experiments }) => {
        const source = block(melody, 0);
        const firstVariation = block(melody, 4);
        const secondVariation = block(melody, 8);
        return [
          {
            label: "You studied the motive-of-variation principle",
            complete: analysed(experiments, "s15.variation-motive", 4),
          },
          {
            label: "You developed the variation in this exercise",
            complete: changedControl(experiments, "melody.edit", 6),
          },
          { label: "You listened while comparing the blocks", complete: heardPlayback(experiments) },
          {
            label: "The source block contains at least three notes",
            complete: sounding(source).length >= 3,
          },
          {
            label: "The first changed block is related but not identical",
            complete:
              sharedPitches(source, firstVariation) >= 2 &&
              !sameBlock(source, firstVariation),
          },
          {
            label: "A later block continues to use source material",
            complete: sharedPitches(source, secondVariation) >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.theme-variations.c",
        letter: "C",
        title: "Change character, preserve structure",
        learn:
          "Transform texture and register while keeping the theme's underlying course recognisable.",
        explanation:
          "A variation may change metre, tempo, figuration, register, texture or even overall character while still preserving the theme's structural relation. Recognition does not require every note to remain in the same voice. The important landmarks - subdivisions, harmonic route, principal events and proportions - can continue beneath a very different surface. This is why variation is more than ornamenting a melody.

Texture is a particularly clear way to experience the distinction. Moving the melody to another register, opening the harmony or changing density can make the same material feel lighter, heavier, more brilliant or more transparent without changing its formal skeleton. Such changes become convincing when they are systematic. A single random octave shift is decoration; a consistent registral or textural idea can define an entire variation.",
        instruction:
          "Study the relation-between-theme-and-variation principles, then use the Texture workspace to create a clearly different character. Change at least three texture controls during this exercise and listen after each change. End with at least one deliberate register displacement or open-voicing choice, and compare the result with the simpler theme character you established earlier. Do not judge only by loudness: listen for whether the same phrase still seems to occupy the same formal positions despite its new colour and spacing.",
        recognition:
          "Can you hear a different character without losing the sense that the same underlying theme is unfolding in the same order?",
        source: {
          reference: "Chapter XVII - Relation between Theme and Variations",
          focus:
            "Variations may change character and surface substantially while preserving proportions, structural relations and the course of principal events.",
          exampleIds: ["s15.variation-motive", "s15.variation-theme"],
        },
        terms: [
          {
            term: "Structural preservation",
            definition:
              "Keeping the theme's main proportions, subdivisions and event order perceptible beneath a changed surface.",
          },
          {
            term: "Character variation",
            definition:
              "A transformation that changes the expressive manner of the theme while retaining its structural identity.",
          },
          {
            term: "Figuration",
            definition:
              "A recurring surface pattern used to elaborate harmony or melody.",
          },
        ],
        workspace: "texture",
        checksLabel: "Transform the character",
        successLabel: "The texture has changed while the thematic framework remains the reference",
      }),
      evaluate: ({ textureSettings, experiments }) => {
        const changed =
          changedControl(experiments, "texture.bassOctave") ||
          changedControl(experiments, "texture.chordsOctave") ||
          changedControl(experiments, "texture.melodyOctave") ||
          changedControl(experiments, "texture.openChords") ||
          changedControl(experiments, "texture.melodyOctaveDouble");
        const distinctChoice =
          textureSettings.bassOctave !== 0 ||
          textureSettings.chordsOctave !== 0 ||
          textureSettings.melodyOctave !== 0 ||
          textureSettings.openChords ||
          textureSettings.melodyOctaveDouble;
        const totalChanges = [
          "texture.bassOctave",
          "texture.chordsOctave",
          "texture.melodyOctave",
          "texture.openChords",
          "texture.melodyOctaveDouble",
        ].reduce((sum, key) => sum + (experiments[key]?.changes ?? 0), 0);
        return [
          {
            label: "You studied how variation preserves structural relations",
            complete: analysed(experiments, "s15.variation-motive", 2),
          },
          {
            label: "You explored at least three texture changes",
            complete: changed && totalChanges >= 3,
          },
          { label: "You listened while changing character", complete: heardPlayback(experiments) },
          {
            label: "The final texture differs deliberately from the neutral state",
            complete: distinctChoice,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.theme-variations.d",
        letter: "D",
        title: "Organise a set of variations",
        learn:
          "Order contrasting variation characters so the set develops as a larger form instead of becoming a catalogue of tricks.",
        explanation:
          "A set of variations has two levels of unity. Each variation must be coherent in itself, and the sequence of variations must make sense as a whole. If every variation has the same density, register and energy, repetition becomes monotonous. If every new variation changes all dimensions unpredictably, the theme loses its role as a stable reference. The set needs both continuity and a larger progression.

Sketching several possibilities before polishing helps reveal useful contrasts. One variation might thin the texture, another intensify rhythmic activity, another foreground counterpoint or a changed register. Their order can create accumulation, relief and finality. The last variation or an added coda may broaden the ending, but the conclusion should feel earned by the trajectory of the set rather than simply being the final item in a list.",
        instruction:
          "Study all five set-organisation principles, then use Arrangement to sketch four successive variation characters across the first four bars. Give every bar at least one active layer, use at least three different layer combinations, and include both one sparse bar with no more than two layers and one fuller bar with at least three. Make at least six arrangement edits and play through the sequence repeatedly. Reorder or revise the density curve until the four bars feel like a deliberate progression with contrast and an arrival rather than four unrelated orchestrations.",
        recognition:
          "Does each variation character have its own identity, and can you hear why they occur in this order rather than any other?",
        source: {
          reference: "Chapter XVII - Sketching and Organization of the Set",
          focus:
            "Variations should be sketched as alternatives, remain individually coherent, contrast in different ways and be ordered into a convincing larger progression.",
          exampleIds: ["s15.variation-set", "s15.variation-motive"],
        },
        terms: [
          {
            term: "Variation set",
            definition:
              "A sequence of complete transformations of one theme whose ordering creates a larger formal progression.",
          },
          {
            term: "Set organization",
            definition:
              "The deliberate ordering of variations by character, intensity, texture and formal function.",
          },
          {
            term: "Final variation",
            definition:
              "A concluding transformation that may be broadened or intensified so the set reaches a convincing end.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Shape the variation set",
        successLabel: "The variations now form a progression rather than a list",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const firstFour = arrangement.slice(0, 4);
        const densities = firstFour.map(activeLayerCount);
        const signatures = new Set(
          firstFour.map((bar) =>
            arrangementLayers.map((layer) => (bar[layer] ? "1" : "0")).join(""),
          ),
        );
        return [
          {
            label: "You studied how a set is sketched and ordered",
            complete: analysed(experiments, "s15.variation-set", 5),
          },
          {
            label: "You made a substantial arrangement sketch",
            complete: changedControl(experiments, "arrangement.edit", 6),
          },
          { label: "You listened through the sequence", complete: heardPlayback(experiments) },
          {
            label: "All four variation sketches contain musical material",
            complete: densities.every((density) => density >= 1),
          },
          {
            label: "At least three distinct variation textures are present",
            complete: signatures.size >= 3,
          },
          {
            label: "The set contains both sparse and fuller characters",
            complete:
              densities.some((density) => density <= 2) &&
              densities.some((density) => density >= 3),
          },
        ];
      },
    },
  ],
};
