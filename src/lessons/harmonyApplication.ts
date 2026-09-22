import {
  chordPitchClasses,
  type ChordProgression,
  type HarmonySequence,
} from "../music/model";

export function harmonyBarSteps(
  sequence: HarmonySequence,
  bar: number,
): number[][] {
  return sequence.slice(bar * 8, bar * 8 + 8);
}

export function harmonyActiveSteps(
  sequence: HarmonySequence,
  bar?: number,
): number {
  const steps = bar === undefined ? sequence : harmonyBarSteps(sequence, bar);
  return steps.filter((notes) => notes.length > 0).length;
}

export function harmonyNoteEvents(sequence: HarmonySequence): number {
  return sequence.reduce((total, notes) => total + notes.length, 0);
}

export function harmonyOffbeats(sequence: HarmonySequence): number {
  return sequence.filter(
    (notes, step) => notes.length > 0 && step % 2 === 1,
  ).length;
}

export function barUsesAllChordTones(
  sequence: HarmonySequence,
  progression: ChordProgression,
  bar: number,
): boolean {
  const chord = progression[bar];
  if (!chord) return false;

  const written = new Set(
    harmonyBarSteps(sequence, bar)
      .flat()
      .map((midi) => ((midi % 12) + 12) % 12),
  );

  return chordPitchClasses(chord).every((pitchClass) =>
    written.has(pitchClass),
  );
}

export function writtenHarmonyFitsChords(
  sequence: HarmonySequence,
  progression: ChordProgression,
): boolean {
  let found = false;

  for (let step = 0; step < sequence.length; step += 1) {
    const notes = sequence[step] ?? [];
    if (notes.length === 0) continue;
    found = true;

    const chord = progression[Math.floor(step / 8)];
    if (!chord) return false;
    const allowed = chordPitchClasses(chord);

    if (
      notes.some(
        (midi) => !allowed.includes(((midi % 12) + 12) % 12),
      )
    ) {
      return false;
    }
  }

  return found;
}

export function everyActiveBarWritten(
  sequence: HarmonySequence,
  progression: ChordProgression,
  requireEveryTone = false,
): boolean {
  return progression.every((chord, bar) => {
    if (!chord) return false;
    if (requireEveryTone) {
      return barUsesAllChordTones(sequence, progression, bar);
    }
    return harmonyActiveSteps(sequence, bar) > 0;
  });
}
