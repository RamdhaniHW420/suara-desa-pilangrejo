"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

const singgah = [
  {
    judul: "Masuk dengan akun",
    isi: "Daftar sekali memakai email dan kata sandi. Akun menjaga agar setiap masukan datang dari orang sungguhan.",
    tautan: { href: "/Register", label: "Buat akun warga" },
  },
  {
    judul: "Tulis, lampirkan bila perlu",
    isi: "Ceritakan apa yang kamu lihat atau inginkan. Satu foto boleh disertakan supaya pengelola paham keadaannya.",
    tautan: { href: "/Kritik&Saran", label: "Buka formulir" },
  },
  {
    judul: "Sampai ke pengelola",
    isi: "Tulisan tersimpan bersama waktu pengirimannya, lalu dibaca pengelola Suara Desa dari halaman khusus.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function Singgah({
  s,
  progres,
  titik,
}: {
  s: (typeof singgah)[number];
  progres: MotionValue<number>;
  titik: number;
}) {
  const opacity = useTransform(progres, [titik - 0.12, titik], [0.25, 1]);
  const y = useTransform(progres, [titik - 0.12, titik], [40, 0]);
  const skala = useTransform(progres, [titik - 0.05, titik], [0, 1]);

  return (
    <motion.article style={{ opacity, y }} className="relative w-[min(78vw,380px)] shrink-0 pt-24">
      <motion.span
        aria-hidden="true"
        style={{ scale: skala }}
        className="absolute left-0 top-[52px] block h-5 w-5 rounded-full border-[3px] border-padi bg-hutan-deep"
      />
      <h3 className="display text-[2rem] leading-tight text-kertas">{s.judul}</h3>
      <p className="mt-4 text-[16px] leading-relaxed text-kertas/80">{s.isi}</p>
      {s.tautan && (
        <Link href={s.tautan.href} className="link-line mt-6 inline-block py-2 font-semibold text-padi">
          {s.tautan.label}
        </Link>
      )}
    </motion.article>
  );
}

export default function Alur() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const halus = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const jalur = useRef<HTMLDivElement>(null);
  const [jarak, setJarak] = useState(0);
  const x = useTransform(halus, [0.05, 0.95], [0, -jarak]);

  useEffect(() => {
    const ukur = () => {
      if (jalur.current) setJarak(Math.max(0, jalur.current.scrollWidth - window.innerWidth));
    };
    ukur();
    window.addEventListener("resize", ukur);
    return () => window.removeEventListener("resize", ukur);
  }, []);
  const fotoSkala = useTransform(halus, [0.6, 1], [0.7, 1]);
  const fotoRadius = useTransform(halus, [0.6, 1], [240, 24]);

  return (
    <section id="alur" ref={ref} className="grain relative scroll-mt-0 bg-hutan text-kertas lg:h-[320vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <motion.div
          ref={jalur}
          style={{ x }}
          className="hidden items-center gap-24 pl-16 pr-16 lg:flex lg:w-max"
        >
          <div className="w-[440px] shrink-0">
            <p className="text-[15px] font-semibold text-padi">Alur masukan</p>
            <h2 className="display mt-4 text-[4rem] leading-[1]">
              Ke mana suaramu <em className="text-padi">mengalir?</em>
            </h2>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-kertas/80">
              Geser pelan ke bawah. Ikuti aliran sebuah masukan dari tangan warga
              sampai ke pengelola desa.
            </p>
          </div>

          <div className="relative flex gap-20">
            <svg
              aria-hidden="true"
              viewBox="0 0 1400 120"
              preserveAspectRatio="none"
              className="absolute left-0 top-0 h-[120px] w-[1400px]"
            >
              <path
                d="M0 62 C 160 10, 300 110, 470 62 S 760 10, 930 62 S 1220 110, 1400 50"
                fill="none"
                stroke="#f4efdd"
                strokeOpacity="0.15"
                strokeWidth="2"
              />
              <motion.path
                d="M0 62 C 160 10, 300 110, 470 62 S 760 10, 930 62 S 1220 110, 1400 50"
                fill="none"
                stroke="#f2c94c"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ pathLength: halus }}
              />
            </svg>
            {singgah.map((s, i) => (
              <Singgah key={s.judul} s={s} progres={halus} titik={0.15 + i * 0.2} />
            ))}
          </div>

          <motion.figure
            style={{ scale: fotoSkala, borderRadius: fotoRadius, transformOrigin: "100% 50%" }}
            className="relative h-[72vh] w-[58vw] shrink-0 overflow-hidden"
          >
            <img
              src="/assets/image/BgLogin.jpeg"
              alt="Pawai warga dan pelajar membawa bendera merah putih di jalan desa"
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hutan-deep via-hutan-deep/80 to-transparent p-10 pt-24">
              <p className="display max-w-lg text-[2.4rem] leading-tight">
                Desa bergerak ketika warganya ikut <em className="text-padi">bicara.</em>
              </p>
            </figcaption>
          </motion.figure>
        </motion.div>

        <div className="px-5 py-24 md:px-10 lg:hidden">
          <p className="text-[15px] font-semibold text-padi">Alur masukan</p>
          <h2 className="display mt-4 text-[clamp(2.4rem,9vw,3.6rem)] leading-[1.02]">
            Ke mana suaramu <em className="text-padi">mengalir?</em>
          </h2>
          <ol className="relative mt-14 space-y-14 border-l-2 border-kertas/15 pl-8">
            {singgah.map((s) => (
              <motion.li
                key={s.judul}
                className="relative"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, ease }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[43px] top-2 block h-5 w-5 rounded-full border-[3px] border-padi bg-hutan"
                />
                <h3 className="display text-[1.8rem] leading-tight">{s.judul}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-kertas/80">{s.isi}</p>
                {s.tautan && (
                  <Link href={s.tautan.href} className="link-line mt-4 inline-block py-2 font-semibold text-padi">
                    {s.tautan.label}
                  </Link>
                )}
              </motion.li>
            ))}
          </ol>
          <figure className="relative mt-16 overflow-hidden rounded-[24px]">
            <img
              src="/assets/image/BgLogin.jpeg"
              alt="Pawai warga dan pelajar membawa bendera merah putih di jalan desa"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hutan-deep via-hutan-deep/85 to-transparent p-6 pt-20">
              <p className="display text-[1.8rem] leading-tight">
                Desa bergerak ketika warganya ikut <em className="text-padi">bicara.</em>
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
