# Aplikasi Masjid Al-Kautsar

Aplikasi Android: jamaah melihat jadwal shalat, dakwah, donasi, keuangan, berita, dan profil masjid.
Admin masuk lewat **Pengaturan → Masuk sebagai Admin**, lalu muncul tombol kuning (+ / pensil) untuk menambah, mengubah, dan menghapus isi. Perubahan langsung tampil di HP semua jamaah.

## Mode demo
Sebelum Firebase disambungkan, aplikasi berjalan dalam mode demo (data tersimpan di HP saja, kata sandi admin: `admin123`). Cocok untuk mencoba tampilan.

## Langkah 1 — Siapkan Firebase (gratis)
1. Buka https://console.firebase.google.com → **Add project**.
2. **Build → Firestore Database → Create database** (pilih lokasi `asia-southeast2` Jakarta, mode production).
3. **Build → Authentication → Get started → Email/Password → Enable**.
4. Di Authentication → **Users → Add user**: buat akun admin (email + kata sandi). Cukup tambah manual; jangan buka pendaftaran umum.
5. **Project settings (ikon roda gigi) → Your apps → ikon Web `</>`** → daftarkan aplikasi → salin objek `firebaseConfig`.
6. Tempel nilainya ke `src/firebase-config.js`.
7. Di Firestore → tab **Rules**: tempel isi `firestore.rules`, ganti `GANTI_DENGAN_EMAIL_ADMIN@gmail.com` dengan email admin (boleh beberapa, pisahkan koma), lalu **Publish**.

## Langkah 2 — Buat APK lewat GitHub (tanpa install apa pun)
1. Buat repository baru di https://github.com (boleh private) dan upload seluruh isi folder ini.
2. Buka tab **Actions → Build APK → Run workflow** (juga otomatis jalan setiap push).
3. Tunggu ±5–10 menit, lalu buka run yang selesai → **Artifacts → masjid-al-kautsar-apk** → unduh dan ekstrak `app-debug.apk`.
4. Kirim file APK ke HP jamaah (WhatsApp/Drive) dan pasang (izinkan "Install dari sumber tidak dikenal").

## Langkah 3 — Isi data
Masuk sebagai admin → Pengaturan:
- **Edit Profil Masjid**: nama, foto, alamat, kontak.
- **Jadwal, Donasi & Beranda**: koordinat masjid, koreksi menit, gambar QRIS, kutipan.
- **Isi data contoh**: mengisi contoh berita/dakwah/rekening ke Firebase yang masih kosong, lalu ubah sesuai kebutuhan.

## Catatan penting
- **Jadwal shalat dihitung otomatis** dari koordinat (metode dasar Kemenag RI). Cocokkan dengan jadwal resmi Kemenag/bimasislam dan atur "koreksi menit" bila perlu. Koordinat bawaan hanya perkiraan Pagelaran, Pandeglang — ganti dengan titik masjid Anda.
- APK yang dihasilkan adalah **debug APK**: bisa dipasang langsung, tetapi belum bisa diunggah ke Google Play. Untuk Play Store diperlukan APK/AAB rilis bertanda tangan (keystore); bisa ditambahkan nanti.
- Foto disimpan terkompresi di Firestore (tanpa Firebase Storage), jadi tetap gratis. Gunakan foto secukupnya.
- Ikon aplikasi dibuat otomatis dari folder `assets` (ganti gambar di sana bila ingin logo sendiri).
- Notifikasi waktu shalat: aktifkan di Pengaturan (hanya di aplikasi Android). Dijadwalkan 7 hari ke depan setiap aplikasi dibuka. Di Android 14+ mungkin perlu mengizinkan "Alarm & pengingat" untuk aplikasi di pengaturan HP agar tepat waktu.

## Menjalankan di komputer (opsional)
```
npm install
npm run dev
```
