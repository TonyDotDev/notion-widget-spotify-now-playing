import { cookies } from "next/headers";
import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Authorization code not provided.", { status: 400 });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
        client_id: process.env.SPOTIFY_CLIENT_ID as string,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Store tokens securely in HTTP-only cookies
    (await cookies()).set("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    });

    (await cookies()).set("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return new Response(
      `
            <script>
                window.opener.postMessage("authenticated", "*");
                window.close();
            </script>
        `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Error getting access token:", error);
    return new Response("Failed to authenticate.", { status: 500 });
  }
}
