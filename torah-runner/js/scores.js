// High scores: a top-10 table saved on this device, plus a shared board of everyone's best run
// when the game is opened as a claude.ai page that can keep shared data.

export const TOP_N = 10;

// ---------------------------------------------------------------- this device
// entries: { name, score, dist, tablets, words, place, at }
export function rankFor(list, score) {
  if (score <= 0) return 0;
  const i = list.findIndex((e) => score > e.score);
  const rank = (i === -1 ? list.length : i) + 1;
  return rank <= TOP_N ? rank : 0;
}

export function addScore(list, entry) {
  const out = list.concat([entry]).sort((a, b) => b.score - a.score || a.at - b.at).slice(0, TOP_N);
  return { list: out, rank: out.indexOf(entry) + 1 };
}

// ---------------------------------------------------------------- everyone (shared board)
// One document per player, keyed by their id, holding only their best run.
export class SharedBoard {
  constructor() {
    this.db = null;
    this.user = null;
    this.me = null;
    this.rows = null;    // null = not loaded yet
    this.state = 'off';  // off | loading | ready | stale | error
    this.canPost = true;
    this.onChange = () => {};
    this.unsub = null;
    this.connect();
  }

  async connect() {
    const c = typeof window !== 'undefined' && window.claude;
    if (!c || typeof c.use !== 'function') return; // a plain web page: device scores only
    try {
      const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
      if (!db) return;
      this.db = db;
      this.user = user;
      this.me = user ? await user.id() : null;
      // Viewers who may only look (not contribute) see the board but cannot post to it.
      if (user && typeof user.can === 'function') { const w = await user.can('data.write'); if (w === false) this.canPost = false; }
      this.subscribe();
    } catch (e) { this.state = 'off'; this.onChange(); }
  }

  get available() { return !!this.db; }

  subscribe() {
    if (this.unsub) return;
    this.state = 'loading';
    this.onChange();
    const timer = setTimeout(() => { if (this.state === 'loading') { this.state = 'stale'; this.onChange(); } }, 10000);
    this.unsub = this.db.collection('scores').orderBy('score', 'desc').limit(25).onSnapshot((snap) => {
      this.rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        .filter((r) => typeof r.score === 'number' && r.score > 0 && r.score < 1e8);
      if (!snap.metadata || !snap.metadata.fromCache) { clearTimeout(timer); this.state = 'ready'; }
      this.onChange();
    }, () => { clearTimeout(timer); this.state = 'error'; this.onChange(); });
  }

  myBest() {
    if (!this.rows || !this.me) return 0;
    const r = this.rows.find((x) => x.id === this.me);
    return r ? r.score : 0;
  }

  // Post a run if it beats this player's best. Writes only after a run ends.
  async post(run) {
    if (!this.db || !this.me || !this.canPost) return false;
    const ref = this.db.collection('scores').doc(this.me);
    try {
      const snap = await ref.get();
      const old = snap.exists ? snap.data() : null;
      if (old && old.score >= run.score) return false;
      await ref.set({ score: run.score, dist: run.dist, tablets: run.tablets, words: run.words, place: run.place, at: run.at, runs: ((old && old.runs) || 0) + 1 });
      return true;
    } catch (e) {
      if (e && (e.code === 'invalid_argument' || e.code === 'not_granted' || e.code === 'revoked')) { this.canPost = false; this.onChange(); }
      return false;
    }
  }

  async names(ids) {
    if (!this.user || !ids.length) return {};
    try {
      const ps = await this.user.profiles(ids);
      const out = {};
      for (const id of ids) out[id] = (ps[id] && ps[id].name) || '';
      return out;
    } catch (e) { return {}; }
  }
}
