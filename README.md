# ImpactLens — AI Visual Evidence Intelligence

> Code Cubicle 6.0 · Problem Statement 02 · AI-Powered Impact & Sustainability Media Platform

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (free tier works)
- Cloudinary account (free tier)
- Google Gemini API key (free tier)

### 1. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 2. Cloudinary Setup
1. Log into [Cloudinary Dashboard](https://cloudinary.com/console)
2. Go to **Settings → Upload → Upload Presets**
3. Click **Add Upload Preset**
4. Set:
   - Preset name: `impactlens_unsigned`
   - Signing Mode: **Unsigned**
   - Folder: `impactlens`
5. Save

### 3. Install Dependencies

```bash
npm install           # Root (concurrently)
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 4. Run Development Servers

```bash
npm run dev    # Runs both server (port 5000) and client (port 5173)
```

Or individually:
```bash
npm run server   # Backend only
npm run client   # Frontend only
```

### 5. Open the App
Visit [http://localhost:5173](http://localhost:5173)

## Architecture

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Express.js (Node.js)
- **Database**: MongoDB Atlas
- **Media Storage**: Cloudinary CDN
- **AI Analysis**: Google Gemini 2.0 Flash

## Features

- 📁 Create and manage sustainability projects
- 📸 Upload photos/videos directly to Cloudinary
- 🤖 AI-powered structured analysis of every asset
- 💬 Natural language Q&A about project media
- 🔄 Before/after visual comparison with AI change detection
- 📊 Generate and download evidence-backed reports
- 🔗 Full traceability — every finding links to its source asset
