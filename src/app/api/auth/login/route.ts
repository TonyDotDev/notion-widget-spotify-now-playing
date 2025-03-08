import { NextResponse } from "next/server";

export async function GET() {
  const scope = "user-read-playback-state user-modify-playback-state";
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl);
}
