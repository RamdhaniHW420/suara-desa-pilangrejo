"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { ADMIN_EMAIL, auth, db } from "@/lib/firebaseConfig";
import RiseText from "@/components/ui/RiseText";
import { Pemuat } from "@/components/ui/AuthShell";

type Masukan = {
  id: string;
  kritik: string;
  nama?: string | null;
  userEmail?: string | null;
  image?: string | null;
  createdAt?: Timestamp | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

function formatWaktu(t?: Timestamp | null) {
  if (!t?.seconds) return "Waktu tidak tercatat";
  return new Date(t.seconds * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [siap, setSiap] = useState(false);
  const [data, setData] = useState<Masukan[]>([]);
  const [status, setStatus] = useState<"memuat" | "galat" | "siap">("memuat");
  const [cari, setCari] = useState("");
  const [fotoBesar, setFotoBesar] = useState<string | null>(null);
  const router = useRouter();

  const ambil = useCallback(async () => {
    setStatus("memuat");
    try {
      const snap = await getDocs(collection(db, "kritik_saran"));
      const hasil = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Masukan, "id">) }));
      hasil.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setData(hasil);
      setStatus("siap");
    } catch {
      setStatus("galat");
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u?.email === ADMIN_EMAIL) {
        setSiap(true);
        ambil();
      } else {
        router.replace("/admin-login");
      }
    });
  }, [router, ambil]);

  useEffect(() => {
    if (!fotoBesar) return;
    const tutup = (e: KeyboardEvent) => e.key === "Escape" && setFotoBesar(null);
    document.addEventListener("keydown", tutup);
    return () => document.removeEventListener("keydown", tutup);
  }, [fotoBesar]);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return data;
    return data.filter((m) =>
      [m.kritik, m.nama, m.userEmail].some((v) => v?.toLowerCase().includes(q))
    );
  }, [data, cari]);

  const keluar = async () => {
    await signOut(auth);
    router.push("/admin-login");
  };

  if (!siap) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-kertas text-hutan" role="status">
        <span className="flex items-center gap-3 text-[15px]">
          Memeriksa akses <Pemuat />
        </span>
      </div>
    );
  }

  return (
    <div className="on-light min-h-[100svh] bg-kertas">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[15px] font-semibold text-bata">Ruang pengelola</p>
            <RiseText
              as="h1"
              delay={0.45}
              className="display mt-3 text-[clamp(2.4rem,6vw,4rem)] leading-[1] text-hutan"
              baris={[[{ teks: "Suara" }, { teks: "yang" }, { teks: "masuk", className: "italic text-bata" }]]}
            />
            {status === "siap" && (
              <p className="mt-4 text-[15px] text-lumut">
                {data.length === 0 ? "Belum ada tulisan." : `${data.length} tulisan, terbaru di atas.`}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={ambil} className="btn border border-hutan/30 text-hutan hover:border-bata hover:text-bata">
              Muat ulang
            </button>
            <button type="button" onClick={keluar} className="btn-hutan">
              Keluar
            </button>
          </div>
        </div>

        {status === "siap" && data.length > 0 && (
          <div className="mt-12">
            <label htmlFor="cari" className="text-[13px] font-semibold text-bata">
              Cari isi, nama, atau email
            </label>
            <input
              id="cari"
              type="search"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              className="mt-2 min-h-[48px] w-full border-b border-hutan/30 bg-transparent text-[17px] text-hutan-deep outline-none focus-visible:border-b-2 focus-visible:border-bata focus-visible:outline-none"
            />
          </div>
        )}

        <div className="mt-12">
          {status === "memuat" && (
            <div role="status" className="space-y-6" aria-label="Memuat tulisan">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-32 rounded-[24px] bg-hutan/[0.07]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}

          {status === "galat" && (
            <div role="alert" className="rounded-[24px] bg-bata/10 p-8">
              <p className="display text-2xl text-bata">Daftar tulisan gagal dimuat.</p>
              <p className="mt-2 text-[15px] text-hutan">
                Biasanya karena koneksi atau izin baca Firestore. Periksa lalu coba lagi.
              </p>
              <button type="button" onClick={ambil} className="btn-hutan mt-6">
                Coba lagi
              </button>
            </div>
          )}

          {status === "siap" && data.length === 0 && (
            <div className="rounded-[24px] border-2 border-dashed border-hutan/25 p-10 text-center">
              <p className="display text-2xl text-hutan">Belum ada suara yang masuk.</p>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-lumut">
                Tulisan warga akan muncul di sini begitu dikirim lewat formulir kritik dan saran.
              </p>
            </div>
          )}

          {status === "siap" && data.length > 0 && tersaring.length === 0 && (
            <p className="text-[16px] text-lumut">
              Tidak ada tulisan yang cocok dengan &ldquo;{cari}&rdquo;.
            </p>
          )}

          {status === "siap" && tersaring.length > 0 && (
            <ul className="divide-y divide-hutan/15 border-y border-hutan/15">
              {tersaring.map((m, i) => (
                <motion.li
                  key={m.id}
                  className="grid gap-6 py-8 md:grid-cols-[200px_1fr]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease, delay: Math.min(i, 4) * 0.06 }}
                >
                  <div className="text-[14px] text-lumut">
                    <p className="font-semibold text-hutan">{m.nama || "Tanpa nama"}</p>
                    {m.userEmail && <p className="mt-1 break-all">{m.userEmail}</p>}
                    <p className="mt-2">{formatWaktu(m.createdAt)}</p>
                  </div>
                  <div>
                    <p className="whitespace-pre-line text-[17px] leading-relaxed text-hutan-deep">{m.kritik}</p>
                    {m.image && (
                      <button
                        type="button"
                        onClick={() => setFotoBesar(m.image ?? null)}
                        className="mt-5 block overflow-hidden rounded-[16px]"
                        aria-label="Perbesar foto lampiran"
                      >
                        <img
                          src={m.image}
                          alt="Foto lampiran dari warga"
                          loading="lazy"
                          className="h-40 w-auto max-w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </button>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {fotoBesar && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Foto lampiran"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-hutan-deep/95 p-5"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setFotoBesar(null)}
          >
            <img src={fotoBesar} alt="Foto lampiran ukuran penuh" className="max-h-[80vh] max-w-full rounded-[16px]" />
            <button
              type="button"
              autoFocus
              onClick={() => setFotoBesar(null)}
              className="btn-padi absolute right-5 top-5"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
