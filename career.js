/* =====================================================================
   Career slide: my route to Product Director (a van drives the CV).
   ===================================================================== */
(() => {
  'use strict';
  const FX = window.SLIDE_FX;
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const OUT = 'power3.out', BACK = 'back.out(1.7)', IO = 'power2.inOut';
  const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;

  /* ---------- route ---------- */
  const ROAD = 'M120 640 L278 640 C 440 640 460 560 619 560 C 780 560 800 640 960 640 C 1120 640 1140 560 1301 560 C 1462 560 1482 610 1642 610 L1800 610';
  const STOPS = [
    { x: 278, y: 640, ch: 'Build', yr: '2013', t: 'Economics grad → iOS engineer', s: 'UC Berkeley · a US startup', k: 'Speak engineer', ic: 'code', lg: [['berkeley', 36, 'berkeley-white']] },
    { x: 619, y: 560, ch: 'Grow', yr: '2014–17', t: 'Growth → head of growth, China', s: 'OneSky · Hong Kong + China', k: 'Numbers + a team', ic: 'chart', lg: [['onesky', 38]] },
    { x: 960, y: 640, ch: 'Scale', yr: '2017–18', t: 'Growth at global scale', s: 'Facebook · ByteDance (TikTok)', k: 'Speed at scale', ic: 'gauge', lg: [['facebook', 38], ['bytedance-mark', 35], ['tiktok', 36, 'tiktok-white']] },
    { x: 1301, y: 560, ch: 'Product', yr: '2018–23', t: 'Group product manager', s: 'GoGoVan → GoGoX · 4 markets', k: 'Own the customer problem', ic: 'target', lg: [['gogovan.png', 42], '→', ['#wordmark', 21]] },
    { x: 1642, y: 610, ch: 'Lead', yr: '2023–now', t: 'Head of Product → Director', s: 'Enterprise from zero · AI', k: 'Lead through others', ic: 'flag', lg: [['#wordmark', 28]] },
  ];
  // a logo, with a white variant for the dark stage when the original is too dark
  const logo = l => {
    if (typeof l === 'string') return `<span class="cr-to">${l}</span>`;
    const [f, h, dk] = l;
    if (f === '#wordmark') return `<svg class="cr-lg" viewBox="0 0 135 24" style="height:${h}px;width:${(h * 135 / 24).toFixed(0)}px"><use href="#g-wordmark"/></svg>`;
    const src = n => `img/logos/${n.includes('.') ? n : n + '.svg'}`;
    return dk ? `<img class="cr-lg lt" src="${src(f)}" style="height:${h}px" alt=""><img class="cr-lg dk" src="${src(dk)}" style="height:${h}px" alt="">` : `<img class="cr-lg" src="${src(f)}" style="height:${h}px" alt="">`;
  };
  const CARD_X = [120, 461, 802, 1143, 1484], CARD_W = 316, CARD_Y = 712;

  FX.career = (el, tl, A) => {
    const road = $(el, '#cr-road'), L = road.getTotalLength(), fr = el._fr;
    const van = $(el, '.cr-van-g'), at = { p: 0 };
    const place = () => { const pt = road.getPointAtLength(at.p * L); van.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); };
    place();
    const drive = (to, t0, dur) => tl.to(at, { p: to, duration: dur, ease: 'power2.inOut', onUpdate: place }, t0);
    tl.from([road, $(el, '.cr-dash')], { drawSVG: '0%', duration: 1.1, ease: IO }, .2);
    tl.from($$(el, '.cr-dot'), { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: BACK, stagger: .1 }, .7);
    tl.from($$(el, '.cr-pill'), { y: 12, opacity: 0, duration: .4, ease: OUT, stagger: .1 }, .8);
    tl.from($(el, '.cr-bag'), { y: -14, opacity: 0, duration: .5, ease: OUT }, .6);
    tl.from(van, { opacity: 0, duration: .3 }, .9);
    const slotChips = $$(el, '.cr-slot b'), cards = $$(el, '.cr-card'), links = $$(el, '.cr-link'), dots = $$(el, '.cr-dot'), pills = $$(el, '.cr-pill');
    const reach = (i, t0) => {
      tl.to(dots[i], { attr: { r: 20 }, duration: .25, ease: BACK }, t0)
        .set(dots[i], { attr: { class: 'cr-dot on' } }, t0)
        .set(pills[i], { attr: { class: 'abs cr-pill on' } }, t0)
        .from(links[i], { drawSVG: '0%', duration: .3 }, t0 + .05)
        .from(cards[i], { y: 40, opacity: 0, duration: .55, ease: OUT }, t0 + .15)
        .from(slotChips[i], { x: el._fly[i].dx, y: el._fly[i].dy, scale: .7, opacity: 0, duration: .8, ease: 'power3.inOut' }, t0 + .55)
        .set($$(el, '.cr-slot')[i], { attr: { class: 'cr-slot on' } }, t0 + 1.3);
    };
    drive(fr[0], 1.0, .9); reach(0, 1.8);
    for (let i = 1; i < STOPS.length; i++) {
      A.step();
      const t0 = tl.duration();
      drive(fr[i], t0, 1.1); reach(i, t0 + 1.0);
    }
    tl.to(slotChips, { y: -6, duration: .2, yoyo: true, repeat: 1, stagger: .06, ease: 'sine.inOut' }, tl.duration() + .1);
    A.loop(() => gsap.to($(el, '.cr-van-g .van'), { y: -1.5, duration: .22, yoyo: true, repeat: -1, ease: 'sine.inOut' }), 0);
    el._seek = k => A.seekStop(k);
  };
  FX.career.init = el => {
    const road = $(el, '#cr-road'); road.setAttribute('d', ROAD); $(el, '.cr-dash').setAttribute('d', ROAD);
    const L = road.getTotalLength();
    // where each stop sits along the road (0..1)
    // each stop ends a road segment, so measure the road up to it
    const segs = ROAD.match(/[MLC][^MLC]*/g), probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    $(el, '.cr-ov').appendChild(probe);
    el._fr = STOPS.map((s, i) => { probe.setAttribute('d', segs.slice(0, i + 2).join(' ')); return probe.getTotalLength() / L; });
    probe.remove();
    const NS = 'http://www.w3.org/2000/svg';
    STOPS.forEach((s, i) => {
      const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', s.x); c.setAttribute('cy', s.y); c.setAttribute('r', 15); c.setAttribute('class', 'cr-dot'); $(el, '.cr-stops').appendChild(c);
      const cx = CARD_X[i] + CARD_W / 2, l = document.createElementNS(NS, 'path');
      l.setAttribute('d', `M${s.x} ${s.y + 24} C ${s.x} ${s.y + 60} ${cx} ${CARD_Y - 40} ${cx} ${CARD_Y - 8}`); l.setAttribute('class', 'cr-link'); $(el, '.cr-links').appendChild(l);
    });
    $(el, '.cr-cards').innerHTML = STOPS.map((s, i) => `<div class="abs cr-card" data-ui data-i="${i}" style="left:${CARD_X[i]}px;top:${CARD_Y}px;width:${CARD_W}px">
        <div class="cr-ct"><span class="cr-lgs">${s.lg.map(logo).join('')}</span></div><b>${s.t}</b><span class="cr-co">${s.s}</span><em>${ic('spark')}${s.k}</em></div>`).join('')
      + STOPS.map((s, i) => `<button class="abs cr-pill" data-ui data-i="${i}" style="left:${s.x}px;top:${s.y - 98}px">${s.ch}</button>`).join('');
    $(el, '.cr-slots').innerHTML = STOPS.map(s => `<span class="cr-slot"><b>${ic(s.ic)}${s.k}</b></span>`).join('');
    // offsets for the skill chip to fly from its card into its slot
    el._fly = STOPS.map((s, i) => {
      const slot = $$(el, '.cr-slot')[i], bag = $(el, '.cr-bag');
      const sx = bag.offsetLeft + slot.offsetLeft + slot.offsetWidth / 2, sy = bag.offsetTop + slot.offsetTop + slot.offsetHeight / 2;
      const card = $$(el, '.cr-card')[i], em = card.querySelector('em');
      return { dx: CARD_X[i] + em.offsetLeft + em.offsetWidth / 2 - sx, dy: CARD_Y + em.offsetTop + em.offsetHeight / 2 - sy };
    });
    gsap.set($$(el, '.cr-pill'), { xPercent: -50 });
    el.addEventListener('click', e => {
      const t = e.target.closest('.cr-pill, .cr-card'); if (t && el._seek) el._seek(+t.dataset.i);
    });
  };

})();
