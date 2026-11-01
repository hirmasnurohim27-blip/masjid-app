import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export function timesFor(date, cfg) {
  const coords = new Coordinates(parseFloat(cfg.lat), parseFloat(cfg.lng));
  const p = CalculationMethod.Singapore(); // dasar yang dipakai Kemenag RI (Subuh 20°, Isya 18°)
  p.madhab = Madhab.Shafi;
  p.adjustments = {
    fajr: +cfg.kSubuh || 0, sunrise: 0, dhuhr: +cfg.kDhuhur || 0,
    asr: +cfg.kAshar || 0, maghrib: +cfg.kMaghrib || 0, isha: +cfg.kIsya || 0,
  };
  const t = new PrayerTimes(coords, date, p);
  return [
    { key: 'imsak', nama: 'Imsak', time: new Date(t.fajr.getTime() - 10 * 60000), wajib: false },
    { key: 'subuh', nama: 'Subuh', time: t.fajr, wajib: true },
    { key: 'terbit', nama: 'Terbit', time: t.sunrise, wajib: false },
    { key: 'dhuhur', nama: 'Dhuhur', time: t.dhuhr, wajib: true },
    { key: 'ashar', nama: 'Ashar', time: t.asr, wajib: true },
    { key: 'maghrib', nama: 'Maghrib', time: t.maghrib, wajib: true },
    { key: 'isya', nama: 'Isya', time: t.isha, wajib: true },
  ];
}

export function fmtTime(d, zona = 'Asia/Jakarta') {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zona })
    .format(d).replace('.', ':');
}

export function nextPrayer(now, cfg) {
  const today = timesFor(now, cfg).filter((x) => x.wajib);
  const nxt = today.find((x) => x.time > now);
  if (nxt) return nxt;
  const tomorrow = new Date(now.getTime() + 864e5);
  return timesFor(tomorrow, cfg).find((x) => x.key === 'subuh');
}

export function fmtMasehi(d, zona = 'Asia/Jakarta') {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: zona }).format(d);
}

export function fmtHijri(d, koreksi = 0) {
  const x = new Date(d.getTime() + (+koreksi || 0) * 864e5);
  try {
    return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(x).replace(/\s?(AH|H)$/, '') + ' H';
  } catch { return ''; }
}

export function countdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = (n) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}
