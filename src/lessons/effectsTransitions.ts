import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "production.effects-transitions",
  number: 9,
  title: "Creative effects & transitions",
  eyebrow: "Production · FX",
  hero: "Use effects as musical events, not decoration.",
  description:
    "Shape shared space with reverb, create rhythmic echoes with delay, widen a lead with chorus, and combine effects with automation to make transitions feel intentional.",
  overview:
    "Effects can solve mix problems, but they can also become part of the composition. Reverb creates depth, delay creates repeated rhythm, chorus creates movement and width, and automation can turn any of them into a transition device.",
});

export const effectsTransitionsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.effects-transitions.a",
        letter: "A",
        title: "Build a shared room",
        learn: "Use reverb decay, pre-delay, and send level to create depth without losing the dry attack.",
        explanation:
          "Reverb decay controls how long the reflected tail lasts. Pre-delay leaves a short gap between the dry sound and the reverb, which can keep the original attack clear even when the room is large. The send amount decides how much of a channel enters the shared reverb return.",
        instruction:
          "Keep the arrangement playing. Set reverb decay between 2.5 and 4.5 seconds, pre-delay between 15 and 50 ms, and send at least 15% of the chords to Return A. Push decay above 6 seconds briefly so you can hear 'washed out', then return to the useful range.",
        recognition:
          "The chords should gain a tail and feel farther back, while the original chord attack remains readable. Too much decay or send will blur one chord into the next.",
        terms: [
          { term: "Decay time", definition: "How long a reverb takes to fade after the source stops." },
          { term: "Pre-delay", definition: "The short gap between the dry sound and the start of the reverb reflections." },
          { term: "Return effect", definition: "A shared effect channel that receives signal from one or more sends." },
          { term: "Depth", definition: "The impression that some sounds are closer and others farther away in a mix." },
        ],
        workspace: "effects",
        checksLabel: "Shape the room",
        successLabel: "The chords now sit inside a controlled shared space",
      }),
      evaluate: ({ effectsSettings, mixerSettings }) => [
        {
          label: "Reverb decay is musical rather than extreme",
          complete: effectsSettings.reverbDecay >= 2.5 && effectsSettings.reverbDecay <= 4.5,
        },
        {
          label: "Pre-delay leaves room for the dry attack",
          complete: effectsSettings.reverbPreDelay >= 0.015 && effectsSettings.reverbPreDelay <= 0.05,
        },
        {
          label: "Chords feed the reverb return",
          complete: mixerSettings.chords.reverb >= 0.15 && mixerSettings.chords.reverb <= 0.32,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.effects-transitions.b",
        letter: "B",
        title: "Turn delay into rhythm",
        learn: "Hear delay feedback as a repeating rhythmic pattern rather than simply an echo.",
        explanation:
          "A tempo-synced delay repeats sound in time with the beat. Feedback sends part of each repeat back into the delay, creating more echoes. The send amount determines how strongly the source enters that repeating pattern.",
        instruction:
          "Set delay feedback between 28% and 48% and melody delay send between 8% and 18%. Listen to how the eighth-note repeats answer the melody without replacing it.",
        recognition:
          "You should hear a few clear rhythmic echoes after melody notes. If feedback is too high, repeats accumulate and begin to compete with new notes.",
        terms: [
          { term: "Feedback", definition: "The amount of a delay's output sent back into its input, controlling how many repeats continue." },
          { term: "Tempo-synced delay", definition: "A delay whose repeat time is locked to a musical subdivision such as 1/8 or 1/4 note." },
          { term: "Echo", definition: "A distinct delayed repetition of the original sound." },
        ],
        workspace: "effects",
        checksLabel: "Create rhythmic echoes",
        successLabel: "The delay now behaves like a supporting rhythmic layer",
      }),
      evaluate: ({ effectsSettings, mixerSettings }) => [
        {
          label: "Feedback creates several repeats without runaway echoes",
          complete: effectsSettings.delayFeedback >= 0.28 && effectsSettings.delayFeedback <= 0.48,
        },
        {
          label: "Melody send feeds the delay clearly",
          complete: mixerSettings.melody.delay >= 0.08 && mixerSettings.melody.delay <= 0.18,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.effects-transitions.c",
        letter: "C",
        title: "Widen with chorus",
        learn: "Use subtle modulation to make one part feel wider without panning away its centre.",
        explanation:
          "Chorus creates slightly delayed and modulated copies of a signal. Tiny pitch and timing differences make the copies spread across stereo, creating width and movement. Too much chorus can make pitch feel unstable or blurry.",
        instruction:
          "Raise melody chorus wet to between 20% and 45%. Compare 0%, your chosen setting, and an exaggerated value above 60%, then return to the moderate range.",
        recognition:
          "The melody should feel wider and slightly more animated while remaining clearly identifiable in the centre. At extreme settings it becomes obviously swirly.",
        terms: [
          { term: "Chorus", definition: "A modulation effect that mixes the dry signal with slightly delayed and pitch-modulated copies." },
          { term: "Modulation effect", definition: "An effect that changes a parameter continuously over time, often creating movement or width." },
          { term: "Wet amount", definition: "How much effected signal is mixed with the original dry signal." },
        ],
        workspace: "effects",
        checksLabel: "Add width",
        successLabel: "The melody has stereo movement without losing focus",
      }),
      evaluate: ({ effectsSettings }) => [
        {
          label: "Chorus is audible but not extreme",
          complete: effectsSettings.chorusWet >= 0.2 && effectsSettings.chorusWet <= 0.45,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.effects-transitions.d",
        letter: "D",
        title: "Design a transition",
        learn: "Combine automation and effects so several production moves point toward the same arrival.",
        explanation:
          "Strong transitions usually come from multiple small cues working together: a filter opens, ambience grows, echoes become more noticeable, density changes, or a fill signals the boundary. The important principle is direction: each move should help the listener feel where the music is going.",
        instruction:
          "Keep a chord-filter sweep of at least 6000 Hz across the section, use at least 3.2 seconds of reverb decay, keep melody delay active above 8%, and use at least 15% chorus. Play all eight bars and listen for one continuous build rather than four unrelated effects.",
        recognition:
          "The transition should feel directional: brightness, width, and space increase toward the later bars. If you mostly notice individual effects rather than the arrival, simplify the settings.",
        terms: [
          { term: "Transition", definition: "A passage that connects sections and prepares the listener for a change." },
          { term: "Ear candy", definition: "Small production details or effects added for interest, often around phrase and section boundaries." },
          { term: "Riser", definition: "A sound or effect that increases in pitch, brightness, level, or intensity toward an arrival." },
          { term: "FX automation", definition: "Changing effect parameters or send amounts over time." },
        ],
        workspace: "effects",
        checksLabel: "Make one coherent transition",
        successLabel: "The effects and automation now point toward the same arrival",
      }),
      evaluate: ({ effectsSettings, mixerSettings, automationSettings }) => [
        {
          label: "Chord filter creates a clear opening motion",
          complete:
            Math.max(...automationSettings.chordFilterHz) -
              Math.min(...automationSettings.chordFilterHz) >=
            6000,
        },
        {
          label: "Reverb has enough tail to create atmosphere",
          complete: effectsSettings.reverbDecay >= 3.2,
        },
        {
          label: "Melody delay participates in the transition",
          complete: mixerSettings.melody.delay >= 0.08,
        },
        {
          label: "Chorus adds width",
          complete: effectsSettings.chorusWet >= 0.15,
        },
      ],
    },
  ],
};
