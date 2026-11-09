// Scenes for the ten newer places: Eden, Beersheba, Ein Gedi, Jonah's sea, Babylon, Shushan, Modiin,
// Safed, Brooklyn and Coney Island. Six for each. Objects and places only: no people.
// Exports LANDMARKS3 for scenery.js.
import * as THREE from './three.js';
import { part, box, merge, ICO, CYL6, DODECA, buildCamel } from './models.js';
import { sheepAt, animalAt } from './landmarks2.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const GOLD = 0xf0b93a, WOOD = 0x7a4a24, STONE = 0xc8b088, RED = 0xb83a2a, BLUE = 0x2c4ea3, WHITE = 0xf4f1ea;
const LEAF = 0x4f9a3a, LEAF2 = 0x6ab04a;
const cyl = (rt, rb, h, seg = 10) => new THREE.CylinderGeometry(rt, rb, h, seg);
const cone = (r, h, seg = 8) => new THREE.ConeGeometry(r, h, seg);
const sph = (seg = 10) => new THREE.SphereGeometry(1, seg, Math.max(4, seg / 2));
const torus = (R, r, arc = Math.PI * 2, seg = 24) => new THREE.TorusGeometry(R, r, 6, seg, arc);
const L = (type, build, x, face = true, w = 0.9) => ({ type, build, variants: 1, x, w, face });

function leafyTree(h, crown, col = LEAF, trunk = 0x6b4a2a) {
  return [part(CYL6, trunk, [0, h / 2, 0], [0, 0, 0], [0.18 * crown, h, 0.18 * crown]),
    part(ICO, col, [0, h + crown * 0.4, 0], [0.3, 0.5, 0], [crown, crown * 0.8, crown]),
    part(ICO, LEAF2, [crown * 0.5, h + crown * 0.2, 0.3], [0.7, 0.1, 0], [crown * 0.6, crown * 0.5, crown * 0.6])];
}
function fruitDots(P, n, y, r, col) {
  for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; P.push(part(ICO, col, [Math.cos(a) * r, y + Math.sin(k * 2.3) * 0.5, Math.sin(a) * r], [k, k, 0], [0.16, 0.16, 0.16])); }
}

// ---------------- The Garden of Eden (Genesis 2-3)
function treeOfLife() { // the tree of life in the middle of the garden (Genesis 2:9)
  const P = leafyTree(3.2, 2.2, 0x3f8f3a);
  fruitDots(P, 14, 3.8, 1.9, GOLD);
  return merge(P);
}
function treeOfKnowledge() { // the tree of knowledge of good and bad, its fruit glowing red
  const P = leafyTree(2.6, 1.8, 0x5aa040);
  fruitDots(P, 10, 3.0, 1.5, RED);
  P.push(part(ICO, RED, [0.7, 0.12, 0.8], [0, 0, 0], [0.15, 0.15, 0.15]));
  return merge(P);
}
function fourRivers() { // a river went out of Eden and parted into four (Genesis 2:10)
  const P = [part(cyl(0.9, 1.0, 0.1, 14), 0x6ac0e8, [0, 0.05, 0])];
  for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4; P.push(box(0x6ac0e8, [Math.cos(a) * 2, 0.04, Math.sin(a) * 2], [0.6, 0.06, 2.4], [0, -a + Math.PI / 2, 0])); }
  for (let k = 0; k < 8; k++) P.push(part(ICO, [0xc8c0b0, 0xa8a090][k % 2], [rnd(-3, 3), 0.1, rnd(-3, 3)], [k, k, 0], [0.18, 0.1, 0.15]));
  return merge(P);
}
function flowerMeadow() {
  const P = [];
  const cols = [0xffd24a, 0xf06d9a, 0xffffff, 0x9a6ae0, 0xff8a3d];
  for (let k = 0; k < 26; k++) { const x = rnd(-2.2, 2.2), z = rnd(-1.4, 1.4); P.push(box(0x4f8f3a, [x, 0.18, z], [0.04, 0.36, 0.04]), part(ICO, cols[k % 5], [x, 0.4, z], [k, k, 0], [0.12, 0.08, 0.12])); }
  return merge(P);
}
function peacefulAnimals() { // the animals named in the garden (Genesis 2:19)
  return merge([...animalAt(-1.2, 0, 0xd8a24a, 0.9), ...animalAt(0.4, 0.4, 0xa88a6a, 0.7, 0.6), ...sheepAt(1.6, -0.2), ...sheepAt(2.1, 0.5)]);
}
function figLeaves() { // fig leaves sewn together (Genesis 3:7)
  const P = [part(CYL6, 0x6b4a2a, [0, 0.9, 0], [0, 0, 0], [0.16, 1.8, 0.16])];
  for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2; P.push(box(0x3f7a2a, [Math.cos(a) * 0.7, 1.9 + (k % 3) * 0.15, Math.sin(a) * 0.7], [0.6, 0.04, 0.5], [0.3, a, 0.2])); }
  return merge(P);
}

