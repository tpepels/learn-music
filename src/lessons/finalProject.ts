import {
  activeLayerCount,
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

const lesson = lessonContentSchema.parse({
  id: "production.final-project",
  number: 10,
  title: "Finish the track",
  eyebrow: "Create · Final project",
  hero: "Turn the exercises into one piece you can keep.",
  description:
    "Review the composition, arrangement, mix, movement, and effects as one system. The last step is not another technique: it is deciding that the track communicates what you intended and saving the project.",
  overview:
    "Finishing is a production skill. A finished piece does not require every possible technique; it requires deliberate choices that work together. This lesson uses the complete Studio rather than introducing another isolated tool.",
});

export const finalProjectLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.a",
        letter: "A",
        title: "Audit the composition",
        learn: "Confirm that the track has enough musical material to communicate an idea before polishing it further.",
        explanation:
          "Production cannot rescue a composition that has no clear material. Before final mixing, producers often return to the musical essentials: groove, melody, harmony, and repetition. The question is not 'is it complex enough?' but 'does the listener have something to follow?'",
        instruction:
          "Open the final-project checklist. Make sure Pattern A contains at least 8 drum events, the melody contains at least 6 notes, and all four chord slots are filled. Return to Studio modules if anything is missing.",
        recognition:
          "You should be able to identify the groove, hum or trace the melody, and hear a complete harmonic loop without relying on effects.",
        terms: [
          { term: "Production audit", definition: "A deliberate review of a project before finalizing it, checking whether musical and technical goals are actually met." },
          { term: "Core material", definition: "The musical ideas that remain meaningful even without detailed production." },
        ],
        workspace: "final-project",
        checksLabel: "Composition audit",
        successLabel: "The track has a complete musical foundation",
      }),
      evaluate: ({ A, melody, chordProgression }) => [
        { label: "Groove has at least 8 active drum events", complete: patternEvents(A) >= 8 },
        { label: "Melody contains at least 6 notes", complete: melody.filter((note) => note !== null).length >= 6 },
        { label: "All four chord slots are filled", complete: chordProgression.filter(Boolean).length === 4 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.b",
        letter: "B",
        title: "Audit the arrangement",
        learn: "Check that the track changes over time and reaches a recognizable high point before releasing.",
        explanation:
          "A finished arrangement needs a reason to keep listening. That does not mean constant novelty; it means meaningful changes in density, register, texture, or energy. A peak matters more when something before it is smaller and something after it releases.",
        instruction:
          "Use the final checklist and Arrangement module. Activate at least six of the eight bars, make bar 7 contain at least three layers, and make bar 8 less dense than bar 7.",
        recognition:
          "The last two bars should make the form obvious by ear: bar 7 feels fuller, while bar 8 opens space or resolves the accumulated energy.",
        terms: [
          { term: "Energy arc", definition: "The rise and fall of perceived intensity across a section or whole track." },
          { term: "Peak", definition: "A local high point of musical intensity." },
          { term: "Release", definition: "A reduction of tension, density, or intensity after a build or peak." },
        ],
        workspace: "final-project",
        checksLabel: "Arrangement audit",
        successLabel: "The track now has a clear large-scale energy shape",
      }),
      evaluate: ({ arrangement }) => [
        {
          label: "At least six bars contain musical material",
          complete: arrangement.filter((bar) => activeLayerCount(bar) > 0).length >= 6,
        },
        { label: "Bar 7 is a clear peak with at least three layers", complete: activeLayerCount(arrangement[6]) >= 3 },
        { label: "Bar 8 releases energy after bar 7", complete: activeLayerCount(arrangement[7]) < activeLayerCount(arrangement[6]) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.c",
        letter: "C",
        title: "Audit the production",
        learn: "Confirm that mix, automation, dynamics, and effects support the arrangement instead of fighting it.",
        explanation:
          "Final production is less about adding more processing and more about checking relationships. Is the foreground actually forward? Does movement lead somewhere? Are effects adding depth rather than blur? Does compression preserve the character you want?",
        instruction:
          "Use the final checklist. Keep chords below drums in level, use some reverb on chords or melody, maintain at least 6 dB of melody-volume automation and 4000 Hz of filter movement, use at least 2.5:1 compression with a 15 ms or slower attack, and keep one creative effect clearly active.",
        recognition:
          "The track should sound intentional rather than maximally processed: foreground and background are readable, transitions move, and drums retain a clear attack.",
        terms: [
          { term: "Final pass", definition: "A last review focused on relationships, consistency, and whether each production choice still serves the music." },
          { term: "Over-processing", definition: "Using so much processing that clarity, dynamics, or musical identity are reduced rather than improved." },
        ],
        workspace: "final-project",
        checksLabel: "Production audit",
        successLabel: "The production decisions support the same musical idea",
      }),
      evaluate: ({ mixerSettings, automationSettings, dynamicsSettings, effectsSettings }) => [
        { label: "Chords sit below drums in the balance", complete: mixerSettings.chords.volume < mixerSettings.drums.volume },
        { label: "At least one foreground/harmony reverb send is active", complete: mixerSettings.chords.reverb > 0 || mixerSettings.melody.reverb > 0 },
        {
          label: "Melody automation moves by at least 6 dB",
          complete:
            Math.max(...automationSettings.melodyVolumeDb) -
              Math.min(...automationSettings.melodyVolumeDb) >=
            6,
        },
        {
          label: "Filter automation moves by at least 4000 Hz",
          complete:
            Math.max(...automationSettings.chordFilterHz) -
              Math.min(...automationSettings.chordFilterHz) >=
            4000,
        },
        {
          label: "Compression is intentional and leaves transient room",
          complete: dynamicsSettings.ratio >= 2.5 && dynamicsSettings.attack >= 0.015,
        },
        {
          label: "At least one creative effect is clearly active",
          complete:
            effectsSettings.chorusWet >= 0.12 ||
            effectsSettings.delayFeedback >= 0.3 ||
            effectsSettings.reverbDecay >= 3.2,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.final-project.d",
        letter: "D",
        title: "Save the project",
        learn: "Treat saving and versioning as part of finishing rather than an afterthought.",
        explanation:
          "A project file preserves the decisions that created the track: notes, arrangement, sound settings, mixer state, automation, dynamics, and effects. Professional workflows separate the editable project from the final audio bounce so the production can be reopened later.",
        instruction:
          "Use Export project in the centre workspace. Save the .json file somewhere you can find it. This first export is your editable project snapshot; audio bouncing will be added as a later rendering layer rather than faked here.",
        recognition:
          "The download should produce a PLAY / LAB project JSON file. The app marks the export milestone after the browser begins the download.",
        terms: [
          { term: "Project file", definition: "The editable session data describing how a piece is constructed." },
          { term: "Versioning", definition: "Saving identifiable project states so changes can be revisited or compared." },
          { term: "Bounce / render", definition: "Creating a standalone audio file from a project. This differs from saving the editable project itself." },
        ],
        workspace: "final-project",
        checksLabel: "Finish",
        successLabel: "Your first complete PLAY / LAB project is saved",
      }),
      evaluate: ({ projectMilestones }) => [
        { label: "Project file has been exported", complete: projectMilestones.exported },
      ],
    },
  ],
};
