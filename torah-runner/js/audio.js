// Synthesized sound effects and a looping tune in the Hijaz / Freygish mode (D Eb F# G A Bb C).
// Everything is generated with WebAudio, so the game ships no audio files.

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Music: the opening theme of Hava Nagila (traditional), then a klezmer freylekh in the same
// Freygish mode (E F G# A B C D). Clarinet lead, accordion off-beat chords, oom-pah bass, drum.
// Each bar is 8 eighth-note steps; notes are [midi, length in steps].
const HAVA = [
  [[71, 2], [71, 2], [74, 1], [72, 1], [71, 2]],
  [[74, 2], [74, 2], [77, 1], [76, 1], [74, 2]],
  [[76, 2], [76, 2], [80, 1], [77, 1], [76, 2]],
  [[74, 2], [72, 1], [72, 1], [71, 4]],
];
const HAVA_END = [[74, 1], [72, 1], [71, 1], [69, 1], [68, 4]];
const FREYLEKH = [
  [[64, 1], [65, 1], [68, 1], [69, 1], [71, 2], [69, 1], [68, 1]],
  [[69, 1], [71, 1], [72, 1], [71, 1], [69, 2], [68, 2]],
  [[68, 1], [69, 1], [71, 1], [72, 1], [74, 1], [72, 1], [71, 1], [69, 1]],
  [[68, 2], [65, 1], [68, 1], [64, 4]],
];
const FREYLEKH_HI = FREYLEKH.map((bar) => bar.map(([m, l]) => [m + 12, l]));
const BARS = [
  ...HAVA.map((n, i) => ({ n, c: ['E', 'Dm', 'E', 'E'][i] })),
  ...[...HAVA.slice(0, 3), HAVA_END].map((n, i) => ({ n, c: ['E', 'Dm', 'E', 'E'][i] })),
  ...FREYLEKH.map((n, i) => ({ n, c: ['E', 'Am', 'Dm', 'E'][i] })),
  ...FREYLEKH_HI.map((n, i) => ({ n, c: ['E', 'Am', 'Dm', 'E'][i] })),
];
const CHORDS = { E: [64, 68, 71], Dm: [62, 65, 69], Am: [57, 60, 64] };
const ROOT = { E: [40, 47], Dm: [38, 45], Am: [45, 40] };