// ---------------- Beersheba (Genesis 21, 26)
function tamarisk() { // Abraham planted a tamarisk tree in Beersheba (Genesis 21:33)
  const P = [part(CYL6, 0x7a5a3a, [0, 1, 0], [0.08, 0, 0.05], [0.22, 2, 0.22])];
  for (let k = 0; k < 12; k++) P.push(part(ICO, k % 2 ? 0x8aa878 : 0x9ab888, [rnd(-1.3, 1.3), 2.2 + rnd(0, 1.2), rnd(-1.1, 1.1)], [k, k, 0], [0.7, 0.45, 0.7]));
  return merge(P);
}
function sevenLambs() { // seven ewe lambs as a witness of the well (Genesis 21:28-30)
  const P = [];
  for (let k = 0; k < 7; k++) P.push(...sheepAt(-2.1 + k * 0.7, Math.sin(k) * 0.3, 0xf6f2ea, 0.3));
  return merge(P);
}
function oathWell() { // "the well of the oath"
  const P = [part(cyl(1, 1.1, 0.8, 12), STONE, [0, 0.4, 0]), part(cyl(0.75, 0.75, 0.82, 12), 0x3a5a7a, [0, 0.42, 0])];
  P.push(box(WOOD, [-0.9, 1.2, 0], [0.1, 1.6, 0.1]), box(WOOD, [0.9, 1.2, 0], [0.1, 1.6, 0.1]), box(WOOD, [0, 2, 0], [2, 0.1, 0.1]));
  P.push(part(cyl(0.18, 0.15, 0.3, 8), 0x8a5a2a, [0.2, 1.4, 0]), box(0xd8c8a0, [0.2, 1.7, 0], [0.02, 0.6, 0.02]));
  return merge(P);
}
function stoppedWells() { // the Philistines filled Abraham's wells with earth (Genesis 26:15-18)
  const P = [];
  for (let k = 0; k < 3; k++) { P.push(part(cyl(0.7, 0.8, 0.5, 10), STONE, [k * 2 - 2, 0.25, 0]), part(sph(8), 0xb89060, [k * 2 - 2, 0.45, 0], [0, 0, 0], [0.6, 0.35, 0.6])); }
  return merge(P);
}
function abrahamTent() { // the tent open on all sides for guests (Genesis 18:1)
  const P = [box(0x3a2a20, [0, 1.6, 0], [3, 0.1, 2.4]), box(0x6a2a2a, [0, 1.62, 0], [3, 0.06, 0.25])];
  for (const [x, z] of [[-1.4, -1.1], [1.4, -1.1], [-1.4, 1.1], [1.4, 1.1], [0, -1.1], [0, 1.1]]) P.push(box(WOOD, [x, 0.8, z], [0.08, 1.6, 0.08]));
  P.push(box(0xb83a2a, [0, 0.05, 0], [2.2, 0.04, 1.6]), part(cyl(0.3, 0.25, 0.2, 10), 0xd8b080, [0, 0.15, 0]), part(cyl(0.12, 0.1, 0.4, 8), 0x8a5a2a, [0.6, 0.25, 0.3]));
  return merge(P);
}
function negevCamels() {
  const c = buildCamel(); c.scale(0.8, 0.8, 0.8); c.translate(-1, 0, 0);
  const c2 = buildCamel(); c2.scale(0.7, 0.7, 0.7); c2.translate(1.2, 0, 0.6);
  return merge([c, c2]);
}

// ---------------- Ein Gedi (1 Samuel 24)
function waterfall() { // the spring of Ein Gedi falling into a pool
  const P = [part(DODECA, 0xb8a078, [0, 1.6, -0.4], [0, 0, 0], [1.6, 1.8, 0.9]), box(0x8ad0f0, [0, 1.6, 0.35], [0.5, 3, 0.1]), part(cyl(1.2, 1.2, 0.1, 14), 0x6ac0e8, [0, 0.05, 0.9])];
  for (let k = 0; k < 5; k++) P.push(part(ICO, 0x5a9a3a, [rnd(-1.4, 1.4), 0.3, rnd(0.2, 1.6)], [k, k, 0], [0.35, 0.3, 0.35]));
  return merge(P);
}
function ibex() { // the rocks of the wild goats (1 Samuel 24:2)
  const P = [part(DODECA, 0xb8a078, [0, 0.7, 0], [0, 0, 0], [1.4, 0.8, 1])];
  for (const [x, s] of [[-0.4, 0.55], [0.5, 0.45]]) {
    P.push(...animalAt(x, 0, 0x9a7a5a, s).map((g) => { g.translate(0, 1.2, 0); return g; }));
    P.push(part(torus(0.25 * s * 2, 0.04, Math.PI), 0x5a4a3a, [x, 1.2 + 1.55 * s, 0.55 * s], [0, Math.PI / 2, 0]));
  }
  return merge(P);
}
function caveMouth() { // the cave where David cut the corner of Saul's robe (1 Samuel 24:4)
  const P = [part(sph(10), 0xb09870, [0, 0, 0], [0, 0, 0], [2.4, 2.2, 1.6]), part(sph(8), 0x2a2018, [0, 0.6, 1.2], [0, 0, 0], [0.9, 1, 0.5])];
  P.push(box(0x8a2a2a, [0.9, 0.12, 1.6], [0.5, 0.04, 0.3], [0, 0.4, 0]));
  return merge(P);
}
function deadSeaSalt() { // salt crystals on the shore of the Salt Sea
  const P = [part(cyl(2.2, 2.2, 0.04, 16), 0x7ac8d8, [0, 0.02, 0], [0, 0, 0], [1, 1, 0.6])];
  for (let k = 0; k < 9; k++) P.push(part(ICO, 0xf8f8f4, [rnd(-2, 2), 0.18, rnd(-0.8, 0.8) + 1.2], [k, k, 0], [0.22, 0.18 + rnd(0, 0.2), 0.2]));
  return merge(P);
}
function dateGrove() {
  const P = [];
  for (const [x, h] of [[-1.2, 3], [0.6, 3.6], [1.8, 2.8]]) {
    P.push(part(CYL6, 0x7a5a3a, [x, h / 2, 0], [0, 0, 0], [0.16, h, 0.16]));
    for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2; P.push(box(0x4f8f3a, [x + Math.cos(a) * 0.8, h, Math.sin(a) * 0.8], [1.6, 0.06, 0.3], [0, -a, -0.4])); }
    P.push(part(ICO, 0xb8682a, [x, h - 0.3, 0.2], [0, 0, 0], [0.25, 0.3, 0.25]));
  }
  return merge(P);
}
function shepherdHarp() { // David's harp resting on a rock
  const P = [part(DODECA, 0xa89880, [0, 0.3, 0], [0, 0, 0], [0.6, 0.35, 0.5])];
  P.push(part(torus(0.5, 0.05, Math.PI * 1.1), WOOD, [0, 1.1, 0], [0, 0, 0.3]), box(WOOD, [-0.35, 0.95, 0], [0.06, 0.8, 0.06], [0, 0, 0.3]));
  for (let k = 0; k < 6; k++) P.push(box(0xf0e8c8, [-0.25 + k * 0.1, 1.0, 0], [0.01, 0.6 - k * 0.04, 0.01]));
  return merge(P);
}

