import * as Tone from "tone";
import {
  BASS_STEPS,
  applyChordTexture,
  chordMidi,
  cloneArrangement,
  cloneAutomationSettings,
  cloneEqSettings,
  cloneGrooveFeelSettings,
  cloneMixerSettings,
  clonePattern,
  cloneReferenceSnapshot,
  cloneSaturationSettings,
  cloneStereoSettings,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialGrooveFeelSettings,
  initialMelody,
  initialMixerSettings,
  initialPattern,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  mixerTrackIds,
  voicedChordMidi,
  type AccompanimentPattern,
  type Arrangement,
  type AutomationSettings,
  type BassSequence,
  type ChordInversion,
  type ChordName,
  type ChordProgression,
  type DynamicsSettings,
  type EffectsSettings,
  type EqSettings,
  type GrooveFeelSettings,
  type MelodySequence,
  type MixerSettings,
  type MixerTrackId,
  type ReferenceSnapshot,
  type SaturationSettings,
  type SidechainSettings,
  type StepPattern,
  type StereoSettings,
  type SynthSettings,
  type TextureSettings,
  type VoicingSettings,
} from "../music/model";

class AudioEngine {
  private pattern: StepPattern = clonePattern(initialPattern);
  private melody: MelodySequence = [...initialMelody];
  private chordProgression: ChordProgression = [...initialChordProgression];
  private accompanimentPattern: AccompanimentPattern = initialAccompanimentPattern;
  private arrangement: Arrangement = cloneArrangement(initialArrangement);
  private synthSettings: SynthSettings = { ...initialSynthSettings };
  private mixerSettings: MixerSettings = cloneMixerSettings(initialMixerSettings);
  private automationSettings: AutomationSettings = cloneAutomationSettings(initialAutomationSettings);
  private dynamicsSettings: DynamicsSettings = { ...initialDynamicsSettings };
  private effectsSettings: EffectsSettings = { ...initialEffectsSettings };
  private grooveFeelSettings: GrooveFeelSettings =
    cloneGrooveFeelSettings(initialGrooveFeelSettings);
  private voicingSettings: VoicingSettings = {
    inversions: [...initialVoicingSettings.inversions],
  };
  private bassSequence: BassSequence = [...initialBassSequence];
  private textureSettings: TextureSettings = { ...initialTextureSettings };
  private eqSettings: EqSettings = cloneEqSettings(initialEqSettings);
  private saturationSettings: SaturationSettings =
    cloneSaturationSettings(initialSaturationSettings);
  private sidechainSettings: SidechainSettings = { ...initialSidechainSettings };
  private stereoSettings: StereoSettings =
    cloneStereoSettings(initialStereoSettings);
  private referenceSnapshot: ReferenceSnapshot | null = null;
  private referenceTrimDb = 0;
  private quietAuditionDb = 0;

  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hat: Tone.NoiseSynth | null = null;
  private hatFilter: Tone.Filter | null = null;
  private piano: Tone.Sampler | null = null;
  private melodyChorus: Tone.Chorus | null = null;
  private melodyChorusSend: Tone.Gain | null = null;
  private chordSynth: Tone.PolySynth | null = null;
  private bassSynth: Tone.MonoSynth | null = null;
  private drumCompressor: Tone.Compressor | null = null;
  private chordAutomationFilter: Tone.Filter | null = null;
  private soundFilter: Tone.Filter | null = null;
  private soundSynth: Tone.Synth | null = null;

  private mixerFilters: Partial<Record<MixerTrackId, Tone.Filter>> = {};
  private mixerEqFilters: Partial<Record<MixerTrackId, Tone.Filter>> = {};
  private mixerDistortions: Partial<Record<MixerTrackId, Tone.Distortion>> = {};
  private mixerWideners: Partial<Record<MixerTrackId, Tone.StereoWidener>> = {};
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

