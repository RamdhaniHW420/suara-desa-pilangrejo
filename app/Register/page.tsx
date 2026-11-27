"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, terjemahkanError } from "@/lib/firebaseConfig";
import AuthShell, { Pemuat, Pesan } from "@/components/ui/AuthShell";
import Field from "@/components/ui/Field";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);
  const router = useRouter();

  const daftar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalat(null);
    if (password !== konfirmasi) {
      setGalat("Kata sandi dan konfirmasinya belum sama.");
      return;
    }
    setMemuat(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/Kritik&Saran");
    } catch (err) {
      setGalat(terjemahkanError(err));
      setMemuat(false);
    }
  };

  return (
    <AuthShell
      foto="/assets/image/BgRegister.jpeg"
      alt="Warga bergotong royong memangkas dahan pohon"
      kutipan={
        <>
          Kerja bakti dimulai dari satu orang yang <em className="text-padi">mengajak.</em>
        </>
      }
      judul="Buat akun warga"
      pengantar="Cukup email dan kata sandi. Setelah terdaftar, kamu langsung diarahkan ke formulir kritik dan saran."
    >
      <form onSubmit={daftar} className="space-y-8">
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Kata sandi"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={6}
          petunjuk="Minimal 6 karakter."
        />
        <Field
          label="Ulangi kata sandi"
          type="password"
          value={konfirmasi}
          onChange={setKonfirmasi}
          autoComplete="new-password"
          minLength={6}
        />
        {galat && <Pesan jenis="galat">{galat}</Pesan>}
        <button type="submit" disabled={memuat} className="btn-hutan w-full disabled:opacity-70">
          {memuat ? (
            <>
              Membuat akun <Pemuat />
            </>
          ) : (
            "Daftar"
          )}
        </button>
      </form>
      <p className="mt-8 text-[15px] text-lumut">
        Sudah punya akun?{" "}
        <Link href="/Login" className="link-line font-semibold text-bata">
          Masuk di sini
        </Link>
      </p>
    </AuthShell>
  );
}
