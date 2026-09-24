import { useEffect, useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  borrowedMajorPalette,
  chordMidi,
  chordSymbol,
  diatonicPalette,
  keyLabel,
  minorHarmonyPalette,
  romanNumeral,
  type HarmonicChord,
  type TonalMode,
} from "../music/harmony";
import { midiNoteName } from "../music/model";
import { useStudioStore } from "../state/studio";
import { HarmonyKeyControl } from "./HarmonyKeyControl";

type Mode = "minor" | "sevenths" | "borrowed";

const configs = {
  minor: {
    eyebrow: "Minor harmony · chord track",
    title: "Write in a minor key",
    hint: "Natural-minor chords stay available while V7 can introduce the raised leading tone.",
  },
  sevenths: {
    eyebrow: "Seventh chords · chord track",
    title: "Add one more chord tone",
    hint: "A seventh chord adds another third above a triad, changing colour and voice-leading.",
  },
  borrowed: {
    eyebrow: "Modal mixture · chord track",
    title: "Borrow colour from the parallel minor",
    hint: "The tonic stays major while iv or ♭VII is borrowed from the parallel minor.",
  },
} as const;

export function AdvancedHarmonyWorkspace({ mode }: { mode: Mode }) {
  const progression = useStudioStore((state) => state.harmonicProgression);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setTonalContext = useStudioStore((state) => state.setTonalContext);
  const setHarmonicSlot = useStudioStore((state) => state.setHarmonicSlot);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const config = configs[mode];

  useEffect(() => {
    if (mode === "minor" && tonalContext.mode === "major") {
      setTonalContext({ tonic: 9, mode: "natural-minor" });
    } else if (
      (mode === "sevenths" || mode === "borrowed") &&
      tonalContext.mode !== "major"
    ) {
      setTonalContext({ tonic: 0, mode: "major" });
    }
  }, [mode, setTonalContext]);

  const palette: HarmonicChord[] =
    mode === "minor"
      ? minorHarmonyPalette(tonalContext)
      : mode === "sevenths"
        ? diatonicPalette(tonalContext, true)
        : borrowedMajorPalette(tonalContext);
  const modes: readonly TonalMode[] =
    mode === "minor"
      ? ["natural-minor", "harmonic-minor"]
      : mode === "borrowed"
        ? ["major"]
        : ["major", "natural-minor", "harmonic-minor"];

  const choose = async (chord: HarmonicChord) => {
    setHarmonicSlot(selectedSlot, chord);
    await audioEngine.playChordPreview(chord);
  };

  return (
    <div className="advanced-harmony-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <div className="daw-strip">
            <span>KEY {keyLabel(tonalContext).toUpperCase()}</span>
            <span>1 CHORD / BAR</span>
            <span>{mode === "sevenths" ? "4 NOTES" : "FUNCTION + COLOUR"}</span>
          </div>
        </div>
        <span className="workspace-hint">{config.hint}</span>
      </div>

      <HarmonyKeyControl modes={modes} />

      <div className="advanced-chord-slots">
        {progression.map((chord, slot) => (
          <button
            key={slot}
            className={[
              selectedSlot === slot ? "is-selected" : "",
              isPlaying && currentStep === slot ? "is-playhead" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => setSelectedSlot(slot)}
          >
            <span>Bar {slot + 1}</span>
            <strong>{chord ? chordSymbol(chord, tonalContext) : "—"}</strong>
            <small>{chord ? romanNumeral(chord, tonalContext) : "choose chord"}</small>
          </button>
        ))}
      </div>

      <div className="advanced-chord-palette">
        {palette.map((chord) => {
          const symbol = chordSymbol(chord, tonalContext);
          const numeral = romanNumeral(chord, tonalContext);
          return (
            <button
              key={numeral + ":" + symbol}
              onClick={() => void choose(chord)}
            >
              <strong>{symbol}</strong>
              <span>{numeral}</span>
              <small>{chordMidi(chord, tonalContext).map(midiNoteName).join(" · ")}</small>
            </button>
          );
        })}
      </div>

      <button
        className="chord-clear-button"
        onClick={() => setHarmonicSlot(selectedSlot, null)}
        disabled={progression[selectedSlot] === null}
      >
        Clear selected chord
      </button>
    </div>
  );
}
