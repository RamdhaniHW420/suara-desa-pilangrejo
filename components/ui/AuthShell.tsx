"use client";
import { motion } from "framer-motion";
import Gapura from "@/components/ui/Gapura";
import RiseText from "@/components/ui/RiseText";

type Props = {
  foto: string;
  alt: string;
  kutipan: React.ReactNode;
  judul: string;
  pengantar: string;
  children: React.ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function AuthShell({ foto, alt, kutipan, judul, pengantar, children }: Props) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[1fr_1.05fr]">
      <aside className="grain relative hidden overflow-hidden bg-hutan-deep px-12 pb-16 pt-32 text-kertas lg:flex lg:flex-col lg:justify-between">
        <Gapura src={foto} alt={alt} className="aspect-[4/5] w-full max-w-[360px]" saatTerlihat={false} delay={0.5} prioritas />
        <motion.p
          className="display mt-12 max-w-md text-[2.2rem] leading-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.1 }}
        >
          {kutipan}
        </motion.p>
      </aside>

      <div className="on-light flex items-center bg-kertas px-5 pb-20 pt-32 md:px-16">
        <div className="mx-auto w-full max-w-md">
          <RiseText
            as="h1"
            delay={0.45}
            className="display text-[clamp(2.6rem,6vw,3.8rem)] leading-[1] text-hutan"
            baris={[judul.split(" ").map((teks) => ({ teks }))]}
          />
          <motion.p
            className="mt-4 text-[16px] leading-relaxed text-lumut"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            {pengantar}
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.9 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Pesan({ jenis, children }: { jenis: "galat" | "sukses"; children: React.ReactNode }) {
  return (
    <motion.p
      role={jenis === "galat" ? "alert" : "status"}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className={`overflow-hidden rounded-xl px-4 py-3 text-[15px] ${
        jenis === "galat" ? "bg-bata/10 text-bata" : "bg-hutan/10 text-hutan"
      }`}
    >
      {children}
    </motion.p>
  );
}

export function Pemuat() {
  return (
    <span aria-hidden="true" className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-current"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </span>
  );
}
