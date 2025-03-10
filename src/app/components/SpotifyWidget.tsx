import { useState, useEffect } from "react";
import io from "socket.io-client";
import Image from "next/image";
import * as ProgressPrimitive from "@radix-ui/react-progress";
interface Track {
  name: string;
  artist: string;
  albumArt: string;
  albumName: string;
  isPlaying: boolean;
}

const SpotifyWidget = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const socket = io();
    socket.on("now-playing", (data) => {
      setTrack(data);
      setProgress(data.progressMs);
      setDuration(data.durationMs);
      setIsPlaying(data.isPlaying);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Update progress every second when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1000, duration));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {track ? (
        <>
          <div className="flex items-center gap-4">
            <Image
              src={track.albumArt}
              alt="Album Art"
              className="w-24 rounded-lg"
              width={96}
              height={96}
            />
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-bold">{track.name}</h3>
              <p className="text-sm text-gray-500">{track.artist}</p>
              <p className="text-xs text-gray-400 mt-1">{`From: ${track.albumName}`}</p>
            </div>
          </div>

          <div>
            <ProgressPrimitive.Root className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <ProgressPrimitive.Indicator
                style={{ width: `${(progress / duration) * 100}%` }}
                className="h-full bg-green-500 duration-300 ease-in-out"
              />
            </ProgressPrimitive.Root>
            <div className="flex justify-between text-sm text-gray-500">
              <p>{formatTime(progress)}</p>
              <p>{formatTime(duration)}</p>
            </div>
          </div>
        </>
      ) : (
        <p>Waiting for updates...</p>
      )}
    </div>
  );
};

export default SpotifyWidget;
