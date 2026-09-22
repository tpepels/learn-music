import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "production.stereo-mono",
  number: 22,
  title: "Stereo width & mono",
  eyebrow: "Production · Stereo field",
  hero: "Use the sides, but make the song survive without them."
  description:
    "Use pan and mid/side width deliberately, keep foundational low end stable, and perform a real mono compatibility check.",
  overview:
    "Panning moves a part left or right; width spreads or narrows what is already stereo. Keep the foundation stable, use the sides for contrast, and collapse to mono often enough to know the mix is not relying on width to stay understandable.",
});

export const stereoMonoLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.stereo-mono.a",
        letter: "A",
        title: "Place supporting parts",
        learn: "Create stereo separation with panning while keeping the low-end foundation centred.",
        explanation:
          "Panning can stop supporting parts from stacking in the same perceived position. Kick and bass are commonly kept near the centre because stable low-frequency energy translates reliably across playback systems.",
        instruction:
          "First put CHORDS and MELODY noticeably on the same side and hear the mix lean. Then move CHORDS across the centre to the opposite side while keeping BASS centred. Leave chords and melody moderately separated.",
        recognition:
          "After you separate the support parts, does the centre still feel anchored by the low end? Does one side feel heavier than the other?",
        terms: [
          { term: "Pan", definition: "The left/right placement of a signal in the stereo field." },
          { term: "Stereo field", definition: "The perceived horizontal space between left, centre, and right." },
          { term: "Centre", definition: "A signal reproduced equally in left and right channels so it appears between the speakers." },
        ],
        workspace: "stereo",
        checksLabel: "Create stable stereo placement",
        successLabel: "Supporting parts now spread around a centred low end",
      }),
      evaluate: ({ mixerSettings, experiments }) => [
        {
          label: "You moved chords across the stereo field during the comparison",
          complete:
            (experiments["mixer.chords.pan"]?.min ?? 0) <= -0.2 &&
            (experiments["mixer.chords.pan"]?.max ?? 0) >= 0.2,
        },
        {
          label: "Bass remains near the centre",
          complete: Math.abs(mixerSettings.bass.pan) <= 0.1,
        },
        {
          label: "Chords and melody are at least 20% off-centre",
          complete:
            Math.abs(mixerSettings.chords.pan) >= 0.2 &&
            Math.abs(mixerSettings.melody.pan) >= 0.2,
        },
        {
          label: "Chords and melody occupy opposite sides",
          complete:
            mixerSettings.chords.pan * mixerSettings.melody.pan < 0,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.stereo-mono.b",
        letter: "B",
        title: "Widen the support, not the foundation",
        learn: "Use mid/side width to make selected layers larger while preserving a focused centre.",
        explanation:
          "A stereo widener changes the balance between mid information and side information. Wider is not automatically better: foundational parts often benefit from a stable centre while pads, chords, and effects can occupy more side energy.",
        instruction:
          "Temporarily widen BASS to at least 160% and listen to the low end lose its stable centre. Then narrow bass back to 100% or less while making CHORDS clearly wider and MELODY somewhat wider than the bass.",
        recognition:
          "Compare the over-wide bass with the narrowed version. Which one gives the kick and bass a firmer centre?",
        terms: [
          { term: "Mid/side", definition: "A stereo representation separating information common to both channels (mid) from left/right differences (side)." },
          { term: "Stereo width", definition: "The perceived amount of side information relative to the centre." },
          { term: "Mono-compatible", definition: "Still clear and balanced when left and right are combined into one channel." },
        ],
        workspace: "stereo",
        checksLabel: "Use width selectively",
        successLabel: "Width now supports hierarchy instead of affecting every channel equally",
      }),
      evaluate: ({ stereoSettings, experiments }) => [
        {
          label: "You deliberately over-widened bass first",
          complete: (experiments["stereo.bass.width"]?.max ?? 0) >= 0.8,
        },
        {
          label: "Bass width returns to 100% or less on the display scale",
          complete: stereoSettings.widths.bass <= 0.5,
        },
        {
          label: "Chord width is at least 140%",
          complete: stereoSettings.widths.chords >= 0.7,
        },
        {
          label: "Melody width is at least 110%",
          complete: stereoSettings.widths.melody >= 0.55,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.stereo-mono.c",
        letter: "C",
        title: "Collapse the mix to mono",
        learn: "Check whether important relationships survive when stereo differences are removed.",
        explanation:
          "A mono check is diagnostic. If a part vanishes, becomes much quieter, or the balance changes dramatically, stereo processing may be creating phase or width dependence that will not translate everywhere.",
        instruction:
          "Press CHECK IN MONO while the arrangement plays. Listen to kick/bass balance, melody audibility, and whether the harmony still supports the track. Then return to stereo.",
        recognition:
          "In mono, what becomes harder to hear first? If an important part almost disappears, return to stereo and find out what it was relying on.",
        terms: [
          { term: "Mono", definition: "A single-channel presentation with no left/right separation." },
          { term: "Phase cancellation", definition: "Partial loss of signal when similar waveforms combine with opposing phase relationships." },
          { term: "Translation", definition: "How consistently a mix works across different speakers, headphones, rooms, and playback formats." },
        ],
        workspace: "stereo",
        checksLabel: "Perform the compatibility check",
        successLabel: "You have auditioned the project without stereo separation",
      }),
      evaluate: ({ stereoSettings }) => [
        {
          label: "A mono audition has been performed",
          complete: stereoSettings.monoChecked,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.stereo-mono.d",
        letter: "D",
        title: "Build a stereo hierarchy",
        learn: "Combine centre stability, pan contrast, width contrast, and mono checking into one repeatable stereo workflow.",
        explanation:
          "A robust stereo mix usually has hierarchy: some elements are deliberately central and stable, others create width and movement. Mono checking confirms that width is an enhancement rather than a structural dependency.",
        instruction:
          "Keep BASS centred and at 100% width or less. Keep CHORDS wider than BASS, use opposite-side pan contrast between CHORDS and MELODY, and make sure you have performed the mono check.",
        recognition:
          "Switch between stereo and mono. Does width add space, or is it doing essential work that the balance itself should be doing?",
        terms: [
          { term: "Stereo hierarchy", definition: "A deliberate distribution of central, panned, and widened elements according to musical importance." },
          { term: "Width contrast", definition: "Using different stereo widths across parts or sections rather than maximizing all of them." },
        ],
        workspace: "stereo",
        checksLabel: "Make width survive translation",
        successLabel: "The stereo field now has a deliberate centre, sides, and compatibility check",
      }),
      evaluate: ({ mixerSettings, stereoSettings }) => [
        {
          label: "Bass is centred and not widened beyond neutral",
          complete:
            Math.abs(mixerSettings.bass.pan) <= 0.1 &&
            stereoSettings.widths.bass <= 0.5,
        },
        {
          label: "Chords are wider than bass",
          complete:
            stereoSettings.widths.chords >
            stereoSettings.widths.bass,
        },
        {
          label: "Chords and melody use opposite pan directions",
          complete:
            mixerSettings.chords.pan * mixerSettings.melody.pan < 0,
        },
        {
          label: "Mono has been checked",
          complete: stereoSettings.monoChecked,
        },
      ],
    },
  ],
};
