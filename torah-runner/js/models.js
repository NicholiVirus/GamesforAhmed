// Low-poly models built from primitives. Static models are merged into one vertex-coloured
// geometry each, so every obstacle or prop costs a single draw call.
import * as THREE from './three.js';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();

export const BOX = new THREE.BoxGeometry(1, 1, 1);
export const CYL6 = new THREE.CylinderGeometry(1, 1, 1, 6);
export const ICO = new THREE.IcosahedronGeometry(1, 0);
export const DODECA = new THREE.DodecahedronGeometry(1, 0);

export const flatMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });

// Transform a primitive and paint it one colour, with a little per-face variation.
export function part(geo, color, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], jitter = 0.05) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  _e.set(r[0], r[1], r[2]);
  _q.setFromEuler(_e);
  _p.set(p[0], p[1], p[2]);
  _s.set(s[0], s[1], s[2]);
  _m.compose(_p, _q, _s);
  g.applyMatrix4(_m);
  const c = new THREE.Color(color);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 6) {
    const j = 1 + (Math.random() - 0.5) * jitter * 2;
    for (let k = i; k < Math.min(n, i + 6); k++) {
      col[k * 3] = c.r * j; col[k * 3 + 1] = c.g * j; col[k * 3 + 2] = c.b * j;
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

export const box = (color, p, s, r = [0, 0, 0], j) => part(BOX, color, p, r, s, j);

export function merge(parts) {
  let total = 0;
  for (const g of parts) total += g.attributes.position.count;
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const col = new Float32Array(total * 3);
  let o = 0;
  for (const g of parts) {
    pos.set(g.attributes.position.array, o * 3);
    nor.set(g.attributes.normal.array, o * 3);
    col.set(g.attributes.color.array, o * 3);
    o += g.attributes.position.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.computeBoundingSphere();
  return out;
}

const hash3 = (x, y, z) => {
  const v = Math.sin(Math.round(x * 997) * 12.9898 + Math.round(y * 997) * 78.233 + Math.round(z * 997) * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

// A lumpy rock: vertices pushed in or out by a hash of their position so shared corners stay sealed.
export function jagged(radius, detail = 1, amp = 0.18, salt = 0) {
  const g = new THREE.IcosahedronGeometry(radius, detail);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = 1 + (hash3(x + salt, y, z) - 0.5) * amp * 2;
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------- player
// The runner's clothes for each region. wrap: head-wrap colour (null = cap or bare hair).
export const OUTFITS = {
  egypt: { top: 0x2f6fd6, hem: 0x2559b5, belt: 0x7a4a22, pants: 0xeadbb8, shoe: 0x6b3e1e, wrap: 0xf4efe4, band: 0x2c4ea3 },
  sea: { top: 0xf2f2ee, hem: 0x2c6fd6, belt: 0x2c4ea3, pants: 0xdcd2bc, shoe: 0x6b3e1e, wrap: 0x7fd3ff, band: 0xffffff },
  elim: { top: 0x3f8f4a, hem: 0x2f6f38, belt: 0x8b5a2b, pants: 0xeadbb8, shoe: 0x6b3e1e, wrap: 0xf0e2c0, band: 0x3f8f4a },
  wild: { top: 0xc9a066, hem: 0xa8814e, belt: 0x6b3e1e, pants: 0xe6d6b4, shoe: 0x5a3a1c, wrap: 0xf4efe4, band: 0xb83a2a },
  night: { top: 0x3a2f6a, hem: 0x2a2250, belt: 0xf0b93a, pants: 0x4a4060, shoe: 0x2a1e14, wrap: 0x2a2250, band: 0xf0b93a },
  sinai: { top: 0xf6f3ec, hem: 0x2c4ea3, belt: 0xf0b93a, pants: 0xeee6d6, shoe: 0x6b3e1e, wrap: 0xf6f3ec, band: 0x2c4ea3 },
  jerusalem: { top: 0xffffff, hem: 0xe8e8e8, belt: 0x2c4ea3, pants: 0x2a2a30, shoe: 0x1a1a1a, wrap: null, cap: 0x2c4ea3 },
  telaviv: { top: 0xff8a3d, hem: 0xff8a3d, belt: 0xff8a3d, pants: 0x3a8fc8, shoe: 0xffffff, wrap: null, cap: 0xffd24a, short: true },
  airport: { top: 0x8a9098, hem: 0x7a8088, belt: 0x7a8088, pants: 0x2f4a7a, shoe: 0xffffff, wrap: null, cap: 0x2a2a30 },
  newyork: { top: 0xd8402f, hem: 0xb8302a, belt: 0x222222, pants: 0x2f4a7a, shoe: 0x1a1a1a, wrap: null, cap: 0x1a1a1a },
  ararat: { top: 0x8a6a48, hem: 0x6a5038, belt: 0x4f8f3a, pants: 0xe6d6b4, shoe: 0x5a3a1c, wrap: 0xd8e8c8, band: 0x4f8f3a },
  babel: { top: 0xc47a44, hem: 0xa95c30, belt: 0x5a3a20, pants: 0xe6d0b0, shoe: 0x5a3a1c, wrap: 0xf0e2c0, band: 0xb83a2a },
  jacob: { top: 0xe2483d, hem: 0xffd24a, belt: 0x2c6fd6, pants: 0xe6d6b4, shoe: 0x5a3a1c, wrap: 0x3fae5a, band: 0x7a4a9a },
  rephidim: { top: 0x9a7a56, hem: 0xb83a2a, belt: 0x5a3a1c, pants: 0xd8c8a8, shoe: 0x4a2e1c, wrap: 0xf4efe4, band: 0xb83a2a },
  jordan: { top: 0xf2f2ee, hem: 0x2c6fd6, belt: 0x2c6fd6, pants: 0xe6dccc, shoe: 0x5a3a1c, wrap: 0xf2f2ee, band: 0x2c6fd6 },
  jericho: { top: 0xb83a2a, hem: 0xf0b93a, belt: 0xf0b93a, pants: 0xe6d6b4, shoe: 0x5a3a1c, wrap: 0xf0e2c0, band: 0xf0b93a },
  elah: { top: 0x8a6a48, hem: 0x6b4a2a, belt: 0x5a3a1c, pants: 0xe6d6b4, shoe: 0x5a3a1c, wrap: 0xf4efe4, band: 0x8a6a48 },
  park: { top: 0x3f9a5a, hem: 0x2f7a48, belt: 0x6b3e1e, pants: 0xd8c8a0, shoe: 0x6b3e1e, wrap: null, cap: 0x3f9a5a },
  harbor: { top: 0x2c4ea3, hem: 0xffffff, belt: 0xffffff, pants: 0xf2f2ee, shoe: 0x1a1a1a, wrap: null, cap: 0xffffff },
  donut: { top: 0xf38bb8, hem: 0xffffff, belt: 0xffffff, pants: 0x3a3a44, shoe: 0xffffff, wrap: null, cap: 0xffffff },
};

// Cosmetics bought in the shop: an outfit colour (replaces the place's top colour) and a kippah.
export const SKINS = [
  { id: 'royal', name: 'Royal blue', top: 0x2c4ea3, hem: 0xf0b93a, price: 300 },
  { id: 'crimson', name: 'Crimson', top: 0xc8302a, hem: 0x7a1a14, price: 300 },
  { id: 'emerald', name: 'Emerald', top: 0x1f8f5a, hem: 0x0f5a38, price: 300 },
  { id: 'sunset', name: 'Sunset orange', top: 0xff8a3d, hem: 0xd8402f, price: 300 },
  { id: 'purple', name: 'Royal purple', top: 0x7a3a9a, hem: 0xf0b93a, price: 400 },
  { id: 'gold', name: 'Golden', top: 0xf0b93a, hem: 0xb8862a, price: 600 },
  { id: 'midnight', name: 'Midnight', top: 0x1b1830, hem: 0x2c4ea3, price: 400 },
  { id: 'snow', name: 'Snow white', top: 0xf6f6f2, hem: 0x2c6fd6, price: 300 },
];
export const KIPPAHS = [
  { id: 'white', name: 'White kippah', color: 0xf6f6f2, rim: 0x2c6fd6, price: 150 },
  { id: 'navy', name: 'Navy kippah', color: 0x1c2f6a, rim: 0xc0c4ca, price: 150 },
  { id: 'black', name: 'Black velvet kippah', color: 0x151515, rim: 0x151515, price: 150 },
  { id: 'sky', name: 'Sky blue kippah', color: 0x7fc8f0, rim: 0xffffff, star: 0xffffff, price: 200 },
  { id: 'red', name: 'Red kippah', color: 0xc8302a, rim: 0xf0b93a, price: 200 },
  { id: 'green', name: 'Green kippah', color: 0x2f8f4a, rim: 0xf0b93a, price: 200 },
  { id: 'gold', name: 'Gold kippah', color: 0xf0b93a, rim: 0x8a5a0b, price: 400 },
  { id: 'rainbow', name: 'Rainbow kippah', color: 0xe2483d, rim: 0x3fae5a, price: 500, star: 0xffffff, stripes: [0xe2483d, 0xffd24a, 0x3fae5a, 0x2c6fd6] },
];

export function outfitGeos(o) {
  const skin = 0xc68a5e, ink = 0x1b1830;
  const torso = merge([
    box(o.top, [0, 0, 0], [0.52, 0.6, 0.32]),
    box(o.hem, [0, -0.33, 0], [0.56, 0.12, 0.35]),
    box(o.belt, [0, -0.2, 0], [0.56, 0.08, 0.35]),
    box(0xf0b93a, [0, -0.2, -0.18], [0.1, 0.08, 0.02]),
    box(0x8b5a2b, [0, 0.02, 0.17], [0.66, 0.07, 0.04], [0, 0, 0.75]),
    box(0x8b5a2b, [0.25, -0.27, 0.12], [0.2, 0.24, 0.14]),
    box(0xf0b93a, [0.25, -0.22, 0.2], [0.08, 0.05, 0.02]),
    box(0xf3e3c3, [0, 0.28, -0.12], [0.3, 0.07, 0.1]),
  ]);
  const headParts = [
    box(skin, [0, 0, 0], [0.42, 0.42, 0.42]),
    box(0x3a2618, [0, 0.12, 0.06], [0.44, 0.2, 0.36]),
    box(ink, [-0.09, 0.02, -0.215], [0.07, 0.08, 0.02]),
    box(ink, [0.09, 0.02, -0.215], [0.07, 0.08, 0.02]),
    box(0xd99a6c, [0, -0.03, -0.225], [0.06, 0.07, 0.04]),
    box(0x8a4a3a, [0, -0.12, -0.215], [0.12, 0.03, 0.02]),
  ];
  // A Star of David lies flat on top of every hat: two thin triangles, one turned upside down.
  const starOn = (y, z, under, r, color) => {
    const c = new THREE.Color(under);
    const col = color || (0.3 * c.r + 0.59 * c.g + 0.11 * c.b > 0.55 ? 0x2c6fd6 : 0xf0b93a);
    for (const a of [0, Math.PI / 3]) headParts.push(part(new THREE.CylinderGeometry(r, r, 0.014, 3), col, [0, y, z], [0, a + Math.PI / 2, 0], [1, 1, 1], 0));
  };
  if (o.kippah) {
    // A kippah sits on the top of the head, a little toward the back.
    const k = o.kippah;
    headParts.push(part(new THREE.SphereGeometry(0.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), k.color, [0, 0.21, 0.05], [0, 0, 0], [1, 0.45, 1]));
    headParts.push(part(new THREE.CylinderGeometry(0.205, 0.205, 0.025, 12, 1, true), k.rim, [0, 0.215, 0.05]));
    if (k.stripes) k.stripes.forEach((c, n) => headParts.push(part(new THREE.CylinderGeometry(0.16 - n * 0.03, 0.16 - n * 0.03, 0.02, 12, 1, true), c, [0, 0.24 + n * 0.012, 0.05])));
    starOn(0.302, 0.05, k.color, 0.085, k.star);
  } else if (o.wrap) {
    headParts.push(box(o.wrap, [0, 0.19, 0], [0.47, 0.11, 0.47]), box(o.band, [0, 0.135, 0], [0.48, 0.035, 0.48]));
    starOn(0.251, 0.02, o.wrap, 0.11);
  } else {
    headParts.push(box(o.cap, [0, 0.22, 0.01], [0.46, 0.1, 0.46]), box(o.cap, [0, 0.18, -0.28], [0.36, 0.04, 0.18]));
    starOn(0.276, 0.03, o.cap, 0.11);
  }
  const tail = merge([box(o.wrap || 0xffffff, [0, -0.2, 0], [0.18, 0.4, 0.04]), box(o.band || 0xffffff, [0, -0.1, 0], [0.19, 0.035, 0.05])]);
  const arm = merge([box(o.top, [0, -0.15, 0], [0.16, 0.32, 0.17]), box(skin, [0, -0.39, 0], [0.13, 0.17, 0.14])]);
  const leg = merge(o.short
    ? [box(o.pants, [0, -0.14, 0], [0.19, 0.28, 0.2]), box(skin, [0, -0.42, 0], [0.16, 0.28, 0.17]), box(o.shoe, [0, -0.6, -0.03], [0.21, 0.12, 0.28])]
    : [box(o.pants, [0, -0.28, 0], [0.19, 0.56, 0.2]), box(o.shoe, [0, -0.6, -0.03], [0.21, 0.12, 0.28])]);
  return { torso, head: merge(headParts), tail, arm, leg };
}

export function buildPlayer() {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const mk = (geo) => new THREE.Mesh(geo, mat);
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const g = outfitGeos(OUTFITS.egypt);
  const torso = mk(g.torso);
  torso.position.y = 1.0;
  body.add(torso);

  const head = new THREE.Group();
  head.position.y = 1.5;
  body.add(head);
  const headMesh = mk(g.head);
  head.add(headMesh);
  const tail = mk(g.tail);
  tail.position.set(0, 0.18, 0.24);
  head.add(tail);

  const armL = mk(g.arm); armL.position.set(-0.35, 1.25, 0); body.add(armL);
  const armR = mk(g.arm); armR.position.set(0.35, 1.25, 0); body.add(armR);

  const legGeo = g.leg;
  const legL = mk(legGeo); legL.position.set(-0.13, 0.66, 0); body.add(legL);
  const legR = mk(legGeo); legR.position.set(0.13, 0.66, 0); body.add(legR);

  const jet = new THREE.Group();
  jet.add(new THREE.Mesh(merge([
    part(new THREE.CylinderGeometry(0.11, 0.11, 0.5, 10), 0xc9ced6, [-0.13, 0, 0], [0, 0, 0]),
    part(new THREE.CylinderGeometry(0.11, 0.11, 0.5, 10), 0xc9ced6, [0.13, 0, 0], [0, 0, 0]),
    part(new THREE.ConeGeometry(0.11, 0.14, 10), 0xd8402f, [-0.13, 0.32, 0]),
    part(new THREE.ConeGeometry(0.11, 0.14, 10), 0xd8402f, [0.13, 0.32, 0]),
    box(0x2c4ea3, [0, 0.05, -0.06], [0.42, 0.3, 0.06]),
    box(0xf0b93a, [0, 0.12, -0.03], [0.44, 0.05, 0.08]),
  ]), mat));
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa23c, transparent: true, opacity: 0.9 });
  const flames = [-0.13, 0.13].map((x) => {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.45, 8).rotateX(Math.PI), flameMat);
    f.position.set(x, -0.45, 0);
    jet.add(f);
    return f;
  });
  jet.position.set(0, 0.02, 0.3);
  jet.visible = false;
  torso.add(jet);
  jet.userData.flames = flames;

  // Swap the runner's clothes for a region's outfit.
  const outfitCache = {};
  // style: { skin, kippah } from the shop; they apply on top of each place's outfit.
  const wear = (id, style = {}) => {
    const sk = SKINS.find((x) => x.id === style.skin), kp = KIPPAHS.find((x) => x.id === style.kippah);
    const o = { ...(OUTFITS[id] || OUTFITS.egypt) };
    if (sk) { o.top = sk.top; o.hem = sk.hem; }
    if (kp) { o.kippah = kp; o.wrap = null; }
    const key = id + '|' + (style.skin || '') + '|' + (style.kippah || '');
    const gg = outfitCache[key] || (outfitCache[key] = outfitGeos(o));
    torso.geometry = gg.torso; headMesh.geometry = gg.head; tail.geometry = gg.tail;
    armL.geometry = armR.geometry = gg.arm; legL.geometry = legR.geometry = gg.leg;
    tail.visible = !!o.wrap;
  };
  return { root, body, torso, head, tail, armL, armR, legL, legR, mat, jet, wear };
}

// Star shield: a soft bubble with a glowing Star of David (Magen David) turning around the runner.
export function hexagramGeo(R, t, color) {
  const parts = [];
  for (const start of [Math.PI / 2, -Math.PI / 2]) {
    const pts = [0, 1, 2].map((k) => {
      const a = start + (k * Math.PI * 2) / 3;
      return [Math.cos(a) * R, Math.sin(a) * R];
    });
    for (let k = 0; k < 3; k++) {
      const [x1, y1] = pts[k], [x2, y2] = pts[(k + 1) % 3];
      const len = Math.hypot(x2 - x1, y2 - y1) + t;
      parts.push(box(color, [(x1 + x2) / 2, (y1 + y2) / 2, 0], [len, t, t], [0, 0, Math.atan2(y2 - y1, x2 - x1)], 0));
    }
  }
  return merge(parts);
}

export function buildShield() {
  const g = new THREE.Group();
  const bubble = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 20, 14),
    new THREE.MeshBasicMaterial({ color: 0xbfe2ff, transparent: true, opacity: 0.2, depthWrite: false }),
  );
  bubble.position.y = 0.9;
  g.add(bubble);
  const starMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 });
  const ring = new THREE.Group();
  ring.position.y = 0.95;
  const star = hexagramGeo(1.05, 0.07, 0x4aa8ff);
  for (const ry of [0, Math.PI / 2]) {
    const m = new THREE.Mesh(star, starMat);
    m.rotation.y = ry;
    ring.add(m);
  }
  g.add(ring);
  g.userData = { bubble, ring };
  return g;
}

