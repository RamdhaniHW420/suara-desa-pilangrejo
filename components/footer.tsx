"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const bukit = [
  {
    d: "M0 120 C 180 40, 340 40, 520 95 S 860 150, 1040 70 S 1300 30, 1440 90 L1440 200 L0 200 Z",
    warna: "#2c4a37",
    geser: [60, 0],
  },
  {
    d: "M0 150 C 240 90, 420 120, 640 140 S 1020 80, 1220 120 S 1380 150, 1440 130 L1440 200 L0 200 Z",
    warna: "#1d3627",
    geser: [30, 0],
  },
  {
    d: "M0 175 C 300 150, 520 185, 820 170 S 1240 150, 1440 172 L1440 200 L0 200 Z",
    warna: "#12251a",
    geser: [0, 0],
  },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y0 = useTransform(scrollYProgress, [0, 1], bukit[0].geser);
  const y1 = useTransform(scrollYProgress, [0, 1], bukit[1].geser);
  const lapisan = [y0, y1];

  return (
    <footer ref={ref} className="relative bg-kertas text-kertas">
      <div className="relative h-[90px] overflow-hidden md:h-[150px]" aria-hidden="true">
        {bukit.map((b, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-full w-full"
            style={i < 2 ? { y: lapisan[i] } : undefined}
          >
            <path d={b.d} fill={b.warna} />
          </motion.svg>
        ))}
      </div>

      <div className="grain bg-hutan-deep">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-10 pt-6 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
          <div>
            <p className="display text-4xl leading-tight md:text-5xl">
              Desa <em className="text-padi">Pilangrejo</em>
            </p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-kertas/75">
              Kecamatan Juwangi, Kabupaten Boyolali, Jawa Tengah.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-padi">Hubungi kantor desa</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <a href="tel:+6288221394411" className="link-line text-kertas/90 hover:text-kertas">
                  0882 2139 4411
                </a>
              </li>
              <li className="break-all">
                <a
                  href="mailto:loketonline.desapilangrejo7@gmail.com"
                  className="link-line text-kertas/90 hover:text-kertas"
                >
                  loketonline.desapilangrejo7@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-padi">Alamat</p>
            <address className="mt-4 text-[15px] not-italic leading-relaxed text-kertas/80">
              Jl. Juwangi - Guwo Km. 1, Ds. Pilangrejo, Kec. Juwangi, Kab. Boyolali 57391
            </address>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-kertas/15 px-5 py-6 text-sm text-kertas/70 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>&copy; {new Date().getFullYear()} Desa Pilangrejo</p>
          <Link href="/Kritik&Saran" className="link-line w-fit text-kertas/90 hover:text-padi">
            Sampaikan kritik dan saran
          </Link>
        </div>
      </div>
    </footer>
  );
}
