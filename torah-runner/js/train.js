// The train that carries the runner back to the start after a lost run.
// Phases: arrive -> board -> depart -> (warp) -> brake -> hopoff -> leave.
import * as THREE from './three.js';
import { box, part, merge, flatMat } from './models.js';

const FLOOR = 0.78;       // carriage floor height
const CRUISE = 55;        // m/s
const ACCEL = 45;
const DECEL = 30;
const TRAIN_START = -72;  // the train rolls in from up the track

const BLUE = 0x2c4ea3, GOLD = 0xf0b93a, RED = 0xb83a2a, IRON = 0x2f2824, WOOD = 0x6d3e1c;

function wheelGeo(r) {
  return merge([
    part(new THREE.CylinderGeometry(r, r, 0.16, 12), IRON, [0, 0, 0], [0, 0, Math.PI / 2]),
    box(GOLD, [0.09, 0, 0], [0.02, r * 1.7, 0.08]),
    box(GOLD, [0.09, 0, 0], [0.02, 0.08, r * 1.7]),
    part(new THREE.CylinderGeometry(r * 0.25, r * 0.25, 0.04, 8), GOLD, [0.1, 0, 0], [0, 0, Math.PI / 2]),
  ]);
}

export function buildTrain(shadowMat) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(merge([
    // open carriage
    box(IRON, [0, 0.55, -0.1], [1.9, 0.25, 3.2]),
    box(0x8b5a2b, [0, 0.72, -0.1], [1.8, 0.1, 3.0]),
    box(BLUE, [-0.92, 1.05, -0.1], [0.1, 0.56, 3.2]),
    box(BLUE, [0.92, 1.05, -0.1], [0.1, 0.56, 3.2]),
    box(BLUE, [0, 1.05, -1.65], [1.94, 0.56, 0.1]),
    box(BLUE, [0, 1.05, 1.45], [1.94, 0.56, 0.1]),
    box(GOLD, [-0.92, 1.35, -0.1], [0.16, 0.06, 3.24]),
    box(GOLD, [0.92, 1.35, -0.1], [0.16, 0.06, 3.24]),
    box(GOLD, [0, 1.35, -1.65], [1.98, 0.06, 0.14]),
    box(GOLD, [0, 1.35, 1.45], [1.98, 0.06, 0.14]),
    box(GOLD, [-0.975, 0.98, -0.1], [0.02, 0.08, 2.9]),
    box(GOLD, [0.975, 0.98, -0.1], [0.02, 0.08, 2.9]),
    box(IRON, [0, 0.55, 1.85], [0.24, 0.16, 0.7]),
    // locomotive frame and cab
    box(IRON, [0, 0.55, 4.3], [2.0, 0.3, 4.4]),
    box(RED, [0, 1.45, 2.85], [1.9, 1.5, 1.3]),
    box(0x2b2420, [0, 2.27, 2.85], [2.2, 0.12, 1.65]),
    box(0x1b1830, [-0.96, 1.7, 2.85], [0.02, 0.5, 0.7]),
    box(0x1b1830, [0.96, 1.7, 2.85], [0.02, 0.5, 0.7]),
    box(0x1b1830, [-0.5, 1.75, 3.51], [0.5, 0.45, 0.02]),
    box(0x1b1830, [0.5, 1.75, 3.51], [0.5, 0.45, 0.02]),
    box(GOLD, [0, 0.98, 2.85], [1.94, 0.08, 1.34]),
    // boiler
    part(new THREE.CylinderGeometry(0.64, 0.64, 2.7, 12), BLUE, [0, 1.32, 4.85], [Math.PI / 2, 0, 0]),
    part(new THREE.CylinderGeometry(0.66, 0.66, 0.1, 12), GOLD, [0, 1.32, 3.9], [Math.PI / 2, 0, 0]),
    part(new THREE.CylinderGeometry(0.66, 0.66, 0.1, 12), GOLD, [0, 1.32, 4.9], [Math.PI / 2, 0, 0]),
    part(new THREE.CylinderGeometry(0.66, 0.66, 0.1, 12), GOLD, [0, 1.32, 5.9], [Math.PI / 2, 0, 0]),
    part(new THREE.CylinderGeometry(0.6, 0.6, 0.12, 12), 0x24202a, [0, 1.32, 6.22], [Math.PI / 2, 0, 0]),
    part(new THREE.SphereGeometry(0.28, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), GOLD, [0, 1.9, 4.6]),
    // chimney, headlamp, cowcatcher
    part(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 10), 0x1f1a1a, [0, 2.25, 5.65]),
    part(new THREE.CylinderGeometry(0.36, 0.2, 0.28, 10), 0x1f1a1a, [0, 2.75, 5.65]),
    box(GOLD, [0, 2.0, 6.15], [0.34, 0.3, 0.3]),
    box(0xfff3c4, [0, 2.0, 6.31], [0.22, 0.18, 0.02]),
    box(RED, [0, 0.42, 6.62], [1.8, 0.42, 0.55], [0.75, 0, 0]),
    box(GOLD, [0, 0.72, 6.5], [1.9, 0.08, 0.12]),
  ]), flatMat);
  group.add(body);

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), shadowMat);
  shadow.scale.set(3.2, 1, 10.5);
  shadow.position.set(0, 0.03, 2.4);
  group.add(shadow);

  const wheels = [];
  const small = wheelGeo(0.36), big = wheelGeo(0.5);
  for (const sx of [-1, 1]) {
    for (const z of [-1.05, 0.85]) wheels.push({ geo: small, r: 0.36, p: [sx * 1.0, 0.36, z] });
    for (const z of [3.2, 4.35, 5.5]) wheels.push({ geo: big, r: 0.5, p: [sx * 1.04, 0.5, z] });
  }
  const meshes = wheels.map((w) => {
    const m = new THREE.Mesh(w.geo, flatMat);
    m.position.set(...w.p);
    if (w.p[0] < 0) m.scale.x = -1;
    m.userData.r = w.r;
    group.add(m);
    return m;
  });
  return { group, wheels: meshes };
}

