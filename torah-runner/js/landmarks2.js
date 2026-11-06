// More Torah scenes: six for each new place (Genesis to the Valley of Elah), plus extra scenes
// of peace in Jerusalem and more of Joseph's story in Egypt. Objects and places only: no people.
import * as THREE from './three.js';
import { part, box, merge, ICO, CYL6, DODECA, buildCamel } from './models.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const GOLD = 0xf0b93a, WOOD = 0x7a4a24, STONE = 0xc8b088, RED = 0xb83a2a, BLUE = 0x2c4ea3, WHITE = 0xf4f1ea;
const cyl = (rt, rb, h, seg = 10, open = false) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open);
const cone = (r, h, seg = 8) => new THREE.ConeGeometry(r, h, seg);

// little blocky animals reused by several scenes
function sheepAt(x, z, wool = 0xf2efe6, ry = 0) {
  const c = Math.cos(ry), s = Math.sin(ry);
  const at = (dx, dz) => [x + dx * c + dz * s, z - dx * s + dz * c];
  const P = [part(ICO, wool, [x, 0.45, z], [0, ry, 0], [0.42, 0.3, 0.32])];
  const [hx, hz] = at(0, 0.38); P.push(box(0x2a2420, [hx, 0.55, hz], [0.18, 0.2, 0.22], [0, ry, 0]));
  for (const [dx, dz] of [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]]) { const [lx, lz] = at(dx, dz); P.push(box(0x2a2420, [lx, 0.15, lz], [0.06, 0.3, 0.06])); }
  return P;
}
function animalAt(x, z, col, size = 1, neck = 0) {
  const k = size;
  const P = [box(col, [x, 0.9 * k, z], [0.5 * k, 0.5 * k, 1.0 * k])];
  for (const [dx, dz] of [[-0.18, -0.35], [0.18, -0.35], [-0.18, 0.35], [0.18, 0.35]]) P.push(box(col, [x + dx * k, 0.35 * k, z + dz * k], [0.12 * k, 0.7 * k, 0.12 * k]));
  P.push(box(col, [x, (1.1 + neck) * k, z + 0.5 * k], [0.18 * k, (0.4 + neck) * k, 0.18 * k]));
  P.push(box(col, [x, (1.35 + neck * 2 - neck) * k + neck * k * 0.5, z + 0.62 * k], [0.24 * k, 0.24 * k, 0.34 * k]));
  return P;
}

