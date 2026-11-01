const d = (offset) => {
  const x = new Date(); x.setDate(x.getDate() - offset);
  return x.toISOString().slice(0, 10);
};
const m = (offset) => d(offset);

export const defaults = {
  config: {
    nama: 'Masjid Al-Kautsar',
    lokasi: 'Karangtaraje',
    tagline: 'Membangun Ukhuwah, Meraih Ridha Allah',
    alamat: 'Kp. Karangtaraje, Kec. Pagelaran, Kab. Pandeglang - Banten',
    berdiri: 'Tahun 2010',
    luas: '± 1.200 m²',
    pengurus: 'Takmir Masjid Al-Kautsar',
    visi: 'Menjadi masjid yang makmur, mandiri, dan menjadi pusat peradaban Islam di Karangtaraje.',
    telepon: '081234567890',
    foto: '',
    // Jadwal shalat
    lat: '-6.3600',
    lng: '105.8700',
    zona: 'Asia/Jakarta',
    kSubuh: '2', kDhuhur: '2', kAshar: '2', kMaghrib: '2', kIsya: '2',
    hijriKoreksi: '0',
    // Donasi
    qris: '',
    kutipanDonasi: 'Sedekah tidak akan mengurangi harta, justru menambah keberkahan.',
    // Beranda
    ajakJudul: 'Mari bersama memakmurkan masjid',
    ajakIsi: 'Siapa yang membangun masjid karena Allah, maka Allah akan membangunkan baginya rumah di surga.',
    ajakSumber: 'HR. Bukhari dan Muslim',
    shalatMotivasi: 'Jadikan shalat sebagai penyejuk hati dan penuntun hidup.',
  },
  dakwah: [
    { judul: 'Keutamaan Shalat Tepat Waktu', tipe: 'Video', tanggal: d(6), durasi: '05:32', gambar: '', link: '', isi: '' },
    { judul: 'Tafsir Al-Fatihah Ayat 1', tipe: 'Kajian', tanggal: d(7), durasi: '07:45', gambar: '', link: '', isi: '' },
    { judul: 'Hidup Sederhana, Bahagia di Dunia dan Akhirat', tipe: 'Artikel', tanggal: d(9), durasi: '06:18', gambar: '', link: '', isi: 'Tulis isi artikel di sini lewat menu edit.' },
    { judul: 'Adab di Masjid', tipe: 'Artikel', tanggal: d(11), durasi: '04:56', gambar: '', link: '', isi: 'Tulis isi artikel di sini lewat menu edit.' },
  ],
  berita: [
    { judul: 'Peringatan Maulid Nabi Muhammad SAW', kategori: 'Kegiatan', tanggal: d(10), gambar: '', isi: 'Seluruh jamaah diundang menghadiri peringatan Maulid Nabi.' },
    { judul: 'Pembangunan Mihrab Masjid Al-Kautsar', kategori: 'Pengumuman', tanggal: d(15), gambar: '', isi: 'Pembangunan mihrab dimulai. Mohon doa dan dukungan jamaah.' },
    { judul: 'Jadwal Kajian Rutin Setiap Ahad', kategori: 'Kegiatan', tanggal: d(20), gambar: '', isi: 'Kajian rutin setiap Ahad ba\'da Subuh.' },
    { judul: 'Update Donasi Pembangunan Masjid', kategori: 'Berita', tanggal: d(25), gambar: '', isi: 'Terima kasih kepada seluruh donatur. Laporan lengkap ada di menu Keuangan.' },
  ],
  rekening: [
    { bank: 'Bank Syariah Indonesia (BSI)', nomor: '7171 0000 1234 56', atasNama: 'Masjid Al-Kautsar' },
    { bank: 'Bank Rakyat Indonesia (BRI)', nomor: '5678 0101 2345 67', atasNama: 'Masjid Al-Kautsar' },
  ],
  transaksi: [
    { jenis: 'masuk', kategori: 'Donasi Jamaah', jumlah: 7800000, tanggal: m(3), keterangan: 'Donasi jamaah bulan ini' },
    { jenis: 'masuk', kategori: 'Kotak Amal', jumlah: 3250000, tanggal: m(2), keterangan: 'Kotak amal Jumat' },
    { jenis: 'masuk', kategori: 'Lain-lain', jumlah: 1400000, tanggal: m(1), keterangan: 'Infak lainnya' },
    { jenis: 'keluar', kategori: 'Pembangunan', jumlah: 5000000, tanggal: m(2), keterangan: 'Material mihrab' },
    { jenis: 'keluar', kategori: 'Operasional', jumlah: 3230000, tanggal: m(1), keterangan: 'Listrik, air, kebersihan' },
  ],
};
