// Someone chasing you, Subway Surfers style. Normally they lag out of sight behind the camera;
// when you crash they close in for a few seconds. Crash again while they are close and they catch you.
// Who chases depends on the era: Pharaoh's chariot, an Amalekite raider, a Roman legionary,
// and in the modern cities an airport security guard blowing a whistle.
import * as THREE from './three.js';
import { box, part, merge, flatMat, buildCamel, ICO } from './models.js';

function rider(robe, head, skin = 0xb07a50) {
  return [
    box(robe, [0, 0.45, 0], [0.5, 0.6, 0.32]),
    box(skin, [0, 0.95, 0], [0.38, 0.38, 0.38]),
    box(0x1b1830, [-0.08, 0.97, 0.195], [0.06, 0.07, 0.02]), box(0x1b1830, [0.08, 0.97, 0.195], [0.06, 0.07, 0.02]),
    box(0x1b1830, [0, 0.86, 0.195], [0.16, 0.03, 0.02]),
    ...head,
  ];
}

function buildChariot() {
  const P = [
    box(0xf0b93a, [0, 0.75, 0], [1.3, 0.7, 1.0]),
    box(0x2b59a6, [0, 0.95, 0.51], [1.3, 0.2, 0.02]),
    ...[-0.75, 0.75].map((x) => part(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 12), 0x7a4a24, [x, 0.55, 0], [0, 0, Math.PI / 2])),
    box(0x7a4a24, [0, 0.55, 0], [1.6, 0.08, 0.08]),
    box(0x7a4a24, [0, 0.75, 1.6], [0.1, 0.1, 2.2]),
    // horse
    box(0xf2efe6, [0, 1.2, 2.6], [0.6, 0.6, 1.4]),
    box(0xf2efe6, [0, 1.75, 3.25], [0.3, 0.7, 0.35], [0.4, 0, 0]),
    box(0xf2efe6, [0, 2.05, 3.55], [0.3, 0.3, 0.6]),
    box(0xd8402f, [0, 2.3, 3.4], [0.08, 0.25, 0.4]),
    ...[[-0.2, 2.2], [0.2, 2.2], [-0.2, 3.0], [0.2, 3.0]].map(([x, z]) => box(0xf2efe6, [x, 0.45, z], [0.15, 0.9, 0.15])),
  ];
  // Egyptian charioteer with a striped headdress
  rider(0xf2efe6, [box(0x2b59a6, [0, 1.1, -0.02], [0.44, 0.22, 0.44]), box(0xf0b93a, [0, 1.06, -0.02], [0.45, 0.05, 0.45]), box(0x2b59a6, [0, 0.9, -0.22], [0.4, 0.3, 0.06])])
    .forEach((g) => { g.translate(0, 0.75, 0); P.push(g); });
  return merge(P);
}

function buildRaider() {
  const camel = buildCamel();
  const r = merge(rider(0x5a3a2a, [box(0x2a2a2a, [0, 1.12, 0], [0.44, 0.16, 0.44]), box(0x2a2a2a, [0, 0.9, -0.22], [0.38, 0.4, 0.05])]));
  r.translate(0, 1.9, -0.1);
  return merge([camel, r]);
}

function buildLegionary() {
  return merge([
    ...rider(0xb83a2a, [
      box(0xb8bcc2, [0, 1.12, 0], [0.42, 0.2, 0.42]),
      box(0xd8402f, [0, 1.32, 0], [0.08, 0.22, 0.46]),
      box(0xb8bcc2, [0, 0.95, 0.2], [0.06, 0.24, 0.04]),
    ]),
    box(0xb8bcc2, [0, 0.55, 0.17], [0.52, 0.3, 0.04]),
    box(0xb83a2a, [0.4, 0.55, 0.15], [0.12, 0.9, 0.7]),
    box(0xf0b93a, [0.47, 0.55, 0.15], [0.02, 0.15, 0.15]),
    box(0xc8a070, [-0.35, 0.8, 0.2], [0.05, 1.6, 0.05]),
    box(0xb8bcc2, [-0.35, 1.62, 0.2], [0.09, 0.18, 0.09]),
    box(0x6b3e1e, [-0.12, -0.15, 0], [0.18, 0.55, 0.2]), box(0x6b3e1e, [0.12, -0.15, 0], [0.18, 0.55, 0.2]),
  ]);
}

function buildGuard() {
  return merge([
    ...rider(0x22305a, [box(0x111a33, [0, 1.15, 0], [0.44, 0.12, 0.44]), box(0x111a33, [0, 1.11, 0.24], [0.34, 0.04, 0.16]), box(0xf0b93a, [0, 1.17, 0.21], [0.1, 0.06, 0.02])], 0xc68a5e),
    box(0xf0b93a, [0.14, 0.62, 0.17], [0.08, 0.08, 0.02]),
    box(0xd8dde2, [0.06, 0.88, 0.22], [0.06, 0.04, 0.08]),
    box(0x22305a, [-0.12, -0.15, 0], [0.18, 0.55, 0.2]), box(0x22305a, [0.12, -0.15, 0], [0.18, 0.55, 0.2]),
    box(0x111111, [-0.12, -0.45, 0.04], [0.2, 0.1, 0.28]), box(0x111111, [0.12, -0.45, 0.04], [0.2, 0.1, 0.28]),
  ]);
}

