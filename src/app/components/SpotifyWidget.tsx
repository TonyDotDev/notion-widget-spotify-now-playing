import Image from "next/image";
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

interface Track {
  albumArt: string;
  name: string;
  artist: string;
}

const SpotifyWidget = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("now-playing", (data: Track) => {
      setTrack(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        background: "#181818",
        color: "white",
      }}
    >
      {track ? (
        <>
          <Image
            src={track.albumArt}
            alt="Album Art"
            style={{ width: "150px", borderRadius: "10px" }}
          />
          <h3>{track.name}</h3>
          <p>{track.artist}</p>
        </>
      ) : (
        <p>Waiting for updates...</p>
      )}
    </div>
  );
};

export default SpotifyWidget;
