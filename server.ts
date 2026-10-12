import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import JSZip from "jszip";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Paths
const DATA_DIR = path.join(__dirname, "src", "data");
const VIDEOS_FILE = path.join(DATA_DIR, "channel_videos.json");
const CACHE_FILE = path.join(DATA_DIR, "transcripts_cache.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load videos list
let channelVideos: Array<{ id: string; title: string; duration: string; thumbnail: string }> = [];
try {
  if (fs.existsSync(VIDEOS_FILE)) {
    channelVideos = JSON.parse(fs.readFileSync(VIDEOS_FILE, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load channel_videos.json:", e);
}

// Load transcripts cache
let transcriptsCache: Record<
  string,
  {
    id: string;
    title: string;
    fetchedAt: string;
    segments: Array<{ text: string; start: number; dur: number }>;
    fullText: string;
    sourceLang?: string;
  }
> = {};

try {
  if (fs.existsSync(CACHE_FILE)) {
    transcriptsCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load transcripts_cache.json:", e);
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(transcriptsCache, null, 2));
  } catch (e) {
    console.error("Failed to save transcripts cache:", e);
  }
}

// Transcript Fetch Helper
async function fetchTranscriptForVideo(videoId: string, title?: string): Promise<any> {
  if (transcriptsCache[videoId]) {
    return transcriptsCache[videoId];
  }

  // Find title if not provided
  const videoObj = channelVideos.find((v) => v.id === videoId);
  const videoTitle = title || videoObj?.title || `Video ${videoId}`;

  try {
    const res = await fetch("https://transcribeyoutube.com/api/transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        lang: "ta",
      }),
    });

    const data = await res.json();
    if (data.ok && Array.isArray(data.transcript) && data.transcript.length > 0) {
      const entry = {
        id: videoId,
        title: data.title || videoTitle,
        fetchedAt: new Date().toISOString(),
        segments: data.transcript,
        fullText: data.transcript.map((s: { text: string }) => s.text).join(" "),
        sourceLang: data.selectedLang || "ta",
      };
      transcriptsCache[videoId] = entry;
      saveCache();
      return entry;
    } else {
      // Try fallback without lang if specific Tamil caption failed
      const fallbackRes = await fetch("https://transcribeyoutube.com/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
        }),
      });
      const fallbackData = await fallbackRes.json();
      if (fallbackData.ok && Array.isArray(fallbackData.transcript) && fallbackData.transcript.length > 0) {
        const entry = {
          id: videoId,
          title: fallbackData.title || videoTitle,
          fetchedAt: new Date().toISOString(),
          segments: fallbackData.transcript,
          fullText: fallbackData.transcript.map((s: { text: string }) => s.text).join(" "),
          sourceLang: fallbackData.selectedLang || "auto",
        };
        transcriptsCache[videoId] = entry;
        saveCache();
        return entry;
      }
    }
  } catch (err: any) {
    console.error(`Error fetching transcript for ${videoId}:`, err.message);
  }

  return null;
}

// Background Batch State
interface BatchState {
  running: boolean;
  total: number;
  completed: number;
  failed: number;
  currentVideo: string;
  lastUpdated: string;
}

const batchState: BatchState = {
  running: false,
  total: channelVideos.length,
  completed: Object.keys(transcriptsCache).length,
  failed: 0,
  currentVideo: "",
  lastUpdated: new Date().toISOString(),
};

async function runBackgroundBatch(limit = 30) {
  if (batchState.running) return;
  batchState.running = true;
  batchState.total = channelVideos.length;

  const pending = channelVideos.filter((v) => !transcriptsCache[v.id]);
  const toProcess = pending.slice(0, limit);

  for (const video of toProcess) {
    if (!batchState.running) break;
    batchState.currentVideo = video.title;
    batchState.lastUpdated = new Date().toISOString();

    const res = await fetchTranscriptForVideo(video.id, video.title);
    if (res) {
      batchState.completed = Object.keys(transcriptsCache).length;
    } else {
      batchState.failed += 1;
    }

    // Polite rate limiting (1.1s)
    await new Promise((r) => setTimeout(r, 1100));
  }

  batchState.running = false;
  batchState.currentVideo = "";
  batchState.completed = Object.keys(transcriptsCache).length;
  batchState.lastUpdated = new Date().toISOString();
}

