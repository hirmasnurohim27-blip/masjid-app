const sel = (arr) => arr.map((x) => [x, x]);

export const FORMS = {
  dakwah: {
    title: 'Konten Dakwah',
    fields: [
      { key: 'judul', label: 'Judul', required: true },
      { key: 'tipe', label: 'Jenis', type: 'select', options: sel(['Video', 'Artikel', 'Kajian']) },
      { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { key: 'durasi', label: 'Durasi / waktu baca', hint: 'Contoh: 05:32' },
      { key: 'gambar', label: 'Gambar sampul', type: 'image' },
      { key: 'link', label: 'Link video (YouTube dll.)', type: 'url', hint: 'Kosongkan jika artikel' },
      { key: 'isi', label: 'Isi artikel / ringkasan', type: 'textarea', rows: 6 },
    ],
  },
  berita: {
    title: 'Berita & Info',
    fields: [
      { key: 'judul', label: 'Judul', required: true },
      { key: 'kategori', label: 'Kategori', type: 'select', options: sel(['Pengumuman', 'Kegiatan', 'Berita']) },
      { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { key: 'gambar', label: 'Gambar', type: 'image' },
      { key: 'isi', label: 'Isi', type: 'textarea', rows: 6 },
    ],
  },
  rekening: {
    title: 'Rekening Donasi',
    fields: [
      { key: 'bank', label: 'Nama bank', required: true },
      { key: 'nomor', label: 'Nomor rekening', required: true },
      { key: 'atasNama', label: 'Atas nama', required: true },
    ],
  },
  transaksi: {
    title: 'Transaksi Keuangan',
    fields: [
      { key: 'jenis', label: 'Jenis', type: 'select', options: [['masuk', 'Pemasukan'], ['keluar', 'Pengeluaran']] },
      { key: 'kategori', label: 'Kategori', required: true, list: ['Donasi Jamaah', 'Kotak Amal', 'Lain-lain', 'Pembangunan', 'Operasional', 'Kegiatan'] },
      { key: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true },
      { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { key: 'keterangan', label: 'Keterangan' },
    ],
  },
  profil: {
    title: 'Profil Masjid',
    fields: [
      { key: 'nama', label: 'Nama masjid', required: true },
      { key: 'lokasi', label: 'Lokasi singkat (kampung/desa)' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'foto', label: 'Foto masjid', type: 'image' },
      { key: 'alamat', label: 'Alamat', type: 'textarea', rows: 2 },
      { key: 'berdiri', label: 'Berdiri' },
      { key: 'luas', label: 'Luas tanah' },
      { key: 'pengurus', label: 'Kepengurusan' },
      { key: 'visi', label: 'Visi', type: 'textarea', rows: 3 },
      { key: 'telepon', label: 'No. HP / WhatsApp pengurus', type: 'tel' },
    ],
  },
  pengaturan: {
    title: 'Jadwal, Donasi & Beranda',
    fields: [
      { key: 'lat', label: 'Lintang (latitude)', hint: 'Salin dari Google Maps, contoh -6.3600' },
      { key: 'lng', label: 'Bujur (longitude)', hint: 'Contoh 105.8700' },
      { key: 'kSubuh', label: 'Koreksi Subuh (menit)', type: 'number' },
      { key: 'kDhuhur', label: 'Koreksi Dhuhur (menit)', type: 'number' },
      { key: 'kAshar', label: 'Koreksi Ashar (menit)', type: 'number' },
      { key: 'kMaghrib', label: 'Koreksi Maghrib (menit)', type: 'number' },
      { key: 'kIsya', label: 'Koreksi Isya (menit)', type: 'number' },
      { key: 'hijriKoreksi', label: 'Koreksi tanggal Hijriah (hari)', type: 'number', hint: 'Isi -1, 0, atau 1 agar cocok dengan kalender Kemenag' },
      { key: 'qris', label: 'Gambar QRIS', type: 'image' },
      { key: 'kutipanDonasi', label: 'Kutipan di halaman Donasi' },
      { key: 'ajakJudul', label: 'Ajakan di Beranda — judul' },
      { key: 'ajakIsi', label: 'Ajakan di Beranda — isi', type: 'textarea', rows: 3 },
      { key: 'ajakSumber', label: 'Ajakan di Beranda — sumber' },
      { key: 'shalatMotivasi', label: 'Kalimat di halaman Jadwal Shalat' },
    ],
  },
};
