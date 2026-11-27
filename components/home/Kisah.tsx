"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import Gapura from "@/components/ui/Gapura";
import RiseText from "@/components/ui/RiseText";

const bab = [
  {
    kata: "Didengar",
    judul: "Setiap gagasan dimulai dari seseorang yang mau bicara.",
    isi: "Keluhan soal jalan, usul kegiatan pemuda, atau ide kecil untuk dusun sering berhenti di obrolan warung. Di sini, suara itu punya tempat untuk dicatat.",
    foto: "/assets/image/SuaraDesaBG.jpeg",
    alt: "Warga berorasi di depan rumah warga dengan bendera berkibar",
  },
  {
    kata: "Disampaikan",
    judul: "Ditulis sekali, sampai ke meja pengelola desa.",
    isi: "Warga masuk dengan akun, menulis kritik atau saran, dan bisa menyertakan satu foto sebagai bukti. Tulisan langsung tersimpan dan terbaca oleh pengelola.",
    foto: "/assets/image/BgKritik.jpg",
    alt: "Warga duduk bermusyawarah di pendopo beratap kayu",
  },
  {
    kata: "Diwujudkan",
    judul: "Masukan menjadi bahan untuk bergerak bersama.",
    isi: "Kritik dan saran yang terkumpul menjadi bekal pembicaraan desa, sampai akhirnya berubah menjadi kerja nyata yang dikerjakan bersama warga.",
    foto: "/assets/image/BgRegister.jpeg",
    alt: "Warga bergotong royong memangkas dahan pohon di halaman",
  },
];

const ease = [0.65, 0, 0.35, 1] as const;

function Bab({
  index,
  onAktif,
}: {
  index: number;
  onAktif: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { amount: 0.55 });
  const b = bab[index];

  useEffect(() => {
    if (terlihat) onAktif(index);
  }, [terlihat, index, onAktif]);

  return (
    <div ref={ref} className="flex min-h-0 flex-col justify-center py-14 lg:min-h-[92vh] lg:py-0">
      <Gapura src={b.foto} alt={b.alt} className="mb-10 aspect-[4/5] w-full max-w-sm lg:hidden" />

      <motion.p
        className="display mb-5 text-2xl italic text-bata"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease }}
      >
        {b.kata}
      </motion.p>
      <RiseText
        saatTerlihat
        className="display max-w-xl text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05]"
        baris={[b.judul.split(" ").map((teks) => ({ teks }))]}
      />
      <motion.p
        className="mt-6 max-w-lg text-[17px] leading-relaxed text-lumut"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, ease, delay: 0.3 }}
      >
        {b.isi}
      </motion.p>
    </div>
  );
}

export default function Kisah() {
  const [aktif, setAktif] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const aliran = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="kisah" ref={ref} className="on-light relative scroll-mt-20 bg-kertas">
      <svg
        aria-hidden="true"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-2 top-0 hidden h-full w-10 md:block lg:left-6"
      >
        <path
          d="M20 0 C 36 120, 4 220, 20 340 S 38 560, 18 700 S 6 900, 20 1000"
          fill="none"
          stroke="#1d3627"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d="M20 0 C 36 120, 4 220, 20 340 S 38 560, 18 700 S 6 900, 20 1000"
          fill="none"
          stroke="#8b2f31"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: aliran }}
        />
      </svg>

      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-16 md:pt-32">
        <p className="text-[15px] font-semibold text-bata">Kisah sebuah suara</p>
        <RiseText
          saatTerlihat
          className="display mt-4 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] leading-[1]"
          baris={[
            [{ teks: "Dari" }, { teks: "obrolan" }, { teks: "warung," }],
            [{ teks: "menjadi" }, { teks: "langkah", className: "italic text-bata" }, { teks: "desa." }],
          ]}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 md:px-16 lg:grid-cols-2 lg:gap-20 lg:pb-0">
        <div>
          {bab.map((_, i) => (
            <Bab key={i} index={i} onAktif={setAktif} />
          ))}
        </div>

        <div className="sticky top-0 hidden h-screen items-center lg:flex">
          <div className="relative aspect-[4/5] w-full max-w-md">
            {bab.map((b, i) => {
              const naik = i <= aktif;
              return (
                <motion.figure
                  key={b.kata}
                  aria-hidden={i !== aktif}
                  className="absolute inset-0 overflow-hidden rounded-gapura bg-hutan-soft"
                  style={{ zIndex: i }}
                  initial={false}
                  animate={{
                    clipPath: naik
                      ? "inset(0% 0% 0% 0% round 999px 999px 18px 18px)"
                      : "inset(100% 0% 0% 0% round 999px 999px 18px 18px)",
                  }}
                  transition={{ duration: 1.1, ease }}
                >
                  <motion.img
                    src={b.foto}
                    alt={i === aktif ? b.alt : ""}
                    className="h-full w-full object-cover"
                    initial={false}
                    animate={naik ? { scale: 1, y: 0 } : { scale: 1.3, y: 40 }}
                    transition={{ duration: 1.5, ease }}
                  />
                </motion.figure>
              );
            })}

            <div className="absolute -bottom-14 left-0 right-0 flex justify-between text-sm">
              {bab.map((b, i) => (
                <span
                  key={b.kata}
                  className={`transition-colors duration-500 ${
                    i === aktif ? "font-semibold text-hutan" : "text-lumut"
                  }`}
                >
                  {b.kata}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
