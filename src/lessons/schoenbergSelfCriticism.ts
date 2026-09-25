import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "schoenberg.self-criticism",
  number: 10,
  title: "Self-criticism & revision",
  eyebrow: "Schoenberg · Revision",
  hero:
    "Revise by diagnosing concrete musical problems: listen, analyse, remove what is unnecessary, watch monotony, bass and harmony, then make more than one solution.",
  description:
    "Self-criticism is a compositional skill, not a final proofreading step. Separate the layers, identify what actually carries the idea, remove activity that hides rather than develops it, and make alternative sketches before choosing.",
  overview:
    "Use a repeatable revision loop across melody, bass and harmony. The aim is to know why a passage is weak and what kind of change addresses that weakness.",
});

function studiedSource(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimumSegments: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >=
    minimumSegments;
}

function soundingNotes(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function pitchRange(sequence: Array<number | null>): number {
  const notes = soundingNotes(sequence);
  return notes.length ? Math.max(...notes) - Math.min(...notes) : 0;
}

function longestRepeatedPitchRun(sequence: Array<number | null>): number {
  let longest = 0;
  let current = 0;
  let previous: number | null | undefined;
  for (const note of sequence) {
    if (note !== null && note === previous) {
      current += 1;
    } else if (note !== null) {
      current = 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
    previous = note;
  }
  return longest;
}

function activeHarmonyBars(sequence: number[][]): number {
  return Array.from({ length: 4 }, (_, bar) =>
    sequence
      .slice(bar * 8, bar * 8 + 8)
      .some((notes) => notes.length > 0),
  ).filter(Boolean).length;
}

function harmonyRhythmicVariety(sequence: number[][]): number {
  return new Set(
    Array.from({ length: 4 }, (_, bar) =>
      sequence
        .slice(bar * 8, bar * 8 + 8)
        .map((notes) => (notes.length ? "1" : "0"))
        .join(""),
    ),
  ).size;
}

export const schoenbergSelfCriticismLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.self-criticism.a",
        letter: "A",
        title: "Listen before you diagnose",
        learn:
          "Separate what you hear from what you intended to write, and inspect individual layers so one attractive part cannot hide another part's weakness.",
        explanation:
          "The ear is the first revision tool. A complete texture can make a weak melody seem convincing because the harmony supplies direction, or make a static harmony seem active because the melody is busy. Listening to parts separately exposes these dependencies. A melodic line should still reveal continuity, balance and phrase direction when the support is mentally removed.\n\nListening is followed by analysis, not replaced by it. Once a problem is audible, identify which characteristic motive-features matter, what is actually being developed, and where a segment contains motion without meaningful content. Revision becomes more precise when the diagnosis names the musical function that is missing.",
        instruction:
          "Read at least four steps of the revision loop, then play your current melody from beginning to end. Listen once without editing. On the second pass, focus only on contour and rhythmic continuity rather than the accompaniment.\n\nDo not change a note until you can name one concrete strength and one concrete weakness. Then switch to the Melody workspace and make at least one edit that addresses the weakness you actually heard, not a random improvement suggested by the grid.",
        recognition:
          "Can you state what is wrong in musical terms - contour, rhythm, repetition, range, closure or relation - before reaching for a new note?",
        source: {
          reference: "Chapter XII - listen and analyse",
          focus:
            "Revision begins with listening, then analysis of characteristic features, development and empty or weak segments.",
          exampleIds: ["s10.self-criticism"],
        },
        terms: [
          {
            term: "Diagnosis",
            definition:
              "A specific statement of the musical problem that a revision is intended to solve.",
          },
          {
            term: "Characteristic feature",
            definition:
              "A rhythm, interval, contour or other behaviour important enough to carry the identity of the musical idea.",
          },
        ],
        workspace: "melody",
        checksLabel: "Hear the problem first",
        successLabel: "Your first revision now follows an audible diagnosis",
      }),
      evaluate: ({ experiments }) => [
        {
          label: "You worked through the listening and analysis checklist",
          complete: studiedSource(experiments, "s10.self-criticism", 4),
        },
        {
          label: "You listened before or during revision",
          complete: heardPlayback(experiments),
        },
        {
          label: "You made a concrete melodic revision",
          complete: changedControl(experiments, "melody.edit"),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.self-criticism.b",
        letter: "B",
        title: "Remove what does not earn its place",
        learn:
          "Reduce non-essential activity and monotony at the same time: simplify what obscures the idea, but keep enough variety for the line to remain alive.",
        explanation:
          "More notes do not automatically mean more development. Embellishment, remote variation and abrupt register change can overload a passage when they do not strengthen its motive, harmony or formal direction. Removing such material can make the underlying idea more audible. The question is whether each event contributes to the musical argument, not whether it is individually attractive.\n\nSimplification has an opposite danger: monotony. Repeated tones, repeated figures, a cramped compass or uninterrupted motion in one direction can flatten the phrase. Revision therefore moves in both directions - eliminate unnecessary complexity and introduce variation where excessive sameness prevents the form from breathing.",
        instruction:
          "Revise the current melody substantially. Make at least six edits. Aim for 8-14 sounding notes in the sixteen-step phrase, at least four different pitches, and a moderate range rather than either one cramped register or uncontrolled extremes.\n\nListen after simplifying. If several identical pitches occur in a row without a clear rhythmic purpose, change or remove one. Keep rests where they clarify phrasing. The final line should feel leaner and more intentional, not simply emptier.",
        recognition:
          "After revision, can you point to something you removed because it was non-essential and something you changed because repetition had become monotonous?",
        source: {
          reference: "Chapter XII - eliminate non-essentials and avoid monotony",
          focus:
            "Revision removes unnecessary embellishment and remote variation while also checking repeated tones, contour, compass, climax and phrase endings for monotony.",
          exampleIds: ["s10.self-criticism", "s10.diagnostics"],
        },
        terms: [
          {
            term: "Non-essential",
            definition:
              "Material whose removal improves clarity because it contributes little to motive, harmony, phrase or form.",
          },
          {
            term: "Monotony",
            definition:
              "Excessive sameness in pitch, rhythm, contour, register or phrasing that weakens attention and formal direction.",
          },
        ],
        workspace: "melody",
        checksLabel: "Simplify and vary",
        successLabel: "The melody is now leaner without becoming monotonous",
      }),
      evaluate: ({ melody, experiments }) => {
        const notes = soundingNotes(melody);
        const range = pitchRange(melody);
        return [
          {
            label: "You made a substantial revision pass",
            complete: changedControl(experiments, "melody.edit", 6),
          },
          {
            label: "You listened after simplifying",
            complete: heardPlayback(experiments),
          },
          {
            label: "The phrase is neither empty nor overcrowded",
            complete: notes.length >= 8 && notes.length <= 14,
          },
          {
            label: "The melody uses at least four different pitches",
            complete: new Set(notes).size >= 4,
          },
          {
            label: "The compass is varied but controlled",
            complete: range >= 5 && range <= 14,
          },
          {
            label: "There is no long accidental run of one repeated pitch",
            complete: longestRepeatedPitchRun(melody) <= 3,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.self-criticism.c",
        letter: "C",
        title: "Audit the bass as a second melody",
        learn:
          "Stop judging the bass only by whether its notes fit the chords; revise its rhythm, contour and repetition as an independent line.",
        explanation:
          "A bass line can be harmonically correct and still be musically poor. Repeated roots, awkward register changes or a succession of large leaps may clarify each chord while creating no convincing line across the phrase. Listening to the bass separately exposes this problem because the upper parts can no longer distract from its contour.\n\nRevision should preserve harmonic function while improving melodic continuity. Inversions, passing motion or a different register can avoid unnecessary repetition. The goal is not a virtuosic bass part: it is a coherent secondary melody whose movement supports the root progression and the larger phrasing.",
        instruction:
          "Open the Bass workspace and listen to the current line on its own as far as possible. Revise at least six steps. Finish with at least eight sounding bass notes, at least three different pitches and a span of at least a third.\n\nPay special attention to repeated notes and large jumps at chord boundaries. Keep strong harmonic anchors, but change any passage that sounds like a mechanical list of roots rather than one line moving through the progression.",
        recognition:
          "If the upper parts disappeared, would the bass still have a contour and rhythm worth following?",
        source: {
          reference: "Chapter XII - watch the bass line",
          focus:
            "The bass should be criticised as a second melody as well as a harmonic foundation, with attention to rhythm, repetition, contour and inversions.",
          exampleIds: ["s10.self-criticism"],
        },
        terms: [
          {
            term: "Secondary melody",
            definition:
              "A supporting line that remains subordinate to the principal melody while maintaining its own coherent contour and rhythm.",
          },
          {
            term: "Root progression",
            definition:
              "The succession of harmonic roots underlying a chord progression, independent of the actual bass note chosen for each chord.",
          },
        ],
        workspace: "bass",
        checksLabel: "Audit the bass",
        successLabel: "The bass now works as a coherent supporting line",
      }),
      evaluate: ({ bassSequence, experiments }) => {
        const notes = soundingNotes(bassSequence);
        return [
          {
            label: "You revised the bass instead of accepting the old line",
            complete: changedControl(experiments, "bass.edit", 6),
          },
          {
            label: "You listened to the revised bass",
            complete: heardPlayback(experiments),
          },
          {
            label: "The bass contains at least eight sounding notes",
            complete: notes.length >= 8,
          },
          {
            label: "The bass has pitch variety",
            complete: new Set(notes).size >= 3,
          },
          {
            label: "The bass has a real contour",
            complete: pitchRange(bassSequence) >= 3,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.self-criticism.d",
        letter: "D",
        title: "Audit the harmonic motion",
        learn:
          "Make sure surface activity is supported by a harmonic progression that actually moves and remains comprehensible.",
        explanation:
          "A passage can contain many notes and still feel static when its harmonic foundation does not progress. The reverse problem also occurs: too many remote or rapidly changing harmonies can make a simple phrase feel disproportionately complicated. Harmonic rhythm, root progression and bass motion need to be judged together.\n\nRevision should therefore separate surface motion from structural motion. Repeated figuration over one harmony may be exactly right when stability is desired, but it cannot be mistaken for harmonic development. Likewise, adding a new chord at every available position is not automatically richer. The rate and distance of harmonic change should fit the surrounding phrase.",
        instruction:
          "In the Harmony sequencer, revise at least six note events and make sure all four bars contain audible harmonic material. Avoid putting the exact same rhythmic block in every bar: create at least two accompaniment rhythms across the four bars while keeping the progression intelligible.\n\nPlay all four bars and listen past the individual chord voicings to the rate of harmonic movement. If one bar feels empty, ask whether it needs harmonic direction; if the whole passage feels restless, simplify the number or placement of changes.",
        recognition:
          "Can you hear where the harmony is stable, where it moves and why that rate of change belongs to the phrase?",
        source: {
          reference: "Chapter XII - watch harmony and root progression",
          focus:
            "Surface activity cannot compensate for static or incoherent harmony; harmonic rhythm, root progression and bass should be reviewed together.",
          exampleIds: ["s10.self-criticism", "s10.diagnostics"],
        },
        terms: [
          {
            term: "Harmonic rhythm",
            definition:
              "The rate at which the governing harmony changes, independent of how many surface notes are sounding.",
          },
          {
            term: "Structural motion",
            definition:
              "Change that alters the underlying harmonic, motivic or formal direction rather than only the surface decoration.",
          },
        ],
        workspace: "harmony-song",
        checksLabel: "Audit the harmony",
        successLabel: "The harmonic motion now supports the phrase instead of merely filling it",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You revised the harmonic surface here",
          complete: changedControl(experiments, "harmony.note-edit", 6),
        },
        {
          label: "You listened through the harmonic revision",
          complete: heardPlayback(experiments),
        },
        {
          label: "All four bars contain harmonic information",
          complete: activeHarmonyBars(harmonySequence) === 4,
        },
        {
          label: "The accompaniment rhythm is not mechanically identical everywhere",
          complete: harmonyRhythmicVariety(harmonySequence) >= 2,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.self-criticism.e",
        letter: "E",
        title: "Make several solutions, then choose",
        learn:
          "Treat revision as sketching alternatives rather than polishing the first idea until you can no longer hear its weaknesses.",
        explanation:
          "Making many sketches is a way to escape attachment to the first solution. Trying the same problem with different methods reveals which features are essential and which were merely accidents of the original version. Systematic variation does not replace invention, but it can stimulate it by creating concrete alternatives to compare.\n\nThe final choice should come after listening and analysis. A second version may be more fluent but less characteristic; a simpler version may expose the harmony but weaken the climax. Good self-criticism weighs these trade-offs rather than assuming that every change is an improvement. Keep the version whose musical relationships are clearest and most purposeful.",
        instruction:
          "Return to the Melody workspace and make a deliberately broad revision pass: at least ten fresh edits, including trying more than one solution for some step before you settle. Play the phrase repeatedly while you work.\n\nBefore finishing, revisit at least six items in the revision checklist and three diagnostic problems. Keep 8-14 sounding notes, at least four different pitches and a controlled range. The final version should be something you chose after comparison, not simply the last state of the editor.",
        recognition:
          "Can you explain one alternative you rejected and the specific musical reason the final version works better?",
        source: {
          reference: "Chapter XII - make many sketches and illustrations of self-criticism",
          focus:
            "Systematic sketching creates alternatives; final revision compares them through listening, analysis, economy, bass and harmonic coherence.",
          exampleIds: ["s10.self-criticism", "s10.diagnostics"],
        },
        terms: [
          {
            term: "Sketch",
            definition:
              "A provisional version used to test one possible solution without committing to it as final.",
          },
          {
            term: "Self-criticism",
            definition:
              "The disciplined process of listening, analysing and revising one's own music according to specific musical functions.",
          },
        ],
        workspace: "melody",
        checksLabel: "Choose after comparison",
        successLabel: "The final melody is now the result of deliberate revision",
      }),
      evaluate: ({ melody, experiments }) => {
        const notes = soundingNotes(melody);
        return [
          {
            label: "You made enough edits to explore alternatives",
            complete: changedControl(experiments, "melody.edit", 10),
          },
          {
            label: "You listened throughout the revision",
            complete: heardPlayback(experiments),
          },
          {
            label: "You revisited most of the revision checklist",
            complete: studiedSource(experiments, "s10.self-criticism", 6),
          },
          {
            label: "You inspected several concrete diagnostic problems",
            complete: studiedSource(experiments, "s10.diagnostics", 3),
          },
          {
            label: "The final line is economical but substantial",
            complete: notes.length >= 8 && notes.length <= 14,
          },
          {
            label: "The final line retains pitch and registral variety",
            complete:
              new Set(notes).size >= 4 &&
              pitchRange(melody) >= 5 &&
              pitchRange(melody) <= 14,
          },
        ];
      },
    },
  ],
};
