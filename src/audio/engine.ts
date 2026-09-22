import * as Tone from "tone";
import {
  chordMidi,
  clonePattern,
  initialChordProgression,
  initialMelody,
  initialPattern,
  type ChordName,
  type ChordProgression,
  type MelodySequence,
  type StepPattern,
} from "../music/model";

class AudioEngine {
  private pattern: StepPattern = clonePattern(initialPattern);
  private melody: MelodySequence = [...initialMelody];
  private chordProgression: ChordProgression = [...initialChordProgression];

  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hat: Tone.NoiseSynth | null = null;
  private hatFilter: Tone.Filter | null = null;
  private piano: Tone.Synth | null = null;
  private chordSynth: Tone.PolySynth | null = null;

  private eventId: number | null = null;
  private step = 0;
  private onStep: ((step: number) => void) | null = null;

  setPattern(pattern: StepPattern) {
    this.pattern = clonePattern(pattern);
  }

  setMelody(melody: MelodySequence) {
    this.melody = [...melody];
  }

  setChordProgression(chords: ChordProgression) {
    this.chordProgression = [...chords];
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  private ensureVoices() {
    if (!this.kick) {
      this.kick = new Tone.MembraneSynth({
        pitchDecay: 0.035,
        octaves: 6,
        envelope: { attack: 0.001, decay: 0.24, sustain: 0, release: 0.08 },
      }).toDestination();

      this.snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.02 },
      }).toDestination();
      this.snare.volume.value = -7;

      this.hatFilter = new Tone.Filter(6800, "highpass").toDestination();
      this.hat = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.025, sustain: 0, release: 0.01 },
      }).connect(this.hatFilter);
      this.hat.volume.value = -15;
    }

    if (!this.piano) {
      this.piano = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.006, decay: 0.32, sustain: 0.18, release: 0.8 },
      }).toDestination();
      this.piano.volume.value = -8;
    }

    if (!this.chordSynth) {
      this.chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.28, release: 1.1 },
      }).toDestination();
      this.chordSynth.volume.value = -11;
    }
  }

  private clearEvent() {
    if (this.eventId !== null) {
      Tone.getTransport().clear(this.eventId);
      this.eventId = null;
    }
  }

  private async prepare(bpm: number, onStep: (step: number) => void) {
    await Tone.start();
    this.ensureVoices();

    const transport = Tone.getTransport();
    transport.stop();
    this.clearEvent();
    transport.position = 0;
    transport.bpm.value = bpm;
    this.step = 0;
    this.onStep = onStep;
  }

  async playDrums(bpm: number, onStep: (step: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;

      if (this.pattern.kick[step]) {
        this.kick?.triggerAttackRelease("C1", "16n", time, 0.95);
      }
      if (this.pattern.snare[step]) {
        this.snare?.triggerAttackRelease("16n", time, 0.5);
      }
      if (this.pattern.hat[step]) {
        this.hat?.triggerAttackRelease("32n", time, 0.22);
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % 16;
    }, "16n");

    transport.start();
  }

  async playMelody(bpm: number, onStep: (step: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;
      const midi = this.melody[step];

      if (midi !== null) {
        const note = Tone.Frequency(midi, "midi").toNote();
        this.piano?.triggerAttackRelease(note, "8n", time, 0.72);
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % this.melody.length;
    }, "8n");

    transport.start();
  }

  async playChords(bpm: number, onStep: (step: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;
      const chord = this.chordProgression[step];

      if (chord) {
        const notes = chordMidi[chord].map((midi) => Tone.Frequency(midi, "midi").toNote());
        this.chordSynth?.triggerAttackRelease(notes, "1m", time, 0.6);
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % this.chordProgression.length;
    }, "1m");

    transport.start();
  }

  async playPianoNote(midi: number) {
    await Tone.start();
    this.ensureVoices();
    this.piano?.triggerAttackRelease(Tone.Frequency(midi, "midi").toNote(), "8n", undefined, 0.7);
  }

  async playChord(chord: ChordName) {
    await Tone.start();
    this.ensureVoices();
    const notes = chordMidi[chord].map((midi) => Tone.Frequency(midi, "midi").toNote());
    this.chordSynth?.triggerAttackRelease(notes, "1n", undefined, 0.58);
  }

  stop() {
    const transport = Tone.getTransport();
    transport.stop();
    transport.position = 0;
    this.clearEvent();
    this.step = 0;
    this.onStep?.(0);
  }
}

export const audioEngine = new AudioEngine();