// ---------------------------------------------------------------- obstacles
const EGY = { gold: 0xf0b93a, lapis: 0x2b59a6, red: 0xb83a2a, wood: 0x7a4a24 };

function buildBricks() {
  const P = [];
  const cols = [0xb8683a, 0xc47a44, 0xa95c30, 0xcf8a52];
  const bw = 0.44, bh = 0.27;
  for (let row = 0; row < 3; row++) {
    for (let x = -0.68 + (row % 2) * 0.22; x <= 0.7; x += bw) {
      P.push(box(cols[(row * 3 + Math.round(x * 10)) & 3], [x, row * bh + bh / 2, 0], [bw - 0.035, bh - 0.035, 0.62]));
    }
  }
  for (let i = 0; i < 7; i++) {
    P.push(box(0xe8c76a, [-0.75 + i * 0.25, 3 * bh + 0.02, (Math.random() - 0.5) * 0.4], [0.26, 0.03, 0.04], [0, Math.random() * 3, 0]));
  }
  return merge(P);
}

const JAR = new THREE.LatheGeometry(
  [[0.001, 0], [0.13, 0.02], [0.2, 0.12], [0.26, 0.35], [0.24, 0.55], [0.14, 0.68], [0.1, 0.74], [0.14, 0.8], [0.001, 0.8]]
    .map(([x, y]) => new THREE.Vector2(x, y)), 8);
