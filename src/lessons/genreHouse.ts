import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function soundingBass(sequence: Array<number | null>) {
  return sequence
    .map((midi, step) => ({ midi, step }))
    .filter((event): event is { midi: number; step: number } => event.midi !== null);
}

function activeLayers(bar: {
  drums: boolean;
  bass: boolean;
  chords: boolean;
  melody: boolean;
}) {
  return Number(bar.drums) + Number(bar.bass) + Number(bar.chords) + Number(bar.melody);
}

const lesson = lessonContentSchema.parse({
  id: "genre.house",
  number: 29,
  title: "House: pulse, offbeats & lift",
  eyebrow: "Genre lens · House",
  hero: "Hear how a few repeating relationships can become a dance-floor engine.",
  description:
    "Use the project you already built to explore common house tendencies: a steady quarter-note kick, offbeat energy, bass that interlocks with the pulse, and sections that create lift by removing and returning layers.",
  overview:
    "Genre is not a recipe. House contains many subgenres and exceptions. Treat these exercises as a lens: isolate a few recurring relationships, hear what they do, and decide which ones are useful in your own track.",
});

export const genreHouseLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "genre.house.a",
        letter: "A",
        title: "Put the floor under the groove",
        learn: "Hear the relationship between a four-beat kick and the eighth-note spaces between those beats.",
        explanation:
          "A steady kick on all four quarter notes is common across many house styles. Closed hats or percussion often energise the spaces between those kicks. The identity comes from the relationship, not from one magic sound.",
        instruction:
          "Set the tempo between 112 and 132 BPM. Keep kicks on steps 1, 5, 9, and 13, snares on 5 and 13, and put closed hats on the four eighth-note offbeats: steps 3, 7, 11, and 15. Listen to how the hats pull between the kicks.",
        recognition:
          "Ignore the screen for one loop. Can you feel the kick as the floor and the hats as motion between the four beats?",
        terms: [
          { term: "Four-on-the-floor", definition: "A kick drum on each quarter-note beat in 4/4." },
          { term: "Offbeat", definition: "A subdivision between the main beats; here, the eighth note between two quarter-note kicks." },
          { term: "Genre convention", definition: "A recurring musical tendency associated with a style, not a rule every track must follow." },
        ],
        workspace: "groove-feel",
        checksLabel: "Build the pulse relationship",
        successLabel: "The groove now has a house-like kick/offbeat engine",
      }),
      evaluate: ({ bpm, A }) => [
        {
          label: "Tempo is between 112 and 132 BPM",
          complete: bpm >= 112 && bpm <= 132,
        },
        {
          label: "Kick marks all four quarter-note beats",
          complete: [0, 4, 8, 12].every((step) => A.kick[step]),
        },
        {
          label: "Snare keeps the backbeat on 2 and 4",
          complete: A.snare[4] && A.snare[12],
        },
        {
          label: "Hats mark all four eighth-note offbeats",
          complete: [2, 6, 10, 14].every((step) => A.hat[step]),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.house.b",
        letter: "B",
        title: "Make the bass answer the kick",
        learn: "Use syncopated bass attacks so the low end moves around the steady pulse instead of merely doubling it.",
        explanation:
          "A four-on-the-floor kick already occupies every beat. Bass can reinforce some of those beats, but notes between them create a second rhythmic layer. The useful question is whether kick and bass interlock or simply pile up.",
        instruction:
          "Keep the kick pattern from A. In the bass roll, write 6–14 notes over the four bars. Put at least three bass attacks on eighth-note offbeats and use at least two different pitches. Leave enough rests that you can hear kick and bass as separate parts.",
        recognition:
          "Listen only to the low end. Which bass notes feel like answers to the kick, and which ones make the two parts fight for the same moment?",
        terms: [
          { term: "Interlock", definition: "Two parts creating one groove by occupying complementary rhythmic positions." },
          { term: "Syncopation", definition: "Emphasis on weaker beats or subdivisions instead of only the main pulse." },
          { term: "Low-end relationship", definition: "The rhythmic and spectral interaction between kick drum and bass." },
        ],
        workspace: "bass",
        checksLabel: "Interlock kick and bass",
        successLabel: "The bass now moves around the pulse instead of only tracing it",
      }),
      evaluate: ({ bassSequence }) => {
        const notes = soundingBass(bassSequence);
        const pitches = new Set(notes.map(({ midi }) => midi));
        return [
          {
            label: "The bass line uses 6–14 attacks",
            complete: notes.length >= 6 && notes.length <= 14,
          },
          {
            label: "At least three bass attacks land on eighth-note offbeats",
            complete: notes.filter(({ step }) => step % 2 === 1).length >= 3,
          },
          {
            label: "The bass line uses at least two pitches",
            complete: pitches.size >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.house.c",
        letter: "C",
        title: "Create lift by taking something away",
        learn: "Use subtraction before a fuller return instead of trying to create every transition by adding more.",
        explanation:
          "A breakdown works because the listener remembers the energy that disappeared. When the rhythmic foundation returns, the contrast can feel larger even if no new instrument has been added.",
        instruction:
          "In Arrangement, make at least one bar where the drums drop out but another musical layer continues. Make the following bar bring the drums back, and make at least one later bar contain three or four layers. Hear the return before deciding whether the dropout is long enough.",
        recognition:
          "Does the return feel bigger because something new arrived, or because the kick had been missing?",
        terms: [
          { term: "Breakdown", definition: "A section where important rhythmic or textural layers are reduced before a later return." },
          { term: "Lift", definition: "A perceived rise in energy or intensity." },
          { term: "Subtractive arrangement", definition: "Creating contrast by removing existing material rather than adding new material." },
        ],
        workspace: "arrangement",
        checksLabel: "Make absence create the lift",
        successLabel: "The arrangement now earns its return through subtraction",
      }),
      evaluate: ({ arrangement }) => {
        const dropoutIndex = arrangement.findIndex(
          (bar) => !bar.drums && (bar.bass || bar.chords || bar.melody),
        );
        return [
          {
            label: "A musical bar exists without drums",
            complete: dropoutIndex >= 0,
          },
          {
            label: "The next bar brings the drums back",
            complete:
              dropoutIndex >= 0 &&
              dropoutIndex < arrangement.length - 1 &&
              arrangement[dropoutIndex + 1].drums,
          },
          {
            label: "A later bar reaches at least three layers",
            complete:
              dropoutIndex >= 0 &&
              arrangement
                .slice(dropoutIndex + 1)
                .some((bar) => activeLayers(bar) >= 3),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "genre.house.d",
        letter: "D",
        title: "Let the kick make room",
        learn: "Use subtle sidechain as a rhythmic relationship, then compare it directly with bypass.",
        explanation:
          "Sidechain compression is common in house because the kick repeats predictably and the bass often occupies the same low-frequency region. Heavy pumping is one aesthetic; small gain reduction can simply clarify the pulse.",
        instruction:
          "With the track looping, switch sidechain off and on. Leave it on with 2–6 dB of ducking and a release between 80 and 280 ms. Choose the weakest setting that still makes the kick easier to locate against the bass.",
        recognition:
          "When you bypass it, does the groove lose motion, lose clarity, or barely change? That answer matters more than the fact that sidechain is common in the genre.",
        terms: [
          { term: "Sidechain", definition: "Using one signal, here the kick, to control processing on another signal, here the bass." },
          { term: "Ducking", definition: "Temporarily reducing the level of one sound when another sound occurs." },
          { term: "Release", definition: "How quickly the gain reduction returns to normal after the trigger." },
        ],
        workspace: "sidechain",
        checksLabel: "Compare ducking with bypass",
        successLabel: "The kick/bass relationship now has a deliberate amount of breathing room",
      }),
      evaluate: ({ sidechainSettings, experiments }) => [
        {
          label: "You compared sidechain on and off",
          complete:
            experiments["sidechain.enabled"]?.values.includes("true") === true &&
            experiments["sidechain.enabled"]?.values.includes("false") === true,
        },
        {
          label: "Sidechain is left on",
          complete: sidechainSettings.enabled,
        },
        {
          label: "Ducking is subtle to moderate",
          complete:
            sidechainSettings.amountDb >= 2 &&
            sidechainSettings.amountDb <= 6,
        },
        {
          label: "Release is between 80 and 280 ms",
          complete:
            sidechainSettings.release >= 0.08 &&
            sidechainSettings.release <= 0.28,
        },
      ],
    },
  ],
};
