"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const kalimat = "Ada yang ingin kamu sampaikan untuk Pilangrejo?";

function Kata({
  teks,
  rentang,
  progres,
}: {
  teks: string;
  rentang: [number, number];
  progres: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progres, rentang, [0.18, 1]);
  const y = useTransform(progres, rentang, [14, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.25em] inline-block">
      {teks}
    </motion.span>
  );
}

export default function Ajakan() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] });
  const kata = kalimat.split(" ");

  return (
    <section ref={ref} className="on-light bg-kertas px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-5xl">
        <h2
          aria-label={kalimat}
          className="display text-[clamp(2.4rem,7vw,5.6rem)] leading-[1.02] text-hutan"
        >
          <span aria-hidden="true">
            {kata.map((k, i) => (
              <Kata
                key={i}
                teks={k}
                progres={scrollYProgress}
                rentang={[i / kata.length, (i + 1) / kata.length]}
              />
            ))}
          </span>
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center"
        >
          <Link href="/Kritik&Saran" className="btn-hutan">
            Tulis kritik &amp; saran
          </Link>
          <p className="max-w-sm text-[15px] leading-relaxed text-lumut">
            Butuh akun warga dulu. Belum punya?{" "}
            <Link href="/Register" className="link-line font-semibold text-bata">
              Daftar di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
