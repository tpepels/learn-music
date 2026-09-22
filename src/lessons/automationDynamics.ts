import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function range(values: number[]) {
  return Math.max(...values) - Math.min(...values);
}

const lesson = lessonContentSchema.parse({
  id: "production.automation-dynamics",
  number: 8,
  title: "Automation & dynamics",
  eyebrow: "Production · Movement",
  hero: "Make the mix move instead of leaving every control frozen.",
  description:
    "Draw parameter changes across the arrangement, then shape drum dynamics with compression. The goal is to hear production as movement over time rather than as a collection of static settings.",
  overview:
    "Automation makes a control move while the track plays. Compression changes how the loud parts behave. Use both to shape what happens over time, not to make a static loop look more complicated.",
});

export const automationDynamicsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.automation-dynamics.a",
        letter: "A",
        title: "Draw a volume ride",
        learn: "Write fader movement into the arrangement instead of setting one fixed level.",
        explanation:
          "Volume automation lets a channel become louder or quieter at specific moments while the underlying notes stay the same. Producers use it to bring a melody forward for an important phrase, tuck it back under a vocal, create fades, or shape energy more precisely than a static fader can.",
        instruction:
          "Draw a rising Melody volume curve across the eight bars. Use at least four different values and span at least 8 dB from the quietest to the loudest point. Play the whole section and shape the curve until the melody seems to emerge rather than simply switch on.",
        recognition:
          "Play from bar 1. At what point does the melody start demanding your attention? Does the rise feel gradual or stepped?",
        terms: [
          { term: "Automation", definition: "Recorded parameter movement that changes automatically during playback." },
          { term: "Automation lane", definition: "A timeline view showing one parameter's changes over time." },
          { term: "Breakpoint", definition: "A point on an automation curve that sets the parameter value at a specific time." },
          { term: "Volume ride", definition: "Intentional fader movement used to keep a part at the desired level through a passage." },
        ],
        workspace: "automation-dynamics",
        checksLabel: "Draw movement",
        successLabel: "The melody now moves from background to foreground",
      }),
      evaluate: ({ automationSettings }) => [
        {
          label: "The melody finishes louder than it begins",
          complete: automationSettings.melodyVolumeDb[7] > automationSettings.melodyVolumeDb[0],
        },
        {
          label: "The curve spans at least 8 dB",
          complete: range(automationSettings.melodyVolumeDb) >= 8,
        },
        {
          label: "The movement is shaped with at least four distinct levels",
          complete: new Set(automationSettings.melodyVolumeDb).size >= 4,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.automation-dynamics.b",
        letter: "B",
        title: "Create a filter sweep",
        learn: "Automate timbre so a section gradually opens rather than changing all at once.",
        explanation:
          "A filter sweep automates cutoff frequency over time. Closing a low-pass filter removes upper harmonics and makes a sound feel darker or farther away; opening it restores brightness. This is a standard way to build anticipation before a chorus, drop, or climax.",
        instruction:
          "Draw a chord-filter opening across the section. Make the final bar at least 6000 Hz brighter than the opening and use at least four different cutoff values. Try a non-smooth point once, hear the sudden jump, then reshape the curve into the motion you want.",
        recognition:
          "Listen to the top edge of the chords. Does it open continuously, or can you hear a breakpoint jump out?",
        terms: [
          { term: "Filter sweep", definition: "Automated movement of a filter cutoff, usually used to make a sound open or close over time." },
          { term: "Cutoff automation", definition: "Recording or drawing changes to a filter's cutoff frequency on the timeline." },
          { term: "Build-up", definition: "A passage that increases expectation or energy before an important arrival." },
        ],
        workspace: "automation-dynamics",
        checksLabel: "Open the filter",
        successLabel: "The chords now brighten across the arrangement",
      }),
      evaluate: ({ automationSettings }) => [
        {
          label: "The filter finishes at least 6000 Hz more open than it starts",
          complete: automationSettings.chordFilterHz[7] - automationSettings.chordFilterHz[0] >= 6000,
        },
        {
          label: "The curve uses at least four distinct cutoff values",
          complete: new Set(automationSettings.chordFilterHz).size >= 4,
        },
        {
          label: "The middle participates in the opening motion",
          complete: automationSettings.chordFilterHz[3] > automationSettings.chordFilterHz[0],
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.automation-dynamics.c",
        letter: "C",
        title: "Catch drum peaks",
        learn: "Use compression to reduce loud peaks and make drum dynamics more controlled.",
        explanation:
          "A compressor turns a signal down automatically when it crosses a threshold. Ratio determines how strongly level above that threshold is reduced. A fast attack catches the front of drum hits quickly, which can make the groove more controlled but can also soften some of its punch.",
        instruction:
          "With the drums looping, set Ratio near 1:1 and listen to the uncompressed attack. Then push Ratio above 3:1, lower Threshold until the louder hits are controlled, and use a fast attack. Finish with a clearly compressed setting, but only after hearing the bypass-like version.",
        recognition:
          "Compare the first few milliseconds of the kick and snare. When does control turn into a duller attack?",
        terms: [
          { term: "Compressor", definition: "A dynamics processor that reduces level when a signal becomes louder than a chosen threshold." },
          { term: "Threshold", definition: "The level above which compression begins." },
          { term: "Ratio", definition: "How strongly level above the threshold is reduced, such as 4:1." },
          { term: "Gain reduction", definition: "The amount by which a compressor turns the signal down." },
          { term: "Dynamics", definition: "The variation between quieter and louder moments in a performance or signal." },
        ],
        workspace: "automation-dynamics",
        checksLabel: "Control the peaks",
        successLabel: "The drum bus now has controlled peak compression",
      }),
      evaluate: ({ dynamicsSettings, experiments }) => [
        {
          label: "You compared a near-1:1 ratio with real compression",
          complete: (experiments["dynamics.ratio"]?.min ?? Infinity) <= 1.2 && (experiments["dynamics.ratio"]?.max ?? 0) >= 3,
        },
        {
          label: "Final ratio applies clear compression",
          complete: dynamicsSettings.ratio >= 3 && dynamicsSettings.ratio <= 6,
        },
        {
          label: "Threshold is low enough to engage drum peaks",
          complete: dynamicsSettings.threshold <= -10,
        },
        {
          label: "Attack is fast enough to noticeably soften the transient",
          complete: dynamicsSettings.attack <= 0.015,
        },
        {
          label: "Release returns within the groove",
          complete: dynamicsSettings.release >= 0.06 && dynamicsSettings.release <= 0.35,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.automation-dynamics.d",
        letter: "D",
        title: "Preserve punch and shape the section",
        learn: "Use compressor timing and automation together as arrangement tools.",
        explanation:
          "The transient is the very beginning of a sound. On drums, a slightly slower compressor attack can let that initial hit through before compression acts on the body, preserving punch. Producers combine this kind of dynamics shaping with automation so the sound itself and the larger energy curve support the same musical moment.",
        instruction:
          "Keep the volume rise and filter opening. On the compressor, compare a very fast attack (12 ms or less) with a slower attack (25 ms or more) while the same drums loop. Leave the slower version if it restores the punch you want, then play the full eight-bar build.",
        recognition:
          "Switch between fast and slower attack. Which version keeps the hit alive? Then play all eight bars: do the level, filter and drums all point toward the same arrival?",
        terms: [
          { term: "Transient", definition: "The short burst of energy at the beginning of a sound, especially important for the perceived punch of drums." },
          { term: "Punch", definition: "The impression of a strong, clearly defined attack, often associated with drums and bass." },
          { term: "Compressor attack", definition: "How quickly the compressor begins reducing gain after the signal crosses the threshold." },
          { term: "Compressor release", definition: "How quickly the compressor stops reducing gain after the signal falls back down." },
          { term: "Dynamic arrangement", definition: "Using level, tone, density, and processing changes over time to shape a section's energy." },
        ],
        workspace: "automation-dynamics",
        checksLabel: "Combine movement and punch",
        successLabel: "Automation and dynamics now support the same energy arc",
      }),
      evaluate: ({ automationSettings, dynamicsSettings, experiments }) => [
        {
          label: "Melody still rises across the section",
          complete:
            automationSettings.melodyVolumeDb[7] -
              automationSettings.melodyVolumeDb[0] >=
            8,
        },
        {
          label: "Chord filter still opens across the section",
          complete:
            automationSettings.chordFilterHz[7] -
              automationSettings.chordFilterHz[0] >=
            6000,
        },
        {
          label: "You compared fast and slower compressor attacks",
          complete: (experiments["dynamics.attack"]?.min ?? Infinity) <= 0.012 && (experiments["dynamics.attack"]?.max ?? 0) >= 0.025,
        },
        {
          label: "Final attack leaves room for the transient",
          complete: dynamicsSettings.attack >= 0.025 && dynamicsSettings.attack <= 0.09,
        },
        {
          label: "Compression remains moderate",
          complete:
            dynamicsSettings.threshold >= -18 &&
            dynamicsSettings.threshold <= -10 &&
            dynamicsSettings.ratio >= 3 &&
            dynamicsSettings.ratio <= 5,
        },
        {
          label: "Release stays musical for the groove",
          complete: dynamicsSettings.release >= 0.08 && dynamicsSettings.release <= 0.25,
        },
      ],
    },
  ],
};
