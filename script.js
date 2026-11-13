// ===== Nastavení autora – uprav si tyto údaje =====
const CONFIG = {
  author: 'Vojtěch Skoták',
  school: 'Integrovaná střední škola Hodonín, obor Tesař, 2. ročník',
  schoolYear: '2026/2027',
  instagram: '' // uživatelské jméno bez @, např. 'vojta_skotak'
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Údaje o autorovi
$$('[data-author]').forEach(e => (e.textContent = CONFIG.author));
$$('[data-school]').forEach(e => (e.textContent = CONFIG.school));
$('#schoolYear').textContent = CONFIG.schoolYear;
$('#yr').textContent = $('#yr2').textContent = new Date().getFullYear();
if (CONFIG.instagram) {
  $('#instaLink').href = 'https://www.instagram.com/' + encodeURIComponent(CONFIG.instagram) + '/';
  $('#instaText').textContent = '@' + CONFIG.instagram;
}
document.title = `BSH desky – ${CONFIG.author} | Tesař 2. ročník`;

// Tmavý režim
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
$('#themeBtn').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  $('#themeBtn i').className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Mobilní menu
const nav = $('#nav'), btn = $('#menuBtn');
btn.addEventListener('click', () => btn.setAttribute('aria-expanded', nav.classList.toggle('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });

// Ukazatel čtení
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// Zvýraznění aktivní sekce v menu
const links = $$('#nav a');
new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' }).observe && $$('main section[id]').forEach(s =>
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + s.id));
  }), { rootMargin: '-45% 0px -50% 0px' }).observe(s));

// Počítadla
const fmt = (n, d) => n.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
const counter = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  counter.unobserve(e.target);
  const el = e.target, to = +el.dataset.count, d = +(el.dataset.dec || 0), t0 = performance.now();
  const tick = t => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = (d ? fmt(to * p, d) : Math.round(to * p));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: .6 });
$$('[data-count]').forEach(el => counter.observe(el));

// Kalkulačka lamel
const nIn = $('#nIn'), tIn = $('#tIn'), layers = $('#layers');
function calc() {
  const n = +nIn.value, t = +tIn.value, h = n * t;
  $('#nOut').textContent = n;
  $('#hOut').textContent = h + ' mm';
  $('#hNote').textContent = h > 2000 ? '(nad 2 m – výjimečný prvek)' : h > 1000 ? '(velký vazník)' : h >= 200 ? '(běžný nosník)' : '(malý průřez)';
  layers.innerHTML = '<i style="height:' + Math.max(240 / n, 5) + 'px"></i>'.repeat(n);
}
nIn.addEventListener('input', calc); tIn.addEventListener('change', calc); calc();