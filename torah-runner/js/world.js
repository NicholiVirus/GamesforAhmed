// The environment: renderer, sky, light, scrolling ground, the parted sea, distant landmarks,
// roadside props and particle effects. Gameplay objects live in main.js.
import * as THREE from './three.js';
import { BIOMES, BIOME_LEN, ROUTE, routeStart } from './data.js';
import { part, merge, jagged, ICO, softDot } from './models.js';
import { pickScenery, sceneryGeo } from './scenery.js';
import { flatMat } from './models.js';

const idOf = (id) => BIOMES.findIndex((b) => b.id === id);
const ROUTE_IDX = ROUTE.map(idOf);
const routeAt = (wz) => Math.max(0, Math.min(ROUTE.length - 1, Math.floor(wz / BIOME_LEN)));
// Places where the water stands up in walls on both sides, and how tall the walls are.
const WALLS = { sea: { h: 13, x: 4.7 }, jordan: { h: 7, x: 13 } };
const rnd = (a, b) => a + Math.random() * (b - a);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const biomeIndexAt = (wz) => ROUTE_IDX[routeAt(wz)];

function tex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function sandTexture() {
  return tex(256, 256, (g, w, h) => {
    g.fillStyle = '#f3eee6'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const v = 200 + Math.random() * 55;
      g.fillStyle = `rgba(${v - 30},${v - 40},${v - 55},0.35)`;
      g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }
    g.strokeStyle = 'rgba(150,120,80,0.16)'; g.lineWidth = 2;
    for (let y = 8; y < h; y += 18) {
      g.beginPath();
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 4 + y) * 4);
      g.stroke();
    }
  });
}

function roadTexture() {
  return tex(256, 256, (g, w, h) => {
    g.fillStyle = '#9c9286'; g.fillRect(0, 0, w, h);
    const rows = 5, rh = h / rows;
    for (let r = 0; r < rows; r++) {
      let x = 10 + (r % 2) * 14;
      while (x < w - 10) {
        const sw = Math.min(w - 10 - x, 26 + Math.random() * 30);
        const v = 222 + Math.random() * 30;
        g.fillStyle = `rgb(${v},${v - 6},${v - 16})`;
        g.fillRect(x + 1.5, r * rh + 1.5, sw - 3, rh - 3);
        g.fillStyle = 'rgba(255,255,255,0.18)';
        g.fillRect(x + 1.5, r * rh + 1.5, sw - 3, 3);
        x += sw;
      }
    }
    g.fillStyle = '#857a6c';
    g.fillRect(0, 0, 10, h); g.fillRect(w - 10, 0, 10, h);
    g.fillStyle = 'rgba(70,55,40,0.32)';
    for (let y = 0; y < h; y += 24) { g.fillRect(88, y, 3, 14); g.fillRect(165, y, 3, 14); }
  });
}

function waterTexture() {
  return tex(256, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#f2fdff');
    gr.addColorStop(0.04, '#9fe6ef');
    gr.addColorStop(0.25, '#3cb5d2');
    gr.addColorStop(0.6, '#1a7fa6');
    gr.addColorStop(1, '#0b3d63');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.22)'; g.lineWidth = 3;
    for (let y = 30; y < h; y += 26) {
      g.beginPath();
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 6 + y * 0.3) * 5);
      g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 70; i++) {
      g.beginPath(); g.arc(Math.random() * w, 40 + Math.random() * (h - 40), 1 + Math.random() * 3, 0, Math.PI * 2); g.fill();
    }
  });
}

// A pool of camera-facing sprites drawn as one Points object, with per-point colour and alpha.
export class PointPool {
  constructor(scene, cap, size, map, additive = false) {
    this.cap = cap;
    this.pos = new Float32Array(cap * 3).fill(-9999);
    this.col = new Float32Array(cap * 4).fill(1);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 4));
    this.mat = new THREE.PointsMaterial({
      size, map, vertexColors: true, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }
  set(i, x, y, z, r = 1, g = 1, b = 1, a = 1) {
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.col[i * 4] = r; this.col[i * 4 + 1] = g; this.col[i * 4 + 2] = b; this.col[i * 4 + 3] = a;
  }
  hide(i) { this.pos[i * 3 + 1] = -9999; }
  flush() {
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }
}

