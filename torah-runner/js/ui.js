// DOM overlay: HUD, region banners, menus and the "My scroll" word list.
import { LETTER_NAMES, POWERS } from './data.js';

const $ = (id) => document.getElementById(id);
const HEART = '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21.2 2.9 12.3A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 9.1 7.7Z"/></svg>';
const fmt = (n) => Math.floor(n).toLocaleString('en-US');

export class UI {
  constructor(h) {
    this.h = h;
    this.last = {};
    this.screens = ['screen-loading', 'screen-start', 'screen-pause', 'screen-over', 'screen-scroll', 'screen-error'];
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

  hud(v) { $('hud').hidden = !v; if (!v) { $('banner').hidden = true; $('toast').hidden = true; } }

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

  setScore(v) { const s = fmt(v); if (this.last.score !== s) { this.last.score = s; $('score').textContent = s; } }
  setDist(m) { const s = fmt(m) + ' m'; if (this.last.dist !== s) { this.last.dist = s; $('dist').textContent = s; } }
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

  wordToast(word) {
    const el = $('toast');
    el.innerHTML = `<span class="toast-kicker">Word complete</span>
      <span class="toast-he" lang="he" dir="rtl">${word.he}</span>
      <span class="toast-tr">${word.tr} <em>means</em> ${word.en.toLowerCase()}</span>`;
    el.hidden = false;
    el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => { el.hidden = true; }, 2600);
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
      : 'No runs yet. The road starts in Egypt.';
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
