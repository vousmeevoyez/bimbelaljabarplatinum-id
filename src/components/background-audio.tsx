"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);

  // Set volume when component mounts or volume prop changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Force autoplay strategies
  useEffect(() => {
    if (!autoplay) return;

    const attemptAutoplay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        // Set audio properties for autoplay
        audio.muted = false;
        audio.volume = volume;
        
        // Try to play immediately
        await audio.play();
        setIsPlaying(true);
        setHasUserInteracted(true);
        setShowPlayPrompt(false);
      } catch (error) {
        console.log("Autoplay blocked, waiting for user interaction");
        setShowPlayPrompt(true);
        
        // Set up multiple interaction listeners
        const enableAudio = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            setHasUserInteracted(true);
            setShowPlayPrompt(false);
            
            // Remove all listeners after successful play
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            document.removeEventListener('scroll', enableAudio);
          } catch (err) {
            console.error("Still unable to play audio:", err);
          }
        };

        // Add multiple event listeners for user interaction
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('scroll', enableAudio, { once: true });
      }
    };

    // Small delay to ensure audio element is ready
    const timer = setTimeout(attemptAutoplay, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', () => {});
      document.removeEventListener('touchstart', () => {});
      document.removeEventListener('keydown', () => {});
      document.removeEventListener('scroll', () => {});
    };
  }, [autoplay, volume]);

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
    <>
      {/* Visual prompt for user interaction when autoplay is blocked */}
      {showPlayPrompt && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border max-w-sm mx-4">
            <div className="text-center">
              <div className="mb-4">
                <Volume2 className="h-12 w-12 mx-auto text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enable Audio</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click anywhere, scroll, or press any key to start the background music.
              </p>
              <Button 
                onClick={togglePlayPause}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Music
              </Button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}
