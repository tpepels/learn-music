import * as Tone from "tone";
import {
  clonePattern,
  initialPattern,
  type StepPattern,
} from "../music/model";

class AudioEngine {
  private pattern: StepPattern = clonePattern(initialPattern);
  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hat: Tone.NoiseSynth | null = null;
  private hatFilter: Tone.Filter | null = null;
  private repeatId: number | null = null;
  private step = 0;
  private onStep: ((step: number) => void) | null = null;

  setPattern(pattern: StepPattern) {
    this.pattern = clonePattern(pattern);
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  private ensureVoices() {
    if (this.kick) return;

    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.035,
      octaves: 6,
      envelope: {
        attack: 0.001,
        decay: 0.24,
        sustain: 0,
        release: 0.08,
      },
    }).toDestination();

    this.snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: {
        attack: 0.001,
        decay: 0.13,
        sustain: 0,
        release: 0.02,
      },
    }).toDestination();
    this.snare.volume.value = -7;

    this.hatFilter = new Tone.Filter(6800, "highpass").toDestination();
    this.hat = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: {
        attack: 0.001,
        decay: 0.025,
        sustain: 0,
        release: 0.01,
      },
    }).connect(this.hatFilter);
    this.hat.volume.value = -15;
  }

  private ensureClock() {
    if (this.repeatId !== null) return;

    const transport = Tone.getTransport();
    this.repeatId = transport.scheduleRepeat((time) => {
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

      Tone.getDraw().schedule(() => {
        this.onStep?.(step);
      }, time);

      this.step = (this.step + 1) % 16;
    }, "16n");
  }

  async play(bpm: number, onStep: (step: number) => void) {
    await Tone.start();
    this.ensureVoices();
    this.ensureClock();

    const transport = Tone.getTransport();
    this.onStep = onStep;
    this.step = 0;
    transport.bpm.value = bpm;
    transport.position = 0;

    if (transport.state !== "started") {
      transport.start();
    }
  }

  stop() {
    const transport = Tone.getTransport();
    transport.stop();
    transport.position = 0;
    this.step = 0;
    this.onStep?.(0);
  }
}

export const audioEngine = new AudioEngine();
