/* =====================================================================
   WhatsApp chatbot slides: the chat from the customer's side (three
   Cantonese scenarios + a live "behind the chat" panel) and the map of
   what runs behind it (AI → fixed flows → our systems → people).
   ===================================================================== */
(() => {
  'use strict';
  const FX = window.SLIDE_FX;
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const OUT = 'power3.out', BACK = 'back.out(1.7)', IO = 'power2.inOut';
  const rise = (tl, t, at, o = {}) => tl.from(t, Object.assign({ y: 24, opacity: 0, duration: .55, ease: OUT, stagger: .08 }, o), at);
  const pop = (tl, t, at, o = {}) => tl.from(t, Object.assign({ scale: 0, opacity: 0, duration: .45, ease: BACK, stagger: .08, transformOrigin: '50% 50%' }, o), at);
  const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const chars = s => Array.from(s);
  const node = html => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
  const TAG = { ai: 'AI', fx: 'Fixed', sy: 'System', hu: 'Customer', miss: 'Missing' };

  /* ---------- WhatsApp glyphs ---------- */
  const W = {
    tick: '<svg class="wa-tk" viewBox="0 0 17 10"><path d="M1 5.2l2.8 2.9L9.6 1.6M6.6 7.4l.8.8 6.5-6.6"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 4.5L7.5 12l7.5 7.5"/></svg>',
    video: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5z"/></svg>',
    call: '<svg viewBox="0 0 24 24"><path d="M5 3.5h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 6.4 6.4l1.5-2.3 4.6 1.8V19a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M3.5 8h3.5l1.8-2.5h6.4L17 8h3.5v11h-17z"/><circle cx="12" cy="13.2" r="3.4"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
    ver: '<svg viewBox="0 0 24 24"><path d="M12 1.8l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z" class="vb"/><path d="M7.8 12.2l2.8 2.8 5.6-6" class="vk"/></svg>',
    reply: '<svg viewBox="0 0 24 24"><path d="M10 6.5L4.5 12 10 17.5M5 12h9a6 6 0 0 1 6 6"/></svg>',
  };
  const bars = (n, seed) => { let x = seed, o = ''; for (let i = 0; i < n; i++) { x = (x * 9301 + 49297) % 233280; o += `<i style="height:${4 + Math.round((x / 233280) * 20)}px"></i>`; } return o; };
  const MAP = `<svg viewBox="0 0 260 112" preserveAspectRatio="xMidYMid slice"><rect width="260" height="112" class="mp-bg"/><path d="M-10 78 L270 40 M60 -10 L104 122 M150 -10 L190 122 M-10 22 L270 96" class="mp-rd"/><path d="M-10 60 L270 60" class="mp-rd big"/><rect x="18" y="8" width="38" height="22" rx="3" class="mp-bk"/><rect x="200" y="74" width="44" height="26" rx="3" class="mp-bk"/><rect x="118" y="80" width="26" height="18" rx="3" class="mp-pk"/><g transform="translate(130 56)"><path d="M0 0c-6-8-10-13-10-18a10 10 0 0 1 20 0c0 5-4 10-10 18z" class="mp-pin"/><circle cy="-18" r="3.6" fill="#fff"/></g></svg>`;
  const CHAIR = `<svg viewBox="0 0 230 150"><rect width="230" height="150" class="ph-bg"/><rect x="0" y="112" width="230" height="38" class="ph-fl"/><path d="M78 30h56v54H78z" class="ph-ch"/><path d="M70 84h76v10H70z" class="ph-ch"/><path d="M76 94v34M140 94v34M88 94v16" class="ph-lg"/><path d="M96 124l14-6" class="ph-lg"/><path d="M128 94l-6 10 8 6-6 12" class="ph-ck"/><circle cx="186" cy="38" r="14" class="ph-lamp"/></svg>`;

  /* ---------- the three scenarios (Cantonese chat, English panel) ---------- */
  const SC = [
    {
      intent: 'Book a van · 叫車', heardIc: 'mic',
      stages: [['Hear', '聽', 'ai'], ['Understand', '理解', 'ai'], ['Ask', '補問', 'fx'], ['Price', '報價', 'sy'], ['Confirm', '確認', 'hu'], ['Driver', '配對', 'sy']],
      fields: [['Vehicle', '車型'], ['When', '時間'], ['From', '起點'], ['To', '終點'], ['Cargo', '貨物'], ['Helpers', '跟車'], ['Price', '車費']],
      script: [
        ['st', 0],
        ['voice', '0:06'],
        ['heard', '而家要架客貨車，觀塘去中環，有幾箱嘢。'],
        ['log', 'mic', 'Voice note → text', 'AI listens · Cantonese', 'ai'],
        ['st', 1],
        ['intent'],
        ['f', 0, '客貨車', 'ai'], ['f', 1, '即時', 'ai'], ['f', 2, '觀塘', 'ai'], ['f', 3, '中環', 'ai'], ['f', 4, '幾箱 · 幾長？', 'miss'], ['f', 5, '？', 'miss'],
        ['log', 'spark', 'Wants: book a van', 'AI picks the booking flow', 'ai'],
        ['st', 2],
        ['out', '收到！貨物長唔長過6呎？', ['6呎或以下', '長過6呎']],
        ['tap', 0],
        ['f', 4, '幾箱 · 6呎或以下', 'fx', 'Asked'],
        ['out', '請send起點位置📍，再講埋去邊同使唔使跟車。'],
        ['loc', '鴻圖道', '觀塘'],
        ['f', 2, '觀塘鴻圖道', 'ai'],
        ['in', '去中環皇后大道中，唔使跟車'],
        ['f', 3, '中環皇后大道中', 'ai'], ['f', 5, '唔使', 'ai'],
        ['log', 'check', 'All required details in', 'Booking flow · fixed by us', 'fx'],
        ['st', 3],
        ['log', 'coins', 'GetQuote → $158', 'Our pricing system', 'sy'],
        ['f', 6, '$158', 'sy'],
        ['st', 4],
        ['card'],
        ['tap', 0],
        ['log', 'person-check', 'Customer tapped confirm', 'Nothing is placed before this', 'hu'],
        ['st', 5],
        ['log', 'box', 'SubmitOrder → #GX-8841', 'Our order system', 'sy'],
        ['sys', '配對司機中…'],
        ['log', 'van', 'Driver matched · 15s', 'Our matching', 'sy'],
        ['drv', '搵到司機喇！', '陳師傅', 'XY 2468', '15'],
        ['wait', 2.6],
      ],
    },
    {
      intent: 'Where is my driver · 查單', heardIc: 'chat',
      stages: [['Understand', '理解', 'ai'], ['Find', '搵單', 'sy'], ['Offer', '建議', 'fx'], ['Rush', '加急', 'hu'], ['Driver', '配對', 'sy']],
      fields: [['Order', '訂單'], ['Route', '路線'], ['Status', '狀態'], ['Waiting', '等咗'], ['Offer', '建議'], ['Driver', '司機']],
      script: [
        ['st', 0],
        ['in', '點解仲未有司機㗎？'],
        ['heard', '點解仲未有司機㗎？'],
        ['intent'],
        ['log', 'spark', 'Wants: where is my driver', 'AI picks the status flow', 'ai'],
        ['st', 1],
        ['log', 'search', 'Find order by WhatsApp number', 'Our order system', 'sy'],
        ['f', 0, '#GX-8790', 'sy'], ['f', 1, '荃灣 → 旺角', 'sy'], ['f', 2, '配對中', 'sy'], ['f', 3, '6分鐘', 'sy'],
        ['st', 2],
        ['log', 'sliders', 'No driver yet → offer rush fee', 'Status flow · fixed by us', 'fx'],
        ['f', 4, '加急 +$20', 'fx', 'Rule'],
        ['out', '搵到你張單：荃灣去旺角，等咗6分鐘。加$20加急費會快啲有司機，要唔要加？', ['加$20加急', '繼續等']],
        ['st', 3],
        ['tap', 0],
        ['log', 'coins', 'Rush fee +$20 added', 'Customer chose it', 'hu'],
        ['sys', '已加急 +$20'],
        ['log', 'loop', 'Re-sent to nearby drivers', 'Our matching', 'sy'],
        ['st', 4],
        ['log', 'van', 'Driver matched · 40s', 'Our matching', 'sy'],
        ['f', 5, '李師傅 · 12分鐘到', 'sy'],
        ['drv', '司機已接單 ✅', '李師傅', 'XY 1357', '12'],
        ['wait', 2.6],
      ],
    },
    {
      intent: 'Complaint · 投訴', heardIc: 'chat',
      stages: [['Understand', '理解', 'ai'], ['Decide', '判斷', 'fx'], ['Hand off', '轉介', 'fx'], ['A person', '真人', 'hu']],
      fields: [['Topic', '類別'], ['Mood', '情緒'], ['Photo', '相片'], ['Order', '訂單'], ['Next', '下一步']],
      script: [
        ['st', 0],
        ['in', '司機遲咗40分鐘，仲整爛咗我張櫈！'],
        ['photo'],
        ['heard', '遲咗40分鐘 · 整爛櫈 · 相片1張'],
        ['intent'],
        ['f', 0, '投訴 · 損壞', 'ai'], ['f', 1, '好嬲', 'ai'], ['f', 2, '櫈腳斷咗', 'ai'],
        ['log', 'spark', 'Complaint + damage photo', 'AI reads the text and the photo', 'ai'],
        ['st', 1],
        ['f', 3, '#GX-8712', 'sy'],
        ['log', 'shield', 'Complaints are not a bot decision', 'Fixed by us · rule', 'fx'],
        ['f', 4, '轉客服同事', 'fx', 'Rule'],
        ['st', 2],
        ['out', '真係好抱歉 🙏 我而家轉介客服同事，佢哋會睇到你張單同相片。'],
        ['sys', '已轉交客服同事'],
        ['inbox'],
        ['st', 3],
        ['agent', '你好，我係客服同事。睇咗相片同訂單，而家幫你跟進賠償。'],
        ['log', 'person-check', 'A person replies, same chat', 'Refunds and compensation: people only', 'hu', 'Person'],
        ['wait', 2.8],
      ],
    },
  ];

  /* ---------- timings (seconds before the next action) ---------- */
  const len = s => chars(s).length;
  const DUR = {
    st: () => .3, voice: () => 2.9, heard: a => .5 + len(a[1]) / 15, intent: () => .7,
    f: () => .38, log: () => .7, in: a => .9 + len(a[1]) * .03,
    out: a => 1.5 + len(a[1]) * .028 + (a[2] ? .8 : 0), tap: () => 1.4, loc: () => 1.4, photo: () => 1.5,
    card: () => 3.4, drv: () => 2.8, sys: () => 1.1, inbox: () => 1.9, agent: a => 1.9 + len(a[1]) * .028, wait: a => a[1],
  };

  /* ---------- helpers ---------- */
  const later = (el, s, fn) => { const d = gsap.delayedCall(s, fn); el._tw.push(d); return d; };
  const keep = (el, tw) => { el._tw.push(tw); return tw; };
  function typeInto(el, target, text, cps = 16) {
    const cs = chars(text), o = { n: 0 };
    target.textContent = '';
    return keep(el, gsap.to(o, { n: cs.length, duration: .15 + cs.length / cps, ease: 'none', onUpdate: () => { target.textContent = cs.slice(0, Math.round(o.n)).join(''); } }));
  }
  let clock = 0;
  const stamp = () => { const m = 2 + Math.floor(clock++ / 3); return `10:${String(m).padStart(2, '0')}`; };
  function scrollFeed(el, anim) {
    const chat = $(el, '.wa-chat'), feed = $(el, '.wa-feed');
    const over = feed.offsetHeight - chat.clientHeight;
    gsap.to(feed, { y: over > 0 ? -over : 0, duration: anim ? .45 : 0, ease: IO, overwrite: true });
  }
  function addMsg(el, n, anim) {
    $(el, '.wa-feed').appendChild(n);
    if (anim) {
      const mine = n.classList.contains('in');
      gsap.from(n, { scale: .82, opacity: 0, y: 14, duration: .38, ease: BACK, transformOrigin: mine ? '100% 100%' : '0% 100%' });
    }
    scrollFeed(el, anim);
    return n;
  }
  const bubble = (kind, html, extra = '') => node(`<div class="wa-m ${kind}"><div class="wa-b">${html}<span class="wa-t">${stamp()}${kind === 'in' ? W.tick : ''}</span></div>${extra}</div>`);
  const btns = list => `<div class="wa-btns">${list.map(l => `<button>${W.reply}${l}</button>`).join('')}</div>`;
  function withTyping(el, anim, wait, fn) {
    if (!anim) { fn(); return; }
    const t = addMsg(el, node('<div class="wa-m out typing"><div class="wa-b"><i></i><i></i><i></i></div></div>'), true);
    keep(el, gsap.to(t.querySelectorAll('i'), { y: -5, duration: .3, stagger: .12, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    later(el, wait, () => { t.remove(); fn(); });
  }

  /* ---------- panel ---------- */
  function setStage(el, k, anim) {
    const ss = $$(el, '.wp-s'), n = ss.length;
    ss.forEach((s, i) => { s.classList.toggle('done', i < k); s.classList.toggle('on', i === k); });
    gsap.to($(el, '.wp-rail i'), { scaleX: n > 1 ? k / (n - 1) : 0, duration: anim ? .5 : 0, ease: IO });
    if (anim && ss[k]) gsap.fromTo(ss[k].querySelector('.wp-sd'), { scale: .7 }, { scale: 1.15, duration: .45, ease: BACK });
  }
  function fillField(el, i, val, src, label, anim) {
    const r = $$(el, '.wp-f')[i]; if (!r) return;
    r.className = `wp-f ${src === 'miss' ? 'miss' : 'set'}`;
    const v = r.querySelector('.wp-fv'), t = r.querySelector('.wp-src');
    t.className = `wp-src s-${src}`; t.textContent = label || TAG[src];
    if (anim) {
      typeInto(el, v, val, 30);
      gsap.fromTo(t, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: BACK });
      gsap.fromTo(r, { backgroundColor: src === 'miss' ? 'rgba(255,221,0,.35)' : 'rgba(0,136,191,.16)' }, { backgroundColor: 'rgba(0,0,0,0)', duration: 1.1, clearProps: 'backgroundColor' });
    } else v.textContent = val;
  }
  function addLog(el, icon, title, sub, k, tag, anim) {
    const host = $(el, '.wp-log-in');
    const n = node(`<div class="wp-l k-${k}"><span class="wp-li">${ic(icon)}</span><div><b>${title}</b><span>${sub}</span></div><em>${tag || TAG[k]}</em></div>`);
    host.appendChild(n);
    if (anim) gsap.from(n, { x: 40, opacity: 0, duration: .45, ease: OUT });
    const over = host.offsetHeight - $(el, '.wp-log').clientHeight;
    gsap.to(host, { y: over > 0 ? -over : 0, duration: anim ? .45 : 0, ease: IO, overwrite: true });
    return n;
  }

  /* ---------- run one action ---------- */
  function run(el, a, anim) {
    const S = SC[el._si];
    switch (a[0]) {
      case 'st': setStage(el, a[1], anim); break;
      case 'in': addMsg(el, bubble('in', `<p>${a[1]}</p>`), anim); break;
      case 'voice': {
        const n = addMsg(el, node(`<div class="wa-m in"><div class="wa-b wa-voice"><span class="wa-vav">${ic('user')}<i>${W.mic}</i></span><span class="wa-play">${W.play}</span><span class="wa-wave">${bars(26, 7)}<b class="wa-dot"></b></span><span class="wa-vd">${a[1]}</span><span class="wa-t">${stamp()}${W.tick}</span></div></div>`), anim);
        if (anim) {
          const ws = n.querySelectorAll('.wa-wave i');
          keep(el, gsap.to(n.querySelector('.wa-dot'), { x: 174, duration: 2.3, ease: 'none', delay: .3 }));
          keep(el, gsap.to(ws, { backgroundColor: 'var(--wa-acc)', duration: .01, stagger: 2.3 / ws.length, delay: .3 }));
          const hw = $$(el, '.wp-hw i');
          gsap.set($(el, '.wp-hw'), { display: 'flex' });
          keep(el, gsap.to(hw, { scaleY: () => .3 + Math.random() * 1.3, duration: .18, stagger: { each: .03, repeat: 13, yoyo: true }, ease: 'sine.inOut' }));
        } else n.querySelectorAll('.wa-wave i').forEach(i => { i.style.backgroundColor = 'var(--wa-acc)'; });
        $(el, '.wp-hi').innerHTML = ic('mic');
        break;
      }
      case 'heard': {
        const p = $(el, '.wp-heard p');
        $(el, '.wp-hi').innerHTML = ic(S.heardIc);
        if (anim) { gsap.set($(el, '.wp-hw'), { display: 'none' }); typeInto(el, p, `「${a[1]}」`, 15); gsap.fromTo($(el, '.wp-heard'), { backgroundColor: 'rgba(0,136,191,.2)' }, { backgroundColor: 'rgba(0,0,0,0)', duration: 1.4, clearProps: 'backgroundColor' }); }
        else { gsap.set($(el, '.wp-hw'), { display: 'none' }); p.textContent = `「${a[1]}」`; }
        break;
      }
      case 'intent': {
        const b = $(el, '.wp-intent b'); b.textContent = S.intent;
        if (anim) gsap.fromTo($(el, '.wp-intent'), { scale: .85 }, { scale: 1, duration: .5, ease: BACK });
        $(el, '.wp-intent').classList.add('on');
        break;
      }
      case 'f': fillField(el, a[1], a[2], a[3], a[4], anim); break;
      case 'log': addLog(el, a[1], a[2], a[3], a[4], a[5], anim); break;
      case 'out': withTyping(el, anim, 1.0, () => addMsg(el, bubble('out', `<p>${a[1]}</p>`, a[2] ? btns(a[2]) : ''), anim)); break;
      case 'tap': {
        const all = $$(el, '.wa-btns'), host = all[all.length - 1]; if (!host) break;
        const b = host.querySelectorAll('button')[a[1]];
        const echo = () => { b.classList.add('on'); addMsg(el, bubble('in', `<p>${b.textContent}</p>`), anim); };
        if (!anim) { echo(); break; }
        const chat = $(el, '.wa-chat'), cr = chat.getBoundingClientRect(), br = b.getBoundingClientRect(), k = cr.width / chat.offsetWidth;
        const tap = $(el, '.wa-tap');
        gsap.set(tap, { left: (br.left + br.width / 2 - cr.left) / k, top: (br.top + br.height / 2 - cr.top) / k });
        keep(el, gsap.fromTo(tap, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: OUT }));
        keep(el, gsap.to(tap, { scale: 2.2, opacity: 0, duration: .45, delay: .45 }));
        later(el, .35, () => b.classList.add('on'));
        later(el, .65, echo);
        break;
      }
      case 'loc': addMsg(el, node(`<div class="wa-m in"><div class="wa-b wa-loc"><div class="wa-map">${MAP}</div><b>${ic('pin')}${a[1]}</b><span>${a[2]} · 位置</span><span class="wa-t">${stamp()}${W.tick}</span></div></div>`), anim); break;
      case 'photo': addMsg(el, node(`<div class="wa-m in"><div class="wa-b wa-photo">${CHAIR}<span class="wa-t">${stamp()}${W.tick}</span></div></div>`), anim); break;
      case 'card': withTyping(el, anim, .9, () => addMsg(el, node(`<div class="wa-m out"><div class="wa-b wa-card">
          <div class="wa-ch">${ic('doc')}訂單摘要</div>
          <div class="wa-r">${ic('van')}<span>客貨車 · 即時</span></div>
          <div class="wa-r">${ic('pin')}<span>觀塘鴻圖道 → 中環皇后大道中</span></div>
          <div class="wa-r">${ic('box')}<span>幾箱 · 6呎或以下 · 唔使跟車</span></div>
          <div class="wa-r pr">${ic('coins')}<span>車費</span><b>$158</b></div>
          <span class="wa-t">${stamp()}</span></div>${btns(['確認落單', '修改'])}</div>`), anim)); break;
      case 'drv': withTyping(el, anim, .9, () => addMsg(el, node(`<div class="wa-m out"><div class="wa-b wa-drv"><p>${a[1]}</p>
          <div class="wa-dc"><span class="wa-dav">${ic('user')}</span><div><b>${a[2]} <i>★ 4.9</i></b><span>客貨車 · ${a[3]}</span></div><em>${a[4]}<small>分鐘到</small></em></div>
          <span class="wa-t">${stamp()}</span></div><div class="wa-btns link"><button>${ic('pin')}追蹤司機</button></div></div>`), anim)); break;
      case 'sys': addMsg(el, node(`<div class="wa-sys">${a[1]}</div>`), anim); break;
      case 'inbox': {
        const host = $(el, '.wp-log-in');
        const n = node(`<div class="wp-l wp-inbox"><div class="wp-ih">${ic('headset')}<b>Chatwoot</b><span>Customer service inbox</span><em>New</em></div>
          <div class="wp-ir"><span class="wp-iav">${ic('user')}</span><div><b>投訴 · #GX-8712</b><span>Full chat · order · 1 photo</span></div><i>好嬲</i></div></div>`);
        host.appendChild(n);
        if (anim) gsap.from(n, { y: 30, scale: .9, opacity: 0, duration: .55, ease: BACK });
        const over = host.offsetHeight - $(el, '.wp-log').clientHeight;
        gsap.to(host, { y: over > 0 ? -over : 0, duration: anim ? .45 : 0, ease: IO, overwrite: true });
        break;
      }
      case 'agent': withTyping(el, anim, 1.2, () => addMsg(el, bubble('out agent', `<span class="wa-an">${ic('headset')}客服同事 · 真人</span><p>${a[1]}</p>`), anim)); break;
      default: break;
    }
  }

  /* ---------- scenario lifecycle ---------- */
  function waStop(el) {
    if (el._run) { el._run.kill(); el._run = null; }
    (el._tw || []).forEach(t => t.kill());
    el._tw = [];
  }
  function waSetup(el, si) {
    const S = SC[si];
    el._si = si; clock = 0;
    const tabs = $$(el, '.wa-tabs button'), tb = tabs[si];
    gsap.to($(el, '.wa-knob'), { x: tb.offsetLeft - 5, width: tb.offsetWidth, duration: .45, ease: IO });
    tabs.forEach((b, i) => b.classList.toggle('on', i === si));
    const feed = $(el, '.wa-feed');
    feed.innerHTML = '<div class="wa-date">今日</div><div class="wa-sec">🔒 此商業帳戶由 GoGoX 管理，訊息會用 AI 處理。</div>';
    gsap.set(feed, { y: 0 });
    gsap.set($(el, '.wa-tap'), { opacity: 0 });
    // stage stepper
    const st = $(el, '.wp-stages');
    $$(st, '.wp-s').forEach(b => b.remove());
    S.stages.forEach(([en, zh, k], i) => st.insertAdjacentHTML('beforeend', `<button class="wp-s k-${k}" data-ui data-k="${i}"><span class="wp-sd">${i + 1}</span><b>${en}</b><i>${zh}</i></button>`));
    const half = 1120 / S.stages.length / 2;
    gsap.set($(el, '.wp-rail'), { left: half, right: half });
    gsap.set($(el, '.wp-rail i'), { scaleX: 0 });
    // fields
    $(el, '.wp-fields').innerHTML = S.fields.map(([en, zh]) => `<div class="wp-f"><span class="wp-fl">${en}<i>${zh}</i></span><span class="wp-fv">—</span><span class="wp-src"></span></div>`).join('');
    $(el, '.wp-heard p').textContent = '';
    $(el, '.wp-hi').innerHTML = ic(S.heardIc);
    gsap.set($(el, '.wp-hw'), { display: 'none' });
    $(el, '.wp-intent b').textContent = '—';
    $(el, '.wp-intent').classList.remove('on');
    const log = $(el, '.wp-log-in'); log.innerHTML = ''; gsap.set(log, { y: 0 });
  }
  function waRun(el, si, fromStage = 0, delay = 0) {
    waStop(el);
    waSetup(el, si);
    const S = SC[si];
    const marks = []; S.script.forEach((a, i) => { if (a[0] === 'st') marks[a[1]] = i; });
    const start = fromStage ? marks[fromStage] : 0;
    for (let i = 0; i < start; i++) run(el, S.script[i], false);
    const t = gsap.timeline({ delay, onComplete: () => { if (el._live) waRun(el, (si + 1) % SC.length); } });
    for (let i = start; i < S.script.length; i++) {
      const a = S.script[i];
      t.call(() => run(el, a, true));
      t.to({}, { duration: DUR[a[0]](a) });
    }
    el._run = t;
  }

  FX.waChat = (el, tl, A) => {
    el._live = false; el._tw = el._tw || [];
    waStop(el); waSetup(el, 0);
    tl.from($(el, '.wa-phone'), { y: 60, opacity: 0, rotation: -3, duration: .9, ease: OUT }, .3);
    rise(tl, $(el, '.wp-top'), .5, { y: -14 });
    rise(tl, $$(el, '.wp-s'), .65, { y: 16, stagger: .06 });
    rise(tl, $$(el, '.wp-card'), .8, { y: 40, stagger: .12 });
    rise(tl, $$(el, '.wp-rules > *'), 1.1, { y: 14, stagger: .07 });
    tl.from($(el, '.wa-try'), { y: -20, opacity: 0, scale: .9, duration: .6, ease: BACK }, .9);
    A.loop(() => gsap.fromTo($(el, '.wt-qr'), { boxShadow: '0 0 0 0 rgba(37,211,102,.55)' }, { boxShadow: '0 0 0 14px rgba(37,211,102,0)', duration: 1.6, repeat: -1, ease: 'power1.out' }), 0);
    A.onLeave(() => { el._live = false; waStop(el); });
    A.loop(() => { el._live = true; waRun(el, 0, 0, 1.1); return () => { el._live = false; waStop(el); }; }, 0);
  };
  FX.waChat.init = el => {
    el._tw = [];
    $(el, '.wa-bk').innerHTML = W.back;
    $(el, '.wa-ver').innerHTML = W.ver;
    $(el, '.wa-hi').innerHTML = W.video + W.call;
    $(el, '.wa-plus').innerHTML = W.plus;
    $(el, '.wa-cam').innerHTML = W.cam;
    $(el, '.wa-mic').innerHTML = W.mic;
    $(el, '.wp-hw').innerHTML = '<i></i>'.repeat(14);
    el.addEventListener('click', e => {
      if (!el._live) return;
      const b = e.target.closest('.wa-tabs button'); if (b) { waRun(el, +b.dataset.s); return; }
      const s = e.target.closest('.wp-s'); if (s) waRun(el, el._si, +s.dataset.k);
    });
  };

  /* =====================================================================
     Flow map
     ===================================================================== */
  const R = [404, 504, 604];
  const NODES = [
    { id: 'in0', k: 'in', x: 120, y: 360, w: 210, h: 56, ic: 'chat', t: 'Text', z: '文字' },
    { id: 'in1', k: 'in', x: 120, y: 428, w: 210, h: 56, ic: 'mic', t: 'Voice note', z: '語音' },
    { id: 'in2', k: 'in', x: 120, y: 496, w: 210, h: 56, ic: 'pin', t: 'Location', z: '位置' },
    { id: 'in3', k: 'in', x: 120, y: 564, w: 210, h: 56, ic: 'eye', t: 'Photo', z: '相片' },
    { id: 'ai', k: 'ai', x: 400, y: 362, w: 260, h: 284, big: true, ic: 'spark', t: 'AI understands', z: '理解', chips: ['What they want', 'The details', 'Voice → text'] },
    { id: 'f0', k: 'fx', x: 740, y: R[0] - 32, w: 230, h: 64, ic: 'van', t: 'Book a van', z: '叫車' },
    { id: 'f1', k: 'fx', x: 740, y: R[1] - 32, w: 230, h: 64, ic: 'clock', t: 'Status · rush', z: '查單 · 加急' },
    { id: 'f2', k: 'fx', x: 740, y: R[2] - 32, w: 230, h: 64, ic: 'x', t: 'Cancel · change', z: '取消 · 改單' },
    { id: 's0', k: 'sy', x: 1040, y: R[0] - 32, w: 230, h: 64, ic: 'coins', t: 'GetQuote', z: '報價' },
    { id: 's1', k: 'sy', x: 1040, y: R[1] - 32, w: 230, h: 64, ic: 'search', t: 'Find the order', z: '搵單' },
    { id: 's2', k: 'sy', x: 1040, y: R[2] - 32, w: 230, h: 64, ic: 'search', t: 'Find the order', z: '搵單' },
    { id: 'c0', k: 'hu', x: 1330, y: R[0] - 32, w: 220, h: 64, ic: 'person-check', t: 'Taps confirm', z: '確認落單' },
    { id: 'c1', k: 'hu', x: 1330, y: R[1] - 32, w: 220, h: 64, ic: 'coins', t: 'Adds rush fee', z: '加急費' },
    { id: 'c2', k: 'hu', x: 1330, y: R[2] - 32, w: 220, h: 64, ic: 'person-check', t: 'Taps confirm', z: '確認取消' },
    { id: 'r0', k: 'sy', x: 1600, y: R[0] - 32, w: 200, h: 64, ic: 'van', t: 'Order placed', z: '落單 · 配對' },
    { id: 'r1', k: 'sy', x: 1600, y: R[1] - 32, w: 200, h: 64, ic: 'van', t: 'Driver found', z: '有司機' },
    { id: 'r2', k: 'sy', x: 1600, y: R[2] - 32, w: 200, h: 64, ic: 'check', t: 'Cancelled', z: '已取消' },
    { id: 'hp', k: 'hu', x: 740, y: 690, w: 530, h: 124, big: true, ic: 'headset', t: 'A person · Chatwoot', z: '轉人工', chips: ['Complaints', 'Refunds', 'Bot unsure'] },
    { id: 'qr', k: 'ai', x: 1330, y: 690, w: 470, h: 124, big: true, ic: 'chart', t: 'Daily quality report', z: '每日評分', chips: ['Order placed', 'To a person', 'Silent drop', 'Abandoned'] },
  ];
  const CAPS = [['Message', 120, 210], ['AI decides', 400, 260], ['Fixed flow', 740, 230], ['Our systems', 1040, 230], ['Customer', 1330, 220], ['Result', 1600, 200]];
  const POP = {
    in0: ['Customer', 'Customers write the way they talk, in Cantonese, English or both.', '「點解仲未有司機㗎？」'],
    in1: ['Customer', 'Many customers just send a voice note. The AI turns it into text first.', '「而家要架客貨車，觀塘去中環」'],
    in2: ['Customer', 'A location pin is the fastest way to give a pickup point.', '📍 觀塘 鴻圖道'],
    in3: ['Customer', 'Photos come with problems: damage, the wrong address, the cargo.', '📷 櫈腳斷咗'],
    ai: ['AI decides', 'Works out what the customer wants and pulls out the details. That is all it decides.', '叫車 · 觀塘 → 中環 · 客貨車'],
    f0: ['Fixed by us', 'Designed steps: ask for anything missing, quote, show the summary, then place the order.', '必問：貨物長度 · 地址 · 跟車'],
    f1: ['Fixed by us', 'Finds the order. If there is no driver yet, a fixed rule offers the rush fee.', '「加$20加急費？」'],
    f2: ['Fixed by us', 'Finds the order, explains the rule, asks the customer to confirm.', '「確認取消？」'],
    s0: ['Our systems', 'Every price comes from our pricing system. The AI never makes up a number.', 'GetQuote → $158'],
    s1: ['Our systems', 'Finds the order from the customer’s WhatsApp number.', '#GX-8790 · 配對中'],
    s2: ['Our systems', 'Finds the order from the customer’s WhatsApp number.', '#GX-8790'],
    c0: ['Customer decides', 'Nothing is placed until the customer taps confirm on the full summary.', '[ 確認落單 ]'],
    c1: ['Customer decides', 'The customer chooses to pay the rush fee, or keeps waiting.', '[ 加$20加急 ]'],
    c2: ['Customer decides', 'The customer confirms the cancel.', '[ 確認取消 ]'],
    r0: ['Our systems', 'SubmitOrder places the order, matching finds a driver, then a tracking link.', '#GX-8841 · 15s'],
    r1: ['Our systems', 'The order goes back out to nearby drivers with the rush fee.', '司機已接單 ✅'],
    r2: ['Our systems', 'The order is cancelled and the customer gets a confirmation.', '已取消'],
    hp: ['A person decides', 'Complaints, refunds, compensation, or the bot is unsure: the chat goes to our CS team in Chatwoot with the history and order. The bot stops.', '投訴 · #GX-8712 · 📷'],
    qr: ['Every chat', 'Every conversation is scored: outcome, where it dropped off, why, and sentiment. The weak spots become the next fixes.', '→ the fix loop, next'],
  };
  const ROUTES = [
    { path: ['in1', 'e-in1', 'ai', 'e-af0', 'f0', 'e-fs0', 's0', 'e-sc0', 'c0', 'e-cr0', 'r0'], out: 0, msg: ['mic', '而家要架客貨車，觀塘去中環，有幾箱嘢。'], read: '叫車 · 觀塘 → 中環' },
    { path: ['in0', 'e-in0', 'ai', 'e-af1', 'f1', 'e-fs1', 's1', 'e-sc1', 'c1', 'e-cr1', 'r1'], out: 0, msg: ['chat', '點解仲未有司機㗎？'], read: '查單 · 搵司機' },
    { path: ['in3', 'e-in3', 'ai', 'e-ahp', 'hp', 'e-hq', 'qr'], out: 1, msg: ['eye', '司機遲咗40分鐘，仲整爛咗我張櫈！'], read: '投訴 · 損壞 · 好嬲' },
  ];
  function edgesD() {
    const E = {};
    for (let k = 0; k < 4; k++) { const y = 388 + k * 68, y2 = 452 + k * 34; E['e-in' + k] = `M330 ${y} C366 ${y} 364 ${y2} 400 ${y2}`; }
    for (let k = 0; k < 3; k++) {
      const y1 = 468 + k * 36, y = R[k];
      E['e-af' + k] = `M660 ${y1} C702 ${y1} 698 ${y} 740 ${y}`;
      E['e-fs' + k] = `M970 ${y} H1040`; E['e-sc' + k] = `M1270 ${y} H1330`; E['e-cr' + k] = `M1550 ${y} H1600`;
    }
    E['e-ahp'] = 'M530 646 V722 Q530 752 560 752 H740';
    E['e-hq'] = 'M1270 752 H1330';
    E['e-rq'] = 'M1700 636 V690';
    return E;
  }
  const kindOf = id => (NODES.find(n => n.id === id) || {}).k;

  function wfLight(el, ids, on) { ids.forEach(id => { const n = el.querySelector(`[data-id="${id}"]`); if (n) n.classList.toggle('lit', on); }); }
  function wfClear(el) {
    $$(el, '.wf-node.lit, .wf-e.lit').forEach(n => n.classList.remove('lit'));
    $$(el, '.wf-chip.hit').forEach(c => c.classList.remove('hit'));
  }
  function wfStop(el) {
    if (el._run) { el._run.kill(); el._run = null; }
    (el._tw || []).forEach(t => t.kill()); el._tw = [];
  }
  function wfRun(el, si, delay = 0) {
    wfStop(el); wfClear(el);
    el._si = si;
    const Rt = ROUTES[si], tok = $(el, '.wf-tok');
    const tabs = $$(el, '.wf-tabs button'), tb = tabs[si];
    gsap.to($(el, '.wf-knob'), { x: tb.offsetLeft - 5, width: tb.offsetWidth, duration: .45, ease: IO });
    tabs.forEach((b, i) => b.classList.toggle('on', i === si));
    const msg = $(el, '.wf-msg'), read = $(el, '.wf-read');
    const t = gsap.timeline({ delay, onComplete: () => { if (el._live) wfRun(el, (si + 1) % ROUTES.length, .2); } });
    t.call(() => {
      $(el, '.wf-mi').innerHTML = ic(Rt.msg[0]);
      read.textContent = '';
      gsap.fromTo(msg, { opacity: 0, y: 16, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: BACK });
      typeInto(el, msg.querySelector('p'), `「${Rt.msg[1]}」`, 22);
    });
    t.to({}, { duration: 1.4 });
    Rt.path.forEach(id => {
      if (id.startsWith('e-')) {
        const p = el.querySelector(`.wf-e[data-id="${id}"]`);
        t.call(() => p.classList.add('lit'));
        t.fromTo(tok, { opacity: 1 }, { opacity: 1, duration: Math.max(.35, p.getTotalLength() / 520), ease: 'power1.inOut', immediateRender: false,
          motionPath: { path: p, align: p, alignOrigin: [.5, .5] } });
      } else {
        t.call(() => {
          wfLight(el, [id], true);
          const n = el.querySelector(`[data-id="${id}"]`);
          gsap.fromTo(n, { scale: 1 }, { scale: 1.07, duration: .18, yoyo: true, repeat: 1, ease: 'sine.inOut' });
          if (id === 'ai') { typeInto(el, read, Rt.read, 26); }
          if (id === 'qr' || id === 'hp') { const c = $$(el, `[data-id="qr"] .wf-chip`)[Rt.out]; if (id === 'qr') c.classList.add('hit'); }
        });
        t.to({}, { duration: id === 'ai' ? 1.1 : .45 });
      }
    });
    if (Rt.out === 0) {
      // the finished chat is scored too: a chip flies from the result to the report
      t.call(() => {
        const last = Rt.path[Rt.path.length - 1], from = NODES.find(n => n.id === last);
        const sx = from.x + from.w / 2, sy = from.y + from.h, ex = 1565, ey = 700;
        const f = $(el, '.wf-fly');
        gsap.set(f, { x: sx, y: sy, opacity: 1, scale: .4 });
        keep(el, gsap.to(f, { duration: 1, ease: 'power2.inOut', scale: 1, motionPath: { path: [{ x: sx, y: sy }, { x: sx + 40, y: sy + 120 }, { x: ex, y: ey }], curviness: 1.2 } }));
        keep(el, gsap.to(f, { opacity: 0, duration: .25, delay: 1 }));
        later(el, .9, () => { wfLight(el, ['qr'], true); $$(el, '[data-id="qr"] .wf-chip')[0].classList.add('hit'); });
      });
      t.to(tok, { opacity: 0, duration: .3 });
      t.to({}, { duration: 1.6 });
    } else {
      t.to(tok, { opacity: 0, duration: .3 });
      t.to({}, { duration: 1.4 });
    }
    t.to(msg, { opacity: 0, duration: .3 });
    el._run = t;
  }
  function wfPop(el, id) {
    const pop = $(el, '.wf-pop'), N = NODES.find(n => n.id === id), P = POP[id];
    if (!N || !P) return;
    if (el._pop === id) { wfPopClose(el); return; }
    el._pop = id;
    $$(el, '.wf-node.sel').forEach(n => n.classList.remove('sel'));
    el.querySelector(`[data-id="${id}"]`).classList.add('sel');
    pop.className = `abs wf-pop k-${N.k}`;
    pop.querySelector('.wf-pi').innerHTML = ic(N.ic);
    pop.querySelector('b').textContent = `${N.t} · ${N.z}`;
    pop.querySelector('.wf-who').textContent = P[0];
    pop.querySelector('p').textContent = P[1];
    pop.querySelector('em').textContent = P[2];
    const w = 420, below = N.y + N.h + 300 < 990;
    let left = N.x + N.w / 2 - w / 2; left = Math.max(120, Math.min(1800 - w, left));
    gsap.set(pop, { left, top: below ? N.y + N.h + 16 : null, bottom: below ? null : 1080 - N.y + 16, display: 'block' });
    gsap.fromTo(pop, { opacity: 0, y: below ? -10 : 10, scale: .95 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: OUT });
  }
  function wfPopClose(el) {
    el._pop = null;
    $$(el, '.wf-node.sel').forEach(n => n.classList.remove('sel'));
    gsap.to($(el, '.wf-pop'), { opacity: 0, duration: .2, onComplete: () => gsap.set($(el, '.wf-pop'), { display: 'none' }) });
  }
  function wfSpot(el, k) {
    el._spot = el._spot === k ? null : k;
    $$(el, '.wf-leg button').forEach(b => b.classList.toggle('on', b.dataset.k === el._spot));
    $$(el, '.wf-node').forEach(n => n.classList.toggle('dim', !!el._spot && n.dataset.k !== el._spot && !(el._spot === 'hu' && n.dataset.k === 'hu')));
    $$(el, '.wf-e').forEach(e => e.classList.toggle('dim', !!el._spot));
  }

  FX.waFlow = (el, tl, A) => {
    el._live = false; el._tw = el._tw || [];
    wfStop(el); wfClear(el);
    el._spot = 'x'; wfSpot(el, 'x');
    gsap.set($(el, '.wf-pop'), { display: 'none', opacity: 0 }); el._pop = null;
    gsap.set($(el, '.wf-tok'), { opacity: 0 });
    gsap.set($(el, '.wf-msg'), { opacity: 0 });
    $(el, '.wf-read').textContent = '';
    gsap.set($(el, '.wf-knob'), { x: 0, width: $(el, '.wf-tabs button').offsetWidth });
    rise(tl, [$(el, '.wf-tabs'), $(el, '.wf-leg')], .3, { y: -12 });
    rise(tl, $$(el, '.wf-cap'), .4, { y: 10, stagger: .07 });
    const byX = x => $$(el, '.wf-node').filter(n => +n.dataset.x === x);
    [120, 400, 740, 1040, 1330, 1600].forEach((x, i) => pop(tl, byX(x).filter(n => n.dataset.id !== 'hp' && n.dataset.id !== 'qr'), .55 + i * .16, { stagger: .05, scale: .6 }));
    $$(el, '.wf-e').forEach(p => {
      const g = p.dataset.id, at = g.startsWith('e-in') ? .75 : g.startsWith('e-af') ? .9 : g.startsWith('e-fs') ? 1.05 : g.startsWith('e-sc') ? 1.2 : g.startsWith('e-cr') ? 1.35 : 1.6;
      tl.from(p, { drawSVG: '0%', duration: .5, ease: IO }, at);
      if (p._ah) tl.from(p._ah, { opacity: 0, duration: .2 }, at + .4);
    });
    pop(tl, [$(el, '[data-id="hp"]'), $(el, '[data-id="qr"]')], 1.6, { scale: .7, stagger: .15 });
    A.onLeave(() => { el._live = false; wfStop(el); });
    A.loop(() => { el._live = true; wfRun(el, 0, 2.2); return () => { el._live = false; wfStop(el); wfClear(el); }; }, 0);
  };
  FX.waFlow.init = el => {
    el._tw = [];
    const E = edgesD(), g = $(el, '.wf-edges');
    Object.entries(E).forEach(([id, d]) => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d); p.setAttribute('class', 'flow wf-e'); p.dataset.id = id;
      g.appendChild(p);
    });
    $(el, '.wf-caps').innerHTML = CAPS.map(([t, x, w]) => `<span class="wf-cap" style="left:${x}px;width:${w}px">${t}</span>`).join('');
    $(el, '.wf-nodes').innerHTML = NODES.map(n => `<div class="wf-node k-${n.k}${n.big ? ' big' : ''}" data-ui data-id="${n.id}" data-k="${n.k}" data-x="${n.x}" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px">
        <span class="wf-ic">${ic(n.ic)}</span><div class="wf-tx"><b>${n.t}</b><i>${n.z}</i>${n.chips ? `<div class="wf-chips">${n.chips.map(c => `<span class="wf-chip">${c}</span>`).join('')}</div>` : ''}${n.id === 'ai' ? '<div class="wf-read"></div>' : ''}</div></div>`).join('')
      + `<div class="wf-fly">${ic('chart')}</div>`;
    el.addEventListener('click', e => {
      const tb = e.target.closest('.wf-tabs button'); if (tb && el._live) { wfRun(el, +tb.dataset.s); return; }
      const lg = e.target.closest('.wf-leg button'); if (lg) { wfSpot(el, lg.dataset.k); return; }
      const n = e.target.closest('.wf-node'); if (n) { wfPop(el, n.dataset.id); return; }
      if (e.target.closest('.wf-pop')) { wfPopClose(el); return; }
    });
  };
})();
