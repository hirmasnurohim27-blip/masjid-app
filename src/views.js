import { state, saveItem, removeItem, saveConfig, login, logout, seed, useFirebase } from './store.js';
import { esc, icon, rupiah, tglPendek, bulanPanjang, openModal, closeModal, openForm, toast } from './ui.js';
import { FORMS } from './forms.js';
import { notifSupported, adzanOn, toggleAdzan } from './notif.js';
import { timesFor, fmtTime, nextPrayer, fmtMasehi, fmtHijri, countdown } from './prayer.js';

const byTanggalDesc = (a, b) => String(b.tanggal || '').localeCompare(String(a.tanggal || ''));
const adminOnly = (html) => (state.admin ? html : '');
const editBtn = (col, id) => adminOnly(`<button class="edit-btn" data-edit="${col}:${id}" aria-label="Edit">${icon('edit')}</button>`);
const addBtn = (col, label) => adminOnly(`<button class="btn add" data-add="${col}">${icon('plus')} ${esc(label)}</button>`);
const waLink = (num, text = '') => {
  let n = String(num || '').replace(/\D/g, '');
  if (n.startsWith('0')) n = '62' + n.slice(1);
  return `https://wa.me/${n}${text ? '?text=' + encodeURIComponent(text) : ''}`;
};

const MOSQUE_SVG = `<svg viewBox="0 0 400 200" class="mosque-art" aria-hidden="true"><g fill="rgba(255,255,255,.18)"><rect x="40" y="110" width="320" height="90"/><path d="M200 40c0 22-34 30-34 66h68c0-36-34-44-34-66z"/><rect x="60" y="60" width="18" height="140"/><path d="M69 36l10 24H59z"/><rect x="322" y="60" width="18" height="140"/><path d="M331 36l10 24h-20z"/></g></svg>`;

/* ============ BERANDA ============ */
function berandaView() {
  const c = state.config, now = new Date();
  const nx = nextPrayer(now, c);
  const heroStyle = c.foto ? `style="background-image:linear-gradient(180deg,rgba(6,70,45,.55),rgba(6,70,45,.15)),url('${c.foto}')"` : '';
  const menu = [
    ['shalat', 'Jadwal Shalat', 'mosque', 'g1'], ['dakwah', 'Dakwah', 'book', 'g2'], ['donasi', 'Donasi', 'heart', 'g3'],
    ['keuangan', 'Keuangan', 'chart', 'g4'], ['berita', 'Berita & Info', 'news', 'g5'], ['profil', 'Profil Masjid', 'mosque', 'g6'],
  ];
  return `
  <section class="hero ${c.foto ? 'has-photo' : ''}" ${heroStyle}>
    ${c.foto ? '' : MOSQUE_SVG}
    <div class="hero-top"><div class="logo">${icon('mosque')}</div>
      <div class="hero-txt"><h1>${esc(c.nama)}</h1><h2>${esc(c.lokasi)}</h2><p>${esc(c.tagline)}</p></div>
      <button class="bell" data-go="pengaturan" aria-label="Pengaturan">${icon('bell')}</button></div>
  </section>
  <div class="pad pull">
    <div class="card next">
      <div class="date-line">${icon('clock')}<div><b>${esc(fmtMasehi(now, c.zona))}</b><small>${esc(fmtHijri(now, c.hijriKoreksi))}</small></div></div>
      <div class="next-row"><div class="next-ic">${icon('mosque')}</div>
        <div class="grow"><small>Waktu Shalat Berikutnya</small><b id="np-name">${esc(nx.nama)}</b><div class="cd" id="np-cd">${countdown(nx.time - now)}</div></div>
        <button class="btn outline" data-go="shalat">Lihat Jadwal</button></div>
    </div>
    <div class="menu-grid">${menu.map(([r, l, i, g]) => `<button class="menu-item" data-go="${r}"><span class="mi ${g}">${icon(i)}</span><span>${l}</span></button>`).join('')}</div>
    <div class="card quote"><div><h3>"${esc(c.ajakJudul)}"</h3><p>"${esc(c.ajakIsi)}"</p><small>(${esc(c.ajakSumber)})</small></div></div>
  </div>`;
}
export function tickBeranda() {
  const a = document.getElementById('np-cd'); if (!a) return false;
  const c = state.config, now = new Date(), nx = nextPrayer(now, c);
  document.getElementById('np-name').textContent = nx.nama;
  a.textContent = countdown(nx.time - now);
  return true;
}