  setAccompanimentPattern(pattern: AccompanimentPattern) {
    this.accompanimentPattern = pattern;
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

  setAutomationSettings(settings: AutomationSettings) {
    this.automationSettings = cloneAutomationSettings(settings);
  }

  setDynamicsSettings(settings: DynamicsSettings) {
    this.dynamicsSettings = { ...settings };
    this.applyDynamicsSettings();
  }

  setEffectsSettings(settings: EffectsSettings) {
    this.effectsSettings = { ...settings };
    this.applyEffectsSettings();
  }

  setVoicingSettings(settings: VoicingSettings) {
    this.voicingSettings = { inversions: [...settings.inversions] };
  }

  setBassSequence(sequence: BassSequence) {
    this.bassSequence = [...sequence];
  }

  setGrooveFeelSettings(settings: GrooveFeelSettings) {
    this.grooveFeelSettings = cloneGrooveFeelSettings(settings);
    const transport = Tone.getTransport();
    transport.swing = this.grooveFeelSettings.swing;
    transport.swingSubdivision = "8n";
  }

  setTextureSettings(settings: TextureSettings) {
    this.textureSettings = { ...settings };
  }

  setEqSettings(settings: EqSettings) {
    this.eqSettings = cloneEqSettings(settings);
    this.applyAdvancedChannelSettings();
  }

  setSaturationSettings(settings: SaturationSettings) {
    this.saturationSettings = cloneSaturationSettings(settings);
    this.applyAdvancedChannelSettings();
  }

  setSidechainSettings(settings: SidechainSettings) {
    this.sidechainSettings = { ...settings };
  }

  setStereoSettings(settings: StereoSettings) {
    this.stereoSettings = cloneStereoSettings(settings);
    this.applyMixerSettings();
    this.applyAdvancedChannelSettings();
  }

  setReferenceAudition(
    snapshot: ReferenceSnapshot | null,
    trimDb = 0,
    enabled = false,
  ) {
    this.referenceSnapshot = enabled ? cloneReferenceSnapshot(snapshot) : null;
    this.referenceTrimDb = trimDb;
    this.applyMixerSettings();
    this.applyAdvancedChannelSettings();
  }

  setQuietAudition(enabled: boolean) {
    this.quietAuditionDb = enabled ? -18 : 0;
    this.applyMixerSettings();
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  private ensureMixerGraph() {
    mixerTrackIds.forEach((track) => {
      if (this.mixerFilters[track]) return;

      const filter = new Tone.Filter(20, "highpass");
      const eq = new Tone.Filter(1000, "peaking");
      const distortion = new Tone.Distortion({
        distortion: 0,
        wet: 0,
      });
      const widener = new Tone.StereoWidener({
        width: 0.5,
        wet: 1,
      });
      const channel = new Tone.Channel({
        volume: 0,
        pan: 0,
      }).toDestination();

      filter.chain(eq, distortion, widener, channel);

      this.mixerFilters[track] = filter;
      this.mixerEqFilters[track] = eq;
      this.mixerDistortions[track] = distortion;
      this.mixerWideners[track] = widener;
      this.mixerChannels[track] = channel;
    });

    this.applyMixerSettings();
    this.applyAdvancedChannelSettings();
  }

  private ensureEffectsGraph() {
    if (!this.mixReverb) {
      this.mixReverb = new Tone.Reverb({
        decay: this.effectsSettings.reverbDecay,
        preDelay: this.effectsSettings.reverbPreDelay,
        wet: 1,
      }).toDestination();
    }

    if (!this.mixDelay) {
      this.mixDelay = new Tone.FeedbackDelay(
        "8n",
        this.effectsSettings.delayFeedback,
      ).toDestination();
      this.mixDelay.wet.value = 1;
    }

    mixerTrackIds.forEach((track) => {
      const channel = this.mixerChannels[track];
      if (!channel) return;

      if (!this.reverbSends[track]) {
        const reverbSend = new Tone.Gain(0).connect(this.mixReverb!);
        channel.connect(reverbSend);
        this.reverbSends[track] = reverbSend;
      }

      if (!this.delaySends[track]) {
        const delaySend = new Tone.Gain(0).connect(this.mixDelay!);
        channel.connect(delaySend);
        this.delaySends[track] = delaySend;
      }
    });

    if (!this.melodyChorus) {
      this.melodyChorus = new Tone.Chorus({
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.7,
        spread: 180,
        wet: 1,
      }).connect(this.inputFor("melody"));
      this.melodyChorus.start();
    }

    if (!this.melodyChorusSend && this.piano) {
      this.melodyChorusSend = new Tone.Gain(0).connect(this.melodyChorus);
      this.piano.connect(this.melodyChorusSend);
    }

    this.applyMixerSettings();
    this.applyEffectsSettings();
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

    if (!this.drumCompressor) {
      this.drumCompressor = new Tone.Compressor({
        threshold: this.dynamicsSettings.threshold,
        ratio: this.dynamicsSettings.ratio,
        attack: this.dynamicsSettings.attack,
        release: this.dynamicsSettings.release,
      }).connect(this.inputFor("drums"));
    }

    if (!this.kick) {
      this.kick = new Tone.MembraneSynth({
        pitchDecay: 0.035,
        octaves: 6,
        envelope: { attack: 0.001, decay: 0.24, sustain: 0, release: 0.08 },
      }).connect(this.drumCompressor!);

      this.snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.02 },
      }).connect(this.drumCompressor!);
      this.snare.volume.value = -7;

      this.hatFilter = new Tone.Filter(6800, "highpass").connect(this.drumCompressor!);
      this.hat = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.025, sustain: 0, release: 0.01 },
      }).connect(this.hatFilter);
      this.hat.volume.value = -15;
    }

    if (!this.piano) {
      this.piano = new Tone.Sampler({
        urls: {
          A3: "A3.mp3",
          C4: "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          A4: "A4.mp3",
          C5: "C5.mp3",
        },
        release: 1.15,
        baseUrl: `${import.meta.env.BASE_URL}samples/piano/`,
      }).connect(this.inputFor("melody"));
      this.piano.volume.value = -6;
    }

    if (!this.chordAutomationFilter) {
      this.chordAutomationFilter = new Tone.Filter(12000, "lowpass").connect(this.inputFor("chords"));
    }

    if (!this.chordSynth) {
      this.chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.28, release: 1.1 },
      }).connect(this.chordAutomationFilter);
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
    this.applyAdvancedChannelSettings();
    this.applyDynamicsSettings();
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

  private applyDynamicsSettings() {
    if (!this.drumCompressor) return;

    this.drumCompressor.set({
      threshold: this.dynamicsSettings.threshold,
      ratio: this.dynamicsSettings.ratio,
      attack: this.dynamicsSettings.attack,
      release: this.dynamicsSettings.release,
    });
  }

  private applyEffectsSettings() {
    if (this.mixReverb) {
      this.mixReverb.decay = this.effectsSettings.reverbDecay;
      this.mixReverb.preDelay = this.effectsSettings.reverbPreDelay;
    }

    if (this.mixDelay) {
      this.mixDelay.feedback.rampTo(this.effectsSettings.delayFeedback, 0.05);
    }

    if (this.melodyChorusSend) {
      this.melodyChorusSend.gain.rampTo(
        Math.min(0.65, this.effectsSettings.chorusWet),
        0.05,
      );
    }
  }

  private applyMixerSettings() {
    const sourceMixer =
      this.referenceSnapshot?.mixerSettings ?? this.mixerSettings;
    const mono = this.stereoSettings.monoAudition;
    const trim = this.referenceSnapshot ? this.referenceTrimDb : 0;

    mixerTrackIds.forEach((track) => {
      const settings = sourceMixer[track];
      const channel = this.mixerChannels[track];
      const filter = this.mixerFilters[track];
      const reverbSend = this.reverbSends[track];
      const delaySend = this.delaySends[track];

      if (channel) {
        channel.volume.rampTo(
          settings.volume + trim + this.quietAuditionDb,
          0.03,
        );
        channel.pan.rampTo(mono ? 0 : settings.pan, 0.03);
      }

      if (filter) {
        filter.frequency.rampTo(Math.max(20, settings.highpass), 0.03);
      }

      if (reverbSend) {
        reverbSend.gain.rampTo(mono ? 0 : settings.reverb, 0.03);
      }

      if (delaySend) {
        delaySend.gain.rampTo(mono ? 0 : settings.delay, 0.03);
      }
    });
  }

  private applyAdvancedChannelSettings() {
    const eqSettings =
      this.referenceSnapshot?.eqSettings ?? this.eqSettings;
    const saturationSettings =
      this.referenceSnapshot?.saturationSettings ?? this.saturationSettings;
    const widths =
      this.referenceSnapshot?.stereoWidths ?? this.stereoSettings.widths;
    const mono = this.stereoSettings.monoAudition;

    mixerTrackIds.forEach((track) => {
      const eq = this.mixerEqFilters[track];
      const distortion = this.mixerDistortions[track];
      const widener = this.mixerWideners[track];

      if (eq) {
        eq.frequency.rampTo(eqSettings[track].frequency, 0.03);
        eq.gain.rampTo(eqSettings[track].gain, 0.03);
        eq.Q.rampTo(eqSettings[track].q, 0.03);
      }

      if (distortion) {
        distortion.distortion = saturationSettings[track].drive;
        distortion.wet.rampTo(saturationSettings[track].wet, 0.03);
      }

      if (widener) {
        widener.width.rampTo(mono ? 0 : widths[track], 0.03);
        widener.wet.rampTo(1, 0.03);
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

    // Core playback must never depend on optional creative effects.
    this.ensureVoices();
    await Tone.loaded();

    try {
      this.ensureEffectsGraph();
    } catch (error) {
      console.error("PLAY / LAB optional effects failed to initialise", error);
    }

    const transport = Tone.getTransport();
    transport.stop();
    this.clearEvent();
    transport.position = 0;
    transport.bpm.value = bpm;
    transport.swing = this.grooveFeelSettings.swing;
    transport.swingSubdivision = "8n";
    this.step = 0;
    this.onStep = onStep;
  }

  async playDrums(bpm: number, onStep: (step: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;

      if (this.pattern.kick[step]) {
        this.kick?.triggerAttackRelease(
          "C1",
          "16n",
          time,
          this.grooveFeelSettings.velocities.kick[step] ?? 0.9,
        );
      }
      if (this.pattern.snare[step]) {
        this.snare?.triggerAttackRelease(
          "16n",
          time,
          this.grooveFeelSettings.velocities.snare[step] ?? 0.72,
        );
      }
      if (this.pattern.hat[step]) {
        this.hat?.triggerAttackRelease(
          "32n",
          time,
          this.grooveFeelSettings.velocities.hat[step] ?? 0.42,
        );
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
        const texturedMidi = midi + this.textureSettings.melodyOctave * 12;
        const note = Tone.Frequency(texturedMidi, "midi").toNote();
        this.piano?.triggerAttackRelease(note, "8n", time, 0.72);

        if (this.textureSettings.melodyOctaveDouble) {
          this.piano?.triggerAttackRelease(
            Tone.Frequency(texturedMidi + 12, "midi").toNote(),
            "8n",
            time,
            0.42,
          );
        }
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % this.melody.length;
    }, "8n");

    transport.start();
  }

  private triggerChordPattern(
    chord: ChordName,
    inversion: ChordInversion,
    localStep: number,
    time: number,
    velocity = 0.48,
  ) {
    const notes = applyChordTexture(
      voicedChordMidi(chord, inversion),
      this.textureSettings,
    ).map((midi) => Tone.Frequency(midi, "midi").toNote());

    if (this.accompanimentPattern === "block") {
      if (localStep === 0) {
        this.chordSynth?.triggerAttackRelease(notes, "1m", time, velocity);
      }
      return;
    }

    if (this.accompanimentPattern === "pulse") {
      if (localStep % 4 === 0) {
        this.chordSynth?.triggerAttackRelease(notes, "8n", time, velocity * 0.9);
      }
      return;
    }

    if (localStep % 2 !== 0 || notes.length === 0) return;

    const eighth = localStep / 2;
    const noteIndex =
      this.accompanimentPattern === "broken"
        ? [0, Math.min(1, notes.length - 1), notes.length - 1, Math.min(1, notes.length - 1)][
            eighth % 4
          ]
        : eighth % notes.length;

    this.chordSynth?.triggerAttackRelease(
      notes[noteIndex],
      "8n",
      time,
      velocity * 0.95,
    );
  }

  async playChords(bpm: number, onStep: (step: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();
    const totalSteps = this.chordProgression.length * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;
      const chord = this.chordProgression[barIndex];

      if (chord) {
        const inversion = this.voicingSettings.inversions[barIndex] ?? 0;
        this.triggerChordPattern(chord, inversion, localStep, time, 0.6);
      }

      if (localStep === 0) {
        Tone.getDraw().schedule(() => this.onStep?.(barIndex), time);
      }
      this.step = (this.step + 1) % totalSteps;
    }, "16n");

    transport.start();
  }

  async playHarmonyContext(bpm: number, onStep: (bar: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();
    const totalSteps = this.chordProgression.length * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;
      const chord = this.chordProgression[barIndex] ?? "C";

      if (this.pattern.kick[localStep]) {
        this.kick?.triggerAttackRelease(
          "C1",
          "16n",
          time,
          this.grooveFeelSettings.velocities.kick[localStep] ?? 0.9,
        );
      }
      if (this.pattern.snare[localStep]) {
        this.snare?.triggerAttackRelease(
          "16n",
          time,
          this.grooveFeelSettings.velocities.snare[localStep] ?? 0.72,
        );
      }
      if (this.pattern.hat[localStep]) {
        this.hat?.triggerAttackRelease(
          "32n",
          time,
          this.grooveFeelSettings.velocities.hat[localStep] ?? 0.42,
        );
      }

      const inversion = this.voicingSettings.inversions[barIndex] ?? 0;
      this.triggerChordPattern(chord, inversion, localStep, time, 0.45);

      if (localStep % 4 === 0) {
        const rootMidi =
          chordMidi[chord][0] - 12 + this.textureSettings.bassOctave * 12;
        this.bassSynth?.triggerAttackRelease(
          Tone.Frequency(rootMidi, "midi").toNote(),
          "8n",
          time,
          0.42,
        );

        const melodyStep = barIndex * 4 + localStep / 4;
        const midi = this.melody[melodyStep % this.melody.length];
        if (midi !== null && midi !== undefined) {
          const texturedMidi = midi + this.textureSettings.melodyOctave * 12;
          this.piano?.triggerAttackRelease(
            Tone.Frequency(texturedMidi, "midi").toNote(),
            "8n",
            time,
            0.54,
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

  async playArrangement(bpm: number, onStep: (bar: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();
    const totalSteps = this.arrangement.length * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;
      const bar = this.arrangement[barIndex];

      if (localStep === 0) {
        const melodyChannel = this.mixerChannels.melody;
        const baseMelodyVolume =
          (this.referenceSnapshot?.mixerSettings.melody.volume ??
            this.mixerSettings.melody.volume) +
          (this.referenceSnapshot ? this.referenceTrimDb : 0) +
          this.quietAuditionDb;
        const currentVolume = this.automationSettings.melodyVolumeDb[barIndex] ?? 0;
        const nextVolume =
          this.automationSettings.melodyVolumeDb[(barIndex + 1) % this.arrangement.length] ??
          currentVolume;

        if (melodyChannel) {
          melodyChannel.volume.cancelScheduledValues(time);
          melodyChannel.volume.setValueAtTime(baseMelodyVolume + currentVolume, time);
          melodyChannel.volume.linearRampToValueAtTime(
            baseMelodyVolume + nextVolume,
            time + Tone.Time("1m").toSeconds(),
          );
        }

        if (this.chordAutomationFilter) {
          const currentCutoff = this.automationSettings.chordFilterHz[barIndex] ?? 12000;
          const nextCutoff =
            this.automationSettings.chordFilterHz[(barIndex + 1) % this.arrangement.length] ??
            currentCutoff;

          this.chordAutomationFilter.frequency.cancelScheduledValues(time);
          this.chordAutomationFilter.frequency.setValueAtTime(currentCutoff, time);
          this.chordAutomationFilter.frequency.linearRampToValueAtTime(
            nextCutoff,
            time + Tone.Time("1m").toSeconds(),
          );
        }
      }

      if (bar?.drums) {
        if (this.pattern.kick[localStep]) {
          this.kick?.triggerAttackRelease(
            "C1",
            "16n",
            time,
            this.grooveFeelSettings.velocities.kick[localStep] ?? 0.9,
          );

          if (
            bar?.bass &&
            this.sidechainSettings.enabled &&
            this.sidechainSettings.amountDb > 0
          ) {
            const bassChannel = this.mixerChannels.bass;
            if (bassChannel) {
              const base =
                (this.referenceSnapshot?.mixerSettings.bass.volume ??
                  this.mixerSettings.bass.volume) +
                (this.referenceSnapshot ? this.referenceTrimDb : 0) +
                this.quietAuditionDb;
              bassChannel.volume.cancelScheduledValues(time);
              bassChannel.volume.setValueAtTime(
                base - this.sidechainSettings.amountDb,
                time,
              );
              bassChannel.volume.linearRampToValueAtTime(
                base,
                time + this.sidechainSettings.release,
              );
            }
          }
        }
        if (this.pattern.snare[localStep]) {
          this.snare?.triggerAttackRelease(
            "16n",
            time,
            this.grooveFeelSettings.velocities.snare[localStep] ?? 0.72,
          );
        }
        if (this.pattern.hat[localStep]) {
          this.hat?.triggerAttackRelease(
            "32n",
            time,
            this.grooveFeelSettings.velocities.hat[localStep] ?? 0.42,
          );
        }
      }

      const chord = this.chordProgression[barIndex % this.chordProgression.length] ?? "C";

      if (bar?.chords) {
        const chordSlot = barIndex % this.chordProgression.length;
        const inversion = this.voicingSettings.inversions[chordSlot] ?? 0;
        this.triggerChordPattern(chord, inversion, localStep, time, 0.48);
      }

      if (bar?.bass && localStep % 2 === 0) {
        const chordSlot = barIndex % this.chordProgression.length;
        const bassStep = chordSlot * 8 + localStep / 2;
        const programmedBass = this.bassSequence[bassStep];

        if (programmedBass !== null && programmedBass !== undefined) {
          this.bassSynth?.triggerAttackRelease(
            Tone.Frequency(
              programmedBass + this.textureSettings.bassOctave * 12,
              "midi",
            ).toNote(),
            "8n",
            time,
            0.52,
          );
        } else if (
          this.bassSequence.every((note) => note === null) &&
          localStep % 4 === 0
        ) {
          const rootMidi =
            chordMidi[chord][0] -
            12 +
            this.textureSettings.bassOctave * 12;
          this.bassSynth?.triggerAttackRelease(
            Tone.Frequency(rootMidi, "midi").toNote(),
            "8n",
            time,
            0.52,
          );
        }
      }

      if (bar?.melody && localStep % 2 === 0) {
        const melodyStep = localStep / 2;
        const midi = this.melody[melodyStep];

        if (midi !== null && midi !== undefined) {
          const texturedMidi = midi + this.textureSettings.melodyOctave * 12;
          this.piano?.triggerAttackRelease(
            Tone.Frequency(texturedMidi, "midi").toNote(),
            "8n",
            time,
            0.56,
          );

          if (this.textureSettings.melodyOctaveDouble) {
            this.piano?.triggerAttackRelease(
              Tone.Frequency(texturedMidi + 12, "midi").toNote(),
              "8n",
              time,
              0.33,
            );
          }
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
    await Tone.loaded();
    this.piano?.triggerAttackRelease(
      Tone.Frequency(midi, "midi").toNote(),
      "8n",
      undefined,
      0.72,
    );
  }

  async playChord(chord: ChordName, inversion: ChordInversion = 0) {
    await Tone.start();
    this.ensureVoices();
    const notes = applyChordTexture(
      voicedChordMidi(chord, inversion),
      this.textureSettings,
    ).map((midi) => Tone.Frequency(midi, "midi").toNote());
    this.chordSynth?.triggerAttackRelease(notes, "1n", undefined, 0.58);
  }

  async playBass(bpm: number, onStep: (step: number) => void) {
    await this.prepare(bpm, onStep);
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;
      const midi = this.bassSequence[step];

      if (midi !== null) {
        this.bassSynth?.triggerAttackRelease(
          Tone.Frequency(
            midi + this.textureSettings.bassOctave * 12,
            "midi",
          ).toNote(),
          "8n",
          time,
          0.6,
        );
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % BASS_STEPS;
    }, "8n");

    transport.start();
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

  async playSynthPhrase() {
    await Tone.start();
    this.ensureVoices();
    this.applySynthSettings();

    const projectNotes = this.melody.filter(
      (midi): midi is number => midi !== null,
    );
    const sequence =
      projectNotes.length >= 4
        ? projectNotes.slice(0, 8)
        : [60, 64, 67, 64, 62, 65, 67, 60];
    const now = Tone.now() + 0.05;

    sequence.forEach((midi, index) => {
      this.soundSynth?.triggerAttackRelease(
        Tone.Frequency(midi, "midi").toNote(),
        "8n",
        now + index * 0.34,
        0.62,
      );
    });
  }

  stop() {
    const transport = Tone.getTransport();
    transport.stop();
    transport.position = 0;
    this.clearEvent();
    this.step = 0;
    this.applyMixerSettings();
    this.applyAdvancedChannelSettings();
    if (this.chordAutomationFilter) {
      this.chordAutomationFilter.frequency.cancelScheduledValues(Tone.now());
      this.chordAutomationFilter.frequency.rampTo(12000, 0.03);
    }
    this.onStep?.(0);
  }
}

export const audioEngine = new AudioEngine();