export class World {
  constructor(canvas) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: this.dpr < 1.5, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(this.dpr);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 900);
    this.camDist = 7;
    this.scene.fog = new THREE.Fog(0xffffff, 50, 150);
    this.time = 0;
    this.flash = 0;
    this.nextBolt = 3;

    this.pal = BIOMES.map((b) => {
      const o = {};
      for (const k of ['skyTop', 'skyHorizon', 'skyBottom', 'fog', 'ground', 'road', 'sun', 'hemiSky', 'hemiGround', 'light']) o[k] = new THREE.Color(b[k]);
      o.sunDir = new THREE.Vector3(...b.sunDir).normalize();
      o.lightI = b.lightI; o.hemiI = b.hemiI; o.stars = b.stars;
      return o;
    });
    this.cur = {};
    for (const k in this.pal[0]) this.cur[k] = this.pal[0][k].clone ? this.pal[0][k].clone() : this.pal[0][k];

    this.hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1.2);
    this.sun = new THREE.DirectionalLight(0xffffff, 2);
    this.sun.position.set(-18, 34, 22);
    this.scene.add(this.hemi, this.sun);

    this.buildSky();
    this.buildGround();
    this.buildSea();
    this.buildBackdrops();
    this.fxSpark = new PointPool(this.scene, 260, 0.32, softDot());
    this.fxDust = new PointPool(this.scene, 160, 1.1, softDot());
    this.particles = [];
    this.props = [];
    this.pools = {};
    this.propCursor = -20;
    this.propBack = -20;
    this.propMinX = 0;
    this.propsOn = true;
    this.scrollPos = 0;
    this.lastDist = 0;
    this.scrollCap = Infinity;
    this.weights = BIOMES.map((_, i) => (i === 0 ? 1 : 0));
    this.sinaiIdx = BIOMES.findIndex((b) => b.id === 'sinai');
  }

  buildSky() {
    this.skyU = {
      top: { value: new THREE.Color() }, horizon: { value: new THREE.Color() }, bottom: { value: new THREE.Color() },
      sunColor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 0.3, -1) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.skyU, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: `varying vec3 vDir;
        void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vDir = wp.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunColor; uniform vec3 sunDir;
        varying vec3 vDir;
        void main(){ vec3 d = normalize(vDir); float h = d.y;
          vec3 col = h > 0.0 ? mix(horizon, top, pow(smoothstep(0.0, 0.6, h), 0.75)) : mix(horizon, bottom, smoothstep(0.0, 0.1, -h));
          float s = max(dot(d, normalize(sunDir)), 0.0);
          col += sunColor * (smoothstep(0.9985, 0.9992, s) * 1.2 + pow(s, 14.0) * 0.32);
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), mat);
    this.sky.renderOrder = -10;
    this.scene.add(this.sky);

    const n = 600, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, y = 0.08 + Math.random() * 0.92, r = Math.sqrt(1 - y * y);
      p[i * 3] = Math.cos(a) * r * 550; p[i * 3 + 1] = y * 550; p[i * 3 + 2] = Math.sin(a) * r * 550;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(p, 3));
    this.starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
    this.stars = new THREE.Points(sg, this.starMat);
    this.stars.renderOrder = -9;
    this.scene.add(this.stars);
  }

  buildGround() {
    const aniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    this.sandTex = sandTexture(); this.sandTex.repeat.set(40, 380 / 11); this.sandTex.anisotropy = aniso;
    this.groundMat = new THREE.MeshLambertMaterial({ map: this.sandTex });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 380), this.groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.02, -125);
    this.scene.add(ground);

    this.roadTex = roadTexture(); this.roadTex.repeat.set(1, 380 / 6.6); this.roadTex.anisotropy = aniso;
    this.roadMat = new THREE.MeshLambertMaterial({ map: this.roadTex });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 380), this.roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -125);
    this.scene.add(road);

    this.curbMat = new THREE.MeshLambertMaterial({ color: 0x8a7a66 });
    for (const sx of [-1, 1]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 380), this.curbMat);
      curb.position.set(sx * 3.4, 0.07, -125);
      this.scene.add(curb);
    }
  }

  buildSea() {
    const base = waterTexture();
    this.seaWalls = [];
    for (const sx of [-1, 1]) {
      const t = base.clone(); t.needsUpdate = true;
      const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false });
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(1, 13), mat);
      inner.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
      inner.position.set(sx * 4.7, 6.5, 0);
      const cap = new THREE.Mesh(new THREE.PlaneGeometry(6, 13), mat);
      cap.position.set(sx * 7.7, 6.5, 0);
      const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 13), new THREE.MeshBasicMaterial({ color: 0x0c3a5c }));
      back.rotation.y = inner.rotation.y;
      back.position.set(sx * 10.7, 6.5, 0);
      this.scene.add(inner, cap, back);
      this.seaWalls.push({ sx, inner, cap, back, tex: t });
    }
    const fishGeo = merge([
      part(ICO, 0x123a5a, [0, 0, 0], [0, 0, 0], [0.18, 0.12, 0.42]),
      part(new THREE.ConeGeometry(0.14, 0.24, 4), 0x123a5a, [0, 0, 0.45], [-Math.PI / 2, 0, 0]),
    ]);
    const fishMat = new THREE.MeshBasicMaterial({ vertexColors: true });
    this.fish = [];
    for (let i = 0; i < 26; i++) {
      const m = new THREE.Mesh(fishGeo, fishMat);
      m.visible = false;
      this.scene.add(m);
      this.fish.push({ m, side: i % 2 ? 1 : -1, x: rnd(5.4, 9.6), y: rnd(1.2, 10), off: rnd(-20, 200), v: rnd(1, 4), ph: rnd(0, 6) });
    }
  }

  buildBackdrops() {
    const mk = () => new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, fog: false, transparent: true, opacity: 0 });
    this.backdrops = [];
    // Egypt: the great pyramids on the horizon.
    const egypt = new THREE.Group();
    const pyr = merge([part(new THREE.ConeGeometry(40, 34, 4), 0xe9c99a, [0, 17, 0], [0, Math.PI / 4, 0], [1, 1, 1], 0.02)]);
    const pm = mk();
    [[-95, -300, 1], [-35, -380, 1.3], [120, -330, 0.9], [60, -420, 0.7]].forEach(([x, z, s]) => {
      const m = new THREE.Mesh(pyr, pm); m.position.set(x, 0, z); m.scale.setScalar(s); egypt.add(m);
    });
    this.backdrops.push({ group: egypt, mats: [pm] });
    // Sea: nothing far away, the walls fill the view.
    this.backdrops.push({ group: new THREE.Group(), mats: [] });
    // Elim: green hills and a grove of tall palms on the horizon.
    const elim = new THREE.Group();
    const em = mk();
    const hill = merge([part(new THREE.SphereGeometry(1, 10, 6), 0x9fb86a, [0, 0, 0], [0, 0, 0], [40, 16, 30], 0.04)]);
    [[-110, -340, 1], [-40, -420, 1.3], [120, -360, 1.1], [190, -300, 0.8]].forEach(([x, z, k]) => {
      const m = new THREE.Mesh(hill, em); m.position.set(x, 0, z); m.scale.setScalar(k); elim.add(m);
    });
    const grovePalm = merge([
      part(new THREE.CylinderGeometry(0.6, 0.9, 20, 6), 0x7a5a3a, [0, 10, 0]),
      ...Array.from({ length: 8 }, (_, k) => part(new THREE.BoxGeometry(9, 0.3, 1.6), 0x4f8f3a,
        [Math.cos((k / 8) * Math.PI * 2) * 4, 19.5, Math.sin((k / 8) * Math.PI * 2) * 4], [0, -(k / 8) * Math.PI * 2, -0.45])),
    ]);
    for (let k = 0; k < 9; k++) {
      const m = new THREE.Mesh(grovePalm, em);
      m.position.set(-90 + k * 22 + rnd(-6, 6), 0, -300 - rnd(0, 60));
      m.scale.setScalar(rnd(0.8, 1.2));
      elim.add(m);
    }
    // God's covenant rainbow after the flood (Genesis 9:13) arching over the oasis.
    const bowMat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, transparent: true, opacity: 0, depthWrite: false });
    const bow = new THREE.Mesh(merge([0xe2483d, 0xff9a3c, 0xffd24a, 0x3fae5a, 0x2c6fd6, 0x7a4a9a].map((c, k) =>
      part(new THREE.TorusGeometry(120 - k * 5, 2.5, 4, 40, Math.PI), c, [0, 0, 0], [0, 0, 0], [1, 1, 1], 0))), bowMat);
    bow.position.set(40, -10, -420);
    elim.add(bow);
    this.backdrops.push({ group: elim, mats: [em, bowMat] });
    // Wilderness: mesas and the pillar of cloud.
    const wild = new THREE.Group();
    const mm = mk();
    const mesa = merge([part(new THREE.CylinderGeometry(26, 34, 22, 7), 0xd9a978, [0, 11, 0], [0, 0, 0], [1, 1, 1], 0.03)]);
    [[-120, -330, 1], [-60, -400, 0.7], [110, -360, 1.2], [180, -300, 0.8]].forEach(([x, z, s]) => {
      const m = new THREE.Mesh(mesa, mm); m.position.set(x, 0, z); m.scale.set(s, s * rnd(0.7, 1.1), s); wild.add(m);
    });
    const cm = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x8a8a8a, flatShading: true, fog: false, transparent: true, opacity: 0 });
    const pillar = new THREE.Group();
    const puff = new THREE.IcosahedronGeometry(1, 1);
    for (let i = 0; i < 26; i++) {
      const m = new THREE.Mesh(puff, cm);
      const y = i * 5.2, r = 9 + Math.sin(i * 0.7) * 2.5;
      m.position.set(Math.cos(i * 1.9) * 3, y, Math.sin(i * 1.9) * 3);
      m.scale.setScalar(r);
      pillar.add(m);
    }
    pillar.position.set(-75, 0, -380);
    wild.add(pillar);
    this.pillar = pillar;
    this.backdrops.push({ group: wild, mats: [mm, cm] });
    // Night camp: dark mesas and the pillar of fire.
    const night = new THREE.Group();
    const nm = mk();
    [[-130, -330, 1], [-50, -410, 0.8], [120, -350, 1.1]].forEach(([x, z, k]) => {
      const m = new THREE.Mesh(mesa, nm); m.position.set(x, 0, z); m.scale.setScalar(k); night.add(m);
    });
    const fm = new THREE.MeshLambertMaterial({ color: 0xffa040, emissive: 0xff6a10, flatShading: true, fog: false, transparent: true, opacity: 0 });
    const fire = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const m = new THREE.Mesh(puff, fm);
      m.position.set(Math.cos(i * 1.7) * 3, i * 5.4, Math.sin(i * 1.7) * 3);
      m.scale.setScalar(8 + Math.sin(i * 0.9) * 2.2);
      fire.add(m);
    }
    fire.position.set(60, 0, -390);
    night.add(fire);
    this.firePillar = fire;
    this.fireGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: 0xff8a3a, transparent: true, opacity: 0, fog: false, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.fireGlow.scale.set(120, 220, 1);
    this.fireGlow.position.set(60, 70, -395);
    night.add(this.fireGlow);
    this.backdrops.push({ group: night, mats: [nm, fm] });
    // Sinai: the mountain wrapped in cloud, with fire at the summit.
    const sinai = new THREE.Group();
    const mtn = new THREE.ConeGeometry(120, 130, 9, 4);
    const mp = mtn.attributes.position;
    for (let i = 0; i < mp.count; i++) {
      const y = mp.getY(i);
      if (y < 64) {
        const k = 1 + Math.sin(i * 12.9898) * 0.12;
        mp.setXYZ(i, mp.getX(i) * k, y + Math.sin(i * 4.1) * 5, mp.getZ(i) * k);
      }
    }
    mtn.computeVertexNormals();
    const sm = mk();
    const mountain = new THREE.Mesh(merge([part(mtn, 0x5a4048, [0, 65, 0], [0, 0, 0], [1, 1, 1], 0.06)]), sm);
    mountain.position.set(0, 0, -430);
    sinai.add(mountain);
    const sc = new THREE.MeshLambertMaterial({ color: 0x5b5560, flatShading: true, fog: false, transparent: true, opacity: 0 });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const m = new THREE.Mesh(puff, sc);
      m.position.set(Math.cos(a) * 32, 112 + Math.sin(i * 2.3) * 6, Math.sin(a) * 18);
      m.scale.set(18, 8, 14);
      mountain.add(m);
    }
    this.glowMat = new THREE.SpriteMaterial({ map: softDot(), color: 0xff8a3a, transparent: true, opacity: 0, fog: false, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Sprite(this.glowMat);
    glow.scale.set(130, 90, 1);
    glow.position.set(0, 128, 0);
    mountain.add(glow);
    // The two tablets of the covenant shining near the summit (Exodus 31:18).
    const tab = new THREE.Mesh(merge([
      part(new THREE.BoxGeometry(1, 1, 1), 0xd8d0c0, [-7, 0, 0], [0, 0, 0], [12, 16, 2]),
      part(new THREE.BoxGeometry(1, 1, 1), 0xd8d0c0, [7, 0, 0], [0, 0, 0], [12, 16, 2]),
      part(new THREE.CylinderGeometry(6, 6, 2, 12, 1, false, 0, Math.PI), 0xd8d0c0, [-7, 8, 0], [Math.PI / 2, 0, Math.PI / 2]),
      part(new THREE.CylinderGeometry(6, 6, 2, 12, 1, false, 0, Math.PI), 0xd8d0c0, [7, 8, 0], [Math.PI / 2, 0, Math.PI / 2]),
      ...[-11, -7, -3, 3, 7, 11].flatMap((x) => [-4, 0, 4].map((y) => part(new THREE.BoxGeometry(1, 1, 1), 0x5a4a3a, [x, y, 1.05], [0, 0, 0], [2.4, 0.8, 0.2]))),
    ]), this.tabMat = mk());
    tab.position.set(0, 150, 30);
    mountain.add(tab);
    const bolt = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0 }));
    sinai.add(bolt);
    this.bolt = bolt;
    this.mountain = mountain;
    this.backdrops.push({ group: sinai, mats: [sm, sc, this.tabMat] });
    // Jerusalem: golden stone city walls with towers and gates on the hills.
    const jlm = new THREE.Group();
    const jm = mk();
    const stone = 0xe8d2a2, stone2 = 0xd8bd88;
    const parts = [part(new THREE.SphereGeometry(1, 12, 6), 0xc9b07c, [0, -6, 0], [0, 0, 0], [260, 22, 60], 0.03)];
    parts.push(part(new THREE.BoxGeometry(1, 1, 1), stone, [0, 14, 0], [0, 0, 0], [300, 20, 6], 0.03));
    for (let x = -150; x <= 150; x += 6) parts.push(part(new THREE.BoxGeometry(1, 1, 1), stone2, [x, 25, 0], [0, 0, 0], [3, 2.5, 6.4], 0.03));
    for (const x of [-140, -95, -45, 0, 45, 95, 140]) {
      parts.push(part(new THREE.BoxGeometry(1, 1, 1), stone, [x, 18, 0], [0, 0, 0], [14, 30, 10], 0.03));
      for (const dx of [-5, 0, 5]) parts.push(part(new THREE.BoxGeometry(1, 1, 1), stone2, [x + dx, 34.5, 0], [0, 0, 0], [2.6, 3, 10.4], 0.03));
    }
    parts.push(part(new THREE.BoxGeometry(1, 1, 1), 0x6b4a2a, [0, 9, 3.2], [0, 0, 0], [10, 14, 0.5], 0.02));
    for (let k = 0; k < 16; k++) {
      const x = -130 + k * 17, h = 10 + (k % 3) * 4;
      parts.push(part(new THREE.BoxGeometry(1, 1, 1), k % 2 ? stone : 0xf0dcb0, [x, 24 + h / 2, -25 - (k % 4) * 8], [0, 0, 0], [12, h, 12], 0.03));
    }
    const city = new THREE.Mesh(merge(parts), jm);
    city.position.set(0, 0, -360);
    jlm.add(city);
    this.backdrops.push({ group: jlm, mats: [jm] });
    const cube = new THREE.BoxGeometry(1, 1, 1);
    const skyline = (count, minH, maxH, colors, spread, z) => {
      const P = [];
      for (let k = 0; k < count; k++) {
        const x = -spread + (k / count) * spread * 2 + rnd(-6, 6), h = rnd(minH, maxH), w = rnd(10, 22);
        P.push(part(cube, colors[k % colors.length], [x, h / 2, z - rnd(0, 60)], [0, 0, 0], [w, h, w], 0.04));
      }
      return P;
    };
    // Tel Aviv: white towers along the sea.
    const ta = new THREE.Group(), tm = mk();
    ta.add(new THREE.Mesh(merge([
      ...skyline(14, 15, 60, [0xf4f1ea, 0xe8ecef, 0xdfe6ea], 200, -340),
      part(cube, 0x3a8fc8, [-250, 0.5, -300], [0, 0, 0], [200, 1, 400], 0.02),
    ]), tm));
    this.backdrops.push({ group: ta, mats: [tm] });
    // Airport: a plane climbing over the hills.
    const ap = new THREE.Group(), am = mk();
    ap.add(new THREE.Mesh(merge(skyline(8, 6, 14, [0xd8dde2, 0xc8ced4], 220, -360)), am));
    const jet = new THREE.Mesh(merge([
      part(new THREE.CylinderGeometry(2, 2, 26, 10), 0xffffff, [0, 0, 0], [Math.PI / 2, 0, 0]),
      part(cube, 0xffffff, [0, 0, 2], [0, 0, 0], [30, 0.6, 5]),
      part(cube, 0x2c4ea3, [0, 4, -11], [0, 0, 0], [0.6, 7, 4]),
    ]), am);
    jet.position.set(-60, 60, -300);
    jet.rotation.set(-0.25, 0.6, 0);
    ap.add(jet);
    this.jetPlane = jet;
    this.backdrops.push({ group: ap, mats: [am] });
    // New York: a dense skyline with a spire.
    const ny = new THREE.Group(), nm2 = mk();
    ny.add(new THREE.Mesh(merge([
      ...skyline(26, 30, 140, [0x4a5a70, 0x6a7a8c, 0x8a8478, 0x5a6478], 260, -330),
      part(cube, 0x9aa0a8, [20, 110, -360], [0, 0, 0], [24, 220, 24], 0.03),
      part(cube, 0x9aa0a8, [20, 232, -360], [0, 0, 0], [10, 24, 10], 0.03),
      part(cube, 0xdddddd, [20, 262, -360], [0, 0, 0], [1.5, 36, 1.5], 0.03),
    ]), nm2));
    this.backdrops.push({ group: ny, mats: [nm2] });
    // Donut shop: underground, nothing on the horizon.
    this.backdrops.push({ group: new THREE.Group(), mats: [] });
    // Central Park: the city skyline beyond the trees.
    const pk = new THREE.Group(), pkm = mk();
    pk.add(new THREE.Mesh(merge(skyline(20, 30, 110, [0x7a8a9c, 0x8a8478, 0x6a7a8c], 260, -360)), pkm));
    this.backdrops.push({ group: pk, mats: [pkm] });
    // Liberty Harbor: water to the horizon and the lady with the torch.
    const hb = new THREE.Group(), hbm = mk();
    hb.add(new THREE.Mesh(merge([
      part(cube, 0x3a6a9a, [0, 0.4, -250], [0, 0, 0], [800, 0.8, 300], 0.02),
      part(cube, 0xa89878, [60, 15, -330], [0, 0, 0], [30, 30, 30], 0.02),
      part(new THREE.CylinderGeometry(5, 8, 40, 8), 0x6fb8a0, [60, 50, -330]),
      part(new THREE.IcosahedronGeometry(5, 0), 0x6fb8a0, [60, 74, -330]),
      part(cube, 0x6fb8a0, [66, 82, -330], [0, 0, -0.15], [2.5, 22, 2.5]),
      part(new THREE.ConeGeometry(3, 6, 6), 0xffc23a, [68, 95, -330]),
    ]), hbm));
    this.backdrops.push({ group: hb, mats: [hbm] });

    // ---- Backdrops for the Torah places (same order as in BIOMES).
    const cyl = (rt, rb, h, seg = 10) => new THREE.CylinderGeometry(rt, rb, h, seg);
    const add = (group, parts, mat) => group.add(new THREE.Mesh(merge(parts), mat));
    // Ararat: twin snowy peaks with the ark resting on top, a rainbow and the dove.
    const ar = new THREE.Group(), arm = mk();
    add(ar, [
      part(new THREE.ConeGeometry(90, 120, 9), 0x8a8478, [-40, 60, -420]), part(new THREE.ConeGeometry(28, 30, 9), 0xf4f6f8, [-40, 106, -420]),
      part(new THREE.ConeGeometry(55, 70, 9), 0x9a9488, [90, 35, -380]), part(new THREE.ConeGeometry(16, 18, 9), 0xf4f6f8, [90, 62, -380]),
      part(cube, 0x6a4428, [-40, 124, -400], [0, 0.3, 0], [26, 8, 9]), part(cube, 0x7a5030, [-40, 130, -400], [0, 0.3, 0], [16, 5, 7]),
    ], arm);
    const arBow = new THREE.Mesh(merge([0xe2483d, 0xff9a3c, 0xffd24a, 0x3fae5a, 0x2c6fd6, 0x7a4a9a].map((c, k) =>
      part(new THREE.TorusGeometry(160 - k * 6, 3, 4, 40, Math.PI), c, [0, 0, 0], [0, 0, 0], [1, 1, 1], 0))), bowMat.clone());
    arBow.position.set(20, -10, -440);
    ar.add(arBow);
    this.dove = new THREE.Mesh(merge([part(new THREE.IcosahedronGeometry(1, 0), 0xffffff, [0, 0, 0], [0, 0, 0], [3, 2, 4]),
      part(cube, 0xffffff, [-4, 0.5, 0], [0, 0, 0.3], [6, 0.4, 3]), part(cube, 0xffffff, [4, 0.5, 0], [0, 0, -0.3], [6, 0.4, 3]),
      part(cube, 0x5a8a3a, [0, 0, 4], [0, 0, 0], [0.6, 0.6, 2.5])]), arm);
    this.dove.position.set(0, 80, -300);
    ar.add(this.dove);
    this.backdrops.push({ group: ar, mats: [arm, arBow.material] });
    // Babel: a stepped tower climbing into the clouds, with ramps and scaffolds.
    const bb = new THREE.Group(), bbm = mk();
    const tower = [];
    for (let t = 0; t < 8; t++) {
      const w = 110 - t * 12;
      tower.push(part(cube, [0xc47a44, 0xb8683a, 0xa95c30][t % 3], [0, 9 + t * 18, -400], [0, 0, 0], [w, 18, w]));
      tower.push(part(cube, 0x9a5a30, [w / 2 - 6, 9 + t * 18, -400 + w / 2 - 2], [0.5, 0, 0], [10, 2, 30]));
    }
    for (let k = 0; k < 6; k++) tower.push(part(cube, 0x7a4a24, [-30 + k * 12, 150, -360], [0, 0, 0], [1.2, 30, 1.2]));
    for (let k = 0; k < 8; k++) tower.push(part(new THREE.IcosahedronGeometry(1, 1), 0xf4f4f4, [-40 + k * 12, 160 + (k % 3) * 6, -400], [0, 0, 0], [16, 8, 14]));
    add(bb, [...tower, ...skyline(10, 6, 14, [0xd8a878, 0xc89868], 220, -330)], bbm);
    this.backdrops.push({ group: bb, mats: [bbm] });
    // Jacob: a ladder of light from the hills up into the sky.
    const jc = new THREE.Group(), jcm = mk();
    const lad = [];
    for (const x of [-8, 8]) lad.push(part(cube, 0xfff2c8, [x, 110, -380], [0.15, 0, 0], [2, 240, 2]));
    for (let k = 0; k < 26; k++) lad.push(part(cube, 0xfff2c8, [0, 6 + k * 9, -380 - k * 1.3], [0, 0, 0], [16, 1.2, 1.2]));
    add(jc, [...lad, part(new THREE.SphereGeometry(1, 10, 6), 0xb8b070, [-100, -6, -360], [0, 0, 0], [140, 30, 50]),
      part(new THREE.SphereGeometry(1, 10, 6), 0xa8a060, [120, -6, -380], [0, 0, 0], [150, 36, 60])], jcm);
    this.ladderLights = [];
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff8dc, transparent: true, opacity: 0, fog: false });
    for (let k = 0; k < 10; k++) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 1), lightMat);
      m.userData.ph = k / 10;
      jc.add(m);
      this.ladderLights.push(m);
    }
    this.backdrops.push({ group: jc, mats: [jcm, lightMat] });
    // Rephidim: the hill with a stone and a staff held high, banners and dust.
    const rp = new THREE.Group(), rpm = mk();
    add(rp, [
      part(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xc8a878, [-30, 0, -380], [0, 0, 0], [110, 70, 80]),
      part(new THREE.DodecahedronGeometry(1, 0), 0x9a8a78, [-30, 72, -380], [0, 0, 0], [8, 6, 8]),
      part(cube, 0x6b4a2a, [-24, 92, -380], [0, 0, -0.15], [2, 40, 2]),
      ...[[-160, 0x2c4ea3], [120, 0x6a2a2a], [170, 0x6a2a2a], [-110, 0x2c4ea3]].flatMap(([x, c]) => [part(cube, 0x6b4a2a, [x, 20, -360], [0, 0, 0], [1.5, 40, 1.5]), part(cube, c, [x + 7, 34, -360], [0, 0, 0], [14, 10, 1])]),
      ...skyline(8, 10, 24, [0xd8b880, 0xc8a870], 240, -340),
    ], rpm);
    this.backdrops.push({ group: rp, mats: [rpm] });
    // Jordan: the green hills of Gilead and Jericho's walls far across the river.
    const jd = new THREE.Group(), jdm = mk();
    add(jd, [
      part(new THREE.SphereGeometry(1, 12, 6), 0x8aac68, [-120, -8, -380], [0, 0, 0], [140, 40, 60]),
      part(new THREE.SphereGeometry(1, 12, 6), 0x7a9c58, [130, -8, -400], [0, 0, 0], [160, 46, 70]),
      part(cube, 0xd8c098, [0, 10, -460], [0, 0, 0], [120, 20, 6]),
      ...[-50, -20, 20, 50].map((x) => part(cube, 0xc8b088, [x, 16, -460], [0, 0, 0], [10, 32, 10])),
    ], jdm);
    this.backdrops.push({ group: jd, mats: [jdm] });
    // Jericho: great city walls with towers, broken through in places, and its palm groves.
    const je = new THREE.Group(), jem = mk();
    const wall = [];
    for (let x = -200; x <= 200; x += 25) {
      const broken = Math.abs(x) < 30 || (x > 70 && x < 110);
      if (broken) {
        for (let k = 0; k < 5; k++) wall.push(part(cube, [0xd8c098, 0xc8b088][k % 2], [x + (k - 2) * 4, 3 + (k % 2) * 3, -380 + (k - 2) * 3], [k * 0.2, k * 0.5, 0], [8, 6, 8]));
      } else {
        wall.push(part(cube, 0xd8c098, [x, 14, -380], [0, 0, 0], [25.5, 28, 8]));
        if (x % 50 === 0) wall.push(part(cube, 0xc8b088, [x, 22, -380], [0, 0, 0], [12, 44, 12]));
      }
    }
    add(je, wall, jem);
    this.backdrops.push({ group: je, mats: [jem] });
    // Elah: two hills facing each other, a camp and banners on each (1 Samuel 17:3).
    const el = new THREE.Group(), elm = mk();
    const camp = (x, tent, flag) => {
      const P = [part(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xa8a868, [x, 0, -380], [0, 0, 0], [140, 55, 80])];
      for (let k = 0; k < 7; k++) P.push(part(new THREE.ConeGeometry(6, 8, 4), tent, [x - 45 + k * 15, 46 + Math.sin(k) * 4, -360], [0, Math.PI / 4, 0]));
      P.push(part(cube, 0x6b4a2a, [x, 70, -370], [0, 0, 0], [1.5, 30, 1.5]), part(cube, flag, [x + 8, 80, -370], [0, 0, 0], [15, 9, 1]));
      return P;
    };
    add(el, [...camp(-150, 0x8a2a2a, 0x8a2a2a), ...camp(150, 0xf4f1ea, 0x2c4ea3),
      ...[-60, -20, 25, 70].map((x) => part(new THREE.IcosahedronGeometry(1, 0), 0x5a7a3a, [x, 10, -330], [0, 0, 0], [12, 10, 12]))], elm);
    this.backdrops.push({ group: el, mats: [elm] });
    // ---- Backdrops for the ten newer places (same order as in BIOMES).
    const dome = (r = 1) => new THREE.SphereGeometry(r, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    // Eden: the tree of life towering over green hills, and rivers shining toward the horizon.
    const ed = new THREE.Group(), edm = mk();
    const edP = [
      part(new THREE.SphereGeometry(1, 12, 6), 0x7ac05a, [-130, -8, -380], [0, 0, 0], [150, 40, 60]),
      part(new THREE.SphereGeometry(1, 12, 6), 0x6ab04a, [140, -8, -400], [0, 0, 0], [160, 44, 70]),
      part(cyl(6, 9, 70, 8), 0x7a5a3a, [0, 35, -420]),
      part(new THREE.IcosahedronGeometry(1, 1), 0x3f8f3a, [0, 80, -420], [0, 0, 0], [55, 34, 40]),
      part(new THREE.IcosahedronGeometry(1, 1), 0x5aa040, [-30, 70, -410], [0, 0, 0], [30, 22, 26]),
      part(new THREE.IcosahedronGeometry(1, 1), 0x5aa040, [32, 72, -412], [0, 0, 0], [30, 22, 26]),
    ];
    for (let k = 0; k < 18; k++) edP.push(part(new THREE.IcosahedronGeometry(1, 0), 0xf0b93a, [-45 + rnd(0, 90), 62 + rnd(0, 36), -390], [k, k, 0], [3, 3, 3]));
    for (const a of [-0.5, -0.17, 0.17, 0.5]) edP.push(part(cube, 0x8ad0f0, [Math.sin(a) * 160, 0.6, -260 - Math.cos(a) * 60], [0, a, 0], [8, 0.6, 260], 0.02));
    add(ed, edP, edm);
    this.backdrops.push({ group: ed, mats: [edm] });
    // Beersheba: the open Negev with flat-topped hills, tents and a tamarisk on the skyline.
    const bs = new THREE.Group(), bsm = mk();
    const bsP = [...[[-140, -360, 1], [-60, -420, 0.7], [110, -380, 1.2], [190, -320, 0.8]].map(([x, z, k]) => part(cyl(24 * k, 32 * k, 18 * k, 7), 0xd8b080, [x, 9 * k, z], [0, 0, 0], [1, 1, 1], 0.03))];
    for (let k = 0; k < 6; k++) bsP.push(part(new THREE.ConeGeometry(6, 7, 4), 0x3a2a20, [-60 + k * 18, 3.5, -300], [0, Math.PI / 4, 0]));
    bsP.push(part(cyl(1.5, 2.2, 18, 6), 0x7a5a3a, [40, 9, -320]));
    for (let k = 0; k < 9; k++) bsP.push(part(new THREE.IcosahedronGeometry(1, 0), 0x8aa878, [40 + rnd(-12, 12), 20 + rnd(0, 10), -320 + rnd(-6, 6)], [k, k, 0], [8, 5, 8]));
    add(bs, bsP, bsm);
    this.backdrops.push({ group: bs, mats: [bsm] });
    // Ein Gedi: tall desert cliffs with a waterfall, and the blue Dead Sea below.
    const eg = new THREE.Group(), egm = mk();
    add(eg, [
      part(cube, 0x7ac8d8, [0, 0.4, -300], [0, 0, 0], [900, 0.8, 140], 0.02),
      ...[-220, -120, -20, 80, 180].map((x, k) => part(cube, [0xc8a070, 0xb89060][k % 2], [x, 40 + (k % 2) * 10, -400], [0, 0, 0], [110, 80 + (k % 2) * 20, 40], 0.04)),
      part(cube, 0xbfe8f8, [-20, 45, -378], [0, 0, 0], [8, 90, 2], 0.02),
      part(new THREE.SphereGeometry(1, 10, 6), 0x5a9a3a, [-20, 2, -370], [0, 0, 0], [40, 8, 16]),
    ], egm);
    this.backdrops.push({ group: eg, mats: [egm] });
    // Jonah: open sea, a ship with a white sail, a whale's tail, and Nineveh far across the water.
    const jn = new THREE.Group(), jnm = mk();
    add(jn, [
      part(cube, 0x3a6a9a, [0, 0.4, -250], [0, 0, 0], [900, 0.8, 300], 0.02),
      part(cube, 0x7a4a24, [-80, 6, -320], [0, 0, 0], [40, 10, 12]),
      part(cube, 0x5a3a1c, [-80, 30, -320], [0, 0, 0], [1.5, 40, 1.5]),
      part(cube, 0xf4f1ea, [-79, 32, -320], [0, 0, 0], [1, 28, 22]),
      part(cube, 0x4a6a8a, [70, 10, -300], [0, 0, 0.6], [6, 22, 4]),
      part(cube, 0x4a6a8a, [62, 22, -300], [0, 0, -0.7], [18, 5, 4]),
      part(cube, 0x4a6a8a, [80, 22, -300], [0, 0, 0.7], [18, 5, 4]),
      part(cube, 0xc8a878, [140, 12, -460], [0, 0, 0], [160, 24, 10]),
      ...[90, 120, 150, 180].map((x) => part(cube, 0xb89868, [x, 20, -460], [0, 0, 0], [10, 40, 12])),
    ], jnm);
    this.backdrops.push({ group: jn, mats: [jnm] });
    // Babylon: a great ziggurat, the blue Ishtar gate and terraced hanging gardens by the river.
    const bl = new THREE.Group(), blm = mk();
    const blP = [part(cube, 0x6a9ab8, [0, 0.5, -280], [0, 0, 0], [900, 0.8, 40], 0.02)];
    for (let t = 0; t < 6; t++) blP.push(part(cube, [0xc47a44, 0xb8683a, 0xa95c30][t % 3], [120, 8 + t * 16, -420], [0, 0, 0], [120 - t * 18, 16, 120 - t * 18]));
    blP.push(part(cube, 0x2a5ab8, [-40, 30, -380], [0, 0, 0], [70, 60, 14]), part(cube, 0x7a9ab8, [-40, 18, -372], [0, 0, 0], [20, 36, 2]));
    for (let k = 0; k < 7; k++) blP.push(part(cube, 0x2a5ab8, [-70 + k * 10, 63, -380], [0, 0, 0], [5, 6, 14]), part(cube, 0xf0b93a, [-60 + (k % 3) * 20, 20 + Math.floor(k / 3) * 14, -372.5], [0, 0, 0], [8, 4, 1]));
    for (let t = 0; t < 4; t++) blP.push(part(cube, 0xc8a070, [-170, 8 + t * 14, -380], [0, 0, 0], [80 - t * 15, 14, 40]), part(new THREE.SphereGeometry(1, 8, 4), 0x4f9a3a, [-170, 16 + t * 14, -360], [0, 0, 0], [40 - t * 7, 5, 6]));
    add(bl, blP, blm);
    this.backdrops.push({ group: bl, mats: [blm] });
    // Shushan: the Persian palace on its platform, rows of tall columns with bull capitals.
    const sh = new THREE.Group(), shm = mk();
    const shP = [part(cube, 0xd8c8a8, [0, 8, -400], [0, 0, 0], [320, 16, 80])];
    for (let k = 0; k < 13; k++) { const x = -150 + k * 25; shP.push(part(cyl(3, 3.6, 60, 8), 0xe8e0d0, [x, 46, -380]), part(cube, 0xd8c8a0, [x, 78, -380], [0, 0, 0], [14, 5, 6])); }
    shP.push(part(cube, 0xe8e0d0, [0, 84, -390], [0, 0, 0], [330, 6, 30]));
    for (const [c, x] of [[0xffffff, -60], [0x3a9a5a, 0], [0x2c6fd6, 60]]) shP.push(part(cube, c, [x, 60, -375], [0, 0, 0], [40, 20, 1]));
    add(sh, shP, shm);
    this.backdrops.push({ group: sh, mats: [shm] });
    // Modiin: dark hills under the stars, a giant glowing hanukkiah on the hilltop, and olive groves.
    const md = new THREE.Group(), mdm = mk();
    const mdP = [part(new THREE.SphereGeometry(1, 12, 6), 0x4a5a3a, [-140, -8, -380], [0, 0, 0], [150, 46, 60]), part(new THREE.SphereGeometry(1, 12, 6), 0x3e4e32, [120, -8, -400], [0, 0, 0], [180, 52, 70])];
    mdP.push(part(cube, 0xc0c4ca, [120, 48, -390], [0, 0, 0], [70, 3, 3]), part(cube, 0xc0c4ca, [120, 38, -390], [0, 0, 0], [3, 24, 3]));
    for (let k = 0; k < 9; k++) { const x = 88 + k * 8, h = k === 4 ? 66 : 58; mdP.push(part(cube, 0xc0c4ca, [x, h - 6, -390], [0, 0, 0], [1.6, 12, 1.6]), part(new THREE.ConeGeometry(2, 5, 6), 0xffb03a, [x, h + 2, -390])); }
    for (let k = 0; k < 10; k++) mdP.push(part(new THREE.IcosahedronGeometry(1, 0), 0x5a6a3a, [-120 + k * 14, 20 + Math.sin(k) * 4, -340], [k, k, 0], [8, 6, 8]));
    add(md, mdP, mdm);
    this.backdrops.push({ group: md, mats: [mdm] });
    // Safed: a white hill town with blue domes, and Mount Meron beyond.
    const sf = new THREE.Group(), sfm = mk();
    const sfP = [part(new THREE.SphereGeometry(1, 12, 6), 0x8a9a6a, [160, -10, -460], [0, 0, 0], [180, 80, 70]), part(dome(), 0x9aaa78, [-30, -4, -380], [0, 0, 0], [170, 60, 70])];
    for (let k = 0; k < 22; k++) { const x = -140 + (k % 11) * 22 + rnd(-4, 4), y = 30 + Math.floor(k / 11) * 14 - Math.abs(x + 30) * 0.18; sfP.push(part(cube, k % 3 ? 0xf2eee4 : 0xe2dccc, [x, y, -350 - Math.floor(k / 11) * 12], [0, 0, 0], [14, 12, 12])); if (k % 4 === 0) sfP.push(part(dome(5), 0x3a8ad6, [x, y + 6, -350 - Math.floor(k / 11) * 12])); }
    add(sf, sfP, sfm);
    this.backdrops.push({ group: sf, mats: [sfm] });
    // Brooklyn: the Brooklyn Bridge with its cables and the Manhattan skyline behind.
    const br = new THREE.Group(), brm = mk();
    const brP = [part(cube, 0x4a6a8a, [0, 0.4, -300], [0, 0, 0], [900, 0.8, 120], 0.02), ...skyline(18, 40, 130, [0x6a7a8c, 0x8a8478, 0x5a6478], 260, -440)];
    for (const x of [-90, 90]) brP.push(part(cube, 0xb8a488, [x - 8, 45, -340], [0, 0, 0], [8, 90, 12]), part(cube, 0xb8a488, [x + 8, 45, -340], [0, 0, 0], [8, 90, 12]), part(cube, 0xb8a488, [x, 84, -340], [0, 0, 0], [26, 10, 12]));
    brP.push(part(cube, 0x6a5a4a, [0, 26, -340], [0, 0, 0], [420, 4, 14]));
    for (let k = 0; k < 14; k++) { const t = k / 13, x = -210 + t * 420; const y = 30 + 56 * (1 - Math.pow(Math.abs(Math.abs(x) - 90) / 120, 2)); brP.push(part(cube, 0x5a5a5a, [x, Math.max(30, y), -340], [0, 0, 0], [1, 1, 1])); }
    for (const s of [-1, 1]) for (let k = 0; k < 8; k++) brP.push(part(cube, 0x5a5a5a, [s * (90 - 6 - k * 10), 30 + (85 - 30) * (1 - k / 8) / 2 + 2, -340], [0, 0, s * 0.55], [12, 0.6, 0.6]));
    add(br, brP, brm);
    this.backdrops.push({ group: br, mats: [brm] });
    // Coney Island: the sea, the big wheel, the coaster's hills and the old parachute tower.
    const cn = new THREE.Group(), cnm = mk();
    const cnP = [part(cube, 0x3a8ac0, [0, 0.4, -260], [0, 0, 0], [900, 0.8, 300], 0.02)];
    cnP.push(part(new THREE.TorusGeometry(40, 1.5, 6, 40), 0xf06d9a, [-90, 50, -380]), part(new THREE.TorusGeometry(26, 1, 6, 30), 0xffd24a, [-90, 50, -380]));
    for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; cnP.push(part(cube, [0xe2483d, 0x2c6fd6, 0x3fae5a, 0xffd24a][k % 4], [-90 + Math.cos(a) * 40, 50 + Math.sin(a) * 40 - 4, -378], [0, 0, 0], [6, 6, 6])); }
    cnP.push(part(cube, 0x8a8a90, [-100, 24, -382], [0, 0, -0.3], [3, 52, 3]), part(cube, 0x8a8a90, [-80, 24, -382], [0, 0, 0.3], [3, 52, 3]));
    for (let k = 0; k < 20; k++) { const x = 20 + k * 8, h = 14 + Math.abs(Math.sin(k * 0.6)) * 34; cnP.push(part(cube, 0xf4f1ea, [x, h / 2, -400], [0, 0, 0], [1.2, h, 1.2]), part(cube, 0xe2483d, [x, h, -400], [0, 0, 0], [8.5, 1.4, 4])); }
    cnP.push(part(cube, 0xd84a3a, [210, 60, -420], [0, 0, 0], [4, 120, 4]), part(new THREE.TorusGeometry(26, 1.2, 6, 20), 0xd84a3a, [210, 118, -420], [Math.PI / 2, 0, 0]));
    add(cn, cnP, cnm);
    this.backdrops.push({ group: cn, mats: [cnm] });
    for (const b of this.backdrops) { b.group.visible = false; this.scene.add(b.group); }
  }

  resize(w, h) {
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    const need = 3.15;
    let dist = 6.3, vfov = 58;
    if (Math.tan((vfov * Math.PI) / 360) * aspect * dist < need) {
      vfov = Math.min(72, (2 * Math.atan(need / (aspect * dist)) * 180) / Math.PI);
      dist = Math.max(dist, need / (Math.tan((vfov * Math.PI) / 360) * aspect));
    }
    this.camera.aspect = aspect;
    this.camera.fov = vfov;
    this.baseFov = vfov;
    this.camera.updateProjectionMatrix();
    this.camDist = dist;
  }

  setPixelRatio(r) { this.dpr = r; this.renderer.setPixelRatio(r); }

  // Blend region colours by distance so the sky changes as the next region comes into view.
  blend(dist) {
    // Walk the route: blend into the next place over the last 150 m of each one.
    const r = routeAt(dist);
    const local = dist - r * BIOME_LEN;
    const i = ROUTE_IDX[r];
    const hasNext = r < ROUTE.length - 1;
    const j = hasNext ? ROUTE_IDX[r + 1] : i;
    const t = hasNext ? smooth(BIOME_LEN - 160, BIOME_LEN - 10, local) : 0;
    const A = this.pal[i], B = this.pal[j], c = this.cur;
    for (const k of ['skyTop', 'skyHorizon', 'skyBottom', 'fog', 'ground', 'road', 'sun', 'hemiSky', 'hemiGround', 'light']) c[k].copy(A[k]).lerp(B[k], t);
    c.sunDir.copy(A.sunDir).lerp(B.sunDir, t).normalize();
    c.lightI = A.lightI + (B.lightI - A.lightI) * t;
    c.hemiI = A.hemiI + (B.hemiI - A.hemiI) * t;
    c.stars = A.stars + (B.stars - A.stars) * t;
    this.weights.fill(0);
    this.weights[i] += 1 - t;
    this.weights[j] += t;
    return { index: t < 0.5 ? i : j, local };
  }

  update(dt, dist, speed) {
    this.time += dt;
    this.blend(dist);
    const c = this.cur;
    this.skyU.top.value.copy(c.skyTop);
    this.skyU.horizon.value.copy(c.skyHorizon);
    this.skyU.bottom.value.copy(c.skyBottom);
    this.skyU.sunColor.value.copy(c.sun);
    this.skyU.sunDir.value.copy(c.sunDir);
    this.scene.fog.color.copy(c.fog);
    this.groundMat.color.copy(c.ground);
    this.roadMat.color.copy(c.road);
    this.curbMat.color.copy(c.road).multiplyScalar(0.72);
    this.hemi.color.copy(c.hemiSky);
    this.hemi.groundColor.copy(c.hemiGround);
    this.sun.color.copy(c.light);
    this.flash = Math.max(0, this.flash - dt * 4);
    this.hemi.intensity = c.hemiI + this.flash * 2.5;
    this.sun.intensity = c.lightI;
    this.starMat.opacity = c.stars * 0.9;
    this.sky.position.copy(this.camera.position);
    this.stars.position.copy(this.camera.position);

    // Ground scrolls with distance, but its speed can be capped so very fast travel does not strobe.
    const dd = dist - this.lastDist;
    this.lastDist = dist;
    this.scrollPos += Math.abs(dd) > 400 ? 0 : Math.max(-this.scrollCap * dt, Math.min(this.scrollCap * dt, dd));
    this.sandTex.offset.y = (((this.scrollPos / 11) % 1) + 1) % 1;
    this.roadTex.offset.y = (((this.scrollPos / 6.6) % 1) + 1) % 1;

    this.updateSea(dist, dt);
    this.updateBackdrops(dt, dist);
    this.updateProps(dist, speed < 0);
    this.updateParticles(dt, speed);
  }

  updateSea(dist, dt) {
    // Find the nearest stretch of the route with walls of water (the Red Sea, the Jordan).
    let start = Infinity, end = Infinity, h = 13, wx = 4.7;
    for (let r = 0; r < ROUTE.length; r++) {
      const wh = WALLS[ROUTE[r]];
      if (!wh) continue;
      const s0 = r * BIOME_LEN, e0 = s0 + BIOME_LEN;
      if (e0 >= dist - 30 && s0 <= dist + 400) { start = s0; end = e0; h = wh.h; wx = wh.x; break; }
    }
    const z1 = Math.min(25, dist - start), z0 = Math.max(-330, dist - end);
    const show = isFinite(start) && z1 > z0 + 0.5;
    for (const w of this.seaWalls) {
      w.inner.visible = w.back.visible = show;
      w.cap.visible = show && z1 < 25;
      if (!show) continue;
      for (const m of [w.inner, w.cap, w.back]) { m.scale.y = h / 13; m.position.y = h / 2; }
      w.inner.position.x = w.sx * wx; w.cap.position.x = w.sx * (wx + 3); w.back.position.x = w.sx * (wx + 6);
      const len = z1 - z0, mid = (z0 + z1) / 2;
      w.inner.scale.x = len; w.inner.position.z = mid;
      w.back.scale.x = len; w.back.position.z = mid;
      w.cap.position.z = z1;
      w.tex.repeat.x = len / 16;
      w.tex.offset.x = w.sx < 0 ? ((dist - z1) / 16) % 1 : (-(dist - z0) / 16) % 1;
    }
    for (const f of this.fish) {
      f.m.visible = show;
      if (!show) continue;
      f.off += f.v * dt;
      const zz = ((((dist - f.off) % 220) + 220) % 220) - 200;
      f.m.visible = zz > z0 && zz < z1;
      this.wallX = wx;
      f.m.position.set(f.side * (f.x + (this.wallX || 4.7) - 4.7), f.y * (h / 13) + Math.sin(this.time * 1.5 + f.ph) * 0.3, zz);
      f.m.rotation.y = Math.sin(this.time * 6 + f.ph) * 0.15;
    }
  }

  updateBackdrops(dt, dist) {
    this.backdrops.forEach((b, i) => {
      const w = this.weights[i];
      b.group.visible = w > 0.01;
      for (const m of b.mats) m.opacity = Math.min(1, w * 1.15);
    });
    this.pillar.rotation.y += dt * 0.15;
    if (this.dove) { const a = this.time * 0.25; this.dove.position.set(Math.cos(a) * 120, 90 + Math.sin(a * 2) * 10, -320 + Math.sin(a) * 40); this.dove.rotation.y = -a; }
    if (this.ladderLights) this.ladderLights.forEach((m) => { const p = (m.userData.ph + this.time * 0.05) % 1; m.position.set((m.userData.ph > 0.5 ? 4 : -4), 6 + p * 230, -382 - p * 34); });
        if (this.jetPlane) { this.jetPlane.position.x += dt * 14; this.jetPlane.position.y += dt * 3; if (this.jetPlane.position.x > 260) this.jetPlane.position.set(-260, 40, -300); }
    this.firePillar.rotation.y -= dt * 0.4;
    this.firePillar.children.forEach((m, i) => { m.position.x = Math.cos(i * 1.7 + this.time * 2) * 3; });
    this.fireGlow.material.opacity = this.weights[4] * (0.5 + Math.sin(this.time * 6) * 0.08);
    const sinaiW = this.weights[this.sinaiIdx];
    this.glowMat.opacity = sinaiW * (0.55 + Math.sin(this.time * 3) * 0.12 + Math.sin(this.time * 7.3) * 0.06);
    const p = dist - routeStart('sinai');
    this.mountain.scale.setScalar(0.85 + Math.max(0, Math.min(1, p / BIOME_LEN)) * 0.35);
    this.bolt.material.opacity = Math.max(0, this.bolt.material.opacity - dt * 6);
    if (sinaiW > 0.5) {
      this.nextBolt -= dt;
      if (this.nextBolt <= 0) {
        this.nextBolt = rnd(2.5, 6);
        const pts = [];
        let x = rnd(-30, 30), y = 150;
        const s = this.mountain.scale.x;
        while (y > 105) { pts.push(new THREE.Vector3(x * s, y * s, -430)); x += rnd(-6, 6); y -= rnd(4, 9); }
        this.bolt.geometry.dispose();
        this.bolt.geometry = new THREE.BufferGeometry().setFromPoints(pts);
        this.bolt.material.opacity = 1;
        this.flash = 1;
        this.onThunder && this.onThunder();
      }
    }
  }

  getMesh(key, geo) {
    const pool = this.pools[key] || (this.pools[key] = []);
    let m = pool.pop();
    if (!m) { m = new THREE.Mesh(geo, flatMat); this.scene.add(m); }
    m.visible = true;
    return m;
  }

  release(key, m) { m.visible = false; (this.pools[key] || (this.pools[key] = [])).push(m); }

  spawnPropRow(wz) {
    const biome = BIOMES[biomeIndexAt(wz)];
    for (const side of [-1, 1]) {
      if (Math.random() < 0.18) continue;
      const def = pickScenery(biome.id);
      const { geo, key } = sceneryGeo(def);
      const m = this.getMesh(key, geo);
      m.position.set(side * Math.max(this.propMinX, rnd(def.x[0], def.x[1])), 0, 0);
      m.rotation.set(0, def.face ? (side < 0 ? Math.PI / 2 : -Math.PI / 2) + rnd(-0.25, 0.25) : rnd(0, Math.PI * 2), 0);
      m.scale.setScalar(def.s ? rnd(def.s[0], def.s[1]) : rnd(0.85, 1.15));
      this.props.push({ m, key, wz: wz + rnd(-2, 2), sway: def.sway, ph: rnd(0, 6) });
    }
  }

  // Props are spawned ahead while running forward, and behind while the train carries you back.
  updateProps(dist, reverse = false) {
    if (this.propsOn) {
      while (this.propCursor < dist + 175) { this.spawnPropRow(this.propCursor); this.propCursor += rnd(4.5, 9); }
      if (reverse) {
        while (this.propBack > dist - 34) { this.propBack -= rnd(4.5, 9); this.spawnPropRow(this.propBack); }
      }
    }
    for (let i = this.props.length - 1; i >= 0; i--) {
      const p = this.props[i];
      const z = dist - p.wz;
      if (z > 40 || z < -230) { this.release(p.key, p.m); this.props.splice(i, 1); continue; }
      p.m.position.z = z;
      if (p.sway) p.m.rotation.z = Math.sin(this.time * 2 + p.ph) * 0.14;
    }
    if (reverse) this.propCursor = Math.min(this.propCursor, dist + 230);
    else this.propBack = Math.max(this.propBack, dist - 40);
  }

  resetProps(dist, behind = 20) {
    for (const p of this.props) this.release(p.key, p.m);
    this.props.length = 0;
    this.propCursor = dist - behind;
    this.propBack = dist - behind;
  }

  // Particles: { pool, i, x,y,z, vx,vy,vz, life, max, r,g,b, grav }
  burst(x, y, z, n, { color = [1, 1, 1], speed = 4, up = 3, life = 0.7, grav = 9, dust = false, spread = 1 } = {}) {
    const pool = dust ? this.fxDust : this.fxSpark;
    for (let k = 0; k < n; k++) {
      const slot = this.freeSlot(pool);
      if (slot < 0) return;
      const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.6);
      this.particles.push({
        pool, i: slot, x: x + (Math.random() - 0.5) * spread * 0.4, y, z,
        vx: Math.cos(a) * s, vy: up * (0.5 + Math.random() * 0.7), vz: Math.sin(a) * s,
        life: life * (0.6 + Math.random() * 0.5), max: life, r: color[0], g: color[1], b: color[2], grav,
      });
    }
  }

  freeSlot(pool) {
    if (!pool.used) pool.used = new Uint8Array(pool.cap);
    for (let i = 0; i < pool.cap; i++) if (!pool.used[i]) { pool.used[i] = 1; return i; }
    return -1;
  }

  updateParticles(dt, speed) {
    for (let k = this.particles.length - 1; k >= 0; k--) {
      const p = this.particles[k];
      p.life -= dt;
      if (p.life <= 0) {
        p.pool.hide(p.i); p.pool.used[p.i] = 0;
        this.particles.splice(k, 1);
        continue;
      }
      p.vy -= p.grav * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += (p.vz + speed) * dt;
      if (p.y < 0.03) { p.y = 0.03; p.vy *= -0.3; p.vx *= 0.7; p.vz *= 0.7; }
      const a = Math.min(1, p.life / (p.max * 0.5));
      p.pool.set(p.i, p.x, p.y, p.z, p.r, p.g, p.b, a);
    }
    this.fxSpark.flush();
    this.fxDust.flush();
  }

  clearParticles() {
    for (const p of this.particles) { p.pool.hide(p.i); p.pool.used[p.i] = 0; }
    this.particles.length = 0;
    this.fxSpark.flush(); this.fxDust.flush();
  }

  render() { this.renderer.render(this.scene, this.camera); }
}
