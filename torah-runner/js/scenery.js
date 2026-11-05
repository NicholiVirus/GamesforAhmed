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

function buildOlive() {
  const P = [
    part(CYL6, 0x6b5a44, [0, 0.8, 0], [0, 0, 0.18], [0.22, 1.6, 0.22]),
    part(CYL6, 0x6b5a44, [0.3, 1.6, 0], [0, 0, -0.6], [0.14, 0.9, 0.14]),
  ];
  for (let k = 0; k < 6; k++) P.push(part(ICO, k % 2 ? 0x7d8f5a : 0x93a36e, [rnd(-0.9, 0.9), rnd(2.0, 2.7), rnd(-0.9, 0.9)], [k, k, 0], [rnd(0.6, 0.9), rnd(0.45, 0.6), rnd(0.6, 0.9)]));
  return merge(P);
}

function buildCypress() {
  return merge([
    part(CYL6, 0x5a4632, [0, 0.4, 0], [0, 0, 0], [0.12, 0.8, 0.12]),
    part(new THREE.ConeGeometry(0.7, 5.5, 7), 0x2f5a32, [0, 3.4, 0]),
  ]);
}

function buildStoneHouse() {
  const w = rnd(3, 4.5), h = rnd(2.6, 4.2), d = 3;
  const stone = [0xead6aa, 0xe2c896, 0xf0dfb8][Math.floor(rnd(0, 3))];
  const P = [
    box(stone, [0, h / 2, 0], [w, h, d]),
    box(0xd2b783, [0, h + 0.1, 0], [w + 0.15, 0.2, d + 0.15]),
    box(0x3a2a1c, [0, 0.75, d / 2 + 0.01], [0.8, 1.5, 0.04]),
    box(0x2c4ea3, [-w * 0.28, h * 0.65, d / 2 + 0.01], [0.45, 0.45, 0.04]),
    box(0x2c4ea3, [w * 0.28, h * 0.65, d / 2 + 0.01], [0.45, 0.45, 0.04]),
  ];
  if (Math.random() < 0.5) P.push(part(new THREE.SphereGeometry(0.9, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), stone, [0, h + 0.2, 0]));
  return merge(P);
}

function buildWallTower() {
  const P = [box(0xe8d2a2, [0, 2.6, 0], [3, 5.2, 3])];
  for (const [x, z] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1], [0, 1.1], [0, -1.1], [1.1, 0], [-1.1, 0]]) P.push(box(0xd8bd88, [x, 5.55, z], [0.7, 0.7, 0.7]));
  P.push(box(0x3a2a1c, [0, 1.2, 1.51], [1.1, 2.0, 0.04]));
  return merge(P);
}

