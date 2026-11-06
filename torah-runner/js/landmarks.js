// Six Torah / Jewish-history landmarks for every place along the route.
// Each is a small low-poly scene built from primitives; scenery.js mixes them in with the roadside props.
import * as THREE from './three.js';
import { part, box, merge, ICO, CYL6, DODECA } from './models.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const GOLD = 0xf0b93a, WOOD = 0x7a4a24, STONE = 0xc8b088, RED = 0xb83a2a, BLUE = 0x2c4ea3, WHITE = 0xf4f1ea;
const cyl = (rt, rb, h, seg = 10) => new THREE.CylinderGeometry(rt, rb, h, seg);

// ---------------- Egypt (Exodus 1-12)
function frogs() { // the plague of frogs (Exodus 8)
  const P = [];
  for (let i = 0; i < 9; i++) {
    const x = rnd(-1.6, 1.6), z = rnd(-1.6, 1.6);
    P.push(part(ICO, 0x4f9a3a, [x, 0.18, z], [0, 0, 0], [0.3, 0.18, 0.26]), part(ICO, 0x6ab84a, [x, 0.3, z + 0.12], [0, 0, 0], [0.14, 0.1, 0.12]));
  }
  return merge(P);
}
function passoverDoor() { // blood on the doorposts (Exodus 12:7)
  return merge([
    box(0xd8b07a, [0, 1.4, 0], [3.4, 2.8, 2.6]), box(0x4a2e1c, [0, 0.8, 1.31], [0.9, 1.6, 0.04]),
    box(RED, [-0.55, 0.9, 1.33], [0.12, 1.7, 0.04]), box(RED, [0.55, 0.9, 1.33], [0.12, 1.7, 0.04]), box(RED, [0, 1.75, 1.33], [1.2, 0.12, 0.04]),
    box(0xf2efe6, [1.3, 0.3, 1.8], [0.6, 0.35, 0.3]), box(0xf2efe6, [1.3, 0.45, 2.0], [0.2, 0.22, 0.2]),
  ]);
}
function granaries() { // Joseph's grain stores (Genesis 41)
  const P = [];
  for (const x of [-1.6, 0, 1.6]) {
    P.push(part(cyl(0.7, 0.8, 2.2), 0xd8b880, [x, 1.1, 0]));
    P.push(part(new THREE.SphereGeometry(0.72, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xc9a870, [x, 2.2, 0]));
  }
  for (let i = 0; i < 4; i++) P.push(part(cyl(0.18, 0.22, 0.4, 8), 0xe8c76a, [rnd(-2, 2), 0.2, 1.2]));
  return merge(P);
}
function locusts() { // the plague of locusts (Exodus 10)
  const P = [part(CYL6, 0x5a7a30, [0, 0.4, 0], [0, 0, 0], [0.12, 0.8, 0.12])];
  for (let i = 0; i < 30; i++) P.push(box(0x6a6a2a, [rnd(-1.5, 1.5), rnd(1, 3.5), rnd(-1.5, 1.5)], [0.18, 0.05, 0.06], [0, rnd(0, 3), 0]));
  return merge(P);
}

// ---------------- Red Sea (Exodus 14-15)
function timbrels() { // Miriam's timbrels (Exodus 15:20)
  const P = [];
  for (let k = 0; k < 3; k++) {
    const x = -1 + k;
    P.push(part(cyl(0.4, 0.4, 0.1, 14), 0xc99a5b, [x, 0.1 + k * 0.02, rnd(-0.3, 0.3)], [rnd(-0.3, 0.3), 0, rnd(-0.3, 0.3)]));
    P.push(part(cyl(0.36, 0.36, 0.11, 14), 0xf2e6c8, [x, 0.11 + k * 0.02, 0]));
  }
  return merge(P);
}
function sunkChariot() {
  return merge([
    box(GOLD, [0, 0.35, 0], [1.3, 0.6, 1.0], [0.3, 0.4, 0.2]),
    part(new THREE.TorusGeometry(0.55, 0.07, 6, 14), 0xa8823a, [0.8, 0.4, 0.2], [0.4, 1.2, 0.3]),
    box(WOOD, [-1.2, 0.15, 0.4], [1.8, 0.1, 0.1], [0, 0.6, 0.1]),
  ]);
}
function shieldsSpears() {
  const P = [];
  for (let i = 0; i < 4; i++) P.push(part(cyl(0.4, 0.4, 0.08, 12), [GOLD, 0xa8823a][i % 2], [rnd(-1.5, 1.5), 0.06, rnd(-1.2, 1.2)], [rnd(-0.2, 0.2), 0, rnd(-0.2, 0.2)]));
  for (let i = 0; i < 4; i++) P.push(box(0x8a6a48, [rnd(-1.5, 1.5), 0.06, rnd(-1.2, 1.2)], [2, 0.05, 0.05], [0, rnd(0, 3), 0]));
  return merge(P);
}
function staffInSand() { // a shepherd's staff stuck in the dry sea bed
  return merge([box(0x6b4a2a, [0, 1.1, 0], [0.08, 2.2, 0.08], [0, 0, 0.12]), part(new THREE.TorusGeometry(0.18, 0.04, 6, 10, Math.PI), 0x6b4a2a, [0.24, 2.2, 0])]);
}

// ---------------- Elim (Exodus 15:22-27)
function marahTree() { // the bitter water made sweet with a tree (Exodus 15:25)
  const P = [part(cyl(1.4, 1.5, 0.05, 12), 0x3f9fc0, [0, 0.03, 0], [0, 0, 0], [1, 1, 0.8])];
  P.push(box(0x6b4a2a, [0.3, 0.1, 0], [2, 0.18, 0.18], [0, 0.4, 0.05]));
  for (let i = 0; i < 5; i++) P.push(part(ICO, 0x5a8a3a, [0.3 + rnd(-0.8, 0.8), 0.25, rnd(-0.3, 0.3)], [i, i, 0], [0.18, 0.1, 0.18]));
  return merge(P);
}
function waterJars() {
  const P = [];
  for (let i = 0; i < 5; i++) P.push(part(cyl(0.18, 0.28, 0.7, 8), [0xb4562c, 0xc0663a][i % 2], [-1 + i * 0.5, 0.35, rnd(-0.3, 0.3)]));
  return merge(P);
}
function dateBaskets() {
  const P = [];
  for (let i = 0; i < 3; i++) {
    P.push(part(cyl(0.45, 0.35, 0.4, 10), 0xc99a5b, [-1 + i, 0.2, 0]));
    for (let k = 0; k < 6; k++) P.push(part(ICO, 0x8a3a1a, [-1 + i + rnd(-0.25, 0.25), 0.45, rnd(-0.25, 0.25)], [k, k, 0], [0.08, 0.1, 0.08]));
  }
  return merge(P);
}

// ---------------- Wilderness (Exodus 16-17, Numbers 13, 21)
function quails() { // quails covering the camp (Exodus 16:13)
  const P = [];
  for (let i = 0; i < 10; i++) {
    const x = rnd(-2, 2), z = rnd(-2, 2);
    P.push(part(ICO, 0x8a6a48, [x, 0.18, z], [0, 0, 0], [0.22, 0.17, 0.3]), part(ICO, 0x6a4a30, [x, 0.32, z + 0.2], [0, 0, 0], [0.1, 0.1, 0.1]));
  }
  return merge(P);
}
function rockSpring() { // water from the rock (Exodus 17:6)
  return merge([
    part(DODECA, 0x9a8a78, [0, 1.1, 0], [0.3, 0.5, 0], [1.4, 1.2, 1.2]),
    box(0x5fb8d8, [0, 0.6, 1.1], [0.35, 1.2, 0.1]),
    part(cyl(1.2, 1.3, 0.05, 12), 0x5fb8d8, [0, 0.03, 1.6], [0, 0, 0], [1, 1, 0.6]),
  ]);
}
function spiesGrapes() { // the spies carry a giant cluster of grapes (Numbers 13:23)
  const P = [box(WOOD, [0, 1.6, 0], [3.2, 0.1, 0.1])];
  for (let i = 0; i < 18; i++) P.push(part(ICO, i % 2 ? 0x6a2a7a : 0x7a3a8a, [rnd(-0.4, 0.4), 1.3 - rnd(0, 1.0), rnd(-0.3, 0.3)], [i, i, 0], [0.2, 0.2, 0.2]));
  P.push(box(0x3f8f3a, [0, 1.45, 0], [0.6, 0.06, 0.4]));
  for (const x of [-1.4, 1.4]) P.push(box(0x6b4a2a, [x, 0.8, 0], [0.1, 1.6, 0.1]));
  return merge(P);
}
function copperSerpent() { // the copper serpent on a pole (Numbers 21:9)
  const P = [box(0x8a6a48, [0, 1.6, 0], [0.12, 3.2, 0.12]), box(0x8a6a48, [0, 2.9, 0], [1.0, 0.1, 0.1])];
  for (let k = 0; k < 8; k++) P.push(part(ICO, 0xc0783a, [Math.sin(k * 0.9) * 0.18, 1.2 + k * 0.22, 0.1], [0, 0, 0], [0.12, 0.12, 0.12]));
  return merge(P);
}

// ---------------- Night Camp (Exodus 25-28, Numbers 2)
function arkOfCovenant() { // the Ark of the Covenant (Exodus 25:10-22)
  return merge([
    box(GOLD, [0, 0.8, 0], [1.6, 0.9, 1.0]), box(0xffd24a, [0, 1.3, 0], [1.7, 0.1, 1.05]),
    box(GOLD, [-0.55, 1.55, 0], [0.35, 0.4, 0.5], [0, 0, 0.3]), box(GOLD, [0.55, 1.55, 0], [0.35, 0.4, 0.5], [0, 0, -0.3]),
    box(WOOD, [0, 0.7, 0.6], [2.8, 0.08, 0.08]), box(WOOD, [0, 0.7, -0.6], [2.8, 0.08, 0.08]),
    box(BLUE, [0, 0.2, 0], [2, 0.4, 1.4]),
  ]);
}
function tribeBanners() { // the twelve tribes camped under their banners (Numbers 2:2)
  const cols = [RED, 0x3fae5a, BLUE, GOLD, 0x7a3a8a, WHITE, 0xff8a3d, 0x2a2a2a, 0x4aa8ff, 0x8a3a1a, 0xd65db1, 0x6b8a3a];
  const P = [];
  cols.forEach((c, k) => { const x = -5.5 + k; P.push(box(WOOD, [x, 1.2, 0], [0.06, 2.4, 0.06]), box(c, [x + 0.25, 2.1, 0], [0.5, 0.4, 0.03])); });
  return merge(P);
}
function showbreadTable() { // the table with twelve loaves (Exodus 25:30)
  const P = [box(GOLD, [0, 0.9, 0], [1.8, 0.1, 0.9])];
  for (const [x, z] of [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]]) P.push(box(GOLD, [x, 0.45, z], [0.08, 0.9, 0.08]));
  for (let k = 0; k < 6; k++) for (const z of [-0.2, 0.2]) P.push(box(0xd9a066, [-0.3 + (k % 2) * 0.6, 1.0 + Math.floor(k / 2) * 0.12, z], [0.5, 0.11, 0.3]));
  return merge(P);
}
function incenseAltar() { // the golden altar of incense (Exodus 30)
  const P = [box(GOLD, [0, 0.7, 0], [0.8, 1.4, 0.8])];
  for (const [x, z] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) P.push(part(new THREE.ConeGeometry(0.08, 0.2, 6), GOLD, [x, 1.5, z]));
  for (let k = 0; k < 4; k++) P.push(part(ICO, 0xdddddd, [rnd(-0.1, 0.1), 1.7 + k * 0.35, rnd(-0.1, 0.1)], [k, k, 0], [0.18 + k * 0.05, 0.14, 0.18 + k * 0.05]));
  return merge(P);
}

