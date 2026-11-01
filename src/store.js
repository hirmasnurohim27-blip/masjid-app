import { firebaseConfig } from './firebase-config.js';
import { defaults } from './defaults.js';

export const useFirebase =
  Boolean(firebaseConfig.apiKey) && !String(firebaseConfig.apiKey).startsWith('ISI');

const COLS = ['dakwah', 'berita', 'rekening', 'transaksi'];
const LS_KEY = 'masjid-demo-v1';
const DEMO_PASSWORD = 'admin123';

export const state = {
  config: { ...defaults.config },
  dakwah: [], berita: [], rekening: [], transaksi: [],
  admin: false, user: null, ready: false, error: '',
};

const listeners = new Set();
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const emit = () => listeners.forEach((f) => f());

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

let fb = null; // { fs, au, db, auth }

/* ---------- MODE DEMO (tanpa Firebase) ---------- */
function loadDemo() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { /* abaikan */ }
  if (saved) {
    state.config = { ...defaults.config, ...(saved.config || {}) };
    COLS.forEach((c) => { state[c] = saved[c] || []; });
  } else {
    COLS.forEach((c) => { state[c] = defaults[c].map((x) => ({ id: uid(), ...x })); });
  }
  state.admin = localStorage.getItem(LS_KEY + '-admin') === '1';
  state.user = state.admin ? { email: 'admin (demo)' } : null;
  state.ready = true;
  emit();
}
function persistDemo() {
  const out = { config: state.config };
  COLS.forEach((c) => { out[c] = state[c]; });
  try { localStorage.setItem(LS_KEY, JSON.stringify(out)); } catch (e) { state.error = 'Penyimpanan penuh'; }
  emit();
}

/* ---------- MODE FIREBASE ---------- */
async function initFirebase() {
  const [{ initializeApp }, fs, au] = await Promise.all([
    import('firebase/app'), import('firebase/firestore'), import('firebase/auth'),
  ]);
  const app = initializeApp(firebaseConfig);
  let db;
  try {
    db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache() });
  } catch {
    db = fs.getFirestore(app);
  }
  const auth = au.getAuth(app);
  fb = { fs, au, db, auth };

  fs.onSnapshot(fs.doc(db, 'config', 'masjid'), (snap) => {
    state.config = { ...defaults.config, ...(snap.data() || {}) };
    state.ready = true; emit();
  }, () => { state.ready = true; state.error = 'Gagal memuat data'; emit(); });

  COLS.forEach((c) => {
    fs.onSnapshot(fs.collection(db, c), (snap) => {
      state[c] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      emit();
    });
  });

  au.onAuthStateChanged(auth, (u) => { state.user = u; state.admin = !!u; emit(); });
}

export function init() {
  if (useFirebase) initFirebase().catch((e) => { state.error = String(e); state.ready = true; emit(); });
  else loadDemo();
}

/* ---------- AKSI ---------- */
export async function login(email, password) {
  if (!useFirebase) {
    if (password !== DEMO_PASSWORD) throw new Error('Kata sandi demo: admin123');
    localStorage.setItem(LS_KEY + '-admin', '1');
    state.admin = true; state.user = { email: 'admin (demo)' }; emit();
    return;
  }
  await fb.au.signInWithEmailAndPassword(fb.auth, email, password);
}

export async function logout() {
  if (!useFirebase) {
    localStorage.removeItem(LS_KEY + '-admin');
    state.admin = false; state.user = null; emit();
    return;
  }
  await fb.au.signOut(fb.auth);
}

export async function saveItem(col, item) {
  const { id, ...data } = item;
  if (!useFirebase) {
    if (id) {
      state[col] = state[col].map((x) => (x.id === id ? { id, ...data } : x));
    } else {
      state[col] = [...state[col], { id: uid(), ...data }];
    }
    persistDemo();
    return;
  }
  const { fs, db } = fb;
  if (id) await fs.setDoc(fs.doc(db, col, id), data);
  else await fs.addDoc(fs.collection(db, col), data);
}

export async function removeItem(col, id) {
  if (!useFirebase) {
    state[col] = state[col].filter((x) => x.id !== id);
    persistDemo();
    return;
  }
  await fb.fs.deleteDoc(fb.fs.doc(fb.db, col, id));
}

export async function saveConfig(patch) {
  if (!useFirebase) {
    state.config = { ...state.config, ...patch };
    persistDemo();
    return;
  }
  await fb.fs.setDoc(fb.fs.doc(fb.db, 'config', 'masjid'), patch, { merge: true });
}

// Isi data contoh ke Firebase (hanya koleksi yang masih kosong)
export async function seed() {
  if (!useFirebase) return 0;
  let n = 0;
  for (const c of COLS) {
    if (state[c].length === 0) {
      for (const item of defaults[c]) { await saveItem(c, item); n++; }
    }
  }
  await saveConfig({ ...defaults.config, ...state.config });
  return n;
}