const BAND = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true);

function buildJars() {
  return merge([
    part(JAR, 0xb4562c, [-0.58, 0, 0], [0, 0.3, 0], [1.05, 1, 1.05]),
    part(BAND, EGY.lapis, [-0.58, 0.44, 0], [0, 0.3, 0], [0.265, 0.06, 0.265]),
    part(JAR, 0xc0663a, [0, 0, 0.05], [0, 1, 0], [1.1, 1.05, 1.1]),
    part(BAND, EGY.gold, [0, 0.46, 0.05], [0, 1, 0], [0.28, 0.06, 0.28]),
    part(JAR, 0xa94e28, [0.6, 0, -0.04], [0, 2, 0], [1, 0.95, 1]),
    part(BAND, EGY.lapis, [0.6, 0.42, -0.04], [0, 2, 0], [0.255, 0.06, 0.255]),
  ]);
}

function buildBanner() {
  const P = [
    box(EGY.wood, [-1.0, 1.17, 0], [0.14, 2.34, 0.14]),
    box(EGY.wood, [1.0, 1.17, 0], [0.14, 2.34, 0.14]),
    box(0x5e3618, [0, 2.32, 0], [2.3, 0.16, 0.2]),
    box(EGY.gold, [-1.0, 2.44, 0], [0.2, 0.08, 0.2]),
    box(EGY.gold, [1.0, 2.44, 0], [0.2, 0.08, 0.2]),
    box(EGY.lapis, [0, 2.06, 0.03], [1.8, 0.34, 0.04]),
    box(EGY.gold, [0, 1.73, 0.03], [1.8, 0.32, 0.04]),
    box(EGY.red, [0, 1.41, 0.03], [1.8, 0.32, 0.04]),
  ];
  for (let i = 0; i < 9; i++) P.push(box(EGY.gold, [-0.8 + i * 0.2, 1.17, 0.03], [0.05, 0.17, 0.04]));
  return merge(P);
}

function buildObelisk() {
  const P = [
    box(0xb9a27a, [0, 0.18, 0], [1.4, 0.36, 1.4]),
    part(new THREE.CylinderGeometry(0.4, 0.58, 3.3, 4, 1), 0xdcc59c, [0, 2.01, 0], [0, Math.PI / 4, 0]),
    part(new THREE.ConeGeometry(0.4, 0.5, 4), EGY.gold, [0, 3.91, 0], [0, Math.PI / 4, 0]),
  ];
  const glyph = [0x4a3424, EGY.lapis, EGY.red];
  for (let y = 0.9; y < 3.3; y += 0.32) {
    const w = 0.41 - 0.127 * (y - 0.36) / 3.3;
    P.push(box(glyph[Math.floor(y * 3) % 3], [-0.07, y, w + 0.01], [0.1, 0.12, 0.03]));
    P.push(box(glyph[Math.floor(y * 5) % 3], [0.09, y + 0.08, w + 0.01], [0.08, 0.08, 0.03]));
  }
  return merge(P);
}

function buildBlock() {
  return merge([
    box(0xdcc6a0, [0, 1.3, 0], [1.7, 2.6, 1.1]),
    box(0xc8b088, [0, 2.7, 0], [1.86, 0.2, 1.24]),
    box(EGY.lapis, [0, 2.36, 0.56], [1.5, 0.18, 0.02]),
    box(EGY.gold, [0, 2.17, 0.56], [1.5, 0.1, 0.02]),
    part(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 10), 0xe0782f, [0, 1.55, 0.57], [Math.PI / 2, 0, 0]),
    box(EGY.lapis, [-0.5, 1.58, 0.56], [0.5, 0.12, 0.02], [0, 0, 0.12]),
    box(EGY.lapis, [0.5, 1.58, 0.56], [0.5, 0.12, 0.02], [0, 0, -0.12]),
    box(0xc2ab84, [0, 0.12, 0], [1.8, 0.24, 1.2]),
  ]);
}

function buildCoral() {
  const P = [
    part(DODECA, 0x8d8f86, [-0.55, 0.22, 0], [0.3, 0.2, 0.1], [0.45, 0.36, 0.42]),
    part(DODECA, 0x7f857e, [0.48, 0.2, 0.05], [0.5, 0.1, 0.3], [0.45, 0.34, 0.4]),
    part(DODECA, 0x9a9488, [0, 0.16, -0.1], [0, 0, 0], [0.42, 0.3, 0.35]),
  ];
  const cols = [0xff7a6b, 0xff9f4a, 0xd65db1, 0xffc857];
  for (let i = 0; i < 9; i++) {
    const x = -0.8 + i * 0.2, h = 0.25 + Math.random() * 0.2, z = (Math.random() - 0.5) * 0.3;
    P.push(part(CYL6, cols[i % 4], [x, 0.3 + h / 2, z], [(Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5], [0.07, h, 0.07]));
    P.push(part(ICO, cols[i % 4], [x, 0.3 + h, z], [0, 0, 0], [0.1, 0.1, 0.1]));
  }
  return merge(P);
}

function buildWaterArch() {
  const P = [part(new THREE.TorusGeometry(1.1, 0.24, 6, 14, Math.PI), 0x34b0d6, [0, 0, 0], [0, 0, 0], [1, 1.25, 1.2])];
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * Math.PI;
    P.push(part(ICO, i % 2 ? 0xffffff : 0xdff7ff, [Math.cos(a) * 1.12, Math.sin(a) * 1.25 * 1.12 + 0.2, 0], [i, i * 2, 0], [0.16, 0.13, 0.2]));
  }
  for (const sx of [-1, 1]) {
    P.push(part(ICO, 0xdff7ff, [sx * 1.1, 0.1, 0.1], [0, 1, 0], [0.32, 0.18, 0.32]));
    P.push(part(ICO, 0x7fd6ee, [sx * 1.25, 0.08, -0.15], [1, 0, 0], [0.25, 0.14, 0.25]));
  }
  return merge(P);
}

