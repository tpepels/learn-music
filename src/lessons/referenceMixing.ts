import {
  mixerTrackIds,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function averageVolume(settings: Record<string, { volume: number }>) {
  return mixerTrackIds.reduce(
    (sum, track) => sum + settings[track].volume,
    0,
  ) / mixerTrackIds.length;
}

const lesson = lessonContentSchema.parse({
  id: "production.reference-mixing",
  number: 23,
  title: "Reference mixing",
  eyebrow: "Production · Critical listening",
  hero: "Compare versions without letting louder automatically sound better.",
  description:
    "Capture a reference snapshot, change the current mix, level-match the comparison, switch repeatedly, and perform quiet and mono translation checks.",
  overview:
    "Reference work is not copying another mix. It is a controlled comparison that resets perspective. Loudness must be matched closely because louder audio is often perceived as more impressive even when the balance is worse.",
});

export const referenceMixingLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "production.reference-mixing.a",
        letter: "A",
        title: "Capture a known version",
        learn: "Create a fixed comparison point before changing more parameters.",
        explanation:
          "Mixing is difficult because your ears adapt quickly. A stored reference snapshot lets you return to an earlier state instead of relying on memory for how the mix sounded several minutes ago.",
        instruction:
          "Press CAPTURE REFERENCE. The snapshot stores faders, EQ, saturation, and stereo widths from the current project.",
        recognition:
          "Nothing needs to sound different yet—the important thing is that one version is now fixed while the live project remains editable.",
        terms: [
          { term: "Reference", definition: "A fixed comparison source used to recalibrate listening decisions." },
          { term: "Snapshot", definition: "A stored state of multiple mix parameters captured at one moment." },
          { term: "Auditory memory", definition: "Short-term memory for sound, which is useful but imprecise for detailed mix comparison." },
        ],
        workspace: "reference",
        checksLabel: "Create the B state",
        successLabel: "A fixed mix snapshot is now available for comparison",
      }),
      evaluate: ({ referenceMixSettings }) => [
        {
          label: "Reference snapshot has been captured",
          complete: referenceMixSettings.snapshot !== null,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.reference-mixing.b",
        letter: "B",
        title: "Make a real difference, then A/B it",
        learn: "Use comparison to judge a change instead of trusting the excitement of the latest edit.",
        explanation:
          "A/B comparison is useful only when A and B genuinely differ. After changing the live mix, repeated switching helps reveal whether the change actually improves hierarchy or merely sounds novel.",
        instruction:
          "After capturing the reference, change at least one channel fader by 2 dB or more. Use the A / PROJECT and B / REFERENCE buttons at least once.",
        recognition:
          "The difference should be immediate enough to compare, but your judgement should come from repeated switching rather than from assuming the new version is better.",
        terms: [
          { term: "A/B", definition: "Rapidly switching between two states to compare one production decision against another." },
          { term: "Recency bias", definition: "The tendency to overvalue the most recent version simply because it is new." },
        ],
        workspace: "reference",
        checksLabel: "Create a meaningful comparison",
        successLabel: "The current mix now differs from the stored snapshot and has been A/B tested",
      }),
      evaluate: ({ mixerSettings, referenceMixSettings }) => {
        const snapshot = referenceMixSettings.snapshot;
        const changed = snapshot
          ? mixerTrackIds.some(
              (track) =>
                Math.abs(
                  mixerSettings[track].volume -
                    snapshot.mixerSettings[track].volume,
                ) >= 2,
            )
          : false;
        return [
          {
            label: "At least one fader differs by 2 dB or more",
            complete: changed,
          },
          {
            label: "At least one A/B comparison has been made",
            complete: referenceMixSettings.comparisons >= 1,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.reference-mixing.c",
        letter: "C",
        title: "Level-match before judging",
        learn: "Remove loudness advantage from an A/B comparison.",
        explanation:
          "Human listeners often prefer the slightly louder version. Level matching reduces that bias so tonal balance, clarity, width, and dynamics can be compared more fairly.",
        instruction:
          "Use LEVEL-MATCH GUIDE and press MATCH. Then switch A/B until you have made at least three comparisons.",
        recognition:
          "Neither version should win simply by being globally louder; differences in balance and processing should become easier to focus on.",
        terms: [
          { term: "Level matching", definition: "Adjusting comparison sources to approximately equal perceived loudness before judging them." },
          { term: "Loudness bias", definition: "The tendency for a louder version to seem fuller or better even when the underlying change is not an improvement." },
        ],
        workspace: "reference",
        checksLabel: "Remove the louder-is-better bias",
        successLabel: "The reference is level-matched closely enough for a disciplined comparison",
      }),
      evaluate: ({ mixerSettings, referenceMixSettings }) => {
        const snapshot = referenceMixSettings.snapshot;
        if (!snapshot) {
          return [
            { label: "Reference exists", complete: false },
            { label: "Reference trim matches the guide", complete: false },
            { label: "At least three comparisons have been made", complete: false },
          ];
        }
        const suggested =
          averageVolume(mixerSettings) -
          averageVolume(snapshot.mixerSettings);
        return [
          {
            label: "Reference exists",
            complete: true,
          },
          {
            label: "Reference trim is within 1 dB of the level-match guide",
            complete:
              Math.abs(referenceMixSettings.trimDb - suggested) <= 1,
          },
          {
            label: "At least three comparisons have been made",
            complete: referenceMixSettings.comparisons >= 3,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "production.reference-mixing.d",
        letter: "D",
        title: "Check translation, not just excitement",
        learn: "Use quiet playback and mono as two fast ways to reveal hierarchy problems.",
        explanation:
          "Quiet listening reduces the emotional effect of loud playback and makes foreground/background balance obvious. Mono removes stereo separation. If the mix still communicates under both constraints, its hierarchy is more likely to translate.",
        instruction:
          "Perform the QUIET PLAYBACK CHECK, make sure you have also used CHECK IN MONO in the stereo lesson, and reach at least four A/B comparisons.",
        recognition:
          "At low level you should still identify the important parts. In mono, the mix should narrow but remain intelligible.",
        terms: [
          { term: "Translation check", definition: "Testing a mix under different playback conditions to reveal balances that depend on one listening setup." },
          { term: "Quiet check", definition: "Auditioning at low playback level to assess musical hierarchy without loudness excitement." },
          { term: "Perspective reset", definition: "A listening technique that reduces adaptation and helps the mixer hear the project more freshly." },
        ],
        workspace: "reference",
        checksLabel: "Test the mix under constraints",
        successLabel: "Reference, quiet, and mono checks now form a repeatable review workflow",
      }),
      evaluate: ({ referenceMixSettings, stereoSettings }) => [
        {
          label: "Quiet playback has been checked",
          complete: referenceMixSettings.quietChecked,
        },
        {
          label: "Mono compatibility has been checked",
          complete: stereoSettings.monoChecked,
        },
        {
          label: "At least four A/B comparisons have been made",
          complete: referenceMixSettings.comparisons >= 4,
        },
      ],
    },
  ],
};
