import * as Tone from "tone";
import {
  chordMidi,
  cloneArrangement,
  cloneMixerSettings,
  clonePattern,
  initialArrangement,
  initialChordProgression,
  initialMelody,
  initialMixerSettings,
  initialPattern,
  initialSynthSettings,
  mixerTrackIds,
  type Arrangement,
  type ChordName,
  type ChordProgression,
  type MelodySequence,
  type MixerSettings,
  type MixerTrackId,
  type StepPattern,
  type SynthSettings,
} from "../music/model";

class AudioEngine {
  private pattern: StepPattern = clonePattern(initialPattern);
  private melody: MelodySequence = [...initialMelody];
  private chordProgression: ChordProgression = [...initialChordProgression];
  private arrangement: Arrangement = cloneArrangement(initialArrangement);
  private synthSettings: SynthSettings = { ...initialSynthSettings };
  private mixerSettings: MixerSettings = cloneMixerSettings(initialMixerSettings);

  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hat: Tone.NoiseSynth | null = null;
  private hatFilter: Tone.Filter | null = null;
  private piano: Tone.Synth | null = null;
  private chordSynth: Tone.PolySynth | null = null;
  private bassSynth: Tone.MonoSynth | null = null;
  private soundFilter: Tone.Filter | null = null;
  private soundSynth: Tone.Synth | null = null;

  private mixerFilters: Partial<Record<MixerTrackId, Tone.Filter>> = {};
  private mixerChannels: Partial<Record<MixerTrackId, Tone.Channel>> = {};
  private reverbSends: Partial<Record<MixerTrackId, Tone.Gain>> = {};
  private delaySends: Partial<Record<MixerTrackId, Tone.Gain>> = {};
  private mixReverb: Tone.Reverb | null = null;
  private mixDelay: Tone.FeedbackDelay | null = null;

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

  setArrangement(arrangement: Arrangement) {
    this.arrangement = cloneArrangement(arrangement);
  }

  setSynthSettings(settings: SynthSettings) {
    this.synthSettings = { ...settings };
    this.applySynthSettings();
  }

  setMixerSettings(settings: MixerSettings) {
    this.mixerSettings = cloneMixerSettings(settings);
    this.applyMixerSettings();
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  private ensureMixerGraph() {
    if (!this.mixReverb) {
      this.mixReverb = new Tone.Reverb({
        decay: 2.7,
        preDelay: 0.015,
        wet: 1,
      }).toDestination();
      this.mixReverb.volume.value = -6;
    }

    if (!this.mixDelay) {
      this.mixDelay = new Tone.FeedbackDelay("8n", 0.28).toDestination();
      this.mixDelay.wet.value = 1;
      this.mixDelay.volume.value = -9;
    }

    mixerTrackIds.forEach((track) => {
      if (this.mixerFilters[track]) return;

      const filter = new Tone.Filter(20, "highpass");
      const channel = new Tone.Channel({
        volume: 0,
        pan: 0,
      }).toDestination();
      const reverbSend = new Tone.Gain(0).connect(this.mixReverb!);
      const delaySend = new Tone.Gain(0).connect(this.mixDelay!);

      filter.connect(channel);
      channel.connect(reverbSend);
      channel.connect(delaySend);

      this.mixerFilters[track] = filter;
      this.mixerChannels[track] = channel;
      this.reverbSends[track] = reverbSend;
      this.delaySends[track] = delaySend;
    });

    this.applyMixerSettings();
  }

  private inputFor(track: MixerTrackId): Tone.Filter {
    this.ensureMixerGraph();
    const input = this.mixerFilters[track];
    if (!input) {
      throw new Error("Mixer input was not created for " + track);
    }
    return input;
  }

  private ensureVoices() {
    this.ensureMixerGraph();

    if (!this.kick) {
      this.kick = new Tone.MembraneSynth({
        pitchDecay: 0.035,
        octaves: 6,
        envelope: { attack: 0.001, decay: 0.24, sustain: 0, release: 0.08 },
      }).connect(this.inputFor("drums"));

      this.snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.02 },
      }).connect(this.inputFor("drums"));
      this.snare.volume.value = -7;

