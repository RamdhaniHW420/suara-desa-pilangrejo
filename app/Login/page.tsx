"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, terjemahkanError } from "@/lib/firebaseConfig";
import AuthShell, { Pemuat, Pesan } from "@/components/ui/AuthShell";
import Field from "@/components/ui/Field";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);
  const router = useRouter();

  const masuk = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalat(null);
    setMemuat(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Kritik&Saran");
    } catch (err) {
      setGalat(terjemahkanError(err));
      setMemuat(false);
    }
  };

  return (
    <AuthShell
      foto="/assets/image/BgLogin.jpeg"
      alt="Pawai warga membawa bendera merah putih"
      kutipan={
        <>
          Kembali lagi. Ada cerita apa dari <em className="text-padi">dusunmu</em> hari ini?
        </>
      }
      judul="Masuk ke akun warga"
      pengantar="Masuk untuk menulis kritik dan saran bagi Desa Pilangrejo."
    >
      <form onSubmit={masuk} className="space-y-8" noValidate={false}>
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Kata sandi"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        {galat && <Pesan jenis="galat">{galat}</Pesan>}
        <button type="submit" disabled={memuat} className="btn-hutan w-full disabled:opacity-70">
          {memuat ? (
            <>
              Memeriksa akun <Pemuat />
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>
      <p className="mt-8 text-[15px] text-lumut">
        Belum punya akun?{" "}
        <Link href="/Register" className="link-line font-semibold text-bata">
          Daftar sebagai warga
        </Link>
      </p>
      <p className="mt-3 text-[15px] text-lumut">
        Pengelola desa?{" "}
        <Link href="/admin-login" className="link-line font-semibold text-bata">
          Masuk sebagai admin
        </Link>
      </p>
    </AuthShell>
  );
}
