import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.character-mood",
  number: 8,
  title: "Character & mood",
  eyebrow: "Schoenberg · Character & Mood",
  hero:
    "Make rhythm, articulation, accompaniment and texture point toward one definite character instead of expecting tempo alone to create expression.",
  description:
    "Character is the result of coordinated musical behaviour. Similar tempos can support very different moods, while rhythm, dynamics, accompaniment, register and texture can make a passage feel calm, agitated, solemn, playful or flowing.",
  overview:
    "Hear character as an organised set of musical choices. Shape rhythmic manner first, then use texture and supporting motion to strengthen the same expressive direction.",
});

function velocityRange(values: number[]): number {
  return values.length ? Math.max(...values) - Math.min(...values) : 0;
}

function arrangementSignature(
  bar: Record<"drums" | "bass" | "chords" | "melody", boolean>,
): string {
  return ["drums", "bass", "chords", "melody"]
    .map((layer) => (bar[layer as keyof typeof bar] ? "1" : "0"))
    .join("");
}

export const schoenbergCharacterMoodLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.character-mood.a",
        letter: "A",
        title: "Let rhythm establish character",
        learn:
          "Hear how swing, accent and dynamic profile can change the manner of a passage even when its notes and tempo remain the same.",
        explanation:
          "Character is not a label attached after the music is written. Rhythmic behaviour immediately suggests a manner of movement: even pulses can feel firm or solemn, displaced accents can feel unstable or playful, and unequal subdivisions can create a more flexible physical motion. Dynamic emphasis strengthens these differences by telling the ear which events carry weight.\n\nTempo participates in character but does not determine it. Two passages at the same speed can feel completely different if their accents, articulation and internal rhythm differ. That makes rhythmic treatment a useful first experiment: hold tempo constant and change the manner in which the pulse is inhabited.",
        instruction:
          "Keep the global tempo where it is. In Groove & Feel, change Swing and reshape at least four velocity points on the hats or snare. Compare a straighter, more even version with a version that has a stronger lilt or accent profile.\n\nPlay the loop after each change without looking at the controls. Describe the character to yourself before checking the settings. Keep the version only if you can hear the change in manner without relying on a faster or slower tempo.",
        recognition:
          "With tempo unchanged, can you hear the passage acquire a different physical manner purely from timing and accent?",
        source: {
          reference: "Chapter X - character and mood",
          focus:
            "Character arises from coordinated rhythm, accompaniment, articulation, register and other musical features; tempo alone does not define it.",
          exampleIds: ["s08.character"],
        },
        terms: [
          {
            term: "Character",
            definition:
              "The recognisable manner or expressive quality created by the combined behaviour of musical elements.",
          },
          {
            term: "Accent profile",
            definition:
              "The pattern of stronger and weaker events that shapes how a rhythm is perceived and performed.",
          },
        ],
        workspace: "groove-feel",
        checksLabel: "Change the manner",
        successLabel: "The rhythm now communicates a character without a tempo change",
      }),
      evaluate: ({ grooveFeelSettings, experiments }) => [
        {
          label: "You changed swing rather than relying on tempo",
          complete: changedControl(experiments, "groove.swing"),
        },
        {
          label: "You reshaped several velocity points",
          complete:
            changedControl(experiments, "groove.hat.velocity", 4) ||
            changedControl(experiments, "groove.snare.velocity", 4),
        },
        {
          label: "You listened to the changed character",
          complete: heardPlayback(experiments),
        },
        {
          label: "The final groove has a non-flat dynamic profile",
          complete:
            velocityRange(grooveFeelSettings.velocities.hat) >= 0.15 ||
            velocityRange(grooveFeelSettings.velocities.snare) >= 0.15,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.character-mood.b",
        letter: "B",
        title: "Separate speed from mood",
        learn:
          "Use two contrasting accent treatments to prove that one tempo can support more than one character.",
        explanation:
          "Tempo markings are often associated with expressive conventions, but speed by itself cannot account for character. A moderately paced passage can be ceremonial, relaxed, uneasy or playful depending on rhythm, articulation, register and dynamic emphasis. Treating tempo as the whole explanation produces generic results because it leaves the internal behaviour of the music unspecified.\n\nA stronger approach is to imagine a definite character and ask what that character does to each musical decision. Where does it place weight? Does it flow continuously or leave gaps? Does it move with regularity or interruption? Once those choices agree, tempo becomes one contributor among several rather than a substitute for expression.",
        instruction:
          "Make two clearly contrasting groove treatments without moving the tempo slider. First create a fairly straight, even version. Then introduce a noticeably different swing or accent pattern and listen again. Move Swing through a meaningful range and change several velocities so the comparison is audible.\n\nReturn to the version whose character you can describe most precisely. Do not use vague labels such as 'better' or 'more musical'; use a behavioural description such as firm, floating, lopsided, restrained or insistent and identify the rhythmic evidence for it.",
        recognition:
          "Can you describe why the two versions feel different without mentioning BPM?",
        source: {
          reference: "Chapter X - tempo and character",
          focus:
            "Similar speeds can support different characters; the internal rhythmic and accompanimental treatment supplies much of the expressive identity.",
          exampleIds: ["s08.character"],
        },
        terms: [
          {
            term: "Mood",
            definition:
              "The emotional or atmospheric impression created by the combined musical context.",
          },
          {
            term: "Manner of performance",
            definition:
              "The way musical material is articulated, weighted and moved through time, independent of its basic pitches.",
          },
        ],
        workspace: "groove-feel",
        checksLabel: "Prove tempo is not enough",
        successLabel: "You can hear contrasting characters at the same tempo",
      }),
      evaluate: ({ experiments }) => {
        const swing = experiments["groove.swing"];
        const exploredSwing =
          swing?.min !== null &&
          swing?.min !== undefined &&
          swing?.max !== null &&
          swing?.max !== undefined &&
          swing.max - swing.min >= 0.15;
        return [
          {
            label: "You explored a meaningful swing range",
            complete: exploredSwing,
          },
          {
            label: "You changed the accent profile as part of the comparison",
            complete:
              changedControl(experiments, "groove.hat.velocity", 3) ||
              changedControl(experiments, "groove.snare.velocity", 3),
          },
          {
            label: "You listened to the character comparison",
            complete: heardPlayback(experiments),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.character-mood.c",
        letter: "C",
        title: "Let texture reinforce the character",
        learn:
          "Use entries, omissions and density so the accompaniment supports the same expressive idea as the rhythm.",
        explanation:
          "Accompaniment contributes strongly to character because texture changes how a principal idea is framed. A sparse support can make the same melody feel exposed, intimate or suspended; a regular full texture can make it feel grounded or ceremonial; intermittent entries can create alertness or instability. The expressive effect comes from the relationship between layers, not from the accompaniment in isolation.\n\nDescriptive music makes this especially obvious: continuous flowing motion can suggest water, flickering activity can suggest fire, and repeated physical gestures can suggest turning or creaking. These associations work because the texture is musically coherent first. The supporting motion must still fit harmony, phrase and form.",
        instruction:
          "In the Arrangement workspace, create at least three different layer combinations across the eight bars. Include one sparse bar and one clearly fuller bar, but keep at least one recurring layer so the character belongs to one piece rather than a montage.\n\nPlay the full arrangement and listen to how entries and omissions change the mood of the same underlying material. Revise at least four layer choices. Choose a definite character and remove any layer change that contradicts it without adding useful contrast.",
        recognition:
          "Do the changes in density and support strengthen one expressive world, or do they merely make the arrangement busier?",
        source: {
          reference: "Chapter X - accompaniment and descriptive character",
          focus:
            "Accompanimental motion and texture contribute directly to character; descriptive effects remain convincing only when they also function musically.",
          exampleIds: ["s08.character", "s08.descriptive-motion"],
        },
        terms: [
          {
            term: "Descriptive motion",
            definition:
              "A recurring musical movement whose behaviour suggests an external motion or image while remaining structurally coherent.",
          },
          {
            term: "Texture",
            definition:
              "The number, density and relationship of simultaneous musical parts.",
          },
        ],
        workspace: "arrangement",
        checksLabel: "Shape expressive texture",
        successLabel: "The texture now reinforces a definite character",
      }),
      evaluate: ({ arrangement, experiments }) => {
        const signatures = new Set(arrangement.map(arrangementSignature));
        const densities = arrangement.map(
          (bar) => Object.values(bar).filter(Boolean).length,
        );
        return [
          {
            label: "You reshaped several layer choices here",
            complete: changedControl(experiments, "arrangement.edit", 4),
          },
          {
            label: "You listened to the complete character arc",
            complete: heardPlayback(experiments),
          },
          {
            label: "The arrangement uses at least three textures",
            complete: signatures.size >= 3,
          },
          {
            label: "The texture includes both sparse and fuller moments",
            complete:
              densities.some((density) => density >= 1 && density <= 2) &&
              densities.some((density) => density >= 3),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.character-mood.d",
        letter: "D",
        title: "Commit to one definite character",
        learn:
          "Coordinate timing and dynamics so several small choices communicate the same expressive intention.",
        explanation:
          "A character becomes convincing when the details agree often enough to create expectation. If the rhythm suggests weightlessness while the accents are aggressively square, the contradiction may be expressive, but it should be deliberate. Otherwise the passage simply lacks a clear manner. Imagining a specific character before editing is a practical way to coordinate decisions.\n\nThis does not mean eliminating all contrast. A coherent character can contain local surprise, just as a calm passage can include one sharp accent. The test is whether the exception is heard against a stable background of behaviour. Establish the norm first, then decide which deviations deserve attention.",
        instruction:
          "Choose one character in concrete behavioural terms - for example restrained and even, buoyant and lilted, or tense and accented. In Groove & Feel, make at least six fresh changes to swing or velocity so the rhythmic details support that description.\n\nPlay the loop repeatedly and remove changes that feel arbitrary. Finish with a dynamic profile that has audible hierarchy rather than every event at the same strength. You should be able to describe the character and point to the timing and accent choices that create it.",
        recognition:
          "If someone heard the loop without the screen, would your timing and accents give them consistent evidence for the character you intended?",
        source: {
          reference: "Chapter X - maintaining a definite character",
          focus:
            "Even small exercises benefit from a clearly imagined character; rhythm, accent and accompaniment should reinforce that intention.",
          exampleIds: ["s08.character", "s08.descriptive-motion"],
        },
        terms: [
          {
            term: "Expressive consistency",
            definition:
              "Enough agreement among rhythmic, dynamic, textural and harmonic choices that a stable character becomes perceptible.",
          },
          {
            term: "Local contrast",
            definition:
              "A temporary departure from an established behaviour whose effect depends on the surrounding norm.",
          },
        ],
        workspace: "groove-feel",
        checksLabel: "Make the character definite",
        successLabel: "Your rhythmic details now point toward one deliberate character",
      }),
      evaluate: ({ grooveFeelSettings, experiments }) => [
        {
          label: "You made a substantial character pass",
          complete:
            (experiments["groove.swing"]?.changes ?? 0) +
              (experiments["groove.hat.velocity"]?.changes ?? 0) +
              (experiments["groove.snare.velocity"]?.changes ?? 0) >=
            6,
        },
        {
          label: "You listened while refining the character",
          complete: heardPlayback(experiments),
        },
        {
          label: "The final dynamics contain an audible hierarchy",
          complete:
            velocityRange(grooveFeelSettings.velocities.hat) >= 0.15 ||
            velocityRange(grooveFeelSettings.velocities.snare) >= 0.15,
        },
      ],
    },
  ],
};
