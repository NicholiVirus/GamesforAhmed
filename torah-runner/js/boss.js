// The final boss: the Golem of Prague, a clay giant from Jewish folklore with אמת ("truth") written on
// his forehead. Beat him in a word battle: drag each Hebrew word into the box with its meaning.
// When his strength runs out, erase the א so the word becomes מת and the Golem crumbles back to clay.
import * as THREE from './three.js';
import { part, box, merge, flatMat, ICO } from './models.js';

const CLAY = 0x9a6a4a, CLAY2 = 0x8a5a3c, CLAY3 = 0xa87a58;
const ROUNDS = 3, PER_ROUND = 4, DECOYS = 2, ROUND_TIME = 35;
const HP = ROUNDS * PER_ROUND;
const $ = (id) => document.getElementById(id);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function golemGeo() {
  return merge([
    box(CLAY2, [-0.32, 0.55, 0], [0.42, 1.1, 0.45]), box(CLAY2, [0.32, 0.55, 0], [0.42, 1.1, 0.45]),
    box(CLAY, [0, 1.6, 0], [1.25, 1.2, 0.75]), box(CLAY3, [0, 1.25, 0.39], [1.1, 0.12, 0.04]),
    box(CLAY, [-0.82, 1.55, 0], [0.38, 1.25, 0.42], [0, 0, 0.12]), box(CLAY, [0.82, 1.55, 0], [0.38, 1.25, 0.42], [0, 0, -0.12]),
    box(CLAY2, [-0.9, 0.85, 0.05], [0.42, 0.36, 0.46]), box(CLAY2, [0.9, 0.85, 0.05], [0.42, 0.36, 0.46]),
    box(CLAY, [0, 2.6, 0], [0.8, 0.75, 0.7]), box(0x2a1a10, [-0.18, 2.62, 0.36], [0.14, 0.1, 0.02]), box(0x2a1a10, [0.18, 2.62, 0.36], [0.14, 0.1, 0.02]),
    box(0x6a4028, [0, 2.38, 0.36], [0.34, 0.06, 0.02]),
    ...Array.from({ length: 7 }, (_, k) => part(ICO, CLAY3, [Math.sin(k * 2.1) * 0.5, 1.2 + k * 0.22, 0.38], [k, k, 0], [0.06, 0.06, 0.03])),
  ]);
}

