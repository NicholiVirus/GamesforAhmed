// The environment: renderer, sky, light, scrolling ground, the parted sea, distant landmarks,
// roadside props and particle effects. Gameplay objects live in main.js.
import * as THREE from './three.js';
import { BIOMES, BIOME_LEN, JLM_START, CYCLE } from './data.js';
import { part, merge, jagged, ICO, softDot } from './models.js';
import { pickScenery, sceneryGeo } from './scenery.js';
import { flatMat } from './models.js';

const LAP = BIOME_LEN * CYCLE;
const JLM = BIOMES.length - 1;
const rnd = (a, b) => a + Math.random() * (b - a);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const biomeIndexAt = (wz) => (wz >= JLM_START ? JLM : Math.floor((((wz % LAP) + LAP) % LAP) / BIOME_LEN));

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
    this.backdrops.push({ group: elim, mats: [em] });
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
    const bolt = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0 }));
    sinai.add(bolt);
    this.bolt = bolt;
    this.mountain = mountain;
    this.backdrops.push({ group: sinai, mats: [sm, sc] });
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
    const p = ((dist % LAP) + LAP) % LAP;
    let i = Math.floor(p / BIOME_LEN);
    const local = p - i * BIOME_LEN;
    let t = smooth(BIOME_LEN - 110, BIOME_LEN - 10, local);
    let j = (i + 1) % CYCLE;
    // Arriving in Jerusalem: blend from wherever you are into the holy city, then stay.
    if (dist >= JLM_START - 160) { j = JLM; t = smooth(JLM_START - 160, JLM_START - 10, dist); if (dist >= JLM_START) i = JLM; }
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
    const lapStart = Math.floor(dist / LAP) * LAP;
    let start = lapStart + BIOME_LEN, end = lapStart + BIOME_LEN * 2;
    if (end < dist - 30) { start += LAP; end += LAP; }
    if (start >= JLM_START) start = end = Infinity;
    const z1 = Math.min(25, dist - start), z0 = Math.max(-330, dist - end);
    if (!isFinite(start)) { z1; }
    const show = z1 > z0 + 0.5;
    for (const w of this.seaWalls) {
      w.inner.visible = w.back.visible = show;
      w.cap.visible = show && z1 < 25;
      if (!show) continue;
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
      f.m.position.set(f.side * f.x, f.y + Math.sin(this.time * 1.5 + f.ph) * 0.3, zz);
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
    this.firePillar.rotation.y -= dt * 0.4;
    this.firePillar.children.forEach((m, i) => { m.position.x = Math.cos(i * 1.7 + this.time * 2) * 3; });
    this.fireGlow.material.opacity = this.weights[4] * (0.5 + Math.sin(this.time * 6) * 0.08);
    const sinaiW = this.weights[this.sinaiIdx];
    this.glowMat.opacity = sinaiW * (0.55 + Math.sin(this.time * 3) * 0.12 + Math.sin(this.time * 7.3) * 0.06);
    const p = ((dist % LAP) + LAP) % LAP - BIOME_LEN * this.sinaiIdx;
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
