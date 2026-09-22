import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "mixing.balance-space",
  number: 7,
  title: "Mixing & space",
  eyebrow: "Production · Mixer",
  hero: "Make the same music feel clearer, wider, and more intentional.",
  description:
    "The notes and arrangement are already there. Now you will decide what sits forward, what stays behind, what occupies the centre, and how much shared space the sounds receive.",
  overview:
    "Mixing is the stage where existing parts are balanced and shaped so they work together. A mixer does not usually change the composition itself; it changes how clearly each part is perceived. You will work with level, pan, low-cut EQ, and send effects using the same controls found in DAWs and hardware mixers.",
});

export const mixingSpaceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.a",
        letter: "A",
        title: "Balance with faders",
        learn: "Use relative level to decide which parts feel foreground, support, and foundation.",
        explanation:
          "A fader controls a channel's level after the sound has already been created. Mixing starts with balance because a part that is simply too loud can mask other parts even before EQ or effects are considered. There is no universal correct set of numbers; this exercise gives you one workable starting balance for this project so you can learn what relative level changes sound like.",
        instruction:
          "Press Play and set a rough balance: drums around -4 dB, bass around -7 dB, chords around -11 dB, and melody around -7 dB. Move one fader at a time and notice which part suddenly takes over the track.",
        recognition:
          "A balanced mix lets you hear the main parts without one channel constantly covering the others. Lowering a fader should make a part feel farther back even though its notes stay unchanged.",
        terms: [
          { term: "Mixer", definition: "A set of channel controls used to combine and balance multiple audio signals." },
          { term: "Channel", definition: "One signal path in a mixer, usually corresponding to a track or instrument." },
          { term: "Fader", definition: "A level control, usually vertical, used to make a mixer channel louder or quieter." },
          { term: "dB", definition: "Decibels: the unit commonly used to describe audio level. 0 dB on a channel fader is its reference position, not 'silence'." },
          { term: "Balance", definition: "The relative loudness relationship between the parts of a mix." },
        ],
        workspace: "mixer",
        checksLabel: "Set the balance",
        successLabel: "The four channels have a clear rough balance",
      }),
      evaluate: ({ mixerSettings }) => [
        {
          label: "Drums sit around -4 dB",
          complete: mixerSettings.drums.volume >= -6 && mixerSettings.drums.volume <= -2,
        },
        {
          label: "Bass sits around -7 dB",
          complete: mixerSettings.bass.volume >= -9 && mixerSettings.bass.volume <= -5,
        },
        {
          label: "Chords are tucked behind the foreground",
          complete: mixerSettings.chords.volume >= -14 && mixerSettings.chords.volume <= -9,
        },
        {
          label: "Melody stays present without dominating",
          complete: mixerSettings.melody.volume >= -10 && mixerSettings.melody.volume <= -5,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.b",
        letter: "B",
        title: "Place sounds in stereo",
        learn: "Use panning to create horizontal space without changing volume.",
        explanation:
          "Panning positions a mono signal between the left and right speakers. Keeping kick, bass, and other foundational material near the centre gives the mix a stable anchor, while moving supporting parts slightly left or right can reduce competition and make the mix feel wider.",
        instruction:
          "Keep drums and bass centred. Pan chords moderately left and melody moderately right. Do not push them to the extremes; aim for a clear but natural separation.",
        recognition:
          "With headphones or two speakers, the mix should feel wider while the low-end foundation remains stable in the middle. If one side feels empty or the whole track leans sideways, the panning is probably too extreme.",
        terms: [
          { term: "Pan", definition: "A control that places a channel between the left and right sides of the stereo field." },
          { term: "Stereo field", definition: "The perceived left-to-right space between two playback channels." },
          { term: "Centre", definition: "A sound sent equally to left and right, perceived as coming from the middle." },
        ],
        workspace: "mixer",
        checksLabel: "Place the channels",
        successLabel: "The mix has a stable centre and a wider supporting field",
      }),
      evaluate: ({ mixerSettings }) => [
        {
          label: "Drums remain centred",
          complete: Math.abs(mixerSettings.drums.pan) <= 0.1,
        },
        {
          label: "Bass remains centred",
          complete: Math.abs(mixerSettings.bass.pan) <= 0.1,
        },
        {
          label: "Chords are moderately left",
          complete: mixerSettings.chords.pan <= -0.2 && mixerSettings.chords.pan >= -0.65,
        },
        {
          label: "Melody is moderately right",
          complete: mixerSettings.melody.pan >= 0.2 && mixerSettings.melody.pan <= 0.65,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.c",
        letter: "C",
        title: "Clear unnecessary low end",
        learn: "Use a low-cut filter to make frequency space for bass and kick.",
        explanation:
          "Many sounds contain low-frequency energy that is not musically useful. A low-cut filter—also called a high-pass filter—reduces frequencies below its cutoff. Producers often remove unnecessary lows from chords, pads, vocals, and melodies so the kick and bass have more room. The point is not to make every track thin; it is to remove low content that the part does not need.",
        instruction:
          "Leave drums and bass almost unfiltered. Raise the chord low-cut into roughly 90–180 Hz and the melody into roughly 120–250 Hz. Keep the track playing and listen for whether the low end becomes less cloudy.",
        recognition:
          "The kick and bass should become easier to identify while the musical identity of chords and melody remains intact. If a part becomes obviously thin or weak, the cutoff is probably too high.",
        terms: [
          { term: "EQ", definition: "Equalization: changing the level of selected frequency ranges in a sound." },
          { term: "Low-cut filter", definition: "A filter that reduces frequencies below a chosen cutoff point." },
          { term: "High-pass filter", definition: "Another name for a low-cut filter: it passes higher frequencies while reducing lower ones." },
          { term: "Masking", definition: "When one sound makes another harder to hear because they compete in similar frequency or level ranges." },
        ],
        workspace: "mixer",
        checksLabel: "Make frequency space",
        successLabel: "The low end now has clearer ownership",
      }),
      evaluate: ({ mixerSettings }) => [
        {
          label: "Drums keep their low-frequency impact",
          complete: mixerSettings.drums.highpass <= 50,
        },
        {
          label: "Bass keeps its fundamental low end",
          complete: mixerSettings.bass.highpass <= 50,
        },
        {
          label: "Chords remove unnecessary lows",
          complete: mixerSettings.chords.highpass >= 90 && mixerSettings.chords.highpass <= 180,
        },
        {
          label: "Melody removes unnecessary lows",
          complete: mixerSettings.melody.highpass >= 120 && mixerSettings.melody.highpass <= 250,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "mixing.balance-space.d",
        letter: "D",
        title: "Create depth with sends",
        learn: "Use shared reverb and delay to place sounds in a common space without washing out the mix.",
        explanation:
          "Instead of inserting a separate reverb on every track, mixers often send several channels to one shared effect return. This saves processing and, more importantly, makes different sounds feel as though they exist in the same acoustic space. Reverb mainly creates depth and ambience; delay creates distinct echoes and can reinforce rhythm.",
        instruction:
          "Add moderate reverb to chords and melody. Add a small amount of delay to the melody. Keep bass comparatively dry and avoid large delay sends on drums. Listen for depth, then briefly push a send too far so you can hear what 'washed out' means before returning to a restrained setting.",
        recognition:
          "With sensible sends, the dry sound remains clear while a softer tail or echo appears behind it. Too much reverb blurs attacks and pushes everything backward; too much delay can clutter the rhythm.",
        terms: [
          { term: "Send", definition: "A control that copies part of a channel signal to another processing path." },
          { term: "Return", definition: "The mixer channel that receives the processed signal from a shared effect." },
          { term: "Bus", definition: "A shared audio path used to route multiple signals to a common destination or processor." },
          { term: "Reverb", definition: "A dense collection of reflections that creates the impression of acoustic space and distance." },
          { term: "Delay", definition: "An effect that repeats the signal after a controllable amount of time." },
          { term: "Dry / wet", definition: "Dry is the original signal; wet is the effected signal." },
        ],
        workspace: "mixer",
        checksLabel: "Add shared space",
        successLabel: "The mix has depth without losing clarity",
      }),
      evaluate: ({ mixerSettings }) => [
        {
          label: "Chords use moderate reverb",
          complete: mixerSettings.chords.reverb >= 0.12 && mixerSettings.chords.reverb <= 0.28,
        },
        {
          label: "Melody uses moderate reverb",
          complete: mixerSettings.melody.reverb >= 0.1 && mixerSettings.melody.reverb <= 0.25,
        },
        {
          label: "Melody gets a small rhythmic delay",
          complete: mixerSettings.melody.delay >= 0.05 && mixerSettings.melody.delay <= 0.18,
        },
        {
          label: "Bass stays comparatively dry",
          complete: mixerSettings.bass.reverb <= 0.08 && mixerSettings.bass.delay <= 0.05,
        },
        {
          label: "Drum delay stays restrained",
          complete: mixerSettings.drums.delay <= 0.05,
        },
      ],
    },
  ],
};
