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
    "Automation records how a parameter changes over time. Dynamics processing changes the relationship between loud and quiet moments. Together they let producers build energy, reveal details, control peaks, and reshape transients without rewriting the notes.",
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
          "Use the Melody volume automation lane. Start bar 1 at -10 dB or lower and bring the melody up to at least -2 dB by bar 8. Make at least an 8 dB difference across the curve, then play the full arrangement and listen to the melody emerge.",
        recognition:
          "The melody should feel as if it moves from background toward foreground across the eight bars, even though its MIDI notes do not change.",
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
          label: "Bar 1 begins at -10 dB or lower",
          complete: automationSettings.melodyVolumeDb[0] <= -10,
        },
        {
          label: "Bar 8 reaches at least -2 dB",
          complete: automationSettings.melodyVolumeDb[7] >= -2,
        },
        {
          label: "The curve spans at least 8 dB",
          complete: range(automationSettings.melodyVolumeDb) >= 8,
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
          "Use the Chord filter lane. Put bar 1 at 1500 Hz or lower, bar 4 above bar 1, and bar 8 at 8000 Hz or higher. Play the arrangement and listen to the chords brighten continuously across the section.",
        recognition:
          "The chord part should begin muffled and gradually reveal more high-frequency detail. The notes remain identical; only their spectral brightness changes.",
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
          label: "Bar 1 starts dark",
          complete: automationSettings.chordFilterHz[0] <= 1500,
        },
        {
          label: "The middle is more open than the start",
          complete: automationSettings.chordFilterHz[3] > automationSettings.chordFilterHz[0],
        },
        {
          label: "Bar 8 is bright and open",
          complete: automationSettings.chordFilterHz[7] >= 8000,
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
          "Set the drum compressor threshold between -20 and -12 dB, ratio between 3:1 and 5:1, attack at 12 ms or faster, and release between 80 and 300 ms. Play the arrangement and compare this controlled sound with ratio 1:1.",
        recognition:
          "With stronger, fast compression, the loudest drum attacks should feel less spiky and the groove more even. If it becomes dull or lifeless, the compressor may be grabbing too quickly or too strongly.",
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
      evaluate: ({ dynamicsSettings }) => [
        {
          label: "Threshold engages the louder drum hits",
          complete: dynamicsSettings.threshold >= -20 && dynamicsSettings.threshold <= -12,
        },
        {
          label: "Ratio is between 3:1 and 5:1",
          complete: dynamicsSettings.ratio >= 3 && dynamicsSettings.ratio <= 5,
        },
        {
          label: "Attack is fast enough to catch the transient",
          complete: dynamicsSettings.attack <= 0.012,
        },
        {
          label: "Release is between 80 and 300 ms",
          complete: dynamicsSettings.release >= 0.08 && dynamicsSettings.release <= 0.3,
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
          "Keep your volume rise and filter opening. Now slow the compressor attack to 25–70 ms, use a 3:1–5:1 ratio, threshold between -18 and -10 dB, and release between 80 and 250 ms. Play all eight bars and listen for the section becoming brighter and more present while the drums keep their attack.",
        recognition:
          "Compared with the fast-attack setting, the kick and snare should regain a clearer initial hit. At the same time the automation should make the whole section feel as though it is moving toward an arrival rather than simply looping.",
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
      evaluate: ({ automationSettings, dynamicsSettings }) => [
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
          label: "Attack leaves room for the transient",
          complete: dynamicsSettings.attack >= 0.025 && dynamicsSettings.attack <= 0.07,
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