// ---------------- Jonah's sea (Jonah 1-4)
function bigFish() { // a great fish rising from the waves (Jonah 2:1)
  const P = [part(cyl(2.4, 2.4, 0.1, 16), 0x3a7ab0, [0, 0.05, 0])];
  P.push(part(sph(12), 0x4a6a8a, [0, 0.6, 0], [0, 0, 0], [2.2, 1.0, 1.0]), part(sph(10), 0xd8e0e8, [0.2, 0.4, 0], [0, 0, 0], [1.8, 0.6, 0.9]));
  P.push(box(0x4a6a8a, [-2.3, 1.1, 0], [0.3, 1.2, 1.4], [0, 0, 0.5]), part(ICO, 0xffffff, [1.4, 1.2, 0.6], [0, 0, 0], [0.12, 0.12, 0.12]));
  for (let k = 0; k < 4; k++) P.push(part(ICO, 0xdff4ff, [rnd(-1, 1), 1.8 + k * 0.3, rnd(-0.3, 0.3)], [k, k, 0], [0.15, 0.2, 0.15]));
  return merge(P);
}
function tarshishShip() { // the ship to Tarshish (Jonah 1:3)
  const P = [box(WOOD, [0, 0.6, 0], [3.4, 0.7, 1.1]), box(0x6b3e1e, [0, 1.0, 0], [3.6, 0.12, 1.2]), box(WOOD, [1.8, 0.9, 0], [0.4, 0.6, 0.9], [0, 0, 0.5])];
  P.push(box(0x5a3a1c, [0, 2.2, 0], [0.1, 2.6, 0.1]), box(WHITE, [0.05, 2.4, 0], [0.04, 1.8, 1.6]), box(0x2c6fd6, [0.06, 2.4, 0], [0.05, 0.25, 1.6]));
  return merge(P);
}
function cargoOverboard() { // they threw the cargo into the sea to lighten the ship (Jonah 1:5)
  const P = [part(cyl(2, 2, 0.06, 14), 0x3a7ab0, [0, 0.03, 0])];
  for (let k = 0; k < 6; k++) P.push(part(cyl(0.25, 0.25, 0.5, 10), 0x8a5a2a, [rnd(-1.6, 1.6), 0.2, rnd(-1.4, 1.4)], [Math.PI / 2, k, 0]), box(0xb88a5a, [rnd(-1.6, 1.6), 0.15, rnd(-1.4, 1.4)], [0.5, 0.3, 0.4], [0, k, 0.2]));
  return merge(P);
}
function gourdVine() { // the gourd plant that grew to give Jonah shade (Jonah 4:6)
  const P = [];
  for (const x of [-1, 1]) P.push(box(WOOD, [x, 1, 0], [0.08, 2, 0.08]));
  P.push(box(WOOD, [0, 2, 0], [2.2, 0.08, 0.08]));
  for (let k = 0; k < 14; k++) P.push(box(k % 2 ? 0x4f9a3a : 0x6ab04a, [rnd(-1.1, 1.1), 2.1 + rnd(-0.1, 0.2), rnd(-0.5, 0.5)], [0.6, 0.05, 0.5], [rnd(-0.2, 0.2), k, 0]));
  P.push(part(sph(8), 0xd8c050, [0.4, 1.7, 0.2], [0, 0, 0], [0.25, 0.3, 0.25]), part(sph(8), 0xd8c050, [-0.5, 1.75, -0.1], [0, 0, 0], [0.22, 0.28, 0.22]));
  return merge(P);
}
function ninevehGate() { // Nineveh, the great city, with sackcloth hung for repentance (Jonah 3:6)
  const P = [box(0xc8a878, [-1.6, 1.6, 0], [1, 3.2, 1]), box(0xc8a878, [1.6, 1.6, 0], [1, 3.2, 1]), box(0xc8a878, [0, 3.0, 0], [4.2, 0.6, 1])];
  for (let k = 0; k < 4; k++) P.push(box(0xc8a878, [-1.8 + k * 1.2, 3.5, 0], [0.5, 0.4, 1]));
  P.push(box(0x6a5a44, [0, 2.3, 0.52], [1.6, 0.8, 0.02]), part(ICO, GOLD, [-1.6, 2.6, 0.52], [0, 0, 0], [0.22, 0.22, 0.05]), part(ICO, GOLD, [1.6, 2.6, 0.52], [0, 0, 0], [0.22, 0.22, 0.05]));
  return merge(P);
}
function stormClouds() {
  const P = [box(0x5a3a1c, [0, 1, 0], [0.1, 2, 0.1])];
  for (let k = 0; k < 6; k++) P.push(part(ICO, 0x6a7280, [rnd(-1.2, 1.2), 2.6 + rnd(0, 0.5), rnd(-0.5, 0.5)], [k, k, 0], [0.7, 0.45, 0.6]));
  P.push(box(0xfff2a0, [0.3, 1.8, 0], [0.08, 0.7, 0.04], [0, 0, 0.4]), box(0xfff2a0, [0.15, 1.3, 0], [0.08, 0.6, 0.04], [0, 0, -0.4]));
  return merge(P);
}

