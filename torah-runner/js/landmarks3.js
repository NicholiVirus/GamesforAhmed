// Torah scenes, part 2: Rephidim, the Jordan, Jericho, the Valley of Elah, peace in Jerusalem,
// Joseph in Egypt and Aaron's staff in the wilderness. Exports LANDMARKS2 for scenery.js.
import * as THREE from './three.js';
import { part, box, merge, ICO, CYL6, DODECA } from './models.js';
import { shieldsSpears, rockSpring, arkOfCovenant, slingStones } from './landmarks.js';
import {
  sheepAt, animalAt, noahArk, twoByTwo, doveOlive, noahAltar, vineyard, smallRainbow,
  brickMolds, tarPits, scaffoldS, miniZiggurat, abandonedTools, brickFire,
  jacobsLadder, anointedPillar, wellWithStone, speckledFlock, galEd, giftsForEsau,
} from './landmarks2.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const GOLD = 0xf0b93a, WOOD = 0x7a4a24, STONE = 0xc8b088, RED = 0xb83a2a, BLUE = 0x2c4ea3, WHITE = 0xf4f1ea, BRONZE = 0xb07a3a;
const cyl = (rt, rb, h, seg = 10) => new THREE.CylinderGeometry(rt, rb, h, seg);
const cone = (r, h, seg = 8) => new THREE.ConeGeometry(r, h, seg);
function tentAt(x, z, col, stripe) {
  return [box(col, [x, 0.9, z], [2.2, 0.08, 1.8], [0.25, 0, 0]), box(col, [x, 0.55, z - 0.85], [2.2, 1.1, 0.06]),
    box(stripe, [x, 0.75, z + 0.85], [2.2, 0.16, 0.04]), box(WOOD, [x - 1, 0.6, z + 0.8], [0.06, 1.2, 0.06]), box(WOOD, [x + 1, 0.6, z + 0.8], [0.06, 1.2, 0.06])];
}

// ---------------- Rephidim (Exodus 17)
function hillAndStaff() { // a stone to sit on and a staff held up high (Exodus 17:10-12)
  return merge([
    part(new THREE.SphereGeometry(2.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xb8a070, [0, 0, 0], [0, 0, 0], [1, 0.6, 1]),
    part(DODECA, 0x9a8a78, [0, 1.6, 0], [0, 0, 0], [0.45, 0.3, 0.4]),
    box(0x6b4a2a, [0.3, 2.8, 0], [0.08, 2.2, 0.08], [0, 0, -0.15]),
    part(DODECA, 0xa89880, [-0.8, 1.35, 0.4], [1, 0, 0], [0.25, 0.2, 0.25]), part(DODECA, 0xa89880, [0.8, 1.35, 0.4], [0, 1, 0], [0.25, 0.2, 0.25]),
  ]);
}
function bannerAltar() { // the altar called "my banner" (Exodus 17:15)
  const P = [];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) P.push(part(DODECA, 0xa89880, [-0.4 + k * 0.4, 0.2 + r * 0.32, 0], [k, r, 0], [0.24, 0.2, 0.3]));
  P.push(box(WOOD, [0.9, 1.6, 0], [0.08, 3.2, 0.08]), box(BLUE, [1.35, 2.8, 0], [0.9, 0.6, 0.03]), box(WHITE, [1.35, 2.8, 0.02], [0.9, 0.12, 0.02]));
  return merge(P);
}
function amalekCamp() {
  return merge([...tentAt(-1.4, 0, 0x2a2420, RED), ...tentAt(1.4, 0.4, 0x3a302a, 0x6a2a2a), box(0x8a6a48, [0, 1.1, 1.6], [0.06, 2.2, 0.06]), box(0x6a2a2a, [0.3, 2, 1.6], [0.6, 0.4, 0.03])]);
}
function memorialScroll() { // "write this for a memorial in a book" (Exodus 17:14)
  return merge([
    box(WOOD, [0, 0.5, 0], [0.12, 1.0, 0.12]), box(WOOD, [0, 1.02, 0], [1.2, 0.06, 0.6], [-0.3, 0, 0]),
    box(0xecdab0, [0, 1.07, 0], [0.8, 0.02, 0.5], [-0.3, 0, 0]),
    part(cyl(0.07, 0.07, 0.6, 8), 0x6d3e1c, [-0.42, 1.1, 0], [-0.3, 0, 0]), part(cyl(0.07, 0.07, 0.6, 8), 0x6d3e1c, [0.42, 1.1, 0], [-0.3, 0, 0]),
  ]);
}

