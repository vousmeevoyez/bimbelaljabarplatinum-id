import { BackgroundAudio } from "@/components/background-audio";
import { CountdownTimer } from "@/components/countdown-timer";

export default async function GalleriesIndexPage() {
    const targetDate = new Date("2025-09-08T00:00:00");

    return <>
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <CountdownTimer targetDate={targetDate} className="mb-8" />

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-4xl aspect-video shadow-md overflow-hidden rounded-lg">
                <iframe
                  loading="lazy"
                  className="absolute w-full h-full top-0 left-0 border-0"
                  src="https://www.canva.com/design/DAGyQowAtU0/bh9FdhaEFqQP1zgn4HmpEA/view?embed"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

      <BackgroundAudio
        src="/audio-bimbelaljabarplatinum-id-compressed.mp3"
        loop
        volume={0.3}
        autoplay
      />
    </>
}

