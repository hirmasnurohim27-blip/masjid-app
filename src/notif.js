import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { timesFor } from './prayer.js';

export const notifSupported = () => Capacitor.isNativePlatform();
export const adzanOn = () => localStorage.getItem('adzan') === '1';

async function clearAll() {
  const p = await LocalNotifications.getPending();
  if (p.notifications.length) await LocalNotifications.cancel({ notifications: p.notifications });
}

// Jadwalkan notifikasi 7 hari ke depan. Dipanggil ulang setiap aplikasi dibuka.
export async function scheduleAdzan(cfg) {
  if (!notifSupported()) return false;
  await clearAll();
  if (!adzanOn()) return true;
  try { await LocalNotifications.createChannel({ id: 'adzan', name: 'Waktu Shalat', importance: 5, visibility: 1 }); } catch { /* sudah ada */ }
  const now = new Date(), list = [];
  for (let d = 0; d < 7; d++) {
    const day = new Date(now.getTime() + d * 864e5);
    timesFor(day, cfg).filter((t) => t.wajib).forEach((t, i) => {
      if (t.time > now) list.push({
        id: d * 10 + i + 1, channelId: 'adzan',
        title: `Waktu ${t.nama}`, body: `Saatnya shalat ${t.nama} untuk wilayah ${cfg.lokasi}.`,
        schedule: { at: t.time, allowWhileIdle: true },
      });
    });
  }
  if (list.length) await LocalNotifications.schedule({ notifications: list });
  return true;
}

export async function toggleAdzan(on, cfg) {
  if (!notifSupported()) return 'web';
  if (on) {
    const r = await LocalNotifications.requestPermissions();
    if (r.display !== 'granted') return 'denied';
  }
  localStorage.setItem('adzan', on ? '1' : '0');
  await scheduleAdzan(cfg);
  return on ? 'on' : 'off';
}
