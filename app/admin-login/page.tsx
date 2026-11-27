"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ADMIN_EMAIL, auth, terjemahkanError } from "@/lib/firebaseConfig";
import AuthShell, { Pemuat, Pesan } from "@/components/ui/AuthShell";
import Field from "@/components/ui/Field";

export default function AdminLogin() {
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
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user.email === ADMIN_EMAIL) {
        router.push("/admin");
        return;
      }
      await signOut(auth);
      setGalat("Akun ini bukan akun pengelola. Warga bisa masuk lewat halaman masuk biasa.");
    } catch (err) {
      setGalat(terjemahkanError(err));
    }
    setMemuat(false);
  };

  return (
    <AuthShell
      foto="/assets/image/BgKritik.jpg"
      alt="Warga bermusyawarah di pendopo"
      kutipan={
        <>
          Setiap tulisan yang masuk adalah suara yang menunggu <em className="text-padi">dibaca.</em>
        </>
      }
      judul="Ruang pengelola"
      pengantar="Khusus pengelola Suara Desa untuk membaca kritik dan saran warga."
    >
      <form onSubmit={masuk} className="space-y-8">
        <Field label="Email pengelola" type="email" value={email} onChange={setEmail} autoComplete="email" />
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
              Memeriksa <Pemuat />
            </>
          ) : (
            "Masuk sebagai pengelola"
          )}
        </button>
      </form>
      <p className="mt-8 text-[15px] text-lumut">
        Bukan pengelola?{" "}
        <Link href="/Login" className="link-line font-semibold text-bata">
          Masuk sebagai warga
        </Link>
      </p>
    </AuthShell>
  );
}
