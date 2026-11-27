"use client";
import { motion } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] bg-padi"
        initial={{ clipPath: "ellipse(150% 140% at 50% 0%)" }}
        animate={{ clipPath: "ellipse(150% 0% at 50% 0%)" }}
        transition={{ duration: 1, ease, delay: 0.12 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[61] bg-hutan-deep"
        initial={{ clipPath: "ellipse(150% 140% at 50% 0%)" }}
        animate={{ clipPath: "ellipse(150% 0% at 50% 0%)" }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      >
        {children}
      </motion.div>
    </>
  );
}
