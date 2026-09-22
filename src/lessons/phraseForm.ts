import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "composition.phrase-form",
  number: 17,
  title: "Phrase & form",
  eyebrow: "Composition · Structure",
  hero: "Design repetition and contrast above the level of individual bars.",
  description:
    "Map four 4-bar sections before filling every detail. Learn antecedent/consequent thinking, binary and ternary form, then AABA as a compact large-scale design.",
  overview:
    "Form is memory management for the listener. Repetition creates familiarity; contrast refreshes attention; return makes earlier material meaningful in retrospect. Section labels are analytical tools, not rules about genre.",
});

export const phraseFormLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.a",
        letter: "A",
        title: "Make statement and answer",
        learn: "Use A and A′ to create two related four-bar phrases rather than eight bars with no punctuation.",
        explanation:
          "An antecedent/consequent pair behaves like question and answer. The second phrase often resembles the first but changes its ending, harmony, or melodic contour so it feels more complete.",
        instruction:
          "Set section 1 to A and section 2 to A′. Leave the later sections however you like for now.",
        recognition:
          "A′ should imply 'same family, different ending' rather than a completely new section.",
        terms: [
          { term: "Phrase", definition: "A coherent musical span that feels like one statement or gesture." },
          { term: "Antecedent", definition: "The opening phrase of a question–answer pair, often ending less conclusively." },
          { term: "Consequent", definition: "The answering phrase, often related to the antecedent but ending more conclusively." },
          { term: "A′", definition: "A varied return of A: recognizably the same section with meaningful change." },
        ],
        workspace: "phrase-form",
        checksLabel: "Create a related pair",
        successLabel: "The first eight bars now have statement-and-answer logic",
      }),
      evaluate: ({ formSettings }) => [
        {
          label: "First section is A",
          complete: formSettings.sections[0] === "A",
        },
        {
          label: "Second section is A′",
          complete: formSettings.sections[1] === "A′",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.b",
        letter: "B",
        title: "Create binary form",
        learn: "Organize sixteen bars into two larger contrasting halves.",
        explanation:
          "Binary form divides material into A and B sections. Each half can contain internal repetition, but the large-scale experience is departure from one identity into another.",
        instruction:
          "Set the four sections to A → A → B → B. Think of the first eight bars as one world and the second eight as another.",
        recognition:
          "The form should read as two balanced halves rather than four unrelated blocks.",
        terms: [
          { term: "Binary form", definition: "A form organized primarily into two contrasting sections, commonly labelled A and B." },
          { term: "Section", definition: "A larger structural unit containing one or more phrases." },
        ],
        workspace: "phrase-form",
        checksLabel: "Build two halves",
        successLabel: "The macro map now shows a clear A/B binary design",
      }),
      evaluate: ({ formSettings }) => [
        {
          label: "Sections read A → A → B → B",
          complete:
            formSettings.sections.join("|") === "A|A|B|B",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.c",
        letter: "C",
        title: "Leave and return",
        learn: "Use ternary form so contrast gains meaning through a return to familiar material.",
        explanation:
          "Ternary form is fundamentally A–B–A: establish an identity, move somewhere contrasting, then return. The return changes how the contrast is remembered.",
        instruction:
          "Set sections 1–3 to A → B → A. Use A or A′ for section 4 as an extended return.",
        recognition:
          "The third block should feel like recognition after the contrast of B.",
        terms: [
          { term: "Ternary form", definition: "A three-part A–B–A design based on departure and return." },
          { term: "Return", definition: "The reappearance of earlier material after contrasting material." },
        ],
        workspace: "phrase-form",
        checksLabel: "Create departure and return",
        successLabel: "The large-scale form now depends on recognition after contrast",
      }),
      evaluate: ({ formSettings }) => [
        {
          label: "First three sections read A → B → A",
          complete:
            formSettings.sections[0] === "A" &&
            formSettings.sections[1] === "B" &&
            formSettings.sections[2] === "A",
        },
        {
          label: "Final section continues the A-family return",
          complete:
            formSettings.sections[3] === "A" ||
            formSettings.sections[3] === "A′",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "composition.phrase-form.d",
        letter: "D",
        title: "Build AABA",
        learn: "Use repeated identity, one contrasting bridge, and return as a compact song-form strategy.",
        explanation:
          "AABA establishes A twice, introduces a contrasting bridge (B), then returns to A. The bridge feels especially contrasting because A is already strongly established before it arrives.",
        instruction:
          "Set the four sections to A → A → B → A. Imagine each block as four bars: 16 bars total.",
        recognition:
          "B should feel like the one clear departure in a form dominated by A material.",
        terms: [
          { term: "AABA", definition: "A four-section form with three A sections surrounding one contrasting B section." },
          { term: "Bridge", definition: "A contrasting section that connects or separates repeated primary material." },
          { term: "Formal proportion", definition: "The relative amount of time given to repeated and contrasting sections." },
        ],
        workspace: "phrase-form",
        checksLabel: "Plan AABA",
        successLabel: "The sixteen-bar map now has a clear repeated identity and bridge",
      }),
      evaluate: ({ formSettings }) => [
        {
          label: "Sections read A → A → B → A",
          complete:
            formSettings.sections.join("|") === "A|A|B|A",
        },
      ],
    },
  ],
};