// ---------------- Mount Ararat (Genesis 6-9)
function noahArk() { // the ark resting on dry land, door open
  return merge([
    box(0x7a5030, [0, 1.0, 0], [3.2, 1.6, 9]),
    part(cyl(1.6, 1.6, 9, 8, false), 0x6a4428, [0, 0.3, 0], [Math.PI / 2, 0, 0], [1, 1, 0.5]),
    box(0x8a6038, [0, 2.3, -0.5], [2.4, 1.2, 5]),
    box(0x5a3a20, [0, 3.0, -0.5], [2.8, 0.2, 5.4], [0, 0, 0]),
    ...[-2.2, -0.9, 0.4, 1.7].map((z) => box(0x3a2410, [1.21, 2.3, z - 0.5], [0.04, 0.4, 0.5])),
    box(0x3a2410, [1.62, 1.0, 1.5], [0.04, 1.0, 1.2]),
    box(0x8a6038, [2.3, 0.4, 1.5], [1.6, 0.08, 1.1], [0, 0, -0.45]),
  ]);
}
function twoByTwo() { // the animals leaving two by two (Genesis 7:9)
  return merge([
    ...animalAt(-1.4, 0, 0xd8a848, 0.9, 0.9), ...animalAt(-0.6, 0.3, 0xd8a848, 0.8, 0.9), // giraffes
    ...animalAt(0.6, 0, 0xc8a060, 0.7), ...animalAt(1.3, 0.3, 0xc8a060, 0.65), // lions
    ...sheepAt(2.3, 0), ...sheepAt(2.9, 0.4),
  ]);
}
function doveOlive() { // the dove returns with an olive leaf (Genesis 8:11)
  return merge([
    box(0x6b4a2a, [0, 1.0, 0], [0.1, 2.0, 0.1]), box(0x6b4a2a, [0.3, 1.8, 0], [0.6, 0.06, 0.06], [0, 0, 0.3]),
    part(ICO, WHITE, [0.45, 2.05, 0], [0, 0, 0], [0.22, 0.18, 0.3]), part(ICO, WHITE, [0.45, 2.2, 0.2], [0, 0, 0], [0.11, 0.11, 0.11]),
    box(WHITE, [0.2, 2.1, 0], [0.4, 0.04, 0.24], [0, 0, 0.4]), box(WHITE, [0.7, 2.1, 0], [0.4, 0.04, 0.24], [0, 0, -0.4]),
    box(0x5a8a3a, [0.45, 2.2, 0.36], [0.06, 0.04, 0.2], [0.3, 0, 0]),
  ]);
}
function noahAltar() { // Noah builds an altar (Genesis 8:20)
  const P = [];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4 - r; k++) P.push(part(DODECA, 0xa89880, [-0.6 + k * 0.4 + r * 0.2, 0.2 + r * 0.32, 0], [k, r, 0], [0.24, 0.2, 0.3]));
  for (let k = 0; k < 4; k++) P.push(part(ICO, 0xd8d8d8, [rnd(-0.1, 0.1), 1.3 + k * 0.4, 0], [k, k, 0], [0.2 + k * 0.06, 0.16, 0.2 + k * 0.06]));
  return merge(P);
}
function vineyard() { // Noah plants a vineyard (Genesis 9:20)
  const P = [];
  for (const z of [-1, 0, 1]) {
    P.push(box(WOOD, [-1.5, 0.6, z], [0.08, 1.2, 0.08]), box(WOOD, [1.5, 0.6, z], [0.08, 1.2, 0.08]), box(0x8a6a48, [0, 1.15, z], [3, 0.04, 0.04]));
    for (let k = 0; k < 6; k++) {
      P.push(part(ICO, 0x5a8a3a, [-1.3 + k * 0.52, 1.05, z], [k, k, 0], [0.22, 0.18, 0.18]));
      if (k % 2) P.push(part(ICO, 0x6a2a7a, [-1.3 + k * 0.52, 0.85, z + 0.1], [k, 0, 0], [0.1, 0.16, 0.1]));
    }
  }
  return merge(P);
}
function smallRainbow() { // the rainbow, sign of the covenant (Genesis 9:13)
  return merge([0xe2483d, 0xff9a3c, 0xffd24a, 0x3fae5a, 0x2c6fd6, 0x7a4a9a].map((c, k) =>
    part(new THREE.TorusGeometry(2.6 - k * 0.14, 0.07, 4, 24, Math.PI), c, [0, 0, 0], [0, 0, 0], [1, 1, 1], 0)));
}

