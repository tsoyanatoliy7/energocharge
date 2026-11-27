/* EnerGo page logic: hero film, section nav, instructions on the station, videos. Loaded as a classic script. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAP = 'https://yandex.uz/maps/?text=EnerGo%20Ташкент';
  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ---------- boot ---------- */
  const hdr = $('#hdr');
  document.body.dataset.v = 'c';
  queueMicrotask(() => { layoutC(); requestAnimationFrame(() => requestAnimationFrame(() => $('#vc').classList.add('is-in'))); });

  /* toast */
  const toast = $('#toast'); let tt;
  const say = (m) => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 3200); };

  /* search: opens real station map (Yandex, «EnerGo») */
  $$('.js-find').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const q = (f.querySelector('input').value || f.querySelector('.chip.is-on:not(.js-near)')?.textContent || 'Ташкент').trim();
    say('Открываем карту станций EnerGo: ' + q);
    window.open('https://yandex.uz/maps/?text=' + encodeURIComponent('EnerGo ' + q), '_blank', 'noopener');
  }));
  $$('.chips').forEach(c => c.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    if (b.classList.contains('js-near')) {
      if (!navigator.geolocation) return say('Геолокация недоступна в этом браузере');
      say('Определяем местоположение…');
      navigator.geolocation.getCurrentPosition(p => {
        const { latitude: la, longitude: lo } = p.coords;
        window.open(`https://yandex.uz/maps/?ll=${lo},${la}&z=13&text=EnerGo`, '_blank', 'noopener');
      }, () => say('Нет доступа к геолокации. Выберите город.'));
      return;
    }
    $$('.chip', c).forEach(x => x.classList.toggle('is-on', x === b));
  }));

  /* header state */
  const onScroll = () => hdr.classList.toggle('is-scrolled', scrollY > 24 && document.body.dataset.v !== 'c' || (document.body.dataset.v === 'c' && scrollY > $('#vcScroll').offsetHeight - innerHeight));
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- C: cinematic dolly into the screen ---------- */
  const scroller = $('#vcScroll'), rig = $('#vcRig'), copy = $('#vcCopy'), vig = $('#vcVig'), cue = $('#vcCue'), rail = $('#vcRail'), floor = $('#vcFloor'), scrim = $('#vcScrim');
  const steps = $$('.vc-step'), scrs = $$('.scr'), railItems = $$('span', rail);
  const SCR = { x: .3195 + .3535 / 2, y: .213 + .5195 / 2, w: .3535, h: .5195 }; // screen rect in image fractions
  const AR = 940 / 1024;
  let L = {};
  function layoutC() {
    const vw = innerWidth, vh = innerHeight, mob = vw < 1024 && vw / vh < 1.15;
    document.body.classList.toggle('c-wide', vw < 1024 && !mob);
    // stacked layout: the station takes exactly the space under the copy, its lamp tucks a little under the buttons' glow
    const copyBottom = mob ? copy.offsetTop + copy.offsetHeight : 0;
    const H = mob ? Math.max(vh * .34, Math.min(vh - copyBottom + 4, vw * 1.25, vh * .66)) : Math.min(vh * .84, vw * .6);
    const W = H * AR;
    rig.style.height = H + 'px'; rig.style.width = W + 'px';
    // K0: start position (centre of station)
    const k0 = mob ? { cx: vw / 2, cy: vh - H / 2 + H * .04, s: 1 } : { cx: vw * .7, cy: vh - H / 2 + H * .02, s: 1 };
    const k1 = { cx: vw / 2, cy: vh - H / 2 + H * .02, s: mob ? 1.02 : 1 };
    // K2: screen fills viewport
    const sW = SCR.w * W, sH = SCR.h * H;
    const s2 = mob ? Math.min((vh - 340) / sH, (vw - 48) / sW) : Math.min(vh * .84 / sH, vw * .4 / sW);
    const screenCx = mob ? vw / 2 : vw * .53, screenCy = mob ? 70 + (vh - 340) / 2 : vh / 2;
    // convert desired screen centre to station centre
    const k2 = { s: s2, cx: screenCx - (SCR.x - .5) * W * s2, cy: screenCy - (SCR.y - .5) * H * s2 };
    L = { vw, vh, W, H, k0, k1, k2, mob };
    tickC(true);
  }
  addEventListener('resize', layoutC);
  document.fonts && document.fonts.ready.then(() => layoutC());
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ss = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  let pS = 0;
  function tickC(force) {
    if (!L.W) return;
    const r = scroller.getBoundingClientRect();
    const total = scroller.offsetHeight - innerHeight;
    const pT = clamp(-r.top / total);
    pS = force || reduce ? pT : pS + (pT - pS) * .14;
    const p = pS;
    const a = ss(.04, .26, p), b = ss(.24, .5, p);
    const cx = lerp(lerp(L.k0.cx, L.k1.cx, a), L.k2.cx, b);
    const cy = lerp(lerp(L.k0.cy, L.k1.cy, a), L.k2.cy, b);
    const s = lerp(lerp(L.k0.s, L.k1.s, a), L.k2.s, b);
    rig.style.transform = `translate(${cx - L.W * s / 2}px, ${cy - L.H * s / 2}px) scale(${s})`;
    copy.style.opacity = 1 - ss(.02, .14, p);
    copy.style.transform = (L.mob ? '' : 'translateY(-46%) ') + `translateY(${-ss(0, .16, p) * 60}px)`;
    copy.style.pointerEvents = p > .1 ? 'none' : '';
    cue.style.opacity = .55 * (1 - ss(0, .06, p));
    vig.style.opacity = ss(.3, .52, p);
    scrim.style.opacity = ss(.46, .52, p);
    floor.style.setProperty('--fx', lerp(L.mob ? 50 : 68, 50, a) + '%');
    floor.style.setProperty('--fo', 1 - ss(.3, .45, p));
    // steps
    const st = p < .5 ? -1 : p < .66 ? 0 : p < .82 ? 1 : 2;
    steps.forEach((el, i) => el.classList.toggle('on', i === st));
    railItems.forEach((el, i) => el.classList.toggle('on', i === st));
    rail.style.opacity = ss(.48, .54, p);
    scrs.forEach((el, i) => el.classList.toggle('on', st === -1 ? false : i === st));
    rig.classList.toggle('scr-busy', p > .2);
    // step 2: balance counter, step 3: charging ring
    const bal = Math.round(ss(.68, .78, p) * 100000);
    $('#balV').textContent = bal.toLocaleString('ru-RU');
    const ch = ss(.84, .98, p);
    $('#ringArc').style.strokeDashoffset = 276.5 * (1 - ch * .8);
    $('#ringV').textContent = Math.round(ch * 80);
    $('#kwhV').textContent = (ch * 24.6).toFixed(1);
  }
  $$('[data-jump]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const y = scroller.offsetTop + (scroller.offsetHeight - innerHeight) * parseFloat(a.dataset.jump);
    lenis ? lenis.scrollTo(y, { duration: 2.4 }) : scrollTo({ top: y, behavior: 'smooth' });
  }));


  /* ---------- instructions on the station ---------- */
  const ins = $('#ins');
  const SEQ = {
    screen: [{ tag: 'scan' }, { tag: 'pick' }, { tag: 'start' }],
    take:   [{ ring: 'latch', tag: 'latch' }, { lift: 1, arrow: 'out' }, { lift: 1, tag: 'plug' }],
    return: [{ lift: 1, tag: 'finish' }, { lift: 1, ring: 'latch', arrow: 'in' }, { tag: 'back' }],
    stop:   [{ ring: 'stop', tag: 'press' }, { tag: 'stopped' }, { tag: 'callstop' }],
    help:   [{ tag: 'call' }, { tag: 'call' }, { tag: 'call' }]
  };
  const STEP = 1900;
  let part = 'gun', mode = 'take', phase = 0, timer;
  const touch = matchMedia('(hover: none)').matches;
  if (touch) $('.js-verb').textContent = 'Нажмите';
  function render() {
    const key = part === 'gun' ? mode : part, st = SEQ[key][phase];
    ins.dataset.part = part; ins.dataset.mode = mode;
    ins.dataset.lift = st.lift ? 1 : 0; ins.dataset.ring = st.ring || ''; ins.dataset.arrow = st.arrow || '';
    $$('.tagx', ins).forEach(t => t.classList.toggle('on', t.dataset.tag === st.tag));
    window.dispatchEvent(new CustomEvent('ins:phase', { detail: { part, tag: st.tag || '' } }));
    const card = $(`.card[data-for="${part}"]`, ins);
    const list = part === 'gun' ? $(`.ol[data-mode="${mode}"]`, card) : $('.ol', card);
    $$('.ol li', ins).forEach(li => li.classList.remove('on'));
    const li = list.children[phase]; void li.offsetWidth; li.classList.add('on'); li.style.setProperty('--step', STEP + 'ms');
    $('.js-turnlabel').textContent = part === 'stop' ? 'Повернуть обратно' : 'Повернуть: аварийная кнопка';
  }
  function select(p, keepPhase) {
    if (p === part && keepPhase) return;
    part = p; phase = 0;
    $$('.tab', ins).forEach(t => t.setAttribute('aria-selected', t.dataset.part === p));
    $$('.card', ins).forEach(c => c.classList.toggle('on', c.dataset.for === p));
    render(); restart();
  }
  function restart() { clearInterval(timer); timer = setInterval(() => { phase = (phase + 1) % 3; render(); }, STEP); }
  $$('.tab', ins).forEach(t => { t.addEventListener('click', () => select(t.dataset.part)); t.addEventListener('pointerenter', e => e.pointerType === 'mouse' && select(t.dataset.part, true)); });
  $$('.part', ins).forEach(b => { b.addEventListener('click', () => select(b.dataset.part)); b.addEventListener('pointerenter', e => e.pointerType === 'mouse' && select(b.dataset.part, true)); });
  $('[data-turn]', ins).addEventListener('click', () => select(part === 'stop' ? 'gun' : 'stop'));
  $$('.modes button', ins).forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode; phase = 0;
    $$('.modes button', ins).forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.card[data-for="gun"] .ol', ins).forEach(o => o.hidden = o.dataset.mode !== mode);
    $('.yt-take', ins).hidden = mode !== 'take'; $('.yt-return', ins).hidden = mode !== 'return';
    render(); restart();
  }));
  render(); restart();
  /* section nav: smooth jump under the fixed header + scrollspy */
  const hdrH = () => hdr.offsetHeight;
  $$('[data-sec]').forEach(a => a.addEventListener('click', e => {
    const t = document.getElementById(a.dataset.sec); if (!t) return;
    e.preventDefault();
    if (a.dataset.tab) { const tb = $(`.tab[data-part="${a.dataset.tab}"]`, ins); tb && tb.click(); }
    lenis ? lenis.scrollTo(t, { offset: -hdrH() + 1, duration: 1.4 }) : scrollTo({ top: t.getBoundingClientRect().top + scrollY - hdrH() + 1, behavior: 'smooth' });
  }));
  const spyIds = ['ins', 'vids', 'map', 'partner'].filter(id => document.getElementById(id));
  const bar = $('.secbar');
  let curSec = null;
  const spy = () => {
    const y = hdrH() + 60; let cur = '';
    spyIds.forEach(id => { const r = document.getElementById(id).getBoundingClientRect(); if (r.top <= y && r.bottom > y) cur = id; });
    if (cur === curSec) return; curSec = cur;
    $$('[data-sec]').forEach(a => a.setAttribute('aria-current', a.dataset.sec === cur && a.dataset.spy !== '0'));
    const on = bar && bar.querySelector(`[data-sec="${cur}"]`);
    if (on && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: on.offsetLeft - 16, behavior: 'smooth' });
  };
  addEventListener('scroll', spy, { passive: true }); spy();

  /* station screen links: hover on desktop, first tap shows the hint on touch */
  const touchUI = matchMedia('(hover: none)').matches;
  $$('.sl').forEach(a => a.addEventListener('click', e => {
    if (!touchUI || a.classList.contains('armed')) return;
    e.preventDefault();
    $$('.sl.armed').forEach(x => x.classList.remove('armed'));
    a.classList.add('armed'); setTimeout(() => a.classList.remove('armed'), 4000);
  }));

  /* video carousel: arrows, progress, drag, wheel-free */
  const vr = $('#vidsRow'), vb = $('#vidsBar'), vp = $('#vidsPrev'), vn = $('#vidsNext'), vc = $('#vidsCount');
  const vitems = $$('.vid', vr);
  const stepW = () => vitems[0].getBoundingClientRect().width + 12;
  const upd = () => {
    const max = vr.scrollWidth - vr.clientWidth, x = vr.scrollLeft;
    const vis = Math.max(1, Math.round(vr.clientWidth / stepW()));
    const first = Math.min(vitems.length - vis, Math.round(x / stepW())) + 1;
    vb.style.width = Math.min(100, vr.clientWidth / vr.scrollWidth * 100) + '%';
    vb.style.transform = `translateX(${max ? x / max * (100 / (vr.clientWidth / vr.scrollWidth) - 100) : 0}%)`;
    vp.disabled = x < 4; vn.disabled = x > max - 4;
    vr.classList.toggle('at-end', x > max - 4);
    vc.textContent = `${first}–${Math.min(vitems.length, first + vis - 1)} / ${vitems.length}`;
  };
  vr.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  vp.addEventListener('click', () => vr.scrollBy({ left: -stepW() * 2, behavior: 'smooth' }));
  vn.addEventListener('click', () => vr.scrollBy({ left: stepW() * 2, behavior: 'smooth' }));
  let dx = 0, sl0 = 0, down = false, moved = false;
  vr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; dx = e.clientX; sl0 = vr.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - dx; if (Math.abs(d) > 5) { moved = true; vr.classList.add('dragging'); } vr.scrollLeft = sl0 - d; });
  addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => vr.classList.remove('dragging'), 0); if (moved) { const i = Math.round(vr.scrollLeft / stepW()); vr.scrollTo({ left: i * stepW(), behavior: 'smooth' }); } });
  vr.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
  vr.addEventListener('keydown', e => { if (e.key === 'ArrowRight') vn.click(); if (e.key === 'ArrowLeft') vp.click(); });
  /* ---------- main loop ---------- */
  function loop() {
    tickC(false);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
