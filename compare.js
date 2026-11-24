/* =====================================================================
   "Same brief. Two apps." Agents only vs agents + PM + PD.
   Two live phone mock-ups tour five rows in sync with the notes;
   row i = the i-th human job from the previous slide.
   ===================================================================== */
(() => {
  'use strict';
  const FX = window.SLIDE_FX;
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const OUT = 'power3.out', BACK = 'back.out(1.6)', IO = 'power2.inOut';
  const rise = (tl, t, at, o = {}) => tl.from(t, Object.assign({ y: 24, opacity: 0, duration: .55, ease: OUT, stagger: .08 }, o), at);
  const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const VIEW_H = 680;

  /* ---------------- agents-only app: plain, everything crammed on home ---------------- */
  const LA_TILES = ['van|Book van', 'truck|Book truck', 'moto|Courier', 'box|Moving', 'cal|Schedule', 'loop|Recurring', 'flag|Multi-stop', 'eye|Track',
    'coins|Wallet', 'plug|Top up', 'ticket|Coupons', 'star|Rewards', 'users|Refer', 'shield|Insurance', 'alert|Claims', 'doc|Invoices',
    'chart|Reports', 'gauge|Analytics', 'truck|Fleet', 'wheel|Drivers', 'building|Addresses', 'users|Team', 'code|API', 'loop|Carbon',
    'spark|AI chat', 'headset|Support', 'sliders|Settings', 'layers|More'];
  const lf = (label, ph) => `<label class="la-f"><span>${label}</span><i>${ph}</i></label>`;
  const AI_APP = `<div class="ap la"><div class="ap-scr"><div class="ap-sc">
    <div class="la-top" data-r="0">
      <div class="ap-sb"><b>9:41</b><span><i></i><i></i><i></i></span></div>
      <div class="la-bar"><span class="la-burger">☰</span><svg class="la-wm" viewBox="0 0 135 24"><use href="#g-wordmark"/></svg><span class="la-aitag">✨ AI</span><i class="la-sp"></i>${ic('search')}<span class="la-bell">${ic('alert')}<em>12</em></span>${ic('user')}</div>
      <div class="la-search">Search services, orders, help…</div>
      <div class="la-tagline">Smart, seamless logistics, powered by AI ✨</div>
      <div class="la-banner">NEW! AI price prediction · Refer a friend, earn $50 · Go carbon neutral today · Premium 20% off!</div>
      <div class="la-quick"><span>Book now</span><span>Schedule</span><span>Track</span><span>Get quote</span><span>Chat AI</span></div>
    </div>
    <div class="la-grid" data-r="1">${LA_TILES.map(t => { const [i, n] = t.split('|'); return `<div>${ic(i)}<span>${n}</span></div>`; }).join('')}</div>
    <div class="la-more">
      <div class="la-ai">Ask AI anything about your shipment…</div>
      <div class="la-sec"><b>Recent orders</b><span>See all</span></div><div class="la-empty">No orders yet</div>
      <div class="la-sec"><b>Popular routes</b><span>See all</span></div>
      <div class="la-route">Kwun Tong → Central <i>from $—</i></div><div class="la-route">Mong Kok → Sha Tin <i>from $—</i></div>
    </div>
    <div class="la-form" data-r="2">
      <b class="la-h">Create shipment</b>
      ${lf('Pickup address', 'Enter full address')}${lf('Drop-off address', 'Enter full address')}
      <div class="la-2">${lf('Pickup date', 'dd/mm/yyyy')}${lf('Pickup time', '--:--')}</div>
      ${lf('Vehicle type', 'Select ▾')}${lf('Weight (kg)', '0')}
      <div class="la-3">${lf('Length (cm)', '0')}${lf('Width (cm)', '0')}${lf('Height (cm)', '0')}</div>
      ${lf('Number of helpers', 'Select ▾')}${lf('Insurance tier', 'Select ▾')}${lf('Promo code', 'Optional')}${lf('Special notes', 'Type here…')}${lf('Contact phone', '+852')}
    </div>
    <div class="la-price" data-r="3"><span>AI-optimized price</span><b>$ – –</b><em>Final price may vary</em><span class="la-btn">Calculate price</span></div>
  </div>
  <div class="la-fab">${ic('spark')}AI</div>
  <div class="la-tabbar">${['van|Home', 'doc|Orders', 'coins|Wallet', 'spark|AI', 'star|Rewards', 'user|Me'].map(t => { const [i, n] = t.split('|'); return `<span>${ic(i)}<i>${n}</i></span>`; }).join('')}</div>
  <div class="la-modal"><div class="la-alert" data-r="4"><b>Upgrade to Premium?</b><p>Priority matching, insurance and carbon offset for +$48 per trip.</p><span class="la-a1">Upgrade (+$48)</span><span class="la-a2">Not now</span></div></div>
  <div class="cm-ring bad"></div>
  </div></div>`;

  /* ---------------- agents + PM + PD: our real GoGoX client app flow ---------------- */
  const MAP = `<svg class="rg-map" viewBox="0 0 310 380" preserveAspectRatio="xMidYMid slice">
    <rect width="310" height="380" fill="#EEF1EC"/>
    <path d="M0 300 C 60 290 120 320 180 300 S 280 270 310 285 V380 H0Z" fill="#CFE6F2"/>
    <rect x="18" y="120" width="92" height="64" rx="8" fill="#D6EBCF"/><rect x="214" y="60" width="70" height="46" rx="8" fill="#D6EBCF"/>
    <g stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"><path d="M-10 210 L 320 170"/><path d="M150 -10 L 175 300"/><path d="M40 -10 L 90 290"/><path d="M230 0 L 260 270"/></g>
    <g stroke="#F6D77A" stroke-width="5" fill="none" stroke-linecap="round"><path d="M-10 250 L 320 214"/></g>
    <text x="30" y="112" font-size="10" fill="#7A8794">Kowloon Park 九龍公園</text>
    <text x="118" y="236" font-size="12" font-weight="700" fill="#4E5B66">TSIM SHA TSUI</text><text x="140" y="250" font-size="11" fill="#4E5B66">尖沙咀</text>
    <text x="222" y="140" font-size="10" fill="#7A8794">Prat Ave</text><text x="196" y="292" font-size="10" fill="#7A8794">Mody Rd</text>
    <circle cx="168" cy="205" r="14" fill="#0088BF" opacity=".18"/><circle cx="168" cy="205" r="7" fill="#fff" stroke="#0088BF" stroke-width="4"/>
  </svg>`;
  const veh = (art, name, l1, l2, price, sel) => `<div class="rg-v${sel ? ' sel' : ''}"><span class="rg-art">${art}</span><div><b>${name}</b><em>${l1}</em><em>${l2}</em></div><strong>${price}</strong>${sel ? `<i class="rg-tick">${ic('check')}</i>` : ''}</div>`;
  const VAN = '<svg viewBox="0 0 48 30" class="rg-van"><use href="#g-van"/></svg>';
  const box = c => `<i class="rg-cb${c ? ' on' : ''}">${c ? ic('check') : ''}</i>`;
  const stp = (n, y) => `<span class="rg-stp${y ? ' y' : ''}"><i>−</i>${n}<i>+</i></span>`;
  const add = (name, price, ctl, sub) => `<div class="rg-a"><div><b>${name}</b>${sub ? `<em>${sub}</em>` : ''}</div><span class="rg-ap">${price}</span>${ctl}</div>`;
  const PAY = `<span class="rg-pay"><i>$</i>個人 轉數快 ▾</span>`;
  const GR_APP = `<div class="ap rg"><div class="ap-scr">
    <div class="rg-s s-home" data-s="0">
      ${MAP}
      <div class="ap-sb rg-sb"><b>9:41</b><span><i></i><i></i><i></i></span></div>
      <div class="rg-tabs" data-r="0"><span class="on">叫車</span><span>速遞</span><span>搬屋</span></div>
      <div class="rg-sheet0" data-r="1">
        <div class="rg-rt"><i class="rg-dot"></i><span class="rg-in">尖沙咀</span></div>
        <div class="rg-rt"><i class="rg-dot"></i><span class="rg-in hi">落貨點<b>➤</b></span></div>
        <div class="rg-addstop">⊕ 新增落貨點</div>
        <div class="rg-saved"><b>已儲存的路線</b><span>修改</span></div>
        <div class="rg-next">下一步</div>
      </div>
    </div>
    <div class="rg-s s-veh" data-s="1">
      <div class="ap-sb"><b>9:41</b><span><i></i><i></i><i></i></span></div>
      <div class="rg-hd">${ic('chev-l')}<b>尖沙咀 → 旺角</b></div>
      <div class="rg-card">
        <div class="rg-row">${ic('cal')}<b>今日4月10日, 儘快</b>${ic('chev')}</div>
        <div class="rg-row">${ic('clock')}<b>包鐘</b><span>不需要</span>${ic('chev')}</div>
      </div>
      <div class="rg-vl" data-r="2">
        ${veh(`<span class="rg-moto">${ic('moto')}</span>`, '速遞員', '包括上門搬運，電單車或步兵速遞', '40 x 40 x 40 厘米，重量上限 10 公斤', '$50')}
        ${veh(VAN, '貨 Van', '容積: 5.5 x 4 x 4 呎', '載重: 700 公斤', '$55', true)}
        ${veh(VAN, '5.5噸貨車', '容積: 12-15 x 6 x 6 呎', '載重: 1 - 1.3 噸', '$135')}
        ${veh(VAN, '9噸貨車', '容積: 15-19 x 6 x 6 呎', '載重: 3 - 3.5 噸', '$225')}
      </div>
      <div class="rg-how">如何選擇車種？ⓘ</div>
      <div class="rg-foot">${PAY}<div class="rg-next">下一步</div></div>
    </div>
    <div class="rg-s s-ord" data-s="2">
      <div class="ap-sb"><b>9:41</b><span><i></i><i></i><i></i></span></div>
      <div class="rg-hd c">${ic('chev-l')}<b>柯打詳情</b></div>
      <div class="rg-comp" data-r="3">
        <b>貨物賠償 ⓘ</b><em>選擇損壞物品的賠償選項</em>
        <div class="rg-tiers"><span class="on"><b>已包括</b><em>賠償上限 $2,000</em></span><span><b>基本 <i>$10</i></b><em>賠償上限 $5,000</em></span><span><b>標準</b><em>賠償上限</em></span></div>
      </div>
      <div class="rg-adds" data-r="4">
        ${add('跟車乘客', '$0', stp(1, true))}
        ${add('尊尚貨 Van ⓘ', '$20', box(false))}
        ${add('租用手推車或板車', '$10', stp(0))}
        ${add('貨物長度超過6呎', '$20', box(false))}
        ${add('寵物友善司機', '$10', box(false))}
        ${add('講英語的司機', '$5', box(false))}
        ${add('沒有偏好', '$-', box(true), '隧道偏好')}
        ${add('包括上門搬運', '報價', box(false))}
      </div>
      <div class="rg-foot o">${PAY}<div class="rg-cta"><b>查看柯打</b><span>估計收費 <strong>$90</strong></span></div></div>
    </div>
    <div class="rg-match"><i class="rg-grab"></i><div class="rg-mh">${ic('check')}<b>司機已接單</b></div>
      <div class="rg-drv"><span class="rg-dav">陳</span><div><b>陳先生</b><em>★ 4.9，貨 Van</em></div><strong>約8分鐘</strong></div>
      <div class="rg-btns"><span>致電</span><span class="p">追蹤</span></div></div>
    <div class="cm-ring good"></div>
  </div></div>`;

  /* ---------------- tour ---------------- */
  const offIn = (n, root) => { let x = 0, y = 0; while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x, y }; };
  const ringAt = (ring, x, y, w, h, delay) => {
    gsap.set(ring, { top: y - 6, left: x - 6, width: w + 12, height: h + 12 });
    gsap.fromTo(ring, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .35, ease: BACK, delay });
  };
  // One clock for both phones: move .8s, ring at .7s; on row 4 the button is
  // pressed at 1.6s and the pop-up (left) / matched sheet (right) lands at 2.0s.
  const MOVE = .8, RING = .7, PRESS = 1.6, POP = 2.0, RING2 = 2.4;
  const press = n => gsap.fromTo(n, { scale: 1 }, { scale: .94, duration: .12, yoyo: true, repeat: 1, delay: PRESS });
  // left: one long page that scrolls, with an upsell alert on row 4
  function leftShow(app, i) {
    const scr = $(app, '.ap-scr'), sc = $(app, '.ap-sc'), ring = $(app, '.cm-ring'), modal = $(app, '.la-modal');
    gsap.to(ring, { opacity: 0, duration: .2, overwrite: 'auto' });
    gsap.killTweensOf(modal);
    if (i < 0) { gsap.to(sc, { y: 0, duration: MOVE, ease: IO }); gsap.to(modal, { autoAlpha: 0, duration: .3 }); return; }
    gsap.to(modal, { autoAlpha: 0, duration: .25 });
    const r = $(app, `[data-r="${i === 4 ? 3 : i}"]`);
    const y = Math.max(0, Math.min(sc.offsetHeight - VIEW_H, r.offsetTop - (i === 0 ? 0 : 50)));
    gsap.to(sc, { y: -y, duration: MOVE, ease: IO });
    ringAt(ring, r.offsetLeft, r.offsetTop - y, r.offsetWidth, r.offsetHeight, RING);
    if (i === 3) gsap.fromTo($(app, '.la-price b'), { scale: 1 }, { scale: 1.08, duration: .25, yoyo: true, repeat: 3, delay: 1.2, transformOrigin: '0 50%' });
    if (i === 4) {
      const al = $(app, '.la-alert');
      press($(app, '.la-btn'));
      gsap.to(ring, { opacity: 0, duration: .2, delay: POP - .1 });
      gsap.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, delay: POP, immediateRender: false });
      gsap.fromTo(al, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: BACK, delay: POP, immediateRender: false });
      gsap.delayedCall(RING2, () => { const o = offIn(al, scr); ringAt(ring, o.x, o.y, al.offsetWidth, al.offsetHeight, 0); });
    }
  }
  // right: the real GoGoX flow, screen to screen
  const R_SCREEN = [0, 0, 1, 2, 2];
  function rightGo(app, k, dur = MOVE) {
    $$(app, '.rg-s').forEach(sc => {
      const n = +sc.dataset.s;
      gsap.to(sc, { xPercent: n === k ? 0 : (n < k ? -28 : 100), opacity: n < k ? 0 : 1, duration: dur, ease: IO, overwrite: 'auto' });
    });
  }
  function rightShow(app, i) {
    const scr = $(app, '.ap-scr'), ring = $(app, '.cm-ring'), match = $(app, '.rg-match');
    gsap.to(ring, { opacity: 0, duration: .2, overwrite: 'auto' });
    gsap.killTweensOf(match);
    if (i < 0) { rightGo(app, 0); gsap.to(match, { yPercent: 115, duration: .35, ease: 'power2.in' }); return; }
    const k = R_SCREEN[i], screen = $(app, `.rg-s[data-s="${k}"]`), r = $(app, `[data-r="${i}"]`);
    rightGo(app, k);
    gsap.to(match, { yPercent: 115, duration: .3 });
    const o = offIn(r, screen);
    ringAt(ring, o.x, o.y, r.offsetWidth, r.offsetHeight, RING);
    if (i === 3) gsap.fromTo($(app, '.rg-cta'), { scale: 1 }, { scale: 1.05, duration: .25, yoyo: true, repeat: 3, delay: 1.2 });
    if (i === 4) {
      press($(app, '.rg-cta'));
      gsap.to(ring, { opacity: 0, duration: .2, delay: POP - .1 });
      gsap.fromTo(match, { yPercent: 115 }, { yPercent: 0, duration: .5, ease: BACK, delay: POP, immediateRender: false });
      gsap.delayedCall(RING2, () => { const m = offIn(match, scr); ringAt(ring, m.x + 8, m.y + 6, match.offsetWidth - 16, match.offsetHeight - 22, 0); });
    }
  }
  function showRow(el, i) {
    $$(el, '.cm-note, .cm-val').forEach(n => n.classList.toggle('on', +n.dataset.i === i));
    leftShow($(el, '.ap.la'), i);
    rightShow($(el, '.ap.rg'), i);
  }
  function resetTour(el) {
    if (el._tour) { el._tour.kill(); el._tour = null; }
    if (el._resume) { el._resume.kill(); el._resume = null; }
    $$(el, '.cm-note, .cm-val').forEach(n => n.classList.remove('on'));
    $$(el, '.ap-sc').forEach(sc => gsap.set(sc, { y: 0 }));
    $$(el, '.cm-ring').forEach(r => gsap.set(r, { opacity: 0 }));
    $$(el, '.la-modal').forEach(m => gsap.set(m, { autoAlpha: 0 }));
    $$(el, '.rg-match').forEach(s => gsap.set(s, { yPercent: 115 }));
    $$(el, '.rg-s').forEach(s => gsap.set(s, { xPercent: +s.dataset.s === 0 ? 0 : 100, opacity: 1 }));
  }

  FX.compare = (el, tl, A) => {
    el._api = A;
    resetTour(el);
    rise(tl, $(el, '.cm-head.l'), .35, { y: -10 });
    tl.from($(el, '.cm-phone.l'), { y: 70, opacity: 0, rotation: -4, duration: .8, ease: 'back.out(1.3)' }, .45);
    rise(tl, $$(el, '.cm-phone.l [data-r]'), .8, { y: 18, stagger: .07, duration: .4 });
    rise(tl, $$(el, '.cm-val'), .9, { y: 14, stagger: .07, duration: .4 });
    rise(tl, $$(el, '.cm-notes.l .cm-note'), 1.1, { x: -30, y: 0, stagger: .08, duration: .45 });
    rise(tl, $(el, '.cm-cap.l'), 1.6, { y: 10 });
    tl.fromTo($(el, '.cm-ghost'), { autoAlpha: 0, scale: .94 }, { autoAlpha: 1, scale: 1, duration: .6, ease: OUT }, 1.4);
    A.step();
    const T = tl.duration();
    tl.to($(el, '.cm-ghost'), { autoAlpha: 0, scale: 1.05, duration: .35 }, T);
    rise(tl, $(el, '.cm-head.r'), T, { y: -10 });
    tl.from($(el, '.cm-phone.r'), { x: 160, opacity: 0, rotation: 5, duration: .8, ease: 'back.out(1.3)' }, T + .05);
    rise(tl, $$(el, '.cm-phone.r [data-r]'), T + .4, { y: 18, stagger: .07, duration: .4 });
    rise(tl, $$(el, '.cm-notes.r .cm-note'), T + .6, { x: 30, y: 0, stagger: .08, duration: .45 });
    rise(tl, $(el, '.cm-cap.r'), T + 1.1, { y: 10 });
    A.onLeave(() => resetTour(el));
    A.loop(() => { startTour(el, 0, .4); return () => resetTour(el); }, 1);
  };
  function startTour(el, from = 0, delay = 0) {
    if (el._tour) el._tour.kill();
    const t = gsap.timeline({ repeat: -1, delay });
    for (let k = 0; k < 6; k++) {
      const i = (from + k) % 6, row = i === 5 ? -1 : i;   // 5 = back to the start
      t.call(() => showRow(el, row)).to({}, { duration: row === 4 ? 4.8 : row < 0 ? 1.6 : 3.4 });
    }
    el._tour = t;
  }
  FX.compare.init = el => {
    $(el, '[data-app="ai"]').innerHTML = AI_APP;
    $(el, '[data-app="pmpd"]').innerHTML = GR_APP;
    resetTour(el);
    el.addEventListener('click', e => {
      const n = e.target.closest('.cm-note, .cm-val'); if (!n || !el._api || el._api.stopIndex() < 1) return;
      if (el._tour) { el._tour.kill(); el._tour = null; }
      if (el._resume) el._resume.kill();
      const i = +n.dataset.i;
      showRow(el, i);
      el._resume = gsap.delayedCall(i === 4 ? 6 : 4.5, () => startTour(el, i + 1));
    });
  };
})();