// ---------------- Babel (Genesis 11)
function brickMolds() { // "let us make bricks and burn them thoroughly"
  const P = [];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) P.push(box([0xb8683a, 0xc47a44, 0xa95c30][(r + k) % 3], [-1.5 + k * 0.6, 0.08, -0.8 + r * 0.8], [0.45, 0.14, 0.3]));
  P.push(box(WOOD, [2.2, 0.08, 0], [0.6, 0.12, 0.4]), box(0x5a3a20, [2.2, 0.15, 0], [0.5, 0.04, 0.3]));
  return merge(P);
}
function tarPits() { // "slime had they for mortar" (Genesis 11:3)
  const P = [];
  for (const [x, z, r] of [[-1, 0, 0.9], [0.9, 0.5, 0.7]]) {
    P.push(part(cyl(r, r + 0.1, 0.06, 12), 0x1a1614, [x, 0.04, z]));
    P.push(part(cyl(r + 0.2, r + 0.25, 0.1, 12, true), 0x6a5a48, [x, 0.05, z]));
  }
  P.push(part(cyl(0.2, 0.16, 0.35, 8), 0x6b4a2a, [0, 0.18, -0.9]), box(0x1a1614, [0, 0.36, -0.9], [0.3, 0.02, 0.3]));
  return merge(P);
}
function scaffoldS() { // scaffolds and ladders against a rising wall
  const P = [box(0xc47a44, [0, 1.5, -0.6], [4, 3, 0.8])];
  for (const x of [-1.8, -0.6, 0.6, 1.8]) P.push(box(WOOD, [x, 2, 0.2], [0.1, 4, 0.1]));
  for (const y of [1.3, 2.6, 3.8]) P.push(box(0x9a7a56, [0, y, 0.25], [4, 0.08, 0.5]));
  for (let k = 0; k < 8; k++) P.push(box(WOOD, [2.3, 0.3 + k * 0.45, 0.6], [0.5, 0.05, 0.05]));
  P.push(box(WOOD, [2.05, 1.8, 0.6], [0.05, 3.7, 0.05]), box(WOOD, [2.55, 1.8, 0.6], [0.05, 3.7, 0.05]));
  return merge(P);
}
function miniZiggurat() { // the tower rising in steps
  const P = [];
  for (let t = 0; t < 4; t++) P.push(box([0xc47a44, 0xb8683a][t % 2], [0, 0.6 + t * 1.2, 0], [5 - t * 1.1, 1.2, 5 - t * 1.1]));
  P.push(box(0xa95c30, [1.6, 1.4, 2.0], [1.2, 0.1, 3], [0.5, 0, 0]));
  return merge(P);
}
function abandonedTools() { // they stopped building the city (Genesis 11:8)
  const P = [box(0xc47a44, [0, 0.5, 0], [3, 1.0, 0.6]), box(0xc47a44, [-0.7, 1.15, 0], [1.4, 0.3, 0.6])];
  P.push(box(WOOD, [1.4, 0.06, 1.0], [1.2, 0.06, 0.06], [0, 0.5, 0]), box(0x8a8a8a, [1.95, 0.08, 1.3], [0.25, 0.08, 0.2]));
  P.push(part(cyl(0.22, 0.18, 0.3, 8), 0x8a6a48, [-1.2, 0.15, 1.0]));
  for (let k = 0; k < 5; k++) P.push(box(0xb8683a, [rnd(-1.5, 1.5), 0.08, rnd(0.6, 1.6)], [0.4, 0.14, 0.25], [0, rnd(0, 3), 0]));
  return merge(P);
}
function brickFire() { // brick kiln fire
  return merge([
    part(new THREE.SphereGeometry(1.1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xa8683a, [0, 0, 0]),
    box(0x2a1a10, [0, 0.35, 1.0], [0.6, 0.7, 0.2]), box(0xff8a3d, [0, 0.3, 1.08], [0.4, 0.4, 0.04]),
    ...[0, 1, 2].map((k) => part(ICO, 0xb8b0a8, [0, 1.4 + k * 0.45, 0], [k, k, 0], [0.25 + k * 0.08, 0.2, 0.25 + k * 0.08])),
  ]);
}

// ---------------- Jacob's journey (Genesis 28-33)
function jacobsLadder() { // a ladder set on the earth reaching to heaven (Genesis 28:12)
  const P = [part(DODECA, 0xa89880, [0, 0.25, 0.9], [0, 0, 0], [0.5, 0.25, 0.35])]; // the stone pillow
  for (const x of [-0.5, 0.5]) P.push(box(0xfff2c8, [x, 6, 0], [0.12, 12, 0.12], [0.08, 0, 0]));
  for (let k = 0; k < 22; k++) P.push(box(0xfff2c8, [0, 0.5 + k * 0.55, -k * 0.045], [1.0, 0.07, 0.07]));
  for (let k = 0; k < 7; k++) P.push(part(ICO, 0xfff8dc, [k % 2 ? 0.25 : -0.25, 1.5 + k * 1.5, -k * 0.13], [k, k, 0], [0.16, 0.16, 0.16]));
  return merge(P);
}
function anointedPillar() { // Jacob sets up the stone as a pillar and pours oil on it (Genesis 28:18)
  return merge([
    part(DODECA, 0xb0a490, [0, 0.9, 0], [0.2, 0.3, 0], [0.45, 0.9, 0.4]),
    part(cyl(0.12, 0.16, 0.3, 8), 0xc0663a, [0.5, 0.15, 0.3]), part(cyl(0.05, 0.08, 0.12, 8), 0xc0663a, [0.5, 0.36, 0.3]),
    box(GOLD, [0, 1.7, 0.2], [0.3, 0.05, 0.2]),
  ]);
}
function wellWithStone() { // the great stone on the mouth of the well (Genesis 29:2-3)
  return merge([
    part(cyl(0.9, 1.0, 0.6, 12), STONE, [0, 0.3, 0]),
    part(cyl(0.95, 0.95, 0.25, 12), 0x9a8a78, [0.1, 0.72, 0], [0, 0, 0.08]),
    ...sheepAt(1.8, 0.4, 0xf2efe6, 1.2), ...sheepAt(-1.6, -0.3, 0xf2efe6, -0.9), ...sheepAt(-1.4, 0.9, 0xf2efe6, -2),
  ]);
}
function speckledFlock() { // the speckled and spotted flock (Genesis 30:39)
  const P = [];
  for (let i = 0; i < 6; i++) {
    const x = rnd(-2, 2), z = rnd(-1.5, 1.5);
    P.push(...sheepAt(x, z, i % 2 ? 0xe8dcc8 : 0x8a6a48, rnd(0, 6)));
    for (let k = 0; k < 3; k++) P.push(part(ICO, i % 2 ? 0x3a2a20 : 0xf2efe6, [x + rnd(-0.25, 0.25), 0.62, z + rnd(-0.2, 0.2)], [k, k, 0], [0.08, 0.04, 0.08]));
  }
  for (let k = 0; k < 3; k++) P.push(box(0xd8c8a8, [2.6, 0.5, -0.6 + k * 0.6], [0.06, 1.0, 0.06], [0.1, 0, 0.1]));
  return merge(P);
}
function galEd() { // the heap of witness: a covenant of peace with Laban (Genesis 31:46-48)
  const P = [part(DODECA, 0xb8a890, [0, 1.6, -0.6], [0, 0, 0], [0.4, 1.1, 0.4])];
  for (let r = 0; r < 4; r++) for (let k = 0; k < 8 - r * 2; k++) {
    const a = (k / (8 - r * 2)) * Math.PI * 2;
    P.push(part(DODECA, [0xa89880, 0xb8a890, 0x988870][k % 3], [Math.cos(a) * (1.1 - r * 0.25), 0.2 + r * 0.32, Math.sin(a) * (0.9 - r * 0.2)], [k, r, 0], [0.26, 0.22, 0.26]));
  }
  return merge(P);
}
function giftsForEsau() { // droves of gifts sent ahead to make peace with Esau (Genesis 32:14-16)
  const camel = buildCamel();
  camel.scale(0.7, 0.7, 0.7);
  camel.translate(-2.2, 0, 0);
  return merge([camel, ...animalAt(0, 0.2, 0x6a5a48, 0.8), ...animalAt(1.2, -0.2, 0x8a7a68, 0.65), ...sheepAt(2.2, 0.4), ...sheepAt(2.7, -0.2)]);
}

export {
  sheepAt, animalAt, noahArk, twoByTwo, doveOlive, noahAltar, vineyard, smallRainbow,
  brickMolds, tarPits, scaffoldS, miniZiggurat, abandonedTools, brickFire,
  jacobsLadder, anointedPillar, wellWithStone, speckledFlock, galEd, giftsForEsau,
};
