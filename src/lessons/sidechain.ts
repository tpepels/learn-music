import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "production.sidechain",
  number: 21,
  title: "Sidechain ducking",
  eyebrow: "Production · Dynamics",
  hero: "Let the kick and bass take turns.",
  description:
    "Use the kick as a trigger that temporarily lowers the bass channel. Explore subtle low-end separation, exaggerated pumping, and release timing.",
  overview:
    "A sidechain is an external control signal. A compressor can listen to one signal while changing another. Here the kick is the key input and the bass is the target: every kick event creates a short bass-volume dip followed by recovery.",
});

export const sidechainLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.sidechain.a",
        letter: "A",
        title: "Create low-end separation",
        learn: "Use a moderate kick-triggered duck so kick and bass do not peak at exactly the same moment.",
        explanation:
          "Kick and bass often share low-frequency space. Ducking the bass briefly when the kick arrives can create room without changing either pattern or permanently lowering the bass.",
        instruction:
          "Make sure Pattern A contains at least four kicks. Turn sidechain ON, set Duck Amount between 3 and 6 dB, and Release between 120 and 300 ms.",
        recognition:
          "The kick should become easier to distinguish while the bass still feels continuous between kicks.",
        terms: [
          { term: "Sidechain", definition: "A control path where one signal influences processing applied to another signal." },
          { term: "Key input", definition: "The signal that triggers a dynamics processor; here, the kick." },
          { term: "Ducking", definition: "Temporarily reducing one signal in response to another." },
        ],
        workspace: "sidechain",
        checksLabel: "Make room for each kick",
        successLabel: "Kick-triggered bass ducking is now musically moderate",
      }),
      evaluate: ({ A, sidechainSettings }) => [
        {
          label: "Pattern A contains at least four kick hits",
          complete: A.kick.filter(Boolean).length >= 4,
        },
        {
          label: "Sidechain is enabled",
          complete: sidechainSettings.enabled,
        },
        {
          label: "Duck amount is 3–6 dB",
          complete:
            sidechainSettings.amountDb >= 3 &&
            sidechainSettings.amountDb <= 6,
        },
        {
          label: "Release is 120–300 ms",
          complete:
            sidechainSettings.release >= 0.12 &&
            sidechainSettings.release <= 0.3,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.sidechain.b",
        letter: "B",
        title: "Exaggerate the pump",
        learn: "Push sidechain settings far enough that the envelope becomes a rhythmic effect.",
        explanation:
          "Sidechain can be transparent, but electronic producers also exaggerate it deliberately. A deep reduction with a slower recovery makes the whole bass envelope appear to breathe around the kick.",
        instruction:
          "Keep sidechain ON. Set Duck Amount to at least 8 dB and Release to at least 350 ms.",
        recognition:
          "You should hear an obvious pumping motion rather than only improved kick clarity.",
        terms: [
          { term: "Pumping", definition: "An audible rise-and-fall in level caused by repeated dynamics gain reduction and recovery." },
          { term: "Release", definition: "How quickly a dynamics processor stops reducing gain after the trigger subsides." },
        ],
        workspace: "sidechain",
        checksLabel: "Make the envelope audible",
        successLabel: "The sidechain is now an obvious rhythmic effect",
      }),
      evaluate: ({ sidechainSettings }) => [
        {
          label: "Sidechain is enabled",
          complete: sidechainSettings.enabled,
        },
        {
          label: "Duck is at least 8 dB",
          complete: sidechainSettings.amountDb >= 8,
        },
        {
          label: "Release is at least 350 ms",
          complete: sidechainSettings.release >= 0.35,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.sidechain.c",
        letter: "C",
        title: "Back it off to transparency",
        learn: "Return from the exaggerated demonstration to settings that solve a mix problem without dominating the groove.",
        explanation:
          "Extreme settings are useful for learning because they reveal what a parameter does. Mixing often means backing the parameter down until the benefit remains but the processing itself is no longer the main event.",
        instruction:
          "Reduce Duck Amount to 2–5 dB and Release to 100–250 ms.",
        recognition:
          "You should miss the clarity when bypassing sidechain, but not immediately hear 'pumping' when it is enabled.",
        terms: [
          { term: "Transparent processing", definition: "Processing that achieves its purpose without drawing obvious attention to itself." },
          { term: "A/B comparison", definition: "Switching between two states so a processing decision can be judged directly." },
        ],
        workspace: "sidechain",
        checksLabel: "Keep the benefit, lose the effect",
        successLabel: "The sidechain now behaves like a subtle mix tool",
      }),
      evaluate: ({ sidechainSettings }) => [
        {
          label: "Duck is 2–5 dB",
          complete:
            sidechainSettings.amountDb >= 2 &&
            sidechainSettings.amountDb <= 5,
        },
        {
          label: "Release is 100–250 ms",
          complete:
            sidechainSettings.release >= 0.1 &&
            sidechainSettings.release <= 0.25,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.sidechain.d",
        letter: "D",
        title: "Use sidechain inside the arrangement",
        learn: "Treat sidechain as a relationship between arrangement layers rather than an isolated compressor trick.",
        explanation:
          "Ducking only matters when kick and bass actually overlap. Production decisions should follow the arrangement: if one layer disappears, the interaction changes too.",
        instruction:
          "Keep sidechain ON with a 2–5 dB duck and 100–250 ms release. In Arrangement, make at least one bar contain both drums and bass.",
        recognition:
          "In bars where kick and bass coexist, the low end should interlock. In bars without both layers, the sidechain relationship should be irrelevant.",
        terms: [
          { term: "Interlock", definition: "Two parts arranged or processed so their timing and spectral roles fit together rather than compete." },
          { term: "Context-dependent processing", definition: "A processing decision whose usefulness depends on what else is happening in the arrangement." },
        ],
        workspace: "sidechain",
        checksLabel: "Connect dynamics to arrangement",
        successLabel: "The ducking now serves a real kick/bass overlap in the track",
      }),
      evaluate: ({ sidechainSettings, arrangement }) => [
        {
          label: "Sidechain remains enabled",
          complete: sidechainSettings.enabled,
        },
        {
          label: "Settings remain in the subtle range",
          complete:
            sidechainSettings.amountDb >= 2 &&
            sidechainSettings.amountDb <= 5 &&
            sidechainSettings.release >= 0.1 &&
            sidechainSettings.release <= 0.25,
        },
        {
          label: "At least one bar contains both drums and bass",
          complete: arrangement.some((bar) => bar.drums && bar.bass),
        },
      ],
    },
  ],
};