function buildLines(scene) {
  const n = 90;
  const pos = new Float32Array(n * 6);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xfff6dc, transparent: true, opacity: 0, depthWrite: false });
  const obj = new THREE.LineSegments(geo, mat);
  obj.frustumCulled = false;
  obj.visible = false;
  scene.add(obj);
  const items = Array.from({ length: n }, () => ({ x: 0, y: 0, z: 0 }));
  const place = (it, zMin, zMax) => {
    const side = Math.random() < 0.5 ? -1 : 1;
    it.x = side * (1.6 + Math.random() * 12);
    it.y = 0.3 + Math.random() * 9;
    it.z = zMin + Math.random() * (zMax - zMin);
  };
  items.forEach((it) => place(it, -90, 30));
  return { obj, geo, pos, mat, items, place };
}

const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export class TrainRide {
  constructor(game) {
    this.g = game;
    const t = buildTrain(game.shadowMat);
    this.train = t.group;
    this.wheels = t.wheels;
    this.train.visible = false;
    game.scene.add(this.train);
    this.lines = buildLines(game.scene);
    this.look = new THREE.Vector3();
    this.camPos = new THREE.Vector3();
    this.v = 0;
  }

  start() {
    const g = this.g;
    this.phase = 'arrive';
    this.pt = 0;
    this.v = 0;
    this.tz = TRAIN_START;
    this.tx = g.x;
    this.wheelV = 0;
    this.warpAmt = 0;
    this.puffT = 0;
    this.chugT = 0;
    this.face = 0;
    this.train.visible = true;
    this.train.position.set(this.tx, 0, this.tz);
    this.look.copy(g.camLook);
    g.ridePose = 'stand';
    g.ui.ride(true);
  }

  next(phase) {
    this.phase = phase;
    this.pt = 0;
    const s = this.g.sound;
    if (phase === 'board') s.play('whistle');
    if (phase === 'warp') { s.play('whoosh'); this.g.ui.flash(); }
    if (phase === 'brake') s.play('brake');
    if (phase === 'hopoff') this.g.sound.play('jump');
  }

  beginWarp() {
    const g = this.g, w = g.world;
    this.d0 = g.dist;
    this.dEnd = (CRUISE * CRUISE) / (2 * DECEL);
    this.W = Math.min(2.6, 1.0 + (g.dist / 2600) * 1.1);
    w.propsOn = false;
    w.resetProps(g.dist);
    w.scrollCap = 70;
    this.lines.obj.visible = true;
    this.next('warp');
  }

  endWarp() {
    const w = this.g.world;
    w.resetProps(this.g.dist, 34);
    w.propsOn = true;
    w.scrollCap = Infinity;
    this.lines.obj.visible = false;
    this.warpAmt = 0;
    this.g.ui.flash();
  }

  skip() {
    if (!['arrive', 'board', 'depart', 'warp', 'brake'].includes(this.phase)) return;
    const g = this.g, w = g.world;
    g.ui.flash();
    g.dist = 0;
    this.v = 0;
    this.tz = 0;
    this.tx = 0;
    g.x = 0;
    g.y = FLOOR;
    this.face = Math.PI;
    w.resetProps(0, 34);
    w.propsOn = true;
    w.scrollCap = Infinity;
    this.lines.obj.visible = false;
    this.warpAmt = 0;
    this.next('hopoff');
  }

  // Returns true once the runner is back on the road at the start.
  update(dt) {
    const g = this.g;
    this.pt += dt;
    let trainSpeed = 0;
    switch (this.phase) {
      case 'arrive': {
        const k = Math.min(1, this.pt / 1.2);
        this.tz = TRAIN_START * Math.pow(1 - k, 3);
        trainSpeed = (-TRAIN_START * 3 * Math.pow(1 - k, 2)) / 1.2;
        if (k >= 1) { this.tz = 0; this.next('board'); }
        break;
      }
      case 'board': {
        const k = Math.min(1, this.pt / 0.6);
        g.ridePose = 'hop';
        g.y = FLOOR * k + Math.sin(k * Math.PI) * 1.3;
        this.face = Math.PI * easeInOut(k);
        if (k >= 1) { g.y = FLOOR; g.ridePose = 'ride'; this.next('depart'); }
        break;
      }
      case 'depart': {
        this.v = Math.min(CRUISE, this.v + ACCEL * dt);
        const brakeDist = (this.v * this.v) / (2 * DECEL);
        if (g.dist <= brakeDist + 0.3) { this.brakeA = 0; this.next('brake'); break; }
        if (this.v >= CRUISE && g.dist > brakeDist + 200) { this.beginWarp(); break; }
        g.dist -= this.v * dt;
        break;
      }
      case 'warp': {
        const k = Math.min(1, this.pt / this.W);
        g.dist = this.d0 + (this.dEnd - this.d0) * easeInOut(k);
        this.warpAmt = Math.sin(k * Math.PI);
        g.ridePose = 'cheer';
        if (k >= 1) { g.dist = this.dEnd; this.v = CRUISE; this.endWarp(); this.brakeA = 0; g.ridePose = 'ride'; this.next('brake'); }
        break;
      }
      case 'brake': {
        if (!this.brakeA) this.brakeA = (this.v * this.v) / (2 * Math.max(0.5, g.dist));
        this.v = Math.max(0, this.v - this.brakeA * dt);
        g.dist = Math.max(0, g.dist - this.v * dt);
        if (this.v <= 0.3 || g.dist <= 0.02) { g.dist = 0; this.v = 0; this.next('hopoff'); }
        break;
      }
      case 'hopoff': {
        const k = Math.min(1, this.pt / 0.6);
        g.ridePose = 'hop';
        g.y = FLOOR * (1 - k) + Math.sin(k * Math.PI) * 1.2;
        this.face = Math.PI * (1 - easeInOut(k));
        const tt = Math.max(0, this.pt - 0.25);
        this.tz = 0.5 * 120 * tt * tt;
        trainSpeed = 120 * tt;
        if (k >= 1) { g.y = 0; this.face = 0; g.ridePose = 'stand'; this.next('leave'); }
        break;
      }
      case 'leave': {
        const tt = this.pt + 0.35;
        this.tz = 0.5 * 120 * tt * tt;
        trainSpeed = 120 * tt;
        if (this.tz > 90) this.train.visible = false;
        if (this.pt >= 1.1) { this.finish(); return true; }
        break;
      }
      default: break;
    }

    // The train lines up with the middle lane once it is moving.
    if (['depart', 'warp', 'brake'].includes(this.phase)) {
      this.tx += (0 - this.tx) * (1 - Math.exp(-dt * 3));
      g.x = this.tx;
      g.y = FLOOR + Math.abs(Math.sin(g.time * 18)) * 0.03 * Math.min(1, this.v / 20);
    }
    this.train.position.set(this.tx, 0, this.tz);
    g.p.root.rotation.y = this.face;

    const groundSpeed = this.v + trainSpeed + this.warpAmt * 400;
    for (const m of this.wheels) m.rotation.x += (groundSpeed / m.userData.r) * dt;

    // Smoke and the chug of the engine.
    this.puffT -= dt;
    if (this.phase !== 'warp' && this.phase !== 'leave' && this.puffT <= 0) {
      this.puffT = this.v > 20 ? 0.05 : 0.12;
      g.world.burst(this.tx, 3.0, this.tz + 5.65, 1, { dust: true, color: [0.93, 0.93, 0.96], speed: 0.6, up: 2.4, life: 1.2, grav: -0.6 });
    }
    this.chugT -= dt;
    const moving = this.phase === 'depart' || this.phase === 'brake' || (this.phase === 'arrive' && trainSpeed > 4);
    if (moving && this.chugT <= 0) {
      const sp = Math.max(this.v, trainSpeed);
      this.chugT = Math.max(0.09, 0.34 - sp * 0.0045);
      g.sound.play('chug', Math.min(3, sp / 20));
    }
    this.updateLines(dt);
    return false;
  }

  updateLines(dt) {
    const L = this.lines;
    if (!L.obj.visible) return;
    const a = this.warpAmt;
    L.mat.opacity = a * 0.75;
    const len = 3 + a * 16;
    L.items.forEach((it, i) => {
      it.z -= (60 + a * 340) * dt;
      if (it.z < -95) L.place(it, 20, 45);
      const o = i * 6;
      L.pos[o] = it.x; L.pos[o + 1] = it.y; L.pos[o + 2] = it.z;
      L.pos[o + 3] = it.x; L.pos[o + 4] = it.y; L.pos[o + 5] = it.z + len;
    });
    L.geo.attributes.position.needsUpdate = true;
  }

  finish() {
    this.train.visible = false;
    this.lines.obj.visible = false;
    this.g.p.root.rotation.y = 0;
    this.g.ui.ride(false);
  }

  // Camera: a tracking shot beside and ahead of the engine, then back behind the runner.
  updateCamera(dt, gamePos, gameLook) {
    const g = this.g, cam = g.world.camera;
    const portrait = window.innerHeight > window.innerWidth;
    let pos, look, rate = 3.2;
    if (this.phase === 'leave' || this.phase === 'hopoff') {
      pos = gamePos; look = gameLook; rate = this.phase === 'leave' ? 5 : 2.5;
    } else {
      pos = portrait ? new THREE.Vector3(this.tx + 3.4, 5.6, 13.5) : new THREE.Vector3(this.tx + 5.6, 4.1, 9.5);
      look = new THREE.Vector3(this.tx * 0.6, 1.3, portrait ? 1.2 : 0.8);
    }
    const k = 1 - Math.exp(-dt * rate);
    cam.position.lerp(pos, k);
    this.look.lerp(look, k);
    if (this.warpAmt > 0) {
      const s = this.warpAmt * 0.08;
      cam.position.x += (Math.random() - 0.5) * s;
      cam.position.y += (Math.random() - 0.5) * s;
    }
    cam.lookAt(this.look);
    const fov = g.world.baseFov + this.warpAmt * 16;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
    g.camLook.copy(this.look);
  }
}
