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
  title: "Phrase & form",
  eyebrow: "Composition · Structure",
  hero: "Make repetition and contrast happen in the music.",
  description:
    "Build four audible four-bar sections. A, A′ and B are only labels; make those relationships real by changing, keeping and bringing back musical layers.",
  overview:
    "Form depends on memory. A return only feels like a return if the ear recognises something from before; a B section only earns its name if the music really changes.",
});

export const phraseFormLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.a",
        letter: "A",
        title: "Make statement and answer",
        learn: "Turn A and A′ into two related but audibly different sections.",
        explanation:
          "A′ means a varied return of an idea, not a new letter pasted onto the timeline. The second section should preserve enough of A to be recognised while changing at least one musical layer.",
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
        learn: "Make A and B sound like two stable regions.",
        explanation:
          "Binary form needs more than two names. The repeated A should have a stable identity, the repeated B should have its own identity, and the listener should hear a boundary between them.",
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
        learn: "Make the return of A recognisable after a contrasting B.",
        explanation:
          "Ternary thinking depends on memory: the return has meaning because something familiar comes back after contrast. The musical fingerprint of A therefore has to reappear, not merely its letter.",
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
        learn: "Use repetition, contrast, and return in one complete sixteen-bar form.",
        explanation:
          "AABA works because the first two A sections create memory, B interrupts that pattern, and the final A restores it. The form should remain understandable with the labels hidden.",
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