// ---------------- Babylon (Psalm 137, Daniel)
function willowHarps() { // "we hung our harps on the willows" (Psalm 137:2)
  const P = [part(CYL6, 0x6b5a44, [0, 1.3, 0], [0, 0, 0], [0.2, 2.6, 0.2])];
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; P.push(box(k % 2 ? 0x7aa04a : 0x8ab05a, [Math.cos(a) * 0.9, 2, Math.sin(a) * 0.9], [0.16, 1.6, 0.16], [Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3])); }
  for (const [x, z] of [[0.8, 0.3], [-0.6, 0.6]]) { P.push(part(torus(0.25, 0.03, Math.PI), WOOD, [x, 1.5, z], [0, 0, 0.2])); for (let s = 0; s < 4; s++) P.push(box(0xf0e8c8, [x - 0.12 + s * 0.08, 1.45, z], [0.01, 0.3, 0.01])); }
  return merge(P);
}
function ishtarGate() { // the blue-glazed gate of Babylon with golden animals
  const P = [box(0x2a5ab8, [-1.5, 1.8, 0], [1.2, 3.6, 1]), box(0x2a5ab8, [1.5, 1.8, 0], [1.2, 3.6, 1]), box(0x2a5ab8, [0, 3.3, 0], [4.2, 0.8, 1])];
  for (let k = 0; k < 7; k++) P.push(box(0x2a5ab8, [-1.8 + k * 0.6, 3.85, 0], [0.3, 0.3, 1]));
  for (const x of [-1.5, 1.5]) for (const y of [1, 2.2]) P.push(box(GOLD, [x, y, 0.51], [0.7, 0.3, 0.02]), box(GOLD, [x + 0.3, y + 0.2, 0.51], [0.15, 0.2, 0.02]));
  P.push(box(0xd8c8a0, [0, 0.02, 0], [2, 0.04, 2]));
  return merge(P);
}
function hangingGardens() {
  const P = [];
  for (let t = 0; t < 4; t++) {
    const w = 3 - t * 0.6;
    P.push(box(0xc8a070, [0, 0.4 + t * 0.8, 0], [w, 0.8, w * 0.7]));
    for (let k = 0; k < 5; k++) P.push(part(ICO, k % 2 ? LEAF : LEAF2, [-w / 2 + (k + 0.5) * (w / 5), 0.9 + t * 0.8, w * 0.35], [k, t, 0], [0.25, 0.3, 0.2]), box(LEAF, [-w / 2 + (k + 0.5) * (w / 5), 0.55 + t * 0.8, w * 0.36], [0.06, 0.5, 0.04]));
  }
  return merge(P);
}
function lionsDen() { // Daniel's den, the mouths of the lions shut (Daniel 6:23)
  const P = [part(cyl(1.6, 1.8, 0.7, 12), STONE, [0, 0.35, 0]), part(cyl(1.3, 1.3, 0.72, 12), 0x5a4a3a, [0, 0.37, 0])];
  for (const [x, z, ry] of [[-0.6, 0.2, 0.4], [0.5, -0.3, -0.6]]) { P.push(...animalAt(x, z, 0xd8a24a, 0.5).map((g) => { g.translate(0, 0.3, 0); return g; })); P.push(part(ICO, 0xa86a2a, [x, 1.15, z + 0.3], [0, ry, 0], [0.22, 0.22, 0.18])); }
  P.push(box(0x8a8a8a, [0, 0.75, 0], [2.4, 0.06, 0.2]), box(0x8a8a8a, [0, 0.75, 0], [0.2, 0.06, 2.4]));
  return merge(P);
}
function writingWall() { // the writing on the wall (Daniel 5:25)
  const P = [box(0xe8dcc0, [0, 1.4, 0], [3.2, 2.8, 0.3]), box(GOLD, [0, 2.9, 0], [3.4, 0.15, 0.4])];
  for (let k = 0; k < 4; k++) P.push(box(0x2a2236, [-1.1 + k * 0.72, 1.8, 0.16], [0.42, 0.42, 0.02]));
  P.push(part(cyl(0.12, 0.12, 0.5, 8), GOLD, [1.3, 0.25, 0.4]), part(cone(0.07, 0.15, 6), 0xffb03a, [1.3, 0.58, 0.4]));
  return merge(P);
}
function ziggurat2() {
  const P = [];
  for (let t = 0; t < 5; t++) P.push(box([0xc47a44, 0xb8683a, 0xa95c30][t % 3], [0, 0.3 + t * 0.6, 0], [3.4 - t * 0.6, 0.6, 3.4 - t * 0.6]));
  P.push(box(0x9a5a30, [0, 0.9, 1.5], [0.5, 1.6, 0.6], [0.6, 0, 0]));
  return merge(P);
}