// ---------------- Crossing the Jordan (Joshua 3-4)
function twelveStones() { // twelve stones set up as a memorial (Joshua 4:20)
  const P = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; P.push(part(DODECA, [0xb0a490, 0xa89880][k % 2], [Math.cos(a) * 1.6, 0.35, Math.sin(a) * 1.2], [k, k, 0], [0.32, 0.4, 0.3])); }
  return merge(P);
}
function riverStones() {
  const P = [part(cyl(1.6, 1.7, 0.04, 14), 0x6aa8c8, [0, 0.02, 0], [0, 0, 0], [1.4, 1, 0.7])];
  for (let k = 0; k < 10; k++) P.push(part(ICO, [0xc8c0b0, 0xa8a090][k % 2], [rnd(-2, 2), 0.1, rnd(-1, 1)], [k, k, 0], [0.22, 0.12, 0.18]));
  return merge(P);
}
function willowTree() { // willows by the brook (Leviticus 23:40)
  const P = [part(CYL6, 0x6b5a44, [0, 1.2, 0], [0, 0, 0], [0.2, 2.4, 0.2])];
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; P.push(box(k % 2 ? 0x7aa04a : 0x8ab05a, [Math.cos(a) * 0.9, 1.8, Math.sin(a) * 0.9], [0.18, 1.6, 0.18], [Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3])); }
  P.push(part(ICO, 0x7aa04a, [0, 2.7, 0], [0, 0, 0], [1, 0.5, 1]));
  return merge(P);
}
function gilgalCamp() { // the camp at Gilgal (Joshua 4:19)
  return merge([...tentAt(-1.4, 0, WHITE, BLUE), ...tentAt(1.4, 0.3, 0xe8dcc8, 0x7a3a8a), box(WOOD, [0, 1.2, 1.4], [0.06, 2.4, 0.06]), box(BLUE, [0.3, 2.2, 1.4], [0.6, 0.4, 0.03])]);
}
function waterHeap() { // the waters rose up in one heap (Joshua 3:16)
  const P = [];
  for (let k = 0; k < 6; k++) P.push(part(ICO, [0x4aa8d8, 0x7fd3ef][k % 2], [rnd(-0.5, 0.5), 0.6 + k * 0.7, rnd(-0.4, 0.4)], [k, k, 0], [1.1 - k * 0.1, 0.6, 1.0 - k * 0.1]));
  P.push(part(ICO, WHITE, [0, 4.6, 0], [0, 0, 0], [0.5, 0.25, 0.5]));
  return merge(P);
}