function wordTexture(text) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = '#c8a078'; g.fillRect(0, 0, 256, 96);
  g.strokeStyle = '#6a4028'; g.lineWidth = 6; g.strokeRect(3, 3, 250, 90);
  g.fillStyle = '#2a1a10';
  g.font = '64px "Suez One", "Frank Ruhl Libre", "Noto Serif Hebrew", serif';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl';
  g.fillText(text, 128, 52);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Boss {
  constructor(game) {
    this.g = game;
    this.group = new THREE.Group();
    this.body = new THREE.Mesh(golemGeo(), flatMat);
    this.group.add(this.body);
    this.plateMat = new THREE.MeshBasicMaterial({ map: wordTexture('אמת') });
    this.plate = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.23), this.plateMat);
    this.plate.position.set(0, 2.86, 0.36);
    this.group.add(this.plate);
    this.group.visible = false;
    this.group.scale.setScalar(1.9);
    game.scene.add(this.group);
    this.active = false;
    this.bindDom();
  }

  bindDom() {
    // Drag a word onto a box, or tap a word and then tap a box.
    const tiles = $('boss-tiles');
    tiles.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('.boss-tile');
      if (!t || t.classList.contains('used') || !this.active || this.locked) return;
      e.preventDefault();
      this.select(t);
      const r = t.getBoundingClientRect();
      this.drag = { t, id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, moved: false, ghost: null };
      t.setPointerCapture(e.pointerId);
    });
    tiles.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d || d.id !== e.pointerId) return;
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
      if (!d.ghost) {
        d.moved = true;
        d.ghost = d.t.cloneNode(true);
        d.ghost.classList.add('ghost');
        document.body.appendChild(d.ghost);
        d.t.classList.add('lifted');
      }
      d.ghost.style.left = e.clientX - d.dx + 'px';
      d.ghost.style.top = e.clientY - d.dy + 'px';
      const over = this.boxAt(e.clientX, e.clientY);
      for (const b of document.querySelectorAll('.boss-box')) b.classList.toggle('over', b === over);
    });
    const end = (e) => {
      const d = this.drag;
      if (!d || d.id !== e.pointerId) return;
      this.drag = null;
      d.t.classList.remove('lifted');
      for (const b of document.querySelectorAll('.boss-box')) b.classList.remove('over');
      if (d.ghost) {
        d.ghost.remove();
        const target = this.boxAt(e.clientX, e.clientY);
        if (target) this.drop(d.t, target);
      }
    };
    tiles.addEventListener('pointerup', end);
    tiles.addEventListener('pointercancel', end);
    $('boss-boxes').addEventListener('click', (e) => {
      const b = e.target.closest('.boss-box');
      if (b && this.selected && this.active && !this.locked) this.drop(this.selected, b);
    });
    $('boss-erase').addEventListener('click', () => this.erase());
  }

  boxAt(x, y) {
    for (const b of document.querySelectorAll('.boss-box')) {
      if (b.classList.contains('done')) continue;
      const r = b.getBoundingClientRect();
      if (x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) return b;
    }
    return null;
  }

  select(t) {
    for (const x of document.querySelectorAll('.boss-tile')) x.classList.toggle('sel', x === t);
    this.selected = t;
  }

  start() {
    const g = this.g;
    this.active = true;
    this.locked = false;
    this.hp = HP;
    this.round = 0;
    this.used = new Set();
    this.t = 0;
    this.hitT = 0;
    this.crumble = 0;
    this.plateMat.map = wordTexture('אמת');
    this.plateMat.needsUpdate = true;
    this.group.visible = true;
    this.group.scale.setScalar(1.9);
    this.group.position.set(0, 0, -11);
    this.group.rotation.set(0, 0, 0);
    $('boss-erase').hidden = true;
    $('boss-play').hidden = false;
    g.ui.show('screen-boss');
    this.say('I am the Golem of Prague. The word on my forehead is אמת, truth. Match every word to its meaning to beat me!');
    this.nextRound();
    this.renderHp();
  }

  pool() {
    const learned = this.g.learned;
    const known = this.g.allWords.filter((w) => learned.has(w.he));
    return known.length >= 12 ? known : this.g.allWords;
  }

  nextRound() {
    const pool = shuffle(this.pool().slice());
    const picks = [], meanings = new Set();
    for (const w of pool) {
      if (picks.length >= PER_ROUND) break;
      if (this.used.has(w.he) || meanings.has(w.en)) continue;
      picks.push(w); meanings.add(w.en);
    }
    const decoys = [];
    for (const w of shuffle(this.g.allWords.slice())) {
      if (decoys.length >= DECOYS) break;
      if (picks.includes(w) || meanings.has(w.en)) continue;
      decoys.push(w);
    }
    this.picks = picks;
    this.timeLeft = ROUND_TIME;
    this.selected = null;
    $('boss-boxes').innerHTML = '';
    for (const w of shuffle(picks.slice())) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'boss-box'; b.dataset.en = w.en;
      b.innerHTML = '<span class="bb-en"></span><span class="bb-slot">drop here</span>';
      b.querySelector('.bb-en').textContent = w.en;
      $('boss-boxes').appendChild(b);
    }
    $('boss-tiles').innerHTML = '';
    for (const w of shuffle([...picks, ...decoys])) {
      const t = document.createElement('div');
      t.className = 'boss-tile'; t.dataset.he = w.he; t.dataset.tr = w.tr; t.dataset.en = w.en;
      t.textContent = w.tr; // the word spelled in English letters (Shalom, Torah…)
      t.title = w.he;
      $('boss-tiles').appendChild(t);
    }
    $('boss-round').textContent = `Round ${this.round + 1} of ${ROUNDS}`;
  }

  drop(tile, boxEl) {
    if (boxEl.classList.contains('done') || tile.classList.contains('used')) return;
    const g = this.g;
    this.select(null);
    if (tile.dataset.en === boxEl.dataset.en) {
      tile.classList.add('used');
      boxEl.classList.add('done');
      boxEl.querySelector('.bb-slot').textContent = tile.dataset.tr;
      this.used.add(tile.dataset.he);
      this.hp--;
      this.hitT = 0.4;
      g.sound.play('letter');
      g.world.burst(this.group.position.x, 3, this.group.position.z, 14, { color: [0.62, 0.42, 0.29], speed: 4, up: 3, life: 0.7, grav: 8 });
      this.renderHp();
      const left = this.picks.filter((w) => !this.used.has(w.he)).length;
      if (this.hp <= 0) { this.defeated(); return; }
      if (left === 0) {
        this.round++;
        this.say(['Hmm! You know your words…', 'My clay is cracking!', 'One more round!'][Math.min(2, this.round - 1)]);
        this.locked = true;
        setTimeout(() => { this.locked = false; if (this.active) this.nextRound(); }, 700);
      } else {
        this.say(['Lucky guess!', 'Again?!', 'Grrr… correct.', 'My clay shakes!'][Math.floor(Math.random() * 4)]);
      }
    } else {
      boxEl.classList.add('wrong');
      setTimeout(() => boxEl.classList.remove('wrong'), 450);
      this.say(`Wrong! ${tile.dataset.tr} does not mean "${boxEl.dataset.en.toLowerCase()}".`);
      this.hurt();
    }
  }

  hurt() {
    const g = this.g;
    g.hearts--;
    g.shake = 0.5;
    g.ui.flash();
    g.sound.play('bump');
    g.ui.setHearts(g.hearts, g.maxHearts);
    this.renderHp();
    if (g.hearts <= 0) this.lost();
  }

  renderHp() {
    $('boss-hp-bar').style.width = `${Math.max(0, (this.hp / HP) * 100)}%`;
    $('boss-hp-text').textContent = `${Math.max(0, this.hp)} / ${HP}`;
    $('boss-hearts').textContent = '❤'.repeat(Math.max(0, this.g.hearts));
  }

  say(text) { $('boss-say').textContent = text; }

  defeated() {
    this.locked = true;
    $('boss-play').hidden = true;
    $('boss-erase').hidden = false;
    this.say('Erase the first letter, א. Then אמת (truth) becomes מת, and the Golem goes back to sleep as clay.');
  }

  erase() {
    if (!this.active || this.crumble > 0) return;
    this.plateMat.map = wordTexture('מת');
    this.plateMat.needsUpdate = true;
    $('boss-erase').hidden = true;
    this.say('The Golem crumbles back into clay. You win!');
    this.crumble = 0.001;
    this.g.sound.play('word');
  }

  lost() {
    this.active = false;
    this.group.visible = false;
    const g = this.g;
    g.endTitle = 'The Golem won this time';
    g.endSub = 'You carried all ten commandments to the end, but the Golem out-spelled you. Learn more words on your scroll and try again!';
    g.ui.show(null);
    g.finish();
  }

  hide() { this.active = false; this.group.visible = false; }

  update(dt) {
    if (!this.group.visible) return;
    this.t += dt;
    const g = this.g;
    if (this.crumble > 0) {
      this.crumble += dt;
      const k = Math.min(1, this.crumble / 1.4);
      this.group.scale.set(1.9 * (1 + k * 0.3), 1.9 * (1 - k * 0.9), 1.9 * (1 + k * 0.3));
      if (Math.random() < 0.5) g.world.burst(this.group.position.x + (Math.random() - 0.5) * 2, 1 + Math.random() * 3, this.group.position.z, 3, { color: [0.6, 0.42, 0.3], speed: 3, up: 2, life: 0.8, grav: 8 });
      if (this.crumble > 1.8) { this.active = false; this.group.visible = false; g.winGame(); }
      return;
    }
    this.hitT = Math.max(0, this.hitT - dt);
    const sway = Math.sin(this.t * 1.6) * 0.06;
    this.group.rotation.z = sway + (this.hitT > 0 ? Math.sin(this.t * 60) * 0.06 : 0);
    this.group.position.y = Math.abs(Math.sin(this.t * 1.6)) * 0.08;
    if (!this.active || this.locked) return;
    this.timeLeft -= dt;
    $('boss-timer').textContent = `${Math.ceil(Math.max(0, this.timeLeft))}s`;
    $('boss-timer').classList.toggle('low', this.timeLeft < 8);
    if (this.timeLeft <= 0) {
      this.say('Too slow! The Golem stomps. New words!');
      this.hurt();
      if (this.active) this.nextRound();
    }
  }
}
