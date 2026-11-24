/* =====================================================================
   Finale: "Does an AI world still need PMs and designers?"
   Build 0: a swarm of agents does tasks around an empty core.
   Build 1: the core becomes PM + PD, the swarm orbits it, and five
            human jobs fly out on beams.
   The swarm is a canvas driven by gsap.ticker; S.burst / S.focus are
   tweened by the slide timeline, so seeking the timeline drives it.
   ===================================================================== */
(() => {
  'use strict';
  const FX = window.SLIDE_FX;
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const BACK = 'back.out(1.7)', OUT = 'power3.out', IO = 'power2.inOut';
  const CX = 1290, CY = 560, R_CARD = 330, R_IN = 104, R_OUT = 262;
  const rad = a => a * Math.PI / 180;
  const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };

  FX.human = (el, tl, A) => {
    const cv = $(el, '.sw-cv'), g = cv.getContext('2d');
    const blue = (getComputedStyle(el).getPropertyValue('--blue').trim() || '#0088BF');
    const [br, bg, bb] = hex(blue);
    const S = { burst: 0, focus: 0 };
    const coreH = $(el, '.core-h');

    // glow sprite for agents
    const spr = document.createElement('canvas'); spr.width = spr.height = 32;
    const sg = spr.getContext('2d'), grd = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, `rgba(${br},${bg},${bb},1)`); grd.addColorStop(.35, `rgba(${br},${bg},${bb},.85)`); grd.addColorStop(1, `rgba(${br},${bg},${bb},0)`);
    sg.fillStyle = grd; sg.fillRect(0, 0, 32, 32);

    const N = 230, P = [];
    for (let i = 0; i < N; i++) P.push({
      a: Math.random() * 6.2832, rw: 140 + Math.random() * 300, rt: 122 + Math.random() * 140,
      sp: (.14 + Math.random() * .38) * (Math.random() < .8 ? 1 : -1), z: .3 + Math.random() * .7,
      wf: .5 + Math.random() * 1.6, ph: Math.random() * 6.2832, dv: 0, px: null, py: null,
    });
    let last = performance.now(), t = 0, nextDeliver = 0, lastPulse = 0;
    const pulse = () => {
      if (t - lastPulse < .25) return; lastPulse = t;
      gsap.fromTo(coreH, { scale: 1 }, { scale: 1.05, duration: .12, yoyo: true, repeat: 1, ease: 'power1.out', overwrite: 'auto' });
    };
    g.setTransform(1.5, 0, 0, 1.5, 0, 0); g.clearRect(0, 0, 1920, 1080);
    const render = () => {
      const now = performance.now(), dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
      g.setTransform(1.5, 0, 0, 1.5, 0, 0);
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,.24)'; g.fillRect(0, 0, 1920, 1080);
      g.globalCompositeOperation = 'source-over'; g.lineCap = 'round';
      const f = S.focus, b = S.burst;
      if (b < .002) return;
      if (f > .92 && t > nextDeliver) { const p = P[(Math.random() * N) | 0]; if (!p.dv) p.dv = .001; nextDeliver = t + .35 + Math.random() * .45; }
      for (const p of P) {
        p.a += p.sp * dt * (1.7 - .7 * f);
        let r = p.rw + (p.rt - p.rw) * f + Math.sin(t * p.wf + p.ph) * (24 * (1 - f) + 5);
        if (p.dv) {
          p.dv += dt * 1.25; r = r * Math.max(0, 1 - p.dv) + R_IN * Math.min(1, p.dv) * .9;
          if (p.dv >= 1) { p.dv = 0; p.a = Math.random() * 6.2832; p.px = null; pulse(); continue; }
        }
        r *= b;
        const x = CX + Math.cos(p.a) * r, y = CY + Math.sin(p.a) * r * .94;
        const al = (.3 + .55 * p.z) * (.6 + .4 * f) * Math.min(1, b * 1.4);
        if (p.px !== null) {
          g.strokeStyle = `rgba(${br},${bg},${bb},${(al * .55).toFixed(3)})`; g.lineWidth = .8 + 1.6 * p.z;
          g.beginPath(); g.moveTo(p.px, p.py); g.lineTo(x, y); g.stroke();
        }
        const s = 7 + 11 * p.z; g.globalAlpha = al; g.drawImage(spr, x - s / 2, y - s / 2, s, s); g.globalAlpha = 1;
        p.px = x; p.py = y;
      }
    };
    gsap.ticker.add(render);
    A.onLeave(() => { gsap.ticker.remove(render); setTimeout(() => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); }, 360); });

    // ---- build 0: the question, the swarm, an empty core
    tl.fromTo(S, { burst: 0 }, { burst: 1, duration: 1.8, ease: 'expo.out' }, .35)
      .fromTo($(el, '.core-q'), { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .7, ease: BACK }, .3)
      .from($$(el, '.hu-orb'), { opacity: 0, scale: .6, svgOrigin: `${CX} ${CY}`, duration: .9, stagger: .15 }, .5);
    A.loop(() => {
      const labels = $$(el, '.hu-task');
      labels.forEach((lb, i) => {
        const dx = (Math.random() < .5 ? -1 : 1) * (18 + Math.random() * 26);
        gsap.timeline({ repeat: -1, delay: i * .5 + Math.random() * .4 })
          .call(() => {
            const a = Math.random() * 6.2832, focus = S.focus > .5;
            const r = focus ? 200 + Math.random() * 50 : 180 + Math.random() * 240;
            gsap.set(lb, { x: CX + Math.cos(a) * r - lb.offsetWidth / 2, y: CY + Math.sin(a) * r * .94 - 20, scale: .7, opacity: 0 });
          })
          .to(lb, { opacity: 1, scale: 1, duration: .35, ease: BACK })
          .to(lb, { x: `+=${dx}`, duration: 2.2, ease: 'none' }, '<')
          .to(lb, { opacity: 0, scale: .85, duration: .35 }, '-=.45')
          .to({}, { duration: .5 + Math.random() * 1.4 });
      });
    }, 0);
    A.step();

    // ---- build 1: the answer
    const T = tl.duration();
    const cards = $$(el, '.hu-card');
    tl.fromTo(S, { focus: 0 }, { focus: 1, duration: 1.5, ease: IO }, T)
      .to($(el, '.core-q'), { opacity: 0, scale: .5, duration: .3 }, T)
      .from(coreH, { scale: 0, opacity: 0, duration: .8, ease: 'back.out(1.8)' }, T + .15)
      .fromTo($$(el, '.core-halo'), { opacity: .9, scale: .9 }, { opacity: 0, scale: 1.9, duration: 1.1, ease: 'power2.out', stagger: .2, immediateRender: false }, T + .3)
      .to($(el, '.hu-tasks'), { opacity: 0, duration: .4 }, T)
      .from($(el, '.hu-yes'), { scale: .4, opacity: 0, rotation: -8, duration: .7, ease: 'back.out(1.8)' }, T + .35)
      .from($(el, '.hu-move'), { y: 24, opacity: 0, duration: .6, ease: OUT }, T + .7)
      .from($$(el, '.hu-link'), { drawSVG: '0%', duration: .5, ease: 'power2.out', stagger: .12 }, T + .6);
    cards.forEach((c, i) => {
      const a = rad(+c.dataset.a), cx = CX + Math.cos(a) * R_CARD, cy = CY + Math.sin(a) * R_CARD;
      tl.from(c, { x: (CX - cx) * .85, y: (CY - cy) * .85, scale: .25, opacity: 0, duration: .75, ease: 'back.out(1.4)' }, T + .8 + i * .13);
    });
    tl.from($$(el, '.hu-punch span'), { x: -24, opacity: 0, duration: .5, ease: OUT, stagger: .15 }, T + 1.6);
    A.loop(() => {
      const beams = $$(el, '.hu-beam'), links = $$(el, '.hu-link');
      const bt = gsap.timeline({ repeat: -1, repeatDelay: .6 });
      beams.forEach((bm, i) => {
        bt.fromTo(bm, { opacity: 0 }, { opacity: 1, duration: .12 }, i * .45)
          .to(bm, { motionPath: { path: links[i], align: links[i], alignOrigin: [.5, .5] }, duration: .8, ease: 'power1.in' }, i * .45)
          .to(bm, { opacity: 0, duration: .15 }, i * .45 + .7)
          .fromTo(cards[i], { boxShadow: '0 0 0 0px rgba(255,221,0,0)' }, { boxShadow: '0 0 0 6px rgba(255,221,0,.7)', duration: .18, yoyo: true, repeat: 1 }, i * .45 + .75);
      });
      gsap.fromTo($$(el, '.core-halo'), { opacity: .7, scale: 1 }, { opacity: 0, scale: 1.7, duration: 1.8, ease: 'power1.out', repeat: -1, stagger: .9 });
    }, 1);
  };

  FX.human.init = el => {
    const ns = 'http://www.w3.org/2000/svg';
    const links = $(el, '.hu-links'), beams = $(el, '.hu-beams');
    $$(el, '.hu-card').forEach(c => {
      const a = rad(+c.dataset.a);
      const p = document.createElementNS(ns, 'path');
      p.setAttribute('class', 'hu-link');
      p.setAttribute('d', `M${(CX + Math.cos(a) * R_IN).toFixed(1)} ${(CY + Math.sin(a) * R_IN).toFixed(1)} L${(CX + Math.cos(a) * R_OUT).toFixed(1)} ${(CY + Math.sin(a) * R_OUT).toFixed(1)}`);
      links.appendChild(p);
      const b = document.createElementNS(ns, 'circle');
      b.setAttribute('class', 'hu-beam'); b.setAttribute('r', '7'); b.setAttribute('opacity', '0');
      beams.appendChild(b);
    });
    // place cards around the core (needs real heights, so after fonts load)
    const placeCards = () => $$(el, '.hu-card').forEach(c => {
      const a = rad(+c.dataset.a), cx = CX + Math.cos(a) * R_CARD, cy = CY + Math.sin(a) * R_CARD;
      const w = c.offsetWidth || 310, h = c.offsetHeight || 130;
      c.style.left = Math.max(760, Math.min(1800 - w, cx - w / 2)) + 'px';
      c.style.top = (cy - h / 2) + 'px';
    });
    placeCards();
    if (document.fonts) document.fonts.ready.then(placeCards);
  };
})();
