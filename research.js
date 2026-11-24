/* =====================================================================
   Research slides: listen (live mock interview), notes → insights,
   judgment.
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

  // element box in stage coordinates, relative to `ref`
  const box = (e, ref) => {
    const s = document.getElementById('stage').getBoundingClientRect().width / 1920, r = e.getBoundingClientRect(), b = ref.getBoundingClientRect();
    const l = (r.left - b.left) / s, t = (r.top - b.top) / s, w = r.width / s, h = r.height / s;
    return { l, t, w, h, cx: l + w / 2, cy: t + h / 2 };
  };

  /* ------------------------------------------------ R1 listen: face-to-face interviews */
  // ---- illustrated people (flat SVG). Origin = between the feet. look: -1 left, 1 right
  function person(o) {
    const L = o.look || 0, dx = L * 7, sk = o.skin, top = o.top, bot = o.bottom || '#2E3F52', shoe = o.shoe || '#1F2A33', hair = o.hair || '#2A2320';
    const h = o.seated ? -128 : -158, sh = h - 128, hc = sh - 58, neckY = hc + 34;
    const legs = o.seated
      ? `<path d="M-38 ${h - 6} h76 v30 q0 12 -12 12 h-52 q-12 0 -12 -12z" fill="${bot}"/><path d="M-32 ${h + 30} L-29 -10 L-7 -10 L-6 ${h + 30}Z" fill="${bot}"/><path d="M6 ${h + 30} L7 -10 L29 -10 L32 ${h + 30}Z" fill="${bot}"/>`
      : `<path d="M-33 ${h} L-27 -10 L-5 -10 L-2 ${h}Z" fill="${bot}"/><path d="M2 ${h} L5 -10 L27 -10 L33 ${h}Z" fill="${bot}"/>`;
    const shoes = `<ellipse cx="-17" cy="-7" rx="21" ry="9" fill="${shoe}"/><ellipse cx="17" cy="-7" rx="21" ry="9" fill="${shoe}"/>`;
    const torso = `<path d="M-50 ${sh + 8} Q-60 ${sh + 70} -43 ${h + 6} L43 ${h + 6} Q60 ${sh + 70} 50 ${sh + 8} Q0 ${sh - 14} -50 ${sh + 8}Z" fill="${top}"/>`;
    const extra = {
      apron: `<path d="M-36 ${sh + 30} L36 ${sh + 30} L42 ${h + 46} L-42 ${h + 46}Z" fill="#3E9E6B"/><path d="M-30 ${sh + 30} L-22 ${sh + 4} M30 ${sh + 30} L22 ${sh + 4}" stroke="#3E9E6B" stroke-width="5"/><rect x="-16" y="${sh + 74}" width="32" height="22" rx="4" fill="#348A5B"/>`,
      jacket: `<path d="M0 ${sh - 2} V ${h + 6}" stroke="rgba(0,0,0,.18)" stroke-width="3"/><use href="#g-x" x="14" y="${sh + 30}" width="20" height="19"/><path d="M-16 ${sh - 4} L0 ${sh + 14} L16 ${sh - 4}" fill="#FFDD00"/>`,
      lanyard: `<path d="M-18 ${sh - 2} L0 ${sh + 58} L18 ${sh - 2}" stroke="#FFDD00" stroke-width="4" fill="none"/><rect x="-11" y="${sh + 54}" width="22" height="28" rx="4" fill="#fff"/><rect x="-7" y="${sh + 60}" width="14" height="4" rx="2" fill="#0088BF"/>`,
      collar: `<path d="M-18 ${sh - 4} L0 ${sh + 12} L18 ${sh - 4} L10 ${sh - 8} L0 ${sh + 2} L-10 ${sh - 8}Z" fill="#fff"/>`,
      cardigan: `<path d="M-14 ${sh - 2} L-4 ${h + 6} M14 ${sh - 2} L4 ${h + 6}" stroke="rgba(255,255,255,.7)" stroke-width="4"/><path d="M-10 ${sh - 4} Q0 ${sh + 20} 10 ${sh - 4}" fill="#fff"/>`,
    }[o.extra] || '';
    const items = {
      phone: (ex, ey) => `<rect x="${ex - 14}" y="${ey - 42}" width="28" height="48" rx="6" fill="#1F2A33"/><rect x="${ex - 10}" y="${ey - 37}" width="20" height="36" rx="3" fill="#8FD0EC"/><rect x="${ex - 7}" y="${ey - 33}" width="14" height="4" rx="2" fill="#fff"/>`,
      tablet: (ex, ey) => `<rect x="${ex - 12}" y="${ey - 56}" width="48" height="62" rx="7" fill="#1F2A33"/><rect x="${ex - 8}" y="${ey - 52}" width="40" height="54" rx="3" fill="#E4F2F9"/><rect x="${ex - 4}" y="${ey - 47}" width="32" height="6" rx="3" fill="#0088BF"/><rect x="${ex - 4}" y="${ey - 37}" width="32" height="10" rx="3" fill="#fff"/><rect x="${ex - 4}" y="${ey - 24}" width="32" height="10" rx="3" fill="#FFDD00"/>`,
      notebook: (ex, ey) => `<rect class="pp-nb" x="${ex - 4}" y="${ey - 48}" width="52" height="62" rx="4" fill="#FFF8DC" stroke="#E2CF8E" stroke-width="2"/><path d="M${ex + 4} ${ey - 34} h36 M${ex + 4} ${ey - 24} h36 M${ex + 4} ${ey - 14} h26" stroke="#C9B77A" stroke-width="2"/>`,
      pen: (ex, ey) => `<path d="M${ex - 2} ${ey - 4} l-18 -24" stroke="#1F2A33" stroke-width="5" stroke-linecap="round"/>`,
    };
    const arm = (side, pose, item) => {
      const sx = side * 48, sy = sh + 12;
      const pts = pose === 'hold' ? [[sx, sy], [side * 64, sy + 80], [side * 20, sy + 62]]
        : pose === 'lap' ? [[sx, sy], [side * 60, sy + 74], [side * 30, h - 4]]
          : [[sx, sy], [side * 60, sy + 70], [side * 58, h + 18]];
      const [ex, ey] = pts[2];
      return `<g class="pp-arm" data-side="${side}" transform="rotate(0 ${sx} ${sy})"><path d="M${pts.map(p => p.join(' ')).join(' L')}" fill="none" stroke="${top}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${ex}" cy="${ey}" r="12" fill="${sk}"/>${item ? items[item](ex, ey) : ''}</g>`;
    };
    const hairShapes = {
      short: [``, `<path d="M-41 ${hc + 2} Q-45 ${hc - 52} 2 ${hc - 50} Q45 ${hc - 48} 41 ${hc + 2} Q36 ${hc - 24} 10 ${hc - 28} Q-20 ${hc - 30} -41 ${hc + 2}Z" fill="${hair}"/>`],
      bob: [`<path d="M-48 ${hc + 26} Q-54 ${hc - 56} 0 ${hc - 54} Q54 ${hc - 56} 48 ${hc + 26} Q30 ${hc + 34} 0 ${hc + 30} Q-30 ${hc + 34} -48 ${hc + 26}Z" fill="${hair}"/>`,
        `<path d="M-42 ${hc - 4} Q-40 ${hc - 48} 0 ${hc - 48} Q40 ${hc - 48} 42 ${hc - 4} Q28 ${hc - 30} ${L * 10} ${hc - 30} Q-24 ${hc - 30} -42 ${hc - 4}Z" fill="${hair}"/>`],
      pony: [`<path d="M${-L * 34} ${hc - 30} q${-L * 48} 8 ${-L * 40} 80 q${L * 16} -26 ${L * 22} -60z" fill="${hair}"/>`,
        `<path d="M-42 ${hc + 4} Q-44 ${hc - 50} 0 ${hc - 50} Q44 ${hc - 50} 42 ${hc + 4} Q34 ${hc - 22} 0 ${hc - 30} Q-34 ${hc - 22} -42 ${hc + 4}Z" fill="${hair}"/>`],
      bun: [`<circle cx="0" cy="${hc - 48}" r="18" fill="${hair}"/>`, `<path d="M-41 ${hc + 4} Q-44 ${hc - 50} 0 ${hc - 49} Q44 ${hc - 50} 41 ${hc + 4} Q32 ${hc - 26} 0 ${hc - 30} Q-32 ${hc - 26} -41 ${hc + 4}Z" fill="${hair}"/>`],
    }[o.hairStyle || 'short'];
    const cap = o.cap ? `<path d="M-44 ${hc - 6} Q-46 ${hc - 56} 0 ${hc - 56} Q46 ${hc - 56} 44 ${hc - 6} Q0 ${hc - 16} -44 ${hc - 6}Z" fill="${o.cap}"/><path d="M${L * 18} ${hc - 14} Q${L * 62} ${hc - 16} ${L * 66} ${hc - 6} Q${L * 40} ${hc - 1} ${L * 12} ${hc - 6}Z" fill="#0B4F78"/><use href="#g-x" x="-10" y="${hc - 46}" width="20" height="19"/>` : '';
    const glasses = o.glasses ? `<g stroke="#1F2A33" stroke-width="3" fill="none"><circle cx="${-14 + dx}" cy="${hc - 2}" r="10"/><circle cx="${14 + dx}" cy="${hc - 2}" r="10"/><path d="M${-4 + dx} ${hc - 2} h8"/></g>` : '';
    const head = `${hairShapes[0]}<circle cx="-40" cy="${hc + 2}" r="9" fill="${sk}"/><circle cx="40" cy="${hc + 2}" r="9" fill="${sk}"/><circle cx="0" cy="${hc}" r="40" fill="${sk}"/>
      <ellipse class="pp-eye" cx="${-14 + dx}" cy="${hc - 2}" rx="4.6" ry="4.6" fill="#1F2A33"/><ellipse class="pp-eye" cx="${14 + dx}" cy="${hc - 2}" rx="4.6" ry="4.6" fill="#1F2A33"/>
      <path d="M${-21 + dx} ${hc - 14} q7 -4 13 0 M${8 + dx} ${hc - 14} q7 -4 13 0" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M${dx * 1.6} ${hc + 2} q${L * 5 || 3} 6 0 9" stroke="rgba(0,0,0,.25)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="${-22 + dx}" cy="${hc + 12}" r="6.5" fill="#F29C8F" opacity=".45"/><circle cx="${22 + dx}" cy="${hc + 12}" r="6.5" fill="#F29C8F" opacity=".45"/>
      <ellipse class="pp-mouth" cx="${dx}" cy="${hc + 20}" rx="9" ry="3.2" fill="#8E3B3B"/>${hairShapes[1]}${glasses}${cap}`;
    return `<g class="pp ${o.cls || ''}" transform="translate(${o.x} ${o.y})" data-x="${o.x}" data-y="${o.y}">
      <ellipse cx="0" cy="-3" rx="64" ry="10" fill="rgba(0,18,26,.13)"/>${legs}${shoes}
      <g class="pp-up" transform="translate(0 ${h}) scale(1 1) translate(0 ${-h})">${torso}${extra}
        <rect x="-11" y="${hc + 30}" width="22" height="${sh - hc - 22}" rx="8" fill="${sk}"/>
        <g class="pp-head" transform="rotate(0 0 ${neckY})">${head}</g>
        ${arm(-1, o.armL || 'down', o.itemL)}${arm(1, o.armR || 'down', o.itemR)}
      </g></g>`;
  }
  // ---- scenes
  const SCENE_HOME = `<rect width="1220" height="700" fill="#FBEFE2"/><rect y="540" width="1220" height="160" fill="#EAD5BC"/><rect y="532" width="1220" height="10" fill="#F5E2CC"/>
    <rect x="600" y="92" width="232" height="172" rx="10" fill="#CDEAF7" stroke="#fff" stroke-width="12"/><path d="M716 92 V264 M600 178 H832" stroke="#fff" stroke-width="8"/>
    <ellipse cx="660" cy="140" rx="30" ry="12" fill="#fff"/><ellipse cx="770" cy="210" rx="26" ry="10" fill="#fff"/>
    <path d="M582 84 h40 v200 q-30 -10 -40 0z M810 84 h40 v200 q-10 -10 -40 0z" fill="#F1B79D"/>
    <rect x="980" y="110" width="128" height="94" rx="6" fill="#fff"/><path d="M992 192 l34 -40 22 24 16 -16 32 32z" fill="#9ED0B4"/><circle cx="1074" cy="138" r="10" fill="#FFDD00"/>
    <rect x="1140" y="468" width="58" height="72" rx="8" fill="#D9805A"/><ellipse cx="1150" cy="440" rx="14" ry="40" fill="#5DAE7E" transform="rotate(-24 1150 440)"/><ellipse cx="1186" cy="436" rx="14" ry="42" fill="#4E9D70" transform="rotate(20 1186 436)"/><ellipse cx="1168" cy="420" rx="13" ry="46" fill="#67BA88"/>
    <rect x="520" y="470" width="120" height="84" rx="6" fill="#D9A86C"/><path d="M520 496 h120 M580 470 v84" stroke="#C08A4E" stroke-width="5"/><rect x="536" y="418" width="88" height="56" rx="6" fill="#E3B57D" transform="rotate(-4 580 446)"/><text x="548" y="452" font-size="18" font-weight="700" fill="#C0392B" transform="rotate(-4 580 446)" font-family="PingFang HK,sans-serif">易碎</text>
    <rect x="726" y="372" width="400" height="140" rx="36" fill="#7D9DCB"/><rect x="694" y="420" width="58" height="130" rx="24" fill="#5F80B3"/><rect x="1098" y="420" width="58" height="130" rx="24" fill="#5F80B3"/>`;
  const SCENE_HOME_FG = `<rect x="704" y="478" width="444" height="72" rx="26" fill="#6A8CBE"/><rect x="720" y="548" width="16" height="20" rx="4" fill="#4A6690"/><rect x="1116" y="548" width="16" height="20" rx="4" fill="#4A6690"/>`;
  const SCENE_SHOP = `<rect width="1220" height="700" fill="#E5EDF2"/><rect y="560" width="1220" height="140" fill="#C9D3DA"/>
    <rect x="600" y="104" width="230" height="74" rx="12" fill="#fff"/><text x="715" y="152" font-size="30" font-weight="800" fill="#00121A" text-anchor="middle" font-family="PingFang HK,sans-serif">陳記貿易</text>
    <g stroke="#8FA2AE" stroke-width="6"><path d="M940 120 V520 M1190 120 V520 M940 220 H1190 M940 320 H1190 M940 420 H1190"/></g>
    <g fill="#D9A86C"><rect x="955" y="168" width="70" height="50"/><rect x="1035" y="180" width="56" height="38"/><rect x="1100" y="160" width="76" height="58"/><rect x="960" y="262" width="96" height="56"/><rect x="1066" y="276" width="60" height="42"/><rect x="1132" y="270" width="48" height="48"/><rect x="954" y="366" width="64" height="52"/><rect x="1028" y="356" width="88" height="62"/><rect x="1124" y="374" width="56" height="44"/></g>
    <g fill="#0088BF"><rect x="975" y="185" width="22" height="10" rx="2"/><rect x="1120" y="178" width="22" height="10" rx="2"/><rect x="990" y="280" width="22" height="10" rx="2"/><rect x="1050" y="372" width="22" height="10" rx="2"/></g>
    <rect x="510" y="500" width="110" height="80" rx="6" fill="#D9A86C"/><rect x="524" y="446" width="84" height="56" rx="6" fill="#E3B57D"/><path d="M510 526 h110 M565 500 v80" stroke="#C08A4E" stroke-width="5"/>`;
  const SCENE_SHOP_FG = `<rect x="690" y="482" width="420" height="160" fill="#C9966A"/><rect x="678" y="470" width="444" height="22" rx="6" fill="#A8774E"/><rect x="706" y="510" width="388" height="10" rx="5" fill="#B88458"/>
    <path d="M968 470 L1110 470 L1100 458 L978 458Z" fill="#9AA7B0"/><rect x="976" y="384" width="126" height="78" rx="6" fill="#1F2A33"/><rect x="982" y="390" width="114" height="66" rx="3" fill="#F3FAFD"/><rect x="982" y="390" width="114" height="12" fill="#0088BF"/><g fill="#C9D3DA"><rect x="988" y="408" width="100" height="6" rx="3"/><rect x="988" y="420" width="100" height="6" rx="3"/><rect x="988" y="432" width="100" height="6" rx="3"/><rect x="988" y="444" width="70" height="6" rx="3"/></g>`;
  const WIN = (x, y, w, h, c) => { let r = ''; for (let yy = y + 18; yy < y + h - 20; yy += 30) for (let xx = x + 14; xx < x + w - 18; xx += 26) r += `<rect x="${xx}" y="${yy}" width="14" height="18" rx="2" fill="${c}"/>`; return r; };
  const SCENE_STREET = `<rect width="1220" height="700" fill="#D3ECF8"/><circle cx="1110" cy="96" r="42" fill="#FFE68A"/>
    <rect x="0" y="150" width="190" height="330" fill="#A9C4D4"/>${WIN(0, 150, 190, 330, '#C6DAE5')}<rect x="200" y="90" width="150" height="390" fill="#93B1C4"/>${WIN(200, 90, 150, 390, '#B2CAD8')}
    <rect x="360" y="190" width="210" height="290" fill="#B9D0DD"/>${WIN(360, 190, 210, 290, '#D3E3EC')}<rect x="580" y="120" width="160" height="360" fill="#9DB9CB"/>${WIN(580, 120, 160, 360, '#BCD1DE')}
    <rect x="750" y="210" width="230" height="270" fill="#AFC8D7"/>${WIN(750, 210, 230, 270, '#CCDDE7')}<rect x="990" y="160" width="230" height="320" fill="#98B5C8"/>${WIN(990, 160, 230, 320, '#B8CEDB')}
    <rect y="470" width="1220" height="92" fill="#D2DADF"/><rect y="556" width="1220" height="10" fill="#B4BFC6"/><rect y="566" width="1220" height="134" fill="#5D6A73"/><path d="M0 650 H1220" stroke="#fff" stroke-width="6" stroke-dasharray="40 34"/>
    <g transform="translate(760 330)"><ellipse cx="220" cy="290" rx="230" ry="16" fill="rgba(0,0,0,.18)"/>
      <rect x="0" y="22" width="300" height="236" rx="18" fill="#0088BF"/><use href="#g-x" x="150" y="62" width="138" height="134"/><use class="ff-vanwm" href="#g-wordmark" x="18" y="36" width="126" height="22"/>
      <path d="M300 70 H384 Q404 70 414 90 L444 158 V258 H300Z" fill="#0A79AC"/><path d="M314 86 H378 Q390 86 396 98 L422 156 H314Z" fill="#CFEFFC"/><rect x="432" y="196" width="14" height="20" rx="3" fill="#FFDD00"/>
      <circle cx="72" cy="258" r="36" fill="#1F2A33"/><circle cx="72" cy="258" r="14" fill="#C9D3DA"/><circle cx="364" cy="258" r="36" fill="#1F2A33"/><circle cx="364" cy="258" r="14" fill="#C9D3DA"/></g>`;
  const SCN = [
    { pName: '客戶', tag: 'Consumer <i>客戶</i>', set: ['Home visit', '家訪'], x: 860, bubL: 610, ins: { l: 990, t: 246, w: 210, h: 288, img: 'img/scr-client-vehicles.jpg', label: '喺選車頁停咗 8 秒', from: [883, 398] }, g: 'c', name: 'Consumer',
      person: { x: 860, y: 600, seated: true, look: -1, skin: '#F3CDA9', hair: '#3B2A22', hairStyle: 'pony', top: '#8FD0EC', bottom: '#4C5D74', extra: 'cardigan', armR: 'hold', itemR: 'phone', armL: 'lap' },
      lines: [['d', '試下用個 app，幫張梳化叫架車？', 'tablet'], ['p', '嗯……貨Van 夠唔夠大㗎？我真係唔肯定。', 'scratch'], ['d', '點樣會方便啲？', 'tablet'], ['p', '一開始就話埋我總共幾錢啦！', 'palm']],
      notes: { 1: '唔知貨Van 夠唔夠大', 3: '想一開始就知總價' } },
    { pName: '商戶老闆', tag: 'Business <i>商戶</i>', set: ['On site', '到店'], x: 830, bubL: 590, ins: { l: 870, t: 226, w: 300, h: 128, img: 'img/web-tms-admin.jpg', label: '同一張單落 20 次', from: [1040, 384] }, g: 'b', name: 'Business',
      person: { x: 830, y: 642, look: -1, skin: '#E3AE85', hair: '#1E1A18', hairStyle: 'bun', top: '#F4F7F9', bottom: '#33475B', extra: 'apron' },
      lines: [['d', '講下你逢禮拜一點樣落單？', 'tablet'], ['p', '逢禮拜一叫廿張單，都係嗰五個地址。', 'point'], ['d', '邊個負責落單㗎？', 'tablet'], ['p', '我哋三個人，共用一個戶口咋。', 'three']],
      notes: { 1: '逢禮拜一落廿張單', 3: '三個人共用一個戶口' } },
    { pName: '司機', tag: 'Driver <i>司機</i>', set: ['Ride-along', '跟車'], x: 690, bubL: 570, ins: { l: 975, t: 232, w: 205, h: 292, img: 'img/scr-driver-jobs.jpg', label: '白等咗 40 分鐘', from: [713, 400] }, g: 'd', name: 'Driver',
      person: { x: 690, y: 632, look: -1, skin: '#C98E64', hair: '#1B1715', hairStyle: 'short', top: '#1F5FA8', bottom: '#2B3946', extra: 'jacket', cap: '#1F5FA8', armR: 'hold', itemR: 'phone' },
      lines: [['d', '最近有冇單搞到你好頭痕？', 'tablet'], ['p', '有呀！客話係張梳化，點知成三米長，車都入唔到！', 'pointBack'], ['d', '咁最後點呀？', 'tablet'], ['p', '等咗四十分鐘冇錢收，咪取消囉。', 'shrug']],
      notes: { 1: '客冇講貨物尺寸', 3: '等咗四十分鐘冇錢收' } },
  ];
  const DESIGNER = { cls: 'pp-d', x: 340, y: 642, look: 1, skin: '#F6D8BD', hair: '#2A1E1A', hairStyle: 'bob', glasses: true, top: '#1F6FB2', bottom: '#2E3F52', extra: 'lanyard', armR: 'hold', itemR: 'tablet' };
  const PMP = { cls: 'pp-m', x: 150, y: 642, look: 1, skin: '#E8B38C', hair: '#1A1614', hairStyle: 'short', top: '#22324A', bottom: '#3A4A5C', extra: 'collar', armL: 'hold', itemL: 'notebook', armR: 'hold', itemR: 'pen' };
  function ffBuild(el) {
    const scene = (i, bg, fg) => `<g class="ff-scene" data-s="${i}">${bg}${person(Object.assign({ cls: 'pp-p' }, SCN[i].person))}${fg}</g>`;
    $(el, '.ff-svg').innerHTML = scene(0, SCENE_HOME, SCENE_HOME_FG) + scene(1, SCENE_SHOP, SCENE_SHOP_FG) + scene(2, SCENE_STREET, '')
      + `<path class="ff-link" d="M0 0"/>` + person(PMP) + person(DESIGNER);
  }
  // ---- animation helpers (SVG transforms tweened as strings so pivots stay local)
  const rotTo = (g, a, d = .45, o = {}) => {
    const m = g.getAttribute('transform').match(/rotate\(([-\d.]+) ([-\d.]+) ([-\d.]+)\)/);
    return gsap.to(g, Object.assign({ attr: { transform: `rotate(${a} ${m[2]} ${m[3]})` }, duration: d, ease: 'power2.inOut' }, o));
  };
  const armOf = (p, side) => p.querySelector(`.pp-arm[data-side="${side}"]`);
  const talk = (p, dur) => {
    const m = p.querySelector('.pp-mouth'), n = Math.max(2, Math.round(dur / .17));
    return gsap.fromTo(m, { attr: { ry: 3.2 } }, { attr: { ry: 7.5 }, duration: .085, repeat: n * 2 - 1, yoyo: true, ease: 'sine.inOut' });
  };
  const GEST = {
    tablet: p => { rotTo(armOf(p, 1), -16, .35, { yoyo: true, repeat: 1, repeatDelay: 1 }); rotTo(p.querySelector('.pp-head'), 6, .35, { yoyo: true, repeat: 1, repeatDelay: 1.2 }); },
    scratch: p => { rotTo(armOf(p, -1), -152, .5, { yoyo: true, repeat: 1, repeatDelay: 1.8 }); rotTo(p.querySelector('.pp-head'), -8, .4, { yoyo: true, repeat: 1, repeatDelay: 1.9 }); },
    palm: p => rotTo(armOf(p, -1), 62, .4, { yoyo: true, repeat: 1, repeatDelay: 1.6 }),
    point: p => rotTo(armOf(p, 1), -68, .45, { yoyo: true, repeat: 1, repeatDelay: 1.9 }),
    three: p => rotTo(armOf(p, -1), 140, .45, { yoyo: true, repeat: 1, repeatDelay: 1.6 }),
    pointBack: p => { rotTo(armOf(p, 1), -78, .45, { yoyo: true, repeat: 1, repeatDelay: 2.2 }); rotTo(p.querySelector('.pp-head'), 10, .4, { yoyo: true, repeat: 1, repeatDelay: 2.2 }); },
    shrug: p => { rotTo(armOf(p, -1), 48, .4, { yoyo: true, repeat: 1, repeatDelay: 1.6 }); rotTo(armOf(p, 1), -40, .4, { yoyo: true, repeat: 1, repeatDelay: 1.6 }); rotTo(p.querySelector('.pp-head'), -9, .4, { yoyo: true, repeat: 1, repeatDelay: 1.6 }); },
  };
  const persona = (el, pi) => $(el, `.ff-scene[data-s="${pi}"] .pp-p`);
  function ffWrite(el) {
    const pm = $(el, '.pp-m'), pen = armOf(pm, 1);
    rotTo(pen, -10, .14, { yoyo: true, repeat: 7, ease: 'sine.inOut' });
    rotTo(pm.querySelector('.pp-head'), 8, .3, { yoyo: true, repeat: 1, repeatDelay: .8 });
  }
  function ffSetScene(el, pi) {
    const S = SCN[pi];
    el._pi = pi;
    gsap.to($(el, '.ls-knob'), { x: pi * 200, duration: .45, ease: IO });
    $$(el, '.ff-scene').forEach((g, k) => gsap.to(g, { opacity: k === pi ? 1 : 0, duration: .6, ease: IO }));
    const p = persona(el, pi), px = +p.dataset.x, py = +p.dataset.y;
    gsap.fromTo(p, { attr: { transform: `translate(${px + 70} ${py})` }, opacity: 0 }, { attr: { transform: `translate(${px} ${py})` }, opacity: 1, duration: .7, ease: OUT, delay: .15 });
    const set = $(el, '.ff-set');
    gsap.to(set, { opacity: 0, duration: .15, onComplete: () => { set.querySelector('b').textContent = S.set[0]; set.querySelector('i').textContent = S.set[1]; gsap.to(set, { opacity: 1, duration: .25 }); } });
    const tag = $(el, '.ff-tag[data-t="p"]'); tag.innerHTML = S.tag; tag.style.left = S.x + 'px';
    gsap.fromTo(tag, { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: BACK, delay: .5 });
    const bp = $(el, '.ff-bub.p'); bp.style.left = S.bubL + 'px'; bp.style.setProperty('--tail', (S.x - S.bubL - 14) + 'px'); bp.querySelector('em').textContent = S.pName;
    $$(el, '.ff-bub').forEach(b => { gsap.to(b, { opacity: 0, duration: .2 }); b.querySelector('p').textContent = ''; });
    gsap.to([$(el, '.ff-ins'), $(el, '.ff-link')], { opacity: 0, duration: .2 });
  }
  function ffBubble(el, who) {
    const on = $(el, who === 'd' ? '.ff-bub.d' : '.ff-bub.p'), off = $(el, who === 'd' ? '.ff-bub.p' : '.ff-bub.d');
    on.querySelector('p').textContent = '';
    gsap.fromTo(on, { opacity: 0, scale: .85, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: BACK, transformOrigin: `${parseFloat(getComputedStyle(on).getPropertyValue('--tail')) + 14 || 60}px 100%` });
    gsap.to(off, { opacity: off.querySelector('p').textContent ? .45 : 0, duration: .3 });
  }
  function ffInset(el, pi) {
    const I = SCN[pi].ins, ins = $(el, '.ff-ins');
    ins.querySelector('img').src = I.img; ins.querySelector('img').style.objectPosition = pi === 1 ? '0 0' : '50% 0';
    ins.querySelector('b').textContent = I.label;
    gsap.set(ins, { left: I.l, top: I.t, width: I.w, height: I.h });
    const lk = $(el, '.ff-link'), tx = I.from[0] > I.l ? I.l + I.w / 2 : I.l, ty = I.from[0] > I.l ? I.t + I.h : I.t + I.h / 2;
    lk.setAttribute('d', `M${I.from[0]} ${I.from[1]} L${tx} ${ty}`);
    gsap.fromTo(lk, { opacity: 0, drawSVG: '0%' }, { opacity: 1, drawSVG: '100%', duration: .45 });
    gsap.fromTo(ins, { opacity: 0, scale: .4, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1, duration: .55, ease: 'back.out(1.5)', delay: .3 });
    gsap.from(ins.querySelector('.ff-ins-t'), { scale: .5, opacity: 0, duration: .35, ease: BACK, delay: .75 });
  }
  function ffAddNote(el, pi, text) {
    const S = SCN[pi], host = $(el, '.lb-notes');
    const dup = [...host.children].find(n => n.dataset.t === text);
    if (dup) { gsap.fromTo(dup, { scale: 1 }, { scale: 1.08, duration: .2, yoyo: true, repeat: 1 }); return; }
    const n = document.createElement('div');
    n.className = `lb-note g-${S.g}`; n.dataset.t = text; n.innerHTML = `<span>${text}</span><em>${S.name}</em>`;
    host.appendChild(n);
    const from = box($(el, '.pp-m .pp-nb'), el), to = box(n, el);
    gsap.from(n, { x: from.cx - to.cx, y: from.cy - to.cy, scale: .25, rotation: -14, opacity: 0, duration: .95, ease: 'power3.inOut' });
    const c = $(el, '.lb-n'); c.textContent = host.children.length;
    gsap.fromTo(c, { scale: 1.4 }, { scale: 1, duration: .4, ease: BACK, delay: .8 });
  }
  function ffClear(el) {
    const ns = $$(el, '.lb-note'); if (!ns.length) return;
    gsap.to(ns, { opacity: 0, scale: .8, duration: .3, stagger: .03, onComplete: () => { ns.forEach(n => n.remove()); $(el, '.lb-n').textContent = '0'; } });
  }
  const chars = s => Array.from(s);
  function ffType(pEl, text) {
    const cs = chars(text), o = { n: 0 };
    return gsap.to(o, { n: cs.length, duration: .2 + cs.length * .075, ease: 'none', onStart: () => { pEl.textContent = ''; }, onUpdate: () => { pEl.textContent = cs.slice(0, Math.round(o.n)).join(''); } });
  }
  function ffPlay(el, pi) {
    const S = SCN[pi], t = gsap.timeline(), d = $(el, '.pp-d'), p = persona(el, pi);
    t.call(() => ffSetScene(el, pi)).to({}, { duration: 1 });
    S.lines.forEach(([who, text, g], k) => {
      const spk = who === 'd' ? d : p, bub = $(el, who === 'd' ? '.ff-bub.d p' : '.ff-bub.p p');
      const typed = ffType(bub, text), dur = typed.duration();
      t.call(() => { ffBubble(el, who); GEST[g](spk); });
      t.add(typed, '>.15');
      t.add(talk(spk, dur), '<');
      if (who === 'p' && k === 1) t.call(() => ffInset(el, pi), null, '<.5');
      if (S.notes[k]) { t.call(() => ffWrite(el), null, '>'); t.call(() => ffAddNote(el, pi, S.notes[k]), null, '>+.6'); }
      t.to({}, { duration: S.notes[k] ? 1.6 : .8 });
    });
    t.to({}, { duration: .6 });
    return t;
  }
  function lsStart(el, from = 0) {
    if (el._cyc) el._cyc.kill();
    const c = gsap.timeline({ repeat: -1, delay: .2 });
    for (let k = 0; k < 3; k++) c.add(ffPlay(el, (from + k) % 3));
    el._cyc = c;
  }
  function lsReset(el) {
    if (el._cyc) { el._cyc.kill(); el._cyc = null; }
    $$(el, '.lb-note').forEach(n => n.remove()); $(el, '.lb-n').textContent = '0';
    el._live = false;
  }
  FX.rsListen = (el, tl, A) => {
    lsReset(el);
    ffBuild(el);
    $$(el, '.ff-scene').forEach((g, k) => gsap.set(g, { opacity: k ? 0 : 1 }));
    $$(el, '.ff-bub').forEach(b => { gsap.set(b, { opacity: 0 }); b.querySelector('p').textContent = ''; });
    gsap.set([$(el, '.ff-ins'), $(el, '.ff-link')], { opacity: 0 });
    gsap.set($(el, '.ls-knob'), { x: 0 });
    const S0 = SCN[0], tag = $(el, '.ff-tag[data-t="p"]'); tag.innerHTML = S0.tag; tag.style.left = S0.x + 'px';
    $(el, '.ff-tag[data-t="d"]').style.left = DESIGNER.x + 'px'; $(el, '.ff-tag[data-t="m"]').style.left = PMP.x + 'px';
    tl.from($(el, '.ff-stage'), { y: 40, opacity: 0, scale: .97, duration: .8, ease: OUT }, .3);
    rise(tl, $(el, '.ls-tabs'), .4, { y: -12 });
    const walkIn = (sel, dxp) => { const g = $(el, sel), x = +g.dataset.x, y = +g.dataset.y; tl.fromTo(g, { attr: { transform: `translate(${x + dxp} ${y})` }, opacity: 0 }, { attr: { transform: `translate(${x} ${y})` }, opacity: 1, duration: .8, ease: OUT }, .7); };
    walkIn('.pp-m', -160); walkIn('.pp-d', -200); walkIn('.ff-scene[data-s="0"] .pp-p', 120);
    pop(tl, $$(el, '.ff-tag'), 1.2, { stagger: .1 });
    rise(tl, $(el, '.ff-set'), 1.0, { y: -10 });
    tl.from($(el, '.ff-board'), { x: 60, opacity: 0, duration: .7, ease: OUT }, .6);
    A.onLeave(() => lsReset(el));
    A.loop(() => {
      el._live = true;
      $$(el, '.pp').forEach((p, i) => {
        const up = p.querySelector('.pp-up'), tr = up.getAttribute('transform');
        gsap.to(up, { attr: { transform: tr.replace('scale(1 1)', 'scale(1 1.016)') }, duration: 1.7 + i * .13, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.timeline({ repeat: -1, repeatDelay: 2.2 + (i % 3) * .9, delay: i * .4 }).to(p.querySelectorAll('.pp-eye'), { attr: { ry: .6 }, duration: .07, yoyo: true, repeat: 1 });
      });
      lsStart(el, 0);
      return () => lsReset(el);
    }, 0);
  };
  FX.rsListen.init = el => {
    el.addEventListener('click', e => {
      const b = e.target.closest('.ls-tabs button'); if (!b || !el._live) return;
      lsStart(el, +b.dataset.p);
    });
  };

  /* ------------------------------------------------ R2 notes → insights */
  // [theme, user, Cantonese feedback, slot on slide 15's highlight board (★ from the interviews) or -1]
  const SO_NOTES = [
    ['A', 'c', '唔知貨Van 夠唔夠大', 0], ['A', 'd', '客冇講貨物尺寸', 4], ['A', 'c', '揀咗貨Van，原來要貨車', -1], ['A', 'c', '雪櫃擺唔擺得落？', -1], ['A', 'd', '張梳化入唔到車', -1],
    ['B', 'c', '想一開始就知總價', 1], ['B', 'c', '落咗單先見到隧道費', -1], ['B', 'c', '等候費？之前唔知㗎', -1], ['B', 'd', '客喺門口拗附加費', -1],
    ['C', 'b', '逢禮拜一落廿張單', 2], ['C', 'b', '三個人共用一個戶口', 3], ['C', 'b', '次次都係嗰五個地址', -1], ['C', 'b', '會計要一張月結單', -1],
    ['D', 'd', '等咗四十分鐘冇錢收', 5], ['D', 'd', '到咗，客仲未準備好', -1], ['D', 'd', '等太耐，下張單冇埋', -1], ['D', 'b', '上落貨區成日排長龍', -1],
  ];
  const SO_THEMES = { A: ['Vehicle size is a guess', '車型靠估', 'How might we help them pick the right vehicle first time?'],
    B: ['Surprise fees break trust', '收費唔透明', 'How might we show the full price before they commit?'],
    C: ['Businesses book in batches', '商戶成批落單', 'How might we make the tenth booking as fast as the first?'],
    D: ['Waiting is unpaid time', '等車冇錢收', 'How might we make waiting fair for both sides?'] };
  const SO_USERS = [['c', 'Consumers', '客戶'], ['b', 'Businesses', '商戶'], ['d', 'Drivers', '司機']];
  // slide 15 board slot → stage position (board at 1380,232; notes 179×116, gap 14)
  const SLOT = i => ({ x: 1404 + (i % 2) * 193 - 5, y: 310 + Math.floor(i / 2) * 130 + 12 });
  const SO_WALL = [[150, 300, -8], [520, 560, 6], [880, 320, -4], [1290, 290, 9], [1600, 500, -6], [330, 470, 4], [700, 430, -10], [1060, 600, 5],
    [1430, 650, -4], [200, 680, 8], [930, 500, -7], [1220, 430, 3], [600, 300, 7], [1560, 330, -9], [790, 690, 2], [1180, 760, -5], [420, 760, 6]];
  const SO_KNOB = { wall: [0, 120], user: [120, 140], theme: [260, 150] };
  function soTargets(mode) {
    if (mode === 'wall') return SO_WALL.map(([x, y, r]) => ({ x, y, r }));
    const idx = {}, out = [];
    SO_NOTES.forEach(([th, u]) => {
      const key = mode === 'theme' ? th : u; const k = idx[key] = (idx[key] ?? -1) + 1;
      if (mode === 'theme') { const i = 'ABCD'.indexOf(th); out.push({ x: 120 + i * 423 + 8 + (k % 2) * 204, y: 268 + 112 + Math.floor(k / 2) * 106, r: 0 }); }
      else { const i = ['c', 'b', 'd'].indexOf(u); out.push({ x: 120 + i * 570 + (k % 2) * 204, y: 340 + Math.floor(k / 2) * 106, r: 0 }); }
    });
    return out;
  }
  function soSpotStop(el) { if (el._spot) { el._spot.kill(); el._spot = null; } $$(el, '.so-reg').forEach(r => { r.classList.remove('on'); gsap.to(r.querySelector('.so-hmw'), { opacity: 0, duration: .2 }); }); }
  function soSpot(el, i) {
    $$(el, '.so-reg').forEach((r, k) => { r.classList.toggle('on', k === i); gsap.to(r.querySelector('.so-hmw'), { opacity: k === i ? 1 : 0, y: k === i ? 0 : 8, duration: .35 }); });
  }
  function soLayout(el, mode, animate = true) {
    el._mode = mode;
    const ts = soTargets(mode), d = animate ? 1 : 0;
    $$(el, '.so-n').forEach((n, i) => gsap.to(n, { x: ts[i].x, y: ts[i].y, rotation: ts[i].r, duration: d, ease: 'power3.inOut', delay: animate ? i * .02 : 0, overwrite: 'auto' }));
    gsap.to($$(el, '.so-reg'), { opacity: mode === 'theme' ? 1 : 0, duration: d * .5, delay: mode === 'theme' ? d * .45 : 0, stagger: mode === 'theme' ? .08 : 0 });
    gsap.to($$(el, '.so-col'), { opacity: mode === 'user' ? 1 : 0, y: mode === 'user' ? 0 : -10, duration: d * .5, stagger: .06 });
    const [kx, kw] = SO_KNOB[mode];
    gsap.to($(el, '.so-knob'), { x: kx, width: kw, duration: animate ? .45 : 0, ease: IO });
    soSpotStop(el);
    if (mode === 'theme' && animate) {
      gsap.fromTo($(el, '.so-beam'), { x: 90, opacity: 1 }, { x: 1830, duration: 1.1, ease: 'power1.inOut', onComplete: () => gsap.to($(el, '.so-beam'), { opacity: 0, duration: .2 }) });
      const t = gsap.timeline({ repeat: -1, delay: 1.6 });
      [0, 1, 2, 3].forEach(i => t.call(() => soSpot(el, i)).to({}, { duration: 3 }));
      el._spot = t;
    }
  }
  FX.rsSort = (el, tl, A) => {
    el._api = A;
    const notes = $$(el, '.so-n');
    gsap.killTweensOf(notes);
    soSpotStop(el);
    SO_WALL.forEach(([x, y, r], i) => gsap.set(notes[i], { x, y, rotation: r }));
    gsap.set($$(el, '.so-reg, .so-col'), { opacity: 0 });
    gsap.set($(el, '.so-knob'), { x: 0, width: 120 });
    el._mode = 'wall';
    rise(tl, $(el, '.so-tabs'), .35, { y: -12 });
    rise(tl, $(el, '.so-leg'), .45, { y: 10 });
    const stars = notes.filter(n => +n.dataset.s >= 0), others = notes.filter(n => +n.dataset.s < 0);
    tl.fromTo($(el, '.so-ghost'), { opacity: 1 }, { opacity: 0, duration: .5 }, 1.3)
      .from(stars, { opacity: 0, duration: .35, stagger: .05 }, .3)
      .from(stars, { x: (i, n) => SLOT(+n.dataset.s).x, y: (i, n) => SLOT(+n.dataset.s).y, rotation: 0, scale: 1.05, duration: 1.1, ease: 'power3.inOut', stagger: .07 }, 1.0, )
      .from(others, { scale: 0, opacity: 0, duration: .45, ease: BACK, stagger: { each: .06, from: 'random' } }, 1.6);
    A.loop(() => gsap.to(notes, { yPercent: () => -4 - Math.random() * 5, duration: () => 1.3 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut' }), 0);
    A.step();
    rise(tl, $(el, '.so-ai'), tl.duration(), { y: 14, duration: .35 });
    A.loop(() => { gsap.delayedCall(0, () => soLayout(el, 'theme')); return () => soLayout(el, 'wall'); }, 1);
    A.onLeave(() => soSpotStop(el));
  };
  FX.rsSort.init = el => {
    $(el, '.so-notes').innerHTML = SO_NOTES.map(([, u, t, st]) => `<div class="so-n g-${u}" data-s="${st}">${t}${st >= 0 ? '<i class="so-st">★</i>' : ''}</div>`).join('');
    $(el, '.so-regs').innerHTML = 'ABCD'.split('').map((th, i) => {
      const users = [...new Set(SO_NOTES.filter(n => n[0] === th).map(n => n[1]))];
      return `<div class="so-reg" data-i="${i}" data-ui style="left:${120 + i * 423}px;top:268px;width:410px;height:540px"><b>${SO_THEMES[th][0]}<span class="so-zh">${SO_THEMES[th][1]}</span></b><span class="so-dots">${users.map(u => `<i class="g-${u}"></i>`).join('')}</span><p class="so-hmw"><em>How might we</em>${SO_THEMES[th][2].replace('How might we ', '')}</p></div>`;
    }).join('');
    $(el, '.so-cols').innerHTML = SO_USERS.map(([u, n, z], i) => `<div class="so-col" style="left:${120 + i * 570}px;top:270px;width:532px">${n} <i>${z}</i></div>`).join('');
    el.addEventListener('click', e => {
      const b = e.target.closest('.so-tabs button');
      if (b && el._api) {
        const m = b.dataset.m, si = el._api.stopIndex();
        if (m === 'wall') { if (si >= 1) el._api.seekStop(0); else soLayout(el, 'wall'); }
        else if (m === 'theme') { if (si < 1) el._api.seekStop(1); else soLayout(el, 'theme'); }
        else soLayout(el, 'user');
        return;
      }
      const r = e.target.closest('.so-reg');
      if (r && el._mode === 'theme') { if (el._spot) { el._spot.kill(); el._spot = null; } soSpot(el, +r.dataset.i); }
    });
  };

  /* ------------------------------------------------ R4 judgment (interactive) */
  const PX0 = 200, PW = 810, PY0 = 880, PH = 540;
  const BUBS = [
    { id: 'A', t: 'Vehicle size', zh: '車型靠估', title: 'Vehicle size is a guess', g: 'c', x: .80, y: .86, r: 46, side: 'l', dec: 'Do now', q: ['唔知貨Van 夠唔夠大', '客冇講貨物尺寸'], src: [['Interviews', 1], ['CS chats', 1], ['Funnel data', 1], ['Driver feedback', 1]], mv: 'Completed orders' },
    { id: 'B', t: 'Surprise fees', zh: '收費唔透明', title: 'Surprise fees break trust', g: 'c', x: .70, y: .66, r: 40, side: 'r', dec: 'Do now', q: ['想一開始就知總價', '落咗單先見到隧道費'], src: [['Interviews', 1], ['App reviews', 1], ['CS chats', 1], ['Funnel data', 1]], mv: 'Completed orders' },
    { id: 'C', t: 'Batch booking', zh: '商戶成批落單', title: 'Businesses book in batches', g: 'b', x: .2, y: .74, r: 38, side: 'r', dec: 'Plan', q: ['逢禮拜一落廿張單', '三個人共用一個戶口'], src: [['Interviews', 1], ['Sales requests', 1], ['Account data', 1], ['App reviews', 0]], mv: 'Business repeat orders' },
    { id: 'D', t: 'Unpaid waiting', zh: '等車冇錢收', title: 'Waiting is unpaid time', g: 'd', x: .38, y: .62, r: 34, side: 'r', dec: 'Plan', q: ['等咗四十分鐘冇錢收', '到咗，客仲未準備好'], src: [['Interviews', 1], ['Driver feedback', 1], ['Order chats', 1], ['Funnel data', 0]], mv: 'Driver acceptance' },
    { id: 'E', t: 'Finding receipts', zh: '搵唔到舊收據', title: 'Can’t find past receipts', g: 'b', x: .74, y: .30, r: 28, side: 'r', dec: 'Quick win', q: ['舊收據搵極都搵唔到', '月尾對數好麻煩'], src: [['CS chats', 1], ['App reviews', 1], ['Interviews', 0], ['Funnel data', 0]], mv: 'Fewer CS contacts' },
    { id: 'F', t: 'Dark mode', zh: '想要深色模式', title: 'Wants a dark mode', g: 'c', x: .18, y: .16, r: 24, side: 'r', dec: 'Park', q: ['可唔可以有深色模式？'], src: [['App reviews', 1], ['Interviews', 0], ['CS chats', 0], ['Funnel data', 0]], mv: 'None of our North Stars yet' },
  ];
  function rjSelect(el, i, animate = true) {
    el._sel = i;
    const b = BUBS[i], ev = $(el, '.rj-ev');
    $$(el, '.rj-b').forEach((n, k) => n.classList.toggle('sel', k === i));
    const fill = () => {
      $(el, '.rj-evt').textContent = b.title;
      $(el, '.rj-evz').textContent = b.zh;
      $(el, '.rj-qs').innerHTML = b.q.map(q => `<span class="g-${b.g}">「${q}」</span>`).join('');
      const dec = $(el, '.rj-dec'); dec.textContent = b.dec; dec.className = 'rj-dec' + (b.dec === 'Do now' ? ' now' : '');
      $(el, '.rj-src').innerHTML = b.src.map(([n, y]) => `<span class="${y ? 'y' : ''}">${ic(y ? 'check' : 'x')}${n}</span>`).join('');
      $(el, '.rj-mv span').textContent = 'Moves: ' + b.mv;
    };
    if (!animate) { fill(); return; }
    gsap.to(ev.children, { opacity: 0, y: -6, duration: .15, onComplete: () => { fill(); gsap.fromTo(ev.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, stagger: .05 }); } });
    gsap.fromTo($$(el, '.rj-b')[i], { scale: 1 }, { scale: 1.15, duration: .2, yoyo: true, repeat: 1 });
  }
  function rjAuto(el, from) {
    if (el._auto) el._auto.kill();
    const order = [0, 1, 2, 3, 4, 5];
    const t = gsap.timeline({ repeat: -1 });
    order.forEach((_, k) => { const i = (from + k) % 6; t.call(() => rjSelect(el, i)).to({}, { duration: 2.8 }); });
    el._auto = t;
  }
  FX.rsJudge = (el, tl, A) => {
    rjSelect(el, 0, false);
    tl.from($(el, '.rj-ax'), { drawSVG: '0%', duration: .8, ease: IO }, .35)
      .from($(el, '.rj-mid'), { opacity: 0, duration: .5 }, .9)
      .from($$(el, '.rj-axl'), { opacity: 0, duration: .4, stagger: .1 }, 1.0);
    pop(tl, $$(el, '.rj-q'), .9, { stagger: .08 });
    tl.from($$(el, '.rj-b'), { scale: 0, duration: .6, ease: 'back.out(2)', stagger: .12 }, 1.2)
      .from($$(el, '.rj-bl'), { opacity: 0, x: -8, duration: .35, stagger: .12 }, 1.4);
    rise(tl, $(el, '.rj-size'), 2.0, { y: 8 });
    rise(tl, $$(el, '.rj-tests .rs-lab, .rj-t'), .6, { x: 30, y: 0, stagger: .1 });
    rise(tl, $(el, '.rj-ev'), 1.6, { y: 30, duration: .6 });
    A.onLeave(() => { if (el._auto) el._auto.kill(); if (el._resume) el._resume.kill(); });
    A.loop(() => { rjAuto(el, 1); return () => { if (el._auto) el._auto.kill(); }; }, 0);
  };
  FX.rsJudge.init = el => {
    const host = $(el, '.rj-bubs');
    host.innerHTML = BUBS.map((b, i) => {
      const cx = PX0 + b.x * PW, cy = PY0 - b.y * PH;
      const lab = b.side === 'l' ? `right:${1920 - (cx - b.r - 12)}px` : `left:${cx + b.r + 12}px`;
      return `<div class="rj-b g-${b.g}" data-i="${i}" data-ui style="left:${cx - b.r}px;top:${cy - b.r}px;width:${b.r * 2}px;height:${b.r * 2}px"></div><div class="rj-bl${b.side === 'l' ? ' l' : ''}" style="${lab};top:${cy - 24}px"><b>${b.t}</b><i>${b.zh}</i></div>`;
    }).join('');
    el.addEventListener('click', e => {
      const n = e.target.closest('.rj-b'); if (!n) return;
      if (el._auto) { el._auto.kill(); el._auto = null; }
      if (el._resume) el._resume.kill();
      const i = +n.dataset.i; rjSelect(el, i);
      el._resume = gsap.delayedCall(6, () => rjAuto(el, i + 1));
    });
  };

})();