// ---------------- Shushan (the book of Esther)
function persianColumns() { // the palace with white, green and blue hangings (Esther 1:6)
  const P = [box(0xe8e0d0, [0, 0.1, 0], [4.4, 0.2, 1.6])];
  for (const x of [-1.8, -0.6, 0.6, 1.8]) P.push(part(cyl(0.2, 0.24, 3, 10), 0xe8e0d0, [x, 1.7, 0]), box(0xd8c8a0, [x, 3.3, 0], [0.8, 0.25, 0.4]), part(ICO, 0xb8a078, [x - 0.3, 3.5, 0], [0, 0, 0], [0.2, 0.18, 0.15]), part(ICO, 0xb8a078, [x + 0.3, 3.5, 0], [0, 0, 0], [0.2, 0.18, 0.15]));
  P.push(box(0xe8e0d0, [0, 3.65, 0], [4.4, 0.2, 1]));
  [0xffffff, 0x3a9a5a, 0x2c6fd6].forEach((c, k) => P.push(box(c, [-1.2 + k * 1.2, 2.6, 0.25], [1, 1.1, 0.03])));
  return merge(P);
}
function kingsScepter() { // the golden sceptre held out to Esther (Esther 5:2)
  const P = [box(0x7a3a8a, [0, 0.5, 0], [1.4, 1, 1]), box(GOLD, [0, 1.02, 0], [1.5, 0.06, 1.1])];
  P.push(box(GOLD, [0, 1.6, 0.2], [0.08, 1.2, 0.08], [0.3, 0, 0]), part(ICO, GOLD, [0, 2.2, 0.38], [0, 0, 0], [0.16, 0.16, 0.16]));
  P.push(box(0x7a3a8a, [0, 1.5, -0.45], [1.4, 1.2, 0.2]), part(ICO, GOLD, [0, 2.15, -0.45], [0, 0, 0], [0.2, 0.2, 0.08]));
  return merge(P);
}
function purimFeast() { // feasting and gifts of food (Esther 9:22)
  const P = [box(WOOD, [0, 0.7, 0], [2.6, 0.08, 1]), box(WOOD, [-1.1, 0.35, 0], [0.08, 0.7, 0.08]), box(WOOD, [1.1, 0.35, 0], [0.08, 0.7, 0.08])];
  for (let k = 0; k < 5; k++) { const x = -1 + k * 0.5; P.push(part(cone(0.16, 0.08, 3), 0xd8a050, [x, 0.8, -0.1], [Math.PI / 2, 0, k]), part(ICO, 0x2a1a30, [x, 0.8, -0.1], [0, 0, 0], [0.05, 0.03, 0.05])); }
  P.push(part(cyl(0.12, 0.1, 0.3, 8), GOLD, [0.8, 0.9, 0.25]), part(cyl(0.12, 0.1, 0.3, 8), GOLD, [-0.8, 0.9, 0.25]), box(0xb83a2a, [0, 0.82, 0.3], [0.4, 0.16, 0.2]));
  return merge(P);
}
function groggers() { // noisemakers for Purim
  const P = [];
  for (let k = 0; k < 3; k++) { const x = -0.8 + k * 0.8; P.push(box(WOOD, [x, 0.5, 0], [0.06, 1, 0.06]), box([RED, BLUE, GOLD][k], [x + 0.2, 1.05, 0], [0.4, 0.3, 0.12], [0, 0, 0.2]), part(cyl(0.06, 0.06, 0.16, 8), 0x8a8a8a, [x, 1.05, 0], [Math.PI / 2, 0, 0])); }
  return merge(P);
}
function royalScroll() { // the king's letters sent by swift horses (Esther 8:10)
  const P = [box(0xecdab0, [0, 0.7, 0], [1.4, 0.02, 0.9], [-0.4, 0, 0]), part(cyl(0.07, 0.07, 1, 8), 0x6d3e1c, [-0.72, 0.72, 0], [-0.4, 0, Math.PI / 2]), part(cyl(0.07, 0.07, 1, 8), 0x6d3e1c, [0.72, 0.72, 0], [-0.4, 0, Math.PI / 2])];
  P.push(box(WOOD, [0, 0.35, 0], [0.1, 0.7, 0.1]), part(ICO, RED, [0.4, 0.62, 0.2], [0, 0, 0], [0.1, 0.1, 0.03]));
  P.push(...animalAt(2, 0, 0x6a4a2a, 0.75));
  return merge(P);
}
function mordecaiHorse() { // the royal horse led through the city square (Esther 6:11)
  const P = animalAt(0, 0, 0xf4f1ea, 1);
  P.push(box(0x7a3a8a, [0, 1.18, 0], [0.56, 0.08, 0.7]), box(GOLD, [0, 1.2, 0], [0.58, 0.04, 0.12]), part(cone(0.18, 0.3, 6), GOLD, [0, 1.85, 0.62]));
  return merge(P);
}

// ---------------- Modiin and Hanukkah (Books of the Maccabees)
function templeMenorah() { // the golden menorah, lit again with the little jar of oil
  const P = [part(cyl(0.5, 0.6, 0.2, 10), GOLD, [0, 0.1, 0]), box(GOLD, [0, 1.2, 0], [0.1, 2.2, 0.1])];
  for (let k = 1; k <= 3; k++) for (const s of [-1, 1]) {
    const r = k * 0.35;
    P.push(part(torus(r, 0.04, Math.PI, 14), GOLD, [0, 1.6, 0], [0, 0, Math.PI]));
    P.push(box(GOLD, [s * r, 1.95, 0], [0.06, 0.6, 0.06]), part(cone(0.07, 0.16, 6), 0xffb03a, [s * r, 2.35, 0]));
  }
  P.push(part(cone(0.07, 0.16, 6), 0xffb03a, [0, 2.4, 0]));
  return merge(P);
}
function oilJar() { // one small jar of pure oil with the High Priest's seal
  const P = [part(sph(10), 0xc89a5a, [0, 0.5, 0], [0, 0, 0], [0.4, 0.5, 0.4]), part(cyl(0.12, 0.16, 0.3, 8), 0xc89a5a, [0, 1.05, 0]), part(ICO, RED, [0, 0.6, 0.38], [0, 0, 0], [0.1, 0.1, 0.03])];
  P.push(box(STONE, [0, 0.05, 0], [1, 0.1, 1]));
  return merge(P);
}
function hanukkiahHill() { // a big hanukkiah with eight lights and the shamash
  const P = [box(0x8a8a90, [0, 0.15, 0], [3.4, 0.3, 0.5]), box(0x8a8a90, [0, 0.9, 0], [0.12, 1.5, 0.12])];
  for (let k = 0; k < 9; k++) { const x = -1.6 + k * 0.4, h = k === 4 ? 2.1 : 1.6; P.push(box(0xc0c4ca, [x, h - 0.4, 0], [0.06, 0.8, 0.06]), part(cone(0.07, 0.18, 6), 0xffb03a, [x, h + 0.05, 0])); }
  P.push(box(0xc0c4ca, [0, 1.2, 0], [3.4, 0.08, 0.08]));
  return merge(P);
}
function warElephants() { // the war elephants of the Seleucid army (1 Maccabees 6)
  const P = [];
  for (const [x, s] of [[-1.2, 1.2], [1.4, 1]]) {
    P.push(box(0x8a8a90, [x, 1.2 * s, 0], [1 * s, 1 * s, 1.8 * s]));
    for (const [dx, dz] of [[-0.3, -0.6], [0.3, -0.6], [-0.3, 0.6], [0.3, 0.6]]) P.push(box(0x8a8a90, [x + dx * s, 0.4 * s, dz * s], [0.3 * s, 0.8 * s, 0.3 * s]));
    P.push(box(0x8a8a90, [x, 1.3 * s, 1.1 * s], [0.6 * s, 0.6 * s, 0.5 * s]), box(0x8a8a90, [x, 0.8 * s, 1.4 * s], [0.18 * s, 0.9 * s, 0.18 * s]));
    P.push(box(RED, [x, 1.85 * s, 0], [0.9 * s, 0.4 * s, 1 * s]), box(GOLD, [x, 2.1 * s, 0], [0.95 * s, 0.08 * s, 1.05 * s]));
  }
  return merge(P);
}
function dreidelSpin() { // spinning tops with נ ג ה ש
  const P = [];
  [RED, BLUE, GOLD, 0x3fae5a].forEach((c, k) => { const x = -1.2 + k * 0.8; P.push(box(c, [x, 0.45, 0], [0.4, 0.4, 0.4], [0, k * 0.4, 0]), part(cone(0.28, 0.3, 4), c, [x, 0.12, 0], [Math.PI, Math.PI / 4 + k * 0.4, 0]), box(WOOD, [x, 0.75, 0], [0.06, 0.25, 0.06])); });
  return merge(P);
}
function maccabeeHammer() { // "Maccabee" is often explained as "the hammer"
  const P = [box(WOOD, [0, 0.8, 0], [0.12, 1.6, 0.12], [0, 0, 0.3]), box(0x8a8a90, [-0.24, 1.55, 0], [0.7, 0.35, 0.35], [0, 0, 0.3])];
  P.push(part(DODECA, 0xa89880, [0.5, 0.3, 0.2], [0, 0, 0], [0.4, 0.3, 0.35]), box(BLUE, [0.8, 1.6, -0.4], [0.7, 0.45, 0.03]), box(WOOD, [0.45, 1.2, -0.4], [0.05, 2.4, 0.05]));
  return merge(P);
}

