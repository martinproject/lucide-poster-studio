import * as Tone from 'tone';

/**
 * The Matrix (1999) Main Title & Opening Theme Synthesizer Engine
 * Balanced & Mastered with Tone.Limiter and Tone.Compressor to eliminate clipping & saturation.
 * - Warm orchestral polytonal brass swells (Dm vs Ebm bi-tonality)
 * - Delicate 16th-note digital code cascade arpeggio in D Phrygian
 * - Atmospheric sub-bass drone and high-altitude cyber telemetry
 */
class MatrixAudioEngine {
  private isInitialized = false;
  private isPlaying = false;
  private isMuted = false;

  // Mastering & Effects Bus
  private masterLimiter: Tone.Limiter | null = null;
  private compressor: Tone.Compressor | null = null;
  private masterGain: Tone.Gain | null = null;
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.PingPongDelay | null = null;
  private filter: Tone.Filter | null = null;

  // Synths
  private brassSynth: Tone.PolySynth | null = null;
  private arpSynth: Tone.MonoSynth | null = null;
  private droneSynth: Tone.Synth | null = null;
  private metalImpact: Tone.MetalSynth | null = null;
  private bleepSynth: Tone.FMSynth | null = null;

  // Sequences / Loops
  private brassPart: Tone.Part | null = null;
  private arpSequence: Tone.Sequence | null = null;
  private droneLoop: Tone.Loop | null = null;
  private bleepLoop: Tone.Loop | null = null;