function buildRockStack() {
  const P = [
    part(DODECA, 0x6f7f7c, [0, 0.75, 0], [0.2, 0.5, 0], [0.95, 0.8, 0.85]),
    part(DODECA, 0x7c8b86, [0.1, 1.72, 0.05], [0.6, 0.2, 0.4], [0.75, 0.62, 0.7]),
    part(DODECA, 0x8a9690, [-0.05, 2.5, 0], [0.1, 0.9, 0.3], [0.5, 0.45, 0.5]),
  ];
  for (let i = 0; i < 6; i++) {
    const x = -0.7 + i * 0.28;
    P.push(box(i % 2 ? 0x2f8f5b : 0x4caf6e, [x, 0.5 + (i % 3) * 0.2, 0.72], [0.07, 0.8 + (i % 3) * 0.3, 0.04], [0, 0, (i - 2.5) * 0.08]));
  }
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    P.push(box(0xff8a3d, [0.3 + Math.cos(a) * 0.1, 1.45 + Math.sin(a) * 0.1, 0.74], [0.2, 0.06, 0.04], [0, 0, a]));
  }
  return merge(P);
}

function buildRocksLow(c1, c2) {
  return merge([
    part(DODECA, c1, [-0.58, 0.32, 0], [0.4, 0.2, 0.1], [0.5, 0.44, 0.45]),
    part(DODECA, c2, [0.06, 0.38, 0.06], [0.1, 0.7, 0.3], [0.48, 0.48, 0.46]),
    part(DODECA, c1, [0.62, 0.28, -0.04], [0.8, 0.1, 0.5], [0.42, 0.36, 0.42]),
    part(DODECA, c2, [-0.2, 0.14, 0.32], [0.3, 0.3, 0.3], [0.24, 0.18, 0.22]),
  ]);
}

function buildBush() {
  const P = [];
  for (let i = 0; i < 7; i++) {
    const x = -0.75 + i * 0.25;
    P.push(part(ICO, i % 2 ? 0x5f6b2f : 0x6f7d36, [x, 0.38 + (i % 3) * 0.06, (Math.random() - 0.5) * 0.3], [i, i, 0], [0.3, 0.32, 0.3]));
  }
  for (let i = 0; i < 10; i++) {
    P.push(box(0x6b4a2a, [-0.8 + i * 0.18, 0.55, 0.15], [0.03, 0.5, 0.03], [(Math.random() - 0.5) * 0.9, 0, (Math.random() - 0.5) * 0.9]));
  }
  return merge(P);
}

function buildTent() {
  const wood = 0x6b4423;
  const P = [
    box(wood, [-1.0, 1.1, -0.35], [0.1, 2.2, 0.1]), box(wood, [1.0, 1.1, -0.35], [0.1, 2.2, 0.1]),
    box(wood, [-1.0, 0.85, 0.42], [0.1, 1.7, 0.1]), box(wood, [1.0, 0.85, 0.42], [0.1, 1.7, 0.1]),
    box(0x2b2420, [0, 1.62, 0], [2.3, 0.06, 1.15], [0.35, 0, 0]),
    box(0xb83a2a, [0, 1.3, 0.55], [2.3, 0.24, 0.04]),
  ];
  for (const x of [-0.6, 0, 0.6]) P.push(box(0xd8cfc0, [x, 1.625, 0], [0.12, 0.066, 1.15], [0.35, 0, 0]));
  for (let i = 0; i < 11; i++) P.push(box(0xf0b93a, [-1 + i * 0.2, 1.12, 0.56], [0.05, 0.14, 0.04]));
  return merge(P);
}

export function buildCamel() {
  const tan = 0xc89b5c, dark = 0x9c7240, ink = 0x1b1830;
  return merge([
    box(tan, [0, 1.35, 0], [0.75, 0.7, 1.5]),
    box(tan, [0, 1.85, -0.1], [0.6, 0.45, 0.7]),
    box(dark, [0, 2.1, -0.1], [0.4, 0.14, 0.45]),
    box(0xb83a2a, [0, 1.62, -0.1], [0.8, 0.36, 0.9]),
    box(0x2b59a6, [0, 1.62, -0.1], [0.82, 0.08, 0.92]),
    box(tan, [0, 1.8, 0.85], [0.3, 0.75, 0.32], [0.5, 0, 0]),
    box(tan, [0, 2.17, 1.12], [0.32, 0.3, 0.55]),
    box(dark, [0, 2.1, 1.4], [0.26, 0.2, 0.1]),
    box(ink, [-0.17, 2.24, 1.15], [0.03, 0.06, 0.06]),
    box(ink, [0.17, 2.24, 1.15], [0.03, 0.06, 0.06]),
    box(dark, [-0.12, 2.36, 0.95], [0.06, 0.1, 0.06]),
    box(dark, [0.12, 2.36, 0.95], [0.06, 0.1, 0.06]),
    box(tan, [-0.25, 0.5, 0.55], [0.18, 1.0, 0.18]), box(tan, [0.25, 0.5, 0.55], [0.18, 1.0, 0.18]),
    box(tan, [-0.25, 0.5, -0.55], [0.18, 1.0, 0.18]), box(tan, [0.25, 0.5, -0.55], [0.18, 1.0, 0.18]),
    box(dark, [0, 1.3, -0.8], [0.08, 0.4, 0.08], [-0.3, 0, 0]),
  ]);
}

