/* =====================================================================
   EnerGo — карта всех локаций.

   ТОЧКА ИНТЕГРАЦИИ ДЛЯ РАЗРАБОТЧИКОВ
   ----------------------------------
   Сейчас карта показывает ДЕМО-станции (сгенерированы для вёрстки,
   распределение по городам взято из драфта команды). Чтобы связать
   сайт с действующей картой приложения:

   1) заменить EnerGoLocations.fetchStations() ниже на запрос к API
      приложения, например:
        fetchStations: () => fetch('/api/stations').then(r => r.json()).then(mapApiToStation)
   2) или передать данные снаружи в любой момент:
        window.EnerGoLocations.setStations(listOfStations)
   3) для живых статусов вызывать setStations() повторно (polling / WebSocket),
      выбранная станция и вид карты сохраняются.
   4) снять у <section id="map"> атрибут data-source="demo" и удалить .dev-note.

   Формат станции (Station):
   {
     id: string,                      // уникальный id из приложения
     name: string,                    // "EnerGo 126"
     city: string,                    // ключ города из CITIES ниже (или новый ключ + запись в CITIES)
     address: string,
     lat: number, lng: number,        // WGS-84
     connectors: [{ type: 'GB/T' | 'CCS2' | 'Type 2', kw: number, status: 'free' | 'busy' | 'off' }],
     price: number,                   // сум за кВт·ч
     hours?: string,                  // "24/7"
     appUrl?: string                  // deep link на станцию в приложении
   }

   События: EnerGoLocations.on('select', station => …)
   ===================================================================== */
