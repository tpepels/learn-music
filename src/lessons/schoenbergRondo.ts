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

function analysed(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
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
  id: "schoenberg.rondo",
  number: 17,
  title: "Rondo forms",
  eyebrow: "Schoenberg · Large forms",
  hero:
    "Make one principal idea return often enough to organize the movement, while each intervening contrast gives the next return a new meaning.",
  description:
    "Rondo form is built from recurrence separated by contrast. The principal theme must be memorable enough to survive repeated returns, but those returns can be varied, subordinate material can be adapted, and a developmental middle can push the design toward sonata-rondo.",
  overview:
    "The listener should always know when the principal idea has come home. Contrast gives the returns purpose; variation keeps recurrence alive; adaptation lets material return in a new tonal role without losing recognition.",
});

export const schoenbergRondoLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.rondo.a",
        letter: "A",
        title: "Hear the refrain organize contrast",
        learn:
          "A rondo is defined by recurrence: a recognisable principal section returns between contrasting sections and becomes the listener's stable point of reference.",
        explanation:
          "The simplest rondo principle is easy to state but demanding to control. A principal idea returns after contrasting material, so the listener repeatedly alternates between familiarity and departure. The returning section must be distinct enough to function as a refrain, while the intervening sections must be different enough that the recurrence matters. If every section resembles A too closely, the form loses articulation; if each contrast sounds unrelated, A becomes an interruption rather than the centre of the movement.

