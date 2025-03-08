# 🎵 Notion Spotify Widget (Full-Stack)

A full-stack **Notion Widget** built with **Next.js**, **Spotify API**, and **WebSockets** to display real-time playback information inside Notion.

## 🚀 Features

- **Real-time song updates** using **WebSockets**.
- **OAuth authentication with Spotify API**.
- **Secure access & refresh token handling**.
- **Playback controls** (play, pause, next, previous).
- **Lightweight & embeddable** in Notion.

## 📌 Technologies Used

- **Frontend:** React (Next.js)
- **Backend:** Next.js API routes (Node.js + Express-like server functions)
- **Real-time Updates:** Socket.io (WebSockets)
- **Authentication:** OAuth 2.0 with Spotify API
- **Hosting:** Vercel (Recommended)

## 📷 Preview

![Notion Spotify Widget Preview](https://example.com/preview-image.png)

## 📖 How It Works

1. **User logs in with Spotify** (OAuth authentication flow).
2. **WebSocket server** listens for song changes every 10s.
3. **Frontend listens** to WebSocket updates in real time.
4. **Widget displays current track & allows playback control**.

## 📂 Project Structure

```
notion-spotify-widget/
│── components/
│   ├── SpotifyWidget.js  # React widget UI
│── pages/
│   ├── api/
│   │   ├── login.js      # Redirects to Spotify login
│   │   ├── callback.js   # Handles Spotify OAuth callback
│   │   ├── now-playing.js # Fetches current track
│   │   ├── socket.js     # WebSocket server
│   │   ├── play.js       # Play song
│   │   ├── pause.js      # Pause song
│   │   ├── next.js       # Next song
│   │   ├── previous.js   # Previous song
│   ├── index.js         # Main UI page
│── public/
│── styles/
│── .env.local           # API Keys (ignored by Git)
│── package.json         # Dependencies
│── README.md            # Project Overview
```

## 🛠 Setup & Installation

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/tonydotdev/notion-spotify-widget.git
cd notion-spotify-widget
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a `.env.local` file and add:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/callback
```

### **4️⃣ Run the Development Server**

```bash
npm run dev
```

- Open `http://localhost:3000` in your browser.

### **5️⃣ Deploy to Vercel**

```bash
vercel deploy
```

- Copy the public URL and **embed it in Notion** using `/embed`.

## ✅ Future Enhancements

- **Dark mode support**
- **Song progress bar**

## 📜 License

This project is licensed under the **MIT License**.

---

Need help? Open an issue on GitHub! 🚀