function buildTumble() {
  const P = [];
  const cols = [0x9c7a46, 0x7d5f35, 0xb8955a];
  for (let i = 0; i < 46; i++) {
    P.push(part(BOX, cols[i % 3],
      [(Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25],
      [Math.random() * 3, Math.random() * 3, Math.random() * 3], [0.035, 0.035, 0.8 + Math.random() * 0.15]));
  }
  return merge(P);
}

function buildLedge() {
  return merge([
    box(0x7d6a5e, [0, 0.36, 0], [1.9, 0.72, 0.8]),
    box(0x958072, [0, 0.76, 0], [1.8, 0.1, 0.7]),
    box(0x5e4f46, [-0.3, 0.4, 0.41], [0.05, 0.5, 0.02], [0, 0, 0.4]),
    box(0x5e4f46, [0.45, 0.35, 0.41], [0.05, 0.4, 0.02], [0, 0, -0.3]),
  ]);
}

function buildStoneArch() {
  return merge([
    box(0x7d6a5e, [-1.08, 0.95, 0], [0.34, 1.9, 0.6]),
    box(0x7d6a5e, [1.08, 0.95, 0], [0.34, 1.9, 0.6]),
    box(0x8d7a6c, [0, 1.4, 0], [2.6, 0.62, 0.7]),
    box(0x6e5d52, [0, 1.84, 0], [2.2, 0.26, 0.6]),
    box(0x5e4f46, [0, 1.12, 0.36], [2.0, 0.06, 0.02]),
  ]);
}

function buildBoulder() {
  return merge([part(jagged(1.25, 1, 0.16, 1), 0x7a675c, [0, 1.2, 0], [0, 0, 0], [1, 1.0, 0.95], 0.08)]);
}

function buildRollStone() {
  return merge([part(jagged(0.95, 1, 0.14, 2), 0x8a7466, [0, 0, 0], [0, 0, 0], [1, 1, 1], 0.1)]);
}

// A launch ramp: wood planks rising away from the runner, with gold rails.
function buildRamp() {
  const wedge = new THREE.BoxGeometry(1.8, 1.25, 3.2);
  const pos = wedge.attributes.position;
  for (let i = 0; i < pos.count; i++) if (pos.getY(i) > 0 && pos.getZ(i) > 0) pos.setY(i, -0.625);
  wedge.computeVertexNormals();
  const P = [part(wedge, 0x9a6a3a, [0, 0.625, 0], [0, 0, 0], [1, 1, 1], 0.08)];
  const slope = Math.atan2(1.25, 3.2);
  for (const x of [-0.92, 0.92]) P.push(box(EGY.gold, [x, 0.66, 0], [0.1, 0.1, 3.42], [slope, 0, 0]));
  for (let k = 0; k < 4; k++) {
    const z = 1.2 - k * 0.8;
    P.push(box(0xf0b93a, [0, 0.625 - z * (1.25 / 3.2) + 0.03, z], [1.5, 0.03, 0.14], [slope, 0, 0]));
  }
  return merge(P);
}

// Elevated walkway reached from a ramp: run along the top, drop off the end.
function buildDeck() {
  const P = [
    box(0x8a6a48, [0, 1.1, 0], [1.9, 0.3, 16]),
    box(0xb08a5a, [0, 1.27, 0], [1.86, 0.04, 15.9]),
    box(0xf0b93a, [-0.93, 1.3, 0], [0.08, 0.08, 16]),
    box(0xf0b93a, [0.93, 1.3, 0], [0.08, 0.08, 16]),
  ];
  for (let z = -7.5; z <= 7.5; z += 3) {
    P.push(box(0x6d3e1c, [-0.8, 0.48, z], [0.2, 0.96, 0.2]), box(0x6d3e1c, [0.8, 0.48, z], [0.2, 0.96, 0.2]));
    P.push(box(0x9a7a56, [0, 1.285, z], [1.8, 0.02, 0.08]));
  }
  return merge(P);
}

function buildWell() {
  const P = [
    part(new THREE.CylinderGeometry(0.85, 0.9, 0.9, 10), 0xc8b18a, [0, 0.45, 0]),
    part(new THREE.CylinderGeometry(0.66, 0.66, 0.05, 10), 0x2f8fb3, [0, 0.85, 0]),
    box(0x6d3e1c, [-0.75, 1.5, 0], [0.12, 1.6, 0.12]),
    box(0x6d3e1c, [0.75, 1.5, 0], [0.12, 1.6, 0.12]),
    box(0x6d3e1c, [0, 2.2, 0], [1.7, 0.1, 0.1]),
    part(new THREE.ConeGeometry(1.25, 0.7, 4), 0xb83a2a, [0, 2.65, 0], [0, Math.PI / 4, 0]),
    part(new THREE.CylinderGeometry(0.14, 0.12, 0.25, 8), 0x8b5a2b, [0.1, 1.7, 0]),
  ];
  return merge(P);
}

// ---- modern-city obstacles (Tel Aviv, airport, New York, donut shop)
function buildSuitcases() {
  const cols = [0x2c4ea3, 0xd8402f, 0xf0b93a, 0x3f9a5a];
  const P = [];
  [[-0.55, 0.3, 0], [0.05, 0.28, 0.05], [0.6, 0.32, -0.05], [-0.25, 0.68, 0], [0.35, 0.66, 0.02]].forEach(([x, y, z], k) => {
    P.push(box(cols[k % 4], [x, y, z], [0.55, 0.38 + (k % 2) * 0.06, 0.32]));
    P.push(box(0x222222, [x, y + 0.24, z], [0.2, 0.06, 0.05]));
  });
  return merge(P);
}
function buildBarrierArm() {
  return merge([
    box(0x444444, [-1.0, 0.75, 0], [0.22, 1.5, 0.22]),
    box(0xf2f2f2, [0, 1.35, 0], [2.1, 0.16, 0.12]),
    ...[-0.8, -0.4, 0, 0.4, 0.8].map((x) => box(0xd8402f, [x, 1.35, 0.01], [0.2, 0.17, 0.13])),
    box(0xf2f2f2, [0, 1.12, 0], [2.0, 0.08, 0.08]),
  ]);
}
function buildLuggageCart() {
  const P = [box(0x9aa0a6, [0, 0.3, 0], [1.4, 0.1, 1.8]), box(0x9aa0a6, [0, 1.1, -0.85], [1.4, 1.6, 0.08])];
  for (const [x, z] of [[-0.6, -0.8], [0.6, -0.8], [-0.6, 0.8], [0.6, 0.8]]) P.push(box(0x222222, [x, 0.13, z], [0.12, 0.26, 0.26]));
  [[0.6, 0.2], [1.05, -0.1], [1.5, 0.15], [1.9, -0.05], [2.3, 0.1]].forEach(([y, x], k) => P.push(box([0x2c4ea3, 0xd8402f, 0x3f9a5a, 0xf0b93a, 0x7a4a9a][k], [x, y, 0], [1.2, 0.42, 1.5])));
  return merge(P);
}
function buildTaxi() {
  return merge([
    box(0xf5c518, [0, 0.75, 0], [1.6, 0.7, 3.8]),
    box(0xf5c518, [0, 1.35, -0.2], [1.4, 0.55, 2.0]),
    box(0x2a3a4a, [0, 1.36, 0.82], [1.3, 0.45, 0.04]),
    box(0x2a3a4a, [0.71, 1.36, -0.2], [0.02, 0.4, 1.7]),
    box(0x2a3a4a, [-0.71, 1.36, -0.2], [0.02, 0.4, 1.7]),
    box(0x111111, [0, 0.62, 0], [1.62, 0.1, 3.82]),
    box(0xffffff, [0, 1.72, -0.2], [0.5, 0.18, 0.3]),
    ...[[-0.8, 1.3], [0.8, 1.3], [-0.8, -1.3], [0.8, -1.3]].map(([x, z]) => part(new THREE.CylinderGeometry(0.34, 0.34, 0.25, 10), 0x111111, [x, 0.34, z], [0, 0, Math.PI / 2])),
    box(0xfff3c4, [-0.55, 0.85, 1.91], [0.3, 0.16, 0.02]), box(0xfff3c4, [0.55, 0.85, 1.91], [0.3, 0.16, 0.02]),
  ]);
}
function buildHydrants() {
  const P = [];
  for (const x of [-0.6, 0, 0.6]) {
    P.push(part(new THREE.CylinderGeometry(0.2, 0.24, 0.65, 10), 0xd8402f, [x, 0.33, 0]));
    P.push(part(new THREE.SphereGeometry(0.22, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xd8402f, [x, 0.65, 0]));
    P.push(box(0xb0302a, [x, 0.45, 0], [0.62, 0.1, 0.12]));
  }
  return merge(P);
}
function buildTurnstiles() {
  const P = [];
  for (const x of [-0.7, 0, 0.7]) {
    P.push(box(0xb8bcc2, [x, 0.42, 0], [0.32, 0.84, 0.7]));
    P.push(box(0x3fae5a, [x, 0.86, 0.2], [0.18, 0.04, 0.12]));
    P.push(box(0xd8dde2, [x + 0.25, 0.7, 0], [0.5, 0.06, 0.06]));
  }
  return merge(P);
}
function buildGiantDonut() {
  return merge([
    part(new THREE.TorusGeometry(1.0, 0.48, 10, 20), 0xd9a066, [0, 1.5, 0]),
    part(new THREE.TorusGeometry(1.0, 0.5, 10, 20, Math.PI * 2), 0xf38bb8, [0, 1.5, 0.08], [0, 0, 0], [1, 1, 0.55]),
    ...Array.from({ length: 16 }, (_, k) => {
      const a = (k / 16) * Math.PI * 2;
      return box([0xffffff, 0x4aa8ff, 0xffd24a, 0x3fae5a][k % 4], [Math.cos(a) * 1.0, 1.5 + Math.sin(a) * 1.0, 0.36], [0.16, 0.05, 0.05], [0, 0, a * 2]);
    }),
    box(0x6b4a2a, [0, 0.2, 0], [1.2, 0.4, 0.6]),
  ]);
}
function buildJuiceKiosk() {
  return merge([
    box(0xffffff, [0, 1.1, 0], [1.6, 2.2, 1.4]),
    box(0xff8a3d, [0, 2.35, 0.1], [1.9, 0.3, 1.7]),
    box(0x3fae5a, [0, 1.25, 0.71], [1.4, 0.6, 0.02]),
    ...[[-0.4, 0xff8a3d], [0, 0xffd24a], [0.4, 0xd8402f]].map(([x, c]) => part(ICO, c, [x, 1.65, 0.72], [0, 0, 0], [0.16, 0.16, 0.16])),
  ]);
}

// ---- obstacles for the Torah places
function buildLog() { // a fallen log after the flood
  return merge([
    part(new THREE.CylinderGeometry(0.34, 0.38, 1.9, 8), 0x6b4a2a, [0, 0.36, 0], [0, 0, Math.PI / 2]),
    part(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 8), 0xc8a070, [0.96, 0.36, 0], [0, 0, Math.PI / 2]),
    box(0x4f8f3a, [-0.3, 0.72, 0.1], [0.4, 0.08, 0.3]),
  ]);
}
function buildElephants() { // two elephants leaving the ark, side by side
  const P = [];
  for (const x of [-0.42, 0.42]) {
    P.push(box(0x8a8a90, [x, 1.3, 0], [0.75, 0.9, 1.5]), box(0x8a8a90, [x, 1.75, 0.85], [0.6, 0.6, 0.5]));
    P.push(box(0x7a7a80, [x, 1.15, 1.2], [0.18, 0.9, 0.18], [0.3, 0, 0]));
    P.push(box(0x9a9aa0, [x - 0.36, 1.85, 0.75], [0.08, 0.6, 0.5]), box(0x9a9aa0, [x + 0.36, 1.85, 0.75], [0.08, 0.6, 0.5]));
    P.push(box(0xf4f1ea, [x - 0.16, 1.45, 1.15], [0.06, 0.06, 0.35]), box(0xf4f1ea, [x + 0.16, 1.45, 1.15], [0.06, 0.06, 0.35]));
    for (const [dx, dz] of [[-0.22, -0.5], [0.22, -0.5], [-0.22, 0.5], [0.22, 0.5]]) P.push(box(0x8a8a90, [x + dx, 0.42, dz], [0.24, 0.85, 0.24]));
  }
  return merge(P);
}
function buildSheepFlock() { // a little flock of sheep to jump over
  const P = [];
  for (const [x, z] of [[-0.6, 0], [0.05, 0.1], [0.65, -0.05]]) {
    P.push(part(ICO, 0xf2efe6, [x, 0.45, z], [0, 0, 0], [0.32, 0.28, 0.3]), box(0x2a2420, [x, 0.55, z + 0.34], [0.16, 0.18, 0.2]));
    for (const [dx, dz] of [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]]) P.push(box(0x2a2420, [x + dx, 0.12, z + dz], [0.05, 0.26, 0.05]));
  }
  return merge(P);
}
function buildRubble() { // stones from the fallen walls of Jericho
  const P = [];
  for (let k = 0; k < 9; k++) P.push(box([0xd8c098, 0xc8b088, 0xb8a078][k % 3], [-0.75 + (k % 5) * 0.38, 0.2 + Math.floor(k / 5) * 0.32, (Math.random() - 0.5) * 0.3], [0.42, 0.34, 0.5], [0, Math.random(), Math.random() * 0.3]));
  return merge(P);
}
function buildScaffold() { // a scaffold beam at Babel: slide under it
  return merge([
    box(0x7a4a24, [-1.0, 1.15, 0], [0.12, 2.3, 0.12]), box(0x7a4a24, [1.0, 1.15, 0], [0.12, 2.3, 0.12]),
    box(0x9a7a56, [0, 1.25, 0], [2.2, 0.16, 0.5]), box(0x9a7a56, [0, 2.2, 0], [2.2, 0.12, 0.5]),
    box(0xb8683a, [-0.5, 1.45, 0], [0.4, 0.24, 0.3]), box(0xc47a44, [0.3, 1.45, 0.05], [0.4, 0.24, 0.3]),
    box(0x7a4a24, [0, 1.7, 0], [2.0, 0.05, 0.05], [0, 0, 0.45]),
  ]);
}
function buildGiantSpear() { // Goliath's spear driven into the ground, and his great shield
  return merge([
    box(0x8a6a48, [0.3, 1.8, 0], [0.22, 3.6, 0.22], [0, 0, 0.08]),
    part(new THREE.ConeGeometry(0.28, 0.9, 6), 0x9aa0a6, [0.45, 3.9, 0], [0, 0, 0.08]),
    part(new THREE.CylinderGeometry(0.85, 0.85, 0.14, 14), 0xb07a3a, [-0.35, 0.95, 0.15], [Math.PI / 2 - 0.2, 0, 0]),
    part(new THREE.CylinderGeometry(0.25, 0.25, 0.18, 10), 0xd8a050, [-0.35, 0.97, 0.25], [Math.PI / 2 - 0.2, 0, 0]),
  ]);
}

