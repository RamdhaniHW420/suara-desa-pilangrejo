"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { auth } from "@/lib/firebaseConfig";

const tautan = [
  { href: "/", label: "Beranda" },
  { href: "/#kisah", label: "Kisah" },
  { href: "/#alur", label: "Alur masukan" },
  { href: "/Kritik&Saran", label: "Kirim suara" },
];

const ease = [0.76, 0, 0.24, 1] as const;

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [siap, setSiap] = useState(false);
  const [buka, setBuka] = useState(false);
  const [tersembunyi, setTersembunyi] = useState(false);
  const [padat, setPadat] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setSiap(true);
    });
  }, []);

  useEffect(() => setBuka(false), [pathname]);

  useEffect(() => {
    if (!buka) return;
    const tutup = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("keydown", tutup);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tutup);
      document.body.style.overflow = "";
    };
  }, [buka]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const sebelum = scrollY.getPrevious() ?? 0;
    setTersembunyi(y > sebelum && y > 240 && !buka);
    setPadat(y > 40);
  });

  const keluar = async () => {
    await signOut(auth);
    router.push("/Login");
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          padat || buka || pathname !== "/" ? "bg-hutan-deep/95" : "bg-transparent"
        }`}
        animate={{ y: tersembunyi ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-10"
        >
          <Link href="/" className="relative z-10 flex items-center" aria-label="Suara Desa, ke beranda">
            <img
              src="/assets/image/LogoSuaraDesa.png"
              alt=""
              width={84}
              height={50}
              className="h-[50px] w-auto"
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {tautan.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="link-line text-[15px] font-medium text-kertas/90 hover:text-kertas"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden min-w-[110px] justify-end sm:flex">
              {siap &&
                (user ? (
                  <button onClick={keluar} className="btn-ghost min-h-[44px] px-5 text-sm">
                    Keluar
                  </button>
                ) : (
                  <Link href="/Login" className="btn-padi min-h-[44px] px-5 text-sm">
                    Masuk
                  </Link>
                ))}
            </div>

            <button
              type="button"
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-kertas/30 lg:hidden"
              aria-expanded={buka}
              aria-controls="menu-ponsel"
              aria-label={buka ? "Tutup menu" : "Buka menu"}
              onClick={() => setBuka((v) => !v)}
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  className="absolute left-0 top-0 h-[2px] w-5 bg-kertas"
                  animate={buka ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] w-5 bg-kertas"
                  animate={buka ? { bottom: 5, rotate: -45 } : { bottom: 0, rotate: 0 }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {buka && (
          <motion.div
            id="menu-ponsel"
            className="grain fixed inset-0 z-40 flex flex-col justify-between bg-hutan-deep px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 42px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 42px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 42px) 36px)" }}
            transition={{ duration: 0.75, ease }}
          >
            <ul className="space-y-2">
              {tautan.map((t, i) => (
                <li key={t.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.07 }}
                  >
                    <Link
                      href={t.href}
                      onClick={() => setBuka(false)}
                      className="display block py-2 text-[2.6rem] leading-tight text-kertas"
                    >
                      {t.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {siap &&
                (user ? (
                  <button onClick={keluar} className="btn-ghost w-full">
                    Keluar dari akun
                  </button>
                ) : (
                  <Link href="/Login" className="btn-padi w-full">
                    Masuk ke akun
                  </Link>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
