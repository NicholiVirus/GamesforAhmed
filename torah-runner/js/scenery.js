// Roadside props for each region. A few random variants of each are built up front and reused.
import * as THREE from './three.js';
import { part, box, merge, jagged, BOX, CYL6, ICO, buildCamel, OBSTACLES, obstacleGeo } from './models.js';

const rnd = (a, b) => a + Math.random() * (b - a);

function buildPalm() {
  const P = [];
  const h = rnd(5, 7.5), segs = 7, lean = rnd(-0.12, 0.12);
  let x = 0, y = 0;
  for (let i = 0; i < segs; i++) {
    const sh = h / segs, r0 = 0.26 - i * 0.016;
    P.push(part(new THREE.CylinderGeometry(r0 - 0.02, r0, sh + 0.02, 6), i % 2 ? 0x8a6238 : 0x75502c, [x, y + sh / 2, 0], [0, i, lean * i * 0.4]));
    x -= lean * sh * (0.4 + i * 0.25);
    y += sh;
  }
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2 + rnd(0, 0.3), len = rnd(2.0, 2.8), droop = rnd(0.3, 0.6);
    P.push(part(BOX, k % 2 ? 0x3f8f3a : 0x2c7431,
      [x + Math.cos(a) * len * 0.45, y - Math.sin(droop) * len * 0.5 + 0.1, Math.sin(a) * len * 0.45],
      [0, -a, -droop], [len, 0.06, 0.42]));
  }
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    P.push(part(ICO, k % 2 ? 0xc0682a : 0x9a4e1e, [x + Math.cos(a) * 0.25, y - 0.3, Math.sin(a) * 0.25], [k, k, 0], [0.13, 0.15, 0.13]));
  }
  return merge(P);
}

function buildHouse() {
  const w = rnd(2.6, 3.8), h = rnd(2.0, 2.8), d = 2.6;
  const wall = [0xd8b07a, 0xe0bd8a, 0xcfa46e][Math.floor(rnd(0, 3))];
  const P = [
    box(wall, [0, h / 2, 0], [w, h, d]),
    box(0xc99c66, [0, h + 0.1, 0], [w + 0.12, 0.2, d + 0.12]),
    box(0x4a2e1c, [w * 0.18, 0.62, d / 2 + 0.01], [0.62, 1.24, 0.04]),
    box(0x4a2e1c, [-w * 0.25, h * 0.66, d / 2 + 0.01], [0.38, 0.32, 0.04]),
    box(0x5e8a3a, [w * 0.18, 1.42, d / 2 + 0.25], [1.1, 0.06, 0.55], [0.25, 0, 0]),
    box(0x8b5a2b, [w * 0.18 - 0.5, 0.7, d / 2 + 0.48], [0.06, 1.4, 0.06]),
    box(0x8b5a2b, [w * 0.18 + 0.5, 0.7, d / 2 + 0.48], [0.06, 1.4, 0.06]),
  ];
  if (Math.random() < 0.6) P.push(box(wall, [w * 0.28, h + 0.6, -0.4], [w * 0.4, 1.0, d * 0.5]));
  return merge(P);
}

function buildReeds() {
  const P = [];
  for (let i = 0; i < 14; i++) {
    const x = rnd(-0.7, 0.7), z = rnd(-0.7, 0.7), h = rnd(1.0, 1.9);
    P.push(box(i % 2 ? 0x6f8f3a : 0x587a2e, [x, h / 2, z], [0.05, h, 0.05], [rnd(-0.12, 0.12), 0, rnd(-0.12, 0.12)]));
    if (i % 3 === 0) P.push(box(0x6b4423, [x, h + 0.08, z], [0.09, 0.24, 0.09]));
  }
  return merge(P);
}

function buildSmallPyramid() {
  return merge([
    part(new THREE.ConeGeometry(4, 3.6, 4), 0xe0c590, [0, 1.8, 0], [0, Math.PI / 4, 0], [1, 1, 1], 0.03),
    part(new THREE.ConeGeometry(0.75, 0.68, 4), 0xf0b93a, [0, 3.27, 0], [0, Math.PI / 4, 0], [1, 1, 1], 0),
  ]);
}

