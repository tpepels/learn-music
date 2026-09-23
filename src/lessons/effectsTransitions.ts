import { changedRange } from "./learningEvidence";
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
  hero: "Make the space and echoes move with the music.",
  description:
    "Shape shared space with reverb, create rhythmic echoes with delay, widen a lead with chorus, and combine effects with automation to make transitions feel intentional.",
  overview:
    "Reverb changes distance, delay adds a second rhythm, and chorus spreads a sound. Push each effect far enough to recognise it, then decide whether the track needs it and how much.",
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
          "Listen to the gap between the dry chord and the tail. Can you still hear where the chord begins, or has the room swallowed the attack?",
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
      evaluate: ({ effectsSettings, mixerSettings, experiments }) => [
        {
          label: "You pushed reverb decay past 6 seconds to hear wash",
          complete: (experiments["effects.reverbDecay"]?.max ?? 0) >= 6,
        },
        {
          label: "Reverb decay returns to a usable range",
          complete: effectsSettings.reverbDecay >= 2.2 && effectsSettings.reverbDecay <= 4.8,
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
          "Raise melody delay until the repeats begin to crowd the phrase, then back it off. Change feedback enough to hear the number of repeats change. Finish with echoes that answer the melody without replacing it.",
        recognition:
          "Follow one melody note into its repeats. At what point do the echoes stop answering the phrase and start competing with the next note?",
        terms: [
          { term: "Feedback", definition: "The amount of a delay's output sent back into its input, controlling how many repeats continue." },
          { term: "Tempo-synced delay", definition: "A delay whose repeat time is locked to a musical subdivision such as 1/8 or 1/4 note." },
          { term: "Echo", definition: "A distinct delayed repetition of the original sound." },
        ],
        workspace: "effects",
        checksLabel: "Create rhythmic echoes",
        successLabel: "The delay now behaves like a supporting rhythmic layer",
      }),
      evaluate: ({ effectsSettings, mixerSettings, experiments }) => [
        {
          label: "You explored at least 15% of feedback range",
          complete: changedRange(
            experiments,
            "effects.delayFeedback",
            0.15,
          ),
        },
        {
          label: "You pushed melody delay high enough to hear clutter",
          complete: (experiments["mixer.melody.delay"]?.max ?? 0) >= 0.22,
        },
        {
          label: "Final delay is audible but restrained",
          complete:
            effectsSettings.delayFeedback >= 0.2 &&
            effectsSettings.delayFeedback <= 0.5 &&
            mixerSettings.melody.delay >= 0.05 &&
            mixerSettings.melody.delay <= 0.18,
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
          "Compare dry, moderate and exaggerated chorus. When does width become wobble? Keep the point before the effect starts announcing itself.",
        terms: [
          { term: "Chorus", definition: "A modulation effect that mixes the dry signal with slightly delayed and pitch-modulated copies." },
          { term: "Modulation effect", definition: "An effect that changes a parameter continuously over time, often creating movement or width." },
          { term: "Wet amount", definition: "How much effected signal is mixed with the original dry signal." },
        ],
        workspace: "effects",
        checksLabel: "Add width",
        successLabel: "The melody has stereo movement without losing focus",
      }),
      evaluate: ({ effectsSettings, experiments }) => [
        {
          label: "You compared nearly dry chorus with an exaggerated setting",
          complete:
            (experiments["effects.chorusWet"]?.min ?? Infinity) <= 0.05 &&
            (experiments["effects.chorusWet"]?.max ?? 0) >= 0.6,
        },
        {
          label: "Chorus finishes audible but not extreme",
          complete: effectsSettings.chorusWet >= 0.15 && effectsSettings.chorusWet <= 0.45,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.effects-transitions.d",
        letter: "D",
        title: "Design a transition",
        learn: "Choose a small set of production moves that all point toward the same arrival.",
        explanation:
          "A transition is stronger when several cues agree, but that does not mean every effect must be active. A filter opening plus growing space may be enough; a rhythmic echo plus width may work better in another track.",
        instruction:
          "Keep a clear chord-filter opening across the section. Then choose at least two of these to support it: larger reverb, audible melody delay, or chorus width. Play all eight bars. If one effect calls attention to itself more than the arrival does, back it off or leave it out.",
        recognition:
          "Listen to the destination, not the processors. Do the changes make the later bars feel inevitable, or are you mostly hearing a list of effects?",
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
      evaluate: ({ effectsSettings, mixerSettings, automationSettings, experiments }) => {
        const choices = [
          effectsSettings.reverbDecay >= 3.2 && mixerSettings.chords.reverb >= 0.12,
          mixerSettings.melody.delay >= 0.08 && effectsSettings.delayFeedback >= 0.25,
          effectsSettings.chorusWet >= 0.15,
        ].filter(Boolean).length;

        return [
          { label: "You listened through the whole transition", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
          {
            label: "Chord filter creates a clear opening motion",
            complete:
              Math.max(...automationSettings.chordFilterHz) -
                Math.min(...automationSettings.chordFilterHz) >=
              5000,
          },
          { label: "At least two effect ideas support the transition", complete: choices >= 2 },
        ];
      },
    },
  ],
};
