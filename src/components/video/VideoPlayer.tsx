'use client';

import { useState, useRef } from 'react';
import { PlayIcon, FullscreenIcon } from '@/components/ui';
import { formatDuration } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  duration?: number;
}

export function VideoPlayer({ src, poster, duration = 0 }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <PlayIcon className="w-6 h-6 text-dark-900 ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Progress Bar */}
        <div className="relative h-1 bg-white/30 rounded-full mb-3">
          <div
            className="absolute h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white text-sm">
          <span>{formatDuration(Math.floor(currentTime))} / {formatDuration(duration)}</span>
          <button
            onClick={handleFullscreen}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <FullscreenIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}



