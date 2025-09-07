import { ArrowRight, FileDown } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CountdownTimer } from "@/components/countdown-timer";

export default function Landing() {
      const targetDate = new Date("2025-09-10T00:00:00");

  const features = [
  { title: "Yayasan Suara Pelajar Indonesia", description: "Menaungi 2 sekolah: SDI Plus Darul Ulum Limo SMP Islam Darul Ulum Ilmi Limo", image: "/card-1.png", bgColor: "bg-emc-blue" },
  { title: "Materi sesuai kurikulum sekolah dan kisi-kisi soal komplit dengan cara-cara cepat", description: "Karena soal-soal lomba sesuai dengan materi sekolah, maka kamu yang tidak suka menjadi suka matematika setelah mengikuti lomba", image: "/card-2.png", bgColor: "bg-emc-blue" },
  { title: "BIMBEL ALJABAR PLATINUM", description: "Tips dan Trik Matematika", image: "/card-3.png", bgColor: "bg-emc-blue" },
  { title: "Goes to Kurasi Puspresnas", description: "Sebagai bentuk apresiasi, kamu akan mendapatkan sertifikat elektronik dan uang tunai", image: "/card-4.png", bgColor: "bg-emc-blue" },
];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden" style={{ backgroundImage: 'url(/bg-1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>

        {/* Header Banner - Centered and Transparent */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <h1 className="md:text-2xl text-xl font-bold text-white mb-2">
            Membumikan Matematika
          </h1>
          <div className="w-48 h-1 bg-yellow-400 mx-auto rounded"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div className="text-white space-y-6 md:mt-12 mt-24">
    <h1 className="md:text-3xl text-2xl font-bold leading-tight mt-10">
      Lomba Matematika Nasional No 1 di Indonesia dengan materi sesuai kurikulum sekolah.
    </h1>

    <p className="text-xl text-white">
      Mendukung Materi SD, SMP, hingga SMA (TKA dan UTBK).
    </p>

            <div className="flex flex-col gap-4 items-start">
<a
  href="https://docs.google.com/document/d/1PCtFpuN7aHbpEAqDQaPdrJqsUSmlh4336QpYamsNBS0/edit?tab=t.0"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="inline-flex items-center justify-start gap-2 min-w-[250px] bg-[#1f6dc2] hover:bg-emc-yellow/90 text-[#fbde0e] font-bold rounded-full px-6 py-3">
    <FileDown /> Juknis AJP Expo 2025
  </Button>
</a>
<a
  href="/flyer.png"
  download
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="inline-flex items-center justify-start gap-2 min-w-[250px] bg-[#1f6dc2] hover:bg-emc-yellow/90 text-[#fbde0e] font-bold rounded-full px-6 py-3">
    <FileDown /> Poster Lomba
  </Button>
</a>
<a
  href="https://bimbelaljabarplatinum.id"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="inline-flex items-center justify-start gap-2 min-w-[250px] bg-[#1f6dc2] hover:bg-emc-yellow/90 text-[#fbde0e] font-bold rounded-full px-6 py-3">
    <FileDown /> Kisi Kisi Soal Lomba
  </Button>
</a>
              <a
  href="https://forms.gle/dRzBoPXPt677MyMVA"
  target="_blank"
  rel="noopener noreferrer"
>
                <Button className="inline-flex items-center justify-center gap-3 min-w-[320px] bg-green-600 hover:bg-green-700 text-white font-extrabold text-xl rounded-full px-12 py-6 shadow-xl transform hover:scale-105 transition">
  <ArrowRight size={22} /> Daftar Sekarang
</Button>
</a>

</div>
  </div>
</div>

      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-emc-blue mb-8">
            Pendaftaran EMC akan ditutup dalam..
          </h2>

          <div className="flex justify-center gap-6 mb-8">
            <CountdownTimer  targetDate={targetDate}/>
          </div>
        </div>
      </section>

      {/* Why Join EMC Section */}
<section
  className="relative flex items-center overflow-hidden py-12"
  style={{ backgroundImage: 'url(/bg-2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
>
  <div className="mx-auto w-full max-w-7xl px-6">
    <h2 className="text-4xl font-bold text-[#fbde0e] text-center mb-12 mt-4">
      Kenapa Harus Ikut AJP Expo ?
    </h2>

    <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {features.map((item) => (
        <Card key={item.title} className={`${item.bgColor} text-white border-0 overflow-hidden relative rounded-2xl shadow-lg h-full`}>
          <CardContent className="p-8 text-center relative z-10 flex flex-col items-center h-full">
            <div className="mb-6">
              <Image src={item.image} alt={item.title} width={480} height={480} className="mx-auto h-64 w-64 object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-emc-yellow mb-3">{item.title}</h3>
            <p className="text-base text-blue-100">{item.description}</p>
            <div className="mt-auto" />
          </CardContent>

          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-4 h-4 bg-orange-400 rounded-full opacity-70" />
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-green-400 rounded-full opacity-60" />
          <div className="absolute top-1/2 right-4 text-emc-yellow text-lg">⚡</div>
        </Card>
      ))}
    </div>
  </div>
</section>


    </div>
  );
}