// ---------------- Mount Sinai (Exodus 19-20)
function tabletsStone() { // the two tablets of the covenant
  const P = [];
  for (const x of [-0.6, 0.6]) {
    P.push(box(0xd8d0c0, [x, 1.0, 0], [1.0, 1.4, 0.2]), part(cyl(0.5, 0.5, 0.2, 12, 1), 0xd8d0c0, [x, 1.7, 0], [Math.PI / 2, 0, 0]));
    for (let r = 0; r < 5; r++) P.push(box(0x5a4a3a, [x, 1.5 - r * 0.25, 0.11], [0.7, 0.07, 0.02]));
  }
  P.push(box(0x8a7a6a, [0, 0.15, 0], [2.4, 0.3, 0.8]));
  return merge(P);
}
function shofarRock() { // a great shofar blast at Sinai (Exodus 19:16)
  return merge([
    part(DODECA, 0x7d6a5e, [0, 0.5, 0], [0, 0, 0], [0.9, 0.5, 0.7]),
    part(new THREE.TorusGeometry(0.6, 0.12, 6, 12, Math.PI * 0.9), 0xc99a5b, [0, 1.2, 0], [0, 0, 0.3]),
  ]);
}
function boundaryStones() { // the boundary set around the mountain (Exodus 19:12)
  const P = [];
  for (let k = 0; k < 7; k++) P.push(part(DODECA, 0x9a8a78, [-3 + k, 0.3, Math.sin(k) * 0.3], [k, k, 0], [0.3, 0.35, 0.3]));
  for (let k = 0; k < 6; k++) P.push(box(0xd8c8a8, [-2.5 + k, 0.35, 0], [0.9, 0.04, 0.04]));
  return merge(P);
}
function altarTwelve() { // the altar with twelve pillars (Exodus 24:4)
  const P = [box(0x9a8a78, [0, 0.4, 0], [1.4, 0.8, 1.4])];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; P.push(box(0xb8a890, [Math.cos(a) * 2.4, 0.7, Math.sin(a) * 2.4], [0.3, 1.4, 0.3])); }
  return merge(P);
}

