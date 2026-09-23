import { changedRange } from "./learningEvidence";
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
  hero: "Make the bass move around the kick.",
  description:
    "Let the kick push the bass down for a moment, exaggerate the motion until it is impossible to miss, then bring it back into the groove.",
  overview:
    "The kick is not being made louder. Instead, every kick tells the bass to dip and recover. How deep that dip is and how long the bass takes to return determines whether you hear cleaner low end or an obvious rhythmic pump.",
});

export const sidechainLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.sidechain.a",
        letter: "A",
        title: "Create low-end separation",
        learn: "Hear what changes when the bass gets out of the kick's way for a moment.",
        explanation:
          "When kick and bass arrive together, their low end can blur into one event. A short dip in the bass can make the kick read more clearly without turning the bass down for the whole bar.",
        instruction:
          "Loop the track. Turn sidechain on, off, and on again. While it is on, sweep Release from clearly short to clearly long, then settle on a moderate duck where the kick separates but the bass still feels continuous.",
        recognition:
          "Listen to the start of each kick. With sidechain off, do kick and bass arrive as one lump? With it on, can you hear the kick edge without hearing an obvious hole in the bass?",
        terms: [
          { term: "Sidechain", definition: "A control path where one signal influences processing applied to another signal." },
          { term: "Key input", definition: "The signal that triggers a dynamics processor; here, the kick." },
          { term: "Ducking", definition: "Temporarily reducing one signal in response to another." },
        ],
        workspace: "sidechain",
        checksLabel: "Make room for each kick",
        successLabel: "Kick-triggered bass ducking is now musically moderate",
      }),
      evaluate: ({ A, sidechainSettings, experiments }) => [
        { label: "You listened to sidechain in the track", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "Pattern A contains at least four kick hits", complete: A.kick.filter(Boolean).length >= 4 },
        {
          label: "You compared sidechain on and off",
          complete:
            experiments["sidechain.enabled"]?.values.includes("true") === true &&
            experiments["sidechain.enabled"]?.values.includes("false") === true,
        },
        {
          label: "You explored release timing before settling",
          complete: changedRange(
            experiments,
            "sidechain.release",
            0.15,
          ),
        },
        { label: "Sidechain is enabled", complete: sidechainSettings.enabled },
        { label: "Final duck is moderate", complete: sidechainSettings.amountDb >= 2 && sidechainSettings.amountDb <= 6 },
        { label: "Final release stays connected to the groove", complete: sidechainSettings.release >= 0.08 && sidechainSettings.release <= 0.35 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.sidechain.b",
        letter: "B",
        title: "Exaggerate the pump",
        learn: "Push the same process until the gain movement becomes part of the rhythm.",
        explanation:
          "A deep duck with a slow recovery turns the bass envelope into something you can almost conduct with your hand. This is the same routing as before; only the amount and timing have crossed from transparent into audible.",
        instruction:
          "Keep the loop running. Push Duck Amount past 8 dB and make Release long enough that the bass clearly swells back between kicks. Move Release around until you can hear its rhythm, not just its loudness.",
        recognition:
          "Follow the bass, not the kick: can you hear it dip, wait, and rise on every trigger?",
        terms: [
          { term: "Pumping", definition: "An audible rise-and-fall in level caused by repeated dynamics gain reduction and recovery." },
          { term: "Release", definition: "How quickly a dynamics processor stops reducing gain after the trigger subsides." },
        ],
        workspace: "sidechain",
        checksLabel: "Make the envelope audible",
        successLabel: "The sidechain is now an obvious rhythmic effect",
      }),
      evaluate: ({ sidechainSettings, experiments }) => [
        { label: "You listened to the exaggerated pump", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
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
        learn: "Keep the separation while making the processing harder to notice.",
        explanation:
          "Once you know what the exaggerated version sounds like, the useful question is how far you can back it off before the kick and bass start masking each other again.",
        instruction:
          "Reduce the pump until it stops calling attention to itself. Toggle sidechain off and on several times while the same section loops. Leave it at the weakest setting that still makes the kick/bass relationship clearer.",
        recognition:
          "When you bypass it, do you miss the separation? When you turn it back on, does the groove still sound like the groove rather than a sidechain demonstration?",
        terms: [
          { term: "Transparent processing", definition: "Processing that achieves its purpose without drawing obvious attention to itself." },
          { term: "A/B comparison", definition: "Switching between two states so a processing decision can be judged directly." },
        ],
        workspace: "sidechain",
        checksLabel: "Keep the benefit, lose the effect",
        successLabel: "The sidechain now behaves like a subtle mix tool",
      }),
      evaluate: ({ sidechainSettings, experiments }) => [
        {
          label: "You compared the subtle version with bypass",
          complete:
            experiments["sidechain.enabled"]?.values.includes("true") === true &&
            experiments["sidechain.enabled"]?.values.includes("false") === true,
        },
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
        title: "Make the duck follow your groove",
        learn: "Use the kick pattern itself to shape when the bass breathes.",
        explanation:
          "Sidechain is a rhythmic relationship. Change the kick and the bass envelope changes with it. That is why the setting only makes sense together with the pattern and arrangement.",
        instruction:
          "Keep a subtle sidechain setting. Make sure at least one arrangement bar contains both drums and bass. While that bar loops, edit the kick at least twice—add or move an offbeat hit, hear the bass react, then keep the kick pattern that gives you the groove you prefer.",
        recognition:
          "Listen to the bass recovery after the kick you moved. Does the new trigger create useful space and motion, or does it make the bass stumble?",
        terms: [
          { term: "Interlock", definition: "Two parts arranged or processed so their timing and spectral roles fit together rather than compete." },
          { term: "Context-dependent processing", definition: "A processing decision whose usefulness depends on what else is happening in the arrangement." },
        ],
        workspace: "sidechain",
        checksLabel: "Connect dynamics to arrangement",
        successLabel: "The sidechain now follows a groove you shaped",
      }),
      evaluate: ({ sidechainSettings, arrangement, experiments }) => [
        { label: "You listened to the kick/bass interaction", complete: (experiments["transport.play"]?.changes ?? 0) >= 1 },
        { label: "You edited the kick while hearing the sidechain response", complete: (experiments["drums.A.kick.edit"]?.changes ?? 0) >= 2 },
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
