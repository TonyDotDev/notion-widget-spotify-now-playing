import { Server } from "socket.io";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import axios from "axios";
import cookie from "cookie";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let lastTrackId = null;
let lastProgressMs = 0;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("🟢 Client Connected");

    const cookies = socket.handshake.headers.cookie
      ? cookie.parse(socket.handshake.headers.cookie)
      : {};
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      socket.emit("error", "Unauthorized");
      socket.disconnect();
      return;
    }

    const fetchNowPlaying = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.data && response.data.item) {
          const track = response.data.item;
          const progressMs = response.data.progress_ms;
          const durationMs = track.duration_ms;
          const isPlaying = response.data.is_playing;

          console.log(track, "TRACK DATA");

          // Only update if the song or progress has changed
          if (track.id !== lastTrackId || progressMs !== lastProgressMs) {
            lastTrackId = track.id;
            lastProgressMs = progressMs;

            socket.emit("now-playing", {
              name: track.name,
              artist: track.artists.map((a) => a.name).join(", "),
              albumArt: track.album.images[0].url,
              albumName: `${track.album.name}${
                track.album.album_type === "single" ? " - Single" : ""
              }`,
              isPlaying,
              progressMs,
              durationMs,
            });
          }
        }
      } catch (error) {
        console.error("❌ Error fetching now playing:", error);
      }
    };

    // Fetch updates every 10 seconds
    setInterval(fetchNowPlaying, 10000);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