// ---------------- Jerusalem
function davidHarp() { // King David's harp (kinnor)
  const P = [box(WOOD, [0, 1.0, 0], [0.12, 2, 0.12]), box(WOOD, [0.7, 1.9, 0], [1.4, 0.12, 0.12], [0, 0, -0.2]), box(WOOD, [1.35, 1.0, 0], [0.12, 1.6, 0.12], [0, 0, 0.1])];
  for (let k = 0; k < 6; k++) P.push(box(0xf0e6c8, [0.2 + k * 0.2, 1.1, 0], [0.02, 1.5 - k * 0.1, 0.02]));
  P.push(box(STONE, [0.6, 0.15, 0], [2, 0.3, 0.8]));
  return merge(P);
}
function slingStones() { // David's sling and five smooth stones (1 Samuel 17:40)
  const P = [box(0x8a5a2b, [0, 0.05, 0], [1.4, 0.03, 0.06], [0, 0.3, 0]), box(0x6b3e1e, [0.1, 0.06, 0.05], [0.3, 0.05, 0.2])];
  for (let k = 0; k < 5; k++) P.push(part(ICO, 0xc8c0b0, [-0.8 + k * 0.3, 0.1, 0.5], [k, k, 0], [0.12, 0.09, 0.12]));
  return merge(P);
}
function cityGate() {
  return merge([
    box(STONE, [-2.2, 2.2, 0], [1.6, 4.4, 1.6]), box(STONE, [2.2, 2.2, 0], [1.6, 4.4, 1.6]),
    box(0xd8c098, [0, 4.0, 0], [6, 1.2, 1.6]), box(0x4a2e1c, [0, 1.6, 0.6], [2.6, 3.2, 0.2]),
    ...[-2.6, -1.8, 2.6, 1.8, -0.8, 0, 0.8].map((x) => box(0xd8c098, [x, 4.85, 0], [0.5, 0.5, 1.6])),
  ]);
}
function pomegranateTree() {
  const P = [part(CYL6, 0x6b4a2a, [0, 0.9, 0], [0, 0, 0], [0.16, 1.8, 0.16])];
  for (let k = 0; k < 5; k++) P.push(part(ICO, 0x4f8a3a, [rnd(-0.7, 0.7), rnd(1.9, 2.6), rnd(-0.7, 0.7)], [k, k, 0], [0.7, 0.55, 0.7]));
  for (let k = 0; k < 7; k++) P.push(part(ICO, 0xc8302a, [rnd(-0.8, 0.8), rnd(1.7, 2.6), rnd(0.4, 0.8)], [k, k, 0], [0.13, 0.13, 0.13]));
  return merge(P);
}

