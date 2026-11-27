"use client";
import { motion } from "framer-motion";

type Kata = { teks: string; className?: string };

type Props = {
  baris: Kata[][];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  saatTerlihat?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function RiseText({
  baris,
  className,
  delay = 0,
  as = "h2",
  saatTerlihat = false,
}: Props) {
  const Tag = motion[as];
  const label = baris.map((b) => b.map((k) => k.teks).join(" ")).join(" ");
  let urutan = 0;

  const trigger = saatTerlihat
    ? { whileInView: "tampil", viewport: { once: true, amount: 0.5 } }
    : { animate: "tampil" };

  return (
    <Tag className={className} aria-label={label} initial="sembunyi" {...trigger}>
      {baris.map((kata, i) => (
        <span key={i} className="block" aria-hidden="true">
          {kata.map((k) => {
            const idx = urutan++;
            return (
              <span
                key={idx}
                className="inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className={`inline-block ${k.className ?? ""}`}
                  variants={{
                    sembunyi: { y: "110%", rotate: 4 },
                    tampil: {
                      y: "0%",
                      rotate: 0,
                      transition: { duration: 1.1, ease, delay: delay + idx * 0.08 },
                    },
                  }}
                  style={{ transformOrigin: "0% 100%" }}
                >
                  {k.teks}
                </motion.span>
                {" "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
