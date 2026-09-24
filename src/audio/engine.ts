import * as Tone from "tone";
import {
  applyLearningFocusVolume,
  shouldMuteLearningContext,
} from "./learningFocus";
import {
  eighthNoteSeconds,
  getSynthPhraseSchedule,
} from "./synthPhrase";
import { disposeSynthAudition } from "./synthAudition";
import { effectiveChorusWet } from "./stereoAudition";
import { TransportStartGate } from "./transportStartGate";
import { syncEighthNoteDelay } from "./tempoSync";
import { reverbValueChanged } from "./reverbState";
import {
  buildArrangementFallbackMelody,
  hasArrangementMelody,
  resolveArrangementFrame,
  resolveArrangementMelodyEvent,
} from "./arrangementPlayback";
import {
  ensureProductionLayersPresent,
  fallbackBassRoot,
  hasBassContent,
  hasWrittenHarmony,
  resolveContextDrumPattern,
  resolveContextProgression,
} from "./playbackFallbacks";
import pianoSoftA2 from "@audio-samples/piano-mp3-velocity3/audio/A2v3.mp3";
import pianoSoftC3 from "@audio-samples/piano-mp3-velocity3/audio/C3v3.mp3";
import pianoSoftA3 from "@audio-samples/piano-mp3-velocity3/audio/A3v3.mp3";
import pianoSoftC4 from "@audio-samples/piano-mp3-velocity3/audio/C4v3.mp3";
import pianoSoftA4 from "@audio-samples/piano-mp3-velocity3/audio/A4v3.mp3";
import pianoSoftC5 from "@audio-samples/piano-mp3-velocity3/audio/C5v3.mp3";
import pianoSoftA5 from "@audio-samples/piano-mp3-velocity3/audio/A5v3.mp3";
import pianoSoftC6 from "@audio-samples/piano-mp3-velocity3/audio/C6v3.mp3";
import pianoMediumA2 from "@audio-samples/piano-mp3-velocity10/audio/A2v10.mp3";
import pianoMediumC3 from "@audio-samples/piano-mp3-velocity10/audio/C3v10.mp3";
import pianoMediumA3 from "@audio-samples/piano-mp3-velocity10/audio/A3v10.mp3";
import pianoMediumC4 from "@audio-samples/piano-mp3-velocity10/audio/C4v10.mp3";
import pianoMediumA4 from "@audio-samples/piano-mp3-velocity10/audio/A4v10.mp3";
import pianoMediumC5 from "@audio-samples/piano-mp3-velocity10/audio/C5v10.mp3";
import pianoMediumA5 from "@audio-samples/piano-mp3-velocity10/audio/A5v10.mp3";
import pianoMediumC6 from "@audio-samples/piano-mp3-velocity10/audio/C6v10.mp3";
import pianoStrongA2 from "@audio-samples/piano-mp3-velocity16/audio/A2v16.mp3";
import pianoStrongC3 from "@audio-samples/piano-mp3-velocity16/audio/C3v16.mp3";
import pianoStrongA3 from "@audio-samples/piano-mp3-velocity16/audio/A3v16.mp3";
import pianoStrongC4 from "@audio-samples/piano-mp3-velocity16/audio/C4v16.mp3";
import pianoStrongA4 from "@audio-samples/piano-mp3-velocity16/audio/A4v16.mp3";
import pianoStrongC5 from "@audio-samples/piano-mp3-velocity16/audio/C5v16.mp3";
import pianoStrongA5 from "@audio-samples/piano-mp3-velocity16/audio/A5v16.mp3";
import pianoStrongC6 from "@audio-samples/piano-mp3-velocity16/audio/C6v16.mp3";
import {
  hatClosed as sampledHat,
  kick as sampledKick,
  snare as sampledSnare,
} from "@teropa/drumkit";
import {
  BASS_STEPS,
  applyChordTexture,
  cloneArrangement,
  cloneAutomationSettings,
  cloneEqSettings,
  cloneGrooveFeelSettings,
  cloneHarmonyDurations,
  cloneHarmonySequence,
  cloneMixerSettings,
  cloneNoteDurationLane,
  clonePattern,
  cloneReferenceSnapshot,
  cloneSaturationSettings,
  cloneStereoSettings,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassDurations,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialGrooveFeelSettings,
  initialHarmonyDurations,
  initialHarmonySequence,
  initialFormSettings,
  initialInstrumentSettings,
  initialMelody,
  initialMelodyDurations,
  initialMixerSettings,
  initialPattern,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  mixerTrackIds,
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
  type FormSettings,
  type GrooveFeelSettings,
  type HarmonyDurations,
  type HarmonySequence,
  type InstrumentSettings,
  type MelodySequence,
  type NoteDurationLane,
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
import {
  chordMidi as harmonicChordMidi,
  cloneHarmonicProgression,
  cloneTonalContext,
  diatonicChord,
  harmonicBassRootMidi,
  initialHarmonicProgression,
  initialTonalContext,
  voicedHarmonicChordMidi,
  type HarmonicChord,
  type HarmonicProgression,
  type TonalContext,
} from "../music/harmony";

const softPianoUrls = {
  A2: pianoSoftA2,
  C3: pianoSoftC3,
  A3: pianoSoftA3,
  C4: pianoSoftC4,
  A4: pianoSoftA4,
  C5: pianoSoftC5,
  A5: pianoSoftA5,
  C6: pianoSoftC6,
};

const mediumPianoUrls = {
  A2: pianoMediumA2,
  C3: pianoMediumC3,
  A3: pianoMediumA3,
  C4: pianoMediumC4,
  A4: pianoMediumA4,
  C5: pianoMediumC5,
  A5: pianoMediumA5,
  C6: pianoMediumC6,
};

const strongPianoUrls = {
  A2: pianoStrongA2,
  C3: pianoStrongC3,
  A3: pianoStrongA3,
  C4: pianoStrongC4,
  A4: pianoStrongA4,
  C5: pianoStrongC5,
  A5: pianoStrongA5,
  C6: pianoStrongC6,
};

class AudioEngine {
  private pattern: StepPattern = clonePattern(initialPattern);
  private melody: MelodySequence = [...initialMelody];
  private studySequence: MelodySequence = Array.from({ length: 16 }, () => null);
  private studyDurations: number[] = Array.from({ length: 16 }, () => 1);
  private studyHarmony: Array<"I" | "V" | null> = Array.from(
    { length: 16 },
    () => null,
  );
  private melodyDurations: NoteDurationLane = [...initialMelodyDurations];
  private chordProgression: ChordProgression = [...initialChordProgression];
  private tonalContext: TonalContext = cloneTonalContext(initialTonalContext);
  private harmonicProgression: HarmonicProgression =
    cloneHarmonicProgression(initialHarmonicProgression);
  private harmonySequence: HarmonySequence =
    cloneHarmonySequence(initialHarmonySequence);
  private harmonyDurations: HarmonyDurations =
    cloneHarmonyDurations(initialHarmonyDurations);
  private accompanimentPattern: AccompanimentPattern = initialAccompanimentPattern;
  private arrangement: Arrangement = cloneArrangement(initialArrangement);
  private synthSettings: SynthSettings = { ...initialSynthSettings };
  private mixerSettings: MixerSettings = cloneMixerSettings(initialMixerSettings);
  private automationSettings: AutomationSettings = cloneAutomationSettings(initialAutomationSettings);
  private dynamicsSettings: DynamicsSettings = { ...initialDynamicsSettings };
  private effectsSettings: EffectsSettings = { ...initialEffectsSettings };
  private grooveFeelSettings: GrooveFeelSettings =
    cloneGrooveFeelSettings(initialGrooveFeelSettings);
  private formSettings: FormSettings = {
    sections: [...initialFormSettings.sections],
    roles: [...initialFormSettings.roles],
    layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
  };
  private voicingSettings: VoicingSettings = {
    inversions: [...initialVoicingSettings.inversions],
  };
  private bassSequence: BassSequence = [...initialBassSequence];
  private bassDurations: NoteDurationLane = [...initialBassDurations];
  private textureSettings: TextureSettings = { ...initialTextureSettings };
  private instrumentSettings: InstrumentSettings = {
    ...initialInstrumentSettings,
  };
  private eqSettings: EqSettings = cloneEqSettings(initialEqSettings);
  private saturationSettings: SaturationSettings =
    cloneSaturationSettings(initialSaturationSettings);
  private sidechainSettings: SidechainSettings = { ...initialSidechainSettings };
  private stereoSettings: StereoSettings =
    cloneStereoSettings(initialStereoSettings);
  private referenceSnapshot: ReferenceSnapshot | null = null;
  private referenceTrimDb = 0;
  private quietAuditionDb = 0;
  private learningFocusTrack: MixerTrackId | null = null;
  private learningSolo = false;

  private drumSampler: Tone.Sampler | null = null;
  private pianoSoft: Tone.Sampler | null = null;
  private pianoMedium: Tone.Sampler | null = null;
  private pianoStrong: Tone.Sampler | null = null;
  private chordPianoSoft: Tone.Sampler | null = null;
  private chordPianoMedium: Tone.Sampler | null = null;
  private chordPianoStrong: Tone.Sampler | null = null;
  private chordElectric: Tone.PolySynth | null = null;
  private chordPad: Tone.PolySynth | null = null;
  private chordPluck: Tone.PolySynth | null = null;
  private melodyChorus: Tone.Chorus | null = null;
  private melodyChorusSend: Tone.Gain | null = null;
  private bassElectric: Tone.Sampler | null = null;
  private bassSub: Tone.MonoSynth | null = null;
  private bassSynth: Tone.MonoSynth | null = null;
  private drumCompressor: Tone.Compressor | null = null;
  private chordAutomationFilter: Tone.Filter | null = null;
  private soundFilter: Tone.Filter | null = null;
  private soundSynth: Tone.PolySynth | null = null;

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
  private transportStartGate = new TransportStartGate();

  setPattern(pattern: StepPattern) {
    this.pattern = clonePattern(pattern);
  }

  setMelody(melody: MelodySequence) {
    this.melody = [...melody];
  }

  setStudySequence(
    sequence: MelodySequence,
    durations?: number[],
    harmony?: Array<"I" | "V" | null>,
  ) {
    this.studySequence = [...sequence];
    this.studyDurations = Array.from(
      { length: sequence.length },
      (_, index) => Math.max(1, durations?.[index] ?? 1),
    );
    this.studyHarmony = Array.from(
      { length: sequence.length },
      (_, index) => harmony?.[index] ?? null,
    );
  }

  setMelodyDurations(durations: NoteDurationLane) {
    this.melodyDurations = cloneNoteDurationLane(
      durations,
      this.melody.length,
    );
  }

  setChordProgression(chords: ChordProgression) {
    this.chordProgression = [...chords];
  }

  setTonalContext(context: TonalContext) {
    this.tonalContext = cloneTonalContext(context);
  }

  setHarmonicProgression(progression: HarmonicProgression) {
    this.harmonicProgression = cloneHarmonicProgression(progression);
  }

  setHarmonySequence(sequence: HarmonySequence) {
    this.harmonySequence = cloneHarmonySequence(sequence);
  }

  setHarmonyDurations(durations: HarmonyDurations) {
    this.harmonyDurations = cloneHarmonyDurations(durations);
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

  setBassDurations(durations: NoteDurationLane) {
    this.bassDurations = cloneNoteDurationLane(
      durations,
      this.bassSequence.length,
    );
  }

  setGrooveFeelSettings(settings: GrooveFeelSettings) {
    this.grooveFeelSettings = cloneGrooveFeelSettings(settings);
    const transport = Tone.getTransport();
    transport.swing = this.grooveFeelSettings.swing;
    transport.swingSubdivision = "8n";
  }

  setFormSettings(settings: FormSettings) {
    this.formSettings = {
      sections: [...settings.sections],
      roles: [...settings.roles],
      layers: (settings.layers ?? initialFormSettings.layers).map((entry) => ({
        ...entry,
      })),
    };
  }

  setTextureSettings(settings: TextureSettings) {
    this.textureSettings = { ...settings };
  }

  setInstrumentSettings(settings: InstrumentSettings) {
    this.instrumentSettings = { ...settings };
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
    this.applyEffectsSettings();
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

  setLearningFocusTrack(track: MixerTrackId | null) {
    this.learningFocusTrack = track;
    if (track === null) this.learningSolo = false;
    this.applyMixerSettings();
  }

  setLearningSolo(enabled: boolean) {
    this.learningSolo = enabled && this.learningFocusTrack !== null;
    this.applyMixerSettings();
  }

  private syncTempoEffects(bpm: number, rampTime = 0.05) {
    if (this.mixDelay) {
      syncEighthNoteDelay(this.mixDelay.delayTime, bpm, rampTime);
    }
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
    this.syncTempoEffects(bpm);
  }

  private triggerKick(time: number, velocity: number) {
    this.drumSampler?.triggerAttack("C1", time, velocity);
  }

  private triggerSnare(time: number, velocity: number) {
    this.drumSampler?.triggerAttack("D1", time, velocity);
  }

  private triggerHat(time: number, velocity: number) {
    this.drumSampler?.triggerAttack("F#1", time, velocity);
  }

  private pianoTouchMultiplier(): number {
    if (this.instrumentSettings.pianoTouch === "soft") return 0.58;
    if (this.instrumentSettings.pianoTouch === "strong") return 1.28;
    return 1;
  }

  private triggerPiano(
    notes: string | string[],
    duration: number | string,
    time: number | undefined,
    velocity: number,
  ) {
    const effectiveVelocity = Math.max(
      0.12,
      Math.min(1, velocity * this.pianoTouchMultiplier()),
    );
    const sampler =
      effectiveVelocity < 0.48
        ? this.pianoSoft
        : effectiveVelocity < 0.8
          ? this.pianoMedium
          : this.pianoStrong;
    sampler?.triggerAttackRelease(notes, duration, time, effectiveVelocity);
  }

  private triggerChordNotes(
    notes: string | string[],
    duration: number | string,
    time: number | undefined,
    velocity: number,
  ) {
    switch (this.instrumentSettings.chordVoice) {
      case "piano": {
        const effectiveVelocity = Math.max(
          0.12,
          Math.min(1, velocity * this.pianoTouchMultiplier()),
        );
        const sampler =
          effectiveVelocity < 0.48
            ? this.chordPianoSoft
            : effectiveVelocity < 0.8
              ? this.chordPianoMedium
              : this.chordPianoStrong;
        sampler?.triggerAttackRelease(
          notes,
          duration,
          time,
          effectiveVelocity,
        );
        return;
      }
      case "electric":
        this.chordElectric?.triggerAttackRelease(notes, duration, time, velocity);
        return;
      case "pad":
        this.chordPad?.triggerAttackRelease(notes, duration, time, velocity);
        return;
      case "pluck":
        this.chordPluck?.triggerAttackRelease(notes, duration, time, velocity);
        return;
    }
  }

  private triggerBassNote(
    note: string,
    duration: number | string,
    time: number | undefined,
    velocity: number,
  ) {
    switch (this.instrumentSettings.bassVoice) {
      case "electric":
        this.bassElectric?.triggerAttackRelease(note, duration, time, velocity);
        return;
      case "sub":
        this.bassSub?.triggerAttackRelease(note, duration, time, velocity);
        return;
      case "synth":
        this.bassSynth?.triggerAttackRelease(note, duration, time, velocity);
        return;
    }
  }

  private noteDuration(eighthSteps: number): number {
    return Tone.Time("8n").toSeconds() * Math.max(1, eighthSteps);
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

    if (!this.melodyChorusSend) {
      this.melodyChorusSend = new Tone.Gain(0).connect(this.melodyChorus);
      [this.pianoSoft, this.pianoMedium, this.pianoStrong]
        .filter((sampler): sampler is Tone.Sampler => sampler !== null)
        .forEach((sampler) => sampler.connect(this.melodyChorusSend!));
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

  private ensureDrumVoices() {
    this.ensureMixerGraph();

    if (!this.drumCompressor) {
      this.drumCompressor = new Tone.Compressor({
        threshold: this.dynamicsSettings.threshold,
        ratio: this.dynamicsSettings.ratio,
        attack: this.dynamicsSettings.attack,
        release: this.dynamicsSettings.release,
      }).connect(this.inputFor("drums"));
    }

    if (!this.drumSampler) {
      this.drumSampler = new Tone.Sampler({
        urls: {
          C1: sampledKick,
          D1: sampledSnare,
          "F#1": sampledHat,
        },
        release: 0.04,
      }).connect(this.drumCompressor);
      this.drumSampler.volume.value = -4;
    }

    this.applyDynamicsSettings();
  }

  private ensurePianoVoices() {
    this.ensureMixerGraph();

    const connectPiano = (sampler: Tone.Sampler) => {
      if (this.melodyChorusSend) sampler.connect(this.melodyChorusSend);
      return sampler;
    };

    if (!this.pianoSoft) {
      this.pianoSoft = connectPiano(
        new Tone.Sampler({
          urls: softPianoUrls,
          release: 1.15,
        }).connect(this.inputFor("melody")),
      );
      this.pianoSoft.volume.value = -5;
    }

    if (!this.pianoMedium) {
      this.pianoMedium = connectPiano(
        new Tone.Sampler({
          urls: mediumPianoUrls,
          release: 1.15,
        }).connect(this.inputFor("melody")),
      );
      this.pianoMedium.volume.value = -6;
    }

    if (!this.pianoStrong) {
      this.pianoStrong = connectPiano(
        new Tone.Sampler({
          urls: strongPianoUrls,
          release: 1.05,
        }).connect(this.inputFor("melody")),
      );
      this.pianoStrong.volume.value = -7;
    }
  }

  private ensureChordVoices() {
    this.ensureMixerGraph();

    if (!this.chordAutomationFilter) {
      this.chordAutomationFilter = new Tone.Filter(
        12000,
        "lowpass",
      ).connect(this.inputFor("chords"));
    }

    if (!this.chordPianoSoft) {
      this.chordPianoSoft = new Tone.Sampler({
        urls: softPianoUrls,
        release: 1.2,
      }).connect(this.chordAutomationFilter);
      this.chordPianoSoft.volume.value = -9;
    }

    if (!this.chordPianoMedium) {
      this.chordPianoMedium = new Tone.Sampler({
        urls: mediumPianoUrls,
        release: 1.2,
      }).connect(this.chordAutomationFilter);
      this.chordPianoMedium.volume.value = -10;
    }

    if (!this.chordPianoStrong) {
      this.chordPianoStrong = new Tone.Sampler({
        urls: strongPianoUrls,
        release: 1.1,
      }).connect(this.chordAutomationFilter);
      this.chordPianoStrong.volume.value = -11;
    }

    if (!this.chordElectric) {
      this.chordElectric = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1.8,
        modulationIndex: 3.2,
        oscillator: { type: "sine" },
        modulation: { type: "sine" },
        envelope: {
          attack: 0.008,
          decay: 0.65,
          sustain: 0.24,
          release: 1.4,
        },
        modulationEnvelope: {
          attack: 0.005,
          decay: 0.35,
          sustain: 0.08,
          release: 0.8,
        },
      }).connect(this.chordAutomationFilter);
      this.chordElectric.volume.value = -12;
    }

    if (!this.chordPad) {
      this.chordPad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.38,
          decay: 0.7,
          sustain: 0.62,
          release: 2.2,
        },
      }).connect(this.chordAutomationFilter);
      this.chordPad.volume.value = -13;
    }

    if (!this.chordPluck) {
      this.chordPluck = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: {
          attack: 0.002,
          decay: 0.14,
          sustain: 0.04,
          release: 0.22,
        },
      }).connect(this.chordAutomationFilter);
      this.chordPluck.volume.value = -16;
    }
  }

  private ensureBassVoices() {
    this.ensureMixerGraph();

    if (!this.bassElectric) {
      this.bassElectric = new Tone.Sampler({
        urls: {
          "C#1": "Cs1.mp3",
          G1: "G1.mp3",
          "C#2": "Cs2.mp3",
          G2: "G2.mp3",
          "C#3": "Cs3.mp3",
          G3: "G3.mp3",
        },
        baseUrl: `${import.meta.env.BASE_URL}samples/bass/`,
        release: 0.5,
      }).connect(this.inputFor("bass"));
      this.bassElectric.volume.value = -8;
    }

    if (!this.bassSub) {
      this.bassSub = new Tone.MonoSynth({
        oscillator: { type: "sine" },
        filter: { type: "lowpass", Q: 0.4, rolloff: -12 },
        filterEnvelope: {
          attack: 0.01,
          decay: 0.25,
          sustain: 0.45,
          release: 0.5,
          baseFrequency: 70,
          octaves: 1.2,
        },
        envelope: {
          attack: 0.008,
          decay: 0.18,
          sustain: 0.72,
          release: 0.35,
        },
      }).connect(this.inputFor("bass"));
      this.bassSub.volume.value = -11;
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
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.5,
          release: 0.35,
        },
      }).connect(this.inputFor("bass"));
      this.bassSynth.volume.value = -13;
    }
  }

  private ensureSoundDesignVoice() {
    if (!this.soundFilter) {
      this.soundFilter = new Tone.Filter(
        this.synthSettings.cutoff,
        "lowpass",
      ).toDestination();
    }

    if (!this.soundSynth) {
      this.soundSynth = new Tone.PolySynth(Tone.Synth, {
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
  }

  private ensureVoices(
    requirements: ReadonlyArray<
      "drums" | "piano" | "chords" | "bass" | "synth"
    > = ["drums", "piano", "chords", "bass", "synth"],
  ) {
    this.ensureMixerGraph();

    if (requirements.includes("drums")) this.ensureDrumVoices();
    if (requirements.includes("piano")) this.ensurePianoVoices();
    if (requirements.includes("chords")) this.ensureChordVoices();
    if (requirements.includes("bass")) this.ensureBassVoices();
    if (requirements.includes("synth")) this.ensureSoundDesignVoice();

    this.applyMixerSettings();
    this.applyAdvancedChannelSettings();
    this.applyDynamicsSettings();
  }

  private applySynthSettings() {
    if (this.soundFilter) {
      this.soundFilter.frequency.rampTo(this.synthSettings.cutoff, 0.03);
    }

    if (this.soundSynth) {
      this.soundSynth.set({
        oscillator: { type: this.synthSettings.waveform },
        envelope: {
          attack: this.synthSettings.attack,
          decay: 0.2,
          sustain: 0.6,
          release: this.synthSettings.release,
        },
      });
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
      if (
        reverbValueChanged(
          this.mixReverb.decay,
          this.effectsSettings.reverbDecay,
        )
      ) {
        this.mixReverb.decay = this.effectsSettings.reverbDecay;
      }
      if (
        reverbValueChanged(
          this.mixReverb.preDelay,
          this.effectsSettings.reverbPreDelay,
        )
      ) {
        this.mixReverb.preDelay = this.effectsSettings.reverbPreDelay;
      }
    }

    if (this.mixDelay) {
      this.mixDelay.feedback.rampTo(this.effectsSettings.delayFeedback, 0.05);
    }

    if (this.melodyChorusSend) {
      this.melodyChorusSend.gain.rampTo(
        effectiveChorusWet(
          this.effectsSettings.chorusWet,
          this.stereoSettings.monoAudition,
        ),
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
        const focusedVolume = applyLearningFocusVolume(
          settings.volume + trim,
          track,
          this.learningFocusTrack,
        );
        channel.mute = shouldMuteLearningContext(
          track,
          this.learningFocusTrack,
          this.learningSolo,
        );
        channel.volume.rampTo(
          focusedVolume + this.quietAuditionDb,
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

  cancelPendingTransportStart() {
    this.transportStartGate.invalidate();
  }

  private async prepare(
    bpm: number,
    onStep: (step: number) => void,
    requirements: ReadonlyArray<
      "drums" | "piano" | "chords" | "bass" | "synth"
    >,
  ): Promise<boolean> {
    const startToken = this.transportStartGate.begin();

    await Tone.start();
    if (!this.transportStartGate.isCurrent(startToken)) return false;

    // Only create/load the voices this transport path actually uses.
    this.ensureVoices(requirements);
    await Tone.loaded();
    if (!this.transportStartGate.isCurrent(startToken)) return false;

    try {
      this.ensureEffectsGraph();
      if (this.mixReverb) {
        await this.mixReverb.ready;
      }
    } catch (error) {
      console.error("PLAY / LAB optional effects failed to initialise", error);
    }

    if (!this.transportStartGate.isCurrent(startToken)) return false;

    const transport = Tone.getTransport();
    transport.stop();
    this.clearEvent();
    transport.position = 0;
    transport.bpm.value = bpm;
    this.syncTempoEffects(bpm, 0);
    transport.swing = this.grooveFeelSettings.swing;
    transport.swingSubdivision = "8n";
    this.step = 0;
    this.onStep = onStep;
    return true;
  }

  async playDrums(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["drums"]))) return false;
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;

      if (this.pattern.kick[step]) {
        this.triggerKick(time, this.grooveFeelSettings.velocities.kick[step] ?? 0.9);
      }
      if (this.pattern.snare[step]) {
        this.triggerSnare(time, this.grooveFeelSettings.velocities.snare[step] ?? 0.72);
      }
      if (this.pattern.hat[step]) {
        this.triggerHat(time, this.grooveFeelSettings.velocities.hat[step] ?? 0.42);
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % 16;
    }, "16n");

    transport.start();
    return true;
  }

  async playMelody(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["piano"]))) return false;
    const transport = Tone.getTransport();

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step;
      const midi = this.melody[step];

      if (midi !== null) {
        const texturedMidi = midi + this.textureSettings.melodyOctave * 12;
        const note = Tone.Frequency(texturedMidi, "midi").toNote();
        const duration = this.noteDuration(this.melodyDurations[step] ?? 1);
        this.triggerPiano(note, duration, time, 0.72);

        if (this.textureSettings.melodyOctaveDouble) {
          this.triggerPiano(
            Tone.Frequency(texturedMidi + 12, "midi").toNote(),
            duration,
            time,
            0.42,
          );
        }
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % this.melody.length;
    }, "8n");

    transport.start();
    return true;
  }

  async playStudySequence(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["piano"]))) return false;
    const transport = Tone.getTransport();
    const totalSteps = Math.max(1, this.studySequence.length);

    this.eventId = transport.scheduleRepeat((time) => {
      const step = this.step % totalSteps;
      const harmony = this.studyHarmony[step];
      if (harmony) {
        const chord =
          harmony === "I"
            ? ["C3", "E3", "G3"]
            : ["G2", "B2", "D3"];
        const nextHarmonyOffset = this.studyHarmony
          .slice(step + 1)
          .findIndex((entry) => entry !== null);
        const harmonySteps =
          nextHarmonyOffset >= 0
            ? Math.max(1, nextHarmonyOffset + 1)
            : Math.min(4, totalSteps - step);
        this.triggerPiano(
          chord,
          this.noteDuration(harmonySteps),
          time,
          0.27,
        );
      }

      const midi = this.studySequence[step];
      if (midi !== null && midi !== undefined) {
        this.triggerPiano(
          Tone.Frequency(midi, "midi").toNote(),
          this.noteDuration(this.studyDurations[step] ?? 1),
          time,
          0.68,
        );
      }

      Tone.getDraw().schedule(() => this.onStep?.(step), time);
      this.step = (this.step + 1) % totalSteps;
    }, "8n");

    transport.start();
    return true;
  }

  async playMelodyWithGroove(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["drums", "piano"]))) return false;
    const transport = Tone.getTransport();
    const totalTransportSteps = 32;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const drumStep = globalStep % 16;
      const drums = resolveContextDrumPattern(this.pattern);
      const melodyFallback = !hasArrangementMelody(this.melody);
      const melody = melodyFallback
        ? buildArrangementFallbackMelody(this.tonalContext)
        : this.melody;

      if (drums.kick[drumStep]) {
        this.triggerKick(time, this.grooveFeelSettings.velocities.kick[drumStep] ?? 0.9);
      }
      if (drums.snare[drumStep]) {
        this.triggerSnare(time, this.grooveFeelSettings.velocities.snare[drumStep] ?? 0.72);
      }
      if (drums.hat[drumStep]) {
        this.triggerHat(time, this.grooveFeelSettings.velocities.hat[drumStep] ?? 0.42);
      }

      if (globalStep % 2 === 0) {
        const melodyStep = globalStep / 2;
        const midi = melody[melodyStep];
        if (midi !== null && midi !== undefined) {
          const texturedMidi = midi + this.textureSettings.melodyOctave * 12;
          this.triggerPiano(
            Tone.Frequency(texturedMidi, "midi").toNote(),
            this.noteDuration(
              melodyFallback ? 1 : this.melodyDurations[melodyStep] ?? 1,
            ),
            time,
            0.68,
          );
        }
        Tone.getDraw().schedule(() => this.onStep?.(melodyStep), time);
      }

      this.step = (this.step + 1) % totalTransportSteps;
    }, "16n");

    transport.start();
    return true;
  }

  private triggerChordPattern(
    chord: HarmonicChord,
    inversion: ChordInversion,
    localStep: number,
    time: number,
    velocity = 0.48,
  ) {
    const notes = applyChordTexture(
      voicedHarmonicChordMidi(chord, this.tonalContext, inversion),
      this.textureSettings,
    ).map((midi) => Tone.Frequency(midi, "midi").toNote());

    if (this.accompanimentPattern === "block") {
      if (localStep === 0) {
        this.triggerChordNotes(notes, "1m", time, velocity);
      }
      return;
    }

    if (this.accompanimentPattern === "pulse") {
      if (localStep % 4 === 0) {
        this.triggerChordNotes(notes, "8n", time, velocity * 0.9);
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

    this.triggerChordNotes(
      notes[noteIndex],
      "8n",
      time,
      velocity * 0.95,
    );
  }

  async playChords(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["chords"]))) return false;
    const transport = Tone.getTransport();
    const totalSteps = this.harmonicProgression.length * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;
      const chord = this.harmonicProgression[barIndex];

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
    return true;
  }

  async playChordMelody(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["piano", "chords"]))) return false;
    const transport = Tone.getTransport();
    const progression = resolveContextProgression(
      this.harmonicProgression,
      this.tonalContext,
    );
    const melodyFallback = !hasArrangementMelody(this.melody);
    const melody = melodyFallback
      ? buildArrangementFallbackMelody(this.tonalContext)
      : this.melody;
    const totalSteps = Math.max(1, progression.length) * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;
      const chord = progression[barIndex];

      if (chord) {
        const inversion = this.voicingSettings.inversions[barIndex] ?? 0;
        this.triggerChordPattern(chord, inversion, localStep, time, 0.52);
      }

      if (globalStep % 2 === 0 && melody.length > 0) {
        const melodyStep = (globalStep / 2) % melody.length;
        const midi = melody[melodyStep];
        if (midi !== null && midi !== undefined) {
          this.triggerPiano(
            Tone.Frequency(
              midi + this.textureSettings.melodyOctave * 12,
              "midi",
            ).toNote(),
            this.noteDuration(
              melodyFallback ? 1 : this.melodyDurations[melodyStep] ?? 1,
            ),
            time,
            0.58,
          );
        }
        Tone.getDraw().schedule(() => this.onStep?.(melodyStep), time);
      }

      this.step = (this.step + 1) % totalSteps;
    }, "16n");

    transport.start();
    return true;
  }

  private triggerWrittenHarmonyStep(
    harmonyStep: number,
    time: number,
    velocity = 0.52,
  ) {
    const notes = this.harmonySequence[harmonyStep] ?? [];
    if (notes.length === 0) return;

    notes.forEach((midi) => {
      const rendered = Tone.Frequency(
        midi + this.textureSettings.chordsOctave * 12,
        "midi",
      ).toNote();
      const duration = this.noteDuration(
        this.harmonyDurations[harmonyStep]?.[midi] ?? 1,
      );
      this.triggerChordNotes(rendered, duration, time, velocity);
    });
  }

  async playHarmonyContext(
    bpm: number,
    onStep: (step: number) => void,
    includeMelody = true,
  ) {
    if (!(
      await this.prepare(
        bpm,
        onStep,
        includeMelody
          ? ["drums", "piano", "chords"]
          : ["drums", "chords"],
      )
    )) return false;
    const transport = Tone.getTransport();
    const drums = resolveContextDrumPattern(this.pattern);
    const progression = resolveContextProgression(
      this.harmonicProgression,
      this.tonalContext,
    );
    const writtenHarmony = hasWrittenHarmony(this.harmonySequence);
    const melodyFallback =
      includeMelody && !hasArrangementMelody(this.melody);
    const melody = melodyFallback
      ? buildArrangementFallbackMelody(this.tonalContext)
      : this.melody;
    const totalTransportSteps = progression.length * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;

      if (drums.kick[localStep]) {
        this.triggerKick(time, this.grooveFeelSettings.velocities.kick[localStep] ?? 0.9);
      }
      if (drums.snare[localStep]) {
        this.triggerSnare(time, this.grooveFeelSettings.velocities.snare[localStep] ?? 0.72);
      }
      if (drums.hat[localStep]) {
        this.triggerHat(time, this.grooveFeelSettings.velocities.hat[localStep] ?? 0.42);
      }

      if (!writtenHarmony) {
        const chord = progression[barIndex];
        if (chord) {
          this.triggerChordPattern(
            chord,
            this.voicingSettings.inversions[barIndex] ?? 0,
            localStep,
            time,
            0.48,
          );
        }
      }

      if (localStep % 2 === 0) {
        const harmonyStep = barIndex * 8 + localStep / 2;
        if (writtenHarmony) {
          this.triggerWrittenHarmonyStep(harmonyStep, time);
        }

        if (includeMelody && melody.length > 0) {
          const melodyStep = harmonyStep % melody.length;
          const midi = melody[melodyStep];
          if (midi !== null && midi !== undefined) {
            const texturedMidi = midi + this.textureSettings.melodyOctave * 12;
            this.triggerPiano(
              Tone.Frequency(texturedMidi, "midi").toNote(),
              this.noteDuration(
                melodyFallback ? 1 : this.melodyDurations[melodyStep] ?? 1,
              ),
              time,
              0.54,
            );
          }
        }

        Tone.getDraw().schedule(() => this.onStep?.(harmonyStep), time);
      }

      this.step = (this.step + 1) % totalTransportSteps;
    }, "16n");

    transport.start();
    return true;
  }

  private async startArrangementPlayback(
    bpm: number,
    onStep: (bar: number) => void,
    getArrangement: () => Arrangement,
  ) {
    if (!(await this.prepare(bpm, onStep, ["drums", "piano", "chords", "bass"]))) return false;
    const transport = Tone.getTransport();
    const initialArrangement = getArrangement();
    const totalSteps = Math.max(1, initialArrangement.length) * 16;

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const arrangement = getArrangement();
      const {
        barIndex,
        localStep,
        bar,
      } = resolveArrangementFrame(arrangement, globalStep);
      const arrangementLength = Math.max(1, arrangement.length);

      if (localStep === 0) {
        const melodyChannel = this.mixerChannels.melody;
        const baseMelodyVolume =
          (this.referenceSnapshot?.mixerSettings.melody.volume ??
            this.mixerSettings.melody.volume) +
          (this.referenceSnapshot ? this.referenceTrimDb : 0) +
          this.quietAuditionDb;
        const currentVolume =
          this.automationSettings.melodyVolumeDb[barIndex] ?? 0;
        const nextVolume =
          this.automationSettings.melodyVolumeDb[
            (barIndex + 1) % arrangementLength
          ] ?? currentVolume;

        if (melodyChannel) {
          melodyChannel.volume.cancelScheduledValues(time);
          melodyChannel.volume.setValueAtTime(
            baseMelodyVolume + currentVolume,
            time,
          );
          melodyChannel.volume.linearRampToValueAtTime(
            baseMelodyVolume + nextVolume,
            time + Tone.Time("1m").toSeconds(),
          );
        }

        if (this.chordAutomationFilter) {
          const currentCutoff =
            this.automationSettings.chordFilterHz[barIndex] ?? 12000;
          const nextCutoff =
            this.automationSettings.chordFilterHz[
              (barIndex + 1) % arrangementLength
            ] ?? currentCutoff;

          this.chordAutomationFilter.frequency.cancelScheduledValues(time);
          this.chordAutomationFilter.frequency.setValueAtTime(
            currentCutoff,
            time,
          );
          this.chordAutomationFilter.frequency.linearRampToValueAtTime(
            nextCutoff,
            time + Tone.Time("1m").toSeconds(),
          );
        }
      }

      if (bar?.drums) {
        if (this.pattern.kick[localStep]) {
          this.triggerKick(
            time,
            this.grooveFeelSettings.velocities.kick[localStep] ?? 0.9,
          );

          if (
            bar.bass &&
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
          this.triggerSnare(
            time,
            this.grooveFeelSettings.velocities.snare[localStep] ?? 0.72,
          );
        }
        if (this.pattern.hat[localStep]) {
          this.triggerHat(
            time,
            this.grooveFeelSettings.velocities.hat[localStep] ?? 0.42,
          );
        }
      }

      const chordSlot =
        this.harmonicProgression.length > 0
          ? barIndex % this.harmonicProgression.length
          : 0;
      const chord =
        this.harmonicProgression[chordSlot] ??
        diatonicChord(this.tonalContext, 1);

      if (bar?.chords) {
        const hasWrittenHarmony = this.harmonySequence.some(
          (notes) => notes.length > 0,
        );

        if (hasWrittenHarmony && localStep % 2 === 0) {
          const harmonyStep = chordSlot * 8 + localStep / 2;
          this.triggerWrittenHarmonyStep(harmonyStep, time, 0.48);
        } else if (!hasWrittenHarmony) {
          const inversion = this.voicingSettings.inversions[chordSlot] ?? 0;
          this.triggerChordPattern(
            chord,
            inversion,
            localStep,
            time,
            0.48,
          );
        }
      }

      if (bar?.bass && localStep % 2 === 0) {
        const bassStep = chordSlot * 8 + localStep / 2;
        const programmedBass = this.bassSequence[bassStep];

        if (programmedBass !== null && programmedBass !== undefined) {
          this.triggerBassNote(
            Tone.Frequency(
              programmedBass + this.textureSettings.bassOctave * 12,
              "midi",
            ).toNote(),
            this.noteDuration(this.bassDurations[bassStep] ?? 1),
            time,
            0.52,
          );
        } else if (
          this.bassSequence.every((note) => note === null) &&
          localStep % 4 === 0
        ) {
          const rootMidi =
            harmonicBassRootMidi(chord, this.tonalContext) +
            this.textureSettings.bassOctave * 12;
          this.triggerBassNote(
            Tone.Frequency(rootMidi, "midi").toNote(),
            "8n",
            time,
            0.52,
          );
        }
      }

      const melodyEvent = resolveArrangementMelodyEvent(
        globalStep,
        this.melody,
        this.tonalContext,
      );

      if (bar?.melody && melodyEvent) {
        const midi = melodyEvent.midi;

        if (midi !== null && midi !== undefined) {
          const texturedMidi =
            midi + this.textureSettings.melodyOctave * 12;
          const duration = this.noteDuration(
            melodyEvent.fallback
              ? 1
              : this.melodyDurations[melodyEvent.step] ?? 1,
          );

          this.triggerPiano(
            Tone.Frequency(texturedMidi, "midi").toNote(),
            duration,
            time,
            0.56,
          );

          if (this.textureSettings.melodyOctaveDouble) {
            this.triggerPiano(
              Tone.Frequency(texturedMidi + 12, "midi").toNote(),
              duration,
              time,
              0.33,
            );
          }
        }
      }

      if (localStep === 0) {
        Tone.getDraw().schedule(
          () => this.onStep?.(barIndex),
          time,
        );
      }

      this.step = (this.step + 1) % totalSteps;
    }, "16n");

    transport.start();
    return true;
  }

  async playArrangement(
    bpm: number,
    onStep: (bar: number) => void,
  ) {
    return this.startArrangementPlayback(
      bpm,
      onStep,
      () => this.arrangement,
    );
  }

  async playForm(bpm: number, onStep: (bar: number) => void) {
    const formArrangement: Arrangement = Array.from(
      { length: 16 },
      (_, bar) => ({
        ...this.formSettings.layers[Math.floor(bar / 4)],
      }),
    );

    return this.startArrangementPlayback(
      bpm,
      onStep,
      () => formArrangement,
    );
  }

  async playPianoNote(midi: number) {
    await Tone.start();
    this.ensureVoices(["piano"]);
    await Tone.loaded();
    this.triggerPiano(
      Tone.Frequency(midi, "midi").toNote(),
      "8n",
      undefined,
      0.72,
    );
  }

  async playChordPreview(chord: HarmonicChord, inversion: ChordInversion = 0) {
    await Tone.start();
    this.ensureVoices(["chords"]);
    await Tone.loaded();

    const notes = applyChordTexture(
      voicedHarmonicChordMidi(chord, this.tonalContext, inversion),
      this.textureSettings,
    ).map((midi) => Tone.Frequency(midi, "midi").toNote());
    this.triggerChordNotes(notes, "2n", undefined, 0.7);
  }

  async playChord(chord: HarmonicChord, inversion: ChordInversion = 0) {
    await this.playChordPreview(chord, inversion);
  }

  async playBassNote(midi = 36) {
    await Tone.start();
    this.ensureVoices(["bass"]);
    await Tone.loaded();
    this.triggerBassNote(
      Tone.Frequency(midi, "midi").toNote(),
      "2n",
      undefined,
      0.72,
    );
  }

  async playBass(bpm: number, onStep: (step: number) => void) {
    if (!(await this.prepare(bpm, onStep, ["drums", "chords", "bass"]))) return false;
    const transport = Tone.getTransport();
    const totalTransportSteps = BASS_STEPS * 2;
    const hasWrittenHarmony = this.harmonySequence.some(
      (notes) => notes.length > 0,
    );

    this.eventId = transport.scheduleRepeat((time) => {
      const globalStep = this.step;
      const barIndex = Math.floor(globalStep / 16);
      const localStep = globalStep % 16;

      if (this.pattern.kick[localStep]) {
        this.triggerKick(time, this.grooveFeelSettings.velocities.kick[localStep] ?? 0.9);
      }
      if (this.pattern.snare[localStep]) {
        this.triggerSnare(time, this.grooveFeelSettings.velocities.snare[localStep] ?? 0.72);
      }
      if (this.pattern.hat[localStep]) {
        this.triggerHat(time, this.grooveFeelSettings.velocities.hat[localStep] ?? 0.42);
      }

      if (!hasWrittenHarmony) {
        const chord = this.harmonicProgression[barIndex];
        if (chord) {
          this.triggerChordPattern(
            chord,
            this.voicingSettings.inversions[barIndex] ?? 0,
            localStep,
            time,
            0.36,
          );
        }
      }

      if (globalStep % 2 === 0) {
        const bassStep = globalStep / 2;
        if (hasWrittenHarmony) {
          this.triggerWrittenHarmonyStep(bassStep, time, 0.34);
        }

        const midi = this.bassSequence[bassStep];
        if (midi !== null && midi !== undefined) {
          this.triggerBassNote(
            Tone.Frequency(
              midi + this.textureSettings.bassOctave * 12,
              "midi",
            ).toNote(),
            this.noteDuration(this.bassDurations[bassStep] ?? 1),
            time,
            0.62,
          );
        }

        Tone.getDraw().schedule(() => this.onStep?.(bassStep), time);
      }

      this.step = (this.step + 1) % totalTransportSteps;
    }, "16n");

    transport.start();
    return true;
  }

  stopSynthAudition() {
    this.soundSynth = disposeSynthAudition(this.soundSynth);
  }

  async playSynthNote(midi = 60) {
    await Tone.start();
    this.stopSynthAudition();
    this.ensureVoices(["synth"]);
    this.applySynthSettings();
    this.soundSynth?.triggerAttackRelease(
      Tone.Frequency(midi, "midi").toNote(),
      "1n",
      undefined,
      0.72,
    );
  }

  async playSynthPhrase(bpm: number) {
    await Tone.start();
    this.stopSynthAudition();
    this.ensureVoices(["synth"]);
    this.applySynthSettings();

    const projectEvents = getSynthPhraseSchedule(
      this.melody,
      this.melodyDurations,
      bpm,
    );
    const now = Tone.now() + 0.05;

    if (projectEvents.length > 0) {
      projectEvents.forEach(
        ({ midi, startSeconds, durationSeconds }) => {
          this.soundSynth?.triggerAttackRelease(
            Tone.Frequency(midi, "midi").toNote(),
            durationSeconds,
            now + startSeconds,
            0.62,
          );
        },
      );
      return;
    }

    const eighth = eighthNoteSeconds(bpm);
    [60, 64, 67, 64, 62, 65, 67, 60].forEach((midi, index) => {
      this.soundSynth?.triggerAttackRelease(
        Tone.Frequency(midi, "midi").toNote(),
        eighth,
        now + index * eighth,
        0.62,
      );
    });
  }

  stop() {
    this.cancelPendingTransportStart();
    const transport = Tone.getTransport();
    transport.stop();
    this.stopSynthAudition();
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
