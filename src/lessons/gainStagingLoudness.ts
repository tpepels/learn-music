import { mixerTrackIds } from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function volumes(settings: Record<string, { volume: number }>) {
  return mixerTrackIds.map((track) => settings[track].volume);
}

function averageVolume(settings: Record<string, { volume: number }>) {
  const values = volumes(settings);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const lesson = lessonContentSchema.parse({
  id: "production.gain-staging-loudness",
  number: 32,
  title: "Gain staging, headroom & loudness",
  eyebrow: "Production · Levels",
  hero: "Make room before you make it loud.",
  description:
    "Build a mix with deliberate headroom, rebalance it without chasing zero, then use level-matched A/B comparison to separate genuine improvement from the simple appeal of a louder version.",
  overview:
    "A fader near 0 dB is not a quality target. Leaving level in reserve makes later processing safer, while level matching prevents louder playback from disguising weak decisions as improvements.",
});

export const gainStagingLoudnessLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.gain-staging-loudness.a",
        letter: "A",
        title: "Create headroom",
        learn: "Stop treating 0 dB on every channel as the default finishing point.",
        explanation:
          "When several tracks sum together, individually safe signals can still create a crowded master bus. Pulling channels down gives the mix room for peaks and later processing.",
        instruction:
          "While the arrangement plays, pull all four channel faders to -6 dB or lower. Listen to the whole track at that lower internal level rather than compensating by pushing the channels back up.",
        recognition:
          "The mix may sound quieter, but did its balance actually get worse? Separate level from quality before making the next decision.",
        terms: [
          { term: "Gain staging", definition: "Managing signal level through each stage of an audio path." },
          { term: "Headroom", definition: "Level available between current peaks and the system's maximum level." },
          { term: "Clipping", definition: "Distortion caused when a signal exceeds the available level range." },
        ],
        workspace: "mixer",
        checksLabel: "Make room",
        successLabel: "Every channel now leaves deliberate level in reserve",
      }),
      evaluate: ({ mixerSettings, experiments }) => {
        const values = volumes(mixerSettings);
        return [
          { label: "Every channel is at -6 dB or lower", complete: values.every((value) => value <= -6) },
          { label: "You listened at the lower internal level", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.gain-staging-loudness.b",
        letter: "B",
        title: "Rebalance without spending all the headroom",
        learn: "Use relative level differences while keeping the whole mix comfortably below the top of the faders.",
        explanation:
          "Balance comes from relationships between tracks, not from pushing the loudest track to zero. A mix can have clear foreground and background while every channel remains below unity.",
        instruction:
          "Keep every fader at -3 dB or lower. Create at least a 3 dB difference between the loudest and quietest channels and use at least three different fader values. Play the arrangement while you decide which layer deserves the foreground.",
        recognition:
          "Can you still identify foreground, support and low-end foundation even though none of the channels reaches 0 dB?",
        terms: [
          { term: "Relative level", definition: "The level relationship between one signal and another." },
          { term: "Unity gain", definition: "A 0 dB gain setting that neither raises nor lowers level." },
          { term: "Hierarchy", definition: "The ordering of parts by perceptual importance." },
        ],
        workspace: "mixer",
        checksLabel: "Balance below zero",
        successLabel: "The mix has hierarchy without giving up all its headroom",
      }),
      evaluate: ({ mixerSettings, experiments }) => {
        const values = volumes(mixerSettings);
        return [
          { label: "No channel is above -3 dB", complete: values.every((value) => value <= -3) },
          { label: "The fader spread is at least 3 dB", complete: Math.max(...values) - Math.min(...values) >= 3 },
          { label: "At least three distinct fader values are used", complete: new Set(values).size >= 3 },
          { label: "You listened to the resulting hierarchy", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.gain-staging-loudness.c",
        letter: "C",
        title: "Make louder win on purpose",
        learn: "Hear loudness bias directly before trying to remove it.",
        explanation:
          "A slightly louder version often feels fuller and more exciting even when nothing else improved. Demonstrating that bias deliberately makes later A/B decisions more trustworthy.",
        instruction:
          "Capture the current mix as a reference. Then raise the live mix so its average channel level is at least 2 dB louder than the snapshot. Switch A/B at least twice before deciding what actually changed besides level.",
        recognition:
          "Did the louder version initially feel better? Name one difference that remains after you stop thinking about loudness.",
        terms: [
          { term: "Loudness bias", definition: "The tendency to prefer a louder version in a comparison." },
          { term: "A/B comparison", definition: "Switching repeatedly between two states to judge a production change." },
          { term: "Reference snapshot", definition: "A stored mix state used as a stable comparison point." },
        ],
        workspace: "reference",
        checksLabel: "Expose the bias",
        successLabel: "You heard how level alone can influence preference",
      }),
      evaluate: ({ mixerSettings, referenceMixSettings, experiments }) => {
        const snapshot = referenceMixSettings.snapshot;
        const louder =
          snapshot !== null &&
          averageVolume(mixerSettings) - averageVolume(snapshot.mixerSettings) >= 2;
        return [
          { label: "A reference snapshot exists", complete: snapshot !== null },
          { label: "The live mix is at least 2 dB louder on average", complete: louder },
          { label: "You made at least two A/B comparisons", complete: changedControl(experiments, "reference.compare", 2) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.gain-staging-loudness.d",
        letter: "D",
        title: "Level-match before judging",
        learn: "Remove the easy loudness advantage and listen for actual production differences.",
        explanation:
          "A fair comparison needs approximately equal level. Once the gain difference is removed, decisions about tone, width, dynamics and hierarchy become easier to separate from simple loudness preference.",
        instruction:
          "Use the level-match guide in the Reference workspace and bring the reference trim within 1 dB of the suggested match. Make at least three A/B comparisons and perform the quiet-listening check before choosing a version.",
        recognition:
          "After level matching, does the preference survive? If not, the original judgement was mostly a level judgement.",
        terms: [
          { term: "Level matching", definition: "Adjusting compared sources to similar playback level before evaluating them." },
          { term: "Perceived loudness", definition: "How loud a sound seems to a listener, which is not identical to its peak level." },
          { term: "Quiet check", definition: "Listening at low playback level to reveal musical hierarchy without loudness excitement." },
        ],
        workspace: "reference",
        checksLabel: "Make the comparison fair",
        successLabel: "Your final judgement is no longer based on a simple loudness advantage",
      }),
      evaluate: ({ mixerSettings, referenceMixSettings, experiments }) => {
        const snapshot = referenceMixSettings.snapshot;
        const suggested = snapshot
          ? averageVolume(mixerSettings) - averageVolume(snapshot.mixerSettings)
          : 0;
        return [
          { label: "A reference snapshot exists", complete: snapshot !== null },
          {
            label: "Reference trim is within 1 dB of the level-match guide",
            complete:
              snapshot !== null &&
              Math.abs(referenceMixSettings.trimDb - suggested) <= 1,
          },
          { label: "At least three A/B comparisons were made", complete: changedControl(experiments, "reference.compare", 3) },
          { label: "Quiet listening was checked", complete: referenceMixSettings.quietChecked },
        ];
      },
    },
  ],
};