  private async init() {
    if (this.isInitialized) return;

    await Tone.start();

    // 1. Output Chain: Limiter -> Destination (Guarantees zero digital clipping)
    this.masterLimiter = new Tone.Limiter(-2.0).toDestination();

    // 2. Master Compressor (Glues the elements with dynamic headroom)
    this.compressor = new Tone.Compressor({
      threshold: -18,
      ratio: 3.5,
      attack: 0.04,
      release: 0.25,
      knee: 10,
    }).connect(this.masterLimiter);

    // 3. Master Volume Gain Bus
    this.masterGain = new Tone.Gain(0.42).connect(this.compressor);

    // 4. Cinematic Reverb & Ping-Pong Delay
    this.reverb = new Tone.Reverb({
      decay: 4.0,
      preDelay: 0.06,
      wet: 0.35,
    }).connect(this.masterGain);

    this.delay = new Tone.PingPongDelay({
      delayTime: '16n.',
      feedback: 0.28,
      wet: 0.18,
    }).connect(this.reverb);

    // 5. Warm lowpass filter to remove harshness from digital oscillators
    this.filter = new Tone.Filter({
      frequency: 1800,
      type: 'lowpass',
      rolloff: -12,
      Q: 1.0,
    }).connect(this.delay);

    // 6. Warm Polytonal Brass (Softened oscillator, lowered gain for 7-voice chords)
    this.brassSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'fatsawtooth',
        count: 2,
        spread: 15,
      },
      envelope: {
        attack: 0.6,
        decay: 1.4,
        sustain: 0.6,
        release: 2.5,
      },
      volume: -13,
    }).connect(this.filter);

    // 7. Subtle Digital Code Rain cascade arpeggiator
    this.arpSynth = new Tone.MonoSynth({
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.01,
        decay: 0.15,
        sustain: 0.08,
        release: 0.25,
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.15,
        baseFrequency: 400,
        octaves: 2.8,
      },
      volume: -19,
    }).connect(this.delay);

    // 8. Warm Sub-Bass Drone (controlled volume)
    this.droneSynth = new Tone.Synth({
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 2.0,
        decay: 2.5,
        sustain: 0.8,
        release: 3.5,
      },
      volume: -15,
    }).connect(this.masterGain);

    // 9. Soft Metallic Cinematic Hit
    this.metalImpact = new Tone.MetalSynth({
      envelope: {
        attack: 0.002,
        decay: 0.6,
        release: 0.3,
      },
      harmonicity: 2.2,
      modulationIndex: 10,
      resonance: 2500,
      octaves: 1.2,
      volume: -22,
    }).connect(this.reverb);
    this.metalImpact.frequency.setValueAtTime(140, 0);

    // 10. Ambient Telemetry Carrier Frequency Beeps
    this.bleepSynth = new Tone.FMSynth({
      harmonicity: 2.0,
      modulationIndex: 4,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.06, sustain: 0.01, release: 0.04 },
      modulation: { type: 'sine' },
      volume: -24,
    }).connect(this.delay);

    // -------------------------------------------------------------
    // Composition: Don Davis "The Matrix Main Title" Theme in D Minor
    // -------------------------------------------------------------
    Tone.getTransport().bpm.value = 72;
    Tone.getTransport().timeSignature = 4;

    // A. Polytonal Brass Chords Part (8 measures loop)
    const brassEvents = [
      // Measure 1: D minor root chord swell
      { time: '0:0:0', notes: ['D2', 'A2', 'D3', 'F3', 'A3'], dur: '1m' },
      // Measure 3: Eb minor tension clash (The famous Matrix opening dissonance)
      { time: '2:0:0', notes: ['Eb2', 'Bb2', 'Eb3', 'Gb3', 'Bb3'], dur: '1m' },
      // Measure 5: Tritone / Augmented 4th dissonance
      { time: '4:0:0', notes: ['D2', 'Ab2', 'C3', 'F#3', 'C4'], dur: '1m' },
      // Measure 7: Epic full Polytonal Crescendo
      { time: '6:0:0', notes: ['D2', 'F2', 'Ab2', 'C3', 'Eb3', 'F#3', 'A3'], dur: '2m' },
    ];

    this.brassPart = new Tone.Part((time, value) => {
      this.brassSynth?.triggerAttackRelease(value.notes, value.dur, time);
      // Soft metallic impact on chord beginnings
      this.metalImpact?.triggerAttackRelease('8n', time, 0.25);
    }, brassEvents);
    this.brassPart.loop = true;
    this.brassPart.loopEnd = '8m';

    // B. Fast Matrix Rain Arpeggio (D Phrygian / Aeolian code cascade)
    const arpNotes = [
      'D4', 'Eb4', 'F4', 'A4', 'D5', 'A4', 'F4', 'Eb4',
      'D4', 'G4', 'Bb4', 'D5', 'Eb5', 'D5', 'Bb4', 'G4',
      'C4', 'Eb4', 'Gb4', 'A4', 'C5', 'A4', 'Gb4', 'Eb4',
      'D4', 'F#4', 'A4', 'C5', 'Eb5', 'C5', 'A4', 'F#4'
    ];

    this.arpSequence = new Tone.Sequence(
      (time, note) => {
        this.arpSynth?.triggerAttackRelease(note, '32n', time);
      },
      arpNotes,
      '16n'
    );

    // C. Sub-Bass Drone Loop
    this.droneLoop = new Tone.Loop((time) => {
      this.droneSynth?.triggerAttackRelease('D1', '4m', time);
    }, '4m');

    // D. Cybernetic Telemetry Carrier Pings
    const telemetryPings = ['A5', 'D6', 'Eb6', 'F#6', 'A6'];
    this.bleepLoop = new Tone.Loop((time) => {
      if (Math.random() > 0.45) {
        const ping = telemetryPings[Math.floor(Math.random() * telemetryPings.length)];
        this.bleepSynth?.triggerAttackRelease(ping, '64n', time);
      }
    }, '8n');

    this.isInitialized = true;
  }

  public async start() {
    if (this.isPlaying) return;

    try {
      await this.init();

      if (this.isMuted) {
        this.masterGain?.gain.setValueAtTime(0, Tone.now());
      } else {
        this.masterGain?.gain.cancelScheduledValues(Tone.now());
        this.masterGain?.gain.setValueAtTime(0.0001, Tone.now());
        this.masterGain?.gain.exponentialRampToValueAtTime(0.42, Tone.now() + 1.8);
      }

      this.brassPart?.start(0);
      this.arpSequence?.start(0);
      this.droneLoop?.start(0);
      this.bleepLoop?.start(0);

      Tone.getTransport().start();
      this.isPlaying = true;
    } catch {
      // Audio policy
    }
  }

  public stop() {
    if (!this.isPlaying) return;

    try {
      const now = Tone.now();
      // Smooth fade out before stopping transport
      this.masterGain?.gain.cancelScheduledValues(now);
      this.masterGain?.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      setTimeout(() => {
        this.brassPart?.stop();
        this.arpSequence?.stop();
        this.droneLoop?.stop();
        this.bleepLoop?.stop();
        Tone.getTransport().stop();
        this.isPlaying = false;
      }, 650);
    } catch {
      this.isPlaying = false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.masterGain) return;

    const now = Tone.now();
    this.masterGain.gain.cancelScheduledValues(now);
    if (muted) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    } else {
      this.masterGain.gain.exponentialRampToValueAtTime(0.42, now + 0.25);
    }
  }

  public playShuffleGlitch() {
    if (this.isMuted || !this.isInitialized) return;
    try {
      const now = Tone.now();
      this.bleepSynth?.triggerAttackRelease('Eb6', '32n', now);
      this.metalImpact?.triggerAttackRelease('16n', now + 0.05, 0.2);
    } catch {
      // Ignore
    }
  }
}

export const matrixAudio = new MatrixAudioEngine();
