/* =====================================================================
   Design section: gallery, team, PM+design baton, tokens, theming,
   Figma component + code. Same builder contract as slides.js.
   ===================================================================== */
(() => {
  'use strict';
  const FX = window.SLIDE_FX;
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const OUT = 'power3.out', BACK = 'back.out(1.7)', IO = 'power2.inOut';
  const rise = (tl, t, at, o = {}) => tl.from(t, Object.assign({ y: 24, opacity: 0, duration: .55, ease: OUT, stagger: .08 }, o), at);
  const pop = (tl, t, at, o = {}) => tl.from(t, Object.assign({ scale: 0, opacity: 0, duration: .45, ease: BACK, stagger: .08, transformOrigin: '50% 50%' }, o), at);
  const draw = (tl, t, at, o = {}) => tl.from(t, Object.assign({ drawSVG: '0%', duration: .9, ease: IO, stagger: .1 }, o), at);
  const scale = () => document.getElementById('stage').getBoundingClientRect().width / 1920;
  // element box in stage coordinates, relative to `ref`
  const box = (e, ref) => {
    const s = scale(), r = e.getBoundingClientRect(), b = ref.getBoundingClientRect();
    const l = (r.left - b.left) / s, t = (r.top - b.top) / s, w = r.width / s, h = r.height / s;
    return { l, t, w, h, r: l + w, b: t + h, cx: l + w / 2, cy: t + h / 2 };
  };
  const curve = (x1, y1, x2, y2) => { const dx = (x2 - x1) * .5; return `M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + dx).toFixed(1)} ${y1.toFixed(1)} ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`; };
  const glow = (c, a = .55) => `0 0 0 6px rgba(${c},${a})`;
  const noGlow = c => `0 0 0 0px rgba(${c},0)`;

  /* ---------------------------------------------------------------- lightbox (any [data-zoom]) */
  const lb = document.querySelector('.lb');
  if (lb) {
    const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    document.addEventListener('click', e => {
      const z = e.target.closest('[data-zoom]');
      if (z && !lb.classList.contains('open')) {
        img.src = z.getAttribute('src'); cap.textContent = z.dataset.zoom || '';
        lb.classList.add('open');
        gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: .25 });
        gsap.fromTo(lb.querySelector('figure'), { scale: .9, y: 20 }, { scale: 1, y: 0, duration: .4, ease: BACK });
        e.stopPropagation(); return;
      }
      if (e.target.closest('.lb')) { window.closeLightbox(); e.stopPropagation(); }
    }, true);
    window.closeLightbox = () => {
      if (!lb.classList.contains('open')) return false;
      gsap.to(lb, { opacity: 0, duration: .2, onComplete: () => { lb.classList.remove('open'); gsap.set(lb, { clearProps: 'opacity' }); } });
      return true;
    };
  }

  /* ---------------------------------------------------------------- token-driven phone mock */
  const L = (en, zh) => `data-en="${en}" data-zh="${zh}"`;
  const row = (ic, en, zh, sen, szh, price, sel) => `<div class="mk-row${sel ? ' sel' : ''}"><span class="mk-ic"><svg class="ic"><use href="#i-${ic}"/></svg></span><div><b ${L(en, zh)}>${en}</b><span ${L(sen, szh)}>${sen}</span></div><strong>${price}</strong>${sel ? '<i class="mk-tick"><svg class="ic"><use href="#i-check"/></svg></i>' : ''}</div>`;
  const MOCK = `<div class="mk"><div class="mk-scr">
    <div class="mk-sb"><b>9:41</b><span><i></i><i></i><i></i></span></div>
    <div class="mk-hd"><svg class="ic"><use href="#i-chev-l"/></svg><b ${L('Choose a vehicle', '選擇車型')}>Choose a vehicle</b></div>
    <div class="mk-date"><svg class="ic"><use href="#i-cal"/></svg><span ${L('Today, as soon as possible', '今日，儘快')}>Today, as soon as possible</span><svg class="ic mk-chev"><use href="#i-chev"/></svg></div>
    <div class="mk-sec" ${L('Vehicle', '車型')}>Vehicle</div>
    ${row('moto', 'Courier', '速遞員', 'Up to 20 kg', '20公斤以內', '$50')}
    ${row('van', 'Van', '貨Van', '5.5 × 4 × 4 ft, 700 kg', '5.5×4×4呎，載重700公斤', '$55', true)}
    ${row('truck', '5.5-tonne truck', '5.5噸貨車', '12–15 ft, 1–3 t', '12–15呎，載重1–3噸', '$135')}
    ${row('truck', '9-tonne truck', '9噸貨車', '15–19 ft, 3–5.5 t', '15–19呎，載重3–5.5噸', '$225')}
    <div class="mk-chips"><span class="mk-chip">＋ <i ${L('Premium van', '尊尚貨Van')}>Premium van</i> +$20</span></div>
    <div class="mk-btn" ${L('Next', '下一步')}>Next</div>
  </div></div>`;
  document.querySelectorAll('[data-mock]').forEach(h => { h.innerHTML = MOCK; });

  /* ---------------------------------------------------------------- D1 gallery */
  FX.gallery = (el, tl, A) => {
    el._api = A;
    const ph = $$(el, '.gl-apps .gl-ph'), bw = $$(el, '.gl-web .gl-bw');
    rise(tl, $(el, '.gl-tabs'), .4, { y: -10 });
    tl.fromTo(ph, { y: 170, autoAlpha: 0, rotation: i => (i - 2.5) * 5 }, { y: 0, autoAlpha: 1, rotation: 0, duration: .9, ease: 'back.out(1.2)', stagger: .09 }, .45);
    tl.from(ph.map(p => p.querySelector('figcaption')), { opacity: 0, y: 12, duration: .4, stagger: .09 }, 1.05);
    A.step();
    const T = tl.duration();
    tl.to(ph, { x: -140, autoAlpha: 0, duration: .45, ease: 'power2.in', stagger: .035 }, T)
      .from($(el, '.gl-knob'), { x: -120, width: 120, duration: .5, ease: IO }, T)
      .from(bw, { x: 180, autoAlpha: 0, duration: .7, ease: OUT, stagger: .08 }, T + .3)
      .from(bw.map(b => b.querySelector('figcaption')), { opacity: 0, duration: .4, stagger: .08 }, T + .7);
    A.loop(() => gsap.to(ph.map(p => p.querySelector('.ph')), { y: -9, duration: 2.1, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: .3, from: 'random' } }), 0);
    A.loop(() => gsap.to(bw.map(b => b.querySelector('img')), { objectPosition: '50% 100%', duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .7 }), 1);
  };
  FX.gallery.init = el => el.addEventListener('click', e => {
    const b = e.target.closest('.gl-tabs button'); if (b && el._api) el._api.seekStop(+b.dataset.k);
  });

  /* ---------------------------------------------------------------- D2 design team */
  FX.dteam = (el, tl, A) => {
    const cols = $$(el, '.dt-col');
    rise(tl, cols, .35, { y: 40, stagger: .12, duration: .6 });
    tl.from($$(el, '.th-ph'), { y: 30, rotation: -8, opacity: 0, duration: .6, ease: 'back.out(1.4)', stagger: .12 }, .6)
      .from($$(el, '.th-web, .sys-btns'), { x: 30, opacity: 0, duration: .6, ease: OUT, stagger: .12 }, .7)
      .from($$(el, '.sys-sw i'), { scale: 0, duration: .4, ease: BACK, stagger: .06 }, 1.0);
    pop(tl, $$(el, '.tag-y'), 1.0, { stagger: .12 });
    rise(tl, $$(el, '.dt-p span'), 1.1, { y: 10, stagger: .04, duration: .35 });
    draw(tl, $$(el, '.dt-link'), 1.5, { duration: .4, stagger: .08 });
    rise(tl, $(el, '.dt-band'), 1.75, { y: 20 });
    rise(tl, $$(el, '.dt-band > *'), 1.9, { y: 10, stagger: .07, duration: .35 });
    rise(tl, $(el, '.tl-y'), 2.3, { y: 10 });
    rise(tl, $$(el, '.tc'), 2.35, { y: 16, stagger: .07, duration: .4 });
    const T = 3.1;
    tl.from($$(el, '.tc-in'), { rotationX: -180, duration: .8, ease: 'back.out(1.3)', stagger: .1 }, T)
      .from($(el, '.tl-y .y26'), { opacity: 0, y: 12, duration: .4 }, T + .2)
      .from($(el, '.tl-y .y22'), { opacity: 1, duration: .3 }, T);
    A.loop(() => {
      gsap.timeline({ repeat: -1, repeatDelay: 3.6, delay: 3 })
        .to($$(el, '.tc-in'), { rotationX: -180, duration: .7, ease: IO, stagger: .07 })
        .to($(el, '.tl-y .y26'), { opacity: 0, duration: .3 }, '<')
        .to($(el, '.tl-y .y22'), { opacity: 1, duration: .3 }, '<')
        .to($$(el, '.tc-in'), { rotationX: 0, duration: .7, ease: IO, stagger: .07 }, '+=1.8')
        .to($(el, '.tl-y .y22'), { opacity: 0, duration: .3 }, '<')
        .to($(el, '.tl-y .y26'), { opacity: 1, duration: .3 }, '<');
    });
  };

  /* ---------------------------------------------------------------- D3 PM + design baton */
  const BT_X = [370, 536, 702, 868, 1034, 1200, 1366, 1532, 1698], BT_Y = { pm: 420, tg: 580, pd: 740 };
  const BT_STAGES = ['Brief', 'Scope', 'Discover', 'Shape', 'Crit', 'Spec', 'Handoff', 'QA', 'Launch'];
  const BT_CARDS = [[0, 'pm', 'Problem brief and metric'], [0, 'tg', 'Kickoff'], [1, 'pd', 'Scope check', 1],
    [2, 'tg', 'User interviews'], [2, 'pd', 'Research synthesis'], [3, 'pm', 'Trade-offs and scope'], [3, 'pd', 'Flows and options'],
    [4, 'pd', 'Design crit'], [5, 'pm', 'PRD'], [5, 'tg', 'Prototype test'], [5, 'pd', 'Hi-fi and prototype'],
    [6, 'pm', 'Tickets'], [6, 'pd', 'Handoff review'], [7, 'pd', 'Design QA', 1], [7, 'tg', 'Joint sign-off'],
    [8, 'pm', 'Launch readout'], [8, 'tg', 'Go or no-go']];
  const BT_PATH = [[0, 'pm'], [0, 'tg'], [1, 'pd'], [2, 'tg'], [3, 'pd'], [4, 'pd'], [5, 'tg'], [6, 'pd'], [7, 'pd'], [7, 'tg'], [8, 'pm']];
  FX.baton = (el, tl, A) => {
    const cards = $$(el, '.bt-card'), find = (s, l) => cards.find(c => +c.dataset.s === s && c.dataset.l === l);
    const pts = BT_PATH.map(([s, l]) => [BT_X[s], BT_Y[l]]);
    const d = 'M' + pts.map(p => p.join(' ')).join(' L');
    const path = $(el, '#bt-path'); path.setAttribute('d', d);
    const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = segs.reduce((a, b) => a + b, 0);
    tl.from($$(el, '.lane-ln'), { drawSVG: '0%', duration: .8, ease: IO, stagger: .1 }, .3);
    rise(tl, $$(el, '.bt-lab'), .4, { x: -20, y: 0, stagger: .1 });
    rise(tl, $$(el, '.bt-st'), .6, { y: -12, stagger: .05, duration: .4 });
    tl.from(cards, { scale: .6, opacity: 0, duration: .4, ease: BACK, stagger: i => +cards[i].dataset.s * .09 + (BT_Y[cards[i].dataset.l] - 420) / 3000 }, .8);
    const dot = $(el, '.bt-dot'), RUN = 5.2, t0 = 1.9;
    tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: .2 }, t0)
      .from(path, { drawSVG: '0%', duration: RUN, ease: 'none' }, t0)
      .to(dot, { motionPath: { path, align: path, alignOrigin: [.5, .5] }, duration: RUN, ease: 'none' }, t0);
    let acc = 0;
    BT_PATH.forEach(([s, l], i) => {
      if (i) acc += segs[i - 1];
      const c = find(s, l); if (!c) return;
      const t = t0 + RUN * acc / total;
      tl.fromTo(c, { boxShadow: noGlow('0,136,191') }, { boxShadow: glow('0,136,191'), duration: .2, yoyo: true, repeat: 1 }, t - .05);
    });
    rise(tl, $$(el, '.bt-rules span'), t0 + RUN - .2, { stagger: .12 });
    A.loop(() => {
      const t = gsap.timeline({ repeat: -1, repeatDelay: 1.4, delay: .8 });
      t.to(dot, { motionPath: { path, align: path, alignOrigin: [.5, .5], start: 0, end: 1 }, duration: RUN, ease: 'none' }, 0);
      let a = 0;
      BT_PATH.forEach(([s, l], i) => {
        if (i) a += segs[i - 1];
        const c = find(s, l); if (c) t.fromTo(c, { boxShadow: noGlow('0,136,191') }, { boxShadow: glow('0,136,191', .45), duration: .2, yoyo: true, repeat: 1 }, RUN * a / total - .05);
      });
    });
  };
  FX.baton.init = el => {
    $(el, '.bt-stages').innerHTML = BT_STAGES.map((n, i) => `<div class="bt-st" style="left:${BT_X[i] - 75}px"><i>${i + 1}</i>${n}</div>`).join('');
    $(el, '.bt-cards').innerHTML = BT_CARDS.map(([s, l, t, ai]) => `<div class="bt-card ${l}" data-s="${s}" data-l="${l}" style="left:${BT_X[s] - 75}px;top:${BT_Y[l] - 38}px">${ai ? '<svg class="ic"><use href="#i-spark"/></svg>' : ''}${t}</div>`).join('');
  };

  /* ---------------------------------------------------------------- D4 tokens */
  const CHAINS = [['a', '.mk-btn', '#0088BF', '0,136,191'], ['b', '.mk-row.sel', '#F5C400', '245,196,0'], ['c', '.mk-date', '#98A2B3', '152,162,179'], ['d', '.mk-chip', 'var(--ink)', '0,18,26']];
  FX.tokens = (el, tl, A) => {
    const links = $(el, '.tk-links'), hots = $(el, '.tk-hots'), ns = 'http://www.w3.org/2000/svg';
    links.innerHTML = ''; hots.innerHTML = '';
    const chainEls = CHAINS.map(([c, sel, col]) => {
      const pr = $(el, `.pr[data-c="${c}"]`), se = $(el, `.se[data-c="${c}"]`), cp = $(el, `.cp[data-c="${c}"]`), tg = $(el, `.tk-screen ${sel}`);
      const P = box(pr, el), S = box(se, el), C = box(cp, el), G = box(tg, el);
      const ds = [curve(P.r + 4, P.cy, S.l - 4, S.cy), curve(S.r + 4, S.cy, C.l - 4, C.cy), curve(C.r + 4, C.cy, G.l - 2, G.cy)];
      const mk = (cls, dd) => { const p = document.createElementNS(ns, 'path'); p.setAttribute('class', cls); p.setAttribute('d', dd); if (cls === 'tk-hot') p.style.stroke = col; return p; };
      const base = ds.map(dd => links.appendChild(mk('tk-link', dd)));
      const hot = ds.map(dd => hots.appendChild(mk('tk-hot', dd)));
      return { pr, se, cp, tg, base, hot };
    });
    rise(tl, $$(el, '.tk-colh'), .3, { y: 12, stagger: .1 });
    rise(tl, $$(el, '.pr'), .45, { x: -24, y: 0, stagger: .05, duration: .4 });
    pop(tl, $$(el, '.pr i'), .5, { stagger: .05, duration: .35 });
    rise(tl, $$(el, '.pr-shapes .sh'), .9, { y: 10, stagger: .06, duration: .35 });
    rise(tl, $$(el, '.se'), .8, { x: -20, y: 0, stagger: .05, duration: .4 });
    rise(tl, $$(el, '.cp'), 1.2, { y: 20, stagger: .1 });
    rise(tl, $(el, '.tk-screen'), 1.4, { y: 40, duration: .7 });
    rise(tl, $$(el, '.tk-screen .mk-row, .tk-screen .mk-date, .tk-screen .mk-chip, .tk-screen .mk-btn'), 1.75, { y: 14, stagger: .06, duration: .35 });
    chainEls.forEach((ch, i) => draw(tl, ch.base, 1.6 + i * .15, { duration: .6, stagger: .12 }));
    A.loop(() => {
      const t = gsap.timeline({ repeat: -1 });
      chainEls.forEach((ch, i) => {
        const rgb = CHAINS[i][3], at = i * 2.6;
        t.set(ch.hot, { opacity: 1, drawSVG: '0%' }, at);
        [ch.pr, ch.se, ch.cp, ch.tg].forEach((e, k) => {
          if (k) t.to(ch.hot[k - 1], { drawSVG: '100%', duration: .45, ease: 'power1.inOut' }, at + (k - 1) * .45);
          t.fromTo(e, { boxShadow: noGlow(rgb) }, { boxShadow: glow(rgb, .5), duration: .22, yoyo: true, repeat: 1 }, at + k * .45);
        });
        t.to(ch.hot, { opacity: 0, duration: .5 }, at + 2.0);
      });
    });
  };

  /* ---------------------------------------------------------------- D5 theme + language */
  const THEMES = {
    gogox: { '--t-action': '#0088BF', '--t-on-action': '#FFFFFF', '--t-selected': '#FFDD00', '--t-on-selected': '#00121A', '--t-surface': '#FFFFFF', '--t-subtle': '#F3F7F8', '--t-text': '#00121A', '--t-muted': '#667085', '--t-border': '#E3E7EC', '--t-icon-bg': '#E4F2F9', '--t-radius': '16px' },
    amigo: { '--t-action': '#9F2AE5', '--t-on-action': '#FFFFFF', '--t-selected': '#FF00FF', '--t-on-selected': '#FFFFFF', '--t-surface': '#FFFFFF', '--t-subtle': '#F7F0FD', '--t-text': '#1B1033', '--t-muted': '#6E6385', '--t-border': '#E6DAF5', '--t-icon-bg': '#F3E6FC', '--t-radius': '22px' },
    dark: { '--t-action': '#21A8E0', '--t-on-action': '#00121A', '--t-selected': '#FFDD00', '--t-on-selected': '#00121A', '--t-surface': '#0B2E3F', '--t-subtle': '#06212E', '--t-text': '#ECF4F7', '--t-muted': '#8EA3AF', '--t-border': '#1C4356', '--t-icon-bg': '#123E52', '--t-radius': '16px' },
  };
  const T_KEYS = { action: '--t-action', selected: '--t-selected', surface: '--t-surface', subtle: '--t-subtle', text: '--t-text' };
  const T_ORDER = ['gogox', 'amigo', 'dark'];
  const setTxt = (e, txt, animate) => {
    if (e.textContent === txt) return;
    if (!animate) { e.textContent = txt; return; }
    gsap.to(e, { opacity: 0, y: -6, duration: .14, onComplete: () => { e.textContent = txt; gsap.fromTo(e, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .2 }); } });
  };
  function applyTheme(el, name, dur = .7) {
    el._theme = name;
    const th = THEMES[name];
    gsap.to(el, Object.assign({ duration: dur, ease: IO, overwrite: 'auto' }, th));
    Object.entries(T_KEYS).forEach(([k, v]) => setTxt($(el, `.tt[data-k="${k}"] span`), th[v], dur > 0));
    setTxt($(el, '.tt[data-k="radius"] span'), th['--t-radius'].replace('px', ' px'), dur > 0);
    $$(el, '.th-themes button').forEach(b => b.classList.toggle('on', b.dataset.t === name));
    gsap.to($(el, '.th-knob'), { x: T_ORDER.indexOf(name) * 120, duration: dur ? .45 : 0, ease: IO });
    const g = $(el, '.tr-shot.ggx'), a = $(el, '.tr-shot.ami');
    const on = { opacity: 1, scale: 1, filter: 'grayscale(0)' }, off = { opacity: .4, scale: .95, filter: 'grayscale(.6)' };
    gsap.to(g, Object.assign({ duration: dur ? .5 : 0 }, name === 'amigo' ? off : on));
    gsap.to(a, Object.assign({ duration: dur ? .5 : 0 }, name === 'gogox' ? off : on));
  }
  function applyLang(el, lang, animate = true) {
    el._lang = lang;
    $$(el, '[data-en]').forEach(e => setTxt(e, lang === 'zh' ? e.dataset.zh : e.dataset.en, animate));
    setTxt($(el, '.tt[data-k="lang"] span'), lang === 'zh' ? 'zh-HK' : 'en-HK', animate);
    setTxt($(el, '.tt i.lng'), lang === 'zh' ? '中' : 'Aa', animate);
    $$(el, '.th-langs button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    gsap.to($(el, '.th-lknob'), { x: lang === 'zh' ? 90 : 0, duration: animate ? .4 : 0, ease: IO });
  }
  FX.theme = (el, tl, A) => {
    Object.keys(THEMES.gogox).forEach(k => el.style.removeProperty(k));
    applyTheme(el, 'gogox', 0); applyLang(el, 'en', false);
    rise(tl, $(el, '.th-ctl'), .35, { y: -10 });
    rise(tl, $(el, '.th-phone'), .5, { y: 50, duration: .8 });
    rise(tl, $$(el, '.th-phone .mk-row, .th-phone .mk-date, .th-phone .mk-chip, .th-phone .mk-btn'), .9, { y: 14, stagger: .06, duration: .35 });
    rise(tl, $(el, '.tt-h'), .7, { y: 10 });
    rise(tl, $$(el, '.tt'), .8, { x: -20, y: 0, stagger: .06, duration: .4 });
    pop(tl, $$(el, '.tt i'), .9, { stagger: .06, duration: .35 });
    rise(tl, $(el, '.tr-h'), 1.0, { y: 10 });
    tl.from($$(el, '.tr-shot'), { y: 80, opacity: 0, rotation: (i) => i ? 6 : -6, duration: .8, ease: 'back.out(1.3)', stagger: .15 }, 1.1);
    A.loop(() => {
      el._auto = gsap.timeline({ repeat: -1, delay: 1.2 })
        .call(() => applyTheme(el, 'amigo'))
        .call(() => applyLang(el, 'zh'), null, '+=2.6')
        .call(() => applyTheme(el, 'dark'), null, '+=2.6')
        .call(() => applyLang(el, 'en'), null, '+=2.6')
        .call(() => applyTheme(el, 'gogox'), null, '+=2.6')
        .to({}, { duration: 2.6 });
    });
  };
  FX.theme.init = el => el.addEventListener('click', e => {
    const t = e.target.closest('.th-themes button'), l = e.target.closest('.th-langs button');
    if (!t && !l) return;
    if (el._auto) { el._auto.kill(); el._auto = null; }
    if (t) applyTheme(el, t.dataset.t);
    if (l) applyLang(el, l.dataset.l);
  });

})();