function buildCoralBig() {
  const P = [part(ICO, 0x8a8f86, [0, 0.2, 0], [0.4, 0.3, 0], [0.6, 0.35, 0.55])];
  const cols = [0xff7a6b, 0xff9f4a, 0xd65db1, 0xffc857, 0x7ad1c9];
  for (let i = 0; i < 10; i++) {
    const a = rnd(0, 6.28), r = rnd(0, 0.45), h = rnd(0.4, 1.2), c = cols[i % cols.length];
    P.push(part(CYL6, c, [Math.cos(a) * r, 0.25 + h / 2, Math.sin(a) * r], [rnd(-0.4, 0.4), 0, rnd(-0.4, 0.4)], [0.08, h, 0.08]));
    P.push(part(ICO, c, [Math.cos(a) * r, 0.28 + h, Math.sin(a) * r], [i, i, 0], [0.13, 0.13, 0.13]));
  }
  return merge(P);
}

function buildSeaweed() {
  const P = [];
  for (let s = 0; s < 4; s++) {
    let x = rnd(-0.35, 0.35), y = 0;
    const z = rnd(-0.35, 0.35), n = 5 + Math.floor(rnd(0, 4));
    for (let i = 0; i < n; i++) {
      P.push(box(s % 2 ? 0x2f8f5b : 0x47a86a, [x, y + 0.2, z], [0.12, 0.42, 0.05], [0, 0, (i % 2 ? 0.25 : -0.25)]));
      x += i % 2 ? 0.07 : -0.07;
      y += 0.38;
    }
  }
  return merge(P);
}

function buildShells() {
  const P = [];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    P.push(box(0xff8a3d, [Math.cos(a) * 0.18, 0.04, Math.sin(a) * 0.18], [0.36, 0.06, 0.12], [0, -a, 0]));
  }
  P.push(part(new THREE.ConeGeometry(0.16, 0.3, 6), 0xf6c6c0, [0.7, 0.12, 0.3], [Math.PI / 2, 0, 0.4]));
  P.push(part(new THREE.ConeGeometry(0.12, 0.24, 6), 0xffe3b0, [-0.6, 0.1, -0.3], [Math.PI / 2, 0, -0.8]));
  return merge(P);
}

function buildDune() {
  const g = new THREE.SphereGeometry(1, 9, 5);
  return merge([part(g, [0xe9c487, 0xf0cf93, 0xe2bb7c][Math.floor(rnd(0, 3))], [0, 0, 0], [0, rnd(0, 3), 0], [rnd(7, 12), rnd(2.2, 4.2), rnd(5, 8)], 0.035)]);
}

function buildAcacia() {
  const trunk = 0x6b4a2a;
  return merge([
    part(CYL6, trunk, [0, 0.9, 0], [0, 0, 0.12], [0.14, 1.8, 0.14]),
    part(CYL6, trunk, [0.32, 2.0, 0], [0, 0, -0.55], [0.1, 1.0, 0.1]),
    part(CYL6, trunk, [-0.28, 2.0, 0.1], [0.3, 0, 0.55], [0.09, 0.9, 0.09]),
    part(new THREE.CylinderGeometry(1.7, 2.0, 0.42, 7), 0x6f8a3a, [0.1, 2.62, 0], [0, rnd(0, 3), 0]),
    part(new THREE.CylinderGeometry(1.05, 1.35, 0.36, 7), 0x82a046, [0.35, 2.95, 0.15], [0, rnd(0, 3), 0]),
  ]);
}

function buildRock() {
  const c = [0xbf9a68, 0xa98657, 0xc9a877][Math.floor(rnd(0, 3))];
  return merge([
    part(jagged(1, 0, 0.25, rnd(0, 9)), c, [0, 0.5, 0], [rnd(0, 3), rnd(0, 3), 0], [rnd(0.9, 1.6), rnd(0.6, 1.0), rnd(0.9, 1.4)]),
    part(jagged(0.5, 0, 0.25, rnd(0, 9)), c, [1.1, 0.25, 0.4], [rnd(0, 3), rnd(0, 3), 0], [1, 0.8, 1]),
  ]);
}