// API Routes
app.get("/api/channel", (_req, res) => {
  res.json({
    channel: {
      name: "LEARN TAMIL",
      handle: "@LEARNTAMIL1",
      url: "https://www.youtube.com/@LEARNTAMIL1/videos",
      totalVideos: channelVideos.length,
      cachedTranscripts: Object.keys(transcriptsCache).length,
    },
  });
});

app.get("/api/videos", (req, res) => {
  const query = (req.query.q as string || "").toLowerCase().trim();
  const filter = (req.query.filter as string || "all").toLowerCase(); // 'all' | 'transcribed' | 'pending'
  const sort = (req.query.sort as string || "default"); // 'default' | 'title' | 'id'

  let filtered = channelVideos.map((v, idx) => ({
    ...v,
    index: idx + 1,
    hasTranscript: Boolean(transcriptsCache[v.id]),
    segmentCount: transcriptsCache[v.id]?.segments?.length || 0,
    snippet: transcriptsCache[v.id]?.fullText?.slice(0, 140) || "",
  }));

  if (filter === "transcribed") {
    filtered = filtered.filter((v) => v.hasTranscript);
  } else if (filter === "pending") {
    filtered = filtered.filter((v) => !v.hasTranscript);
  }

  if (query) {
    filtered = filtered.filter((v) => {
      const matchTitle = v.title.toLowerCase().includes(query);
      const matchTranscript = transcriptsCache[v.id]?.fullText?.toLowerCase().includes(query);
      return matchTitle || matchTranscript;
    });
  }

  if (sort === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "transcribed-first") {
    filtered.sort((a, b) => (b.hasTranscript ? 1 : 0) - (a.hasTranscript ? 1 : 0));
  }

  res.json({
    videos: filtered,
    total: filtered.length,
    channelTotal: channelVideos.length,
    cachedCount: Object.keys(transcriptsCache).length,
  });
});

app.get("/api/transcript/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  const cached = transcriptsCache[videoId];
  if (cached) {
    return res.json({ transcript: cached, cached: true });
  }

  const fetched = await fetchTranscriptForVideo(videoId);
  if (fetched) {
    return res.json({ transcript: fetched, cached: false });
  }

  res.status(404).json({
    error: "Transcript not available for this video yet. It may not have captions or is restricted.",
  });
});

app.post("/api/batch-fetch", (req, res) => {
  const limit = Math.min(parseInt(req.body.limit, 10) || 20, 100);
  if (batchState.running) {
    return res.json({ message: "Batch already in progress", state: batchState });
  }

  runBackgroundBatch(limit);
  res.json({ message: `Started fetching next ${limit} transcripts`, state: batchState });
});

app.post("/api/batch-stop", (_req, res) => {
  batchState.running = false;
  res.json({ message: "Batch stopped", state: batchState });
});

app.get("/api/batch-status", (_req, res) => {
  batchState.completed = Object.keys(transcriptsCache).length;
  res.json(batchState);
});

// Helper for SRT format
function formatSrtTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

function generateSrt(segments: Array<{ text: string; start: number; dur: number }>): string {
  return segments
    .map((s, idx) => {
      const startTime = formatSrtTime(s.start);
      const endTime = formatSrtTime(s.start + (s.dur || 2));
      return `${idx + 1}\n${startTime} --> ${endTime}\n${s.text.trim()}\n`;
    })
    .join("\n");
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `[${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}]`;
}

