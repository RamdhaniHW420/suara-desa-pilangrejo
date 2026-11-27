import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MotionRoot from "@/components/ui/MotionRoot";

export const metadata: Metadata = {
  title: "Suara Desa Pilangrejo",
  description:
    "Ruang warga Desa Pilangrejo, Juwangi, Boyolali untuk menyampaikan kritik, saran, dan gagasan bagi kemajuan desa.",
};

export const viewport: Viewport = {
  themeColor: "#1d3627",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <MotionRoot>
          <a
            href="#isi"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-padi focus:px-5 focus:py-3 focus:text-hutan-deep"
          >
            Lompat ke isi
          </a>
          <Navbar />
          <main id="isi">{children}</main>
          <Footer />
        </MotionRoot>
      </body>
    </html>
  );
}