function buildBedouinTent() {
  const P = [
    box(0x2e2622, [0, 1.0, 0], [5, 0.12, 3.2], [0.12, 0, 0]),
    box(0x3a302b, [0, 0.55, -1.5], [5, 1.1, 0.06]),
    box(0x3a302b, [-2.5, 0.55, 0], [0.06, 1.1, 3.0]),
    box(0x3a302b, [2.5, 0.55, 0], [0.06, 1.1, 3.0]),
    box(0xb83a2a, [0, 0.85, 1.55], [5, 0.14, 0.04]),
    box(0xe8dcc8, [0, 0.7, 1.55], [5, 0.08, 0.04]),
  ];
  for (const x of [-2.4, -0.8, 0.8, 2.4]) P.push(box(0x6b4423, [x, 0.6, 1.5], [0.08, 1.2, 0.08]));
  return merge(P);
}

function buildCliff() {
  const P = [];
  let y = 0;
  const n = 3 + Math.floor(rnd(0, 3));
  for (let i = 0; i < n; i++) {
    const r = 2.3 - i * 0.32 + rnd(0, 0.4);
    P.push(part(jagged(r, 0, 0.25, i + rnd(0, 9)), [0x6e5a52, 0x7a6558, 0x5f4d48][i % 3], [rnd(-0.5, 0.5), y + r * 0.8, rnd(-0.5, 0.5)], [rnd(0, 3), rnd(0, 3), 0], [1, 1.25, 1]));
    y += r * 1.5;
  }
  return merge(P);
}

function buildScrub() {
  const P = [];
  for (let i = 0; i < 5; i++) {
    P.push(part(ICO, i % 2 ? 0x6b6a3a : 0x7f7a44, [rnd(-0.4, 0.4), rnd(0.15, 0.35), rnd(-0.4, 0.4)], [i, i, 0], [rnd(0.2, 0.35), rnd(0.2, 0.3), rnd(0.2, 0.35)]));
  }
  return merge(P);
}

function buildPool() {
  const P = [part(new THREE.CylinderGeometry(1.6, 1.7, 0.06, 12), 0x3fb0d0, [0, 0.03, 0], [0, 0, 0], [1, 1, 0.75], 0.02)];
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    P.push(part(ICO, k % 2 ? 0xbfae8e : 0xa8967a, [Math.cos(a) * 1.75, 0.1, Math.sin(a) * 1.3], [k, k, 0], [0.25, 0.16, 0.22]));
  }
  for (let k = 0; k < 6; k++) P.push(box(0x5c8a30, [rnd(-1.4, 1.4), 0.4, rnd(-1.2, 1.2) > 0 ? 1.4 : -1.4], [0.05, 0.8, 0.05]));
  return merge(P);
}

function buildCampfire() {
  const P = [];
  for (let k = 0; k < 4; k++) P.push(box(0x5a3a22, [0, 0.12, 0], [1.1, 0.14, 0.14], [0, (k * Math.PI) / 4, 0]));
  P.push(part(new THREE.ConeGeometry(0.35, 0.9, 6), 0xffa23c, [0, 0.55, 0]));
  P.push(part(new THREE.ConeGeometry(0.2, 0.6, 6), 0xffe08a, [0.05, 0.5, 0.05]));
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    P.push(part(ICO, 0x6f6a66, [Math.cos(a) * 0.7, 0.08, Math.sin(a) * 0.7], [k, k, 0], [0.16, 0.1, 0.16]));
  }
  return merge(P);
}