// ---------------- Jewish life in the modern cities
function sukkah() {
  const P = [];
  for (const [x, z] of [[-1.3, -1], [1.3, -1], [-1.3, 1], [1.3, 1]]) P.push(box(WOOD, [x, 1.2, z], [0.12, 2.4, 0.12]));
  P.push(box(0xf2e6c8, [-1.3, 1.1, 0], [0.04, 2, 2]), box(0xf2e6c8, [1.3, 1.1, 0], [0.04, 2, 2]), box(0xf2e6c8, [0, 1.1, -1], [2.6, 2, 0.04]));
  for (let k = 0; k < 9; k++) P.push(box(0x4f8f3a, [-1.2 + k * 0.3, 2.45, 0], [0.12, 0.08, 2.2]));
  for (let k = 0; k < 6; k++) P.push(part(ICO, [RED, GOLD, 0x3fae5a][k % 3], [-1 + k * 0.4, 2.2, 0.9], [k, k, 0], [0.09, 0.09, 0.09]));
  return merge(P);
}
function hanukkiah() { // the nine-branched Hanukkah menorah
  const P = [box(0xb08a5a, [0, 0.3, 0], [2.6, 0.6, 0.8]), box(GOLD, [0, 1.4, 0], [3.4, 0.14, 0.14])];
  for (let k = 0; k < 9; k++) {
    const x = -1.6 + k * 0.4, h = k === 4 ? 2.0 : 1.7;
    P.push(box(GOLD, [x, h - 0.2, 0], [0.12, 0.5, 0.12]), part(new THREE.ConeGeometry(0.08, 0.25, 6), 0xffb02e, [x, h + 0.15, 0]));
  }
  P.push(box(GOLD, [0, 0.95, 0], [0.18, 0.9, 0.18]));
  return merge(P);
}
function shabbatTable() {
  return merge([
    box(WHITE, [0, 0.75, 0], [2.2, 0.08, 1.2]),
    ...[[-1, -0.5], [1, -0.5], [-1, 0.5], [1, 0.5]].map(([x, z]) => box(WOOD, [x, 0.36, z], [0.08, 0.72, 0.08])),
    part(ICO, 0xd9a066, [-0.3, 0.9, 0], [0, 0, 0], [0.4, 0.15, 0.2]), part(ICO, 0xd9a066, [0.3, 0.9, 0], [0, 0, 0], [0.4, 0.15, 0.2]),
    box(WHITE, [-0.8, 1.0, 0.3], [0.06, 0.4, 0.06]), box(WHITE, [-0.6, 1.0, 0.3], [0.06, 0.4, 0.06]),
    part(new THREE.ConeGeometry(0.04, 0.12, 6), 0xffb02e, [-0.8, 1.26, 0.3]), part(new THREE.ConeGeometry(0.04, 0.12, 6), 0xffb02e, [-0.6, 1.26, 0.3]),
    part(cyl(0.1, 0.07, 0.25, 8), 0xc0c4ca, [0.8, 0.92, -0.2]),
  ]);
}
function torahArk() { // the Aron Kodesh holding a Torah scroll
  return merge([
    box(0x7a4a24, [0, 1.4, 0], [2, 2.8, 1]), box(0x2c4ea3, [-0.45, 1.3, 0.51], [0.8, 2, 0.04]), box(0x2c4ea3, [0.45, 1.3, 0.51], [0.8, 2, 0.04]),
    box(GOLD, [-0.45, 1.7, 0.54], [0.3, 0.3, 0.02]), box(GOLD, [0.45, 1.7, 0.54], [0.3, 0.3, 0.02]),
    box(0xd8d0c0, [-0.45, 3.1, 0], [0.7, 0.6, 0.15]), box(0xd8d0c0, [0.45, 3.1, 0], [0.7, 0.6, 0.15]),
    part(new THREE.ConeGeometry(0.08, 0.2, 6), 0xffb02e, [0, 3.0, 0.6]),
  ]);
}
function dreidel() {
  return merge([
    box(BLUE, [0, 1.2, 0], [1.1, 1.1, 1.1]),
    part(new THREE.ConeGeometry(0.78, 0.9, 4), BLUE, [0, 0.35, 0], [Math.PI, Math.PI / 4, 0]),
    box(0xc0c4ca, [0, 1.95, 0], [0.18, 0.5, 0.18]),
    box(GOLD, [0, 1.2, 0.56], [0.5, 0.5, 0.02]),
  ]);
}
function mezuzahDoor() {
  return merge([
    box(0xe6e2da, [0, 1.5, 0], [3, 3, 0.4]), box(0x6b4a2a, [0, 1.1, 0.21], [1, 2.2, 0.04]),
    box(0xc0c4ca, [0.62, 1.7, 0.24], [0.08, 0.35, 0.06], [0, 0, 0.3]),
  ]);
}

