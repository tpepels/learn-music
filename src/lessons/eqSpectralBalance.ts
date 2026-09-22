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
  id: "production.eq-spectral-balance",
  number: 19,
  title: "EQ & spectral balance",
  eyebrow: "Production · EQ",
  hero: "Find frequency choices by hearing what goes wrong.",
  description:
    "Sweep filters far enough to hear damage and resonance, then back off into a useful correction. The learner searches, compares, and decides instead of entering recommended frequencies.",
  overview:
    "Equalization changes selected frequency regions. Frequency chooses where, gain chooses how much, and Q chooses how wide. Exaggeration is useful while learning because it makes a region obvious; the final move is usually smaller than the search move.",
});

export const eqSpectralBalanceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.eq-spectral-balance.a",
        letter: "A",
        title: "Find the low-cut boundary",
        learn: "Hear where cleanup turns into damage.",
        explanation:
          "A high-pass filter can remove low energy a chord part does not need, but there is no universally correct cutoff. The useful boundary becomes clearer when you deliberately sweep past it until the sound loses body.",
        instruction:
          "Select CHORDS and loop the arrangement. Sweep HIGH-PASS from near the bottom to at least 280 Hz so the chord body clearly disappears. Then bring it back until the low end is cleaner without the chords sounding thin.",
        recognition:
          "At the extreme setting the chords should lose obvious weight. The final setting should restore enough body while leaving more room for kick and bass.",
        terms: [
          { term: "High-pass filter", definition: "A filter that passes frequencies above its cutoff while attenuating lower frequencies." },
          { term: "Cutoff", definition: "The frequency around which a filter begins to attenuate the signal." },
          { term: "Masking", definition: "When one sound makes another harder to hear because they compete in a similar frequency region." },
          { term: "Body", definition: "Lower and low-mid energy that gives a sound weight and fullness." },
        ],
        workspace: "eq",
        checksLabel: "Sweep and recover",
        successLabel: "You found the low-cut by crossing the useful boundary",
      }),
      evaluate: ({ mixerSettings, experiments }) => [
        {
          label: "You swept at least 180 Hz of high-pass range",
          complete: exploredRange(experiments, "mixer.chords.highpass") >= 180,
        },
        {
          label: "You pushed the cutoff high enough to hear the chords become thin",
          complete: (experiments["mixer.chords.highpass"]?.max ?? 0) >= 280,
        },
        {
          label: "Final cutoff backs away from the destructive extreme",
          complete:
            mixerSettings.chords.highpass >= 70 &&
            mixerSettings.chords.highpass <= 220,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.eq-spectral-balance.b",
        letter: "B",
        title: "Sweep to find a region",
        learn: "Use an exaggerated narrow boost as a temporary listening tool.",
        explanation:
          "A narrow boosted bell turns subtle resonances into obvious ones. The point is not to keep the ugly boost; it is to sweep widely enough that you learn how different frequency regions sound.",
        instruction:
          "On CHORDS, use Q 3 or higher and a boost of at least +6 dB. Sweep the bell across at least 2 kHz of the midrange while the loop plays. Stop only after several regions have sounded distinctly different.",
        recognition:
          "Boxiness, nasal tone, bite and presence should appear at different points in the sweep. The moving character is more important than memorising a frequency number.",
        terms: [
          { term: "Bell filter", definition: "A parametric EQ shape that boosts or cuts around a centre frequency." },
          { term: "Q", definition: "The bandwidth control of a parametric filter; higher Q means a narrower band." },
          { term: "Sweep", definition: "Moving a filter frequency while listening to locate a useful or problematic region." },
        ],
        workspace: "eq",
        checksLabel: "Search",
        successLabel: "You searched the midrange rather than guessing a frequency",
      }),
      evaluate: ({ eqSettings, experiments }) => [
        {
          label: "The temporary search boost is at least +6 dB",
          complete: eqSettings.chords.gain >= 6,
        },
        {
          label: "The search is focused with Q 3 or higher",
          complete: eqSettings.chords.q >= 3,
        },
        {
          label: "You swept at least 2 kHz of centre-frequency range",
          complete: exploredRange(experiments, "eq.chords.frequency") >= 2000,
        },
        {
          label: "The current region remains inside a practical search range",
          complete:
            eqSettings.chords.frequency >= 250 &&
            eqSettings.chords.frequency <= 5000,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.eq-spectral-balance.c",
        letter: "C",
        title: "Turn the search into a cut",
        learn: "Hear boost, flat and cut at the same region before choosing the correction.",
        explanation:
          "A diagnostic boost and a mix correction serve different purposes. After finding a region, cross zero so you hear how that same frequency sounds boosted and reduced before settling on a modest cut.",
        instruction:
          "Keep roughly the region you found. Move GAIN from positive through 0 dB into negative territory, then settle on a cut between roughly −1.5 and −7 dB with Q 2 or higher.",
        recognition:
          "The final version should reduce the annoying character without making the absence of that frequency more obvious than the original problem.",
        terms: [
          { term: "Corrective EQ", definition: "EQ used to reduce unwanted resonances, masking, or tonal imbalance." },
          { term: "Resonance", definition: "A frequency region that stands out strongly relative to surrounding frequencies." },
        ],
        workspace: "eq",
        checksLabel: "Compare and cut",
        successLabel: "You converted a listening tool into a practical correction",
      }),
      evaluate: ({ eqSettings, experiments }) => [
        {
          label: "You heard both boost and cut at this region",
          complete:
            (experiments["eq.chords.gain"]?.max ?? 0) >= 1 &&
            (experiments["eq.chords.gain"]?.min ?? 0) <= -2,
        },
        {
          label: "The final chord bell is a moderate cut",
          complete:
            eqSettings.chords.gain <= -1.5 &&
            eqSettings.chords.gain >= -7,
        },
        {
          label: "Q remains focused at 2 or higher",
          complete: eqSettings.chords.q >= 2,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.eq-spectral-balance.d",
        letter: "D",
        title: "Make complementary space",
        learn: "Use different EQ roles on chords and melody rather than treating tracks in isolation.",
        explanation:
          "Complementary EQ means one part gives up some emphasis where another part benefits from it. The exact frequencies depend on the material, so the important decision is the relationship between the two moves.",
        instruction:
          "Keep a useful midrange cut on CHORDS. On MELODY, sweep the bell while the full mix plays and choose a small boost that makes the melody easier to locate. Do not simply copy the chord frequency; make the two moves serve different spectral roles.",
        recognition:
          "The melody should read more clearly without merely becoming louder, while the chords still feel complete behind it.",
        terms: [
          { term: "Complementary EQ", definition: "Coordinated EQ choices on different parts so overlapping frequency space is shared more clearly." },
          { term: "Presence", definition: "A frequency region that helps a sound feel forward, clear, or immediately audible." },
        ],
        workspace: "eq",
        checksLabel: "Separate roles",
        successLabel: "The EQ choices now respond to each other",
      }),
      evaluate: ({ eqSettings, experiments }) => [
        {
          label: "Chords retain a useful midrange cut",
          complete:
            eqSettings.chords.gain <= -1.5 &&
            eqSettings.chords.frequency >= 400 &&
            eqSettings.chords.frequency <= 4000,
        },
        {
          label: "Melody has a gentle presence boost",
          complete:
            eqSettings.melody.gain >= 0.5 &&
            eqSettings.melody.gain <= 5 &&
            eqSettings.melody.frequency >= 800 &&
            eqSettings.melody.frequency <= 5000,
        },
        {
          label: "You moved the melody frequency while listening for its role",
          complete: exploredRange(experiments, "eq.melody.frequency") >= 600,
        },
        {
          label: "The two EQ moves are not stacked on the same centre frequency",
          complete:
            Math.abs(
              eqSettings.melody.frequency - eqSettings.chords.frequency,
            ) >= 250,
        },
      ],
    },
  ],
};