// ---------------- Jericho (Joshua 2, 6)
function fallenWall() { // "the wall fell down flat" (Joshua 6:20)
  const P = [box(0xd8c098, [-1.6, 1.6, 0], [1.4, 3.2, 1.2]), box(0xd8c098, [1.8, 1.0, 0], [1.2, 2.0, 1.2], [0, 0, 0.15])];
  for (let k = 0; k < 14; k++) P.push(box([0xd8c098, 0xc8b088, 0xb8a078][k % 3], [rnd(-1, 1.4), rnd(0.15, 0.6), rnd(-0.8, 1.2)], [rnd(0.4, 0.8), rnd(0.3, 0.5), rnd(0.4, 0.7)], [rnd(-0.4, 0.4), rnd(0, 3), rnd(-0.4, 0.4)]));
  return merge(P);
}
function sevenShofars() { // seven priests with seven shofars (Joshua 6:4)
  const P = [box(WOOD, [0, 0.5, 0], [3.4, 0.08, 0.4]), box(WOOD, [-1.6, 0.25, 0], [0.08, 0.5, 0.3]), box(WOOD, [1.6, 0.25, 0], [0.08, 0.5, 0.3])];
  for (let k = 0; k < 7; k++) P.push(part(new THREE.TorusGeometry(0.22, 0.06, 6, 10, Math.PI * 0.9), 0xc99a5b, [-1.4 + k * 0.46, 0.75, 0], [0, 0, 0.3]));
  return merge(P);
}
function rahabWindow() { // the scarlet cord in Rahab's window on the wall (Joshua 2:15-18)
  return merge([
    box(0xd8c098, [0, 2.2, 0], [3, 4.4, 1.4]), box(0xc8b088, [0, 4.5, 0], [3.2, 0.3, 1.6]),
    box(0x3a2a1c, [0.4, 3.0, 0.71], [0.6, 0.6, 0.04]),
    box(0xd8202a, [0.6, 1.6, 0.74], [0.06, 2.6, 0.04]),
    box(0x3a2a1c, [-0.8, 0.8, 0.71], [0.7, 1.6, 0.04]),
  ]);
}
function brokenTower() {
  return merge([
    box(0xd8c098, [0, 1.8, 0], [2.2, 3.6, 2.2]),
    box(0xc8b088, [-0.6, 4.0, -0.6], [1.0, 0.8, 1.0]),
    ...Array.from({ length: 8 }, () => box(0xb8a078, [rnd(-1.5, 1.5), 0.2, rnd(1.2, 2.2)], [0.6, 0.35, 0.5], [0, rnd(0, 3), 0])),
  ]);
}

// ---------------- The Valley of Elah (1 Samuel 17)
function goliathArmor() { // a helmet of bronze and a coat of mail (1 Samuel 17:5)
  return merge([
    part(new THREE.SphereGeometry(0.9, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), BRONZE, [0, 0.3, 0], [0.4, 0, 0.3]),
    box(BRONZE, [0, 0.7, 0.2], [0.2, 0.9, 0.12], [0.4, 0, 0.3]),
    box(0x8a6a3a, [1.8, 0.35, 0], [1.6, 0.6, 1.2], [0, 0.4, 0.1]),
    ...Array.from({ length: 6 }, (_, k) => box(0xc8904a, [1.4 + (k % 3) * 0.35, 0.67, -0.3 + Math.floor(k / 3) * 0.55], [0.3, 0.04, 0.4], [0, 0.4, 0.1])),
  ]);
}
function goliathSpear() { // a spear like a weaver's beam (1 Samuel 17:7)
  return merge([box(0x8a6a48, [0, 0.15, 0], [6, 0.22, 0.22], [0, 0.3, 0]), part(cone(0.25, 1.0, 6), 0x9aa0a6, [3.3, 0.15, -0.95], [0, 0, -Math.PI / 2])]);
}
function brookStones() { // five smooth stones from the brook (1 Samuel 17:40)
  const P = [part(cyl(1.4, 1.5, 0.04, 14), 0x6aa8c8, [0, 0.02, 0], [0, 0, 0], [1.6, 1, 0.5])];
  for (let k = 0; k < 5; k++) P.push(part(ICO, 0xd8d0c0, [-0.8 + k * 0.4, 0.1, 0.9], [k, k, 0], [0.14, 0.1, 0.14]));
  return merge(P);
}
function philistineCamp() {
  return merge([...tentAt(-1.4, 0, 0x8a2a2a, 0x1a1a1a), ...tentAt(1.4, 0.4, 0x9a3a2a, 0x2a2a2a), box(WOOD, [0, 1.4, 1.6], [0.06, 2.8, 0.06]), box(0x8a2a2a, [0.35, 2.5, 1.6], [0.7, 0.5, 0.03])]);
}
function israelCamp() {
  return merge([...tentAt(-1.4, 0, WHITE, BLUE), ...tentAt(1.4, 0.4, 0xe8e4dc, BLUE), box(WOOD, [0, 1.4, 1.6], [0.06, 2.8, 0.06]), box(BLUE, [0.35, 2.5, 1.6], [0.7, 0.5, 0.03]), box(WHITE, [0.35, 2.5, 1.62], [0.7, 0.12, 0.02])]);
}
function shepherdsBag() { // David's shepherd bag, staff and sheep (1 Samuel 17:40)
  return merge([
    box(0x8b5a2b, [0, 0.2, 0], [0.5, 0.35, 0.25]), box(0x6b4a2a, [0.6, 0.9, 0], [0.07, 1.8, 0.07], [0, 0, 0.12]),
    ...sheepAt(-1.2, 0.3), ...sheepAt(-1.8, -0.4, 0xf2efe6, 1), ...sheepAt(1.6, 0.5, 0xf2efe6, -1),
  ]);
}