// Six per place. x: distance range from the road; face: turn toward the road.
const L = (type, build, x, face = true, w = 0.9) => ({ type, build, variants: 1, x, w, face });
export const LANDMARKS = {
  egypt: [L('frogs', frogs, [4.5, 8], false), L('pdoor', passoverDoor, [9, 14]), L('granary', granaries, [11, 16]), L('locust', locusts, [5, 9], false)],
  sea: [L('timbrel', timbrels, [3.6, 4.2], false), L('sunk', sunkChariot, [3.6, 4.3], false), L('shields', shieldsSpears, [3.6, 4.3], false), L('staff', staffInSand, [3.7, 4.3], false), L('jars2', waterJars, [3.6, 4.3])],
  elim: [L('marah', marahTree, [6, 11], false), L('jars2', waterJars, [4.5, 7]), L('dates', dateBaskets, [4.5, 8])],
  wild: [L('quail', quails, [4.5, 9], false), L('rockspring', rockSpring, [7, 12]), L('grapes', spiesGrapes, [6, 11]), L('serpent', copperSerpent, [6, 11])],
  night: [L('ark', arkOfCovenant, [8, 13]), L('banners', tribeBanners, [12, 18]), L('showbread', showbreadTable, [6, 10]), L('incense', incenseAltar, [6, 10])],
  sinai: [L('tablets', tabletsStone, [6, 11]), L('shofarR', shofarRock, [5, 9], false), L('boundary', boundaryStones, [4.5, 6]), L('altar12', altarTwelve, [9, 14], false), L('serpent', copperSerpent, [6, 11]), L('rockspring', rockSpring, [7, 12])],
  jerusalem: [L('harp', davidHarp, [5, 9]), L('sling', slingStones, [4, 6]), L('gate', cityGate, [11, 16]), L('pomtree', pomegranateTree, [5, 11], false)],
  telaviv: [L('sukkah', sukkah, [7, 12]), L('hanuk', hanukkiah, [6, 10]), L('shabbat', shabbatTable, [5, 9]), L('aron', torahArk, [8, 13]), L('dreidel', dreidel, [5, 10], false), L('mezuzah', mezuzahDoor, [8, 12])],
  airport: [L('hanuk', hanukkiah, [6, 10]), L('dreidel', dreidel, [5, 10], false), L('mezuzah', mezuzahDoor, [8, 12]), L('shabbat', shabbatTable, [5, 9]), L('sukkah', sukkah, [8, 12]), L('aron', torahArk, [9, 13])],
  newyork: [L('hanuk', hanukkiah, [5, 7]), L('dreidel', dreidel, [4.5, 6], false), L('mezuzah', mezuzahDoor, [6, 7]), L('shabbat', shabbatTable, [4.5, 6]), L('sukkah', sukkah, [5.5, 7]), L('aron', torahArk, [6, 7])],
  donut: [L('hanuk', hanukkiah, [6.5, 8]), L('dreidel', dreidel, [6.5, 8], false), L('shabbat', shabbatTable, [6.5, 8]), L('aron', torahArk, [6.5, 8]), L('mezuzah', mezuzahDoor, [6.5, 8]), L('sukkah', sukkah, [6.5, 8])],
  park: [L('sukkah', sukkah, [6, 11]), L('hanuk', hanukkiah, [6, 10]), L('shabbat', shabbatTable, [5, 9]), L('dreidel', dreidel, [5, 10], false), L('aron', torahArk, [8, 12]), L('mezuzah', mezuzahDoor, [8, 12])],
  harbor: [L('hanuk', hanukkiah, [6, 10]), L('dreidel', dreidel, [5, 10], false), L('shabbat', shabbatTable, [5, 9]), L('sukkah', sukkah, [7, 11]), L('aron', torahArk, [8, 12]), L('mezuzah', mezuzahDoor, [8, 12])],
};

export { shieldsSpears, rockSpring, arkOfCovenant, slingStones };