// kind: low = jump, high = slide, tall = change lane. Boxes: [x0, x1, y0, y1, z0, z1] around the lane centre.
export const OBSTACLES = {
  bricks: { kind: 'low', build: buildBricks, boxes: [[-0.9, 0.9, 0, 0.82, -0.33, 0.33]] },
  jars: { kind: 'low', build: buildJars, boxes: [[-0.85, 0.85, 0, 0.8, -0.28, 0.28]] },
  banner: { kind: 'high', build: buildBanner, boxes: [[-1, 1, 1.02, 2.4, -0.15, 0.15]] },
  obelisk: { kind: 'tall', build: buildObelisk, boxes: [[-0.62, 0.62, 0, 4, -0.62, 0.62]] },
  block: { kind: 'tall', build: buildBlock, boxes: [[-0.85, 0.85, 0, 2.8, -0.55, 0.55]] },
  coral: { kind: 'low', build: buildCoral, boxes: [[-0.88, 0.88, 0, 0.8, -0.3, 0.3]] },
  arch: { kind: 'high', build: buildWaterArch, boxes: [[-1, 1, 1.05, 1.9, -0.25, 0.25]] },
  rockstack: { kind: 'tall', build: buildRockStack, boxes: [[-0.85, 0.85, 0, 2.9, -0.7, 0.7]] },
  rocks: { kind: 'low', build: () => buildRocksLow(0xbf9a68, 0xa98657), boxes: [[-0.9, 0.9, 0, 0.75, -0.35, 0.35]] },
  bush: { kind: 'low', build: buildBush, boxes: [[-0.85, 0.85, 0, 0.75, -0.3, 0.3]] },
  tent: { kind: 'high', build: buildTent, boxes: [[-1, 1, 1.05, 2.2, -0.45, 0.5]] },
  camel: { kind: 'tall', build: buildCamel, boxes: [[-0.48, 0.48, 0, 2.4, -0.85, 1.4]] },
  tumble: { kind: 'low', roll: 5, bounce: true, build: buildTumble, boxes: [[-0.42, 0.42, -0.42, 0.42, -0.42, 0.42]] },
  ledge: { kind: 'low', build: buildLedge, boxes: [[-0.92, 0.92, 0, 0.78, -0.38, 0.38]] },
  stonearch: { kind: 'high', build: buildStoneArch, boxes: [[-1, 1, 1.08, 2.0, -0.33, 0.33]] },
  boulder: { kind: 'tall', build: buildBoulder, boxes: [[-1.0, 1.0, 0, 2.4, -1.0, 1.0]] },
  suitcases: { kind: 'low', build: buildSuitcases, boxes: [[-0.88, 0.88, 0, 0.82, -0.2, 0.2]] },
  barrier: { kind: 'high', build: buildBarrierArm, boxes: [[-1, 1, 1.05, 1.45, -0.1, 0.1]] },
  cart: { kind: 'tall', build: buildLuggageCart, boxes: [[-0.75, 0.75, 0, 2.6, -0.9, 0.9]] },
  taxi: { kind: 'tall', build: buildTaxi, boxes: [[-0.8, 0.8, 0, 1.9, -1.9, 1.9]] },
  hydrants: { kind: 'low', build: buildHydrants, boxes: [[-0.85, 0.85, 0, 0.75, -0.25, 0.25]] },
  turnstiles: { kind: 'low', build: buildTurnstiles, boxes: [[-0.88, 0.88, 0, 0.85, -0.35, 0.35]] },
  bigdonut: { kind: 'tall', build: buildGiantDonut, boxes: [[-0.95, 0.95, 0, 3, -0.5, 0.5]] },
  kiosk: { kind: 'tall', build: buildJuiceKiosk, boxes: [[-0.8, 0.8, 0, 2.5, -0.7, 0.7]] },
  log: { kind: 'low', build: buildLog, boxes: [[-0.9, 0.9, 0, 0.75, -0.38, 0.38]] },
  elephants: { kind: 'tall', build: buildElephants, boxes: [[-0.9, 0.9, 0, 2.2, -0.9, 1.4]] },
  sheep: { kind: 'low', build: buildSheepFlock, boxes: [[-0.85, 0.85, 0, 0.7, -0.35, 0.45]] },
  rubble: { kind: 'low', build: buildRubble, boxes: [[-0.88, 0.88, 0, 0.75, -0.35, 0.35]] },
  scaffold: { kind: 'high', build: buildScaffold, boxes: [[-1, 1, 1.05, 2.3, -0.25, 0.25]] },
  giantspear: { kind: 'tall', build: buildGiantSpear, boxes: [[-0.9, 0.9, 0, 3.5, -0.4, 0.4]] },
  ramp: { kind: 'ramp', build: buildRamp, boxes: [[-0.9, 0.9, 0, 1.25, -1.6, 1.6]] },
  deck: { kind: 'deck', build: buildDeck, boxes: [[-0.95, 0.95, 0, 1.25, -8, 8]] },
  well: { kind: 'tall', build: buildWell, boxes: [[-0.9, 0.9, 0, 3, -0.9, 0.9]] },
  rollstone: { kind: 'tall', roll: 7, build: buildRollStone, boxes: [[-0.8, 0.8, -0.95, 0.95, -0.8, 0.8]] },
};

