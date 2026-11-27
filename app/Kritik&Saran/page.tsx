"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "@/lib/firebaseConfig";
import Field from "@/components/ui/Field";
import Gapura from "@/components/ui/Gapura";
import RiseText from "@/components/ui/RiseText";
import { Pemuat, Pesan } from "@/components/ui/AuthShell";

const BATAS_FOTO = 8 * 1024 * 1024;
const ease = [0.22, 1, 0.36, 1] as const;

// Firestore menolak dokumen di atas 1 MB, jadi foto diperkecil sebelum disimpan sebagai base64.
function perkecilFoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(1, 1100 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * skala);
      canvas.height = Math.round(img.height * skala);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("foto"));
    };
    img.src = url;
  });
}

export default function KritikSaran() {
  const [user, setUser] = useState<User | null>(null);
  const [cekAkun, setCekAkun] = useState(true);
  const [nama, setNama] = useState("");
  const [kritik, setKritik] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [terkirim, setTerkirim] = useState(false);
  const inputFoto = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/Login");
        return;
      }
      setUser(u);
      setCekAkun(false);
    });
  }, [router]);

  const pilihFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setGalat(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setGalat("Lampiran harus berupa gambar (JPG atau PNG).");
      return;
    }
    if (file.size > BATAS_FOTO) {
      setGalat("Ukuran foto maksimal 8 MB.");
      return;
    }
    try {
      setFoto(await perkecilFoto(file));
    } catch {
      setGalat("Foto tidak bisa dibaca. Coba foto lain.");
    }
  };

  const hapusFoto = () => {
    setFoto(null);
    if (inputFoto.current) inputFoto.current.value = "";
  };

  const kirim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setGalat(null);
    setMemuat(true);
    try {
      await addDoc(collection(db, "kritik_saran"), {
        kritik: kritik.trim(),
        nama: nama.trim() || null,
        userEmail: user.email,
        uid: user.uid,
        image: foto,
        createdAt: serverTimestamp(),
      });
      setTerkirim(true);
      setKritik("");
      setNama("");
      hapusFoto();
    } catch {
      setGalat("Tulisanmu belum terkirim. Periksa koneksi lalu coba kirim lagi.");
    } finally {
      setMemuat(false);
    }
  };

  if (cekAkun) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-kertas text-hutan" role="status">
        <span className="flex items-center gap-3 text-[15px]">
          Memeriksa akun <Pemuat />
        </span>
      </div>
    );
  }

  return (
    <div className="on-light bg-kertas">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-32 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:pt-40">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[15px] font-semibold text-bata">Kirim suara</p>
          <RiseText
            as="h1"
            delay={0.45}
            className="display mt-4 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1] text-hutan"
            baris={[
              [{ teks: "Apa" }, { teks: "yang" }, { teks: "perlu" }],
              [{ teks: "dibenahi," }, { teks: "atau", className: "italic text-bata" }],
              [{ teks: "dicoba?" }],
            ]}
          />
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-lumut">
            Tulis apa adanya, sejelas mungkin: di mana, kapan, dan apa harapanmu.
            Kamu masuk sebagai <span className="font-semibold text-hutan">{user?.email}</span>.
          </p>
          <Gapura
            src="/assets/image/BgKritik.jpg"
            alt="Warga bermusyawarah di pendopo"
            className="mt-12 hidden aspect-[4/3] w-full max-w-sm lg:block"
            saatTerlihat={false}
            delay={0.8}
          />
        </div>

        <AnimatePresence mode="wait">
          {terkirim ? (
            <motion.div
              key="terkirim"
              role="status"
              className="grain self-start overflow-hidden rounded-[28px] bg-hutan p-8 text-kertas md:p-12"
              initial={{ clipPath: "circle(0% at 50% 100%)" }}
              animate={{ clipPath: "circle(150% at 50% 100%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease }}
            >
              <svg viewBox="0 0 80 80" className="h-16 w-16" aria-hidden="true">
                <motion.path
                  d="M40 70 C 40 50, 40 40, 40 24 M40 46 C 28 44, 20 34, 20 22 C 32 24, 40 32, 40 46 M40 36 C 50 34, 58 26, 60 14 C 48 16, 40 24, 40 36"
                  fill="none"
                  stroke="#f2c94c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease, delay: 0.5 }}
                />
              </svg>
              <h2 className="display mt-6 text-[2.4rem] leading-tight">
                Suaramu sudah <em className="text-padi">tertanam.</em>
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-kertas/85">
                Tulisan tersimpan dan bisa dibaca pengelola Suara Desa. Terima kasih
                sudah peduli pada Pilangrejo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button type="button" onClick={() => setTerkirim(false)} className="btn-padi">
                  Tulis masukan lain
                </button>
                <Link href="/" className="btn-ghost">
                  Kembali ke beranda
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={kirim}
              className="space-y-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              <Field
                label="Nama (boleh dikosongkan)"
                value={nama}
                onChange={setNama}
                autoComplete="name"
                required={false}
              />
              <Field
                label="Kritik atau saran"
                value={kritik}
                onChange={setKritik}
                multiline
                minLength={10}
                petunjuk="Minimal 10 karakter."
              />

              <div>
                <p className="text-[13px] font-semibold text-bata">Foto pendukung (opsional)</p>
                <AnimatePresence mode="wait">
                  {foto ? (
                    <motion.div
                      key="ada"
                      className="relative mt-3 overflow-hidden rounded-[20px]"
                      initial={{ clipPath: "inset(100% 0 0 0 round 20px)" }}
                      animate={{ clipPath: "inset(0% 0 0 0 round 20px)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease }}
                    >
                      <img src={foto} alt="Pratinjau foto yang akan dikirim" className="max-h-72 w-full object-cover" />
                      <button
                        type="button"
                        onClick={hapusFoto}
                        className="absolute right-3 top-3 min-h-[44px] rounded-full bg-hutan-deep/90 px-4 text-sm font-semibold text-kertas hover:bg-bata"
                      >
                        Hapus foto
                      </button>
                    </motion.div>
                  ) : (
                    <motion.label
                      key="kosong"
                      className="mt-3 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-hutan/30 px-6 text-center transition-colors hover:border-bata focus-within:border-bata"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="font-semibold text-hutan">Pilih foto dari perangkat</span>
                      <span className="mt-1 text-[13px] text-lumut">JPG atau PNG, maksimal 8 MB</span>
                      <input
                        ref={inputFoto}
                        type="file"
                        accept="image/*"
                        onChange={pilihFoto}
                        className="sr-only"
                      />
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>

              {galat && <Pesan jenis="galat">{galat}</Pesan>}

              <button type="submit" disabled={memuat} className="btn-hutan w-full disabled:opacity-70 sm:w-auto">
                {memuat ? (
                  <>
                    Mengirim <Pemuat />
                  </>
                ) : (
                  "Kirim kritik & saran"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