function buildBauhaus() {
  const w = rnd(4, 6), floors = 2 + Math.floor(rnd(0, 3)), h = floors * 1.6;
  const P = [box(0xf6f3ec, [0, h / 2, 0], [w, h, 4])];
  for (let f = 0; f < floors; f++) {
    const y = 0.9 + f * 1.6;
    P.push(box(0xe9e4d8, [0, y - 0.45, 2.2], [w * 0.9, 0.12, 0.6]));
    P.push(box(0xffffff, [0, y - 0.15, 2.48], [w * 0.9, 0.5, 0.06]));
    P.push(box(0x6aa0c8, [-w * 0.25, y + 0.2, 2.01], [w * 0.3, 0.6, 0.02]), box(0x6aa0c8, [w * 0.25, y + 0.2, 2.01], [w * 0.3, 0.6, 0.02]));
  }
  return merge(P);
}
function buildUmbrella() {
  const c = [0xd8402f, 0x2c4ea3, 0xf0b93a, 0x3fae5a][Math.floor(rnd(0, 4))];
  return merge([
    box(0xffffff, [0, 1.1, 0], [0.06, 2.2, 0.06]),
    part(new THREE.ConeGeometry(1.3, 0.5, 8), c, [0, 2.3, 0]),
    box(0xf2efe6, [0.8, 0.25, 0.3], [0.6, 0.12, 1.6], [0.2, 0.3, 0]),
  ]);
}
function buildLifeguard() {
  return merge([
    ...[[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]].map(([x, z]) => box(0xf6f3ec, [x, 1.2, z], [0.12, 2.4, 0.12])),
    box(0xf6f3ec, [0, 2.6, 0], [1.6, 0.9, 1.6]),
    box(0xd8402f, [0, 3.2, 0], [1.9, 0.12, 1.9]),
    box(0x2c4ea3, [0, 2.7, 0.81], [1.2, 0.4, 0.02]),
  ]);
}
function buildTerminal() {
  const w = rnd(14, 22);
  return merge([
    box(0xd8dde2, [0, 3, 0], [w, 6, 8]),
    box(0x7fb0d8, [0, 3.2, 4.01], [w * 0.95, 3.6, 0.02]),
    box(0xb8bec4, [0, 6.3, 0], [w + 1, 0.4, 9]),
    box(0x2c4ea3, [0, 5.4, 4.05], [w * 0.4, 0.6, 0.04]),
  ]);
}
function buildPlane() {
  return merge([
    part(new THREE.CylinderGeometry(1.1, 1.1, 14, 12), 0xf6f6f6, [0, 2.4, 0], [Math.PI / 2, 0, 0]),
    part(new THREE.ConeGeometry(1.1, 2.4, 12), 0xf6f6f6, [0, 2.4, 8.2], [Math.PI / 2, 0, 0]),
    box(0xf6f6f6, [0, 2.0, 0.5], [15, 0.3, 2.6]),
    box(0x2c4ea3, [0, 4.2, -6.2], [0.3, 3.2, 2.2]),
    box(0xf6f6f6, [0, 2.6, -6.4], [5.5, 0.25, 1.5]),
    box(0x2c4ea3, [0, 2.4, 0], [0.05, 0.4, 13.6]),
    box(0x2c4ea3, [1.11, 2.5, 0], [0.02, 0.3, 13]), box(0x2c4ea3, [-1.11, 2.5, 0], [0.02, 0.3, 13]),
    part(new THREE.CylinderGeometry(0.45, 0.45, 2, 10), 0x9aa0a6, [4, 1.6, 1], [Math.PI / 2, 0, 0]),
    part(new THREE.CylinderGeometry(0.45, 0.45, 2, 10), 0x9aa0a6, [-4, 1.6, 1], [Math.PI / 2, 0, 0]),
    box(0x333333, [0, 0.6, 5], [0.2, 1.2, 0.2]), box(0x333333, [1.5, 0.6, -0.5], [0.2, 1.2, 0.2]), box(0x333333, [-1.5, 0.6, -0.5], [0.2, 1.2, 0.2]),
  ]);
}
function buildTower2() {
  return merge([
    part(new THREE.CylinderGeometry(0.9, 1.3, 14, 8), 0xe2e4e6, [0, 7, 0]),
    part(new THREE.CylinderGeometry(2.4, 1.8, 2.2, 8), 0x5f8fb8, [0, 15.1, 0]),
    part(new THREE.CylinderGeometry(2.6, 2.6, 0.4, 8), 0xd8dde2, [0, 16.4, 0]),
  ]);
}
function buildSkyscraper() {
  const w = rnd(4, 7), d = rnd(4, 7), h = rnd(16, 40);
  const glass = [0x5a6e88, 0x6a7a8c, 0x8a7a6a, 0x4a5a70][Math.floor(rnd(0, 4))];
  const P = [box(glass, [0, h / 2, 0], [w, h, d], [0, 0, 0], 0.02)];
  for (let y = 2; y < h - 1; y += 1.6) P.push(box(Math.random() < 0.55 ? 0xffd890 : 0x2a3444, [0, y, d / 2 + 0.02], [w * 0.85, 0.5, 0.02], [0, 0, 0], 0));
  if (Math.random() < 0.4) P.push(box(glass, [0, h + 2, 0], [w * 0.5, 4, d * 0.5]), box(0xcccccc, [0, h + 6, 0], [0.2, 4, 0.2]));
  return merge(P);
}
function buildStreetLamp() {
  return merge([
    box(0x2a2a2a, [0, 2, 0], [0.12, 4, 0.12]),
    box(0x2a2a2a, [0.4, 4, 0], [0.9, 0.08, 0.08]),
    box(0xfff0b0, [0.8, 3.85, 0], [0.35, 0.18, 0.25]),
  ]);
}
function buildTileWall() {
  const P = [box(0xeeeae0, [0, 3, 0], [8, 6, 0.6])];
  P.push(box(0x2c4ea3, [0, 2.2, 0.31], [8, 0.4, 0.02]));
  P.push(box(0xf0b93a, [0, 2.6, 0.31], [8, 0.15, 0.02]));
  return merge(P);
}
function buildDonutStall() {
  return merge([
    box(0x8a5a3a, [0, 0.55, 0], [3, 1.1, 1.2]),
    box(0xf38bb8, [0, 2.6, -0.4], [3.2, 0.5, 0.3]),
    box(0x6b4a2a, [-1.45, 1.6, -0.4], [0.12, 2.2, 0.12]), box(0x6b4a2a, [1.45, 1.6, -0.4], [0.12, 2.2, 0.12]),
    part(new THREE.TorusGeometry(0.55, 0.25, 8, 16), 0xf38bb8, [0, 3.5, -0.4]),
    ...[-1, -0.35, 0.35, 1].map((x, k) => part(new THREE.TorusGeometry(0.16, 0.08, 6, 12), [0xd9a066, 0xf38bb8, 0x7a4a2a, 0xffd24a][k], [x, 1.18, 0.1], [Math.PI / 2, 0, 0])),
    box(0xfff3c4, [0, 2.2, -0.4], [2.8, 0.06, 0.06]),
  ]);
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
  jerusalem: [
    { type: 'olive', build: buildOlive, variants: 4, x: [4.4, 12], w: 4, face: false },
    { type: 'cypress', build: buildCypress, variants: 1, x: [5, 14], w: 2, face: false },
    { type: 'shouse', build: buildStoneHouse, variants: 4, x: [8, 18], w: 4, face: true },
    { type: 'tower', build: buildWallTower, variants: 1, x: [10, 18], w: 1, face: true },
  ],
  telaviv: [
    { type: 'bauhaus', build: buildBauhaus, variants: 4, x: [9, 18], w: 4, face: true },
    { type: 'palm', build: buildPalm, variants: 4, x: [4.4, 9], w: 3, face: false },
    { type: 'umbrella', build: buildUmbrella, variants: 4, x: [5, 12], w: 3, face: false },
    { type: 'lifeguard', build: buildLifeguard, variants: 1, x: [7, 12], w: 1, face: true },
  ],
  airport: [
    { type: 'terminal', build: buildTerminal, variants: 2, x: [16, 26], w: 2, face: true },
    { type: 'plane', build: buildPlane, variants: 1, x: [14, 24], w: 2, face: false },
    { type: 'ctower', build: buildTower2, variants: 1, x: [18, 28], w: 1, face: false },
    { type: 'lamp', build: buildStreetLamp, variants: 1, x: [4, 5], w: 3, face: true },
  ],
  newyork: [
    { type: 'sky', build: buildSkyscraper, variants: 6, x: [7, 16], w: 7, face: true },
    { type: 'lamp', build: buildStreetLamp, variants: 1, x: [4, 5], w: 3, face: true },
  ],
  donut: [
    { type: 'tilewall', build: buildTileWall, variants: 1, x: [4.6, 4.8], w: 6, face: true },
    { type: 'stall', build: buildDonutStall, variants: 1, x: [6.5, 8], w: 3, face: true },
    { type: 'lamp', build: buildStreetLamp, variants: 1, x: [4.2, 4.4], w: 2, face: true },
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
