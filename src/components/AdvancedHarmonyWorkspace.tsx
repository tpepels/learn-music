import { useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  aMinorRomanNumerals,
  borrowedChordNames,
  borrowedRomanNumerals,
  chordMidi,
  midiNoteName,
  minorKeyChordNames,
  seventhChordNames,
  seventhRomanNumerals,
  type ChordName,
} from "../music/model";
import { useStudioStore } from "../state/studio";

type Mode = "minor" | "sevenths" | "borrowed";

const configs = {
  minor: {
    eyebrow: "A minor · chord track",
    title: "Write in a minor key",
    strip: ["KEY A MINOR", "1 CHORD / BAR", "V7 = E7"],
    palette: minorKeyChordNames,
    numeral: aMinorRomanNumerals,
    hint: "Natural-minor chords stay available, but E7 introduces the raised leading tone G♯.",
  },
  sevenths: {
    eyebrow: "Seventh chords · chord track",
    title: "Add one more chord tone",
    strip: ["KEY C MAJOR", "7TH CHORDS", "4 NOTES"],
    palette: seventhChordNames,
    numeral: seventhRomanNumerals,
    hint: "A seventh chord stacks one additional third above a triad, adding colour and smoother voice-leading options.",
  },
  borrowed: {
    eyebrow: "Modal mixture · chord track",
    title: "Borrow colour from the parallel minor",
    strip: ["HOME C MAJOR", "BORROWED iv + ♭VII", "MODAL MIXTURE"],
    palette: borrowedChordNames,
    numeral: borrowedRomanNumerals,
    hint: "The key can remain C major even while an occasional chord is borrowed from C minor.",
  },
} as const;

function chordToneLabel(chord: ChordName): string {
  if (chord === "E7") return "E · G♯ · B · D";
  if (chord === "Fm") return "F · A♭ · C";
  if (chord === "B♭") return "B♭ · D · F";
  return chordMidi[chord].map(midiNoteName).join(" · ");
}

export function AdvancedHarmonyWorkspace({ mode }: { mode: Mode }) {
  const progression = useStudioStore((state) => state.chordProgression);
  const setChordSlot = useStudioStore((state) => state.setChordSlot);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const config = configs[mode];
  const palette = config.palette as readonly ChordName[];
  const numerals = config.numeral as Partial<Record<ChordName, string>>;

  const choose = async (chord: ChordName) => {
    setChordSlot(selectedSlot, chord);
    await audioEngine.playChord(chord);
  };

  return (
    <div className={"advanced-harmony-card harmony-" + mode}>
      <div className="workspace-heading">
        <div>
          <span className="section-label">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <div className="daw-strip">
            {config.strip.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <span className="workspace-hint">{config.hint}</span>
      </div>

      <div className="advanced-chord-slots">
        {progression.map((chord, index) => (
          <button
            key={index}
            className={[
              "advanced-chord-slot",
              selectedSlot === index ? "is-selected" : "",
              isPlaying && currentStep === index ? "is-playhead" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => setSelectedSlot(index)}
          >
            <span>BAR {index + 1}</span>
            <strong>{chord ?? "—"}</strong>
            <small>{chord ? numerals[chord] ?? "colour chord" : "choose chord"}</small>
          </button>
        ))}
      </div>

      <div className="advanced-chord-palette">
        {palette.map((chord) => (
          <button
            key={chord}
            className={progression[selectedSlot] === chord ? "is-active" : ""}
            onClick={() => choose(chord)}
          >
            <strong>{chord}</strong>
            <span>{numerals[chord] ?? "—"}</span>
            <small>{chordToneLabel(chord)}</small>
          </button>
        ))}
      </div>

      <button
        className="chord-clear-button"
        onClick={() => setChordSlot(selectedSlot, null)}
        disabled={progression[selectedSlot] === null}
      >
        Clear selected chord
      </button>

      <div className="advanced-harmony-note">
        {mode === "minor" && (
          <>
            <strong>Why E7 instead of Em?</strong>
            <span>E7 contains G♯. That raised seventh pulls strongly upward to A, giving the minor-key dominant a stronger cadence.</span>
          </>
        )}
        {mode === "sevenths" && (
          <>
            <strong>The seventh changes function less than colour.</strong>
            <span>G and G7 are both dominant chords in C; the added F makes the pull toward C stronger and the voice-leading richer.</span>
          </>
        )}
        {mode === "borrowed" && (
          <>
            <strong>Borrowing does not mean changing key.</strong>
            <span>Fm and B♭ can briefly import notes from C minor while C still feels like the tonal centre.</span>
          </>
        )}
      </div>
    </div>
  );
}