// ---------------- Peace in Jerusalem (Isaiah 2, 11)
function plowshare() { // "they shall beat their swords into plowshares" (Isaiah 2:4)
  return merge([
    box(WOOD, [0, 0.6, 0], [0.12, 0.12, 2.4], [0.4, 0, 0]), box(WOOD, [0, 1.05, -1.0], [0.6, 0.08, 0.08]),
    part(cone(0.3, 0.7, 4), 0x9aa0a6, [0, 0.2, 1.2], [Math.PI / 2 + 0.4, 0, 0]),
    box(0x9aa0a6, [1.4, 0.05, 0.4], [1.4, 0.04, 0.12], [0, 0.4, 0]), box(GOLD, [0.65, 0.06, 0.1], [0.3, 0.06, 0.06], [0, 0.4, 0]),
  ]);
}
function wolfAndLamb() { // "the wolf shall dwell with the lamb" (Isaiah 11:6)
  return merge([...animalAt(-0.6, 0, 0x7a7a80, 0.6), ...sheepAt(0.5, 0.2, 0xf2efe6, -0.4), ...animalAt(1.5, -0.2, 0xd8a848, 0.55)]);
}

// ---------------- Joseph in Egypt (Genesis 37-41) and Aaron's staff (Numbers 17)
function josephCoat() { // the coat of many colours (Genesis 37:3)
  const P = [box(WOOD, [-0.8, 0.9, 0], [0.08, 1.8, 0.08]), box(WOOD, [0.8, 0.9, 0], [0.08, 1.8, 0.08]), box(WOOD, [0, 1.8, 0], [1.8, 0.06, 0.06])];
  [0xe2483d, 0xff9a3c, 0xffd24a, 0x3fae5a, 0x2c6fd6, 0x7a4a9a].forEach((c, k) => P.push(box(c, [0, 1.6 - k * 0.16, 0.03], [0.9 + (k % 2) * 0.1, 0.16, 0.04])));
  P.push(box(0xff9a3c, [-0.55, 1.45, 0.03], [0.25, 0.5, 0.04], [0, 0, 0.3]), box(0x3fae5a, [0.55, 1.45, 0.03], [0.25, 0.5, 0.04], [0, 0, -0.3]));
  return merge(P);
}
function bowingSheaves() { // the sheaves bow to Joseph's sheaf (Genesis 37:7)
  const P = [];
  const sheaf = (x, z, lean, ry) => { P.push(part(cyl(0.12, 0.28, 1.2, 8), 0xe8c76a, [x, 0.6, z], [lean, ry, 0])); P.push(part(cone(0.32, 0.5, 8), 0xd8b050, [x + Math.sin(ry) * lean * 0.6, 1.25, z + Math.cos(ry) * lean * 0.6], [lean, ry, 0])); };
  sheaf(0, 0, 0, 0);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; sheaf(Math.cos(a) * 1.4, Math.sin(a) * 1.4, 0.6, -a - Math.PI / 2); }
  return merge(P);
}
function pharaohsCows() { // seven fat cows and seven thin cows (Genesis 41:2-4)
  const P = [];
  for (let k = 0; k < 3; k++) P.push(...animalAt(-2 + k * 0.8, 0, 0x8a6a48, 0.8));
  for (let k = 0; k < 3; k++) P.push(...animalAt(0.6 + k * 0.7, 0.6, 0xc8b8a0, 0.55));
  return merge(P);
}
function almondStaff() { // Aaron's staff budded, blossomed and bore almonds (Numbers 17:23)
  const P = [box(0x6b4a2a, [0, 1.1, 0], [0.09, 2.2, 0.09])];
  for (let k = 0; k < 9; k++) P.push(part(ICO, k % 3 ? 0xffe0ec : 0xa8c070, [rnd(-0.25, 0.25), 1.2 + k * 0.12, rnd(-0.15, 0.15)], [k, k, 0], [0.09, 0.09, 0.09]));
  P.push(box(STONE, [0, 0.1, 0], [0.8, 0.2, 0.5]));
  return merge(P);
}

