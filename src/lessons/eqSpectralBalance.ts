import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "production.eq-spectral-balance",
  number: 19,
  title: "EQ & spectral balance",
  eyebrow: "Production · EQ",
  hero: "Change where a sound lives before changing how loud it is.",
  description:
    "Use a high-pass filter and one parametric bell to remove unnecessary lows, sweep for a problem area, cut it, and make complementary space between parts.",
  overview:
    "Equalization changes the level of selected frequency regions. Frequency chooses where, gain chooses how much, and Q chooses how wide. Producers often exaggerate a move while searching, then reduce it once the useful region is identified.",
});

export const eqSpectralBalanceLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.eq-spectral-balance.a",
        letter: "A",
        title: "Clean the low end",
        learn: "Remove low-frequency energy from a part that does not need to compete with kick and bass.",
        explanation:
          "A high-pass filter attenuates frequencies below its cutoff. It is useful when a sound contains low rumble or body that adds little musically but occupies the same region as the low-end foundation.",
        instruction:
          "Select CHORDS and loop the arrangement. Sweep HIGH-PASS from near the bottom to at least 280 Hz so you clearly hear the chord body disappear. Then bring it back until the mud is reduced without making the chords obviously thin.",
        recognition:
          "The chords should lose some low body while kick and bass become easier to perceive. If the chords become thin, the cutoff has gone too high.",
        terms: [
          { term: "EQ", definition: "Equalization: changing the level of selected frequency regions." },
          { term: "High-pass filter", definition: "A filter that lets frequencies above its cutoff pass while attenuating lower frequencies." },
          { term: "Cutoff frequency", definition: "The frequency around which a filter begins its attenuation." },
          { term: "Masking", definition: "When one sound makes another harder to hear because they compete in a similar frequency region." },
        ],
        workspace: "eq",
        checksLabel: "Clear unnecessary lows",
        successLabel: "The chord channel now leaves more low-end space",
      }),
      evaluate: ({ mixerSettings }) => [
        {
          label: "Chord high-pass is between 100 and 220 Hz",
          complete:
            mixerSettings.chords.highpass >= 100 &&
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
          "A common EQ search technique is to boost a narrow bell and sweep its centre frequency. The boost is not the final mix decision—it makes a frequency region obvious enough to identify by ear.",
        instruction:
          "On CHORDS, use a narrow Q and a large temporary boost. Sweep the bell across at least 2 kHz of the midrange while the loop plays. Stop only after you have heard several obviously different resonances, then leave the bell on one region that sounds especially coloured or annoying.",
        recognition:
          "A narrow boost should make one character jump forward—boxiness, nasal tone, bite, or presence—depending on the selected frequency.",
        terms: [
          { term: "Bell filter", definition: "A parametric EQ shape that boosts or cuts a band around a centre frequency." },
          { term: "Q", definition: "The bandwidth control of a parametric filter; higher Q means a narrower frequency range." },
          { term: "Sweep", definition: "Moving a filter frequency while listening to locate a useful or problematic region." },
        ],
        workspace: "eq",
        checksLabel: "Make the frequency obvious",
        successLabel: "You have created a deliberate narrow search boost",
      }),
      evaluate: ({ eqSettings, experiments }) => [
        {
          label: "Chord bell is boosted by at least +6 dB",
          complete: eqSettings.chords.gain >= 6,
        },
        {
          label: "Q is at least 3",
          complete: eqSettings.chords.q >= 3,
        },
        {
          label: "Frequency is in the practical midrange search area",
          complete:
            eqSettings.chords.frequency >= 300 &&
            eqSettings.chords.frequency <= 4000,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.eq-spectral-balance.c",
        letter: "C",
        title: "Turn the search into a cut",
        learn: "Convert an exaggerated diagnostic boost into a smaller corrective cut.",
        explanation:
          "Once a troublesome region is identified, producers usually remove the temporary boost and try a much smaller cut. The aim is not to erase the sound's character but to reduce what distracts from the mix.",
        instruction:
          "Keep roughly the region you found, but flip the exaggerated boost into a moderate cut. Move Gain back and forth across 0 dB once so you hear boost, flat and cut on the same frequency before settling on a cut.",
        recognition:
          "The sound should become less congested without feeling hollow. If the EQ itself becomes the most obvious thing you hear, the cut is probably too deep.",
        terms: [
          { term: "Corrective EQ", definition: "EQ used to reduce unwanted resonances, masking, or tonal imbalances." },
          { term: "Resonance", definition: "A frequency region that stands out strongly relative to surrounding frequencies." },
        ],
        workspace: "eq",
        checksLabel: "Back the search move off",
        successLabel: "The exaggerated search has become a practical corrective cut",
      }),
      evaluate: ({ eqSettings, experiments }) => [
        {
          label: "Chord bell is cutting between −2 and −6 dB",
          complete:
            eqSettings.chords.gain <= -2 &&
            eqSettings.chords.gain >= -6,
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
        learn: "Use small opposite EQ moves so two important parts do not demand the same spectral foreground.",
        explanation:
          "Complementary EQ means reducing a region in one part while allowing or gently emphasizing that region in another. It is not a fixed recipe; it is a way of making parts cooperate instead of treating each one in isolation.",
        instruction:
          "Keep a useful midrange cut on CHORDS. Now move the MELODY bell around while the full mix plays and create a small complementary boost where it helps the melody read more clearly. Avoid simply copying the chord frequency; make the two choices serve different roles.",
        recognition:
          "The melody should become easier to locate without simply turning it up, while the chords remain present behind it.",
        terms: [
          { term: "Complementary EQ", definition: "Coordinated EQ choices on different parts so they occupy overlapping frequency space more clearly." },
          { term: "Presence", definition: "The frequency region that helps a sound feel forward, clear, or immediately audible." },
        ],
        workspace: "eq",
        checksLabel: "Separate foreground and support",
        successLabel: "Harmony and melody now use coordinated spectral space",
      }),
      evaluate: ({ eqSettings }) => [
        {
          label: "Chords have a midrange cut",
          complete:
            eqSettings.chords.gain <= -2 &&
            eqSettings.chords.frequency >= 700 &&
            eqSettings.chords.frequency <= 3000,
        },
        {
          label: "Melody has a gentle presence boost",
          complete:
            eqSettings.melody.gain >= 1 &&
            eqSettings.melody.gain <= 4 &&
            eqSettings.melody.frequency >= 1200 &&
            eqSettings.melody.frequency <= 4000,
        },
      ],
    },
  ],
};
