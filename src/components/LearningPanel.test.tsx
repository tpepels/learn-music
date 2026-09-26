import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("./ConceptVisual", () => ({
  ConceptVisual: () => <div data-testid="concept-visual" />,
}));

vi.mock("./SchoenbergSourceMaterial", () => ({
  SchoenbergSourceMaterial: ({ id }: { id: string }) => (
    <div data-source-id={id}>example</div>
  ),
  BookSourceMaterialView: () => <div />,
}));

vi.mock("./BelkinSourceMaterial", () => ({
  BelkinSourceMaterial: ({ id }: { id: string }) => (
    <div data-belkin-source-id={id}>belkin example</div>
  ),
}));

vi.mock("./LevineSourceMaterial", () => ({
  LevineSourceMaterial: ({ id }: { id: string }) => (
    <div data-levine-source-id={id}>jazz example</div>
  ),
}));

vi.mock("../learning/productionContext", () => ({
  getProductionContext: () => ({
    why: "why",
    when: "when",
    visual: "placeholder",
    realWorld: "real world",
    tools: [],
  }),
}));

vi.mock("../learning/dawTransfer", () => ({
  dawStages: [],
  getDawCheckpoint: () => undefined,
  getDawStageFamiliarity: () => "current",
  getDawTransfer: () => ({
    concept: "concept",
    changes: "changes",
    pitfall: "pitfall",
    dawLocation: "daw location",
    whyItMatters: "why it matters",
    vocabulary: [],
    stage: "current",
  }),
  getPlayLabRepresentation: () => "representation",
}));

import { LearningPanel } from "./LearningPanel";
import type { ExerciseDefinition } from "../lessons/types";

function exercise(id: string): ExerciseDefinition {
  return {
    id,
    letter: "A",
    title: "Test exercise",
    learn: "The musical idea",
    explanation: "A direct explanation with enough detail to understand the concept.",
    instruction: "Change the phrase and listen to the result.",
    recognition: "Hear whether the relationship remains clear.",
    source: {
      reference: "Chapter and example reference",
      focus: "Meta commentary that should not appear in the simple Schoenberg guide.",
      exampleIds: ["s01.example"],
    },
    terms: [
      {
        term: "Phrase",
        definition: "A small musical unit with a degree of completeness.",
      },
    ],
    workspace: "composition-study",
    checksLabel: "Check",
    successLabel: "Done",
    evaluate: () => [],
  };
}

describe("LearningPanel", () => {
  it("renders Schoenberg exercises as one simple reading flow", () => {
    const html = renderToStaticMarkup(
      <LearningPanel
        exercise={exercise("schoenberg.phrase-motive.a")}
        lessonNumber={1}
      />,
    );

    expect(html).toContain("The musical idea");
    expect(html).toContain("A direct explanation");
    expect(html).toContain("data-source-id=\"s01.example\"");
    expect(html).toContain("Concept");
    expect(html).toContain("Examples");
    expect(html).toContain("Exercise");
    expect(html).toContain("<strong>Listen for</strong>");
    expect(html).toContain("<strong>Phrase</strong>");

    const conceptIndex = html.indexOf("Concept");
    const exerciseIndex = html.indexOf("Exercise");
    const examplesIndex = html.indexOf("Examples");
    const sourceIndex = html.indexOf("data-source-id=\"s01.example\"");
    expect(conceptIndex).toBeGreaterThanOrEqual(0);
    expect(exerciseIndex).toBeGreaterThan(conceptIndex);
    expect(examplesIndex).toBeGreaterThan(exerciseIndex);
    expect(sourceIndex).toBeGreaterThan(examplesIndex);

    expect(html).not.toContain("<strong>Do:</strong>");
    expect(html).not.toContain("From the book");
    expect(html).not.toContain("Chapter and example reference");
    expect(html).not.toContain("Meta commentary");
    expect(html).not.toContain("Why / theory / vocabulary");
    expect(html).not.toContain("PLAY / LAB → DAW");
  });

  it("uses the same direct source-based reading flow for Belkin exercises", () => {
    const item = exercise("belkin.punctuating.a");
    item.source = {
      reference: "Belkin, Chapter 5",
      focus: "Internal provenance that should stay hidden.",
      exampleIds: ["b01.punctuation-dimensions"],
    };

    const html = renderToStaticMarkup(
      <LearningPanel exercise={item} lessonNumber={1} />,
    );

    expect(html).toContain("Concept");
    expect(html).toContain("Exercise");
    expect(html).toContain("Examples");
    expect(html).toContain('data-belkin-source-id="b01.punctuation-dimensions"');
    expect(html).not.toContain("From the book");
    expect(html).not.toContain("Belkin, Chapter 5");
    expect(html).not.toContain("Internal provenance");
    expect(html).not.toContain("Why / theory / vocabulary");
  });

  it("uses the same direct source-based reading flow for Levine exercises", () => {
    const item = exercise("levine.intervals-triads.a");
    item.source = {
      reference: "Jazz Piano, Chapter One",
      focus: "Internal provenance that should stay hidden.",
      exampleIds: ["l01.fig1-1"],
    };

    const html = renderToStaticMarkup(
      <LearningPanel exercise={item} lessonNumber={1} />,
    );

    expect(html).toContain("Concept");
    expect(html).toContain("Exercise");
    expect(html).toContain("Examples");
    expect(html).toContain('data-levine-source-id="l01.fig1-1"');
    expect(html).not.toContain("From the book");
    expect(html).not.toContain("Jazz Piano, Chapter One");
    expect(html).not.toContain("Internal provenance");
    expect(html).not.toContain("Why / theory / vocabulary");
  });

  it("keeps the existing layered guide for non-Schoenberg exercises", () => {
    const html = renderToStaticMarkup(
      <LearningPanel exercise={exercise("music.test.a")} lessonNumber={1} />,
    );

    expect(html).toContain("From the book");
    expect(html).toContain("Why / theory / vocabulary");
    expect(html).toContain("PLAY / LAB → DAW");
  });
});