export const BIOME_OBSTACLES = {
  egypt: { low: ['bricks', 'jars'], high: ['banner'], tall: ['obelisk', 'block'], roll: [] },
  sea: { low: ['coral'], high: ['arch'], tall: ['rockstack'], roll: [] },
  wild: { low: ['rocks', 'bush'], high: ['tent'], tall: ['camel'], roll: ['tumble'] },
  elim: { low: ['jars', 'rocks'], high: ['banner'], tall: ['well', 'camel'], roll: [] },
  night: { low: ['rocks', 'bush'], high: ['tent'], tall: ['camel', 'boulder'], roll: ['tumble'] },
  jerusalem: { low: ['bricks', 'jars'], high: ['stonearch', 'banner'], tall: ['block', 'well'], roll: [] },
  telaviv: { low: ['suitcases', 'jars'], high: ['banner'], tall: ['kiosk'], roll: [] },
  airport: { low: ['suitcases'], high: ['barrier'], tall: ['cart'], roll: [] },
  newyork: { low: ['hydrants'], high: ['barrier'], tall: ['taxi'], roll: [] },
  donut: { low: ['turnstiles'], high: ['barrier'], tall: ['bigdonut'], roll: [] },
  park: { low: ['bush', 'hydrants'], high: ['barrier'], tall: ['taxi', 'kiosk'], roll: [] },
  harbor: { low: ['suitcases', 'hydrants'], high: ['barrier'], tall: ['cart', 'taxi'], roll: [] },
  ararat: { low: ['log', 'rocks'], high: ['arch'], tall: ['elephants', 'boulder'], roll: [] },
  babel: { low: ['bricks'], high: ['scaffold'], tall: ['block'], roll: [] },
  jacob: { low: ['sheep', 'rocks'], high: ['tent'], tall: ['camel'], roll: [] },
  rephidim: { low: ['rocks', 'bush'], high: ['tent'], tall: ['camel', 'boulder'], roll: ['tumble'] },
  jordan: { low: ['rocks', 'log'], high: ['arch'], tall: ['rockstack'], roll: [] },
  jericho: { low: ['rubble'], high: ['stonearch'], tall: ['block'], roll: ['rollstone'] },
  elah: { low: ['sheep', 'rocks'], high: ['tent'], tall: ['giantspear', 'boulder'], roll: [] },
  sinai: { low: ['ledge'], high: ['stonearch'], tall: ['boulder'], roll: ['rollstone'] },
};

const geoCache = {};
export function obstacleGeo(type) {
  if (!geoCache[type]) geoCache[type] = OBSTACLES[type].build();
  return geoCache[type];
}

// ---------------------------------------------------------------- canvas textures
function canvasTex(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export const softDot = () => canvasTex(64, (g, s) => {
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, s, s);
});

export const mannaTex = () => canvasTex(64, (g, s) => {
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.28, 'rgba(255,248,214,1)');
  r.addColorStop(0.42, 'rgba(240,185,58,0.95)');
  r.addColorStop(0.55, 'rgba(160,100,20,0.55)');
  r.addColorStop(1, 'rgba(240,185,58,0)');
  g.fillStyle = r; g.fillRect(0, 0, s, s);
});

export const shadowTex = () => canvasTex(64, (g, s) => {
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, 'rgba(20,12,4,0.55)');
  r.addColorStop(0.6, 'rgba(20,12,4,0.25)');
  r.addColorStop(1, 'rgba(20,12,4,0)');
  g.fillStyle = r; g.fillRect(0, 0, s, s);
});

const DISPLAY_FONT = '"Suez One", "Frank Ruhl Libre", "Noto Serif Hebrew", "Times New Roman", serif';

function medallion(g, s, rim, face) {
  const c = s / 2;
  const halo = g.createRadialGradient(c, c, s * 0.3, c, c, c);
  halo.addColorStop(0, 'rgba(255,214,102,0.9)');
  halo.addColorStop(1, 'rgba(255,214,102,0)');
  g.fillStyle = halo; g.fillRect(0, 0, s, s);
  g.beginPath(); g.arc(c, c, s * 0.38, 0, Math.PI * 2);
  const rg = g.createLinearGradient(0, c - s * 0.38, 0, c + s * 0.38);
  rg.addColorStop(0, '#ffe08a'); rg.addColorStop(0.5, rim); rg.addColorStop(1, '#a8701a');
  g.fillStyle = rg; g.fill();
  g.beginPath(); g.arc(c, c, s * 0.31, 0, Math.PI * 2);
  g.fillStyle = face; g.fill();
  g.lineWidth = s * 0.012; g.strokeStyle = 'rgba(120,80,20,0.6)'; g.stroke();
}

