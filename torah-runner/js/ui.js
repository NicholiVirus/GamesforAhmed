// DOM overlay: HUD, region banners, menus and the "My scroll" word list.
import { LETTER_NAMES, POWERS } from './data.js';

const $ = (id) => document.getElementById(id);
const HEART = '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21.2 2.9 12.3A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 9.1 7.7Z"/></svg>';
const fmt = (n) => Math.floor(n).toLocaleString('en-US');

export class UI {
  constructor(h) {
    this.h = h;
    this.last = {};
    this.screens = ['screen-loading', 'screen-start', 'screen-pause', 'screen-over', 'screen-scroll', 'screen-error', 'screen-word', 'screen-shop', 'screen-quiz', 'screen-map'];
    this.wordArmed = false;
    const on = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', (e) => { e.stopPropagation(); fn(); }); };
    on('btn-play', () => h.play());
    on('btn-again', () => h.play());
    on('btn-pause', () => h.pause());
    on('btn-resume', () => h.resume());
    on('btn-restart', () => h.play());
    on('btn-home', () => h.home());
    on('btn-home-2', () => h.home());
    on('btn-sound', () => h.sound());
    on('btn-sound-2', () => h.sound());
    on('btn-scroll', () => h.openScroll());
    on('btn-scroll-2', () => h.openScroll());
    on('btn-scroll-close', () => h.closeScroll());
    on('btn-shop', () => h.openShop());
    on('btn-map', () => h.openMap());
    on('btn-map-close', () => this.show('screen-start'));
    const mapList = $('map-list');
    if (mapList) mapList.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-start], button[data-unlock]');
      if (!b) return;
      e.stopPropagation();
      if (b.dataset.start) h.pickStart(b.dataset.start); else h.unlockPlace(b.dataset.unlock);
    });
    on('btn-star', () => h.useStar());
    on('btn-shop-close', () => h.closeShop());
    const list = $('shop-list');
    if (list) list.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-buy], button[data-up], button[data-look]');
      if (!b) return;
      e.stopPropagation();
      if (b.dataset.look) { const [k, id] = b.dataset.look.split(':'); h.buyLook(k, id); } else if (b.dataset.up) h.buyUpgrade(b.dataset.up); else h.buy(b.dataset.buy);
    });
    on('btn-word-continue', () => h.continueWord());
    on('btn-skip', () => h.skipRide());
    this.icons = {};
  }

  setIcons(map) {
    this.icons = map;
    document.querySelectorAll('img[data-icon]').forEach((img) => { if (map[img.dataset.icon]) img.src = map[img.dataset.icon]; });
  }

  show(id) {
    for (const s of this.screens) { const el = $(s); if (el) el.hidden = s !== id; }
    if (id) {
      const el = $(id);
      const focusable = el && el.querySelector('[data-autofocus]');
      if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 30);
    }
  }

  hud(v) { $('hud').hidden = !v; if (!v) $('banner').hidden = true; }

  setHearts(n, max) {
    const key = n + '/' + max;
    if (this.last.hearts === key) return;
    const grew = this.last.heartN !== undefined && n > this.last.heartN;
    const lost = this.last.heartN !== undefined && n < this.last.heartN;
    this.last.hearts = key; this.last.heartN = n;
    const el = $('hearts');
    el.innerHTML = Array.from({ length: max }, (_, i) => `<span class="heart${i < n ? ' full' : ''}">${HEART}</span>`).join('');
    el.setAttribute('aria-label', `${n} of ${max} lives`);
    el.classList.remove('pulse', 'shake');
    void el.offsetWidth;
    if (grew) el.classList.add('pulse');
    if (lost) el.classList.add('shake');
  }

  setScore(v, mult = 1) { const s = fmt(v) + (mult > 1 ? ` ×${mult}` : ''); if (this.last.score !== s) { this.last.score = s; $('score').textContent = s; } }
  setDist(m) { const s = fmt(m) + ' m'; if (this.last.dist !== s) { this.last.dist = s; $('dist').textContent = s; } }
  setTablets(n) {
    if (this.last.tablets === n) return;
    this.last.tablets = n;
    $('tablet-count').textContent = `${n}/10`;
    $('tablets').setAttribute('aria-label', `${n} of 10 commandments`);
  }

  setManna(n) {
    if (this.last.manna === n) return;
    this.last.manna = n; $('manna-count').textContent = fmt(n);
  }

  setWord(word, idx) {
    const key = word.he + idx;
    if (this.last.word === key) return;
    this.last.word = key;
    const letters = [...word.he];
    $('word-slots').innerHTML = letters.map((ch, i) => {
      const cls = i < idx ? 'done' : i === idx ? 'next' : '';
      return `<span class="slot ${cls}">${ch}</span>`;
    }).join('');
    $('word-gloss').textContent = `${word.tr} · ${word.en}`;
    const next = letters[idx];
    $('word-next').innerHTML = next ? `Catch <b lang="he">${next}</b> ${LETTER_NAMES[next] || ''}` : 'Word complete';
  }

  slotRect(idx) {
    const s = $('word-slots').children[idx];
    return s ? s.getBoundingClientRect() : null;
  }

  flyLetter(ch, x, y, idx) {
    const r = this.slotRect(idx);
    if (!r) return;
    const el = document.createElement('span');
    el.className = 'fly';
    el.textContent = ch;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    $('fly-layer').appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(${r.left + r.width / 2 - x}px, ${r.top + r.height / 2 - y}px) scale(0.6)`;
      el.style.opacity = '0.2';
    }));
    setTimeout(() => el.remove(), 650);
  }

  setPowers(list) {
    const key = list.map((p) => p.type + Math.ceil(p.frac * 20)).join(',');
    if (this.last.powers === key) return;
    this.last.powers = key;
    $('powers').innerHTML = list.map((p) => `
      <div class="power" style="--c:${POWERS[p.type].color}">
        ${this.icons[p.type] ? `<img src="${this.icons[p.type]}" alt="">` : ''}
        <span class="power-label">${POWERS[p.type].label}</span>
        <span class="bar"><i style="width:${Math.round(p.frac * 100)}%"></i></span>
      </div>`).join('');
  }

  banner(b, lap) {
    const el = $('banner');
    el.innerHTML = `<span class="banner-he" lang="he" dir="rtl">${b.he}</span>
      <span class="banner-name">${b.name}${lap > 1 ? ` <small>· Journey ${lap}</small>` : ''}</span>
      <span class="banner-line">${b.line}</span>`;
    el.hidden = false;
    el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    clearTimeout(this.bannerT);
    this.bannerT = setTimeout(() => { el.hidden = true; }, 3400);
  }

  // The word card freezes the run. Its button only works after a short delay,
  // so a swipe that was already under way cannot dismiss it by accident.
  wordCard(word, learned, total) {
    $('wc-he').textContent = word.he;
    $('wc-tr').innerHTML = `<b>${word.tr}</b> means <b>${word.en.toLowerCase()}</b>`;
    $('wc-letters').innerHTML = [...word.he].map((ch) =>
      `<li><span lang="he">${ch}</span><small>${LETTER_NAMES[ch] || ''}</small></li>`).join('');
    $('wc-count').textContent = `${learned} of ${total} words on your scroll`;
    const btn = $('btn-word-continue');
    this.wordArmed = false;
    btn.disabled = true;
    this.show('screen-word');
    clearTimeout(this.armT);
    this.armT = setTimeout(() => {
      this.wordArmed = true;
      btn.disabled = false;
      btn.focus({ preventScroll: true });
    }, 750);
  }

  renderShop(wallet, inv, up) {
    $('shop-wallet').textContent = Math.floor(wallet).toLocaleString('en-US');
    const btn = (attr, price, ok) => `<button class="btn ${ok ? 'btn-primary' : 'btn-ghost'}" type="button" ${attr} ${ok ? '' : 'disabled'}>
          <span class="manna-dot"></span>${price.toLocaleString('en-US')}</button>`;
    const ups = this.upgrades.map((u) => {
      const lvl = up[u.id] || 0, maxed = lvl >= u.max, price = u.price * (lvl + 1);
      const pips = Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
      return `<li>
        ${this.icons[u.icon] ? `<img src="${this.icons[u.icon]}" alt="">` : ''}
        <span class="shop-name"><b>${u.name}</b><small>${u.about}</small><span class="pips" aria-label="Level ${lvl} of ${u.max}">${pips}</span></span>
        ${maxed ? '<span class="maxed">Max</span>' : btn(`data-up="${u.id}"`, price, wallet >= price)}
      </li>`;
    }).join('');
    const items = this.shopItems.map((it) => `<li>
        ${this.icons[it.type] ? `<img src="${this.icons[it.type]}" alt="">` : ''}
        <span class="shop-name"><b>${it.name}</b><small>${it.about}${inv[it.type] ? ` · ready: ${inv[it.type]}` : ''}</small></span>
        ${btn(`data-buy="${it.type}"`, it.price, wallet >= it.price)}
      </li>`).join('');
    const L = this.looks, owned = L.store.owned || [];
    const hex = (c) => '#' + c.toString(16).padStart(6, '0');
    const look = (kind, it, swatch) => {
      const key = kind + ':' + it.id, has = owned.includes(key), on = L.store[kind] === it.id;
      const action = on ? `<button class="btn btn-ghost" type="button" data-look="${key}">Wearing · take off</button>`
        : has ? `<button class="btn btn-primary" type="button" data-look="${key}">Wear</button>`
          : btn(`data-look="${key}"`, it.price, wallet >= it.price);
      return `<li><span class="swatch" style="background:${swatch}"></span><span class="shop-name"><b>${it.name}</b><small>${kind === 'skin' ? 'Outfit colour in every place' : 'Worn instead of a hat or head wrap'}</small></span>${action}</li>`;
    };
    const skins = L.SKINS.map((it) => look('skin', it, `linear-gradient(${hex(it.top)} 60%, ${hex(it.hem)} 60%)`)).join('');
    const kips = L.KIPPAHS.map((it) => look('kippah', it, it.stripes ? `conic-gradient(${it.stripes.map(hex).join(',')})` : `radial-gradient(${hex(it.color)} 62%, ${hex(it.rim)} 64%)`)).join('');
    $('shop-list').innerHTML = `<li class="shop-head">Upgrades · keep forever</li>${ups}<li class="shop-head">Power-ups · used on your next run</li>${items}<li class="shop-head">Outfit colours · keep forever</li>${skins}<li class="shop-head">Kippahs · keep forever</li>${kips}`;
  }

  quiz(word, options, i, total, right, need, onPick) {
    $('quiz-progress').textContent = `Question ${i + 1} of ${total} · ${right} right · need ${need} to keep running`;
    $('quiz-he').textContent = word.he;
    $('quiz-tr').textContent = word.tr;
    const box = $('quiz-options');
    box.innerHTML = options.map((o) => `<button class="btn btn-ghost quiz-opt" type="button">${o}</button>`).join('');
    let done = false;
    box.querySelectorAll('button').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (done) return;
      done = true;
      const ok = b.textContent === word.en;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) box.querySelectorAll('button').forEach((x) => { if (x.textContent === word.en) x.classList.add('right'); });
      onPick(b.textContent);
    }));
    this.show('screen-quiz');
  }

  quizTitle(t) { $('quiz-title').textContent = t; }

  setStars(n) {
    const b = $('btn-star');
    b.hidden = n < 1;
    $('star-count').textContent = String(n);
  }

  countdown(n) {
    const el = $('countdown');
    if (n === null) { el.hidden = true; return; }
    el.textContent = String(n);
    el.hidden = false;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  }

  renderMap(places, wallet) {
    $('map-wallet').textContent = Math.floor(wallet).toLocaleString('en-US');
    $('map-list').innerHTML = places.map((p, i) => `
      <li class="${p.current ? 'current' : ''} ${p.reached ? '' : 'locked'}">
        <span class="map-num">${i + 1}</span>
        <span class="shop-name"><b>${p.name}</b><small lang="he" dir="rtl">${p.he}</small></span>
        ${p.current ? '<span class="maxed">Starting here</span>'
    : p.reached ? `<button class="btn btn-primary" type="button" data-start="${p.id}">Start here</button>`
      : `<button class="btn ${wallet >= p.price ? 'btn-primary' : 'btn-ghost'}" type="button" data-unlock="${p.id}" ${wallet >= p.price ? '' : 'disabled'}><span class="manna-dot"></span>${p.price.toLocaleString('en-US')}</button>`}
      </li>`).join('');
  }

  rideTo(name) { $('ride-banner').querySelector('span').textContent = `Riding back to ${name}`; }

  ride(on) {
    $('ride-banner').hidden = !on;
    $('btn-skip').hidden = !on;
  }

  flash() {
    const el = $('flash');
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  }

  popup(text, cls = '') {
    const el = document.createElement('span');
    el.className = 'popup ' + cls;
    el.textContent = text;
    $('fly-layer').appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  hint(html, ms = 4200) {
    const el = $('hint');
    el.innerHTML = html;
    el.hidden = false;
    clearTimeout(this.hintT);
    this.hintT = setTimeout(() => { el.hidden = true; }, ms);
  }

  hideHint() { $('hint').hidden = true; }

  setSound(on) {
    for (const id of ['btn-sound', 'btn-sound-2']) {
      const el = $(id);
      if (!el) continue;
      el.setAttribute('aria-pressed', String(on));
      el.querySelector('span').textContent = on ? 'Sound on' : 'Sound off';
    }
  }

  setBest(best, learned, total) {
    $('best-line').innerHTML = best.score > 0
      ? `Best run <b>${fmt(best.score)}</b> points · <b>${fmt(best.dist)}</b> m`
      : 'No runs yet. The road starts at Mount Ararat.';
    for (const id of ['btn-scroll', 'btn-scroll-2']) {
      const el = $(id);
      if (el) el.querySelector('span').textContent = `My scroll · ${learned}/${total}`;
    }
  }

  gameOver(s) {
    $('over-title').textContent = s.title;
    $('over-sub').textContent = s.sub;
    $('stat-score').textContent = fmt(s.score);
    $('stat-dist').textContent = fmt(s.dist) + ' m';
    $('stat-manna').textContent = fmt(s.manna);
    $('stat-words').textContent = String(s.words.length);
    $('over-best').hidden = !s.newBest;
    $('over-words').innerHTML = s.words.length
      ? s.words.map((w) => `<li><span lang="he" dir="rtl">${w.he}</span><span>${w.tr}</span><span>${w.en}</span></li>`).join('')
      : `<li class="empty">${s.partial ? `Almost there: you caught <span lang="he">${s.partial.split(' of ')[0]}</span> of <span lang="he">${s.partial.split(' of ')[1]}</span>.` : 'No words this run.'}</li>`;
  }

  renderScroll(words, learned) {
    $('scroll-count').textContent = `${learned.size} of ${words.length} words written`;
    $('scroll-list').innerHTML = words.map((w) => {
      const got = learned.has(w.he);
      return `<li class="${got ? 'got' : 'locked'}">
        <span class="sl-he" lang="he" dir="rtl">${got ? w.he : [...w.he].map(() => '·').join('')}</span>
        <span class="sl-tr">${got ? w.tr : 'Not yet written'}</span>
        <span class="sl-en">${w.en}</span></li>`;
    }).join('');
  }
}