function buildSoldier() { // an ancient soldier with a bronze helmet, round shield and spear
  return merge([
    ...rider(0x9a7a56, [box(0xb07a3a, [0, 1.12, 0], [0.42, 0.18, 0.42]), box(0xb07a3a, [0, 1.25, 0], [0.12, 0.14, 0.36])]),
    part(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 12), 0xb07a3a, [0.42, 0.55, 0.15], [0, 0, Math.PI / 2]),
    box(0x8a6a48, [-0.35, 0.8, 0.2], [0.05, 1.7, 0.05]), part(new THREE.ConeGeometry(0.07, 0.2, 6), 0x9aa0a6, [-0.35, 1.72, 0.2]),
    box(0x6b3e1e, [-0.12, -0.15, 0], [0.18, 0.55, 0.2]), box(0x6b3e1e, [0.12, -0.15, 0], [0.18, 0.55, 0.2]),
  ]);
}

const WHO = {
  ararat: 'giant', babel: 'soldier', jacob: 'raider', rephidim: 'raider', jordan: 'soldier', jericho: 'soldier', elah: 'giant',
  egypt: 'chariot', sea: 'chariot', elim: 'raider', wild: 'raider', night: 'raider', sinai: 'raider',
  jerusalem: 'legion', telaviv: 'guard', airport: 'guard', newyork: 'guard', donut: 'guard',
  eden: 'raider', beersheba: 'raider', eingedi: 'soldier', jonah: 'guard', babylon: 'soldier', shushan: 'guard',
  modiin: 'legion', safed: 'raider', brooklyn: 'guard', coney: 'guard', park: 'guard', harbor: 'guard',
};
const NAMES = { chariot: "Pharaoh's chariot", raider: 'An Amalekite raider', legion: 'A Roman legionary', guard: 'The airport guard', soldier: 'A soldier', giant: 'Goliath the giant' };
// Who is chasing you in each place, when it is not the default for their kind.
const PLACE_NAMES = {
  eden: 'A sneaky fruit thief', beersheba: 'A Philistine well-filler', eingedi: "King Saul's soldiers", jonah: "Nineveh's city guard",
  babylon: "Nebuchadnezzar's soldier", shushan: "Haman's guard", modiin: "Antiochus's soldier", safed: 'A mountain bandit',
  newyork: 'A New York parking officer', donut: 'The donut-shop security guard', brooklyn: 'A runaway pretzel vendor', coney: 'A boardwalk lifeguard',
  park: 'A Central Park ranger', harbor: 'A harbour patrol officer',
  ararat: 'A giant of the Nephilim', babel: 'A tower guard', jacob: "Esau's 400 riders", jordan: "The king of Jericho's men", jericho: 'A soldier of Jericho', elah: 'Goliath the giant',
};

export class Chaser {
  constructor(scene) {
    const geos = { chariot: buildChariot(), raider: buildRaider(), legion: buildLegionary(), guard: buildGuard(), soldier: buildSoldier(), giant: buildSoldier() };
    this.meshes = {};
    for (const k in geos) {
      const m = new THREE.Mesh(geos[k], flatMat);
      m.visible = false;
      m.rotation.y = Math.PI; // face the runner (toward -z)
      m.scale.setScalar(k === 'giant' ? 1.6 : 0.85);
      scene.add(m);
      this.meshes[k] = m;
    }
    this.kind = 'chariot';
    this.z = 30;        // distance behind the runner
    this.alert = 0;     // seconds left of being close
    this.t = 0;
  }

  setEra(biomeId) { this.kind = WHO[biomeId] || 'guard'; this.placeName = PLACE_NAMES[biomeId]; }

  name() { return this.placeName || NAMES[this.kind]; }

  close() { return this.alert > 0 && this.z < 6; }

  // The runner crashed: the chaser closes in. Returns true if they were already close (caught).
  bump() {
    const caught = this.close();
    this.alert = 6;
    return caught;
  }

  reset() { this.alert = 0; this.z = 30; }

  update(dt, x, y, state) {
    this.t += dt;
    if (state === 'playing') this.alert = Math.max(0, this.alert - dt);
    const target = state === 'menu' ? 40 : this.alert > 0 || state === 'dying' || state === 'over' ? 1.2 : 26;
    this.z += (target - this.z) * Math.min(1, dt * (target < this.z ? 2.5 : 0.8));
    for (const k in this.meshes) {
      const m = this.meshes[k];
      m.visible = k === this.kind && this.z < 20 && state !== 'ride';
      if (!m.visible) continue;
      const bob = Math.abs(Math.sin(this.t * 9)) * (['legion', 'guard', 'soldier', 'giant'].includes(this.kind) ? 0.12 : 0.05);
      const side = x <= 0 ? 2.1 : -2.1;
      m.position.set(x + side + Math.sin(this.t * 1.3) * 0.2, (['legion', 'guard', 'soldier'].includes(this.kind) ? 0.5 : this.kind === 'giant' ? 0.95 : 0) + bob, this.z + (this.kind === 'chariot' ? 1.0 : this.kind === 'raider' ? 0.6 : 0));
    }
  }
}