      this.hatFilter = new Tone.Filter(6800, "highpass").connect(this.inputFor("drums"));
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
      }).connect(this.inputFor("melody"));
      this.piano.volume.value = -8;
    }

    if (!this.chordSynth) {
      this.chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.28, release: 1.1 },
      }).connect(this.inputFor("chords"));
      this.chordSynth.volume.value = -11;
    }

    if (!this.bassSynth) {
      this.bassSynth = new Tone.MonoSynth({
        oscillator: { type: "square" },
        filter: { type: "lowpass", Q: 1, rolloff: -24 },
        filterEnvelope: {
          attack: 0.01,
          decay: 0.15,
          sustain: 0.15,
          release: 0.5,
          baseFrequency: 90,
          octaves: 2.2,
        },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.35 },
      }).connect(this.inputFor("bass"));
      this.bassSynth.volume.value = -13;
    }

    if (!this.soundFilter) {
      this.soundFilter = new Tone.Filter(this.synthSettings.cutoff, "lowpass").toDestination();
    }

    if (!this.soundSynth) {
      this.soundSynth = new Tone.Synth({
        oscillator: { type: this.synthSettings.waveform },
        envelope: {
          attack: this.synthSettings.attack,
          decay: 0.2,
          sustain: 0.6,
          release: this.synthSettings.release,
        },
      }).connect(this.soundFilter);
      this.soundSynth.volume.value = -8;
    }

    this.applySynthSettings();
    this.applyMixerSettings();
  }

  private applySynthSettings() {
    if (this.soundFilter) {
      this.soundFilter.frequency.rampTo(this.synthSettings.cutoff, 0.03);
    }

    if (this.soundSynth) {
      this.soundSynth.oscillator.type = this.synthSettings.waveform;
      this.soundSynth.envelope.attack = this.synthSettings.attack;
      this.soundSynth.envelope.release = this.synthSettings.release;
    }
  }

  private applyMixerSettings() {
    mixerTrackIds.forEach((track) => {
      const settings = this.mixerSettings[track];
      const channel = this.mixerChannels[track];
      const filter = this.mixerFilters[track];
      const reverbSend = this.reverbSends[track];
      const delaySend = this.delaySends[track];

      if (channel) {
        channel.volume.rampTo(settings.volume, 0.03);
        channel.pan.rampTo(settings.pan, 0.03);
      }

      if (filter) {
        filter.frequency.rampTo(Math.max(20, settings.highpass), 0.03);
      }

      if (reverbSend) {
        reverbSend.gain.rampTo(settings.reverb, 0.03);
      }

      if (delaySend) {
        delaySend.gain.rampTo(settings.delay, 0.03);
      }
    });
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

  async playArrangement(bpm: number, onStep: (bar: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();
    const totalSteps = this.arrangement.length * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;
      const bar = this.arrangement[barIndex];

      if (bar?.drums) {
        if (this.pattern.kick[localStep]) {
          this.kick?.triggerAttackRelease("C1", "16n", time, 0.9);
        }
        if (this.pattern.snare[localStep]) {
          this.snare?.triggerAttackRelease("16n", time, 0.45);
        }
        if (this.pattern.hat[localStep]) {
          this.hat?.triggerAttackRelease("32n", time, 0.2);
        }
      }

      const chord = this.chordProgression[barIndex % this.chordProgression.length] ?? "C";

      if (bar?.chords && localStep === 0) {
        const notes = chordMidi[chord].map((midi) => Tone.Frequency(midi, "midi").toNote());
        this.chordSynth?.triggerAttackRelease(notes, "1m", time, 0.48);
      }

      if (bar?.bass && localStep % 4 === 0) {
        const rootMidi = chordMidi[chord][0] - 12;
        this.bassSynth?.triggerAttackRelease(
          Tone.Frequency(rootMidi, "midi").toNote(),
          "8n",
          time,
          0.52,
        );
      }

      if (bar?.melody && localStep % 2 === 0) {
        const melodyStep = localStep / 2;
        const midi = this.melody[melodyStep];

        if (midi !== null && midi !== undefined) {
          this.piano?.triggerAttackRelease(
            Tone.Frequency(midi, "midi").toNote(),
            "8n",
            time,
            0.56,
          );
        }
      }

      if (localStep === 0) {
        Tone.getDraw().schedule(() => this.onStep?.(barIndex), time);
      }

      this.step = (this.step + 1) % totalSteps;
    }, "16n");

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

  async playSynthNote(midi = 60) {
    await Tone.start();
    this.ensureVoices();
    this.applySynthSettings();
    this.soundSynth?.triggerAttackRelease(
      Tone.Frequency(midi, "midi").toNote(),
      "1n",
      undefined,
      0.72,
    );
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
