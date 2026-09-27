import {
  activeLayerCount,
  arrangementLayers,
  type ArrangementBar,
} from "../music/model";
import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
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

function formLayerEdits(
  experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"],
): number {
  return Object.entries(experiments).reduce(
    (total, [key, value]) =>
      total + (key.startsWith("form.layer.") ? value.changes : 0),
    0,
  );
}

const lesson = lessonContentSchema.parse({
  id: "composition.phrase-form",
  number: 17,
  title: "Section form through arrangement",
  eyebrow: "Composition · Structure",
  hero: "Use orchestration to make repetition, contrast and return audible.",
  description:
    "Build four audible four-bar sections while the underlying notes stay shared. This workspace isolates one dimension of form: which musical layers are present, absent, repeated or restored.",
  overview:
    "Form depends on memory, but form is larger than a layer plan. Here you are specifically learning how orchestration can mark A, A′, B and return. Melody, harmony and motive can also create formal identity; those are separate compositional dimensions.",
});

export const phraseFormLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.a",
        letter: "A",
        title: "Make statement and answer",
        learn: "Make A and A′ related through orchestration while the musical material stays shared.",
        explanation:
          "A′ means a varied version of A. In this workspace the notes themselves stay shared, so the variation comes from orchestration: preserve enough layers for recognition, then change at least one layer so the second section has a different texture.",
        instruction:
          "Set section 1 to A and section 2 to A′. Give both at least two active layers. Keep at least two layers shared between them, but change at least one layer in A′. Play through bar 8 and hear what stayed versus what changed.",
        recognition:
          "Listen through bar 5 without looking. Can you name what changed in A′ and what stayed from A?",
        terms: [
          { term: "Statement", definition: "An initial presentation of musical material that establishes an identity." },
          { term: "Answer", definition: "A related continuation or response that develops or completes the statement." },
          { term: "A′", definition: "A varied version of A: recognisably related, but not identical." },
        ],
        workspace: "phrase-form",
        checksLabel: "Make it audible",
        successLabel: "A and A′ now sound related but different",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const first = formSettings.layers[0];
        const second = formSettings.layers[1];
        return [
          { label: "You changed the section layers in this exercise", complete: formLayerEdits(experiments) >= 1 },
          { label: "You listened through the form", complete: heardPlayback(experiments) },
          { label: "Sections 1–2 are labelled A → A′", complete: formSettings.sections[0] === "A" && formSettings.sections[1] === "A′" },
          { label: "Both sections contain at least two sounding layers", complete: activeLayerCount(first) >= 2 && activeLayerCount(second) >= 2 },
          { label: "A′ keeps at least two layers from A", complete: sharedCount(first, second) >= 2 },
          { label: "A′ changes at least one layer", complete: differenceCount(first, second) >= 1 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.b",
        letter: "B",
        title: "Create binary form",
        learn: "Create a binary section contrast using orchestration alone.",
        explanation:
          "Binary form can involve harmony, motives, register, rhythm and texture. This exercise isolates texture: repeated A sections should share one layer identity, repeated B sections another, so you can hear how orchestration alone can mark a formal boundary.",
        instruction:
          "Set the sections to A → A → B → B. Make sections 1 and 2 use the same layer combination, sections 3 and 4 use another matching combination, and make A and B differ by at least two layers. Play all sixteen bars.",
        recognition:
          "At bar 9, does the change register immediately? After four bars of B, does it still feel connected to the same track?",
        terms: [
          { term: "Binary form", definition: "A two-part form organised as one region followed by a contrasting second region." },
          { term: "Section identity", definition: "The recurring musical features that make a section recognisable when it returns." },
        ],
        workspace: "phrase-form",
        checksLabel: "Build A/B",
        successLabel: "The labels now correspond to two audible sections",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a1, a2, b1, b2] = formSettings.layers;
        return [
          { label: "You changed the section layers in this exercise", complete: formLayerEdits(experiments) >= 2 },
          { label: "You listened through the form", complete: heardPlayback(experiments) },
          { label: "Labels read A → A → B → B", complete: formSettings.sections.join("|") === "A|A|B|B" },
          { label: "The two A sections sound the same", complete: signature(a1) === signature(a2) && activeLayerCount(a1) >= 2 },
          { label: "The two B sections sound the same", complete: signature(b1) === signature(b2) && activeLayerCount(b1) >= 2 },
          { label: "A and B differ by at least two layers", complete: differenceCount(a1, b1) >= 2 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.c",
        letter: "C",
        title: "Leave and return",
        learn: "Make the return of A recognisable by restoring its orchestration after contrast.",
        explanation:
          "A return has meaning because something familiar comes back after contrast. Here the fingerprint is deliberately limited to the section's layer plan: restore it exactly so you can isolate the perceptual effect of orchestration returning.",
        instruction:
          "Set A → B → A → A′. Make section 3 restore section 1 exactly. Make B differ from A by at least two layers. Give A′ at least two shared layers with A but one audible change.",
        recognition:
          "When section 3 arrives, do you recognise the opening before you check the label? What detail gives the return away?",
        terms: [
          { term: "Ternary form", definition: "A form organised around departure and return, commonly A–B–A." },
          { term: "Return", definition: "The reappearance of familiar material after contrasting material." },
        ],
        workspace: "phrase-form",
        checksLabel: "Make the return",
        successLabel: "The A return is now something the ear can recognise",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a1, b, aReturn, aPrime] = formSettings.layers;
        return [
          { label: "You changed the section layers in this exercise", complete: formLayerEdits(experiments) >= 2 },
          { label: "You listened through the form", complete: heardPlayback(experiments) },
          { label: "Labels begin A → B → A → A′", complete: formSettings.sections.join("|") === "A|B|A|A′" },
          { label: "The returning A restores the opening layer plan", complete: activeLayerCount(a1) >= 2 && signature(a1) === signature(aReturn) },
          { label: "B contrasts with A by at least two layers", complete: differenceCount(a1, b) >= 2 && activeLayerCount(b) >= 1 },
          { label: "A′ keeps A recognisable but changes it", complete: sharedCount(a1, aPrime) >= 2 && differenceCount(a1, aPrime) >= 1 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.d",
        letter: "D",
        title: "Build AABA as music",
        learn: "Use repeated and contrasting orchestration to make an AABA outline audible.",
        explanation:
          "AABA works because the first two A sections create memory, B interrupts that pattern, and the final A restores it. In this simplified form lab, section identity comes from the layer plan; a complete composition could also vary motives, harmony and phrase content.",
        instruction:
          "Set A → A → B → A. Give A at least two layers and use the exact same layer plan in sections 1, 2, and 4. Make B differ from A by at least two layers. Play all sixteen bars without watching the labels and listen for the departure and return.",
        recognition:
          "Play all sixteen bars without watching the letters. Can you hear the eight-bar familiarity, the four-bar departure and the final return?",
        terms: [
          { term: "AABA", definition: "A four-section form with repeated A material, a contrasting B section, and a final return to A." },
          { term: "Formal contrast", definition: "A difference large enough to mark a structural boundary while remaining part of the same piece." },
        ],
        workspace: "phrase-form",
        checksLabel: "Complete the form",
        successLabel: "Your sixteen-bar AABA form is audible, not merely labelled",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a1, a2, b, a3] = formSettings.layers;
        return [
          { label: "You changed the section layers in this exercise", complete: formLayerEdits(experiments) >= 2 },
          { label: "You listened through the form", complete: heardPlayback(experiments) },
          { label: "Labels read A → A → B → A", complete: formSettings.sections.join("|") === "A|A|B|A" },
          { label: "All three A sections use the same musical layers", complete: activeLayerCount(a1) >= 2 && signature(a1) === signature(a2) && signature(a1) === signature(a3) },
          { label: "B contains audible material", complete: activeLayerCount(b) >= 1 },
          { label: "B differs from A by at least two layers", complete: differenceCount(a1, b) >= 2 },
        ];
      },
    },
  ],
};
