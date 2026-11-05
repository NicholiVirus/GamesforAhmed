// Torah Runner: gameplay, input and the main loop.
import * as THREE from './three.js';
import { WORDS, BIOMES, BIOME_LEN, POWERS, CYCLE, JLM_START, GATE_AT } from './data.js';
import { Sound } from './audio.js';
import { World, PointPool, biomeIndexAt } from './world.js';
import { UI } from './ui.js';
import {
  buildPlayer, buildShield, OBSTACLES, BIOME_OBSTACLES, obstacleGeo, flatMat,
  letterTexture, powerTexture, mannaTex, shadowTex, shekelTexture, COIN_ERA,
} from './models.js';
import { TrainRide } from './train.js';
import { Chaser } from './chaser.js';

const LANES = [-2, 0, 2];
// What the main-menu shop sells, priced in manna saved from your runs.
export const SHOP = [
  { type: 'shield', name: 'Star shield', price: 150, about: 'Keep it, use it any time: double-tap, E, or the star button' },
  { type: 'magnet', name: 'Magnet', price: 150, about: 'Pulls manna to you' },
  { type: 'double', name: '2× manna', price: 200, about: 'Double manna for 10 s' },
  { type: 'sneakers', name: 'Jump sneakers', price: 200, about: 'Super-high jumps' },
  { type: 'jetpack', name: 'Jet pack', price: 300, about: 'Fly over everything' },
  { type: 'heart', name: 'Extra heart', price: 250, about: 'One heart appears on the road in your next run' },
];
// Permanent upgrades: each level costs more.
export const UPGRADES = [
  { id: 'speed', name: 'Swift feet', about: '+5% running speed per level', price: 1000, max: 5, icon: 'sneakers' },
  { id: 'passive', name: 'Manna blessing', about: '+1 manna every 2 s per level', price: 800, max: 5, icon: 'double' },
  { id: 'jet', name: 'Bigger jet tanks', about: '+1 s of jet pack per level', price: 900, max: 5, icon: 'jetpack' },
];
const ACHIEVEMENTS = [
  { words: 5, manna: 100 }, { words: 10, manna: 200 }, { words: 25, manna: 400 }, { words: 50, manna: 750 },
  { words: 100, manna: 1500 }, { words: 150, manna: 2000 }, { words: 200, manna: 3000 }, { words: 280, manna: 5000 },
];
const GRAV = 30;
const JUMP_V = 10.2;
const SLIDE_TIME = 0.72;
const RAMP_V = 16.5;
const JET_Y = 5.4;
const MAX_HEARTS = 3;
const SPAWN_AHEAD = 150;
const LAP = BIOME_LEN * CYCLE;
const STORE_KEY = 'torah-runner-v1';
const MENU_SPEED = 8;

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const speedAt = (d) => 18 + 24 * (1 - Math.exp(-d / 2600));
const diffAt = (d) => 1 - Math.exp(-d / 2300);
const ease = (t) => t * t * (3 - 2 * t);

const OBS_COLOR = {
  bricks: [0.75, 0.42, 0.24], jars: [0.72, 0.36, 0.18], banner: [0.95, 0.72, 0.25], obelisk: [0.86, 0.78, 0.6],
  block: [0.86, 0.78, 0.62], coral: [1, 0.5, 0.42], arch: [0.6, 0.9, 1], rockstack: [0.5, 0.58, 0.56],
  rocks: [0.75, 0.6, 0.42], bush: [0.45, 0.5, 0.25], tent: [0.3, 0.25, 0.22], camel: [0.78, 0.6, 0.36],
  tumble: [0.6, 0.47, 0.28], ledge: [0.5, 0.42, 0.37], stonearch: [0.52, 0.45, 0.4], boulder: [0.48, 0.4, 0.36],
  rollstone: [0.54, 0.45, 0.4],
};

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
}
function saveStore(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ }
}

