"use client";
import { useState, useEffect } from "react";
import { EnterIcon } from "@radix-ui/react-icons";

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
    <div className="flex flex-col items-center justify-center h-screen bg-transparent w-dvw py-6 px-6">
      {isAuthenticated ? (
        <SpotifyWidget />
      ) : (
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md flex items-center justify-center grow-0 cursor-pointer gap-2"
          onClick={handleLogin}
        >
          <EnterIcon className="w-4 h-4" />
          Login with Spotify
        </button>
      )}
    </div>
  );
}
