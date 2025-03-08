"use client";

import { useState, useEffect } from "react";
import SpotifyWidget from "./components/SpotifyWidget";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();

    window.addEventListener("message", (event) => {
      if (event.data === "authenticated") {
        checkAuth();
      }
    });
  }, []);

  const handleLogin = () => {
    window.open("/api/auth/login", "_blank", "width=500,height=600");
  };

  return (
    <div className="text-center">
      <h1>Spotify Now Playing</h1>
      {isAuthenticated ? (
        <SpotifyWidget />
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
}
