import './styles.css';
import { init, subscribe, state } from './store.js';
import { icon, esc } from './ui.js';
import { scheduleAdzan, adzanOn } from './notif.js';
import { ROUTES, handleClick, handleChange, tickBeranda, applyTema } from './views.js';

const app = document.getElementById('app');
const NAV = [['beranda', 'Beranda', 'home'], ['shalat', 'Shalat', 'mosque'], ['dakwah', 'Dakwah', 'book'], ['donasi', 'Donasi', 'heart'], ['lainnya', 'Lainnya', 'grid']];
let timer, scheduled = false;

function route() {
  const k = location.hash.replace(/^#\//, '') || 'beranda';
  return ROUTES[k] ? k : 'beranda';
}

function render() {
  const key = route(), r = ROUTES[key];
  const scrollY = document.querySelector('main')?.scrollTop || 0;
  if (state.ready && !scheduled && adzanOn()) { scheduled = true; scheduleAdzan(state.config).catch(() => {}); }
  if (!state.ready) { app.innerHTML = '<div class="loading">Memuat…</div>'; return; }
  app.innerHTML = `
    ${r.hero ? '' : `<header class="bar"><button class="back" data-go="${r.nav === 'lainnya' && key !== 'lainnya' ? 'lainnya' : 'beranda'}" aria-label="Kembali">${icon('back')}</button><h1>${esc(r.title)}</h1>${state.admin ? '<span class="admin-pill">Admin</span>' : ''}</header>`}
    <main class="${r.hero ? 'with-hero' : ''}">${r.view()}</main>
    <nav class="tabbar">${NAV.map(([k, l, i]) => `<a href="#/${k}" class="${r.nav === k ? 'on' : ''}">${icon(i)}<span>${l}</span></a>`).join('')}</nav>`;
  document.querySelector('main').scrollTop = scrollY;
  clearInterval(timer);
  if (key === 'beranda') timer = setInterval(tickBeranda, 1000);
}

window.addEventListener('hashchange', () => { render(); document.querySelector('main')?.scrollTo(0, 0); });
window.addEventListener('rerender', render);
subscribe(render);
document.addEventListener('click', (e) => {
  if (e.target.closest('#modal-root')) return;
  const r = handleClick(e);
  if (r === 'rerender') render();
});
document.addEventListener('change', (e) => { if (handleChange(e)) render(); });

applyTema();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTema);
init();
render();
