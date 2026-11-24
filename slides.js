/* =====================================================================
   Per-slide animation builders.
   FX[name](el, tl, A)  — adds tweens to the slide's paused timeline.
     A.step()           — a click-build pause at the current end of tl
     A.loop(fn, at)     — ambient motion, started once stop `at` is reached
     A.count(el, t, d)  — count a number up to its final text
     A.seekStop(k)      — jump (animated) to build k, for on-slide toggles
   FX[name].init(el)    — one-time DOM setup and event wiring
   Natural (no-JS) state of every element is its finished state; entrances
   use from()-tweens so a failed script still shows the whole slide.
   ===================================================================== */
(() => {
  'use strict';
  const FX = window.SLIDE_FX = {};
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const OUT = 'power3.out', BACK = 'back.out(1.7)', IO = 'power2.inOut';
  const css = (el, v) => getComputedStyle(el).getPropertyValue(v).trim();
  const rise = (tl, t, at, o = {}) => tl.from(t, Object.assign({ y: 24, opacity: 0, duration: .55, ease: OUT, stagger: .08 }, o), at);
  const pop = (tl, t, at, o = {}) => tl.from(t, Object.assign({ scale: 0, opacity: 0, duration: .45, ease: BACK, stagger: .08, transformOrigin: '50% 50%' }, o), at);
  const draw = (tl, t, at, o = {}) => tl.from(t, Object.assign({ drawSVG: '0%', duration: .9, ease: IO, stagger: .1 }, o), at);
  const mp = (path, s, e, o = {}) => ({ motionPath: Object.assign({ path, align: path, alignOrigin: [.5, .5], start: s, end: e }, o) });
  const flowDash = (els, d = 1.4) => gsap.to(els, { strokeDashoffset: -68, duration: d, ease: 'none', repeat: -1 });

  /* ------------------------------------------------------------ 01 title */
  FX.title = (el, tl, A) => {
    const road = $(el, '#t-road'), van = $(el, '.t-van');
    tl.from($(el, '.t-x'), { scale: .35, rotation: -40, opacity: 0, transformOrigin: '50% 50%', duration: 1.2, ease: 'back.out(1.5)' }, 0)
      .from($(el, '.t-logo'), { y: -16, opacity: 0, duration: .6, ease: OUT }, .1)
      .from($$(el, '.mega .ln > span'), { yPercent: 115, duration: 1, ease: 'power4.out', stagger: .12 }, .2)
      .from($(el, '.lede'), { y: 20, opacity: 0, duration: .7, ease: OUT }, .7)
      .from($(el, '.byline'), { y: 16, opacity: 0, duration: .6, ease: OUT }, .9);
    draw(tl, road, .3, { duration: 1.7 });
    tl.from($(el, '.t-dash'), { opacity: 0, duration: .6 }, 1.7);
    pop(tl, $$(el, '.t-pin .pin-in'), 1.0, { stagger: .45 });
    tl.to(van, { opacity: 1, duration: .3 }, .55)
      .to(van, Object.assign(mp(road, 0, .955, { alignOrigin: [.5, .9], autoRotate: true }), { duration: 2.8, ease: 'power2.inOut' }), .55);
    A.loop(() => {
      flowDash($(el, '.t-dash'));
      gsap.fromTo($(el, '.t-end .ring'), { scale: 1, opacity: .9 }, { scale: 2.6, opacity: 0, duration: 1.6, ease: 'power1.out', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to($(el, '.t-x'), { scale: 1.035, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 50%' });
    });
  };

  /* ------------------------------------------------------------ dividers */
  FX.divider = (el, tl, A) => {
    const k = +el.dataset.stop, pins = $$(el, '.d-pin'), road = $(el, '.d-road'), van = $(el, '.d-van');
    const at = i => parseFloat(pins[i].dataset.at);
    tl.from($(el, '.div-num'), { yPercent: 35, opacity: 0, duration: .9, ease: OUT }, 0)
      .from($$(el, '.div-title .ln > span'), { yPercent: 115, duration: .9, ease: 'power4.out', stagger: .08 }, .12);
    rise(tl, $(el, '.div-sub'), .45);
    draw(tl, road, .1, { duration: 1.3 });
    tl.from($(el, '.d-dash'), { opacity: 0, duration: .5 }, 1.2);
    pop(tl, $$(el, '.d-pin .pin-in'), .5, { stagger: .15 });
    tl.to(van, { opacity: 1, duration: .25 }, .75)
      .to(van, Object.assign(mp(road, k > 1 ? at(k - 2) : 0, at(k - 1), { alignOrigin: [.5, .9], autoRotate: true }), { duration: 1.7, ease: IO }), .75)
      .to($(el, '.d-pin.now .pin-in'), { scale: 1.3, duration: .18, yoyo: true, repeat: 1, ease: 'power1.out', transformOrigin: '50% 50%' }, 2.4);
    A.loop(() => {
      gsap.fromTo($(el, '.d-pin.now .ring'), { scale: 1, opacity: .9 }, { scale: 2.8, opacity: 0, duration: 1.6, ease: 'power1.out', repeat: -1, transformOrigin: '50% 50%' });
      flowDash($(el, '.d-dash'));
    });
  };

  /* ------------------------------------------------------------ 02 market */
  FX.market = (el, tl, A) => {
    rise(tl, $$(el, '.mk-card'), .35, { x: -40, y: 0, stagger: .1 });
    tl.from($$(el, '.mk-card .disc'), { scale: 0, duration: .4, ease: BACK, stagger: .1 }, .45);
    tl.from($(el, '.mk-hub'), { scale: .5, opacity: 0, duration: .8, ease: BACK }, .55)
      .from($(el, '.hub-x'), { rotation: -120, scale: .4, duration: 1, ease: OUT }, .55);
    draw(tl, $$(el, '.mk-link'), .85, { duration: .8, stagger: .07 });
    rise(tl, $(el, '.mk-drv'), 1.05, { x: 40, y: 0 });
    rise(tl, $$(el, '.mk-drv .chip'), 1.3, { y: 10, stagger: .06, duration: .4 });
    tl.from($(el, '.mk-joblab'), { opacity: 0, duration: .4 }, 1.5);
    rise(tl, $$(el, '.mk-bets > *'), 1.55, { y: 16, stagger: .1 });
    A.loop(() => {
      const paths = ['#mk-p1', '#mk-p2', '#mk-p3', '#mk-p4'].map(s => $(el, s)), p5 = $(el, '#mk-p5');
      $$(el, '.mk-dots .dot').forEach((d, i) => {
        const p = paths[i % 4];
        gsap.timeline({ repeat: -1, delay: i * .45, repeatDelay: 1.6 })
          .set(d, { opacity: 0 })
          .to(d, { opacity: 1, duration: .15 })
          .to(d, Object.assign(mp(p, 0, 1), { duration: 1.1, ease: 'power1.in' }), 0)
          .to(d, Object.assign(mp(p5, 0, 1), { duration: .9, ease: 'power1.out' }))
          .to(d, { opacity: 0, duration: .2 }, '-=.2');
      });
      gsap.fromTo($(el, '.mk-ring'), { scale: 1, opacity: .7 }, { scale: 1.3, opacity: 0, duration: 1.3, ease: 'power1.out', repeat: -1, repeatDelay: .2, transformOrigin: '50% 50%' });
    });
  };

  /* ------------------------------------------------------------ 04 team */
  FX.team = (el, tl, A) => {
    rise(tl, $(el, '.tm-root'), .35, { y: -24 });
    draw(tl, $$(el, '.tm-link'), .75, { duration: .7, stagger: 0 });
    tl.from($$(el, '.tm-panel'), { opacity: 0, scale: .97, duration: .6, ease: OUT, stagger: .1 }, 1.0);
    rise(tl, $$(el, '.tm-panel .br-h'), 1.1, { y: 10, stagger: .1, duration: .4 });
    rise(tl, $$(el, '.tm-card'), 1.2, { stagger: .07 });
    pop(tl, $$(el, '.po-tag'), 1.95, { stagger: .15 });
    rise(tl, $(el, '.tm-tech'), 2.15);
    rise(tl, $$(el, '.tm-tech > *'), 2.3, { y: 10, stagger: .06, duration: .35 });
    A.loop(() => {
      gsap.to($$(el, '.po-tag'), { y: -4, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .35 });
    });
  };

  /* ------------------------------------------------------------ 05 themes (interactive table) */
  const themeColW = el => ($(el, '.th-grid').offsetWidth - 196) / 6;
  FX.themes = (el, tl, A) => {
    const hl = $(el, '.th-hl'), cw = themeColW(el);
    el._sel = null;
    rise(tl, $$(el, '.th-head'), .35, { y: -20, stagger: .07 });
    pop(tl, $$(el, '.th-head .disc'), .4, { stagger: .07 });
    rise(tl, $$(el, '.th-rowlab'), .75, { x: -20, y: 0, stagger: .1, duration: .4 });
    [1, 2, 3, 4].forEach((r, i) => rise(tl, $$(el, `.th-c[data-r="${r}"]`), .85 + i * .22, { y: 14, stagger: .05, duration: .4 }));
    rise(tl, $$(el, '.th-legend > *'), 1.8, { y: 12, stagger: .05, duration: .4 });
    const t0 = 2.2, gap = .42;
    tl.fromTo(hl, { opacity: 0, x: 0 }, { opacity: 1, duration: .3 }, t0);
    for (let i = 1; i < 6; i++) tl.to(hl, { x: i * cw, duration: .32, ease: IO }, t0 + i * gap);
    tl.to(hl, { opacity: 0, duration: .4 }, t0 + 6 * gap);
    $$(el, '.th-head .disc').forEach((d, i) => tl.to(d, { y: -8, duration: .16, yoyo: true, repeat: 1, ease: 'power1.out' }, t0 + i * gap + .08));
  };
  FX.themes.init = el => {
    const hl = $(el, '.th-hl');
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-col]'); if (!c) return;
      const i = +c.dataset.col, cw = themeColW(el);
      if (el._sel === i) { el._sel = null; gsap.to(hl, { opacity: 0, duration: .3, overwrite: 'auto' }); return; }
      el._sel = i;
      gsap.to(hl, { opacity: 1, x: i * cw, duration: .45, ease: IO, overwrite: 'auto' });
      gsap.fromTo($$(el, '.th-head .disc')[i], { y: 0 }, { y: -10, duration: .18, yoyo: true, repeat: 1 });
    });
    el.addEventListener('deck:leave', () => { el._sel = null; gsap.set(hl, { opacity: 0, x: 0 }); });
  };

  /* ------------------------------------------------------------ 06 metric tree */
  FX.metrics = (el, tl, A) => {
    tl.from($(el, '.mt-root'), { scale: .92, opacity: 0, duration: .7, ease: BACK }, .3);
    draw(tl, $$(el, '.mt-link'), .75, { duration: .55, stagger: .05 });
    rise(tl, $$(el, '.mt-leaf'), 1.05, { y: 30, stagger: .08 });
    pop(tl, $$(el, '.mt-leaf .disc'), 1.15, { stagger: .08 });
    rise(tl, $(el, '.mt-note'), 1.7);
    A.loop(() => {
      $$(el, '.mt-dots .dot').forEach((d, i) => {
        const p = $(el, '#mt-p' + i);
        gsap.timeline({ repeat: -1, delay: i * .48, repeatDelay: 1.7 })
          .set(d, { opacity: 0 }).to(d, { opacity: 1, duration: .15 })
          .to(d, Object.assign(mp(p, 0, 1), { duration: 1.2, ease: 'power1.inOut' }), 0)
          .to(d, { opacity: 0, duration: .15 }, '-=.15');
      });
      gsap.fromTo($(el, '.mt-glow'), { opacity: .9, scale: 1 }, { opacity: 0, scale: 1.05, duration: 1.4, ease: 'power1.out', repeat: -1, delay: 1.2 });
    });
  };

  /* ------------------------------------------------------------ 08 PM x PD */
  FX.pmpd = (el, tl, A) => {
    draw(tl, $$(el, '.dd-shape'), .3, { duration: 1.1, stagger: .25 });
    tl.from($$(el, '.dd-shape'), { fillOpacity: 0, duration: .6, stagger: .25 }, .9);
    tl.from($$(el, '.dd-mid'), { opacity: 0, duration: .5 }, 1.2);
    rise(tl, $$(el, '.dd-phase'), .9, { y: 14, stagger: .12 });
    rise(tl, $$(el, '.dd-top'), 1.2, { y: 10, stagger: .1 });
    rise(tl, $$(el, '.lane-lab'), 1.4, { x: -16, y: 0, stagger: .15 });
    tl.from($$(el, '.seg'), { scaleX: 0, transformOrigin: '0% 50%', duration: .5, ease: 'power3.inOut', stagger: .07 }, 1.5)
      .from($$(el, '.seg span'), { opacity: 0, duration: .3, stagger: .07 }, 1.85);
    A.loop(() => {
      [['.dd-dot.a', '#dd-top'], ['.dd-dot.b', '#dd-bot']].forEach(([d, p]) => {
        const dot = $(el, d), path = $(el, p);
        gsap.timeline({ repeat: -1, repeatDelay: .4 })
          .set(dot, { opacity: 0 }).to(dot, { opacity: 1, duration: .2 })
          .to(dot, Object.assign(mp(path, 0, 1), { duration: 4.4, ease: 'none' }), 0)
          .to(dot, { opacity: 0, duration: .2 }, '-=.2');
      });
    });
  };

  /* ------------------------------------------------------------ 09 partners */
  FX.partners = (el, tl, A) => {
    tl.from($$(el, '.col-h'), { opacity: 0, duration: .4 }, .3);
    rise(tl, $$(el, '.pt-col:not(.right) .pill'), .35, { x: -40, y: 0, stagger: .06, duration: .5 });
    rise(tl, $$(el, '.pt-col.right .pill'), .45, { x: 40, y: 0, stagger: .06, duration: .5 });
    tl.from($(el, '.pt-core'), { scale: .6, opacity: 0, duration: .8, ease: BACK }, .6);
    rise(tl, $$(el, '.pt-core .chip'), 1.0, { y: 10, stagger: .1, duration: .4 });
    const arrows = $$(el, '.pt-arrow'), labs = $$(el, '.pt-lab');
    arrows.forEach((p, i) => {
      const t = 1.1 + i * .28;
      draw(tl, p, t, { duration: .6 });
      if (p._ah) tl.from(p._ah, { opacity: 0, duration: .2 }, t + .5);
      tl.from(labs[i], { opacity: 0, y: 8, duration: .4 }, t + .1);
    });
    tl.from($(el, '.rit-track'), { scaleX: 0, transformOrigin: '0 50%', duration: .8, ease: IO }, 2.2);
    rise(tl, $$(el, '.pt-rituals .rit, .rit-loop'), 2.3, { y: 14, stagger: .06, duration: .4 });
    A.loop(() => {
      $$(el, '.pt-dots .dot').forEach((d, i) => {
        const p = arrows[i % 4];
        gsap.timeline({ repeat: -1, delay: (i % 4) * .5 + Math.floor(i / 4) * 1.25, repeatDelay: 1.4 })
          .set(d, { opacity: 0 }).to(d, { opacity: 1, duration: .15 })
          .to(d, Object.assign(mp(p, 0, 1), { duration: 1.1, ease: 'power1.inOut' }), 0)
          .to(d, { opacity: 0, duration: .15 }, '-=.15');
      });
      const hl = $(el, '.rit-hl'), rits = $$(el, '.pt-rituals .rit');
      gsap.set(hl, { x: rits[0].offsetLeft, width: rits[0].offsetWidth, opacity: 1 });
      const t = gsap.timeline({ repeat: -1 });
      rits.forEach((r, i) => t.to(hl, { x: r.offsetLeft, width: r.offsetWidth, duration: .4, ease: IO }, i * 1.1));
      t.to(hl, { x: rits[0].offsetLeft, width: rits[0].offsetWidth, duration: .6, ease: IO }, rits.length * 1.1);
    });
  };

  /* ------------------------------------------------------------ 10 feedback */
  FX.feedback = (el, tl, A) => {
    rise(tl, $$(el, '.pill.src'), .35, { x: -40, y: 0, stagger: .05, duration: .45 });
    draw(tl, $(el, '.fb-funnel'), .6, { duration: 1 });
    tl.from($(el, '.fb-funnel'), { fillOpacity: 0, duration: .6 }, 1.2);
    tl.from($$(el, '.fb-tube'), { opacity: 0, duration: .4, stagger: .1 }, 1.4);
    rise(tl, $(el, '.fb-tri'), 1.2);
    rise(tl, $$(el, '.fb-bin'), 1.5, { x: 40, y: 0, stagger: .1, duration: .5 });
    pop(tl, $(el, '.fb-ai'), 1.95);
    A.loop(() => {
      const src = $$(el, '.pill.src'), bins = $$(el, '.fb-bin .disc');
      const binY = [395, 606, 817], pick = [1, 0, 1, 2, 1, 0, 2, 1, 1, 0, 2, 1, 0, 1];
      const dots = $$(el, '.fb-dots circle'), period = dots.length * .38;
      dots.forEach((d, i) => {
        const s = src[i % src.length], ys = 322 + s.offsetTop + s.offsetHeight / 2, b = pick[i % pick.length];
        gsap.timeline({ repeat: -1, delay: i * .38, repeatDelay: Math.max(.2, period - 2.3) })
          .set(d, { x: 545, y: ys, opacity: 0 })
          .to(d, { opacity: 1, duration: .15 })
          .to(d, { x: 780, duration: .45, ease: 'none' }, 0)
          .to(d, { x: 1110, y: 606, duration: .9, ease: 'power1.in' })
          .to(d, { x: 1300, y: binY[b], duration: .6, ease: 'power1.out' })
          .to(d, { opacity: 0, duration: .15 }, '-=.1')
          .call(() => gsap.fromTo(bins[b], { scale: 1 }, { scale: 1.14, duration: .14, yoyo: true, repeat: 1 }));
      });
    });
  };
  FX.feedback.init = el => {
    const g = $(el, '.fb-dots'), ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 14; i++) { const c = document.createElementNS(ns, 'circle'); c.setAttribute('r', '7'); c.setAttribute('class', 'dot'); c.setAttribute('opacity', '0'); g.appendChild(c); }
  };

  /* ------------------------------------------------------------ 11 delivery route */
  const ROUTE_X = [180, 353, 527, 700, 873, 1047, 1220, 1393, 1567, 1740];
  FX.process = (el, tl, A) => {
    const van = $(el, '.pr-van-g'), pins = $$(el, '.pr-stop .pin-in'), labs = $$(el, '.pr-lab');
    draw(tl, $(el, '.pr-road'), .3, { duration: .9 });
    tl.from($(el, '.pr-dash'), { opacity: 0, duration: .4 }, 1.0);
    tl.from($$(el, '.pr-phases > *'), { opacity: 0, duration: .4, stagger: .04 }, .6);
    tl.fromTo(van, { x: 110, y: 530, opacity: 0 }, { opacity: 1, duration: .3 }, .9);
    let t = 1.1;
    ROUTE_X.forEach((x, i) => {
      tl.to(van, { x, y: 530, duration: i ? .4 : .5, ease: 'power2.inOut' }, t);
      pop(tl, pins[i], t + .26, { duration: .3 });
      rise(tl, labs[i], t + .28, { y: 16, duration: .35 });
      if (i === 5) {
        draw(tl, $(el, '.pr-zoom'), t + .3, { duration: .7 });
        rise(tl, $$(el, '.pr-status .st, .pr-status .st-ar'), t + .6, { y: 10, stagger: .06, duration: .3 });
      }
      t += .5;
    });
    rise(tl, $(el, '.pr-foot'), t);
    A.loop(() => {
      const sts = $$(el, '.pr-status .st'), cx = sts.map(s => s.offsetLeft + s.offsetWidth / 2 - 13);
      $$(el, '.st-tk').forEach((k, i) => {
        const tt = gsap.timeline({ repeat: -1, delay: i * 1.6, repeatDelay: .2 });
        tt.set(k, { x: cx[0], opacity: 0 }).to(k, { opacity: 1, duration: .2 });
        cx.slice(1).forEach(x => tt.to(k, { x, duration: .45, ease: IO }, '+=.35'));
        tt.to(k, { opacity: 0, duration: .25 }, '+=.2');
      });
    });
  };
  FX.process.init = el => {
    const names = ['Request', 'Discovery', 'PRD + prototype', 'Design', 'Tickets', 'Build', 'Code review', 'QA', 'Release', 'Launch readout'];
    const own = [['PM', 'pm'], ['PM + design', 'mix'], ['PM', 'pm'], ['Design', 'pd'], ['PM + dev', 'mix'], ['Dev', 'tech'], ['Dev', 'tech'], ['QA', 'tech'], ['PM + dev', 'mix'], ['PM', 'pm']];
    const g = $(el, '.pr-stops'), box = $(el, '.pr-labels');
    g.innerHTML = ROUTE_X.map(x => `<g class="pr-stop" transform="translate(${x} 530)"><g class="pin-in"><circle class="pin-o" r="16"/><circle class="pin-f" r="7"/></g></g>`).join('');
    box.innerHTML = ROUTE_X.map((x, i) => `<div class="pr-lab" style="left:${x - 84}px;top:566px"><b>${names[i]}</b><span class="own ${own[i][1]}">${own[i][0]}</span></div>`).join('');
  };

  /* ------------------------------------------------------------ 13 ladder (click builds) */
  FX.ladder = (el, tl, A) => {
    const path = $(el, '#ld-path'), cl = $(el, '.ld-climber'), steps = $$(el, '.ld-step');
    const P = [.187, .44, .705, .764];
    const go = (s, e, d) => Object.assign(mp(path, s, e, { alignOrigin: [.5, 1] }), { duration: d, ease: 'power1.inOut' });
    tl.from($(el, '.ld-fill'), { opacity: 0, duration: .6 }, .3);
    draw(tl, path, .3, { duration: 1.3, ease: 'power1.inOut' });
    tl.to(cl, go(0, P[0], .01), 0);
    tl.from(cl, { scale: 0, opacity: 0, duration: .45, ease: BACK, transformOrigin: '50% 100%' }, 1.2);
    rise(tl, steps[0].children, 1.25, { stagger: .08 });
    for (let i = 1; i < 4; i++) {
      A.step();
      const t = tl.duration();
      tl.to(cl, go(P[i - 1], P[i], i === 3 ? .8 : 1.1), t);
      rise(tl, steps[i].children, t + .45, { stagger: .08 });
      tl.fromTo(steps[i - 1], { opacity: 1 }, { opacity: .55, duration: .4 }, t + .2);
    }
    tl.to(steps.slice(0, 3), { opacity: 1, duration: .4 }, tl.duration());
    pop(tl, $(el, '.here-pin'), tl.duration() - .2);
    rise(tl, $(el, '.ld-here > div'), '<.1', { x: -14, y: 0 });
    A.loop(() => gsap.fromTo($(el, '.cl-halo'), { scale: 1, opacity: .32 }, { scale: 1.6, opacity: 0, duration: 1.4, ease: 'power1.out', repeat: -1, transformOrigin: '50% 50%' }), 0);
  };

  /* ------------------------------------------------------------ 14 automation vs agent */
  FX.autoagent = (el, tl, A) => {
    rise(tl, $$(el, '.aa-panel'), .35, { y: 30, stagger: .15, duration: .6 });
    draw(tl, $(el, '.rail'), .8, { duration: .7 });
    pop(tl, $$(el, '.aa-st'), .9, { stagger: .1 });
    tl.from($$(el, '.ag-edges path'), { opacity: 0, duration: .4, stagger: .04 }, 1.0);
    pop(tl, $$(el, '.ag-node'), 1.0, { stagger: .06, scale: .5 });
    rise(tl, $$(el, '.aa-ex, .aa-rules > div'), 1.4, { y: 10, stagger: .06 });
    A.loop(() => {
      const d1 = $(el, '.aa-dot1'), st = $$(el, '.aa-st');
      const t1 = gsap.timeline({ repeat: -1, repeatDelay: .4 });
      t1.set(d1, { x: 200, y: 640, opacity: 0 }).to(d1, { opacity: 1, duration: .2 });
      [220, 420, 620, 820].forEach((x, i) => {
        t1.to(d1, { x, duration: .55, ease: 'power1.inOut' });
        t1.to(st[i], { scale: 1.14, duration: .14, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '-=.1');
        t1.to({}, { duration: .3 });
      });
      t1.to(d1, { opacity: 0, duration: .2 });

      const dot = $(el, '.ag-dot'), N = {};
      $$(el, '.ag-node').forEach(n => N[n.dataset.n] = n);
      const c = n => ({ x: n.offsetLeft + n.offsetWidth / 2, y: n.offsetTop + n.offsetHeight / 2 });
      const t2 = gsap.timeline({ repeat: -1, repeatDelay: .9 });
      const s0 = c(N.S);
      t2.set(dot, { x: s0.x, y: s0.y, opacity: 0 }).to(dot, { opacity: 1, duration: .2 });
      ['A', 'C', 'D', 'E', '!bad', 'C', 'B', 'C', 'D', 'E', '!ok', 'G', 'H'].forEach(k => {
        if (k[0] === '!') {
          const b = $(el, '.ag-badge.' + k.slice(1));
          t2.fromTo(b, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: BACK }).to(b, { opacity: 0, duration: .3 }, '+=.55');
          return;
        }
        const n = N[k], p = c(n), glow = k === 'H' ? 'rgba(255,221,0,.85)' : 'rgba(0,136,191,.55)';
        t2.to(dot, { x: p.x, y: p.y, duration: .42, ease: 'power1.inOut' });
        t2.fromTo(n, { boxShadow: '0 0 0 0px rgba(0,136,191,0)' }, { boxShadow: `0 0 0 7px ${glow}`, duration: .18, yoyo: true, repeat: 1 }, '-=.12');
      });
      t2.to(dot, { opacity: 0, duration: .3 }, '+=.5');
    });
  };

  /* ------------------------------------------------------------ 16 roles (Before / Now) */
  FX.roles = (el, tl, A) => {
    el._api = A;
    const cs = $$(el, '.rl-c'), sats = $$(el, '.rl-sat'), ink = css(el, '--ink');
    // BEFORE: five separate crafts with handoffs
    tl.from($(el, '.rl-toggle'), { opacity: 0, y: -10, duration: .4 }, .4);
    pop(tl, $$(el, '.rl-c .rl-in, .rl-sat .rl-in'), .45, { stagger: .1, duration: .5 });
    tl.from($$(el, '.rl-hand .hand'), { drawSVG: '0%', duration: .4, stagger: .12 }, 1.0);
    tl.from($$(el, '.rl-hand text'), { opacity: 0, duration: .3, stagger: .12 }, 1.1);
    A.step();
    // NOW: from()-tweens hold the BEFORE layout until this point
    const T = tl.duration() + .05, D = 1.2, E = 'power3.inOut';
    [...cs, ...sats].forEach(c => {
      const bs = +c.dataset.bs;
      tl.from(c, { x: +c.dataset.bx, y: +c.dataset.by, scale: bs, duration: D, ease: E }, T);
      tl.from(c.querySelectorAll('b, .b4'), { scale: 1 / bs, duration: D, ease: E }, T);
    });
    tl.from($$(el, '.rl-c b'), { x: 0, y: 0, duration: D, ease: E }, T)
      .from($(el, '.rl-hand'), { opacity: 1, duration: .3 }, T)
      .from($$(el, '.b4'), { opacity: 1, duration: .3 }, T)
      .from($(el, '.rl-knob'), { x: -118, duration: .5, ease: IO }, T)
      .from($$(el, '.bg-ai'), { opacity: 0, duration: .6 }, T + .6)
      .from($$(el, '.rl-sat b'), { color: ink, duration: .6 }, T + .6)
      .from($$(el, '.sat-ic'), { opacity: 0, scale: 0, duration: .4 }, T + .8)
      .from($$(el, '.n4'), { opacity: 0, duration: .4 }, T + .9)
      .from($(el, '.rl-orbit'), { opacity: 0, duration: .6 }, T + .8)
      .from($(el, '.rl-core'), { opacity: 0, scale: .7, duration: .5, ease: BACK }, T + 1.0);
    rise(tl, $$(el, '.rl-chip'), T + 1.1, { y: 20, stagger: .1, duration: .5 });
    A.loop(() => {
      const R = 300;
      sats.forEach(s => {
        const a0 = +s.dataset.a * Math.PI / 180, ax = -2 * R * Math.cos(a0), ay = -2 * R * Math.sin(a0);
        const d = `M0,0 A${R},${R} 0 1 1 ${ax.toFixed(2)},${ay.toFixed(2)} A${R},${R} 0 1 1 0,0`;
        gsap.to(s.querySelector('.rl-orb'), { motionPath: { path: d }, duration: 46, ease: 'none', repeat: -1 });
      });
    }, 1);
  };
  FX.roles.init = el => {
    el.addEventListener('click', e => {
      const b = e.target.closest('.rl-toggle button'); if (!b || !el._api) return;
      el._api.seekStop(+b.dataset.k);
    });
  };

  /* ------------------------------------------------------------ 17 the new route */
  const GATES = [[2, 'Approve PRD'], [3, 'Pick design'], [4, 'Approve tickets'], [6, 'Review code'], [7, 'Sign off risk'], [8, 'Go / no-go']];
  FX.newroute = (el, tl, A) => {
    draw(tl, $(el, '.nr-road'), .3, { duration: .7 });
    pop(tl, $$(el, '.nr-stop .pin-in'), .45, { stagger: .04, duration: .3 });
    rise(tl, $$(el, '.nr-lab'), .6, { y: 10, stagger: .04, duration: .3 });
    tl.from($$(el, '.nr-badge'), { y: -40, opacity: 0, duration: .5, ease: 'back.out(1.4)', stagger: .12 }, 1.1)
      .from($$(el, '.nr-tick'), { opacity: 0, duration: .3, stagger: .12 }, 1.35)
      .from($$(el, '.nr-gate'), { scale: 2.4, opacity: 0, duration: .45, ease: 'back.out(2)', stagger: .13, transformOrigin: '50% 50%' }, 2.6)
      .from($$(el, '.nr-gl'), { opacity: 0, y: -8, duration: .3, stagger: .13 }, 2.75);
    rise(tl, $(el, '.nr-human'), 3.5);
    rise(tl, $(el, '.nr-legend'), 3.6, { y: -10 });
    A.loop(() => {
      const g = $(el, '.nr-tk-g'), gates = $$(el, '.nr-gate'), badges = $$(el, '.nr-badge');
      const ev = ROUTE_X.map((x, i) => ({ x, kind: 's', i })).concat(GATES.map(([a], j) => ({ x: (ROUTE_X[a] + ROUTE_X[a + 1]) / 2, kind: 'g', i: j }))).sort((a, b) => a.x - b.x);
      const t = gsap.timeline({ repeat: -1, repeatDelay: .8 });
      t.set(g, { x: 130, y: 600, opacity: 0 }).to(g, { opacity: 1, duration: .2 });
      let x0 = 130;
      ev.forEach(e => {
        t.to(g, { x: e.x, duration: (e.x - x0) / 520, ease: 'none' });
        if (e.kind === 's') t.to(badges[e.i], { scale: 1.07, duration: .14, yoyo: true, repeat: 1 }, '-=.05');
        else t.to(gates[e.i], { scale: 1.45, duration: .16, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }).to({}, { duration: .22 });
        x0 = e.x;
      });
      t.to(g, { x: 1790, duration: (1790 - x0) / 520, ease: 'none' }).to(g, { opacity: 0, duration: .2 });
    });
  };
  FX.newroute.init = el => {
    const names = ['Request', 'Discovery', 'PRD + prototype', 'Design', 'Tickets', 'Build', 'Code review', 'QA', 'Release', 'Readout'];
    const bots = [['Triage sweep', 0, 'clock'], ['Feedback reader', 1, 'eye'], ['PRD skill', 0, 'doc'], ['Prototype builder', 0, 'pen'], ['Ticket agent', 0, 'ticket'],
      ['Decision agent', 0, 'spark'], ['Design QA', 0, 'search'], ['Test agent', 0, 'flask'], ['Release checklist', 1, 'check'], ['Launch readout', 1, 'chart']];
    $(el, '.nr-ticks').innerHTML = ROUTE_X.map(x => `<path class="nr-tick" d="M${x} 514 V 580"/><g class="nr-stop" transform="translate(${x} 600)"><g class="pin-in"><circle class="pin-o" r="15"/><circle class="pin-f" r="6"/></g></g>`).join('');
    $(el, '.nr-gates').innerHTML = GATES.map(([a]) => { const gx = (ROUTE_X[a] + ROUTE_X[a + 1]) / 2; return `<g transform="translate(${gx} 600)"><g class="nr-gate"><rect class="gate-r" x="-15" y="-15" width="30" height="30" rx="5" transform="rotate(45)"/></g></g>`; }).join('');
    $(el, '.nr-badges').innerHTML = bots.map(([n, p, ic], i) => `<div class="nr-badge${p ? ' pilot' : ''}" style="left:${ROUTE_X[i] - 80}px;top:412px"><svg class="ic"><use href="#i-${ic}"/></svg>${n}</div>`).join('');
    $(el, '.nr-labels').innerHTML = ROUTE_X.map((x, i) => `<div class="nr-lab" style="left:${x - 84}px;top:636px">${names[i]}</div>`).join('')
      + GATES.map(([a, t]) => { const gx = (ROUTE_X[a] + ROUTE_X[a + 1]) / 2; return `<div class="nr-gl" style="left:${gx - 75}px;top:708px"><span>${t}</span></div>`; }).join('');
  };

  /* ------------------------------------------------------------ 18 autonomy (SAE levels) */
  const SAE_X = [282, 621, 960, 1299, 1638];
  FX.autonomy = (el, tl, A) => {
    const cards = $$(el, '.sae'), main = $(el, '.sae-main'), agent = $(el, '.sae-agent');
    gsap.set($$(el, '.sae-lab, .sae-fenl, .sae-pips, .sae-errl'), { xPercent: -50 });
    const glow = (c, rgb) => tl.fromTo(c, { boxShadow: `0 0 0 0px rgba(${rgb},0)` }, { boxShadow: `0 0 0 6px rgba(${rgb},.55)`, duration: .2, yoyo: true, repeat: 1 });
    rise(tl, cards, .35, { y: 40, stagger: .09, duration: .55 });
    tl.from(cards.map(c => c.querySelector('.sae-top b')), { scale: .4, duration: .5, ease: BACK, stagger: .09, transformOrigin: '0% 100%' }, .45);
    tl.from(cards.map(c => c.querySelector('.sae-car')), { opacity: 0, x: -10, duration: .4, stagger: .09 }, .7);
    // ---- the car scenes run from the start (recorded in this slide's context)
    const q = (k, sel) => cards[k].querySelector(sel);
    gsap.to(q(0, '.l0-wheel'), { rotation: 24, svgOrigin: '140 124', duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.fromTo(q(0, '.l0-dash'), { strokeDashoffset: 0 }, { strokeDashoffset: 44, duration: .6, ease: 'none', repeat: -1 });
    gsap.fromTo(q(1, '.l1-dash'), { x: 0 }, { x: -26, duration: .5, ease: 'none', repeat: -1 });
    gsap.to(q(1, '.l1-lead'), { x: '+=18', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(q(1, '.l1-me'), { x: '+=18', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .35 });
    gsap.fromTo(q(1, '.l1-waves').children, { opacity: .15 }, { opacity: 1, duration: .35, yoyo: true, repeat: -1, stagger: .18 });
    gsap.fromTo(q(2, '.l2-dash'), { y: 0 }, { y: 24, duration: .45, ease: 'none', repeat: -1 });
    gsap.timeline({ repeat: -1, repeatDelay: .5 })
      .to(q(2, '.l2-car'), { x: '+=18', duration: 1.2, ease: 'sine.inOut' })
      .to(q(2, '.l2-lane.r'), { stroke: '#21A8E0', duration: .15, yoyo: true, repeat: 3 }, '-=.2')
      .to(q(2, '.l2-wheel'), { rotation: -40, svgOrigin: '207 112', duration: .4, ease: 'power2.out' }, '<')
      .to(q(2, '.l2-car'), { x: '-=18', duration: .8, ease: 'power2.inOut' }, '<.1')
      .to(q(2, '.l2-wheel'), { rotation: 0, svgOrigin: '207 112', duration: .5, ease: 'power2.inOut' }, '<.3');
    gsap.to(q(3, '.l3-wheel'), { rotation: 8, svgOrigin: '140 124', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.fromTo(cards[3].querySelectorAll('.l3-bl'), { opacity: 1 }, { opacity: .35, duration: .5, yoyo: true, repeat: -1 });
    gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 1.5 })
      .fromTo(q(3, '.l3-alert'), { opacity: 0, scale: .6, svgOrigin: '140 21' }, { opacity: 1, scale: 1, svgOrigin: '140 21', duration: .3, ease: BACK })
      .to(q(3, '.l3-alert'), { opacity: .4, duration: .2, yoyo: true, repeat: 3 })
      .to(q(3, '.l3-phone'), { y: 46, duration: .4, ease: 'power2.in' }, '<.2')
      .to(q(3, '.l3-hands'), { opacity: 1, duration: .25 }, '<.2')
      .to(q(3, '.l3-alert'), { opacity: 0, duration: .3 }, '+=1')
      .to(q(3, '.l3-hands'), { opacity: 0, duration: .3 }, '+=.6')
      .to(q(3, '.l3-phone'), { y: 0, duration: .5, ease: 'power2.out' }, '<');
    const loop = q(4, '#l4-loop');
    gsap.to(q(4, '.l4-taxi'), { motionPath: { path: loop, align: loop, alignOrigin: [.5, .5], autoRotate: true }, duration: 7, ease: 'none', repeat: -1 });
    gsap.fromTo(q(4, '.l4-ring'), { scale: .6, opacity: 1, transformOrigin: '50% 50%' }, { scale: 1.8, opacity: 0, duration: 1.2, ease: 'power1.out', repeat: -1 });
    gsap.to(q(4, '.l4-fence'), { strokeDashoffset: -26, duration: 1.2, ease: 'none', repeat: -1 });
    draw(tl, $(el, '.sae-road'), 1.0, { duration: .9 });
    tl.from($(el, '.sae-dash'), { opacity: 0, duration: .4 }, 1.7);
    pop(tl, $$(el, '.sae-tick'), 1.2, { stagger: .08, duration: .3 });
    // the main van drives L0 → L1 → L2 and parks between L2 and L3
    tl.fromTo(main, { x: 150, y: 800, opacity: 0 }, { opacity: 1, duration: .3 }, 1.5);
    let t = 1.6;
    [SAE_X[0], SAE_X[1], SAE_X[2], 1100].forEach((x, i) => {
      tl.to(main, { x, y: 800, duration: i ? .55 : .45, ease: 'power2.inOut' }, t);
      if (i < 3) { tl.add(glow(cards[i], i === 0 ? '255,221,0' : '0,136,191'), t + .4); }
      t += .7;
    });
    tl.add(glow(cards[3], '0,136,191'), t - .3);
    pop(tl, $(el, '.sae-lab.main'), t - .2);
    // the agent van enters the fenced L4 zone
    tl.from($(el, '.sae-fence'), { opacity: 0, scale: .85, svgOrigin: '1638 800', duration: .5, ease: BACK }, t);
    tl.fromTo(agent, { x: SAE_X[3], y: 800, opacity: 0 }, { opacity: 1, duration: .3 }, t + .2)
      .to(agent, { x: SAE_X[4], y: 800, duration: .8, ease: 'power2.inOut' }, t + .4);
    tl.add(glow(cards[4], '0,136,191'), t + 1.0);
    pop(tl, $(el, '.sae-lab.agent'), t + 1.1);
    rise(tl, $(el, '.sae-fenl'), t + 1.2, { y: 8 });
    rise(tl, $(el, '.sae-rule'), t + 1.5, { y: 16 });
    A.loop(() => {
      flowDash($(el, '.sae-dash'), 2.4);
      gsap.to(main.querySelector('use'), { y: '-=2', duration: .35, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      // earned, not given: 4 weeks at 95% → into the zone; one serious error → back out
        const pips = $$(el, '.sae-pips i'), blue = css(el, '--blue'), errl = $(el, '.sae-errl'), err = $(el, '.sae-err'), lab = $(el, '.sae-lab.agent');
      const pipsBox = $(el, '.sae-pips');
      gsap.timeline({ repeat: -1, repeatDelay: .6, delay: 1.2 })
        .to(lab, { opacity: 0, duration: .25 })
        .to(agent, { x: SAE_X[3], duration: .9, ease: 'power2.inOut' }, '<')
        .to(pipsBox, { opacity: 1, duration: .25 })
        .to(pips, { backgroundColor: blue, color: '#fff', borderColor: blue, duration: .2, stagger: .45 })
        .to(pipsBox, { opacity: 0, duration: .3 }, '+=.3')
        .to(agent, { x: SAE_X[4], duration: .9, ease: 'power2.inOut' }, '<')
        .to(lab, { opacity: 1, duration: .3 })
        .fromTo(err, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: BACK, transformOrigin: '50% 50%' }, '+=1.8')
        .fromTo(errl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3 }, '<')
        .to(lab, { opacity: 0, duration: .2 }, '<')
        .to(agent, { x: SAE_X[3], duration: .8, ease: 'power2.inOut' }, '+=.5')
        .to([err, errl], { opacity: 0, duration: .3 }, '+=.4')
        .set(pips, { clearProps: 'backgroundColor,color,borderColor' })
        .to(agent, { x: SAE_X[4], duration: .9, ease: 'power2.inOut' }, '+=.6')
        .to(lab, { opacity: 1, duration: .3 });
    });
  };

  /* ------------------------------------------------------------ 19 example 1 */
  FX.ex1 = (el, tl, A) => {
    tl.from($(el, '.e1-ring'), { opacity: 0, scale: .8, duration: .8, ease: OUT, transformOrigin: '50% 50%' }, .35);
    pop(tl, $$(el, '.e1-st'), .5, { stagger: .15 });
    rise(tl, $$(el, '.e1-lab'), .7, { y: 10, stagger: .15, duration: .4 });
    tl.from($(el, '.e1-core'), { opacity: 0, scale: .7, duration: .5, ease: BACK }, 1.0);
    A.count($(el, '.e1-core b'), 1.0, 1.6);
    pop(tl, $(el, '.e1-gate'), 1.35);
    rise(tl, $(el, '.e1-gl'), 1.45);
    rise(tl, $(el, '.e1-chart .ch-t'), 1.2);
    tl.from($$(el, '.e1-chart .ch-k, .e1-chart .ch-v'), { opacity: 0, duration: .4, stagger: .1 }, 1.3)
      .from($(el, '.ch-axis'), { opacity: 0, duration: .4 }, 1.4)
      .from($(el, '.ch-bar.old'), { scaleX: 0, transformOrigin: '0% 50%', duration: .9, ease: OUT }, 1.5)
      .from($(el, '.ch-bar.new'), { scaleX: 0, transformOrigin: '0% 50%', duration: .5, ease: OUT }, 2.2);
    rise(tl, $(el, '.e1-day .ch-t'), 2.4);
    tl.from($(el, '.day-line'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: IO }, 2.5);
    $$(el, '.day').forEach((d, i) => {
      pop(tl, d.querySelector('i'), 2.6 + i * .3, { duration: .35 });
      rise(tl, d.querySelectorAll('em, p'), 2.65 + i * .3, { y: 10, duration: .35, stagger: .05 });
    });
    A.loop(() => {
      const pk = $(el, '.e1-pk'), path = $(el, '#e1-orbit'), st = $$(el, '.e1-st'), gate = $(el, '.e1-gate'), L = 9;
      const t = gsap.timeline({ repeat: -1 });
      t.set(pk, { opacity: 1 }).to(pk, Object.assign(mp(path, 0, 1), { duration: L, ease: 'none' }), 0);
      st.forEach((s, i) => t.to(s, { scale: 1.2, duration: .2, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, i * L / 5 - (i ? .1 : 0) + (i ? 0 : .02)));
      t.to(gate, { scale: 1.3, duration: .2, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, L * .5 - .1);
    });
  };

  /* ------------------------------------------------------------ 20 example 2 */
  FX.ex2 = (el, tl, A) => {
    rise(tl, $$(el, '.e2-panel'), .35, { y: 30, stagger: .15, duration: .6 });
    rise(tl, $(el, '.e2-msg.dev'), .9);
    tl.from($$(el, '.e2-checks span'), { opacity: 0, x: -12, duration: .3, stagger: .28 }, 1.3);
    pop(tl, $$(el, '.e2-checks .ic'), 1.35, { stagger: .28, duration: .3 });
    tl.from($(el, '.clk-h'), { rotation: -120, svgOrigin: '20 20', duration: 2.4, ease: 'power1.inOut' }, 1.2)
      .from($(el, '.clk-m'), { rotation: -1440, svgOrigin: '20 20', duration: 2.4, ease: 'power1.inOut' }, 1.2);
    A.count($(el, '.e2-clock em'), 1.2, 2.4);
    rise(tl, $(el, '.e2-msg.pm'), 2.75);
    rise(tl, $(el, '.e2-override'), 3.1);
    tl.from($(el, '.e2-illus'), { opacity: 0, duration: .4 }, 3.3);
    rise(tl, $(el, '.e2-phone'), .85, { y: 30 });
    tl.from($$(el, '.e2-phone > div:not(.ph-tap)'), { opacity: 0, duration: .3, stagger: .06 }, 1.05);
    rise(tl, $$(el, '.e2-steps span'), 1.4, { x: 16, y: 0, stagger: .3, duration: .35 });
    rise(tl, $$(el, '.tix'), 2.7, { x: 30, y: 0, stagger: .3, duration: .45 });
    tl.from($$(el, '.stamp'), { scale: 2.2, opacity: 0, duration: .32, ease: 'power4.in', stagger: .5 }, 3.3);
    rise(tl, $(el, '.e2-target'), 3.8);
    A.loop(() => {
      const tap = $(el, '.ph-tap'), pts = [[105, 137], [105, 238], [105, 288], [105, 356]];
      const t = gsap.timeline({ repeat: -1, repeatDelay: .6 });
      t.set(tap, { x: pts[0][0], y: pts[0][1], opacity: 0 });
      pts.forEach(p => {
        t.to(tap, { x: p[0], y: p[1], opacity: 1, duration: .4, ease: IO });
        t.to(tap, { scale: .65, duration: .12, yoyo: true, repeat: 1 });
        t.to({}, { duration: .25 });
      });
      t.to(tap, { opacity: 0, duration: .3 });
      gsap.fromTo($(el, '.ov-bar'), { scaleX: 1 }, { scaleX: 0, duration: 6, ease: 'none', repeat: -1 });
    });
  };

  /* ------------------------------------------------------------ 24 close */
  FX.close = (el, tl, A) => {
    const lines = $$(el, '.cl-l'), road = $(el, '#cl-road'), van = $(el, '.cl-van');
    tl.from(lines.map(l => l.querySelector('span')), { yPercent: 60, opacity: 0, duration: .8, ease: 'power4.out', stagger: .4 }, .3)
      .from(lines.map(l => l.querySelector('.cl-dot')), { scale: 0, duration: .5, ease: BACK, stagger: .4 }, .45)
      .from($(el, '.cl-x'), { scale: .4, rotation: -40, opacity: 0, duration: 1.1, ease: BACK, transformOrigin: '50% 50%' }, .2);
    draw(tl, road, .6, { duration: 1.7 });
    tl.from($(el, '.cl-dash'), { opacity: 0, duration: .5 }, 2.0)
      .to(van, { opacity: 1, duration: .3 }, .8)
      .to(van, Object.assign(mp(road, 0, .95, { alignOrigin: [.5, .9], autoRotate: true }), { duration: 2.8, ease: IO }), .8);
    pop(tl, $(el, '.cl-end .pin-in'), 1.9);
    rise(tl, $$(el, '.cl-thanks > *'), 2.0, { stagger: .12 });
    tl.from($(el, '.cl-logo'), { opacity: 0, duration: .6 }, 2.5);
    A.loop(() => {
      flowDash($(el, '.cl-dash'));
      gsap.fromTo($(el, '.cl-end .ring'), { scale: 1, opacity: .9 }, { scale: 2.6, opacity: 0, duration: 1.6, ease: 'power1.out', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to($(el, '.cl-x'), { scale: 1.04, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 50%' });
    });
  };
})();
