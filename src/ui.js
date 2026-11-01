export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const rupiah = (n) => 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const tglPendek = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${BULAN[m - 1] || ''} ${y}`;
};
const BULAN_PANJANG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const bulanPanjang = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return `${BULAN_PANJANG[m - 1]} ${y}`;
};

const P = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z"/>',
  heart: '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.800-8 11-8 11z"/>',
  grid: '<circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  news: '<path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7M9 8h3"/>',
  mosque: '<path d="M12 3c0 2-3 3-3 6h6c0-3-3-4-3-6zM6 21V12l3-3M18 21V12l-3-3M4 21h16M10 21v-4a2 2 0 0 1 4 0v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  moon: '<path d="M20 14.500A8 8 0 1 1 9.500 4 6.500 6.500 0 0 0 20 14.500z"/>',
  sunrise: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v4M5 9l2 2M19 9l-2 2"/>',
  bank: '<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
  qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-4M14 18h2"/>',
  doc: '<path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7"/>',
  phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s7-6.200 7-12a7 7 0 0 0-14 0c0 5.800 7 12 7 12z"/><circle cx="12" cy="9" r="2.500"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  out: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8h.01"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/>',
};
export const icon = (n, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------- toast ---------- */
let toastTimer;
export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- modal ---------- */
export function closeModal() { document.getElementById('modal-root').innerHTML = ''; }
export function openModal(html, onMount) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="overlay" data-close><div class="sheet" role="dialog">${html}</div></div>`;
  const ov = root.querySelector('.overlay');
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close-btn]')) closeModal(); });
  if (onMount) onMount(root.querySelector('.sheet'));
}

export function confirmBox(text) {
  return new Promise((resolve) => {
    openModal(`<h3>Konfirmasi</h3><p>${esc(text)}</p>
      <div class="row end"><button class="btn ghost" data-close-btn>Batal</button><button class="btn danger" id="cf-yes">Ya, hapus</button></div>`,
      (el) => { el.querySelector('#cf-yes').onclick = () => { closeModal(); resolve(true); }; el.querySelector('[data-close-btn]').addEventListener('click', () => resolve(false)); });
  });
}

/* ---------- gambar -> data URL (dikecilkan agar muat di Firestore) ---------- */
export function fileToDataUrl(file, max = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Gambar tidak bisa dibaca'));
    img.src = url;
  });
}

/* ---------- form generik untuk admin ---------- */
export function openForm({ title, fields, values = {}, onSave, onDelete }) {
  const inputs = fields.map((f) => {
    const v = values[f.key] ?? f.default ?? '';
    const id = 'f-' + f.key;
    let ctl;
    if (f.type === 'textarea') ctl = `<textarea id="${id}" rows="${f.rows || 4}">${esc(v)}</textarea>`;
    else if (f.type === 'select') ctl = `<select id="${id}">${f.options.map(([val, lab]) => `<option value="${esc(val)}" ${val === v ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
    else if (f.type === 'image') ctl = `<div class="imgpick"><img id="${id}-prev" src="${esc(v)}" ${v ? '' : 'hidden'} alt=""><input type="hidden" id="${id}" value="${esc(v)}"><label class="btn ghost small">Pilih foto<input type="file" accept="image/*" id="${id}-file" hidden></label><button type="button" class="btn ghost small" id="${id}-clr">Hapus</button></div>`;
    else ctl = `<input id="${id}" type="${f.type || 'text'}" value="${esc(v)}" ${f.step ? `step="${f.step}"` : ''} ${f.list ? `list="${id}-dl"` : ''} inputmode="${f.type === 'number' ? 'decimal' : 'text'}">${f.list ? `<datalist id="${id}-dl">${f.list.map((o) => `<option value="${esc(o)}">`).join('')}</datalist>` : ''}`;
    return `<label class="field"><span>${esc(f.label)}</span>${ctl}${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</label>`;
  }).join('');

  openModal(`<h3>${esc(title)}</h3><form id="gform">${inputs}
    <div class="row end">
      ${onDelete ? '<button type="button" class="btn danger" id="f-del">Hapus</button>' : ''}
      <span class="grow"></span>
      <button type="button" class="btn ghost" data-close-btn>Batal</button>
      <button type="submit" class="btn" id="f-save">Simpan</button>
    </div></form>`, (el) => {
    fields.filter((f) => f.type === 'image').forEach((f) => {
      const id = 'f-' + f.key;
      const hid = el.querySelector('#' + id), prev = el.querySelector(`#${id}-prev`);
      el.querySelector(`#${id}-file`).onchange = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        try { hid.value = await fileToDataUrl(file); prev.src = hid.value; prev.hidden = false; } catch (err) { toast(err.message); }
      };
      el.querySelector(`#${id}-clr`).onclick = () => { hid.value = ''; prev.hidden = true; };
    });
    if (onDelete) el.querySelector('#f-del').onclick = async () => { if (await confirmBox('Hapus data ini?')) { try { await onDelete(); closeModal(); toast('Terhapus'); } catch (e) { toast(e.message); } } };
    el.querySelector('#gform').onsubmit = async (e) => {
      e.preventDefault();
      const out = { ...values };
      for (const f of fields) {
        let v = el.querySelector('#f-' + f.key).value;
        if (f.type === 'number') v = Number(v) || 0;
        if (f.required && !String(v).trim()) { toast(`${f.label} wajib diisi`); return; }
        out[f.key] = typeof v === 'string' ? v.trim() : v;
      }
      const btn = el.querySelector('#f-save'); btn.disabled = true; btn.textContent = 'Menyimpan…';
      try { await onSave(out); closeModal(); toast('Tersimpan'); } catch (err) { toast(err.message || 'Gagal menyimpan'); btn.disabled = false; btn.textContent = 'Simpan'; }
    };
  });
}
