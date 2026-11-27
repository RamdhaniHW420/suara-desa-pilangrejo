import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCerHOTsebobqm7VJ8Ebp7RIv2UnaDOb78",
  authDomain: "kritik-saran-6475d.firebaseapp.com",
  projectId: "kritik-saran-6475d",
  storageBucket: "kritik-saran-6475d.firebasestorage.app",
  messagingSenderId: "1058258415649",
  appId: "1:1058258415649:web:a5369e762a5e47194d3360",
  measurementId: "G-2JFJDMTY9J",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const ADMIN_EMAIL = "adminsuaradesa123@gmail.com";

const pesanError: Record<string, string> = {
  "auth/invalid-credential": "Email atau kata sandi tidak cocok.",
  "auth/invalid-email": "Format email belum benar.",
  "auth/user-not-found": "Akun dengan email ini belum terdaftar.",
  "auth/wrong-password": "Kata sandi salah.",
  "auth/email-already-in-use": "Email ini sudah dipakai akun lain.",
  "auth/weak-password": "Kata sandi minimal 6 karakter.",
  "auth/too-many-requests": "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
  "auth/network-request-failed": "Koneksi terputus. Periksa internet kamu.",
};

export function terjemahkanError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  if (code && pesanError[code]) return pesanError[code];
  return "Ada kendala yang tidak terduga. Coba lagi sebentar lagi.";
}

export { auth, db };