const L = (type, build, x, face = true, w = 0.9) => ({ type, build, variants: 1, x, w, face });
export const LANDMARKS2 = {
  ararat: [L('ark', noahArk, [12, 18]), L('pairs', twoByTwo, [6, 11]), L('dove', doveOlive, [4.5, 8], false), L('naltar', noahAltar, [6, 10], false), L('vines', vineyard, [7, 12]), L('rainbowS', smallRainbow, [8, 13])],
  babel: [L('molds', brickMolds, [4.5, 8]), L('tar', tarPits, [5, 9], false), L('scaff', scaffoldS, [9, 14]), L('zigg', miniZiggurat, [12, 18]), L('stopped', abandonedTools, [6, 11]), L('bfire', brickFire, [6, 11], false)],
  jacob: [L('ladder', jacobsLadder, [10, 16]), L('pillar', anointedPillar, [4.5, 8], false), L('wellst', wellWithStone, [6, 11], false), L('speckled', speckledFlock, [6, 12], false), L('galed', galEd, [6, 11], false), L('gifts', giftsForEsau, [8, 14])],
  rephidim: [L('hill', hillAndStaff, [12, 18]), L('nissi', bannerAltar, [6, 10]), L('battle', shieldsSpears, [4.5, 8], false), L('amalek', amalekCamp, [12, 18]), L('rockw', rockSpring, [7, 12]), L('memo', memorialScroll, [4.5, 7])],
  jordan: [L('twelve', twelveStones, [6, 11], false), L('arkR', arkOfCovenant, [4.5, 7]), L('rstones', riverStones, [5, 9], false), L('willow', willowTree, [5, 12], false), L('gilgal', gilgalCamp, [12, 18]), L('heap', waterHeap, [9, 14], false)],
  jericho: [L('fallen', fallenWall, [6, 11]), L('shofars7', sevenShofars, [4.5, 7]), L('rahab', rahabWindow, [9, 14]), L('arkJ', arkOfCovenant, [5, 8]), L('btower', brokenTower, [10, 16]), L('fallen2', fallenWall, [12, 18])],
  elah: [L('armor', goliathArmor, [5, 9], false), L('gspear', goliathSpear, [4.5, 8], false), L('brook', brookStones, [5, 9], false), L('pcamp', philistineCamp, [12, 18]), L('icamp', israelCamp, [12, 18]), L('bag', shepherdsBag, [5, 10], false), L('sling2', slingStones, [4, 6])],
  jerusalem: [L('plow', plowshare, [4.5, 8], false), L('wolflamb', wolfAndLamb, [5, 10], false), L('doveJ', doveOlive, [4.5, 8], false)],
  egypt: [L('coat', josephCoat, [5, 9]), L('sheaves', bowingSheaves, [6, 11], false), L('cows', pharaohsCows, [7, 12], false)],
  wild: [L('almond', almondStaff, [4.5, 8], false)],
};
