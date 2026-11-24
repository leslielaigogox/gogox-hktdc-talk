/* =====================================================================
   Deck engine: scaling, navigation, click-builds, theme, notes, menu.
   Keys:  → Space PageDown Enter = next build / slide   ← PageUp = back
          T theme   N notes   G slide list   F fullscreen   Home / End
   URL:   #12 opens slide 12   ?theme=dark   ?render=1 (no transitions)
   ===================================================================== */
(() => {
  'use strict';
  gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);
  const Q = new URLSearchParams(location.search);
  const RENDER = Q.has('render');
  const html = document.documentElement;
  const stage = document.getElementById('stage');
  const slides = Array.from(stage.querySelectorAll('.slide'));
  const N = slides.length;
  const FX = window.SLIDE_FX || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  /* ---------- theme ---------- */
  html.dataset.theme = Q.get('theme') || store.get('ggx-deck-theme') || 'light';
  function toggleTheme() {
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('ggx-deck-theme', html.dataset.theme);
    if (cur) go(idx, { force: true, fromEnd: true });
  }

  /* ---------- fit 1920×1080 into the window ---------- */
  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  addEventListener('resize', fit); fit();

  /* ---------- one-time DOM prep ---------- */
  slides.forEach(sl => sl.querySelectorAll('[data-split]').forEach(h => {
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="ln"><span>${l.trim()}</span></span>`).join('');
  }));
  document.querySelectorAll('[data-count]').forEach(el => { el.dataset.final = el.textContent; });
  slides.forEach(sl => { const f = FX[sl.dataset.fx]; if (f && f.init) f.init(sl); });

  const rawOf = p => { const r = MotionPathPlugin.getRawPath(p); MotionPathPlugin.cacheRawPathMeasurements(r); return r; };
  function place() {
    // SVG groups pinned to a point on a path
    document.querySelectorAll('[data-on]').forEach(g => {
      const p = document.getElementById(g.dataset.on); if (!p) return;
      const pt = MotionPathPlugin.getPositionOnPath(rawOf(p), parseFloat(g.dataset.at));
      g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    });
    // HTML cards pinned above / below a point on a path (roadmap)
    document.querySelectorAll('[data-near]').forEach(c => {
      const p = document.getElementById(c.dataset.near); if (!p) return;
      const pt = MotionPathPlugin.getPositionOnPath(rawOf(p), parseFloat(c.dataset.at));
      const w = c.offsetWidth || 300, h = c.offsetHeight || 140, up = c.classList.contains('up');
      const left = Math.max(120, Math.min(1800 - w, pt.x - w / 2));
      const top = up ? pt.y - 70 - h : pt.y + 66;
      c.style.left = left + 'px'; c.style.top = top + 'px';
      c.style.setProperty('--cx', (pt.x - left) + 'px');
      c.style.setProperty('--l', (up ? (pt.y - 24) - (top + h + 10) : (top - 10) - (pt.y + 24)) + 'px');
    });
    // arrowheads at the end of every .flow path
    document.querySelectorAll('path.flow').forEach(p => {
      const r = rawOf(p), end = MotionPathPlugin.getPositionOnPath(r, 1, true);
      if (!p._ah) {
        p._ah = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p._ah.setAttribute('class', 'ah'); p._ah.setAttribute('d', 'M-13 -7.5 L1 0 L-13 7.5 Z');
        p.parentNode.insertBefore(p._ah, p.nextSibling);
      }
      p._ah.setAttribute('transform', `translate(${end.x.toFixed(1)} ${end.y.toFixed(1)}) rotate(${end.angle.toFixed(1)})`);
    });
  }
  place();

  /* ---------- chrome: route progress ---------- */
  const chrome = document.getElementById('chrome');
  const chDone = chrome.querySelector('.ch-done'), chVan = chrome.querySelector('.ch-van-g');
  const chCount = chrome.querySelector('.ch-count'), chSec = chrome.querySelector('.ch-sec');
  const RX0 = 360, RX1 = 1400;
  chrome.querySelector('.ch-base').setAttribute('d', `M${RX0} 44 H ${RX1}`);
  chDone.setAttribute('d', `M${RX0} 44 H ${RX1}`);
  const xAt = i => RX0 + (RX1 - RX0) * i / (N - 1);
  const dividers = slides.map((s, i) => s.classList.contains('divider') ? i : -1).filter(i => i >= 0);
  chrome.querySelector('.ch-stops').innerHTML = dividers.map(i => `<circle class="ch-stop" data-i="${i}" cx="${xAt(i)}" cy="44" r="7"/>`).join('');
  function updateChrome() {
    const x = xAt(idx);
    gsap.to(chVan, { x, y: 44, duration: RENDER ? 0 : .8, ease: 'power2.inOut' });
    gsap.to(chDone, { drawSVG: `0% ${(idx / (N - 1)) * 100}%`, duration: RENDER ? 0 : .8, ease: 'power2.inOut' });
    chrome.querySelectorAll('.ch-stop').forEach(c => c.classList.toggle('on', +c.dataset.i <= idx));
    chCount.textContent = String(idx + 1).padStart(2, '0') + ' / ' + N;
    chSec.textContent = slides[idx].dataset.section || '';
  }

  /* ---------- per-slide state ---------- */
  let idx = -1, cur = null;
  const pendingOut = new Map();

  function makeApi(st) {
    return {
      step() { st.stops.push(st.tl.duration()); },
      onLeave(fn) { st.cleanups.push(fn); },
      stopIndex() { return st.si; },
      loop(fn, at) { st.loops.push({ fn, at: at == null ? st.stops.length : at, sub: null }); },
      count(el, at, dur = 1.4) {
        const fin = el.dataset.final || el.textContent, m = fin.match(/[\d][\d,]*(\.\d+)?/);
        if (!m) return;
        const target = parseFloat(m[0].replace(/,/g, '')), dec = (m[1] || '').length - (m[1] ? 1 : 0);
        const pre = fin.slice(0, m.index), post = fin.slice(m.index + m[0].length), o = { v: 0 };
        const fmt = v => pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post;
        st.tl.fromTo(o, { v: 0 }, { v: target, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(o.v); } }, at);
        st.counts.push(el);
      },
      seekStop(k) {
        k = Math.max(0, Math.min(st.stops.length - 1, k));
        st.tl.eventCallback('onUpdate', null);
        stopLoopsAbove(st, k);
        st.si = k;
        st.tl.tweenTo(st.stops[k], { duration: .9, ease: 'power2.inOut', onComplete: () => reached(st, k) });
      },
    };
  }
  function startLoops(st, k) {
    st.loops.forEach(L => {
      if (!L.sub && L.at <= k) st.ctx.add(() => { L.sub = gsap.context(L.fn); });
    });
  }
  function stopLoopsAbove(st, k) {
    st.loops.forEach(L => { if (L.sub && L.at > k) { L.sub.revert(); L.sub = null; } });
  }
  function reached(st, k) { startLoops(st, k); }

  function intro(el, tl) {
    const lines = el.querySelectorAll('.hd .ln > span');
    if (lines.length) tl.from(lines, { yPercent: 115, duration: .85, ease: 'power4.out', stagger: .09 }, .05);
    const sub = el.querySelectorAll('.hd .sub, .hd .kick');
    if (sub.length) tl.from(sub, { y: 18, opacity: 0, duration: .6, ease: 'power2.out', stagger: .08 }, .3);
  }

  function finishOut(el) {
    const p = pendingOut.get(el); if (!p) return;
    pendingOut.delete(el); p.tween.kill(); p.cleanup();
  }

  function leave(st, fade) {
    const el = st.el;
    st.tl.eventCallback('onUpdate', null);
    st.tl.pause();
    el.classList.remove('is-active');
    el.dispatchEvent(new CustomEvent('deck:leave'));
    st.cleanups.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    const cleanup = () => {
      el.classList.remove('was-active');
      st.ctx.revert();
      st.counts.forEach(c => { c.textContent = c.dataset.final; });
      gsap.set(el, { clearProps: 'opacity' });
    };
    if (fade && !RENDER && !reduce) {
      el.classList.add('was-active');
      const tween = gsap.to(el, { opacity: 0, duration: .32, ease: 'power1.in', onComplete: () => { pendingOut.delete(el); cleanup(); } });
      pendingOut.set(el, { tween, cleanup });
    } else cleanup();
  }

  function go(n, opt = {}) {
    n = Math.max(0, Math.min(N - 1, n));
    if (n === idx && !opt.force) return;
    if (cur) leave(cur, n !== idx);
    finishOut(slides[n]);
    idx = n;
    const el = slides[n];
    el.classList.add('is-active');
    document.body.classList.toggle('on-dark', el.classList.contains('dark'));
    const st = cur = { el, stops: [], si: 0, loops: [], counts: [], cleanups: [], tl: null, ctx: null };
    st.ctx = gsap.context(() => {
      st.tl = gsap.timeline({ paused: true });
      const A = makeApi(st);
      intro(el, st.tl);
      const f = FX[el.dataset.fx];
      if (f) f(el, st.tl, A);
    }, el);
    const end = st.tl.duration();
    st.stops.push(end);
    st.stops = [...new Set(st.stops.map(t => +t.toFixed(4)))].sort((a, b) => a - b);
    if (opt.fromEnd || reduce) finish(st);
    else playTo(st, 0);
    if (!RENDER && !reduce) gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: .4, ease: 'power1.out' });
    updateChrome(); updateNotes(); markMenu();
    if (!RENDER) history.replaceState(null, '', '#' + (n + 1));
  }

  function playTo(st, k) {
    st.si = k;
    const t = st.stops[k], tl = st.tl;
    tl.eventCallback('onUpdate', null);
    if (tl.time() >= t - 1e-4) { tl.pause(t); reached(st, k); return; }
    tl.eventCallback('onUpdate', () => {
      if (tl.time() >= t - 1e-4) { tl.eventCallback('onUpdate', null); tl.pause(t); reached(st, k); }
    });
    tl.play();
  }
  function finish(st) {
    st.tl.eventCallback('onUpdate', null);
    st.tl.progress(1).pause();
    st.si = st.stops.length - 1;
    st.counts.forEach(c => { c.textContent = c.dataset.final; });
    reached(st, st.si);
  }

  function next() {
    if (!cur) return;
    const st = cur, tl = st.tl;
    if (tl.isActive()) {                       // mid-animation: finish this build
      tl.eventCallback('onUpdate', null);
      tl.pause(st.stops[st.si]);
      if (st.si === st.stops.length - 1) st.counts.forEach(c => { c.textContent = c.dataset.final; });
      reached(st, st.si);
      return;
    }
    if (st.si < st.stops.length - 1) { playTo(st, st.si + 1); return; }
    if (idx < N - 1) go(idx + 1);
  }
  function prev() {
    if (!cur) return;
    const st = cur;
    if (st.si > 0 && !st.tl.isActive()) {      // step back one build
      stopLoopsAbove(st, st.si - 1);
      st.si--; st.tl.pause(st.stops[st.si]);
      return;
    }
    if (idx > 0) go(idx - 1, { fromEnd: true });
  }

  /* ---------- notes ---------- */
  const notes = document.getElementById('notes'), ntTitle = notes.querySelector('.nt-title'),
    ntBody = notes.querySelector('.nt-body'), ntTime = notes.querySelector('.nt-time');
  let t0 = null;
  function updateNotes() {
    ntTitle.textContent = `${idx + 1} / ${N}  ${slides[idx].dataset.title || ''}`;
    ntBody.textContent = slides[idx].dataset.notes || '';
    if (t0 === null && idx > 0) t0 = Date.now();
  }
  setInterval(() => {
    if (t0 === null) return;
    const s = Math.floor((Date.now() - t0) / 1000);
    ntTime.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }, 1000);
  const toggleNotes = () => { notes.hidden = !notes.hidden; };

  /* ---------- slide menu ---------- */
  const menu = document.getElementById('menu'), mlist = menu.querySelector('.mn-list');
  mlist.innerHTML = slides.map((s, i) => `<button data-go="${i}"><i>${i + 1}</i>${s.dataset.title || ''}</button>`).join('');
  mlist.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) { menu.hidden = true; go(+b.dataset.go); } });
  menu.addEventListener('click', e => { if (e.target === menu) menu.hidden = true; });
  function markMenu() { mlist.querySelectorAll('button').forEach((b, i) => b.classList.toggle('cur', i === idx)); }
  const toggleMenu = () => { menu.hidden = !menu.hidden; };

  const toggleFS = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  };

  /* ---------- input ---------- */
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (window.closeLightbox && window.closeLightbox()) { e.preventDefault(); return; }
    const modal = cur && cur.el.querySelector('.bd-modal.open');
    if (modal) { if (e.key === 'Escape' || e.key === 'Backspace') { cur.el._closeModal && cur.el._closeModal(); e.preventDefault(); } return; }
    if (!menu.hidden) { if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') menu.hidden = true; return; }
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown': case 'Enter': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); prev(); break;
      case 'Home': go(0); break;
      case 'End': go(N - 1, { fromEnd: true }); break;
      case 't': case 'T': toggleTheme(); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'g': case 'G': case 'Escape': toggleMenu(); break;
      case 'f': case 'F': toggleFS(); break;
    }
  });
  document.getElementById('viewport').addEventListener('click', e => {
    if (e.target.closest('[data-ui], button, a, #menu, #notes')) return;
    next();
  });
  let tx = null;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  });

  const hint = document.getElementById('hint');
  if (RENDER) hint.remove(); else setTimeout(() => hint.classList.add('gone'), 6000);

  /* ---------- test hooks (used by the render checks) ---------- */
  window.deck = {
    N, go: (n, o) => go(n, o), next, prev,
    finish: () => cur && finish(cur),
    seek: t => { if (cur) { cur.tl.eventCallback('onUpdate', null); cur.tl.pause(t); } },
    info: () => cur && ({ idx, stops: cur.stops, dur: cur.tl.duration(), si: cur.si }),
    freeze: () => gsap.globalTimeline.pause(), thaw: () => gsap.globalTimeline.resume(),
  };

  addEventListener('hashchange', () => {
    const n = (parseInt(location.hash.slice(1), 10) || 1) - 1;
    if (n !== idx) go(n);
  });
  const startAt = Math.max(0, Math.min(N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  const begin = () => { place(); go(startAt); window.__ready = true; };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(begin);
})();
