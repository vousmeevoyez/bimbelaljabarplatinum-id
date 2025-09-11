import NavFooterLayout from "@/layouts/NavFooterLayout";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AJP EXPO 2025",
  description: "Hai! kawan-kawan seluruh nusantara👋🏻 Ikuti lomba matematika nasional yuk, hadiah jutaan rupiah, sertifikat goes to terkurasi puspresnas plus dapat kisi-kisi soal sesuai materi sekolah. Info lengkap klik https://bimbelaljabarplatinum.id/",
  openGraph: {
    title: "AJP EXPO 2025",
    description: "Hai! kawan-kawan seluruh nusantara👋🏻 Ikuti lomba matematika nasional yuk, hadiah jutaan rupiah, sertifikat goes to terkurasi puspresnas plus dapat kisi-kisi soal sesuai materi sekolah. Info lengkap klik https://bimbelaljabarplatinum.id/",
    type: "website",
    url: "https://bimbelaljabarplatinum.id/",
    images: [{ url: "https://bimbelaljabarplatinum.id/PosterV2.png", width: 1200, height: 630, alt: "Merchants overview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AJP EXPO 2025",
    description: "Hai! kawan-kawan seluruh nusantara👋🏻 Ikuti lomba matematika nasional yuk, hadiah jutaan rupiah, sertifikat goes to terkurasi puspresnas plus dapat kisi-kisi soal sesuai materi sekolah. Info lengkap klik https://bimbelaljabarplatinum.id/",
    images: ["https://bimbelaljabarplatinum.id/PosterV2.png"],
  },
  alternates: { canonical: "https://bimbelaljabarplatinum.id/" },
  robots: { index: true, follow: true },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <NavFooterLayout>{children}</NavFooterLayout>;
}