(() => {
  const G = window.UZ_GEO;
  const root = document.getElementById('map');
  if (!G || !root) return;
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';

  const CITIES = {
    tashkent: { name: 'Ташкент', lat: 41.311, lng: 69.279 },
    samarkand: { name: 'Самарканд', lat: 39.654, lng: 66.959 },
    fergana: { name: 'Фергана', lat: 40.384, lng: 71.786 },
    kashkadarya: { name: 'Кашкадарья', lat: 38.861, lng: 65.789 },
    navoi: { name: 'Навои', lat: 40.103, lng: 65.379 },
    syrdarya: { name: 'Сырдарья', lat: 40.489, lng: 68.784 },
    andijan: { name: 'Андижан', lat: 40.783, lng: 72.344 },
    bukhara: { name: 'Бухара', lat: 39.767, lng: 64.423 },
    khorezm: { name: 'Хорезм', lat: 41.55, lng: 60.631 },
    namangan: { name: 'Наманган', lat: 40.998, lng: 71.672 },
    jizzakh: { name: 'Джизак', lat: 40.116, lng: 67.842 },
    surkhandarya: { name: 'Сурхандарья', lat: 37.224, lng: 67.278 },
    karakalpakstan: { name: 'Каракалпакстан', lat: 42.46, lng: 59.61 },
  };

  /* ---------- демо-данные (удалить при подключении API) ---------- */
  function demoStations() {
    let seed = 7;
    const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const plan = [['tashkent', 58, .09, .13], ['samarkand', 14, .04, .06], ['fergana', 13, .05, .07], ['kashkadarya', 9, .05, .06], ['navoi', 7, .04, .05],
      ['syrdarya', 6, .05, .06], ['andijan', 5, .04, .05], ['bukhara', 4, .03, .05], ['khorezm', 4, .04, .05]];
    const out = []; let n = 120;
    for (const [key, count, dl, dg] of plan) {
      const c = CITIES[key];
      for (let i = 0; i < count; i++) {
        const r = rnd(), kind = rnd(), total = r < .7 ? 2 : 4;
        const type = kind < .72 ? 'GB/T' : kind < .92 ? 'CCS2' : 'Type 2';
        const kw = type === 'Type 2' ? 22 : r < .5 ? 120 : 60;
        const st = rnd(), status = st < .1 ? 'off' : st < .3 ? 'busy' : 'free';
        const connectors = Array.from({ length: total }, (_, j) => ({
          type: j % 2 && type === 'GB/T' && rnd() < .4 ? 'CCS2' : type, kw,
          status: status === 'off' ? 'off' : status === 'busy' ? 'busy' : (j === 0 || rnd() < .6 ? 'free' : 'busy'),
        }));
        out.push({
          id: 'demo-' + n, name: 'EnerGo ' + n--, city: key,
          address: `Демо-адрес · ${c.name}, точка ${i + 1}`,
          lat: c.lat + (rnd() - .5) * 2 * dl * Math.sqrt(rnd() + .1), lng: c.lng + (rnd() - .5) * 2 * dg * Math.sqrt(rnd() + .1),
          connectors, price: [1800, 2000, 2000, 2200][Math.floor(rnd() * 4)], hours: '24/7',
        });
      }
    }
    return out;
  }

  /* ---------- helpers ---------- */
  const proj = (lat, lng) => [(lng - G.lon0) * G.c * G.k, (G.lat0 - lat) * G.k];
  const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const statusOf = (s) => {
    const f = s.connectors.filter((c) => c.status === 'free').length;
    const off = s.connectors.every((c) => c.status === 'off');
    return { s: off ? 'off' : f ? 'free' : 'busy', free: f, total: s.connectors.length };
  };
  const statusText = (st) => st.s === 'off' ? 'Не работает' : st.s === 'busy' ? `Все заняты · 0 из ${st.total}` : `Свободно ${st.free} из ${st.total}`;
  const routeUrl = (s) => `https://yandex.uz/maps/?rtext=~${s.lat.toFixed(5)},${s.lng.toFixed(5)}&rtt=auto`;
  const dist = (a, b) => { const R = 6371, dLa = (b.lat - a.lat) * Math.PI / 180, dLo = (b.lng - a.lng) * Math.PI / 180; const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };

  /* ---------- state ---------- */
  let all = [], list = [], sel = null, me = null, showAll = false;
  const F = { q: '', city: '', conn: new Set(), free: false };
  const listeners = { select: [] };

  /* ---------- DOM ---------- */
  const mapEl = $('#locMap'), svg = $('#locSvg'), gBase = $('#locBase'), gLab = $('#locLabels'), gMk = $('#locMarks');
  const pop = $('#locPop'), hint = $('#locHint');
  // список станций убран по решению заказчика: карта + фильтры; узлы-заглушки оставляют код списка рабочим
  const ul = $('#locList') || document.createElement('ul'), more = $('#locMore') || document.createElement('button');
  ul.setAttribute('data-lenis-prevent', '');

  // base map
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
  mk('path', { d: G.nb, class: 'nb' }, gBase);
  const regionEls = G.regions.map((r) => mk('path', { d: r.d, class: 'rg', 'data-n': r.n }, gBase));

  /* ---------- view (map units) ---------- */
  const view = { x: G.w / 2, y: G.h / 2, w: G.w };
  let cw = 1, ch = 1;
  const ppu = () => cw / view.w;
  const toScreen = (x, y) => [(x - view.x) * ppu() + cw / 2, (y - view.y) * ppu() + ch / 2];
  const toMap = (sx, sy) => [(sx - cw / 2) / ppu() + view.x, (sy - ch / 2) / ppu() + view.y];
  const clampView = (v) => { v.w = Math.min(G.w * 1.4, Math.max(2.2, v.w)); v.x = Math.min(G.w, Math.max(0, v.x)); v.y = Math.min(G.h, Math.max(0, v.y)); return v; };
  function apply() {
    const h = view.w * ch / cw;
    svg.setAttribute('viewBox', `${view.x - view.w / 2} ${view.y - h / 2} ${view.w} ${h}`);
    drawMarks(); placePop();
  }
  let anim = 0;
  function flyTo(t, ms = 750) {
    cancelAnimationFrame(anim);
    clampView(t);
    const s = { ...view }, t0 = performance.now();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 0;
    const step = (now) => {
      const k = ms ? Math.min(1, (now - t0) / ms) : 1, e = k < .5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      // zoom in log space for a natural feel
      view.w = Math.exp(Math.log(s.w) + (Math.log(t.w) - Math.log(s.w)) * e);
      view.x = s.x + (t.x - s.x) * e; view.y = s.y + (t.y - s.y) * e; apply();
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  function fitPoints(pts, pad = 70, minW = 26) {
    if (!pts.length) return fitAll();
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    const bw = x1 - x0, bh = y1 - y0;
    const w = Math.max(minW, bw * cw / Math.max(1, cw - pad * 2), bh * cw / Math.max(1, ch - pad * 2));
    flyTo({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, w });
  }
  function fitAll(ms) {
    const w = Math.max(G.w * 1.06, G.h * 1.08 * cw / ch);
    flyTo({ x: G.w / 2, y: G.h / 2, w }, ms);
  }

  /* ---------- markers + clustering ---------- */
  function drawMarks() {
    const k = ppu(), inv = 1 / k;
    gMk.textContent = ''; gLab.textContent = '';
    // city labels
    const cities = new Set(list.map((s) => s.city));
    cities.forEach((key) => {
      const c = CITIES[key]; if (!c) return;
      const [x, y] = proj(c.lat, c.lng);
      if (k > 40) return; // hide on deep zoom, markers speak for themselves
      const t = mk('text', { x: 0, y: 0, class: 'cl', transform: `translate(${x} ${y}) scale(${inv})`, dx: 16, dy: -14 }, gLab);
      t.textContent = c.name;
    });
    // greedy clustering in screen space
    const R = 24, pts = list.map((s) => { const p = proj(s.lat, s.lng); return { s, x: p[0], y: p[1], sx: p[0] * k, sy: p[1] * k, used: false }; });
    const groups = [];
    for (const p of pts) {
      if (p.used) continue;
      const g = [p]; p.used = true;
      for (const q of pts) if (!q.used && Math.abs(q.sx - p.sx) < R && Math.abs(q.sy - p.sy) < R) { q.used = true; g.push(q); }
      groups.push(g);
    }
    for (const g of groups) {
      const x = g.reduce((a, p) => a + p.x, 0) / g.length, y = g.reduce((a, p) => a + p.y, 0) / g.length;
      if (g.length === 1) {
        const s = g[0].s, st = statusOf(s);
        const e = mk('g', { class: 'mk' + (sel && sel.id === s.id ? ' sel' : ''), 'data-s': st.s, 'data-id': s.id, transform: `translate(${g[0].x} ${g[0].y}) scale(${inv})`, tabindex: 0, role: 'button', 'aria-label': `${s.name}, ${statusText(st)}` }, gMk);
        mk('circle', { class: 'halo', r: 7 }, e);
        mk('circle', { class: 'c', r: sel && sel.id === s.id ? 9 : 6.5, 'stroke-width': 2.5 }, e);
      } else {
        const free = g.some((p) => statusOf(p.s).s === 'free');
        const r = 13 + Math.min(10, Math.log2(g.length) * 2.4);
        const e = mk('g', { class: 'cs', transform: `translate(${x} ${y}) scale(${inv})`, tabindex: 0, role: 'button', 'aria-label': `${g.length} станций, приблизить` }, gMk);
        mk('circle', { r: r + 5, fill: free ? 'rgb(2 216 102 / .18)' : 'rgb(250 252 240 / .08)', stroke: 'none' }, e);
        mk('circle', { r, 'stroke-width': 2.5, style: free ? '' : 'stroke:#ffb020' }, e);
        mk('text', {}, e).textContent = g.length;
        e._pts = g.map((p) => [p.x, p.y]);
      }
    }
    if (me) {
      const [x, y] = proj(me.lat, me.lng);
      const e = mk('g', { class: 'me', transform: `translate(${x} ${y}) scale(${inv})` }, gMk);
      mk('circle', { r: 16, fill: 'rgb(152 218 247 / .2)' }, e); mk('circle', { r: 7, stroke: '#0e100f', 'stroke-width': 3 }, e);
    }
  }
  gMk.addEventListener('click', (e) => {
    const m = e.target.closest('.mk'), c = e.target.closest('.cs');
    if (m) select(all.find((s) => s.id === m.dataset.id), { fly: false });
    else if (c) fitPoints(c._pts, 90, 3);
  });
  gMk.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });

  /* ---------- popup ---------- */
  function card(s, inPop) {
    const st = statusOf(s), kw = Math.max(...s.connectors.map((c) => c.kw));
    const types = [...new Set(s.connectors.map((c) => c.type))];
    return `${inPop ? '<button class="x" type="button" aria-label="Закрыть">×</button>' : ''}
      <div class="st__top"><span class="kw">${kw}<small>кВт</small></span><div><div class="st__name">${esc(s.name)}</div><div class="st__stat"><i></i>${statusText(st)}</div></div></div>
      <div class="st__addr">${esc(s.address)}${me ? ` · ${dist(me, s).toFixed(1)} км` : ''}</div>
      <div class="st__row"><div class="tags">${types.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div><span class="st__price"><b>${fmt(s.price)}</b> сум/кВт·ч</span></div>
      <div class="st__acts">${inPop ? `<button type="button" data-act="app">В приложении</button>` : `<button type="button" data-act="show">На карте</button>`}<a class="${inPop ? 'go' : ''}" href="${routeUrl(s)}" target="_blank" rel="noopener">Маршрут ↗</a></div>`;
  }
  function placePop() {
    if (!sel) return;
    const [x, y] = proj(sel.lat, sel.lng), [sx, sy] = toScreen(x, y);
    const w = pop.offsetWidth / 2;
    pop.style.left = Math.min(cw - w - 8, Math.max(w + 8, sx)) + 'px';
    pop.style.top = Math.max(pop.offsetHeight + 26, sy) + 'px';
    pop.classList.toggle('is-open', sx > -20 && sx < cw + 20 && sy > -20 && sy < ch + 20);
  }
  pop.addEventListener('click', (e) => {
    if (e.target.closest('.x')) return select(null);
    const a = e.target.closest('[data-act="app"]');
    if (a) {
      if (sel && sel.appUrl) return void open(sel.appUrl, '_blank');
      const j = document.querySelector('a[data-jump]'); j && j.click();
    }
  });

  /* ---------- selection ---------- */
  function select(s, { fly = true, scrollList = true } = {}) {
    sel = s || null;
    $$('.st', ul).forEach((li) => li.classList.toggle('is-sel', !!sel && li.dataset.id === sel.id));
    if (!sel) { pop.classList.remove('is-open'); drawMarks(); return; }
    pop.innerHTML = card(sel, true); pop.dataset.s = statusOf(sel).s;
    if (fly) { const [x, y] = proj(sel.lat, sel.lng); flyTo({ x, y: y - 1.2, w: Math.min(view.w, 18) }); } else { drawMarks(); placePop(); }
    if (scrollList) { const li = ul.querySelector(`[data-id="${CSS.escape(sel.id)}"]`); li && li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    listeners.select.forEach((f) => f(sel));
  }

  /* ---------- list + filters ---------- */
  function applyFilters({ refit = true } = {}) {
    const q = F.q.trim().toLowerCase();
    list = all.filter((s) => {
      if (F.city && s.city !== F.city) return false;
      if (F.free && statusOf(s).s !== 'free') return false;
      if (F.conn.size && !s.connectors.some((c) => F.conn.has(c.type))) return false;
      if (q && !(`${s.name} ${s.address} ${(CITIES[s.city] || {}).name || ''}`.toLowerCase().includes(q))) return false;
      return true;
    });
    if (me) list.sort((a, b) => dist(me, a) - dist(me, b));
    $('#locCount').textContent = list.length || 'Ничего не';
    { const n = list.length % 100, d = n % 10; $('#locCountL').textContent = !list.length ? 'найдено' : n > 10 && n < 20 ? 'станций' : d === 1 ? 'станция' : d > 1 && d < 5 ? 'станции' : 'станций'; }
    ul.innerHTML = list.length ? list.map((s) => `<li class="st${sel && sel.id === s.id ? ' is-sel' : ''}" data-id="${esc(s.id)}" data-s="${statusOf(s).s}">${card(s, false)}</li>`).join('')
      : '<li class="loc__empty">Ничего не нашли. Попробуйте другой город или сбросьте фильтры.</li>';
    ul.classList.toggle('all', showAll);
    more.hidden = showAll || list.length <= 5;
    more.textContent = `Показать все ${list.length}`;
    regionEls.forEach((r) => r.classList.toggle('on', !!F.city && r.dataset.n.startsWith((CITIES[F.city] || {}).name || '#')));
    if (sel && !list.includes(sel)) select(null);
    if (refit) fitPoints(list.map((s) => proj(s.lat, s.lng)), 80, F.city ? 8 : 26); else drawMarks();
  }
  ul.addEventListener('click', (e) => {
    const li = e.target.closest('.st'); if (!li || e.target.closest('a')) return;
    select(all.find((s) => s.id === li.dataset.id), { scrollList: false });
    if (matchMedia('(max-width:1023px)').matches) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  more.addEventListener('click', () => { showAll = true; ul.classList.add('all'); more.hidden = true; });

  function buildCities() {
    const counts = {}; all.forEach((s) => { counts[s.city] = (counts[s.city] || 0) + 1; });
    const keys = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    $('#locCities').innerHTML = `<button class="chip" type="button" data-city="" aria-pressed="${!F.city}">Все <small>${all.length}</small></button>` +
      keys.map((k) => `<button class="chip" type="button" data-city="${k}" aria-pressed="${F.city === k}">${esc((CITIES[k] || { name: k }).name)} <small>${counts[k]}</small></button>`).join('');
  }
  $('#locCities').addEventListener('click', (e) => {
    const b = e.target.closest('[data-city]'); if (!b) return;
    F.city = b.dataset.city; $$('#locCities .chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
    showAll = false; applyFilters();
  });
  $$('[data-conn]').forEach((b) => b.addEventListener('click', () => {
    const t = b.dataset.conn; F.conn.has(t) ? F.conn.delete(t) : F.conn.add(t);
    b.setAttribute('aria-pressed', F.conn.has(t)); applyFilters();
  }));
  $('#locFree').addEventListener('click', (e) => { F.free = !F.free; e.currentTarget.setAttribute('aria-pressed', F.free); applyFilters({ refit: false }); });
  let qt; $('#locQ').addEventListener('input', (e) => { F.q = e.target.value; clearTimeout(qt); qt = setTimeout(applyFilters, 220); });

  $('#locNear').addEventListener('click', () => {
    const say = (m) => { const t = document.getElementById('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3200); };
    const done = (lat, lng, real) => {
      me = { lat, lng }; F.city = ''; buildCities(); applyFilters({ refit: false });
      const near = list.slice(0, 3).map((s) => proj(s.lat, s.lng)); near.push(proj(lat, lng));
      fitPoints(near, 90, 3); if (!real) say('Геолокация недоступна, показываем от центра Ташкента');
    };
    if (!navigator.geolocation) return done(41.311, 69.279, false);
    navigator.geolocation.getCurrentPosition((p) => done(p.coords.latitude, p.coords.longitude, true), () => done(41.311, 69.279, false), { timeout: 8000, maximumAge: 60000 });
  });

  /* ---------- gestures ---------- */
  const ptrs = new Map(); let last = null, moved = 0;
  mapEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.pop, .loc__zoom')) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0;
    last = null;
  });
  mapEl.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    cancelAnimationFrame(anim);
    if (ptrs.size === 1) {
      const dx = e.clientX - prev[0], dy = e.clientY - prev[1]; moved += Math.abs(dx) + Math.abs(dy);
      // capture only once it is a real drag, so a plain click still reaches the marker under the cursor
      if (moved > 4 && e.pointerType === 'mouse' && !mapEl.hasPointerCapture(e.pointerId)) { mapEl.setPointerCapture(e.pointerId); mapEl.classList.add('grabbing'); }
      view.x -= dx / ppu(); view.y -= dy / ppu(); clampView(view); apply();
    } else if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const r = mapEl.getBoundingClientRect(), mx = (a[0] + b[0]) / 2 - r.left, my = (a[1] + b[1]) / 2 - r.top;
      if (last) zoomAt(mx, my, last / d);
      last = d; moved = 99;
    }
  });
  const up = (e) => { ptrs.delete(e.pointerId); last = null; mapEl.classList.remove('grabbing'); };
  mapEl.addEventListener('pointerup', up); mapEl.addEventListener('pointercancel', up);
  mapEl.addEventListener('click', (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
  function zoomAt(sx, sy, f) {
    const [mx, my] = toMap(sx, sy);
    view.w *= f; clampView(view);
    const [nx, ny] = toMap(sx, sy); view.x += mx - nx; view.y += my - ny; apply();
  }
  let ht;
  mapEl.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) { hint.classList.add('is-open'); clearTimeout(ht); ht = setTimeout(() => hint.classList.remove('is-open'), 1400); return; }
    e.preventDefault(); cancelAnimationFrame(anim);
    const r = mapEl.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(e.deltaY * .0025));
  }, { passive: false });
  mapEl.addEventListener('dblclick', (e) => { const r = mapEl.getBoundingClientRect(); const [x, y] = toMap(e.clientX - r.left, e.clientY - r.top); flyTo({ x, y, w: view.w / 2.2 }, 450); });
  $('#locIn').addEventListener('click', () => flyTo({ ...view, w: view.w / 1.8 }, 450));
  $('#locOut').addEventListener('click', () => flyTo({ ...view, w: view.w * 1.8 }, 450));
  $('#locAll').addEventListener('click', () => { select(null); fitAll(); });

  new ResizeObserver(() => { const r = mapEl.getBoundingClientRect(); if (!r.width) return; const first = cw === 1; cw = r.width; ch = r.height; if (first) fitAll(0); else apply(); }).observe(mapEl);

  /* ---------- public API ---------- */
  window.EnerGoLocations = {
    /** Заменить на API действующей карты приложения. Должна вернуть Promise<Station[]>. */
    fetchStations: async () => demoStations(),
    setStations(stations) {
      all = (stations || []).filter((s) => s && isFinite(s.lat) && isFinite(s.lng) && Array.isArray(s.connectors));
      const keepSel = sel && all.find((s) => s.id === sel.id); sel = keepSel || null;
      buildCities(); applyFilters({ refit: false });
      if (sel) { pop.innerHTML = card(sel, true); placePop(); }
    },
    getStations: () => all.slice(),
    focus(id) { const s = all.find((x) => x.id === id); s && select(s); },
    fitAll: () => fitAll(),
    cities: CITIES,
    on(evt, cb) { (listeners[evt] = listeners[evt] || []).push(cb); },
  };
  window.EnerGoLocations.fetchStations().then((s) => window.EnerGoLocations.setStations(s));
})();