// side: 'edge' props sit just off the road; 'near' and 'far' are further out. face = turn toward the road.
export const SCENERY = {
  egypt: [
    { type: 'palm', build: buildPalm, variants: 4, x: [4.6, 13], w: 5, face: false },
    { type: 'house', build: buildHouse, variants: 3, x: [9, 16], w: 2, face: true },
    { type: 'reeds', build: buildReeds, variants: 3, x: [3.7, 5.5], w: 3, face: false },
    { type: 'smallpyr', build: buildSmallPyramid, variants: 1, x: [18, 34], w: 1, face: false, s: [0.8, 1.6] },
    { type: 'jars', build: () => obstacleGeo('jars'), variants: 1, x: [3.8, 5.5], w: 1, face: true },
    { type: 'obeliskS', build: () => obstacleGeo('obelisk'), variants: 1, x: [6, 11], w: 1, face: true },
  ],
  sea: [
    { type: 'coralbig', build: buildCoralBig, variants: 4, x: [3.6, 4.3], w: 4, face: false },
    { type: 'seaweed', build: buildSeaweed, variants: 3, x: [3.6, 4.4], w: 3, face: false, sway: true },
    { type: 'shells', build: buildShells, variants: 2, x: [3.5, 4.3], w: 2, face: false },
  ],
  wild: [
    { type: 'dune', build: buildDune, variants: 4, x: [14, 40], w: 4, face: false },
    { type: 'acacia', build: buildAcacia, variants: 3, x: [5, 14], w: 3, face: false },
    { type: 'rock', build: buildRock, variants: 4, x: [4.2, 12], w: 3, face: false },
    { type: 'btent', build: buildBedouinTent, variants: 1, x: [13, 22], w: 1, face: true },
    { type: 'camelS', build: buildCamel, variants: 1, x: [7, 15], w: 1, face: false },
    { type: 'scrub', build: buildScrub, variants: 3, x: [3.6, 7], w: 3, face: false },
  ],
  elim: [
    { type: 'palm', build: buildPalm, variants: 4, x: [4.4, 12], w: 8, face: false },
    { type: 'pool', build: buildPool, variants: 2, x: [6, 12], w: 2, face: false },
    { type: 'reeds', build: buildReeds, variants: 3, x: [3.7, 5.5], w: 3, face: false },
    { type: 'wellS', build: () => obstacleGeo('well'), variants: 1, x: [7, 12], w: 1, face: false },
    { type: 'btent', build: buildBedouinTent, variants: 1, x: [13, 22], w: 1, face: true },
  ],
  night: [
    { type: 'btent', build: buildBedouinTent, variants: 1, x: [8, 20], w: 4, face: true },
    { type: 'fire', build: buildCampfire, variants: 2, x: [5, 12], w: 3, face: false },
    { type: 'camelS', build: buildCamel, variants: 1, x: [7, 15], w: 2, face: false },
    { type: 'rock', build: buildRock, variants: 4, x: [4.2, 12], w: 2, face: false },
    { type: 'scrub', build: buildScrub, variants: 3, x: [3.6, 7], w: 2, face: false },
  ],
  sinai: [
    { type: 'cliff', build: buildCliff, variants: 4, x: [7, 18], w: 5, face: false },
    { type: 'rock2', build: buildRock, variants: 3, x: [4.2, 9], w: 3, face: false },
    { type: 'scrub2', build: buildScrub, variants: 2, x: [3.6, 7], w: 2, face: false },
    { type: 'boulderS', build: () => obstacleGeo('boulder'), variants: 1, x: [5, 10], w: 1, face: false },
  ],
};

const variantCache = {};
export function sceneryGeo(def) {
  if (!variantCache[def.type]) {
    variantCache[def.type] = [];
    for (let i = 0; i < def.variants; i++) variantCache[def.type].push(def.build());
  }
  const list = variantCache[def.type];
  const i = Math.floor(Math.random() * list.length);
  return { geo: list[i], key: def.type + i };
}

export function pickScenery(biomeId) {
  const list = SCENERY[biomeId];
  let total = 0;
  for (const d of list) total += d.w;
  let r = Math.random() * total;
  for (const d of list) { r -= d.w; if (r <= 0) return d; }
  return list[0];
}

export { OBSTACLES };
