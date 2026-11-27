/* EnerGo — «Как стать партнёром».
   Точка интеграции: window.EnerGoPartner.submit(data) → Promise. Сейчас демо: ничего не отправляет.
   Для продакшена заменить на отправку в CRM, например fetch('/api/partner-lead', { method: 'POST', body: JSON.stringify(data) }). */
(() => {
  const root = document.getElementById('partner');
  if (!root) return;
  const $ = (s) => root.querySelector(s), $$ = (s) => [...root.querySelectorAll(s)];
  const form = $('#pfForm'), card = $('#pfCard'), plan = $('#ptPlan');

  window.EnerGoPartner = window.EnerGoPartner || { submit: async (data) => { console.info('[demo] partner lead', data); await new Promise((r) => setTimeout(r, 700)); return { ok: true, demo: true }; } };

  function setFormat(f) {
    root.dataset.f = f; plan.dataset.f = f;
    $$('.fmt__opt').forEach((b) => b.setAttribute('aria-checked', b.dataset.f === f));
    const r = form.querySelector(`input[name="format"][value="${f}"]`); if (r) r.checked = true;
    $$('[data-only]').forEach((el) => { el.hidden = el.dataset.only !== f; });
    $$('#ptSteps [data-station]').forEach((el) => { el.textContent = el.dataset[f]; });
  }
  $$('.fmt__opt').forEach((b) => b.addEventListener('click', () => setFormat(b.dataset.f)));
  form.addEventListener('change', (e) => { if (e.target.name === 'format') setFormat(e.target.value); });
  setFormat('station');

  /* steps: the line fills as the block scrolls through the viewport */
  const steps = $('#ptSteps'), line = steps.querySelector('.steps4__line'), lis = $$('#ptSteps li');
  const tick = () => {
    const r = steps.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .25)));
    line.style.setProperty('--p', p.toFixed(3));
    lis.forEach((li, i) => li.classList.toggle('on', p >= i / (lis.length - 1) - .02));
  };
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();

  /* form */
  const phoneOk = (v) => /^\+?998[\s\d()-]{9,16}$/.test(v.trim()) && v.replace(/\D/g, '').length === 12;
  form.addEventListener('input', (e) => e.target.classList && e.target.classList.remove('bad'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.elements.name, phone = form.elements.phone, consent = form.elements.consent;
    let bad = null;
    if (!name.value.trim()) { name.classList.add('bad'); bad = bad || name; }
    if (!phoneOk(phone.value)) { phone.classList.add('bad'); bad = bad || phone; }
    if (bad) { bad.focus(); return; }
    if (!consent.checked) { consent.focus(); consent.closest('.consent').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
    const data = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.style.opacity = .7;
    try { await window.EnerGoPartner.submit(data); card.classList.add('sent'); }
    finally { btn.disabled = false; btn.style.opacity = ''; }
  });
  $('#pfAgain').addEventListener('click', () => { form.reset(); form.elements.phone.value = '+998 '; setFormat(root.dataset.f); card.classList.remove('sent'); });
})();
