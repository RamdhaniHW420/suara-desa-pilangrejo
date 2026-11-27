"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import RiseText from "@/components/ui/RiseText";
import Gapura from "@/components/ui/Gapura";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTeks = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yFoto = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const putar = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const garis = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden bg-hutan-deep pb-20 pt-32 text-kertas md:pb-28 md:pt-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.path
          d="M-40 860 C 220 790, 380 900, 640 840 S 1000 700, 1200 800 S 1420 880, 1500 820"
          fill="none"
          stroke="#f2c94c"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, ease, delay: 0.6 }}
        />
        <motion.path
          d="M-40 890 C 260 820, 420 930, 700 870 S 1040 740, 1240 830 S 1440 900, 1500 860"
          fill="none"
          stroke="#f4efdd"
          strokeOpacity="0.14"
          strokeWidth="1"
          style={{ pathLength: garis }}
        />
      </svg>

      <div className="relative mx-auto grid max-w-7xl items-end gap-14 px-5 md:px-10 lg:grid-cols-[1.25fr_1fr]">
        <motion.div style={{ y: yTeks }}>
          <motion.p
            className="mb-6 text-[15px] font-medium text-padi"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
          >
            Desa Pilangrejo, Juwangi, Boyolali
          </motion.p>

          <RiseText
            as="h1"
            delay={0.55}
            className="display text-[clamp(2.9rem,8.5vw,6.6rem)] font-medium leading-[0.95]"
            baris={[
              [{ teks: "Dengarkan," }],
              [{ teks: "sampaikan," }],
              [
                { teks: "lalu" },
                { teks: "wujudkan.", className: "italic text-padi" },
              ],
            ]}
          />

          <motion.p
            className="mt-8 max-w-xl text-[17px] leading-relaxed text-kertas/85"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.2 }}
          >
            Perubahan besar sering berawal dari suara kecil. Suara Desa dibuat oleh
            warga yang peduli pada kemajuan Pilangrejo, sebagai tempat menitipkan
            kritik, saran, dan gagasan agar desa tumbuh lebih sejahtera dan inklusif.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.35 }}
          >
            <Link href="/Kritik&Saran" className="btn-padi">
              Tulis kritik &amp; saran
            </Link>
            <Link href="#kisah" className="btn-ghost">
              Baca kisahnya
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yFoto, rotate: putar }} className="relative mx-auto w-full max-w-[440px]">
          <Gapura
            src="/assets/image/SuaraDesaBG.jpeg"
            alt="Seorang warga berbicara lantang di hadapan warga lain di Pilangrejo"
            className="aspect-[3/4] w-full"
            saatTerlihat={false}
            prioritas
            delay={0.7}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-5 -left-5 -z-10 h-full w-full rounded-gapura border border-padi/50"
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.4, ease, delay: 1.6 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
