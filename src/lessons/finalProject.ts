import {
  activeLayerCount,
  arrangementLayers,
  trackNames,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function patternEvents(pattern: Record<(typeof trackNames)[number], boolean[]>) {
  return trackNames.reduce(
    (total, track) => total + pattern[track].filter(Boolean).length,
    0,
  );
}

function harmonyEvents(sequence: number[][]) {
  return sequence.reduce((total, notes) => total + notes.length, 0);
}

function hasArrangementShape(
  arrangement: Array<Record<(typeof arrangementLayers)[number], boolean>>,
) {
  const densities = arrangement.map(activeLayerCount);
  const peak = Math.max(...densities);
  const peakIndex = densities.findIndex((density) => density === peak);
  const signatures = new Set(
    arrangement
      .filter((bar) => activeLayerCount(bar) > 0)
      .map((bar) =>
        arrangementLayers.map((layer) => (bar[layer] ? "1" : "0")).join(""),
      ),
  );
  const releaseAfterPeak = densities
    .slice(peakIndex + 1)
    .some((density) => density > 0 && density < peak);

  return {
    activeBars: densities.filter((density) => density > 0).length,
    hasSparse: densities.some((density) => density >= 1 && density <= 2),
    hasFuller: peak >= 3,
    signatures: signatures.size,
    releaseAfterPeak,
  };
}

const lesson = lessonContentSchema.parse({
  id: "production.final-project",
  number: 10,
  title: "Finish the track",
  eyebrow: "Create · Final project",
  hero: "Stop demonstrating techniques. Finish a piece.",
  description:
    "Listen to the track as a whole, fix what distracts from it, and keep only the production moves that earn their place. Then save the version you would actually return to.",
  overview:
    "Finishing means judging the piece, not completing a checklist of effects. The groove, melody, harmony and arrangement need to hold together; the mix needs a readable hierarchy; processing is useful only where it improves the music you made.",
});

export const finalProjectLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.a",
        letter: "A",
        title: "Listen to the song before the production",
        learn: "Check whether the musical material still works when you stop thinking about processors.",
        explanation:
          "A track needs something the ear can follow: a groove with identity, a melody or motif, and harmony that moves somewhere. More notes are not automatically better, but an unfinished sketch should not be disguised by effects.",
        instruction:
          "Play the track once from the musical material outward. Ignore the effect names and ask: can you follow the groove, remember part of the melody, and hear the four-bar harmony as one phrase? If one of those disappears, return to that Studio module before continuing.",
        recognition:
          "After playback, try to recall the groove and one melodic gesture without looking at the grid. If nothing sticks, the next useful edit is probably musical, not technical.",
        terms: [
          { term: "Production audit", definition: "A deliberate review of a project before finalizing it, checking whether musical and technical goals are actually met." },
          { term: "Core material", definition: "The musical ideas that remain meaningful even without detailed production." },
        ],
        workspace: "final-project",
        checksLabel: "Composition audit",
        successLabel: "The track has a complete musical foundation",
      }),
      evaluate: ({ A, melody, chordProgression, harmonySequence, experiments }) => [
        { label: "You listened to the track as a composition", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "Groove has at least 8 active drum events", complete: patternEvents(A) >= 8 },
        { label: "Melody contains at least 6 notes", complete: melody.filter((note) => note !== null).length >= 6 },
        { label: "All four chord slots are filled", complete: chordProgression.filter(Boolean).length === 4 },
        { label: "Harmony contains at least 12 notes you wrote", complete: harmonyEvents(harmonySequence) >= 12 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.b",
        letter: "B",
        title: "Listen for a reason to keep going",
        learn: "Check whether the eight bars have contrast, a fuller moment, and somewhere to breathe.",
        explanation:
          "An arrangement can repeat without feeling static if the listener keeps getting changes in focus. A peak only matters because another moment is smaller; a release only works because something had built up before it.",
        instruction:
          "Play all eight bars without staring at the layer grid. Then open Arrangement and fix any stretch that feels flat. Keep at least six active bars, use several different layer combinations, include a sparse moment and a fuller moment, and let some density fall away after the peak wherever you chose to put it.",
        recognition:
          "Can you hear where the arrangement changes focus, where it reaches its largest point, and where space returns without knowing the bar numbers?",
        terms: [
          { term: "Energy arc", definition: "The rise and fall of perceived intensity across a section or whole track." },
          { term: "Peak", definition: "A local high point of musical intensity." },
          { term: "Release", definition: "A reduction of tension, density, or intensity after a build or peak." },
        ],
        workspace: "final-project",
        checksLabel: "Arrangement audit",
        successLabel: "The track now has a clear large-scale energy shape",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const shape = hasArrangementShape(arrangement);
        return [
          { label: "You listened through the arrangement", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
          { label: "At least six bars contain musical material", complete: shape.activeBars >= 6 },
          { label: "The arrangement uses at least three different layer combinations", complete: shape.signatures >= 3 },
          { label: "There is both a sparse moment and a fuller moment", complete: shape.hasSparse && shape.hasFuller },
          { label: "Some density releases after the peak", complete: shape.releaseAfterPeak },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.c",
        letter: "C",
        title: "Remove the processing you cannot justify",
        learn: "Make the mix readable, then keep only the movement and effects that help this particular track.",
        explanation:
          "The final pass is not a chance to prove that you know every processor. If an effect blurs the rhythm, remove it. If compression makes the drums smaller, back it off. If the track already moves without automation, you do not need to draw a curve for the sake of it.",
        instruction:
          "Play the full track and make the level balance readable first. Then choose which of the production ideas from the previous lessons actually help: automation, compression, or creative effects. Keep at least one deliberate production move, but do not add a second one unless you can hear why it belongs.",
        recognition:
          "Bypass or reduce anything you are unsure about. Does the track become worse when the processing disappears? If not, the simpler version is probably stronger.",
        terms: [
          { term: "Final pass", definition: "A last review focused on relationships, consistency, and whether each production choice still serves the music." },
          { term: "Over-processing", definition: "Using so much processing that clarity, dynamics, or musical identity are reduced rather than improved." },
        ],
        workspace: "final-project",
        checksLabel: "Production audit",
        successLabel: "The production decisions support the same musical idea",
      }),
      evaluate: ({ mixerSettings, automationSettings, dynamicsSettings, effectsSettings, experiments }) => {
        const volumes = Object.values(mixerSettings).map((settings) => settings.volume);
        const hasMixHierarchy = Math.max(...volumes) - Math.min(...volumes) >= 3;
        const hasAutomation =
          Math.max(...automationSettings.melodyVolumeDb) -
            Math.min(...automationSettings.melodyVolumeDb) >=
            4 ||
          Math.max(...automationSettings.chordFilterHz) -
            Math.min(...automationSettings.chordFilterHz) >=
            3000;
        const hasCompression = dynamicsSettings.ratio >= 2;
        const hasCreativeEffect =
          mixerSettings.chords.reverb >= 0.08 ||
          mixerSettings.melody.reverb >= 0.08 ||
          mixerSettings.melody.delay >= 0.05 ||
          effectsSettings.chorusWet >= 0.12 ||
          effectsSettings.delayFeedback >= 0.25 ||
          effectsSettings.reverbDecay >= 3;
        const chosenProductionMoves = [hasAutomation, hasCompression, hasCreativeEffect].filter(Boolean).length;

        return [
          { label: "You listened to the production in context", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
          { label: "The mixer has a clear level hierarchy", complete: hasMixHierarchy },
          { label: "At least one production move is deliberately active", complete: chosenProductionMoves >= 1 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.d",
        letter: "D",
        title: "Play it once, then save this version",
        learn: "Make the export represent a version you actually listened to from beginning to end.",
        explanation:
          "Saving matters because a finished decision is worth preserving. The project file keeps the notes, arrangement and production state editable, so this version can become a reference point for whatever you change next.",
        instruction:
          "Play the track one last time without touching a control. If nothing pulls you out of the music, export the project from this screen. If something does, fix that first and restart the final listen.",
        recognition:
          "During the last pass, listen for distractions rather than features: one part too loud, a transition that jars, an effect tail that gets in the way. When nothing demands attention, save it.",
        terms: [
          { term: "Project file", definition: "The editable session data describing how a piece is constructed." },
          { term: "Versioning", definition: "Saving identifiable project states so changes can be revisited or compared." },
          { term: "Bounce / render", definition: "Creating a standalone audio file from a project. This differs from saving the editable project itself." },
        ],
        workspace: "final-project",
        checksLabel: "Finish",
        successLabel: "Your first complete PLAY / LAB project is saved",
      }),
      evaluate: ({ projectMilestones, experiments }) => [
        { label: "You played the track before exporting", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "You exported this final exercise", complete: (experiments["project.export"]?.changes ?? 0) >= 1 && projectMilestones.exported },
      ],
    },
  ],
};
