import {
  activeLayerCount,
  arrangementLayers,
  type ArrangementBar,
} from "../music/model";
import { heardPlayback } from "./learningEvidence";
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

function analysedSegments(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

const lesson = lessonContentSchema.parse({
  id: "schoenberg.small-ternary",
  number: 11,
  title: "The small ternary form",
  eyebrow: "Schoenberg · Small forms",
  hero:
    "Establish an opening, leave it decisively, then make the return recognisable without merely copying it.",
  description:
    "Small ternary form turns the phrase-level skills from earlier lessons into a complete A-B-A′ design. The opening establishes the home region, the middle creates coherent contrast, and the return restores familiar material while adapting cadence, proportion or surface detail to complete the piece.",
  overview:
    "Treat form as a memory problem: the middle has to be different enough to matter, and the return has to recover enough of the opening that the listener hears arrival rather than another new section.",
});

export const schoenbergSmallTernaryLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.small-ternary.a",
        letter: "A",
        title: "Hear departure and return",
        learn:
          "Recognise the three functions of a small ternary form before trying to compose one: establish, contrast, return.",
        explanation:
          "A three-part design is not created by placing three labels over equal spans. The opening section has to establish enough tonal and thematic identity that the listener can remember it. The middle then creates a real departure, most strongly through harmony but also through register, texture, rhythmic activity and transformed motive-forms. When the opening material comes back, its significance depends on that remembered identity.\n\nThe return is therefore heard relationally. If the middle barely differs from the opening, the return has nothing to resolve. If the middle abandons every connection, the piece can sound like unrelated fragments. The useful middle lies between those extremes: it changes enough to create contrast while retaining motive, rhythm or other connective material. The returning section then restores the home region and enough characteristic material to make the large A-B-A′ relation audible.",
        instruction:
          "Study all four parts of the form overview, then use the Phrase & Form workspace to set the first three sections to A → B → A′. Give A at least two active layers. Make B audibly different from A by changing at least two layers, but keep at least one layer common so the contrast still belongs to the same piece. Make A′ share at least two layers with A. Play through the complete sequence at least once without changing anything midway and decide whether the return is recognisable before you look at the labels.",
        recognition:
          "When A′ arrives, do you hear a return because something remembered comes back, or only because the screen says that the section has returned?",
        source: {
          reference: "Chapter XIII - The Small Ternary Form",
          focus:
            "Opening section, contrasting middle and modified recapitulation form one coherent three-part design.",
          exampleIds: ["s11.ternary-form"],
        },
        terms: [
          {
            term: "Small ternary form",
            definition:
              "A compact three-part design in which an opening section is followed by contrast and then a recognisable return, commonly represented A-B-A′.",
          },
          {
            term: "Recapitulation",
            definition:
              "The returning section that restores earlier thematic material and normally brings the form back to its home tonal region.",
          },
          {
            term: "Coherent contrast",
            definition:
              "Material that differs enough to create a new formal function while retaining connections to the rest of the piece.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Hear the three functions",
        successLabel: "The departure and return now have audible formal roles",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b, aPrime] = formSettings.layers;
        return [
          {
            label: "You worked through the three-part form analysis",
            complete: analysedSegments(experiments, "s11.ternary-form", 4),
          },
          {
            label: "You edited the formal layer plan",
            complete: formLayerEdits(experiments) >= 2,
          },
          { label: "You listened through the form", complete: heardPlayback(experiments) },
          {
            label: "The first three labels read A → B → A′",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "A′",
          },
          {
            label: "B contrasts with A while retaining a connection",
            complete:
              activeLayerCount(a) >= 2 &&
              activeLayerCount(b) >= 1 &&
              differenceCount(a, b) >= 2 &&
              sharedCount(a, b) >= 1,
          },
          {
            label: "A′ recovers at least two layers from A",
            complete: sharedCount(a, aPrime) >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.small-ternary.b",
        letter: "B",
        title: "Make the middle truly contrasting",
        learn:
          "Use contrast to create distance from the opening while keeping enough common material for the form to remain one argument.",
        explanation:
          "The middle section has a different job from an ordinary continuation. Its task is to make the return necessary. Harmonic departure is especially powerful because the ear can feel that the music has left its home region even when motive and rhythm remain related. Other dimensions can reinforce that departure: a thinner or denser texture, a different register, more active sequence, imitation, or a transformed version of the opening motive.\n\nContrast becomes structurally weak in two opposite ways. A middle that changes almost nothing behaves like another repetition of A; a middle that changes everything at once may sound like a new piece. A more convincing solution keeps one or two identity-bearing features while shifting other parameters decisively. Near the end, activity can reduce and harmonic motion can settle so that the return is prepared rather than simply pasted onto the end of B.",
        instruction:
          "Work through the middle-section analysis, then keep section 1 as your A and rebuild section 2 as B. Change at least two of the four available layers relative to A, but preserve at least one shared layer. If B currently feels merely thinner or louder, revise again so the combination itself has a different identity. Play A into B several times, then continue into A′. Your goal is to hear a clear departure at the start of B and a growing expectation for return by the end of that section.",
        recognition:
          "Does B create a genuine new region while still sounding derived from the same musical world, and does its ending make the return feel timely rather than arbitrary?",
        source: {
          reference: "Chapter XIII - The Contrasting Middle Section",
          focus:
            "Harmony, transformed motive-forms and changing activity create contrast; the end of the middle prepares the return.",
          exampleIds: ["s11.middle-section", "s11.ternary-form"],
        },
        terms: [
          {
            term: "Contrasting middle",
            definition:
              "The central section whose function is to depart from the opening and create the conditions for a meaningful return.",
          },
          {
            term: "Preparation",
            definition:
              "Musical activity that makes a coming event feel expected, often by reducing motion or directing harmony toward its destination.",
          },
          {
            term: "Identity-bearing feature",
            definition:
              "A rhythm, motive, texture or other characteristic strong enough to make changed material still sound related.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Create coherent contrast",
        successLabel: "The middle now departs without breaking the piece",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b] = formSettings.layers;
        return [
          {
            label: "You inspected how the middle creates contrast",
            complete: analysedSegments(experiments, "s11.middle-section", 3),
          },
          {
            label: "You revised the middle section here",
            complete: formLayerEdits(experiments) >= 2,
          },
          { label: "You listened across A and B", complete: heardPlayback(experiments) },
          {
            label: "B differs from A in at least two layers",
            complete: differenceCount(a, b) >= 2,
          },
          {
            label: "At least one active layer connects A and B",
            complete: sharedCount(a, b) >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.small-ternary.c",
        letter: "C",
        title: "Return without photocopying",
        learn:
          "Make the recapitulation instantly recognisable while changing something that helps it function as the final section.",
        explanation:
          "A recapitulation does not have to repeat every measure of A. In compact ternary pieces the return may be shortened, extended, revoiced, refigured or otherwise reconstructed. What matters is that the thematic identity and homeward function are clear. The listener should recognise the return quickly enough that later differences are heard as modifications of familiar material, not as a new section.\n\nThe final cadence gives the return a special responsibility. An opening section may stop on a less final harmony or simply establish the tonic region; the last section has to complete the whole form. That often requires changing the route into the cadence even when the opening and return share much of their material. Surface variation can add freshness, but formal closure must remain stronger than decorative novelty.",
        instruction:
          "Study the return analysis, then compare sections 1 and 3. Keep at least two active layers from A so A′ is immediately recognisable, but make at least one layer different so the return is not an exact duplicate. If your return currently changes too much, restore the most characteristic layer first; if it changes nothing, alter one supporting layer rather than removing the feature that carries identity. Play from B into A′ and judge the return from the transition, not by auditioning A′ in isolation.",
        recognition:
          "Can you hear both propositions at once - this is clearly the opening again, and this version now belongs at the end?",
        source: {
          reference: "Chapter XIII - The Recapitulation",
          focus:
            "Recapitulation preserves recognition while allowing condensation, extension, surface variation and a stronger final cadence.",
          exampleIds: ["s11.recapitulation"],
        },
        terms: [
          {
            term: "Modified return",
            definition:
              "A recapitulation that restores the opening identity while changing details, proportion or continuation.",
          },
          {
            term: "Condensation",
            definition:
              "Shortening familiar material by omitting or compressing parts while preserving its essential function.",
          },
          {
            term: "Final cadence",
            definition:
              "The closing harmonic and melodic action that confirms the end of the complete form.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Reshape the return",
        successLabel: "A′ is recognisable but now behaves like a conclusion",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const a = formSettings.layers[0];
        const aPrime = formSettings.layers[2];
        return [
          {
            label: "You inspected several ways a return can change",
            complete: analysedSegments(experiments, "s11.recapitulation", 3),
          },
          {
            label: "You edited the returning section",
            complete: formLayerEdits(experiments) >= 1,
          },
          { label: "You listened from B into A′", complete: heardPlayback(experiments) },
          {
            label: "A′ remains recognisably connected to A",
            complete: sharedCount(a, aPrime) >= 2,
          },
          {
            label: "A′ is not an exact layer-for-layer duplicate",
            complete: signature(a) !== signature(aPrime),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.small-ternary.d",
        letter: "D",
        title: "Build the complete small form",
        learn:
          "Coordinate contrast and return across one complete design instead of solving each section independently.",
        explanation:
          "Once A, B and A′ work separately, the decisive question is whether their proportions and contrasts form one continuous experience. The opening must establish enough material to survive absence. The middle must create enough distance to refresh the ear. The return must arrive before the listener forgets A, yet differ enough to avoid the feeling that the piece has simply restarted. These functions depend on one another.\n\nA short extension after the return can be useful when it strengthens closure rather than introducing another formal problem. The whole design should therefore feel directional: establishment, departure, preparation, return and completion. Good small form is economical because each section changes the meaning of the others; the middle makes A memorable, and the return makes the middle sound like a purposeful departure.",
        instruction:
          "Set the four available sections to A → B → A′ → A′, treating the last block as an extension of the returning region rather than a fourth principal section. Give A at least two active layers. Make B differ from A by at least two layers while sharing at least one. Make the first A′ share at least two layers with A but differ in at least one, then let the final block preserve the identity of that return. Play all sixteen bars without editing and listen specifically for establishment, departure, return and completion in that order.",
        recognition:
          "If the labels disappeared, would you still hear one compact form with a middle that departs and an ending that returns home?",
        source: {
          reference: "Chapter XIII - complete small ternary practice",
          focus:
            "The form coordinates opening identity, coherent contrast, preparation, modified return and final closure.",
          exampleIds: ["s11.ternary-form", "s11.middle-section", "s11.recapitulation"],
        },
        terms: [
          {
            term: "Formal proportion",
            definition:
              "The relative scale and duration of sections as perceived within the complete musical design.",
          },
          {
            term: "Extension",
            definition:
              "Additional material that prolongs or reinforces a formal function already in progress.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Complete the ternary design",
        successLabel: "The complete form now establishes, departs, returns and closes",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b, aPrime, extension] = formSettings.layers;
        return [
          {
            label: "You explored all three formal functions",
            complete:
              analysedSegments(experiments, "s11.ternary-form", 2) &&
              analysedSegments(experiments, "s11.middle-section", 2) &&
              analysedSegments(experiments, "s11.recapitulation", 2),
          },
          {
            label: "You made a substantial formal edit pass",
            complete: formLayerEdits(experiments) >= 4,
          },
          { label: "You listened through all sixteen bars", complete: heardPlayback(experiments) },
          {
            label: "The labels read A → B → A′ → A′",
            complete: formSettings.sections.join("|") === "A|B|A′|A′",
          },
          {
            label: "B creates coherent contrast",
            complete: differenceCount(a, b) >= 2 && sharedCount(a, b) >= 1,
          },
          {
            label: "The return is related but modified",
            complete: sharedCount(a, aPrime) >= 2 && signature(a) !== signature(aPrime),
          },
          {
            label: "The final block remains in the returning family",
            complete: sharedCount(aPrime, extension) >= 2,
          },
        ];
      },
    },
  ],
};