// A fresh random order of all the words every run (Fisher-Yates shuffle).
function makeWordOrder() {
  const list = WORDS.slice();
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

class Game {
  constructor(boot) {
    this.canvas = document.getElementById('scene');
    this.world = new World(this.canvas);
    this.scene = this.world.scene;
    this.sound = new Sound();
    this.store = loadStore();
    this.learned = new Set(this.store.learned || []);
    this.best = { score: this.store.bestScore || 0, dist: this.store.bestDist || 0 };
    this.muted = boot.muted !== undefined ? !!boot.muted : !!this.store.muted;
    this.sound.setMuted(this.muted);
    this.ui = new UI({
      play: () => this.start(), pause: () => this.pause(), resume: () => this.resume(), home: () => this.home(),
      sound: () => this.toggleSound(), openScroll: () => this.openScroll(), closeScroll: () => this.closeScroll(),
      openShop: () => this.openShop(), buy: (t) => this.buy(t), buyUpgrade: (id) => this.buyUpgrade(id), useStar: () => this.useStar(), closeShop: () => this.ui.show('screen-start'),
      continueWord: () => this.continueWord(), skipRide: () => this.skipRide(),
    });

    // Player, shield and a soft shadow.
    this.p = buildPlayer();
    this.scene.add(this.p.root);
    this.shield = buildShield();
    this.shield.visible = false;
    this.p.root.add(this.shield);
    this.shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false });
    this.shadowGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    this.pShadow = new THREE.Mesh(this.shadowGeo, this.shadowMat);
    this.pShadow.position.y = 0.03;
    this.scene.add(this.pShadow);
    this.shadowPool = [];

    // Manna is drawn as one Points cloud.
    this.mannaPool = new PointPool(this.scene, 180, 0.95, shekelTexture('ancient'));
    this.mannaFree = Array.from({ length: 180 }, (_, i) => 179 - i);
    this.manna = [];
    this.obs = [];
    this.obsPools = {};
    this.pickups = [];
    this.spritePool = [];
    this.letterMats = {};
    this.powerMats = {};
    this.beaconGeo = new THREE.CylinderGeometry(0.42, 0.42, 9, 14, 1, true);
    this.beaconMat = new THREE.MeshBasicMaterial({
      color: 0xffd36a, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    this.beacons = [];

    this.ringMat = new THREE.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.09, 6, 40), this.ringMat);
    this.ring.visible = false;
    this.scene.add(this.ring);
    this.ringT = 0;

    const icons = {};
    for (const t of ['shield', 'magnet', 'double', 'shofar', 'heart', 'jetpack', 'sneakers']) icons[t] = powerTexture(t).image.toDataURL();
    this.ui.setIcons(icons);
    this.ui.shopItems = SHOP;
    this.ui.upgrades = UPGRADES;

    this.time = 0;
    this.runPh = 0;
    this.camBlend = 0;
    this.shake = 0;
    this.flashT = 0;
    this.touch = null;
    this.state = 'menu';
    this.camLook = new THREE.Vector3(0, 1, -10);
    this.ride = new TrainRide(this);
    this.chaser = new Chaser(this.scene);
    this.ridePose = 'stand';
    this.resetRun();
    this.world.onThunder = () => this.sound.play('thunder');
    this.bindInput();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.state === 'playing') this.pause(); });
    this.resize();

    this.ui.setSound(!this.muted);
    this.ui.setBest(this.best, this.learned.size, WORDS.length);
    this.ui.show('screen-start');
    this.frames = [];
    this.lastDprCheck = 0;
    this.last = performance.now();
    requestAnimationFrame((t) => this.frame(t));

    const hot = window.claude && window.claude.hot;
    if (hot && typeof hot.snapshot === 'function') {
      try { hot.snapshot(() => ({ muted: this.muted })); } catch (e) { /* viewer hook unavailable */ }
    }
  }

  // ------------------------------------------------------------ run state
  resetRun(keepProps = false) {
    for (const o of this.obs) this.releaseObs(o);
    this.obs.length = 0;
    for (const m of this.manna) this.freeManna(m);
    this.manna.length = 0;
    for (const p of this.pickups) this.releasePickup(p);
    this.pickups.length = 0;
    this.world.clearParticles();
    this.dist = 0;
    this.speed = this.state === 'menu' ? MENU_SPEED : speedAt(0);
    this.score = 0;
    this.mannaCount = 0;
    this.maxHearts = MAX_HEARTS;
    this.hearts = MAX_HEARTS;
    this.banked = false;
    this.passiveT = 0;
    this.revives = 0;
    this.boarded = false;
    this.endTitle = null;
    this.lane = 1; this.prevLane = 1;
    this.x = 0; this.y = 0; this.vy = 0;
    this.grounded = true;
    this.slideT = 0; this.invuln = 0; this.hurtT = 0;
    this.jumpBuf = 0; this.slideBuf = 0;
    this.powers = { shield: 0, magnet: 0, double: 0, jetpack: 0, sneakers: 0 };
    this.speedFactor = 1;
    this.spawnCursor = 0;
    this.lastSafe = 1;
    this.prevRow = null;
    this.wordOrder = makeWordOrder();
    this.wordPos = 0;
    this.letterIdx = 0;
    this.nextLetterWz = 42;
    this.nextPowerWz = rnd(260, 360);
    this.nextHeartWz = Infinity; // hearts only come from the shop
    this.wordsDone = [];
    this.combo = 0; this.comboT = 0;
    this.biomeShown = -1;
    this.deadT = 0;
    this.dustT = 0;
    this.world.propMinX = this.state === 'menu' ? 9.5 : 0;
    if (!keepProps) this.world.resetProps(0);
    this.ring.visible = false;
    this.p.body.rotation.set(0, 0, 0);
    this.p.body.position.set(0, 0, 0);
    this.p.root.visible = true;
    if (this.p.wear) { this.p.wear('egypt'); this.outfit = 'egypt'; }
    if (this.mannaPool) { this.mannaPool.mat.map = shekelTexture('ancient'); this.mannaPool.mat.needsUpdate = true; }
    if (this.chaser) { this.chaser.reset(); this.chaser.setEra('egypt'); }
  }

  get word() { return this.wordOrder[this.wordPos % this.wordOrder.length]; }
  get needLetter() { return [...this.word.he][this.letterIdx]; }

  // ------------------------------------------------------------ input
  bindInput() {
    // Phones only allow sound that starts inside a tap, so unlock audio on every touch, click or key.
    const unlock = () => { if (!this.muted) this.sound.unlock(); };
    for (const ev of ['pointerdown', 'touchend', 'click', 'keydown']) window.addEventListener(ev, unlock, { capture: true, passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && this.sound.ctx) this.sound.ctx.resume().catch(() => {}); });
    window.addEventListener('keydown', (e) => {
      const k = e.key;
      const typing = e.target && /input|textarea|select/i.test(e.target.tagName);
      if (typing) return;
      if (k === 'm' || k === 'M') { this.toggleSound(); return; }
      if (this.state === 'playing') {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(k)) e.preventDefault();
        if (e.repeat) return;
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') this.move(-1);
        else if (k === 'ArrowRight' || k === 'd' || k === 'D') this.move(1);
        else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === ' ' || k === 'Spacebar') this.jump();
        else if (k === 'ArrowDown' || k === 's' || k === 'S') this.slide();
        else if (k === 'p' || k === 'P' || k === 'Escape') this.pause();
        else if (k === 'e' || k === 'E' || k === 'Shift') this.useStar();
      } else if (this.state === 'paused') {
        if (k === 'p' || k === 'P' || k === 'Escape') { e.preventDefault(); this.resume(); }
      } else if (this.state === 'word') {
        if (['ArrowUp', ' ', 'Spacebar', 'Enter'].includes(k)) e.preventDefault();
        if (!e.repeat && ['Enter', ' ', 'Spacebar', 'ArrowUp'].includes(k)) this.continueWord();
      } else if (this.state === 'ride') {
        if ([' ', 'Spacebar', 'Enter', 'Escape'].includes(k)) { e.preventDefault(); if (!e.repeat) this.skipRide(); }
      } else if (this.state === 'countdown') {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(k)) e.preventDefault();
      } else if (this.state === 'menu' || this.state === 'over') {
        const onButton = e.target && e.target.closest && e.target.closest('button, summary, a');
        if ((k === 'Enter' || k === ' ') && !onButton && document.getElementById('screen-scroll').hidden && document.getElementById('screen-shop').hidden) {
          e.preventDefault();
          this.start();
        }
      }
    });

    const surface = document.getElementById('app');
    surface.addEventListener('pointerdown', (e) => {
      if (this.state !== 'playing' || (e.target.closest && e.target.closest('button, a, summary, .screen'))) return;
      this.touch = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), fired: false };
    });
    surface.addEventListener('pointermove', (e) => {
      const t = this.touch;
      if (!t || t.id !== e.pointerId || t.fired || this.state !== 'playing') return;
      const dx = e.clientX - t.x, dy = e.clientY - t.y;
      const th = Math.max(20, Math.min(window.innerWidth, window.innerHeight) * 0.04);
      if (Math.abs(dx) < th && Math.abs(dy) < th) return;
      t.fired = true;
      if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 1 : -1);
      else if (dy < 0) this.jump();
      else this.slide();
    });
    const end = (e) => {
      const t = this.touch;
      if (!t || t.id !== e.pointerId) return;
      if (!t.fired && this.state === 'playing' && performance.now() - t.t < 350) {
        // Double-tap uses a Star shield from your stash, like the hoverboard in Subway Surfers.
        const now = performance.now();
        if (now - (this.lastTap || 0) < 320) { this.useStar(); this.lastTap = 0; } else { this.jump(); this.lastTap = now; }
      }
      this.touch = null;
    };
    surface.addEventListener('pointerup', end);
    surface.addEventListener('pointercancel', () => { this.touch = null; });
    surface.addEventListener('contextmenu', (e) => { if (this.state === 'playing') e.preventDefault(); });
  }

  move(dir) {
    const nl = clamp(this.lane + dir, 0, 2);
    if (nl === this.lane) return;
    this.prevLane = this.lane;
    this.lane = nl;
    this.sound.play('lane');
  }

  jump() {
    if (this.powers.jetpack > 0) return;
    if (this.grounded) this.doJump();
    else this.jumpBuf = 0.15;
  }

  doJump() {
    this.vy = this.powers.sneakers > 0 ? JUMP_V * 1.95 : JUMP_V;
    this.grounded = false;
    this.slideT = 0;
    this.sound.play('jump');
    const c = this.world.cur.ground;
    this.world.burst(this.x, 0.15, 0.2, 5, { dust: true, color: [c.r, c.g, c.b], speed: 1.4, up: 0.8, life: 0.5, grav: 0.5 });
  }

  slide() {
    if (this.powers.jetpack > 0) return;
    if (!this.grounded) { this.vy = Math.min(this.vy, -18); this.slideBuf = 0.35; return; }
    if (this.slideT <= 0) this.sound.play('slide');
    this.slideT = SLIDE_TIME;
  }

  // ------------------------------------------------------------ screens
  start() {
    if ((this.state === 'over' || this.state === 'paused') && this.dist > 25) { this.startRide(); return; }
    this.sound.init();
    this.sound.play('click');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    const fromMenu = this.state === 'menu';
    this.state = 'playing';
    this.resetRun();
    if (!fromMenu) this.camBlend = 1;
    this.ui.show(null);
    this.refreshHud();
    if (!this.muted) this.sound.startMusic();
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!this.store.played || this.store.runs < 3) {
      this.ui.hint(coarse
        ? '<b>Swipe</b> left or right to change lanes · <b>up</b> to jump · <b>down</b> to slide'
        : '<b>← →</b> change lanes · <b>↑</b> or <b>Space</b> jump · <b>↓</b> slide · <b>P</b> pause', 5200);
    }
    this.store.played = true;
    this.store.runs = (this.store.runs || 0) + 1;
    saveStore(this.store);
    this.applyBoosts();
  }

  // ------------------------------------------------------------ shop
  openShop() {
    this.ui.renderShop(this.store.wallet || 0, this.store.inv || {}, this.store.up || {});
    this.ui.show('screen-shop');
  }

  upLevel(id) { return ((this.store.up || {})[id]) || 0; }

  jetTime() { return POWERS.jetpack.time + this.upLevel('jet'); }

  bankManna() {
    if (this.banked) return;
    this.banked = true;
    this.store.wallet = (this.store.wallet || 0) + this.mannaCount;
  }

  // Bonus manna for every new word, and bigger bonuses at word-count milestones.
  wordBonus(isNew) {
    let bonus = 0;
    const msgs = [];
    if (isNew) { bonus += 25; msgs.push('New word +25'); }
    const n = this.learned.size;
    const m = ACHIEVEMENTS.find((a) => a.words === n);
    if (isNew && m) { bonus += m.manna; msgs.push(`${m.words} words learned! +${m.manna}`); }
    if (bonus) {
      this.mannaCount += bonus;
      setTimeout(() => this.ui.popup(msgs.join(' · ')), 500);
    }
  }

  buyUpgrade(id) {
    const u = UPGRADES.find((x) => x.id === id);
    const lvl = this.upLevel(id);
    const price = u && u.price * (lvl + 1);
    const wallet = this.store.wallet || 0;
    if (!u || lvl >= u.max || wallet < price) { this.sound.play('bump'); return; }
    this.store.wallet = wallet - price;
    this.store.up = this.store.up || {};
    this.store.up[id] = lvl + 1;
    saveStore(this.store);
    this.sound.init();
    this.sound.play('word');
    this.ui.renderShop(this.store.wallet, this.store.inv || {}, this.store.up);
  }

  buy(type) {
    const item = SHOP.find((i) => i.type === type);
    const wallet = this.store.wallet || 0;
    if (!item || wallet < item.price) { this.sound.play('bump'); return; }
    this.store.wallet = wallet - item.price;
    this.store.inv = this.store.inv || {};
    this.store.inv[type] = (this.store.inv[type] || 0) + 1;
    saveStore(this.store);
    this.sound.init();
    this.sound.play('power');
    this.ui.renderShop(this.store.wallet, this.store.inv, this.store.up || {});
  }

  // Power-ups bought in the shop switch on at the start of the next run (one of each).
  applyBoosts() {
    const inv = this.store.inv || {};
    const used = [];
    for (const it of SHOP) {
      if (it.type === 'shield') continue; // Star shields are kept in your stash and used when you choose.
      if (!(inv[it.type] > 0)) continue;
      inv[it.type]--;
      used.push(it.name);
      if (it.type === 'jetpack') this.startJetpack();
      else if (it.type === 'heart') { this.nextHeartWz = this.dist + 250; } // one heart to pick up
      else this.powers[it.type] = POWERS[it.type].time;
    }
    if (used.length) {
      saveStore(this.store);
      this.ui.popup('Shop boost: ' + used.join(', '));
    }
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.sound.stopMusic();
    this.ui.show('screen-pause');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.sound.init();
    this.ui.show(null);
    if (!this.muted) this.sound.startMusic();
    // Count back in, and clear anything you would hit before you could react.
    this.startCountdown(() => this.clearAhead(Math.max(6, this.speed * 0.5), false));
  }

  // ------------------------------------------------------------ word pause, countdown, train
  startCountdown(onGo) {
    this.state = 'countdown';
    this.cdT = 0;
    this.cdN = 0;
    this.onGo = onGo;
  }

  updateCountdown(dt) {
    this.cdT += dt;
    const n = 3 - Math.floor(this.cdT / 0.334);
    if (n >= 1 && n !== this.cdN) { this.cdN = n; this.ui.countdown(n); this.sound.play('tick'); }
    if (this.cdT >= 1.0) {
      this.ui.countdown(null);
      this.sound.play('go');
      this.state = 'playing';
      const f = this.onGo;
      this.onGo = null;
      if (f) f();
    }
  }

  clearAhead(range, golden) {
    for (const o of this.obs) {
      const ahead = o.wz - this.dist;
      if (o.alive && ahead > -1 && ahead < range) this.blast(o);
    }
    if (golden) {
      this.ring.visible = true;
      this.ringT = 0;
    }
  }

  continueWord() {
    if (this.state !== 'word' || !this.ui.wordArmed) return;
    this.sound.play('click');
    this.ui.show(null);
    this.ui.setWord(this.word, this.letterIdx);
    this.startCountdown(() => {
      this.clearAhead(Math.max(26, this.speed * 1.7), true);
      this.invuln = Math.max(this.invuln, 0.4);
    });
  }

  startRide() {
    if (this.state === 'paused') { this.bankManna(); saveStore(this.store); }
    this.sound.init();
    this.sound.play('click');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    for (const o of this.obs) this.releaseObs(o);
    this.obs.length = 0;
    for (const m of this.manna) this.freeManna(m);
    this.manna.length = 0;
    for (const q of this.pickups) this.releasePickup(q);
    this.pickups.length = 0;
    this.mannaPool.flush();
    this.ring.visible = false;
    this.ui.show(null);
    this.ui.hud(false);
    this.ui.hideHint();
    this.state = 'ride';
    this.speed = 0;
    this.lane = 1;
    this.vy = 0; this.grounded = true; this.slideT = 0; this.hurtT = 0; this.invuln = 0;
    this.powers = { shield: 0, magnet: 0, double: 0, jetpack: 0, sneakers: 0 };
    this.p.root.visible = true;
    this.ride.start();
    if (!this.muted) this.sound.startMusic();
  }

  // ------------------------------------------------------------ second-chance quiz
  // Out of hearts? Answer a quiz on your words to keep running. Each revive in the same run
  // asks 3 more questions. Words you answer correctly count as known and are never asked again.
  startQuiz() {
    const known = new Set(this.store.known || []);
    const n = 3 * (this.revives + 1);
    const fresh = (list) => list.filter((w) => !known.has(w.he));
    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    let pool = shuffle(fresh(WORDS.filter((w) => this.learned.has(w.he))));
    if (pool.length < n) pool = pool.concat(shuffle(fresh(WORDS.filter((w) => !this.learned.has(w.he)))));
    if (pool.length < n) return false;
    this.quiz = { qs: pool.slice(0, n), i: 0, right: 0 };
    this.state = 'quiz';
    this.sound.play('bump');
    this.ui.hideHint();
    this.askQuiz();
    return true;
  }

  // At Ben Gurion Airport you must pass a 5-question Hebrew test (4 right) to fly to New York.
  startBoardingTest() {
    const pool = WORDS.slice().sort(() => Math.random() - 0.5).slice(0, 5);
    this.quiz = { qs: pool, i: 0, right: 0, mode: 'board' };
    this.state = 'quiz';
    this.touch = null;
    this.ui.hideHint();
    this.ui.quizTitle('Ben Gurion Airport · Hebrew boarding test');
    this.sound.play('banner');
    this.askQuiz();
  }

  askQuiz() {
    const q = this.quiz;
    const w = q.qs[q.i];
    const wrong = WORDS.filter((x) => x.en !== w.en).sort(() => Math.random() - 0.5).slice(0, 3).map((x) => x.en);
    const options = [w.en, ...wrong].sort(() => Math.random() - 0.5);
    const need = Math.ceil((q.qs.length * 2) / 3);
    this.ui.quiz(w, options, q.i, q.qs.length, q.right, need, (pick) => this.answerQuiz(pick));
  }

  answerQuiz(pick) {
    const q = this.quiz;
    const w = q.qs[q.i];
    const ok = pick === w.en;
    if (ok) {
      q.right++;
      this.store.known = [...new Set([...(this.store.known || []), w.he])];
      saveStore(this.store);
      this.sound.play('letter');
    } else this.sound.play('bump');
    q.i++;
    setTimeout(() => {
      if (this.state !== 'quiz') return;
      if (q.i < q.qs.length) { this.askQuiz(); return; }
      const need = Math.ceil((q.qs.length * 2) / 3);
      if (q.mode === 'board') {
        this.ui.show(null);
        this.ui.quizTitle('Second chance · word quiz');
        if (q.right >= need) {
          this.boarded = true;
          this.ui.flash();
          this.sound.play('whoosh');
          this.ui.popup(`${q.right}/${q.qs.length}! Boarding pass approved. Flying to New York!`);
          this.startCountdown(() => { this.clearAhead(Math.max(30, this.speed * 2), true); this.invuln = Math.max(this.invuln, 1.5); });
        } else {
          this.endTitle = 'You missed your flight';
          this.state = 'dying';
          this.deadT = 0;
          this.sound.stopMusic();
          this.sound.play('over');
        }
        return;
      }
      if (q.right >= need) {
        this.revives++;
        this.hearts = 1;
        this.hurtT = 0;
        this.ui.show(null);
        this.ui.setHearts(this.hearts, this.maxHearts);
        this.ui.popup(`${q.right}/${q.qs.length} correct! Keep running`);
        this.sound.play('word');
        this.startCountdown(() => { this.clearAhead(Math.max(26, this.speed * 1.7), true); this.invuln = Math.max(this.invuln, 1.5); });
      } else {
        this.ui.show(null);
        this.state = 'dying';
        this.deadT = 0;
        this.sound.stopMusic();
        this.sound.play('over');
      }
    }, 900);
  }

  // New region, new clothes: a puff of sparkles hides the quick change.
  dressFor(bi) {
    const id = BIOMES[bi].id;
    if (this.outfit === id) return;
    this.outfit = id;
    this.p.wear(id);
    this.mannaPool.mat.map = shekelTexture(COIN_ERA[id] || 'modern');
    this.mannaPool.mat.needsUpdate = true;
    this.chaser.setEra(id);
    if (this.state === 'playing') this.world.burst(this.x, 1.0, 0, 14, { color: [1, 0.95, 0.8], speed: 2.5, up: 2, life: 0.5 });
  }

    starCount() { return ((this.store.inv || {}).shield) || 0; }

  // Spend one Star shield from the stash, any time during a run.
  useStar() {
    if (this.state !== 'playing' || this.powers.shield > 0 || this.starCount() < 1) { if (this.starCount() < 1) this.sound.play('bump'); return; }
    this.store.inv.shield--;
    saveStore(this.store);
    this.powers.shield = POWERS.shield.time;
    this.sound.play('power');
    this.ui.popup('Star shield!');
    this.world.burst(this.x, 1, 0, 20, { color: [0.6, 0.85, 1], speed: 4, up: 3, life: 0.6 });
    this.ui.setStars(this.starCount());
  }

  refreshHud() {
    this.ui.setStars(this.starCount());
    this.ui.hud(true);
    this.ui.last = {};
    this.ui.setHearts(this.hearts, this.maxHearts);
    this.ui.setWord(this.word, this.letterIdx);
    this.ui.setPowers([]);
    this.ui.setScore(this.score);
    this.ui.setDist(this.dist);
    this.ui.setManna(this.mannaCount);
  }

  skipRide() {
    if (this.state === 'ride') this.ride.skip();
  }

  endRide() {
    const cam = this.world.camera;
    cam.fov = this.world.baseFov;
    cam.updateProjectionMatrix();
    this.state = 'countdown';
    this.resetRun(true);
    this.camBlend = 1;
    this.refreshHud();
    this.generate();
    this.updateObstacles(0);
    this.store.runs = (this.store.runs || 0) + 1;
    saveStore(this.store);
    this.applyBoosts();
    this.startCountdown(null);
  }

  home() {
    if (this.state === 'paused') { this.bankManna(); saveStore(this.store); }
    this.sound.stopMusic();
    this.sound.play('click');
    this.state = 'menu';
    this.resetRun();
    this.ui.hud(false);
    this.ui.hideHint();
    this.ui.setBest(this.best, this.learned.size, WORDS.length);
    this.ui.show('screen-start');
  }

  toggleSound() {
    this.sound.init();
    this.muted = !this.muted;
    this.sound.setMuted(this.muted);
    if (this.muted) this.sound.stopMusic();
    else if (this.state === 'playing') this.sound.startMusic();
    this.store.muted = this.muted;
    saveStore(this.store);
    this.ui.setSound(!this.muted);
  }

  openScroll() {
    this.scrollReturn = this.state === 'over' ? 'screen-over' : 'screen-start';
    this.ui.renderScroll(WORDS, this.learned);
    this.ui.show('screen-scroll');
  }

  closeScroll() { this.ui.show(this.scrollReturn || 'screen-start'); }

  die() {
    if (this.startQuiz()) return;
    this.state = 'dying';
    this.deadT = 0;
    this.sound.stopMusic();
    this.sound.play('over');
  }

  finish() {
    this.state = 'over';
    const score = Math.floor(this.score);
    const newBest = score > this.best.score;
    if (newBest) this.best.score = score;
    this.best.dist = Math.max(this.best.dist, Math.floor(this.dist));
    this.store.bestScore = this.best.score;
    this.store.bestDist = this.best.dist;
    this.store.learned = [...this.learned];
    this.bankManna();
    saveStore(this.store);
    const bi = biomeIndexAt(this.dist);
    const lap = this.dist >= JLM_START ? 1 : Math.floor(this.dist / LAP) + 1;
    const place = BIOMES[bi].name.replace(/^The /, 'the ');
    const n = this.wordsDone.length;
    const partial = this.letterIdx > 0 ? `${[...this.word.he].slice(0, this.letterIdx).join('')} of ${this.word.he}` : '';
    this.ui.hud(false);
    this.ui.hideHint();
    this.ui.gameOver({
      title: this.endTitle || `You reached ${place}`,
      sub: (lap > 1 ? `Journey ${lap}. ` : '') + (n ? `You wrote ${n} word${n === 1 ? '' : 's'} of Torah on your scroll.` : 'Catch the golden letters in order to write a word on your scroll.'),
      score, dist: this.dist, manna: this.mannaCount, words: this.wordsDone, newBest, partial,
    });
    this.ui.setBest(this.best, this.learned.size, WORDS.length);
    this.ui.show('screen-over');
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.world.resize(w, h);
  }

  // ------------------------------------------------------------ pools
  getShadow(w, d) {
    const s = this.shadowPool.pop() || new THREE.Mesh(this.shadowGeo, this.shadowMat);
    if (!s.parent) this.scene.add(s);
    s.visible = true;
    s.scale.set(w, 1, d);
    return s;
  }

  spawnObstacle(type, laneIdx, wz) {
    const def = OBSTACLES[type];
    const pool = this.obsPools[type] || (this.obsPools[type] = []);
    let mesh = pool.pop();
    if (!mesh) { mesh = new THREE.Mesh(obstacleGeo(type), flatMat); this.scene.add(mesh); }
    mesh.visible = true;
    mesh.rotation.set(0, 0, 0);
    mesh.scale.setScalar(1);
    const b = def.boxes[0];
    const o = {
      type, def, kind: def.kind, lane: laneIdx, x: LANES[laneIdx], wz, mesh,
      y: def.roll ? -b[2] : 0, by: 0, spin: 0, alive: true, active: false, blastT: 0, vy: 0, zp: undefined,
      shadow: this.getShadow((b[1] - b[0]) * 1.25, (b[5] - b[4]) * 1.4 + 0.4),
    };
    this.obs.push(o);
    return o;
  }

  releaseObs(o) {
    o.mesh.visible = false;
    (this.obsPools[o.type] || (this.obsPools[o.type] = [])).push(o.mesh);
    o.shadow.visible = false;
    this.shadowPool.push(o.shadow);
  }

  addManna(wz, laneIdx, y) {
    const slot = this.mannaFree.pop();
    if (slot === undefined) return;
    this.manna.push({ wz, x: LANES[laneIdx], y, slot, ph: Math.random() * 6, pulled: false });
  }

  freeManna(m) { this.mannaPool.hide(m.slot); this.mannaFree.push(m.slot); }

  letterMat(ch) {
    if (!this.letterMats[ch]) this.letterMats[ch] = new THREE.SpriteMaterial({ map: letterTexture(ch), transparent: true, depthWrite: false });
    return this.letterMats[ch];
  }

  powerMat(type) {
    if (!this.powerMats[type]) this.powerMats[type] = new THREE.SpriteMaterial({ map: powerTexture(type), transparent: true, depthWrite: false });
    return this.powerMats[type];
  }

  addPickup(kind, type, wz, laneIdx, y) {
    const sprite = this.spritePool.pop() || new THREE.Sprite();
    if (!sprite.parent) this.scene.add(sprite);
    sprite.visible = true;
    sprite.material = kind === 'letter' ? this.letterMat(this.needLetter) : this.powerMat(type);
    const size = kind === 'letter' ? 1.35 : 1.2;
    sprite.scale.set(size, size, 1);
    const p = { kind, type, wz, x: LANES[laneIdx], y, sprite, ph: Math.random() * 6, beacon: null };
    if (kind === 'letter') {
      const b = this.beacons.pop() || new THREE.Mesh(this.beaconGeo, this.beaconMat);
      if (!b.parent) this.scene.add(b);
      b.visible = true;
      p.beacon = b;
    }
    this.pickups.push(p);
  }

  releasePickup(p) {
    p.sprite.visible = false;
    this.spritePool.push(p.sprite);
    if (p.beacon) { p.beacon.visible = false; this.beacons.push(p.beacon); }
  }

  // ------------------------------------------------------------ track generation
  generate() {
    const limit = this.dist + SPAWN_AHEAD;
    while (this.spawnCursor < limit) {
      const a = this.spawnCursor;
      if (a < 55) { this.fillGap(a, 55, null); this.spawnCursor = 55; continue; }
      const sp = speedAt(a), d = diffAt(a);
      const gapT = 1.1 - 0.4 * d + rnd(0, 0.25);
      const b = a + Math.max(11, sp * gapT);
      const row = this.makeRow(b, d, BIOMES[biomeIndexAt(b)].id);
      this.fillGap(a, b, row);
      this.prevRow = row;
      this.spawnCursor = b + (row.extra || 0);
    }
  }

  makeRow(wz, d, biome) {
    const set = BIOME_OBSTACLES[biome];
    const lanes = [null, null, null];
    let safe = clamp(this.lastSafe + Math.floor(rnd(-1, 2)), 0, 2);
    const kind = () => { const r = Math.random(); return r < 0.4 ? 'low' : r < 0.7 ? 'high' : 'tall'; };
    const prevFree = [0, 1, 2].filter((i) => !this.prevRow || !this.prevRow.lanes[i]);
    // Ramp up onto an elevated walkway: run along the top, then drop off the end.
    if (d > 0.03 && Math.random() < 0.16) {
      const sp = speedAt(wz);
      const ln = safe;
      const n = 2 + Math.floor(Math.random() * 2);
      // Sometimes a tall version: a ramp twice as long up to a walkway twice as high.
      const sy = Math.random() < 0.4 ? 2 : 1;
      const r = this.spawnObstacle('ramp', ln, wz + 1.6 * sy);
      r.sy = sy; r.sz = sy; r.mesh.scale.set(1, sy, sy);
      for (let k = 0; k < n; k++) {
        const o = this.spawnObstacle('deck', ln, wz + 3.2 * sy + 8 + k * 16);
        o.sy = sy; o.mesh.scale.set(1, sy, 1);
      }
      const len = 3.2 * sy + n * 16;
      // Once the run gets harder, a tall obstacle can sit beside the walkway.
      if (d > 0.2) {
        const talls = set.tall.filter((t) => !OBSTACLES[t].roll);
        // Block at most one side lane, so there is always a way through on the ground too.
        const side = [0, 1, 2].filter((i) => i !== ln);
        if (Math.random() < 0.6) this.spawnObstacle(pick(talls), pick(side), wz + len * 0.5);
      }
      for (let z = wz + 3.2 * sy; z < wz + len - 1; z += 3.6) this.addManna(z, ln, 1.25 * sy + 0.75);
      this.lastSafe = ln;
      return { lanes: [null, null, null], safe: ln, wz, extra: len + sp * 0.45 };
    }
    const wSingle = 0.25 - 0.15 * d, wDouble = 0.5 + 0.2 * d, wTriple = d > 0.1 ? 0.15 + 0.3 * d : 0;
    const wRoll = set.roll.length && prevFree.length ? 0.16 : 0;
    let r = Math.random() * (wSingle + wDouble + wTriple + wRoll);
    if ((r -= wSingle) < 0) {
      const ln = Math.random() < 0.55 ? this.lastSafe : Math.floor(rnd(0, 3));
      lanes[ln] = kind();
      if (ln === safe) safe = (ln + 1 + Math.floor(rnd(0, 2))) % 3;
    } else if ((r -= wDouble) < 0) {
      for (let i = 0; i < 3; i++) if (i !== safe) lanes[i] = kind();
    } else if ((r -= wTriple) < 0) {
      for (let i = 0; i < 3; i++) lanes[i] = i === safe ? (Math.random() < 0.55 ? 'low' : 'high') : kind();
    } else {
      const ln = pick(prevFree);
      lanes[ln] = 'roll';
      if (ln === safe) safe = (ln + 1 + Math.floor(rnd(0, 2))) % 3;
    }
    let longest = 0;
    for (let i = 0; i < 3; i++) {
      const k = lanes[i];
      if (!k) continue;
      const type = pick(set[k]);
      this.spawnObstacle(type, i, wz + (k === 'roll' ? 30 : 0));
      // Long obstacles: tall ones often come as a line of 2-4 in the same lane, like train cars.
      if (k === 'tall' && Math.random() < 0.55) {
        const b = OBSTACLES[type].boxes[0], step = b[5] - b[4] + 0.15;
        const n = 1 + Math.floor(Math.random() * 3);
        for (let c = 1; c <= n; c++) this.spawnObstacle(type, i, wz + c * step);
        longest = Math.max(longest, n * step);
      }
    }
    this.lastSafe = safe;
    return { lanes, safe, wz, extra: longest };
  }

  fillGap(a, b, row) {
    if (b - a < 8) return;
    const used = [false, false, false];
    const place = (wz) => {
      const free = [0, 1, 2].filter((i) => !used[i]);
      const ln = pick(free);
      used[ln] = true;
      return ln;
    };
    if (this.nextLetterWz < b - 4) {
      // Keep letters clear of the barrier just behind them, so you have time to react.
      const wz = clamp(Math.max(this.nextLetterWz, a + Math.max(4, speedAt(a) * 0.55)), a + 4, b - 4);
      const ln = place(wz);
      // Some letters float out of reach from the ground: jump to grab them.
      // Never put a high letter right after or before a slide-under barrier in its lane.
      const slideNear = (this.prevRow && this.prevRow.lanes[ln] === 'high') || (row && row.lanes[ln] === 'high');
      const high = wz > 120 && !slideNear && Math.random() < 0.45;
      this.addPickup('letter', null, wz, ln, high ? 2.7 : 1.05);
      this.nextLetterWz = wz + speedAt(wz) * rnd(3.4, 4.8);
    }
    if (this.nextPowerWz < b - 4 && a > 60) {
      const wz = clamp(this.nextPowerWz, a + 4, b - 4);
      const r = Math.random();
      const type = r < 0.17 ? 'shield' : r < 0.33 ? 'magnet' : r < 0.45 ? 'double' : r < 0.56 ? 'shofar' : r < 0.78 ? 'jetpack' : 'sneakers';
      this.addPickup('power', type, wz, place(wz), 1.05);
      this.nextPowerWz = wz + rnd(260, 400);
    }
    if (this.nextHeartWz < b - 4) {
      const wz = clamp(this.nextHeartWz, a + 4, b - 4);
      this.addPickup('power', 'heart', wz, place(wz), 1.05);
      this.nextHeartWz = Infinity;
    }
    if (row) {
      const ln = row.safe;
      if (!used[ln]) for (let z = a + 4; z < b - 5; z += 3.6) this.addManna(z, ln, 0.75);
      // Extra lines of manna in other open lanes.
      for (let i = 0; i < 3; i++) {
        if (i === ln || used[i] || Math.random() > 0.45) continue;
        for (let z = a + 5; z < b - 7; z += 3.6) this.addManna(z, i, 0.75);
      }
      if (row.lanes[ln] === 'low') {
        for (let k = -3; k <= 3; k++) this.addManna(b + k * 1.7, ln, 0.75 + Math.sin(((k + 3) / 6) * Math.PI) * 1.55);
      } else if (row.lanes[ln] === 'high') {
        for (let k = -2; k <= 2; k++) this.addManna(b + k * 1.5, ln, 0.4);
      }
    } else if (!row) {
      for (let z = a + 10; z < b - 2; z += 3.6) this.addManna(z, 1, 0.75);
    }
  }

  // ------------------------------------------------------------ update
  update(dt) {
    this.runTime = (this.runTime || 0) + dt;
    this.speedFactor = Math.min(1, this.speedFactor + dt * 0.35);
    const target = speedAt(this.dist) * this.speedFactor * (1 + 0.05 * this.upLevel('speed'));
    // Passive manna upgrade: a trickle of manna while you run.
    const pl = this.upLevel('passive');
    if (pl > 0) {
      this.passiveT += dt;
      if (this.passiveT >= 2) { this.passiveT -= 2; this.mannaCount += pl; }
    }
    this.speed += (target - this.speed) * Math.min(1, dt * 3);
    this.sound.setTempo(this.speed);
    this.dist += this.speed * dt;
    this.score += this.speed * dt;
    if (!this.boarded && this.dist >= GATE_AT) { this.startBoardingTest(); return; }
    this.generate();

    const bi = biomeIndexAt(this.dist);
    if (bi !== this.biomeShown) this.dressFor(bi);
    if (bi !== this.biomeShown) {
      if (this.biomeShown !== -1 || this.dist > 1) {
        this.ui.banner(BIOMES[bi], this.dist >= JLM_START ? 1 : Math.floor(this.dist / LAP) + 1);
        this.sound.play('banner');
      }
      this.biomeShown = bi;
    }
    if (this.comboT > 0) { this.comboT -= dt; if (this.comboT <= 0) this.combo = 0; }

    this.updatePlayer(dt);
    this.updateObstacles(dt);
    this.updateManna(dt);
    this.updatePickups(dt);

    this.ui.setScore(this.score);
    this.ui.setDist(this.dist);
    this.ui.setManna(this.mannaCount);
    this.ui.setHearts(this.hearts, this.maxHearts);
    const list = [];
    for (const k of ['jetpack', 'sneakers', 'shield', 'magnet', 'double']) if (this.powers[k] > 0) list.push({ type: k, frac: this.powers[k] / (k === 'jetpack' ? this.jetTime() : POWERS[k].time) });
    this.ui.setPowers(list);
  }

  updatePlayer(dt) {
    const tx = LANES[this.lane];
    this.x += (tx - this.x) * (1 - Math.exp(-dt * 16));
    if (this.powers.jetpack > 0) {
      this.grounded = false;
      this.vy = 0;
      this.y += (JET_Y - this.y) * (1 - Math.exp(-dt * 3));
      if (this.powers.jetpack <= dt) { this.invuln = Math.max(this.invuln, 1.2); this.ui.popup('Landing'); }
      if (Math.random() < 0.6) this.world.burst(this.x, this.y + 0.4, 0.35, 1, { color: [1, 0.6 + Math.random() * 0.3, 0.2], speed: 0.6, up: -3, life: 0.35, grav: 4 });
    } else if (this.grounded) {
      const gh = this.groundHeight();
      if (gh >= this.y - 0.35) this.y = gh;
      else { this.grounded = false; this.vy = 0; }
    }
    if (this.powers.jetpack <= 0 && !this.grounded) {
      const grav = this.powers.sneakers > 0 ? GRAV * 1.35 : GRAV;
      this.vy -= grav * dt;
      this.y += this.vy * dt;
      const gh = this.groundHeight();
      if (this.y <= gh && this.vy <= 0) {
        this.y = gh; this.vy = 0; this.grounded = true;
        const c = this.world.cur.ground;
        this.world.burst(this.x, 0.1, 0.1, 6, { dust: true, color: [c.r, c.g, c.b], speed: 2, up: 0.6, life: 0.45, grav: 0.5 });
        if (this.jumpBuf > 0) { this.jumpBuf = 0; this.doJump(); }
        else if (this.slideBuf > 0) { this.slideBuf = 0; this.slideT = SLIDE_TIME; this.sound.play('slide'); }
      }
    }
    this.jumpBuf = Math.max(0, this.jumpBuf - dt);
    this.slideBuf = Math.max(0, this.slideBuf - dt);
    if (this.slideT > 0) this.slideT -= dt;
    this.invuln = Math.max(0, this.invuln - dt);
    this.hurtT = Math.max(0, this.hurtT - dt);
    for (const k in this.powers) if (this.powers[k] > 0) this.powers[k] = Math.max(0, this.powers[k] - dt);

    this.dustT -= dt;
    if (this.grounded && this.dustT <= 0) {
      this.dustT = 0.09;
      const c = this.world.cur.ground;
      this.world.burst(this.x + rnd(-0.15, 0.15), 0.08, 0.35, 1, { dust: true, color: [c.r * 0.95, c.g * 0.92, c.b * 0.88], speed: 0.6, up: 0.6, life: 0.4, grav: 0.4 });
    }
  }

  playerBox() {
    const h = this.slideT > 0 && this.grounded ? 0.62 : 1.5;
    return [this.x - 0.28, this.x + 0.28, this.y, this.y + h, -0.25, 0.25];
  }

  updateObstacles(dt) {
    const pb = this.playerBox();
    for (let i = this.obs.length - 1; i >= 0; i--) {
      const o = this.obs[i];
      if (o.def.roll && o.alive) {
        if (o.wz - this.dist < 80) o.active = true;
        if (o.active) {
          o.wz -= o.def.roll * dt;
          o.spin += ((this.speed + o.def.roll) * dt) / Math.max(0.4, o.y);
        }
        if (o.def.bounce) o.by = Math.abs(Math.sin(o.spin * 0.45)) * 0.3;
      }
      const z = this.dist - o.wz;
      const zp = o.zp === undefined ? z : o.zp;
      o.zp = z;
      if (z > 16) { this.releaseObs(o); this.obs.splice(i, 1); continue; }
      if (!o.alive) {
        o.blastT += dt;
        o.vy -= 20 * dt;
        o.by += o.vy * dt;
        o.mesh.rotation.x += dt * 6;
        o.mesh.rotation.z += dt * 3;
        o.mesh.scale.setScalar(Math.max(0.01, 1 - o.blastT * 1.6));
        o.mesh.position.set(o.x, o.y + o.by, z);
        o.shadow.visible = false;
        if (o.blastT > 0.65) { this.releaseObs(o); this.obs.splice(i, 1); }
        continue;
      }
      o.mesh.position.set(o.x, o.y + o.by, z);
      if (o.def.roll) o.mesh.rotation.x = o.spin;
      o.shadow.position.set(o.x, 0.025, z);
      if (this.state === 'playing' && this.hits(o, zp, z, pb)) {
        if (o.kind === 'ramp') { /* walkable */ } else if (o.kind === 'deck') { if (this.y < 1.25 * (o.sy || 1) - 0.15) this.onHit(o); } else this.onHit(o);
      }
    }
  }

  // Height of whatever the runner stands on: the road, a ramp slope or an elevated deck.
  groundHeight() {
    let h = 0;
    for (const o of this.obs) {
      if (!o.alive || (o.kind !== 'ramp' && o.kind !== 'deck') || Math.abs(this.x - o.x) > 0.7) continue;
      const lz = -(this.dist - o.wz);
      const sy = o.sy || 1, half = 1.6 * (o.sz || 1);
      if (o.kind === 'deck') { if (lz >= -8.05 && lz <= 8.05) h = Math.max(h, 1.25 * sy); }
      else if (lz >= -half && lz <= half) h = Math.max(h, ((half - lz) / (2 * half)) * 1.25 * sy);
    }
    return h;
  }

  launch(o) {
    if (o.used || this.powers.jetpack > 0 || this.vy > 4) return;
    o.used = true;
    this.vy = RAMP_V;
    this.grounded = false;
    this.slideT = 0;
    this.sound.play('whoosh');
    this.ui.popup('Launch!');
    this.world.burst(this.x, 0.8, 0, 10, { color: [1, 0.85, 0.5], speed: 3, up: 3, life: 0.5 });
  }

  startJetpack() {
    this.powers.jetpack = this.jetTime();
    this.grounded = false;
    this.slideT = 0;
    this.sound.play('whoosh');
    // A weaving trail of manna up in the air.
    const sp = Math.max(this.speed, speedAt(this.dist));
    let ln = this.lane;
    for (let z = this.dist + 12; z < this.dist + sp * (this.jetTime() - 0.8); z += 2.4) {
      if (Math.random() < 0.06) ln = clamp(ln + (Math.random() < 0.5 ? -1 : 1), 0, 2);
      this.addManna(z, ln, JET_Y + 0.6);
    }
  }

  hits(o, zp, z, pb) {
    const zMin = Math.min(zp, z), zMax = Math.max(zp, z);
    for (const b of o.def.boxes) {
      const yb = o.y + o.by, ys = o.sy || 1;
      if (pb[1] > o.x + b[0] && pb[0] < o.x + b[1] && pb[3] > yb + b[2] * ys && pb[2] < yb + b[3] * ys &&
        pb[5] > zMin + b[4] && pb[4] < zMax + b[5]) return true;
    }
    return false;
  }

  onHit(o) {
    if (this.invuln > 0) return;
    const off = Math.abs(this.x - o.x);
    if (off > 0.62) {
      // Clipped the edge while changing lanes: bounce back, no damage.
      if (this.lane === o.lane && this.prevLane !== o.lane) this.lane = this.prevLane;
      this.invuln = 0.35;
      this.shake = 0.25;
      this.sound.play('bump');
      return;
    }
    if (this.powers.shield > 0) {
      this.powers.shield = 0;
      this.invuln = 0.8;
      this.sound.play('shield');
      this.world.burst(this.x, 1, 0, 26, { color: [0.75, 0.92, 1], speed: 6, up: 4, life: 0.8 });
      this.blast(o);
      return;
    }
    this.hearts -= 1;
    // The chaser closes in. Crash again while they are right behind you and you are caught.
    if (this.chaser.bump() && this.hearts > 0) {
      this.ui.popup(`Caught by ${this.chaser.name().replace(/^(A|An|The) /, (m) => m.toLowerCase())}!`);
      this.hearts = 0;
    } else if (this.hearts > 0) {
      this.ui.popup(`${this.chaser.name()} is right behind you!`);
    }
    this.invuln = 1.6;
    this.hurtT = 1.6;
    this.flashT = 0.35;
    this.speedFactor = 0.55;
    this.shake = 0.6;
    this.combo = 0;
    this.sound.play('hit');
    this.blast(o);
    if (this.hearts <= 0) this.die();
  }

  blast(o) {
    if (!o.alive) return;
    o.alive = false;
    o.blastT = 0;
    o.vy = 7;
    const z = this.dist - o.wz;
    this.world.burst(o.x, 0.8 + o.by, z, 22, { color: OBS_COLOR[o.type] || [0.8, 0.7, 0.5], speed: 6, up: 6, life: 0.9, spread: 2 });
    this.world.burst(o.x, 0.3, z, 6, { dust: true, color: [0.85, 0.8, 0.7], speed: 2, up: 1.5, life: 0.8, grav: 1 });
  }

  shofarBlast() {
    this.sound.play('shofar');
    this.ring.visible = true;
    this.ringT = 0;
    this.shake = 0.4;
    for (const o of this.obs) {
      const ahead = o.wz - this.dist;
      if (o.alive && ahead > -1 && ahead < 85) this.blast(o);
    }
    this.score += 50;
  }

  updateManna(dt) {
    const magnet = this.powers.magnet > 0;
    const top = this.slideT > 0 && this.grounded ? 1.05 : 1.95;
    for (let i = this.manna.length - 1; i >= 0; i--) {
      const m = this.manna[i];
      let z = this.dist - m.wz;
      if (magnet && !m.pulled && z > -18 && z < 1) m.pulled = true;
      if (m.pulled) {
        const k = 1 - Math.exp(-dt * 11);
        m.x += (this.x - m.x) * k;
        m.y += (this.y + 0.9 - m.y) * k;
        m.wz += (this.dist - m.wz) * k;
        z = this.dist - m.wz;
      }
      const y = m.y + Math.sin(this.time * 4 + m.ph) * 0.08;
      if (z > 6) { this.freeManna(m); this.manna.splice(i, 1); continue; }
      if (this.state === 'playing' && Math.abs(z) < 0.75 && Math.abs(m.x - this.x) < 0.8 && y > this.y - 0.35 && y < this.y + top) {
        this.collectManna(m, y, z);
        this.freeManna(m);
        this.manna.splice(i, 1);
        continue;
      }
      this.mannaPool.set(m.slot, m.x, y, z, 1, 1, 1, 1);
    }
    this.mannaPool.flush();
  }

  collectManna(m, y, z) {
    this.mannaCount += this.powers.double > 0 ? 2 : 1;
    this.score += this.powers.double > 0 ? 10 : 5;
    this.sound.play('manna', this.combo);
    this.combo++;
    this.comboT = 1.1;
    this.world.burst(m.x, y, z, 4, { color: [1, 0.86, 0.45], speed: 2.5, up: 2.5, life: 0.4, grav: 6 });
  }

  updatePickups(dt) {
    const need = this.needLetter;
    const top = this.slideT > 0 && this.grounded ? 1.1 : 2.0;
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      const z = this.dist - p.wz;
      if (z > 5) { this.releasePickup(p); this.pickups.splice(i, 1); continue; }
      const y = p.y + Math.sin(this.time * 3 + p.ph) * 0.12;
      if (p.kind === 'letter' && this.powers.jetpack > 0 && z > -45 && z < 1) p.y += (JET_Y + 0.6 - p.y) * Math.min(1, dt * 4);
      if (p.kind === 'letter') {
        const mat = this.letterMat(need);
        if (p.sprite.material !== mat) p.sprite.material = mat;
        p.beacon.position.set(p.x, 4.5, z);
      }
      p.sprite.position.set(p.x, y, z);
      p.sprite.material.rotation = Math.sin(this.time * 2.2 + p.ph) * 0.12;
      if (this.state === 'playing' && Math.abs(z) < 0.85 && Math.abs(p.x - this.x) < 0.85 && y > this.y - 0.5 && y < this.y + top) {
        this.collectPickup(p, y, z);
        this.releasePickup(p);
        this.pickups.splice(i, 1);
      }
    }
    if (this.ring.visible) {
      this.ringT += dt;
      const t = this.ringT / 0.75;
      this.ring.position.set(this.x, 1, -t * 70);
      this.ring.scale.setScalar(1 + t * 9);
      this.ringMat.opacity = Math.max(0, 1 - t);
      if (t >= 1) this.ring.visible = false;
    }
  }

  collectPickup(p, y, z) {
    if (p.kind === 'letter') {
      const ch = this.needLetter;
      const v = new THREE.Vector3(p.x, y, z).project(this.world.camera);
      this.ui.flyLetter(ch, (v.x + 1) / 2 * window.innerWidth, (1 - v.y) / 2 * window.innerHeight, this.letterIdx);
      this.world.burst(p.x, y, z, 18, { color: [1, 0.82, 0.3], speed: 4, up: 3, life: 0.7 });
      this.score += this.powers.double > 0 ? 60 : 30;
      this.letterIdx++;
      const letters = [...this.word.he];
      if (this.letterIdx >= letters.length) {
        const w = this.word;
        this.wordsDone.push(w);
        const isNew = !this.learned.has(w.he);
        this.learned.add(w.he);
        this.wordBonus(isNew);
        this.store.learned = [...this.learned];
        saveStore(this.store);
        this.score += 150 + 25 * letters.length;
        this.sound.play('word');
        this.wordPos++;
        this.letterIdx = 0;
        this.nextLetterWz = Math.max(this.nextLetterWz, this.spawnCursor + 15);
        this.world.burst(this.x, 1.5, 0, 30, { color: [1, 0.9, 0.5], speed: 5, up: 5, life: 1 });
        // Freeze the run while the word card is up, so nothing can be hit.
        this.state = 'word';
        this.touch = null;
        this.ui.setWord(w, letters.length);
        setTimeout(() => { if (this.state === 'word') this.ui.wordCard(w, this.learned.size, WORDS.length); }, 450);
        return;
      } else {
        this.sound.play('letter');
      }
      setTimeout(() => this.ui.setWord(this.word, this.letterIdx), 420);
      return;
    }
    this.world.burst(p.x, y, z, 16, { color: [1, 0.95, 0.75], speed: 4, up: 3, life: 0.6 });
    if (p.type === 'heart') {
      if (this.hearts >= this.maxHearts) this.maxHearts++;
      this.hearts++;
      this.sound.play('heart');
      this.ui.popup('+1 life', 'heart');
    } else if (p.type === 'sneakers') {
      this.powers.sneakers = POWERS.sneakers.time;
      this.sound.play('power');
      this.ui.popup('Jump sneakers!');
    } else if (p.type === 'jetpack') {
      this.ui.popup('Jet pack!');
      this.startJetpack();
    } else if (p.type === 'shofar') {
      this.ui.popup('Shofar blast!');
      this.shofarBlast();
    } else {
      this.powers[p.type] = POWERS[p.type].time;
      this.sound.play('power');
      this.ui.popup(POWERS[p.type].label);
    }
  }

  // ------------------------------------------------------------ animation + camera
  animatePlayer(dt) {
    const P = this.p;
    const moving = this.state === 'playing' || this.state === 'menu';
    if (moving) this.runPh += dt * (this.speed * 0.62 + 5);
    const s = Math.sin(this.runPh);
    const k = 1 - Math.exp(-dt * 18);
    const sliding = this.slideT > 0 && this.grounded;
    let tgt;
    if (this.state === 'dying' || this.state === 'over') {
      const t = Math.min(1, this.deadT / 0.5);
      tgt = { body: -1.35 * ease(t), by: 0.12 * t, bz: -0.4 * t, lL: 0.3, lR: -0.2, aL: 2.6, aR: 2.4 };
    } else if (this.state === 'ride') {
      const rp = this.ridePose;
      if (rp === 'hop') tgt = { body: -0.08, by: 0, bz: 0, lL: 0.9, lR: -0.45, aL: 2.5, aR: 2.3 };
      else if (rp === 'cheer') tgt = { body: 0, by: 0, bz: 0, lL: 0, lR: 0, aL: 2.8, aR: 2.5 + Math.sin(this.time * 12) * 0.35 };
      else if (rp === 'ride') tgt = { body: 0.05, by: 0, bz: 0, lL: 0.05, lR: -0.05, aL: 0.5, aR: 2.6 + Math.sin(this.time * 9) * 0.3 };
      else tgt = { body: 0, by: 0, bz: 0, lL: 0, lR: 0, aL: 0.15, aR: 0.15 };
    } else if (sliding) {
      tgt = { body: 1.1, by: -0.2, bz: -0.55, lL: 0.5, lR: 0.4, aL: -0.4, aR: -0.6 };
    } else if (this.powers.jetpack > 0) {
      tgt = { body: -0.35, by: 0, bz: 0, lL: -0.3, lR: -0.2, aL: 0.6 + s * 0.1, aR: 0.6 - s * 0.1 };
    } else if (!this.grounded) {
      tgt = { body: -0.08, by: 0, bz: 0, lL: 0.9, lR: -0.45, aL: 2.5, aR: 2.3 };
    } else {
      tgt = { body: -0.14, by: Math.abs(Math.cos(this.runPh)) * 0.07, bz: 0, lL: s * 0.95, lR: -s * 0.95, aL: -s * 0.85, aR: s * 0.85 };
    }
    P.body.rotation.x += (tgt.body - P.body.rotation.x) * k;
    P.body.position.y += (tgt.by - P.body.position.y) * k;
    P.body.position.z += (tgt.bz - P.body.position.z) * k;
    P.legL.rotation.x += (tgt.lL - P.legL.rotation.x) * k;
    P.legR.rotation.x += (tgt.lR - P.legR.rotation.x) * k;
    P.armL.rotation.x += (tgt.aL - P.armL.rotation.x) * k;
    P.armR.rotation.x += (tgt.aR - P.armR.rotation.x) * k;
    P.body.rotation.z = -(LANES[this.lane] - this.x) * 0.12;
    P.tail.rotation.x = 0.35 + Math.sin(this.runPh * 2) * 0.2 + Math.min(0.6, this.speed * 0.02);
    P.root.position.set(this.x, this.y, 0);
    P.root.visible = !(this.hurtT > 0 && this.state === 'playing' && Math.floor(this.hurtT * 14) % 2 === 0);
    this.flashT = Math.max(0, this.flashT - dt);
    P.mat.emissive.setRGB(this.flashT * 2, this.flashT * 0.3, 0);

    P.jet.visible = this.powers.jetpack > 0;
    if (P.jet.visible) for (const f of P.jet.userData.flames) f.scale.y = 0.8 + Math.random() * 0.6;
    this.shield.visible = this.powers.shield > 0;
    if (this.shield.visible) {
      this.shield.userData.ring.rotation.y += dt * 2.5;
      this.shield.userData.bubble.material.opacity = this.powers.shield < 2 ? 0.12 + Math.abs(Math.sin(this.time * 10)) * 0.15 : 0.22;
    }
    const sh = Math.max(0.35, 1 - this.y * 0.25);
    this.pShadow.scale.set(1.1 * sh, 1, 0.9 * sh);
    this.pShadow.position.set(this.x, 0.03, 0.05);
  }

  updateCamera(dt) {
    const cam = this.world.camera, D = this.world.camDist;
    const wantGame = this.state !== 'menu';
    this.camBlend = clamp(this.camBlend + (wantGame ? dt / 1.1 : -dt / 1.1), 0, 1);
    const b = ease(this.camBlend);
    const W = window.innerWidth, H = window.innerHeight;
    const portrait = H > W;
    const gx = this.x * 0.55, gy = 2.75 + D * 0.12 + this.y * 0.75, gz = D;
    const lx = this.x * 0.35, ly = 1.1 + this.y * 0.7, lz = portrait ? -9 : -12;
    // Menu shot: in front of the runner, framed into the space the menu panel leaves free.
    const mx = portrait ? 1.0 : 2.2, my = portrait ? 1.5 : 1.6, mz = portrait ? -5.4 : -4.4;
    if (b < 1 && (!this.menuFrameT || this.time - this.menuFrameT > 0.5)) {
      this.menuFrameT = this.time;
      const panel = document.querySelector('#screen-start .scroll');
      const r = panel && !document.getElementById('screen-start').hidden ? panel.getBoundingClientRect() : null;
      this.menuNdc = r && r.width
        ? (portrait ? { x: 0, y: clamp(1 - r.top / H, 0, 0.62) } : { x: clamp((r.right + 10) / W, 0, 0.7), y: 0.02 })
        : { x: 0, y: 0 };
    }
    const ndc = this.menuNdc || { x: 0, y: 0 };
    const tv = Math.tan((cam.fov * Math.PI) / 360), th = tv * cam.aspect;
    const pdx = -mx, pdy = 0.95 - my, pdz = -mz;
    const yaw = Math.atan2(pdx, pdz) + Math.atan(ndc.x * th);
    const pitch = Math.atan2(pdy, Math.hypot(pdx, pdz)) - Math.atan(ndc.y * tv);
    const mlx = mx + Math.sin(yaw) * Math.cos(pitch) * 10;
    const mly = my + Math.sin(pitch) * 10;
    const mlz = mz + Math.cos(yaw) * Math.cos(pitch) * 10;
    this.shake = Math.max(0, this.shake - dt * 1.8);
    const sk = this.shake * this.shake * 0.6;
    // Orbit around the runner between the two shots so the camera never clips through them.
    const am = Math.atan2(mx, mz), rm = Math.hypot(mx, mz);
    const ag = Math.atan2(gx, gz), rg = Math.hypot(gx, gz);
    let da = ag - am;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    const a = am + da * b, r = rm + (rg - rm) * b;
    cam.position.set(
      Math.sin(a) * r + (Math.random() - 0.5) * sk,
      my + (gy - my) * b + (Math.random() - 0.5) * sk,
      Math.cos(a) * r,
    );
    this.camLook.set(mlx + (lx - mlx) * b, mly + (ly - mly) * b, mlz + (lz - mlz) * b);
    cam.lookAt(this.camLook);
  }

  gameCamPose() {
    const D = this.world.camDist;
    const portrait = window.innerHeight > window.innerWidth;
    return {
      pos: new THREE.Vector3(this.x * 0.55, 2.75 + D * 0.12 + this.y * 0.75, D),
      look: new THREE.Vector3(this.x * 0.35, 1.1 + this.y * 0.7, portrait ? -9 : -12),
    };
  }

  // ------------------------------------------------------------ loop
  frame(t) {
    requestAnimationFrame((n) => this.frame(n));
    const raw = (t - this.last) / 1000;
    const dt = Math.min(0.05, Math.max(0, raw));
    this.last = t;
    this.time += dt;
    let worldDt = dt;
    if (this.state === 'playing') {
      this.update(dt);
    } else if (this.state === 'menu') {
      this.speed = MENU_SPEED;
      this.dist += this.speed * dt;
    } else if (this.state === 'dying') {
      this.deadT += dt;
      this.speed *= Math.max(0, 1 - dt * 4);
      this.dist += this.speed * dt;
      this.updateObstacles(dt);
      if (this.deadT > 1.3) this.finish();
    } else if (this.state === 'ride') {
      if (this.ride.update(dt)) this.endRide();
    } else if (this.state === 'countdown') {
      worldDt = 0;
      this.updateCountdown(dt);
    } else {
      worldDt = this.state === 'over' ? dt : 0;
      if (this.state === 'over') this.deadT += dt;
    }
    if (this.state !== 'paused') {
      this.animatePlayer(dt);
      this.chaser.update(['playing', 'dying', 'over', 'menu', 'ride'].includes(this.state) ? dt : 0, this.x, this.y, this.state);
      const worldSpeed = this.state === 'playing' || this.state === 'menu' ? this.speed : this.state === 'ride' ? -this.ride.v : 0;
      this.world.update(worldDt, this.dist, worldSpeed);
      if (this.state !== 'playing') { this.updateManna(0); this.updatePickups(0); }
    }
    if (this.state === 'ride') {
      const pose = this.gameCamPose();
      this.ride.updateCamera(dt, pose.pos, pose.look);
    } else {
      this.updateCamera(this.state === 'paused' ? 0 : dt);
    }
    this.world.render();
    this.adaptQuality(raw, t);
  }

  // Drop the render resolution on slow devices so the game stays smooth.
  adaptQuality(raw, t) {
    if (this.state !== 'playing' || raw <= 0 || raw > 0.25) return;
    this.frames.push(raw);
    if (this.frames.length < 90) return;
    const avg = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    this.frames.length = 0;
    if (avg > 0.024 && this.world.dpr > 1 && t - this.lastDprCheck > 3000) {
      this.lastDprCheck = t;
      this.world.setPixelRatio(Math.max(1, this.world.dpr - 0.35));
      this.resize();
    }
  }
}

function boot(data) {
  const loading = document.getElementById('screen-loading');
  try {
    const game = new Game(data || {});
    window.__torahRunner = game;
  } catch (err) {
    console.error(err);
    if (loading) loading.hidden = true;
    const e = document.getElementById('screen-error');
    if (e) e.hidden = false;
  }
}

const fontsReady = document.fonts && document.fonts.load
  ? Promise.race([
    Promise.all([
      document.fonts.load('400 64px "Suez One"', 'תורה Torah'),
      document.fonts.load('600 16px "Rubik"', 'Torah'),
    ]),
    new Promise((r) => setTimeout(r, 2500)),
  ]).catch(() => {})
  : Promise.resolve();

fontsReady.then(() => {
  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.ready === 'function') hot.ready(boot);
  else boot((hot && hot.data) || {});
});