// ---------------- Safed
function blueDoor() { // the blue doors and walls of Safed
  const P = [box(0xf2eee4, [0, 1.4, 0], [2.4, 2.8, 1.6]), box(0x3a8ad6, [0, 0.9, 0.81], [0.8, 1.6, 0.04]), part(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 12, 1, false, -Math.PI / 2, Math.PI), 0x3a8ad6, [0, 1.7, 0.81], [Math.PI / 2, 0, 0])];
  P.push(box(0x3a8ad6, [-0.8, 1.9, 0.81], [0.4, 0.5, 0.04]), box(0x3a8ad6, [0.8, 1.9, 0.81], [0.4, 0.5, 0.04]), box(GOLD, [0.33, 1.2, 0.84], [0.04, 0.2, 0.04]));
  return merge(P);
}
function stoneSynagogue() { // an old stone synagogue with a blue dome
  const P = [box(0xe2dccc, [0, 1.2, 0], [2.6, 2.4, 2.2]), part(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0x3a8ad6, [0, 2.4, 0], [0, 0, 0], [0.9, 0.8, 0.9])];
  for (const x of [-0.7, 0, 0.7]) P.push(box(0x3a6ab0, [x, 1.5, 1.11], [0.35, 0.7, 0.03]));
  P.push(box(0x6b4a2a, [0, 0.55, 1.11], [0.6, 1.1, 0.03]));
  return merge(P);
}
function artistEasel() { // the artists' quarter
  const P = [box(WOOD, [-0.3, 0.8, 0], [0.06, 1.7, 0.06], [0.15, 0, 0.2]), box(WOOD, [0.3, 0.8, 0], [0.06, 1.7, 0.06], [0.15, 0, -0.2]), box(WOOD, [0, 0.8, -0.3], [0.06, 1.7, 0.06], [-0.4, 0, 0])];
  P.push(box(0xffffff, [0, 1.3, 0.12], [0.9, 0.7, 0.03], [0.15, 0, 0]), box(0x3a8ad6, [-0.15, 1.35, 0.15], [0.4, 0.3, 0.01], [0.15, 0, 0]), box(GOLD, [0.25, 1.45, 0.15], [0.2, 0.2, 0.01], [0.15, 0, 0]));
  return merge(P);
}
function meronHill() { // Mount Meron, with bonfires on Lag BaOmer
  const P = [part(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0x8a9a6a, [0, 0, 0], [2.4, 1.6, 2])];
  for (let k = 0; k < 3; k++) { const x = -0.8 + k * 0.8; P.push(box(WOOD, [x, 1.3 + Math.abs(k - 1) * -0.3, 0.6], [0.5, 0.1, 0.1], [0, k, 0.4]), part(cone(0.22, 0.5, 6), 0xff9a3c, [x, 1.6 + Math.abs(k - 1) * -0.3, 0.6]), part(cone(0.12, 0.3, 6), 0xffe07a, [x, 1.65 + Math.abs(k - 1) * -0.3, 0.6])); }
  return merge(P);
}
function cypressRow() {
  const P = [];
  for (let k = 0; k < 4; k++) P.push(part(cone(0.35, 2.6, 7), 0x2f5a3a, [-1.5 + k, 1.5, 0]), part(CYL6, 0x5a4a3a, [-1.5 + k, 0.15, 0], [0, 0, 0], [0.08, 0.3, 0.08]));
  return merge(P);
}
function candleShop() { // Safed's candle makers: braided havdalah candles
  const P = [box(WOOD, [0, 0.5, 0], [2, 1, 0.8]), box(0xe8dcc0, [0, 1.02, 0], [2.05, 0.04, 0.85])];
  [RED, BLUE, 0xf0e090, 0xf06d9a, 0x3fae5a].forEach((c, k) => P.push(part(cyl(0.08, 0.08, 0.6, 8), c, [-0.8 + k * 0.4, 1.35, 0], [0, 0, 0.08]), part(cyl(0.06, 0.06, 0.6, 8), 0xf4f1ea, [-0.75 + k * 0.4, 1.35, 0.05], [0, 0, -0.08])));
  return merge(P);
}