Rondo types differ in scale and in the number of contrasting sections, but the perceptual principle remains recurrence separated by contrast. A compact A-B-A-C model already exposes the essential problem. The second A should restore enough of the opening texture to be recognised immediately. B and C should each differ from A and also from one another, so the listener hears two genuinely different departures rather than one contrast repeated under two labels.",
        instruction:
          "Study the four rondo principles below. In Phrase & Form, set the four blocks to A → B → A → C. Give the opening A at least two active layers. Make B differ from A by at least two layer choices while retaining at least one common layer. Make the returning A share at least two active layers with the opening. Make C differ from both A and B by at least one layer. Perform at least five form edits, then play the whole sixteen-bar model without stopping and listen for the moment the third block restores the movement's centre.",
        recognition:
          "Does the third block sound like a return you were waiting for, and do B and C feel like two different departures from the same centre?",
        source: {
          reference: "Chapter XIX - The Rondo Forms",
          focus:
            "Rondos repeat one or more principal themes between contrasting sections; the recurrent theme supplies formal orientation.",
          exampleIds: ["s17.rondo-types"],
        },
        terms: [
          {
            term: "Rondo",
            definition:
              "A form in which a principal section recurs between contrasting sections, creating repeated departure and return.",
          },
          {
            term: "Refrain",
            definition:
              "The recurrent principal section that acts as the stable reference point of a rondo.",
          },
          {
            term: "Episode",
            definition:
              "A contrasting section placed between returns of the principal rondo material.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Hear recurrence and contrast",
        successLabel: "The returning A now organizes two distinct departures",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b, returnA, c] = formSettings.layers;
        return [
          {
            label: "You studied the basic rondo principle",
            complete: analysed(experiments, "s17.rondo-types", 4),
          },
          { label: "You shaped the rondo model", complete: formEdits(experiments) >= 5 },
          { label: "You listened through the complete model", complete: heardPlayback(experiments) },
          {
            label: "The form reads A → B → A → C",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "A" &&
              formSettings.sections[3] === "C",
          },
          {
            label: "B contrasts while remaining connected",
            complete:
              activeLayerCount(a) >= 2 &&
              differenceCount(a, b) >= 2 &&
              sharedCount(a, b) >= 1,
          },
          {
            label: "The refrain returns recognisably",
            complete: sharedCount(a, returnA) >= 2,
          },
          {
            label: "C supplies a new contrast",
            complete:
              differenceCount(a, c) >= 1 &&
              differenceCount(b, c) >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.rondo.b",
        letter: "B",
        title: "Vary the returning refrain",
        learn:
          "A returning rondo theme can change its setting, register, figuration or accompaniment as long as its melodic and structural identity remains immediately recognisable.",
        explanation:
          "Recurrence does not require mechanical duplication. When the principal theme returns several times, literal repetition can become inert, while excessive rewriting destroys the formal landmark the listener depends on. The useful middle ground preserves the outline and structural proportions that identify the refrain while changing the surface. Instrumentation, register, accompaniment, contrapuntal additions, ornament and figuration can all refresh a return without changing its role.

This distinction is important because variation and formal return serve different purposes. A variation asks the listener to notice transformation; a rondo return first has to be recognised as the principal section. Surface change therefore remains subordinate to recognition. In the four-block model, A′ represents a varied recurrence rather than a new section. It should recover several of A's active layers, but at least one changed layer should make the return sound newly placed in the movement.",
        instruction:
          "Study the return-variation analysis. Set the form to A → B → A′ → C. Give A at least two active layers and make B clearly contrasting. Make A′ share at least two active layers with A but change at least one layer, so it is neither a literal copy nor a disguised new section. Keep C distinct from A′. Make at least five form edits and play A-B-A′ repeatedly before listening to all four blocks. Compare an exact return with your varied return and keep the version in which recognition is immediate but the repeated material feels renewed.",
        recognition:
          "Can you identify A′ as the principal refrain before reading its label, while still hearing a meaningful change of surface?",
        source: {
          reference: "Chapter XIX - Variations and Changes in the Recapitulation",
          focus:
            "Principal-theme recurrences may vary their setting while preserving melodic outline and thematic structure strongly enough for recognition.",
          exampleIds: ["s17.return-variation"],
        },
        terms: [
          {
            term: "Varied return",
            definition:
              "A recurrence whose surface has changed while the principal theme's identity and formal function remain clear.",
          },
          {
            term: "Thematic outline",
            definition:
              "The characteristic shape and structural proportions that let a theme remain recognisable beneath changes of setting.",
          },
          {
            term: "Recurrence",
            definition:
              "The reappearance of previously established material in a later formal position.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Vary without losing the refrain",
        successLabel: "The return is recognisable and no longer mechanically identical",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b, aPrime, c] = formSettings.layers;
        return [
          {
            label: "You studied how rondo returns can vary",
            complete: analysed(experiments, "s17.return-variation", 4),
          },
          { label: "You revised the return", complete: formEdits(experiments) >= 5 },
          { label: "You compared the returning refrain by ear", complete: heardPlayback(experiments) },
          {
            label: "The form marks a varied principal return",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "A′" &&
              formSettings.sections[3] === "C",
          },
          {
            label: "A′ preserves identity but changes its surface",
            complete:
              sharedCount(a, aPrime) >= 2 &&
              differenceCount(a, aPrime) >= 1,
          },
          {
            label: "The episode and later contrast remain distinct",
            complete:
              differenceCount(a, b) >= 1 &&
              differenceCount(aPrime, c) >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.rondo.c",
        letter: "C",
        title: "Adapt returning subordinate material",
        learn:
          "When subordinate material returns in a changed tonal role, preserve the features that carry identity and alter only what the new context requires.",
        explanation:
          "Large rondos do not only repeat the principal theme. Subordinate groups can return as well, and their recapitulation may require adaptation. In a tonal design the returning subordinate material often has to function in the tonic region rather than repeat its first harmonic setting unchanged. That can force changes of pitch level, voice-leading, sequence or continuation even when the thematic outline is meant to remain familiar.

The compositional problem is the same one encountered throughout developing variation: decide which features are structural and which are expendable. If every detail is preserved despite a new harmonic role, the material may sound forced. If too many characteristic details are changed, the listener no longer hears a return. This exercise isolates that judgment in a melody: one four-step block acts as the first subordinate formulation and a later block as its adapted recurrence.",
        instruction:
          "Study the subordinate-return analysis. In the Motif workspace, make steps 1-4 a clear source block containing at least three sounding notes. Use steps 9-12 as its returning version. Keep at least two pitches from the source block, but do not make the two blocks identical. Change at least five melody cells during the exercise and listen to the complete sixteen-step line after each major revision. Treat steps 5-8 as connective space if useful. Your goal is a return that is audibly the same thematic family while clearly adjusted rather than copied.",
        recognition:
          "Does the later block sound like the return of material you already know, with changes that feel necessary rather than decorative?",
        source: {
          reference: "Chapter XIX - Changes and Adaptations in the Recapitulation",
          focus:
            "Returning subordinate material is adapted to its new tonal and formal role while preserving enough characteristic structure for recognition.",
          exampleIds: ["s17.subordinate-return"],
        },
        terms: [
          {
            term: "Adaptation",
            definition:
              "A change made so familiar thematic material can fulfil a new harmonic or formal requirement without losing identity.",
          },
          {
            term: "Subordinate return",
            definition:
              "The later recurrence of secondary thematic material, commonly adjusted to a different tonal role.",
          },
          {
            term: "Structural identity",
            definition:
              "The combination of features that must survive change for a returning idea to remain recognisable.",
          },
        ],
        workspace: "motif",
        checksLabel: "Adapt the returning material",
        successLabel: "The subordinate idea returns related but not copied",
      }),
      evaluate: ({ melody, experiments }) => {
        const source = melody.slice(0, 4);
        const returning = melody.slice(8, 12);
        return [
          {
            label: "You studied subordinate-return adaptation",
            complete: analysed(experiments, "s17.subordinate-return", 4),
          },
          {
            label: "You revised the returning block",
            complete: melodyEdits(experiments) >= 5,
          },
          { label: "You compared the blocks by ear", complete: heardPlayback(experiments) },
          {
            label: "The source block is substantial",
            complete: sounding(source).length >= 3,
          },
          {
            label: "The return preserves identity without exact copying",
            complete:
              sharedPitches(source, returning) >= 2 &&
              !sameBlock(source, returning),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.rondo.d",
        letter: "D",
        title: "Turn rondo recurrence into sonata-rondo",
        learn:
          "A sonata-rondo keeps the recurring principal section but gives the central contrast a developmental role, so recurrence and elaboration operate in the same movement.",
        explanation:
          "The larger rondo forms can expand beyond simple alternation. In a sonata-rondo, the familiar pattern of refrain and subordinate contrast remains audible, but the central C section can become a modulatory elaboration of material already heard. That changes the function of the middle. Instead of merely supplying another self-contained episode, it works on thematic elements, moves through less stable harmony and creates a stronger need for the final recapitulation.

This hybrid is useful because it exposes the difference between contrast and elaboration. B can be a relatively stable subordinate region with a clear identity of its own. C should feel more mobile and developmental while still deriving from the movement's material. Our four-block workspace cannot display the complete seven-part sonata-rondo, so this exercise models the crucial first half: A-B-A-C. The last block is not the end of the form; it is the developmental middle that would make a later A-B-A return necessary.",
        instruction:
          "Study the sonata-rondo analysis. Set the four macro blocks to A → B → A → C. Give A at least two active layers and make the third block recover at least two of them. Make B contrast with A while sharing at least one layer. Build C so it still shares at least one active layer with A but differs from A in at least two layer choices and differs from B as well. Make at least six form edits and play A-B-A-C as one continuous span. Listen for C as a destabilising elaboration after the second refrain, not as merely another B-like episode.",
        recognition:
          "Does C feel derived from the same movement yet more developmental and unstable than B, making another return of A seem necessary?",
        source: {
          reference: "Chapter XIX - The Sonata-Rondo",
          focus:
            "Sonata-rondo combines recurrent rondo material with a central modulatory elaboration that functions like a development.",
          exampleIds: ["s17.sonata-rondo"],
        },
        terms: [
          {
            term: "Sonata-rondo",
            definition:
              "A rondo design in which recurrence is combined with a developmental central section and a later recapitulation.",
          },
          {
            term: "Elaboration",
            definition:
              "Developmental working-out that places familiar thematic elements into changing, often modulatory contexts.",
          },
          {
            term: "Central C section",
            definition:
              "The large contrasting middle of an expanded rondo, which in sonata-rondo can take on developmental function.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Make the middle developmental",
        successLabel: "The model now combines recurrence with a derived central contrast",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, b, returnA, c] = formSettings.layers;
        return [
          {
            label: "You studied the sonata-rondo distinction",
            complete: analysed(experiments, "s17.sonata-rondo", 4),
          },
          { label: "You shaped the larger relation", complete: formEdits(experiments) >= 6 },
          { label: "You listened across A-B-A-C", complete: heardPlayback(experiments) },
          {
            label: "The macro plan reads A → B → A → C",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "A" &&
              formSettings.sections[3] === "C",
          },
          {
            label: "The refrain remains stable across recurrence",
            complete: sharedCount(a, returnA) >= 2,
          },
          {
            label: "B functions as connected contrast",
            complete:
              differenceCount(a, b) >= 1 &&
              sharedCount(a, b) >= 1,
          },
          {
            label: "C is derived but more strongly differentiated",
            complete:
              sharedCount(a, c) >= 1 &&
              differenceCount(a, c) >= 2 &&
              differenceCount(b, c) >= 1,
          },
        ];
      },
    },
  ],
};
