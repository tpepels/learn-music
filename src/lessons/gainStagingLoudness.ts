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
    "Practice leaving level reserve, rebalance without chasing zero, then use an approximate level-compensated A/B comparison to separate genuine improvement from the simple appeal of a louder version.",
  overview:
    "A fader near 0 dB is not a quality target. In a real DAW, headroom is determined by measured signal peaks at each stage - not by one magic fader position. This lab uses fader attenuation as a simplified way to practise leaving reserve, and its A/B guide is an approximation rather than a LUFS or RMS loudness meter.",
});

export const gainStagingLoudnessLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.gain-staging-loudness.a",
        letter: "A",
        title: "Create level reserve",
        learn: "Separate fader gain from measured signal level before thinking about headroom.",
        explanation:
          "A channel fader at 0 dB means unity gain: the fader itself is neither boosting nor attenuating. It does not mean the audio signal is at 0 dBFS. In a digital meter, 0 dBFS is the maximum representable peak level; several channels can sum toward that ceiling even when their faders look ordinary. This lab does not measure real peaks, so lowering every fader is a practice constraint for creating reserve, not a universal headroom rule.",
        instruction:
          "While the arrangement plays, attenuate all four channel faders to -6 dB or lower. Listen to the whole track at that lower internal level. Treat -6 dB as this exercise's comparison point, not as a rule that every real mix must follow.",
        recognition:
          "The mix may sound quieter, but did its balance actually get worse? Separate level from quality before making the next decision.",
        terms: [
          { term: "Gain staging", definition: "Managing signal level through each stage of an audio path." },
          { term: "Unity gain", definition: "A 0 dB gain setting on a fader or gain stage that neither boosts nor attenuates the signal." },
          { term: "dBFS", definition: "Decibels relative to digital full scale; 0 dBFS is the maximum representable digital peak level." },
          { term: "Headroom", definition: "Level available between current measured peaks and the system's maximum level." },
          { term: "Clipping", definition: "Distortion caused when a signal exceeds the available level range." },
        ],
        workspace: "mixer",
        checksLabel: "Make room",
        successLabel: "Every channel is deliberately attenuated for this reserve exercise",
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
        learn: "Use relative level differences without treating unity gain as a target.",
        explanation:
          "Balance comes from relationships between tracks, not from pushing the loudest track to zero. Keeping faders below unity in this exercise preserves the level reserve you created, but actual headroom in a DAW must still be judged from signal meters.",
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
          "You already learned the A/B workflow in Lesson 23. Here you reuse it for a narrower question: what happens when the mix balance stays essentially the same but the entire version is louder? A slightly louder version often feels fuller and more exciting even when nothing else improved. That is loudness bias, not a change in arrangement or balance.",
        instruction:
          "Capture the current mix as a reference. Then raise all four live faders by roughly the same amount so the average channel gain is at least 2 dB above the snapshot while the relative balance stays nearly unchanged. Switch A/B at least twice before deciding what actually changed besides level.",
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
        const deltas = snapshot
          ? mixerTrackIds.map(
              (track) =>
                mixerSettings[track].volume -
                snapshot.mixerSettings[track].volume,
            )
          : [];
        const louder =
          deltas.length > 0 &&
          deltas.reduce((sum, value) => sum + value, 0) / deltas.length >= 2;
        const balancePreserved =
          deltas.length > 0 &&
          Math.max(...deltas) - Math.min(...deltas) <= 1;
        return [
          { label: "A reference snapshot exists", complete: snapshot !== null },
          { label: "The live mix is at least 2 dB louder on average", complete: louder },
          { label: "All four faders moved by nearly the same amount", complete: balancePreserved },
          { label: "You made at least two A/B comparisons", complete: changedControl(experiments, "reference.compare", 2) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.gain-staging-loudness.d",
        letter: "D",
        title: "Compensate level before judging",
        learn: "Reduce the easy level advantage before comparing production differences.",
        explanation:
          "This deliberately repeats the level-compensation habit from Lesson 23 after you have just experienced loudness bias directly. A fair A/B comparison needs similar perceived loudness. This app cannot measure LUFS or RMS, so its guide only estimates a trim from average fader offsets. Use that as a starting point, then trust repeated listening rather than treating the number as a loudness measurement.",
        instruction:
          "Use the approximate level-offset guide in the Reference workspace and bring the reference trim within 1 dB of its suggestion. Make at least three A/B comparisons, perform the quiet-listening check, and listen for any remaining loudness mismatch before judging tone or balance.",
        recognition:
          "After level matching, does the preference survive? If not, the original judgement was mostly a level judgement.",
        terms: [
          { term: "Level matching", definition: "Adjusting compared sources toward similar perceived loudness before evaluating them; normally done with listening and/or real level or loudness measurement." },
          { term: "Perceived loudness", definition: "How loud a sound seems to a listener, which is not identical to its peak level." },
          { term: "Quiet check", definition: "Listening at low playback level to reveal musical hierarchy without loudness excitement." },
        ],
        workspace: "reference",
        checksLabel: "Make the comparison fair",
        successLabel: "You reduced the obvious level advantage before judging the mix",
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
