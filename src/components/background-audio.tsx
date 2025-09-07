"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Play, Pause } from "lucide-react";

interface BackgroundAudioProps {
  src: string;
  loop?: boolean;
  volume?: number;
  className?: string;
  autoplay?: boolean;
}

export function BackgroundAudio({
  src,
  loop = true,
  volume = 0.3,
  className = "",
  autoplay = false
}: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Set volume when component mounts or volume prop changes
  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = parseFloat(e.target.value);
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="flex items-center gap-2">
          {/* Audio element */}
          <audio
            ref={audioRef}
            src={src}
            loop={loop}
            autoPlay={autoplay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={(e) => console.error("Audio error:", e)}
          />

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Mute Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0"
          >
            <Volume2 className="h-4 w-4" />
          </Button>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
}
