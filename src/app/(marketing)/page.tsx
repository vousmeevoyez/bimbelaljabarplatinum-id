import { ArrowRight, FileDown, Instagram, Facebook, Phone, MapPinHouse } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CountdownTimer } from "@/components/countdown-timer";
import { BackgroundAudio } from '@/components/background-audio';

export default function Landing() {
      const targetDate = new Date("2025-09-10T00:00:00");

  const features = [
  { title: "Yayasan Suara Pelajar Indonesia", description: "Menaungi 2 sekolah: SDI Plus Darul Ulum Limo SMP Islam Darul Ulum Ilmi Limo", image: "/card-1.png", bgColor: "bg-emc-blue" },
  { title: "Materi sesuai kurikulum sekolah dan kisi-kisi soal komplit dengan cara-cara cepat", description: "Karena soal-soal lomba sesuai dengan materi sekolah, maka kamu yang tidak suka menjadi suka matematika setelah mengikuti lomba", image: "/card-2.png", bgColor: "bg-emc-blue" },
  { title: "BIMBEL ALJABAR PLATINUM", description: "Tips dan Trik Matematika", image: "/card-3.jpeg", bgColor: "bg-emc-blue" },
  { title: "Goes to Kurasi Puspresnas", description: "Sebagai bentuk apresiasi, kamu akan mendapatkan sertifikat elektronik dan uang tunai", image: "/card-4.png", bgColor: "bg-emc-blue" },
];

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden" style={{ backgroundImage: 'url(/bg-1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>

        {/* Header Banner - Centered and Transparent */}
<div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
  <div className="flex items-center justify-center space-x-4">
    <Image src="/LOGO.png" alt="Left Logo" width={80} height={80} className="w-20 h-20" />
    <h1 className="md:text-2xl text-xl font-bold text-[#fbde0e] mb-2">
      Membumikan Matematika
    </h1>
    <Image src="/LOGO3.png" alt="Right Logo" width={80} height={80}/>
  </div>
  <div className="w-48 h-1 bg-yellow-400 mx-auto rounded"></div>
</div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center md:pt-8">
  <div className="text-white space-y-6 md:mt-12 mt-24">
    <h1 className="md:text-3xl text-2xl font-bold leading-tight mt-10">
      Lomba Matematika Nasional No 1 di Indonesia dengan materi sesuai kurikulum sekolah.
    </h1>

    <p className="text-xl text-black">
      Mendukung Materi SD, SMP, hingga SMA (TKA dan UTBK).
    </p>

            <div className="flex flex-col gap-4 items-start">
<a
  href="https://docs.google.com/document/d/1PCtFpuN7aHbpEAqDQaPdrJqsUSmlh4336QpYamsNBS0/edit?tab=t.0"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="inline-flex items-center justify-start gap-2 min-w-[250px] bg-[#1f6dc2] hover:bg-emc-yellow/90 text-white font-bold rounded-full px-6 py-3">
    <FileDown /> Juknis AJP Expo 2025
  </Button>
</a>
<a
  href="https://drive.google.com/file/d/1IJLg5xLpCCTkjFZ54v0yDHWumyjHNK_I/view"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="inline-flex items-center justify-start gap-2 min-w-[250px] bg-[#1f6dc2] hover:bg-emc-yellow/90 text-white font-bold rounded-full px-6 py-3">
    <FileDown /> Poster Lomba
  </Button>
</a>
<a
  href="https://bimbelaljabarplatinum.id/products"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="inline-flex items-center justify-start gap-2 min-w-[250px] bg-[#1f6dc2] hover:bg-emc-yellow/90 text-white font-bold rounded-full px-6 py-3">
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
            Pendaftaran AJP akan ditutup dalam..
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
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


        {/* Prizes Section */}

<section
  className="relative flex items-center overflow-hidden py-12"
  style={{ backgroundImage: 'url(/bg-2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
>
  <div className="max-w-7xl mx-auto px-6">

    {/* Centered Heading */}
    <h2 className="text-4xl font-bold text-[#fbde0e] mb-12 text-center">
            Hadiah dan Juara
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Placeholder Image */}
      <div className="flex justify-center">
        <Image
          src="/trophy.png"
          alt="Winner Podium"
          width={400}
          height={400}
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Right: Prizes */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              rank: "Juara 1",
              color: "bg-emc-pink",
              medal: "Medali Emas",
              savings: "Rp1.500.000",
              benefits: ["Sertifikat Pemenang Goes to Terkurasi Puspresnas", "Trophy & Piagam Penghargaan (untuk juara tiap jenjang)", "Benefit tambahan sesuai kebijakan panitia"]
            },
            {
              rank: "Juara 2",
              color: "bg-emc-turquoise",
              medal: "Medali Perak",
              savings: "Rp1.000.000",
              benefits: ["Sertifikat Pemenang Goes to Terkurasi Puspresnas", "Trophy & Piagam Penghargaan (untuk juara tiap jenjang)", "Benefit tambahan sesuai kebijakan panitia"]
            },
            {
              rank: "Juara 3",
              color: "bg-emc-pink",
              medal: "Medali Perunggu",
              savings: "Rp750.000",
              benefits: ["Sertifikat Pemenang Goes to Terkurasi Puspresnas", "Trophy & Piagam Penghargaan (untuk juara tiap jenjang)", "Benefit tambahan sesuai kebijakan panitia"]
            },
          ].map((prize, index) => (
            <Card key={index} className="border-0 bg-[#fbde0e] overflow-hidden shadow-md">
              <div className={`text-black text-center font-bold`}>
                {prize.rank}
              </div>
              <CardContent className="p-4 space-y-2 text-sm text-left">
                <div>• Uang Tunai {prize.savings}</div>
                {prize.benefits.map((benefit, i) => (
                  <div key={i}>• {benefit}</div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

       {/* Gallery Section */}
<section
  className="relative flex items-center overflow-hidden py-12"
  style={{ backgroundImage: 'url(/bg-2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#fbde0e] text-center mb-12">
            Galeri YASPI
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {[
              "/wa-1.jpeg",
              "/wa-2.jpeg",
              "/wa-3.jpeg",
              "/wa-4.jpeg",
              "/wa-5.jpeg",
              "/wa-6.jpeg",
            ].map((src, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

       {/* Gallery Section */}
<section
  className="relative flex items-center overflow-hidden py-12"
  style={{ backgroundImage: 'url(/bg-2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#fbde0e] text-center mb-12">
            Galeri AJP
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {[
              "/wa-7.jpeg",
              "/wa-8.jpeg",
              "/wa-9.jpeg",
              "/wa-10.jpeg",
              "/wa-11.jpeg",
              "/wa-12.jpeg",
            ].map((src, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact & Social Section */}
      <section
        className="relative flex items-center overflow-hidden py-12"
        style={{ backgroundImage: 'url(/bg-2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#fbde0e] text-center mb-12">
            Hubungi Kami
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Social Links */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 transition shadow"
                >
                  <Phone className="group-hover:scale-110 transition text-white" />
                  <span className="font-semibold text-white">+62 895 1546 6266</span>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 transition shadow"
                >
                  <MapPinHouse className="group-hover:scale-110 transition text-white" />
                  <span className="font-semibold line-clamp-2 text-white">Bimbel Aljabar Platinum
JL Nubala, RT 04/RW17, Pisangan, Kec Ciputat, Kota Tangerang Selatan</span>
                </a>
                <a
                  href="https://www.instagram.com/aljabar_platinum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 transition shadow"
                >
                  <Instagram className="group-hover:scale-110 transition text-white" />
                  <span className="font-semibold text-white">@aljabar_platinum</span>
                </a>
                <a
                  href="https://facebook.com/BimbelAljabarPlatinum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 transition shadow"
                >
                  <Facebook className="group-hover:scale-110 transition text-white" />
                  <span className="font-semibold text-white">Bimbel AljabarPlatinum</span>
                </a>
              </div>
            </div>

            {/* Right: Map / CTA Card */}
            <div className="bg-white/10 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-md">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                <iframe
                  title="Lokasi Bimbel Aljabar Platinum"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={
                    "https://www.google.com/maps?q=JL%20Nubala%20Pisangan%20Ciputat%20Tangerang%20Selatan&output=embed"
                  }
                />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://maps.app.goo.gl/QCrhyGVDof3QtKvZ6?g_st=awb"
                  rel="noopener noreferrer"
                  className="text-center font-bold bg-green-600 hover:bg-green-700 rounded-xl py-3 shadow-lg"
                >
                    SDI Plus Darul ULUM
                </a>
                <a
                  href="https://maps.app.goo.gl/5iqt5hWZccMeq6Jh8?g_st=awb"
                  rel="noopener noreferrer"
                  className="text-center font-bold bg-black/70 hover:bg-black/80 rounded-xl py-3 shadow-lg"
                >
                    SMP Islam Darul Ilmi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner strip */}
      <div className="relative z-10 w-full">
        <div className="mx-6 mb-6 bg-red-600 text-white rounded-t-3xl shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
            <p className="font-extrabold tracking-wide">Partner By :</p>
            <p className="font-semibold">Yayasan Suara Pelajar Indonesia</p>
            <p className="text-white/95">
              JL Limo Raya 6, No 124, RT 06/ RW 01 Limo, Kec Limo, Kota Depok
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}

    </div>
            <BackgroundAudio
        src="/audio-bimbelaljabarplatinum-id-compressed.mp3"
        loop
        volume={0.3}
        autoplay
      />
    </>
  );
}
