"use client";
import { motion } from "framer-motion";

type Props = {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  saatTerlihat?: boolean;
  prioritas?: boolean;
};

const ease = [0.65, 0, 0.35, 1] as const;

export default function Gapura({
  src,
  alt,
  className = "",
  delay = 0,
  saatTerlihat = true,
  prioritas = false,
}: Props) {
  const trigger = saatTerlihat
    ? { whileInView: "tampil", viewport: { once: true, amount: 0.35 } }
    : { animate: "tampil" };

  return (
    // Pengamat dipasang di pembungkus: clip-path 100% membuat elemen yang terpotong dianggap tidak terlihat.
    <motion.div className={className} initial="sembunyi" {...trigger}>
      <motion.figure
        className="relative h-full w-full overflow-hidden rounded-gapura bg-hutan-soft"
        variants={{
          sembunyi: {
            clipPath: "inset(100% 0% 0% 0% round 999px 999px 18px 18px)",
          },
          tampil: {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 18px 18px)",
            transition: { duration: 1.4, ease, delay },
          },
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading={prioritas ? "eager" : "lazy"}
          className="h-full w-full object-cover"
          variants={{
            sembunyi: { scale: 1.35 },
            tampil: { scale: 1, transition: { duration: 1.8, ease, delay } },
          }}
        />
      </motion.figure>
    </motion.div>
  );
}