// Single Video Download endpoints
app.get("/api/export/video/:videoId", (req, res) => {
  const { videoId } = req.params;
  const format = (req.query.format as string || "txt").toLowerCase();
  const transcript = transcriptsCache[videoId];

  if (!transcript) {
    return res.status(404).send("Transcript not found");
  }

  const safeTitle = transcript.title.replace(/[^a-zA-Z0-9_\u0B80-\u0BFF-]/g, "_").slice(0, 50);

  if (format === "srt") {
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.srt"`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.send(generateSrt(transcript.segments));
  } else if (format === "json") {
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.json"`);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.json(transcript);
  } else {
    // Default TXT
    const header = `=========================================================\n${transcript.title}\nYouTube URL: https://www.youtube.com/watch?v=${transcript.id}\nFetched: ${transcript.fetchedAt}\nSegments: ${transcript.segments.length}\n=========================================================\n\n`;
    const lines = transcript.segments.map((s) => `${formatTimestamp(s.start)} ${s.text}`).join("\n");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.txt"`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.send(header + lines);
  }
});

// Bulk Export Endpoints
app.get("/api/export/all-text", (_req, res) => {
  const keys = Object.keys(transcriptsCache);
  if (keys.length === 0) {
    return res.status(404).send("No transcripts cached yet.");
  }

  let fullContent = `=========================================================\nLEARN TAMIL YOUTUBE CHANNEL TRANSCRIPTS ARCHIVE\nChannel: LEARN TAMIL (@LEARNTAMIL1)\nChannel URL: https://www.youtube.com/@LEARNTAMIL1/videos\nTotal Videos Transcribed: ${keys.length}\nGenerated on: ${new Date().toUTCString()}\n=========================================================\n\n\n`;

  keys.forEach((id, idx) => {
    const t = transcriptsCache[id];
    fullContent += `---------------------------------------------------------\n`;
    fullContent += `[${idx + 1}/${keys.length}] ${t.title}\n`;
    fullContent += `YouTube URL: https://www.youtube.com/watch?v=${t.id}\n`;
    fullContent += `Segments: ${t.segments.length}\n`;
    fullContent += `---------------------------------------------------------\n\n`;
    const formattedSegments = t.segments
      .map((s) => `${formatTimestamp(s.start)} ${s.text}`)
      .join("\n");
    fullContent += formattedSegments + "\n\n\n";
  });

  res.setHeader("Content-Disposition", `attachment; filename="learn-tamil-all-transcripts.txt"`);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(fullContent);
});

app.get("/api/export/all-json", (_req, res) => {
  res.setHeader("Content-Disposition", `attachment; filename="learn-tamil-transcripts.json"`);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json({
    channel: "LEARN TAMIL (@LEARNTAMIL1)",
    channelUrl: "https://www.youtube.com/@LEARNTAMIL1/videos",
    totalCached: Object.keys(transcriptsCache).length,
    transcripts: transcriptsCache,
  });
});

app.get("/api/export/all-zip", async (req, res) => {
  const format = (req.query.format as string || "txt").toLowerCase();
  const keys = Object.keys(transcriptsCache);

  if (keys.length === 0) {
    return res.status(404).send("No transcripts cached yet.");
  }

  const zip = new JSZip();
  const folder = zip.folder("learn_tamil_transcripts");

  // Summary file
  folder?.file(
    "README.txt",
    `LEARN TAMIL YOUTUBE TRANSCRIPTS ARCHIVE\nTotal Transcripts: ${keys.length}\nChannel: https://www.youtube.com/@LEARNTAMIL1/videos\n`
  );

  for (const id of keys) {
    const t = transcriptsCache[id];
    const safeTitle = t.title.replace(/[^a-zA-Z0-9_\u0B80-\u0BFF-]/g, "_").slice(0, 50);
    if (format === "srt") {
      folder?.file(`${safeTitle}.srt`, generateSrt(t.segments));
    } else {
      const header = `${t.title}\nURL: https://www.youtube.com/watch?v=${t.id}\n\n`;
      const body = t.segments.map((s) => `${formatTimestamp(s.start)} ${s.text}`).join("\n");
      folder?.file(`${safeTitle}.txt`, header + body);
    }
  }

  const content = await zip.generateAsync({ type: "nodebuffer" });
  res.setHeader("Content-Disposition", `attachment; filename="learn-tamil-transcripts-${format}.zip"`);
  res.setHeader("Content-Type", "application/zip");
  res.send(content);
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