// Coins are shekels that change with the era: a silver shekel with a pomegranate in ancient times,
// a bronze Temple half-shekel with a chalice in Jerusalem, and a modern gold 10-shekel coin after that.
export const COIN_ERA = {
  egypt: 'ancient', sea: 'ancient', elim: 'ancient', wild: 'ancient', night: 'ancient', sinai: 'ancient',
  ararat: 'ancient', babel: 'ancient', jacob: 'ancient', rephidim: 'ancient', jordan: 'ancient', jericho: 'ancient', elah: 'ancient',
  jerusalem: 'temple', telaviv: 'modern', airport: 'modern', newyork: 'modern', donut: 'modern',
};
const coinCache = {};
export function shekelTexture(era) {
  if (coinCache[era]) return coinCache[era];
  const look = {
    ancient: { rim: '#8e9298', face: '#d8dce2', ink: '#5a5e66', label: '' },
    temple: { rim: '#8a5a24', face: '#c98a4a', ink: '#5e3a14', label: '' },
    modern: { rim: '#b8bcc2', face: '#f0c040', ink: '#8a5a0b', label: '10' },
  }[era];
  coinCache[era] = canvasTex(128, (g, s) => {
    const c = s / 2;
    const glow = g.createRadialGradient(c, c, s * 0.3, c, c, c);
    glow.addColorStop(0, 'rgba(255,230,150,0.55)'); glow.addColorStop(1, 'rgba(255,230,150,0)');
    g.fillStyle = glow; g.fillRect(0, 0, s, s);
    g.beginPath(); g.arc(c, c, s * 0.36, 0, Math.PI * 2); g.fillStyle = look.rim; g.fill();
    g.beginPath(); g.arc(c, c, s * (era === 'modern' ? 0.24 : 0.3), 0, Math.PI * 2); g.fillStyle = look.face; g.fill();
    g.strokeStyle = look.ink; g.fillStyle = look.ink; g.lineWidth = s * 0.025;
    if (era === 'ancient') {
      // pomegranate
      g.beginPath(); g.arc(c, c + s * 0.03, s * 0.11, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(c - s * 0.06, c - s * 0.08); g.lineTo(c, c - s * 0.16); g.lineTo(c + s * 0.06, c - s * 0.08); g.stroke();
    } else if (era === 'temple') {
      // chalice
      g.beginPath(); g.moveTo(c - s * 0.1, c - s * 0.12); g.quadraticCurveTo(c, c + s * 0.06, c + s * 0.1, c - s * 0.12); g.stroke();
      g.beginPath(); g.moveTo(c, c - s * 0.02); g.lineTo(c, c + s * 0.1); g.moveTo(c - s * 0.07, c + s * 0.12); g.lineTo(c + s * 0.07, c + s * 0.12); g.stroke();
    } else {
      g.font = `bold ${Math.round(s * 0.2)}px Rubik, Arial, sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(look.label, c, c + s * 0.01);
    }
  });
  return coinCache[era];
}

const letterCache = new Map();
export function letterTexture(ch) {
  if (letterCache.has(ch)) return letterCache.get(ch);
  const t = canvasTex(256, (g, s) => {
    medallion(g, s, '#f0b93a', '#fbf1d6');
    g.fillStyle = '#1b1830';
    g.font = `${Math.round(s * 0.4)}px ${DISPLAY_FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.direction = 'rtl';
    g.fillText(ch, s / 2, s * 0.53);
  });
  letterCache.set(ch, t);
  return t;
}

// A stone tablet with a commandment's Hebrew number, for the Ten Commandments pickups.
const tabletCache = new Map();
export function tabletTexture(num) {
  if (tabletCache.has(num)) return tabletCache.get(num);
  const t = canvasTex(256, (g, s) => {
    const w = s * 0.62, h = s * 0.8, x = (s - w) / 2, y = s * 0.12, r = w / 2;
    const shape = () => { g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w, y + h); g.closePath(); };
    g.shadowColor = 'rgba(255, 215, 120, 0.95)'; g.shadowBlur = s * 0.08;
    shape(); g.fillStyle = '#c9c1b2'; g.fill();
    g.shadowBlur = 0;
    g.lineWidth = s * 0.03; g.strokeStyle = '#7b7062'; g.stroke();
    g.strokeStyle = 'rgba(90, 80, 68, 0.35)'; g.lineWidth = s * 0.012;
    for (let k = 0; k < 3; k++) { const ly = y + h * 0.72 + k * s * 0.05; g.beginPath(); g.moveTo(x + w * 0.18, ly); g.lineTo(x + w * 0.82, ly); g.stroke(); }
    g.fillStyle = '#2a2236';
    g.font = `${Math.round(s * 0.34)}px ${DISPLAY_FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl';
    g.fillText(num, s / 2, y + h * 0.43);
  });
  tabletCache.set(num, t);
  return t;
}

// Power-up icons, drawn as simple shapes on a gold medallion.
export function powerTexture(type) {
  return canvasTex(256, (g, s) => {
    const c = s / 2;
    medallion(g, s, type === 'heart' ? '#f06d5f' : '#f0b93a', '#fbf1d6');
    g.lineCap = 'round'; g.lineJoin = 'round';
    if (type === 'shield') {
      g.strokeStyle = '#2c6fd6'; g.lineWidth = s * 0.035;
      for (const start of [-Math.PI / 2, Math.PI / 2]) {
        g.beginPath();
        for (let k = 0; k < 3; k++) {
          const a = start + (k * Math.PI * 2) / 3;
          const x = c + Math.cos(a) * s * 0.21, y = c + Math.sin(a) * s * 0.21;
          if (k === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.closePath(); g.stroke();
      }
    } else if (type === 'sneakers') {
      // A blue-and-white sneaker with a small Star of David.
      g.fillStyle = '#2c6fd6';
      g.beginPath(); g.moveTo(c - s * 0.2, c + s * 0.08); g.lineTo(c - s * 0.2, c - s * 0.1); g.lineTo(c - s * 0.05, c - s * 0.12);
      g.lineTo(c + s * 0.02, c - s * 0.02); g.lineTo(c + s * 0.2, c + s * 0.02); g.lineTo(c + s * 0.21, c + s * 0.08); g.closePath(); g.fill();
      g.fillStyle = '#ffffff'; g.fillRect(c - s * 0.21, c + s * 0.08, s * 0.43, s * 0.06);
      g.strokeStyle = '#ffffff'; g.lineWidth = s * 0.012;
      for (const st of [-Math.PI / 2, Math.PI / 2]) {
        g.beginPath();
        for (let k = 0; k < 3; k++) { const a = st + (k * Math.PI * 2) / 3; const x = c - s * 0.1 + Math.cos(a) * s * 0.045, y = c - s * 0.03 + Math.sin(a) * s * 0.045; if (k) g.lineTo(x, y); else g.moveTo(x, y); }
        g.closePath(); g.stroke();
      }
      g.strokeStyle = '#ffd24a'; g.lineWidth = s * 0.02;
      for (const dy of [-0.16, -0.21]) { g.beginPath(); g.moveTo(c - s * 0.05, c + dy * s); g.lineTo(c + s * 0.12, c + dy * s - s * 0.02); g.stroke(); }
    } else if (type === 'shabbat') {
      // Two Shabbat candles.
      for (const x of [-0.07, 0.07]) {
        g.fillStyle = '#f6f0dc'; g.fillRect(c + x * s - s * 0.03, c - s * 0.06, s * 0.06, s * 0.22);
        g.fillStyle = '#ffb02e'; g.beginPath(); g.ellipse(c + x * s, c - s * 0.11, s * 0.025, s * 0.05, 0, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = '#c99a5b'; g.fillRect(c - s * 0.15, c + s * 0.16, s * 0.3, s * 0.04);
    } else if (type === 'jetpack') {
      g.fillStyle = '#ffb347';
      for (const x of [-0.07, 0.07]) { g.beginPath(); g.moveTo(c + x * s - s * 0.04, c + s * 0.1); g.lineTo(c + x * s, c + s * 0.24); g.lineTo(c + x * s + s * 0.04, c + s * 0.1); g.fill(); }
      g.fillStyle = '#9aa3ad';
      for (const x of [-0.07, 0.07]) g.fillRect(c + x * s - s * 0.045, c - s * 0.14, s * 0.09, s * 0.25);
      g.fillStyle = '#d8402f';
      for (const x of [-0.07, 0.07]) { g.beginPath(); g.moveTo(c + x * s - s * 0.045, c - s * 0.14); g.lineTo(c + x * s, c - s * 0.21); g.lineTo(c + x * s + s * 0.045, c - s * 0.14); g.fill(); }
    } else if (type === 'magnet') {
      g.lineWidth = s * 0.085; g.strokeStyle = '#d8402f';
      g.beginPath(); g.arc(c, c + s * 0.0, s * 0.12, Math.PI, 0, true); g.stroke();
      g.beginPath(); g.moveTo(c - s * 0.12, c); g.lineTo(c - s * 0.12, c - s * 0.13);
      g.moveTo(c + s * 0.12, c); g.lineTo(c + s * 0.12, c - s * 0.13); g.stroke();
      g.strokeStyle = '#d9dde3'; g.lineCap = 'butt';
      g.beginPath(); g.moveTo(c - s * 0.12, c - s * 0.13); g.lineTo(c - s * 0.12, c - s * 0.2);
      g.moveTo(c + s * 0.12, c - s * 0.13); g.lineTo(c + s * 0.12, c - s * 0.2); g.stroke();
    } else if (type === 'double') {
      g.fillStyle = '#2c4ea3';
      g.font = `${Math.round(s * 0.26)}px ${DISPLAY_FONT}`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('×2', c, c + s * 0.02);
    } else if (type === 'shofar') {
      g.strokeStyle = '#8a5a2b'; g.lineWidth = s * 0.07;
      g.beginPath(); g.moveTo(c - s * 0.17, c + s * 0.12);
      g.quadraticCurveTo(c - s * 0.02, c + s * 0.14, c + s * 0.08, c - s * 0.02);
      g.stroke();
      g.strokeStyle = '#c99a5b'; g.lineWidth = s * 0.12;
      g.beginPath(); g.moveTo(c + s * 0.06, c + s * 0.01);
      g.quadraticCurveTo(c + s * 0.13, c - s * 0.08, c + s * 0.12, c - s * 0.18); g.stroke();
      g.fillStyle = '#5e3a1a';
      g.beginPath(); g.ellipse(c + s * 0.12, c - s * 0.19, s * 0.07, s * 0.035, -0.2, 0, Math.PI * 2); g.fill();
    } else if (type === 'heart') {
      g.fillStyle = '#e2483d';
      g.beginPath();
      g.moveTo(c, c + s * 0.17);
      g.bezierCurveTo(c - s * 0.3, c - s * 0.02, c - s * 0.14, c - s * 0.24, c, c - s * 0.09);
      g.bezierCurveTo(c + s * 0.14, c - s * 0.24, c + s * 0.3, c - s * 0.02, c, c + s * 0.17);
      g.fill();
    }
  });
}
