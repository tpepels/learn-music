import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function exploredRange(
  experiments: Parameters<LessonDefinition["exercises"][number]["evaluate"]>[0]["experiments"],
  key: string,
): number {
  const item = experiments[key];
  if (!item || item.min === null || item.max === null) return 0;
  return item.max - item.min;
}

const lesson = lessonContentSchema.parse({
  id: "mixing.balance-space",
  number: 7,
  title: "Mixing & space",
  eyebrow: "Production · Mixer",
  hero: "Learn the mixer by making the track worse, then better.",
  description:
    "Use the same music to explore level, pan, low-cut and effects sends. Each exercise asks you to hear an exaggerated or unhelpful version before settling on a choice that supports your own track.",
  overview:
    "Mixing is relational. A number such as −7 dB or 140 Hz has no meaning by itself; it matters because of what it does to the other parts. The exercises therefore grade audible relationships and whether you actually explored the control, not one secret preset.",
});

export const mixingSpaceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.a",
        letter: "A",
        title: "Find a balance by losing it first",
        learn: "Hear foreground and background as relative level relationships.",
        explanation:
          "A fader changes the level of one part relative to all the others. The quickest way to learn that relationship is to deliberately make a part too loud and too quiet, then place it where its musical role becomes clear.",
        instruction:
          "Loop the arrangement. Move the MELODY through at least an 8 dB range so you hear it dominate and then disappear. Do the same more gently with CHORDS. Finish with melody clearly above chords, drums clearly above chords, and bass close enough to the drums to form one foundation.",
        recognition:
          "You should be able to move the melody a few dB and immediately hear its role change. The final balance does not need to match a prescribed set of fader numbers.",
        terms: [
          { term: "Fader", definition: "A level control used to change one channel relative to the rest of the mix." },
          { term: "Balance", definition: "The relative loudness relationship between the parts of a mix." },
          { term: "Foreground", definition: "Material perceived as especially present or attention-grabbing." },
          { term: "Background", definition: "Supporting material perceived behind more prominent elements." },
        ],
        workspace: "mixer",
        checksLabel: "Explore and balance",
        successLabel: "You found a balance after hearing its failures",
      }),
      evaluate: ({ mixerSettings, experiments }) => [
        {
          label: "You explored at least 8 dB of melody level",
          complete: exploredRange(experiments, "mixer.melody.volume") >= 8,
        },
        {
          label: "You also moved the chord level enough to compare it",
          complete: exploredRange(experiments, "mixer.chords.volume") >= 4,
        },
        {
          label: "Melody finishes at least 2 dB above chords",
          complete: mixerSettings.melody.volume - mixerSettings.chords.volume >= 2,
        },
        {
          label: "Drums finish at least 3 dB above chords",
          complete: mixerSettings.drums.volume - mixerSettings.chords.volume >= 3,
        },
        {
          label: "Bass stays within 6 dB of the drum foundation",
          complete: Math.abs(mixerSettings.bass.volume - mixerSettings.drums.volume) <= 6,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.b",
        letter: "B",
        title: "Cross the stereo field",
        learn: "Hear panning as placement rather than a target percentage.",
        explanation:
          "Panning only makes sense in relation to the centre and the other channels. Crossing one sound from left to right makes the stereo field much easier to hear than immediately typing in a moderate pan value.",
        instruction:
          "Keep BASS near the centre. Move CHORDS far to the left, then far to the right while the track loops. After hearing both extremes, settle chords moderately on one side and MELODY moderately on the opposite side.",
        recognition:
          "The extreme passes should make the location obvious. The final version should widen the track without making either side feel abandoned.",
        terms: [
          { term: "Pan", definition: "A control that places a channel between the left and right sides of the stereo field." },
          { term: "Stereo field", definition: "The perceived left-to-right space between two playback channels." },
          { term: "Centre", definition: "A sound sent equally to left and right and perceived in the middle." },
        ],
        workspace: "mixer",
        checksLabel: "Cross and place",
        successLabel: "You heard the extremes and chose a stereo placement",
      }),
      evaluate: ({ mixerSettings, experiments }) => {
        const chordPan = experiments["mixer.chords.pan"];
        return [
          {
            label: "Chords travelled from one side of the field to the other",
            complete:
              chordPan?.min !== null &&
              chordPan?.max !== null &&
              chordPan!.min! <= -0.55 &&
              chordPan!.max! >= 0.55,
          },
          {
            label: "Bass finishes near the centre",
            complete: Math.abs(mixerSettings.bass.pan) <= 0.12,
          },
          {
            label: "Chords and melody finish on opposite sides",
            complete:
              Math.abs(mixerSettings.chords.pan) >= 0.15 &&
              Math.abs(mixerSettings.chords.pan) <= 0.7 &&
              Math.abs(mixerSettings.melody.pan) >= 0.15 &&
              Math.abs(mixerSettings.melody.pan) <= 0.7 &&
              mixerSettings.chords.pan * mixerSettings.melody.pan < 0,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.c",
        letter: "C",
        title: "Find the point where filtering hurts",
        learn: "Use a low-cut by listening for what can be removed and what must remain.",
        explanation:
          "A low-cut is useful only until it begins removing musically important body. Sweeping too high on purpose teaches the boundary more clearly than memorising a recommended frequency.",
        instruction:
          "On CHORDS, sweep LOW CUT from near the bottom to at least 250 Hz and listen for the moment the part becomes obviously thin. Bring it back until the useful body returns. Keep BASS mostly unfiltered and choose a similarly restrained low-cut for MELODY.",
        recognition:
          "The correct point is the compromise just below obvious damage: less unnecessary low energy without making the musical part sound hollow.",
        terms: [
          { term: "Low-cut filter", definition: "A filter that reduces frequencies below a chosen cutoff." },
          { term: "Masking", definition: "One sound making another harder to hear because they occupy competing sonic space." },
          { term: "Body", definition: "The lower and low-mid energy that gives a sound weight and fullness." },
        ],
        workspace: "mixer",
        checksLabel: "Sweep and recover",
        successLabel: "You found the useful low-cut by ear",
      }),
      evaluate: ({ mixerSettings, experiments }) => [
        {
          label: "You swept the chord low-cut through at least 150 Hz",
          complete: exploredRange(experiments, "mixer.chords.highpass") >= 150,
        },
        {
          label: "You pushed the chord cutoff high enough to hear damage",
          complete: (experiments["mixer.chords.highpass"]?.max ?? 0) >= 250,
        },
        {
          label: "Bass finishes with its low foundation intact",
          complete: mixerSettings.bass.highpass <= 60,
        },
        {
          label: "Chords return to a useful rather than extreme cutoff",
          complete: mixerSettings.chords.highpass >= 70 && mixerSettings.chords.highpass <= 210,
        },
        {
          label: "Melody has some low cleanup without becoming extreme",
          complete: mixerSettings.melody.highpass >= 80 && mixerSettings.melody.highpass <= 260,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.d",
        letter: "D",
        title: "Hear washed out, then create depth",
        learn: "Learn effects sends by crossing the point where they stop helping.",
        explanation:
          "Shared reverb and delay create depth and continuity, but too much reverb blurs attacks and too much delay crowds the rhythm. Hearing that failure gives the final restrained setting a reason.",
        instruction:
          "Push CHORD reverb close to the top of its range until the attacks blur, then bring it back. Add some reverb to melody and a small melody delay. Keep bass comparatively dry. Choose the final amounts by ear rather than copying one percentage.",
        recognition:
          "The final mix should keep clear dry attacks with a softer space behind them. If you can no longer tell where notes begin, you have crossed back into the washed-out version.",
        terms: [
          { term: "Send", definition: "A control that copies part of a channel to a shared processing path." },
          { term: "Return", definition: "The mixer path carrying the processed effect signal back into the mix." },
          { term: "Dry / wet", definition: "Dry is the original sound; wet is the effected sound." },
          { term: "Depth", definition: "The perception that sounds occupy different front-to-back positions." },
        ],
        workspace: "mixer",
        checksLabel: "Overdo and recover",
        successLabel: "You created depth after hearing the washed-out version",
      }),
      evaluate: ({ mixerSettings, experiments }) => [
        {
          label: "You deliberately pushed chord reverb into an exaggerated range",
          complete: (experiments["mixer.chords.reverb"]?.max ?? 0) >= 0.34,
        },
        {
          label: "Chord reverb finishes below the exaggerated setting",
          complete: mixerSettings.chords.reverb >= 0.08 && mixerSettings.chords.reverb <= 0.3,
        },
        {
          label: "Melody shares some space",
          complete: mixerSettings.melody.reverb >= 0.06 && mixerSettings.melody.reverb <= 0.3,
        },
        {
          label: "Melody uses a restrained rhythmic delay",
          complete: mixerSettings.melody.delay >= 0.03 && mixerSettings.melody.delay <= 0.2,
        },
        {
          label: "Bass stays comparatively dry",
          complete: mixerSettings.bass.reverb <= 0.1 && mixerSettings.bass.delay <= 0.06,
        },
      ],
    },
  ],
};