/* ============ JADWAL SHALAT ============ */
let shalatTab = 'hari';
function shalatView() {
  const c = state.config, now = new Date();
  const tabs = [['hari', 'Hari Ini'], ['7', '7 Hari'], ['30', '30 Hari']];
  let body;
  if (shalatTab === 'hari') {
    const list = timesFor(now, c);
    const nx = nextPrayer(now, c);
    const ic = { imsak: 'clock', subuh: 'sunrise', terbit: 'sun', dhuhur: 'mosque', ashar: 'sun', maghrib: 'sunrise', isya: 'moon' };
    body = `<div class="card date-pill"><b>${esc(fmtMasehi(now, c.zona))}</b><small>${esc(fmtHijri(now, c.hijriKoreksi))}</small></div>
      <ul class="times">${list.map((t) => `<li class="${t.key === nx.key && t.wajib ? 'on' : ''}">${icon(ic[t.key])}<span class="grow">${t.nama}</span><b>${fmtTime(t.time, c.zona)}</b></li>`).join('')}</ul>`;
  } else {
    const n = shalatTab === '7' ? 7 : 30;
    const rows = [];
    for (let i = 0; i < n; i++) {
      const d = new Date(now.getTime() + i * 864e5);
      const t = Object.fromEntries(timesFor(d, c).map((x) => [x.key, fmtTime(x.time, c.zona)]));
      rows.push(`<tr class="${i === 0 ? 'on' : ''}"><td>${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: c.zona }).format(d)}</td><td>${t.subuh}</td><td>${t.dhuhur}</td><td>${t.ashar}</td><td>${t.maghrib}</td><td>${t.isya}</td></tr>`);
    }
    body = `<div class="card tbl"><table><thead><tr><th>Tgl</th><th>Subuh</th><th>Dhuhur</th><th>Ashar</th><th>Maghrib</th><th>Isya</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }
  return `<div class="pad">
    <div class="chips">${tabs.map(([k, l]) => `<button class="chip ${shalatTab === k ? 'on' : ''}" data-shalat-tab="${k}">${l}</button>`).join('')}</div>
    <div class="loc">${icon('pin')}<div class="grow"><b>${esc(c.lokasi)}</b><small>${esc(c.alamat)}</small></div></div>
    ${body}
    <div class="card note">${icon('mosque')}<p>${esc(c.shalatMotivasi)}</p></div>
    ${adminOnly(`<button class="btn add" data-edit="pengaturan:config">${icon('edit')} Atur lokasi & koreksi waktu</button>`)}
  </div>`;
}

/* ============ DAKWAH ============ */
let dakwahFilter = 'Semua';
function thumb(img, tipe) {
  return `<div class="thumb ${img ? '' : 'ph'}" ${img ? `style="background-image:url('${img}')"` : ''}>${img ? '' : icon(tipe === 'Artikel' ? 'doc' : 'play')}</div>`;
}
function dakwahView() {
  const f = ['Semua', 'Video', 'Artikel', 'Kajian'];
  const list = state.dakwah.filter((x) => dakwahFilter === 'Semua' || x.tipe === dakwahFilter).sort(byTanggalDesc);
  return `<div class="pad">
    <div class="chips">${f.map((k) => `<button class="chip ${dakwahFilter === k ? 'on' : ''}" data-dakwah-f="${k}">${k}</button>`).join('')}</div>
    ${addBtn('dakwah', 'Tambah konten')}
    ${list.length ? list.map((x) => `<article class="card post" data-open="dakwah:${x.id}">${thumb(x.gambar, x.tipe)}
      <div class="post-b"><b>${esc(x.judul)}</b><div class="meta"><span>${tglPendek(x.tanggal)}</span><span class="tag">${esc(x.tipe)}</span>${x.durasi ? `<span class="dur">${icon('play')}${esc(x.durasi)}</span>` : ''}</div></div>${editBtn('dakwah', x.id)}</article>`).join('') : '<p class="empty">Belum ada konten.</p>'}
  </div>`;
}

/* ============ DONASI ============ */
let semuaRek = false;
function donasiView() {
  const c = state.config;
  const rek = semuaRek ? state.rekening : state.rekening.slice(0, 2);
  return `<div class="pad">
    <div class="banner">${icon('heart')}<h2>Berbagi Untuk Masjid Dan Umat</h2></div>
    <h3 class="sec">Metode Donasi</h3>
    <div class="methods">
      <button data-act="scroll-rek"><span>${icon('bank')}</span>Transfer Bank</button>
      <button data-act="qris"><span>${icon('qr')}</span>QRIS</button>
      <button data-act="konfirmasi"><span>${icon('doc')}</span>Konfirmasi Manual</button>
    </div>
    <h3 class="sec" id="rek-sec">Rekening Donasi</h3>
    ${addBtn('rekening', 'Tambah rekening')}
    ${rek.map((r) => `<div class="card rek"><div class="bank-badge">${esc((r.bank.match(/\(([^)]+)\)/)?.[1] || r.bank).slice(0, 4))}</div>
      <div class="grow"><small>${esc(r.bank)}</small><b>${esc(r.nomor)}</b><small>a.n ${esc(r.atasNama)}</small></div>
      <button class="icon-btn" data-copy="${esc(r.nomor)}" aria-label="Salin">${icon('copy')}</button>${editBtn('rekening', r.id)}</div>`).join('')}
    ${state.rekening.length > 2 ? `<button class="btn outline block" data-act="toggle-rek">${semuaRek ? 'Sembunyikan' : 'Lihat Semua Rekening'}</button>` : ''}
    <p class="verse">"${esc(c.kutipanDonasi)}"</p>
  </div>`;
}

/* ============ KEUANGAN ============ */
let bulan = new Date().toISOString().slice(0, 7);
function keuanganView() {
  const tr = state.transaksi;
  const inMonth = tr.filter((x) => String(x.tanggal).startsWith(bulan));
  const masuk = inMonth.filter((x) => x.jenis === 'masuk'), keluar = inMonth.filter((x) => x.jenis === 'keluar');
  const sum = (a) => a.reduce((s, x) => s + (+x.jumlah || 0), 0);
  const tM = sum(masuk), tK = sum(keluar);
  const endOfMonth = bulan + '-31';
  const saldo = tr.filter((x) => String(x.tanggal) <= endOfMonth).reduce((s, x) => s + (x.jenis === 'masuk' ? 1 : -1) * (+x.jumlah || 0), 0);
  const group = (a) => { const g = {}; a.forEach((x) => { g[x.kategori] = (g[x.kategori] || 0) + (+x.jumlah || 0); }); return Object.entries(g).sort((p, q) => q[1] - p[1]); };
  const bars = (a, total, cls) => group(a).map(([k, v]) => `<div class="bar"><div class="bar-h"><span>${esc(k)}</span><b>${rupiah(v)}</b></div><div class="track"><i class="${cls}" style="width:${total ? Math.round((v / total) * 100) : 0}%"></i></div><small>${total ? Math.round((v / total) * 100) : 0}%</small></div>`).join('') || '<p class="empty small">Belum ada data.</p>';
  return `<div class="pad">
    <div class="row between"><h3 class="sec">Ringkasan Keuangan</h3><input type="month" class="month" id="bulan" value="${bulan}"></div>
    <div class="sum-grid">
      <div class="sum s-in">${icon('plus')}<small>Pemasukan</small><b>${rupiah(tM)}</b></div>
      <div class="sum s-out">${icon('out')}<small>Pengeluaran</small><b>${rupiah(tK)}</b></div>
      <div class="sum s-bal">${icon('bank')}<small>Saldo</small><b>${rupiah(saldo)}</b></div>
      <div class="sum s-rep">${icon('doc')}<small>Laporan</small><b>${esc(bulanPanjang(bulan))}</b></div>
    </div>
    <h3 class="sec">Kategori Pemasukan</h3><div class="card">${bars(masuk, tM, 'in')}</div>
    <h3 class="sec">Kategori Pengeluaran</h3><div class="card">${bars(keluar, tK, 'out')}</div>
    <div class="row between"><h3 class="sec">Rincian Transaksi</h3></div>
    ${addBtn('transaksi', 'Tambah transaksi')}
    ${inMonth.sort(byTanggalDesc).map((x) => `<div class="card trx"><div class="grow"><b>${esc(x.kategori)}</b><small>${tglPendek(x.tanggal)}${x.keterangan ? ' · ' + esc(x.keterangan) : ''}</small></div><b class="${x.jenis === 'masuk' ? 'pos' : 'neg'}">${x.jenis === 'masuk' ? '+' : '−'}${rupiah(x.jumlah)}</b>${editBtn('transaksi', x.id)}</div>`).join('') || '<p class="empty">Belum ada transaksi bulan ini.</p>'}
  </div>`;
}

/* ============ BERITA ============ */
let beritaFilter = 'Semua';
function beritaView() {
  const f = ['Semua', 'Pengumuman', 'Kegiatan', 'Berita'];
  const list = state.berita.filter((x) => beritaFilter === 'Semua' || x.kategori === beritaFilter).sort(byTanggalDesc);
  return `<div class="pad">
    <div class="chips">${f.map((k) => `<button class="chip ${beritaFilter === k ? 'on' : ''}" data-berita-f="${k}">${k}</button>`).join('')}</div>
    ${addBtn('berita', 'Tambah berita')}
    ${list.length ? list.map((x) => `<article class="card post" data-open="berita:${x.id}">${thumb(x.gambar, 'Artikel')}
      <div class="post-b"><b>${esc(x.judul)}</b><div class="meta"><span>${tglPendek(x.tanggal)}</span><span class="tag k-${esc(x.kategori)}">${esc(x.kategori)}</span></div></div>${editBtn('berita', x.id)}</article>`).join('') : '<p class="empty">Belum ada berita.</p>'}
  </div>`;
}

/* ============ PROFIL ============ */
function profilView() {
  const c = state.config;
  const row = (ic, k, v) => `<div class="prow">${icon(ic)}<div><small>${k}</small><b>${esc(v)}</b></div></div>`;
  return `<div class="profil-hero ${c.foto ? '' : 'noimg'}" ${c.foto ? `style="background-image:url('${c.foto}')"` : ''}>${c.foto ? '' : MOSQUE_SVG}</div>
  <div class="pad">
    <div class="center"><h2>${esc(c.nama)}</h2><small>${esc(c.lokasi)}</small></div>
    ${adminOnly(`<button class="btn add" data-edit="profil:config">${icon('edit')} Edit profil masjid</button>`)}
    <div class="card plist">${row('pin', 'Alamat', c.alamat)}${row('clock', 'Berdiri', c.berdiri)}${row('chart', 'Luas Tanah', c.luas)}${row('user', 'Kepengurusan', c.pengurus)}${row('info', 'Visi', c.visi)}</div>
    <a class="btn block" href="${waLink(c.telepon)}" target="_blank" rel="noopener">${icon('phone')} Hubungi Kami</a>
  </div>`;
}

/* ============ PENGATURAN ============ */
function getTema() { return localStorage.getItem('tema') || 'sistem'; }
export function applyTema() {
  const t = getTema();
  const dark = t === 'gelap' || (t === 'sistem' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
function pengaturanView() {
  const c = state.config, t = getTema();
  const tl = { terang: 'Terang', gelap: 'Gelap', sistem: 'Ikuti sistem' }[t];
  const adm = state.admin
    ? `<div class="card admin-box"><div class="badge">${icon('shield')} Mode Admin aktif</div><small>${esc(state.user?.email || '')}</small>
        <button class="btn block" data-edit="profil:config">${icon('edit')} Edit Profil Masjid</button>
        <button class="btn block" data-edit="pengaturan:config">${icon('gear')} Jadwal, Donasi & Beranda</button>
        ${useFirebase ? '<button class="btn outline block" data-act="seed">Isi data contoh (koleksi kosong)</button>' : ''}
        <button class="btn ghost block" data-act="logout">${icon('out')} Keluar dari Admin</button></div>`
    : `<button class="btn block" data-act="login">${icon('shield')} Masuk sebagai Admin</button>`;
  return `<div class="pad">
    <div class="card prof-mini"><div class="logo dark">${icon('mosque')}</div><div><b>${esc(c.nama)}</b><small>${esc(c.lokasi)}</small><small>v1.0.0 ${useFirebase ? '' : '· mode demo'}</small></div></div>
    <div class="card list">
      <button class="li" data-act="adzan">${icon('bell')}<span class="grow">Notifikasi Waktu Shalat</span><small>${adzanOn() ? 'Aktif' : 'Mati'}</small>${icon('chev')}</button>
      <button class="li" data-act="tema">${icon('palette')}<span class="grow">Tema</span><small>${tl}</small>${icon('chev')}</button>
      <button class="li" data-act="tentang">${icon('info')}<span class="grow">Tentang Aplikasi</span>${icon('chev')}</button>
    </div>
    ${adm}
    ${useFirebase ? '' : '<p class="empty small">Mode demo: data hanya tersimpan di HP ini. Sambungkan Firebase agar perubahan admin tampil untuk semua jamaah (lihat README).</p>'}
  </div>`;
}

/* ============ LAINNYA ============ */
function lainnyaView() {
  const items = [['keuangan', 'Keuangan', 'chart'], ['berita', 'Berita & Info', 'news'], ['profil', 'Profil Masjid', 'mosque'], ['pengaturan', 'Pengaturan', 'gear']];
  return `<div class="pad"><div class="card list">${items.map(([r, l, i]) => `<button class="li" data-go="${r}">${icon(i)}<span class="grow">${l}</span>${icon('chev')}</button>`).join('')}</div></div>`;
}

/* ============ ROUTES ============ */
export const ROUTES = {
  beranda: { title: '', view: berandaView, nav: 'beranda', hero: true },
  shalat: { title: 'Jadwal Shalat', view: shalatView, nav: 'shalat' },
  dakwah: { title: 'Dakwah', view: dakwahView, nav: 'dakwah' },
  donasi: { title: 'Donasi', view: donasiView, nav: 'donasi' },
  lainnya: { title: 'Lainnya', view: lainnyaView, nav: 'lainnya' },
  keuangan: { title: 'Keuangan', view: keuanganView, nav: 'lainnya' },
  berita: { title: 'Berita & Info', view: beritaView, nav: 'lainnya' },
  profil: { title: 'Profil Masjid', view: profilView, nav: 'lainnya' },
  pengaturan: { title: 'Pengaturan', view: pengaturanView, nav: 'lainnya' },
};

/* ============ AKSI KLIK ============ */
export function openEdit(col, id) {
  if (!state.admin) return;
  if (col === 'profil' || col === 'pengaturan') {
    const F = FORMS[col];
    openForm({ title: F.title, fields: F.fields, values: state.config, onSave: (v) => { const patch = {}; F.fields.forEach((f) => { patch[f.key] = v[f.key]; }); return saveConfig(patch); } });
    return;
  }
  const F = FORMS[col];
  const item = id && id !== 'new' ? state[col].find((x) => x.id === id) : null;
  const def = { dakwah: { tipe: 'Video' }, berita: { kategori: 'Pengumuman' }, transaksi: { jenis: 'masuk' } }[col] || {};
  openForm({
    title: (item ? 'Ubah ' : 'Tambah ') + F.title,
    fields: F.fields,
    values: item || { ...def, tanggal: new Date().toISOString().slice(0, 10) },
    onSave: (v) => saveItem(col, v),
    onDelete: item ? () => removeItem(col, item.id) : null,
  });
}

export function openDetail(col, id) {
  const x = state[col].find((i) => i.id === id); if (!x) return;
  const link = x.link ? `<a class="btn block" href="${esc(x.link)}" target="_blank" rel="noopener">${icon('play')} Buka video</a>` : '';
  openModal(`${x.gambar ? `<img class="detail-img" src="${x.gambar}" alt="">` : ''}<h3>${esc(x.judul)}</h3>
    <div class="meta"><span>${tglPendek(x.tanggal)}</span><span class="tag">${esc(x.tipe || x.kategori)}</span></div>
    <p class="body">${esc(x.isi || '').replace(/\n/g, '<br>')}</p>${link}
    <div class="row end"><button class="btn ghost" data-close-btn>Tutup</button></div>`);
}

export function loginForm() {
  openModal(`<h3>Masuk Admin</h3><form id="lf">
    <label class="field"><span>Email</span><input id="lf-e" type="email" autocomplete="username" ${useFirebase ? 'required' : ''}></label>
    <label class="field"><span>Kata sandi</span><input id="lf-p" type="password" autocomplete="current-password" required>${useFirebase ? '' : '<small>Mode demo: kata sandi admin123</small>'}</label>
    <div class="row end"><button type="button" class="btn ghost" data-close-btn>Batal</button><button class="btn" type="submit">Masuk</button></div></form>`, (el) => {
    el.querySelector('#lf').onsubmit = async (e) => {
      e.preventDefault();
      try { await login(el.querySelector('#lf-e').value.trim(), el.querySelector('#lf-p').value); closeModal(); toast('Berhasil masuk'); }
      catch (err) { toast(useFirebase ? 'Email atau kata sandi salah' : err.message); }
    };
  });
}

export async function handleAction(a) {
  const c = state.config;
  if (a === 'login') loginForm();
  else if (a === 'logout') { await logout(); toast('Keluar dari admin'); }
  else if (a === 'seed') { const n = await seed(); toast(`${n} data contoh ditambahkan`); }
  else if (a === 'tema') {
    openModal(`<h3>Tema</h3><div class="opts">${[['terang', 'Terang'], ['gelap', 'Gelap'], ['sistem', 'Ikuti sistem']].map(([k, l]) => `<button class="btn ${getTema() === k ? '' : 'ghost'} block" data-tema="${k}">${l}</button>`).join('')}</div>`, (el) => {
      el.querySelectorAll('[data-tema]').forEach((b) => { b.onclick = () => { localStorage.setItem('tema', b.dataset.tema); applyTema(); closeModal(); window.dispatchEvent(new Event('rerender')); }; });
    });
  } else if (a === 'tentang') openModal(`<h3>${esc(c.nama)}</h3><p>Aplikasi informasi jamaah: jadwal shalat, dakwah, donasi, keuangan, dan kabar masjid.</p><p><small>Versi 1.0.0</small></p><div class="row end"><button class="btn ghost" data-close-btn>Tutup</button></div>`);
  else if (a === 'scroll-rek') document.getElementById('rek-sec')?.scrollIntoView({ behavior: 'smooth' });
  else if (a === 'toggle-rek') { semuaRek = !semuaRek; window.dispatchEvent(new Event('rerender')); }
  else if (a === 'qris') openModal(`<h3>QRIS</h3>${c.qris ? `<img class="detail-img" src="${c.qris}" alt="QRIS">` : '<p>Gambar QRIS belum diunggah oleh pengurus.</p>'}<div class="row end"><button class="btn ghost" data-close-btn>Tutup</button></div>`);
  else if (a === 'konfirmasi') window.open(waLink(c.telepon, `Assalamu'alaikum, saya ingin konfirmasi donasi untuk ${c.nama}.\nNominal: Rp \nNama: `), '_blank');
}

export function handleClick(e) {
  const t = (s) => e.target.closest(s);
  let el;
  if ((el = t('[data-shalat-tab]'))) { shalatTab = el.dataset.shalatTab; return 'rerender'; }
  if ((el = t('[data-dakwah-f]'))) { dakwahFilter = el.dataset.dakwahF; return 'rerender'; }
  if ((el = t('[data-berita-f]'))) { beritaFilter = el.dataset.beritaF; return 'rerender'; }
  if ((el = t('[data-copy]'))) { navigator.clipboard?.writeText(el.dataset.copy).then(() => toast('Nomor rekening disalin')); return 'done'; }
  if ((el = t('[data-edit]'))) { e.stopPropagation(); const [col, id] = el.dataset.edit.split(':'); openEdit(col, id); return 'done'; }
  if ((el = t('[data-add]'))) { openEdit(el.dataset.add, 'new'); return 'done'; }
  if ((el = t('[data-open]'))) { const [col, id] = el.dataset.open.split(':'); openDetail(col, id); return 'done'; }
  if ((el = t('[data-act]'))) { handleAction(el.dataset.act); return 'done'; }
  if ((el = t('[data-go]'))) { location.hash = '#/' + el.dataset.go; return 'done'; }
  return null;
}
export function handleChange(e) {
  if (e.target.id === 'bulan' && e.target.value) { bulan = e.target.value; return true; }
  return false;
}