export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.wantMusic = false;
    this.step = 0;
    this.nextTime = 0;
    this.timer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch (e) { this.ctx = null; return; }
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = this.muted ? 0 : 0.85;
    this.master.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.master);
    this.music = c.createGain(); this.music.gain.value = 0.3; this.music.connect(this.master);
    const len = c.sampleRate;
    this.noise = c.createBuffer(1, len, c.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.85, this.ctx.currentTime, 0.03);
  }

  tone(freq, dur, { type = 'sine', vol = 0.2, to = 0, at = 0, attack = 0.005, dest = null, filter = 0 } = {}) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + at;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (filter) {
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filter;
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(dest || this.sfx);
    o.start(t); o.stop(t + dur + 0.05);
  }

  hiss(dur, { vol = 0.3, type = 'lowpass', freq = 1200, to = 0, at = 0, dest = null } = {}) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + at;
    const s = c.createBufferSource(); s.buffer = this.noise;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || this.sfx);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  play(name, n = 0) {
    if (!this.ctx || this.muted) return;
    switch (name) {
      case 'jump': this.tone(330, 0.16, { type: 'square', vol: 0.07, to: 700, filter: 2200 }); break;
      case 'slide': this.hiss(0.28, { vol: 0.22, freq: 2400, to: 500 }); break;
      case 'lane': this.hiss(0.1, { vol: 0.08, type: 'bandpass', freq: 1800, to: 900 }); break;
      case 'manna': {
        const scale = [74, 76, 78, 79, 81, 83, 85, 86];
        const m = scale[n % scale.length];
        this.tone(midi(m), 0.12, { type: 'triangle', vol: 0.11 });
        this.tone(midi(m + 12), 0.1, { type: 'sine', vol: 0.05, at: 0.03 });
        break;
      }
      case 'letter':
        [74, 78, 81, 86].forEach((m, i) => this.tone(midi(m), 0.22, { type: 'triangle', vol: 0.12, at: i * 0.055 }));
        break;
      case 'word':
        [62, 66, 69, 74].forEach((m, i) => this.tone(midi(m), 0.5, { type: 'triangle', vol: 0.12, at: i * 0.09 }));
        [74, 78, 81, 86].forEach((m, i) => this.tone(midi(m + 12), 0.35, { type: 'sine', vol: 0.06, at: 0.36 + i * 0.06 }));
        break;
      case 'hit':
        this.hiss(0.35, { vol: 0.5, freq: 900, to: 120 });
        this.tone(140, 0.3, { type: 'square', vol: 0.12, to: 55, filter: 900 });
        break;
      case 'bump': this.tone(220, 0.12, { type: 'square', vol: 0.08, to: 120, filter: 1200 }); break;
      case 'power':
        this.tone(392, 0.35, { type: 'triangle', vol: 0.12, to: 1180 });
        this.tone(587, 0.3, { type: 'sine', vol: 0.06, to: 1568, at: 0.05 });
        break;
      case 'shield': this.hiss(0.45, { vol: 0.35, type: 'highpass', freq: 1500, to: 6000 }); this.tone(880, 0.3, { vol: 0.08, to: 300 }); break;
      case 'heart': this.tone(midi(76), 0.14, { type: 'triangle', vol: 0.12 }); this.tone(midi(81), 0.22, { type: 'triangle', vol: 0.12, at: 0.1 }); break;
      case 'shofar': this.shofar(); break;
      case 'over':
        [69, 67, 66, 63, 62].forEach((m, i) => this.tone(midi(m), 0.32, { type: 'triangle', vol: 0.11, at: i * 0.16 }));
        break;
      case 'click': this.tone(880, 0.05, { type: 'triangle', vol: 0.06 }); break;
      case 'tick': this.tone(660, 0.12, { type: 'triangle', vol: 0.12 }); break;
      case 'go': this.tone(988, 0.25, { type: 'triangle', vol: 0.14 }); this.tone(1319, 0.3, { type: 'sine', vol: 0.07, at: 0.04 }); break;
      case 'whistle':
        [[740, 0], [880, 0], [740, 0.42], [880, 0.42]].forEach(([f, at]) =>
          this.tone(f, 0.36, { type: 'triangle', vol: 0.07, at, attack: 0.04, filter: 2400 }));
        break;
      case 'chug': this.hiss(0.09, { vol: 0.16 + n * 0.05, type: 'bandpass', freq: 500 + n * 300, to: 260 }); break;
      case 'whoosh': this.hiss(1.1, { vol: 0.32, type: 'bandpass', freq: 400, to: 3200 }); break;
      case 'brake': this.tone(2200, 0.7, { type: 'sine', vol: 0.03, to: 1500 }); this.hiss(0.8, { vol: 0.2, type: 'highpass', freq: 3000, to: 1200 }); break;
      case 'thunder': this.hiss(1.4, { vol: 0.32, freq: 380, to: 60 }); this.hiss(0.25, { vol: 0.18, freq: 1600, to: 300, at: 0.05 }); break;
      case 'banner': this.tone(midi(62), 0.6, { type: 'triangle', vol: 0.08 }); this.tone(midi(69), 0.6, { type: 'triangle', vol: 0.06, at: 0.12 }); break;
      default: break;
    }
  }

  // A ram's horn: buzzy sawtooth through a resonant filter, with the rising "tekiah" ending.
  shofar() {
    const c = this.ctx; const t = c.currentTime;
    const o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, t);
    o.frequency.linearRampToValueAtTime(233, t + 0.6);
    o.frequency.exponentialRampToValueAtTime(349, t + 1.0);
    const lfo = c.createOscillator(); lfo.frequency.value = 6;
    const lg = c.createGain(); lg.gain.value = 4; lfo.connect(lg); lg.connect(o.frequency);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.4;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.45, t + 0.08);
    g.gain.setValueAtTime(0.4, t + 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
    o.connect(f); f.connect(g); g.connect(this.sfx);
    o.start(t); lfo.start(t); o.stop(t + 1.2); lfo.stop(t + 1.2);
  }

  startMusic() {
    this.wantMusic = true;
    if (!this.ctx || this.timer) return;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.schedule(), 30);
  }

  stopMusic() {
    this.wantMusic = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  setTempo(gameSpeed) { this.bpm = Math.min(172, 132 + Math.max(0, gameSpeed - 13) * 2.4); }

  schedule() {
    const c = this.ctx; if (!c) return;
    while (this.nextTime < c.currentTime + 0.14) {
      const stepDur = 60 / (this.bpm || 132) / 2;
      const s = this.step;
      const bar = BARS[Math.floor(s / 8) % BARS.length];
      const pos = s % 8;
      const at = this.nextTime - c.currentTime;
      if (!this.muted) {
        let t = 0;
        for (const [m, len] of bar.n) {
          if (t === pos) this.clarinet(midi(m), at, len * stepDur);
          t += len;
        }
        if (pos % 2 === 1) for (const m of CHORDS[bar.c]) this.pluck(midi(m), at, 0.035, 0.16, 'accordion');
        if (pos === 0 || pos === 4) this.pluck(midi(ROOT[bar.c][pos === 0 ? 0 : 1]), at, 0.15, 0.3);
        if (pos === 0 || pos === 4) this.tone(95, 0.2, { vol: 0.3, to: 48, at, dest: this.music });
        else if (pos === 2 || pos === 6) this.hiss(0.07, { vol: 0.12, type: 'highpass', freq: 3000, at, dest: this.music });
      }
      this.step++;
      this.nextTime += stepDur;
    }
  }

  // Klezmer clarinet: a reedy square wave that scoops up into the note, with vibrato.
  clarinet(freq, at, dur) {
    const c = this.ctx; const t = c.currentTime + Math.max(0, at);
    const o = c.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(freq * 0.97, t);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.05);
    const lfo = c.createOscillator(); lfo.frequency.value = 5.5;
    const lg = c.createGain(); lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(freq * 0.012, t + Math.min(0.25, dur));
    lfo.connect(lg); lg.connect(o.frequency);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2200; f.Q.value = 2;
    const g = c.createGain();
    const end = t + Math.max(0.08, dur * 0.92);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.025);
    g.gain.setValueAtTime(0.06, end - 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, end + 0.06);
    o.connect(f); f.connect(g); g.connect(this.music);
    o.start(t); lfo.start(t); o.stop(end + 0.1); lfo.stop(end + 0.1);
  }

  // Oud-like pluck: two detuned oscillators, fast attack, filtered decay.
  pluck(freq, at, vol, len = 0.32, kind = 'oud') {
    const c = this.ctx; const t = c.currentTime + Math.max(0, at);
    const g = c.createGain();
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(500, t + len);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    (kind === 'accordion' ? [['sawtooth', 1], ['sawtooth', 1.006], ['square', 0.997]] : [['sawtooth', 1], ['triangle', 1.004]]).forEach(([type, k]) => {
      const o = c.createOscillator(); o.type = type; o.frequency.value = freq * k;
      o.connect(f); o.start(t); o.stop(t + len + 0.05);
    });
    f.connect(g); g.connect(this.music);
  }
}