// ---------------- Brooklyn
function brownstone() {
  const P = [box(0x8a4a34, [0, 2.2, 0], [2.4, 4.4, 2]), box(0x6a3424, [0, 4.5, 0], [2.6, 0.25, 2.2])];
  for (let r = 0; r < 3; r++) for (const x of [-0.7, 0, 0.7]) P.push(box(0xf4e8c8, [x, 1.6 + r * 1.1, 1.01], [0.4, 0.6, 0.02]));
  for (let k = 0; k < 5; k++) P.push(box(0x7a4030, [0, 0.12 + k * 0.2, 1.2 + (4 - k) * 0.18], [1, 0.2, 0.25]));
  P.push(box(0x2a2a2a, [0, 1.3, 1.02], [0.5, 0.9, 0.02]));
  return merge(P);
}
function bagelCart() {
  const P = [box(0xd8d8d8, [0, 0.8, 0], [1.8, 0.8, 1]), box(0x2c6fd6, [0, 1.9, 0], [2, 0.08, 1.2]), box(0x8a8a8a, [-0.9, 1.4, -0.5], [0.05, 1, 0.05]), box(0x8a8a8a, [0.9, 1.4, -0.5], [0.05, 1, 0.05])];
  for (let k = 0; k < 6; k++) P.push(part(torus(0.12, 0.06, Math.PI * 2, 10), 0xc8904a, [-0.6 + (k % 3) * 0.6, 1.26, -0.2 + Math.floor(k / 3) * 0.4], [Math.PI / 2, 0, 0]));
  for (const x of [-0.6, 0.6]) P.push(part(cyl(0.22, 0.22, 0.1, 10), 0x2a2a2a, [x, 0.22, 0.5], [Math.PI / 2, 0, 0]));
  return merge(P);
}
function bridgeTower() { // a tower of the Brooklyn Bridge with its cables
  const P = [box(0xb8a488, [-0.9, 3, 0], [0.8, 6, 1]), box(0xb8a488, [0.9, 3, 0], [0.8, 6, 1]), box(0xb8a488, [0, 5.6, 0], [2.6, 0.8, 1])];
  for (const x of [-0.9, 0.9]) P.push(box(0x8a7a64, [x, 4, 0.51], [0.4, 1.4, 0.02]));
  for (let k = 0; k < 6; k++) P.push(box(0x5a5a5a, [0, 3 + k * 0.4, 1.5 + k * 0.5], [2.2, 0.03, 0.03], [0.6, 0, 0]));
  return merge(P);
}
function waterTower() { // rooftop water towers
  const P = [part(cyl(0.7, 0.7, 1.2, 10), 0x8a6a4a, [0, 2.2, 0]), part(cone(0.8, 0.6, 10), 0x5a4a3a, [0, 3.1, 0])];
  for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) P.push(box(0x4a4a4a, [x, 0.8, z], [0.06, 1.6, 0.06]));
  return merge(P);
}
function shulFront() { // a Brooklyn synagogue front with a Star of David window
  const P = [box(0xd8cfbc, [0, 2, 0], [3, 4, 1.4]), box(0xc8bca4, [0, 4.2, 0], [3.2, 0.4, 1.5])];
  for (const st of [-Math.PI / 2, Math.PI / 2]) {
    const pts = [0, 1, 2].map((k) => { const a = st + (k * Math.PI * 2) / 3; return [Math.cos(a) * 0.45, 3 + Math.sin(a) * 0.45]; });
    for (let k = 0; k < 3; k++) { const [x1, y1] = pts[k], [x2, y2] = pts[(k + 1) % 3]; const len = Math.hypot(x2 - x1, y2 - y1); P.push(box(0x2c6fd6, [(x1 + x2) / 2, (y1 + y2) / 2, 0.71], [len, 0.08, 0.03], [0, 0, Math.atan2(y2 - y1, x2 - x1)])); }
  }
  P.push(box(0x6b3e1e, [0, 0.9, 0.71], [1, 1.8, 0.03]));
  return merge(P);
}
function stoopSteps() {
  const P = [];
  for (let k = 0; k < 6; k++) P.push(box(0x9a8a7a, [0, 0.1 + k * 0.2, (5 - k) * 0.28], [1.4, 0.2, 0.3]));
  P.push(box(0x2a2a2a, [-0.72, 0.8, 0.7], [0.04, 1.4, 1.6], [0.6, 0, 0]), box(0x2a2a2a, [0.72, 0.8, 0.7], [0.04, 1.4, 1.6], [0.6, 0, 0]));
  P.push(part(cyl(0.2, 0.18, 0.4, 8), 0xb85a3a, [0.5, 1.4, 0.1]), part(ICO, 0x3fae5a, [0.5, 1.7, 0.1], [0, 0, 0], [0.25, 0.25, 0.25]));
  return merge(P);
}

// ---------------- Coney Island
function wonderWheel() {
  const P = [box(0x8a8a90, [-1, 1.8, 0], [0.12, 3.6, 0.12], [0, 0, -0.25]), box(0x8a8a90, [1, 1.8, 0], [0.12, 3.6, 0.12], [0, 0, 0.25])];
  P.push(part(torus(1.8, 0.06, Math.PI * 2, 24), 0xf06d9a, [0, 3.6, 0]), part(torus(1.2, 0.04, Math.PI * 2, 20), 0xffd24a, [0, 3.6, 0]));
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; P.push(box(0xe0e0e0, [Math.cos(a) * 0.9, 3.6 + Math.sin(a) * 0.9, 0], [1.8, 0.03, 0.03], [0, 0, a])); P.push(box([RED, BLUE, 0x3fae5a, GOLD][k % 4], [Math.cos(a) * 1.8, 3.6 + Math.sin(a) * 1.8 - 0.25, 0], [0.3, 0.3, 0.3])); }
  return merge(P);
}
function rollerCoaster() { // a wooden roller coaster
  const P = [];
  for (let k = 0; k < 9; k++) { const x = -2 + k * 0.5, h = 1 + Math.sin(k * 0.8) * 1.2 + 1.2; P.push(box(0xf4f1ea, [x, h / 2, 0], [0.08, h, 0.08]), box(0xe2483d, [x, h, 0], [0.55, 0.08, 0.6], [0, 0, Math.cos(k * 0.8) * 0.5])); }
  for (let k = 0; k < 9; k += 2) P.push(box(0xf4f1ea, [-2 + k * 0.5, 0.8, 0], [0.5, 0.05, 0.05], [0, 0, 0.7]));
  return merge(P);
}
function boardwalkKiosk() { // hot dogs and ice cream on the boardwalk
  const P = [box(0xf4f1ea, [0, 0.8, 0], [1.8, 1.6, 1.2]), box(RED, [0, 1.75, 0], [2, 0.2, 1.4])];
  for (let k = 0; k < 5; k++) P.push(box(k % 2 ? RED : 0xffffff, [-0.8 + k * 0.4, 2.05, 0.4], [0.4, 0.06, 0.8], [0.3, 0, 0]));
  P.push(part(cone(0.12, 0.35, 8), 0xd8a050, [0.6, 1.8, 0.62], [Math.PI, 0, 0]), part(ICO, 0xf06d9a, [0.6, 2.05, 0.62], [0, 0, 0], [0.13, 0.13, 0.13]));
  return merge(P);
}
function beachUmbrellas() {
  const P = [];
  [[-1, RED], [1, BLUE]].forEach(([x, c]) => { P.push(box(0xf4f1ea, [x, 0.8, 0], [0.05, 1.6, 0.05]), part(cone(0.9, 0.4, 8), c, [x, 1.75, 0]), box(c === RED ? 0xffd24a : 0xffffff, [x + 0.4, 0.05, 0.4], [0.6, 0.04, 1.2])); });
  P.push(part(sph(8), 0xffd24a, [0, 0.25, 0.8], [0, 0, 0], [0.25, 0.25, 0.25]));
  return merge(P);
}
function lifeguardChair() {
  const P = [box(0xf4f1ea, [-0.4, 0.9, 0], [0.08, 1.8, 0.08], [0.1, 0, 0]), box(0xf4f1ea, [0.4, 0.9, 0], [0.08, 1.8, 0.08], [0.1, 0, 0]), box(0xf4f1ea, [0, 1.8, -0.1], [1, 0.1, 0.7])];
  P.push(box(RED, [0, 2.3, -0.4], [1, 0.8, 0.08]), part(torus(0.25, 0.08, Math.PI * 2, 12), RED, [0.6, 1.2, 0.2], [0, Math.PI / 2, 0]));
  return merge(P);
}
function parachuteTower() { // the old Parachute Jump tower
  const P = [];
  for (const [x, z] of [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]]) P.push(box(0xd84a3a, [x * 0.6, 3, z * 0.6], [0.1, 6, 0.1], [z * 0.08, 0, -x * 0.08]));
  P.push(part(torus(1.4, 0.06, Math.PI * 2, 16), 0xd84a3a, [0, 6, 0], [Math.PI / 2, 0, 0]));
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; P.push(box(0xd84a3a, [Math.cos(a) * 0.7, 6, Math.sin(a) * 0.7], [1.4, 0.05, 0.05], [0, -a, 0])); }
  return merge(P);
}

export const LANDMARKS3 = {
  eden: [L('lifeT', treeOfLife, [7, 13]), L('knowT', treeOfKnowledge, [6, 11], false), L('rivers4', fourRivers, [5, 10], false), L('meadow', flowerMeadow, [4.5, 8], false), L('edenAnimals', peacefulAnimals, [6, 11], false), L('figs', figLeaves, [5, 9], false)],
  beersheba: [L('tamarisk', tamarisk, [6, 12], false), L('lambs7', sevenLambs, [5, 9], false), L('oathWell', oathWell, [5, 9]), L('stopped', stoppedWells, [6, 11], false), L('abTent', abrahamTent, [8, 13]), L('negevCamels', negevCamels, [7, 13], false)],
  eingedi: [L('falls', waterfall, [7, 12]), L('ibex', ibex, [6, 11], false), L('cave', caveMouth, [10, 16]), L('salt', deadSeaSalt, [6, 11], false), L('dates', dateGrove, [6, 12], false), L('harpE', shepherdHarp, [4.5, 8])],
  jonah: [L('fish', bigFish, [7, 13], false), L('ship', tarshishShip, [8, 14]), L('cargo', cargoOverboard, [5, 10], false), L('gourd', gourdVine, [5, 9]), L('nineveh', ninevehGate, [11, 17]), L('storm', stormClouds, [6, 11], false)],
  babylon: [L('willowH', willowHarps, [5, 10], false), L('ishtar', ishtarGate, [10, 15]), L('hanging', hangingGardens, [11, 17]), L('lions', lionsDen, [6, 11], false), L('wall', writingWall, [8, 12]), L('zigg2', ziggurat2, [12, 18])],
  shushan: [L('columns', persianColumns, [9, 14]), L('scepter', kingsScepter, [6, 10]), L('feast', purimFeast, [5, 9]), L('groggers', groggers, [4.5, 7]), L('rscroll', royalScroll, [6, 11]), L('rhorse', mordecaiHorse, [6, 11], false)],
  modiin: [L('tmenorah', templeMenorah, [6, 10]), L('oilJar', oilJar, [4.5, 7]), L('hanukHill', hanukkiahHill, [7, 12]), L('elephantsW', warElephants, [10, 16], false), L('dreidels', dreidelSpin, [4.5, 7], false), L('hammer', maccabeeHammer, [5, 9])],
  safed: [L('bdoor', blueDoor, [7, 12]), L('synag', stoneSynagogue, [10, 16]), L('easel', artistEasel, [4.5, 7]), L('meron', meronHill, [12, 18], false), L('cypressR', cypressRow, [6, 12], false), L('candles', candleShop, [5, 8])],
  brooklyn: [L('brown', brownstone, [7, 12]), L('bagels', bagelCart, [4.5, 7]), L('bridgeT', bridgeTower, [12, 18]), L('wtower', waterTower, [8, 14], false), L('shul', shulFront, [8, 13]), L('stoop', stoopSteps, [5, 8])],
  coney: [L('wheel', wonderWheel, [10, 16]), L('coaster', rollerCoaster, [9, 15]), L('kioskC', boardwalkKiosk, [5, 8]), L('umbrellas', beachUmbrellas, [5, 10], false), L('lgChair', lifeguardChair, [6, 10]), L('parachute', parachuteTower, [13, 19], false)],
};
