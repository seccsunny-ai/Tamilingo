import React, { useState, useMemo, useRef } from "react";
import {
  Play,
  Copy,
  Check,
  Download,
  ExternalLink,
  BookOpen,
  Clock,
  FileText,
  Layers,
  Sparkles,
  Maximize2,
  X,
  Languages,
  Search,
} from "lucide-react";
import { TranscriptData, VideoItem } from "../types";

interface TranscriptViewerProps {
  video: VideoItem | null;
  transcript: TranscriptData | null;
  isLoading: boolean;
  onClose?: () => void;
  onFetchTranscript?: (videoId: string) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  video,
  transcript,
  isLoading,
  onClose,
  onFetchTranscript,
}) => {
  const [viewMode, setViewMode] = useState<"timestamps" | "reading" | "vocab" | "srt">("timestamps");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [searchWord, setSearchWord] = useState("");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  // Format second to [MM:SS]
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Handle Seek Video
  const handleSeek = (seconds: number, index: number) => {
    setActiveSegmentIndex(index);
    setSeekTime(Math.floor(seconds));
  };

  // Copy helpers
  const handleCopy = async (type: "plain" | "timestamps" | "srt") => {
    if (!transcript) return;
    let textToCopy = "";

    if (type === "plain") {
      textToCopy = transcript.fullText;
    } else if (type === "timestamps") {
      textToCopy = transcript.segments
        .map((s) => `[${formatTime(s.start)}] ${s.text}`)
        .join("\n");
    } else if (type === "srt") {
      textToCopy = transcript.segments
        .map((s, idx) => {
          const start = s.start;
          const end = s.start + (s.dur || 2);
          const fmt = (sec: number) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const sc = Math.floor(sec % 60);
            const ms = Math.floor((sec % 1) * 1000);
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
          };
          return `${idx + 1}\n${fmt(start)} --> ${fmt(end)}\n${s.text}\n`;
        })
        .join("\n");
    }

    await navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Download single video transcript
  const handleDownload = (format: "txt" | "srt" | "json") => {
    if (!transcript) return;
    window.location.href = `/api/export/video/${transcript.id}?format=${format}`;
  };

  // Extracted Vocabulary Words
  const vocabWords = useMemo(() => {
    if (!transcript) return [];
    const wordsMap = new Map<string, number>();
    const cleaned = transcript.fullText
      .replace(/[0-9.,!?;:()""''\-_]/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2);

    for (const word of cleaned) {
      wordsMap.set(word, (wordsMap.get(word) || 0) + 1);
    }

    return Array.from(wordsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 80)
      .map(([word, count]) => ({ word, count }));
  }, [transcript]);

  // Filter segments by in-transcript search
  const filteredSegments = useMemo(() => {
    if (!transcript) return [];
    if (!searchWord.trim()) return transcript.segments;
    const term = searchWord.toLowerCase().trim();
    return transcript.segments.filter((s) => s.text.toLowerCase().includes(term));
  }, [transcript, searchWord]);

  if (!video) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Select a Video</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Choose any video from the catalog on the left to read its full Tamil transcript, follow along with timestamps, and download subtitles.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-950/60 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                Video #{video.index}
              </span>
              {transcript && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {transcript.segments.length} Spoken Segments
                </span>
              )}
              {transcript?.sourceLang && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                  Lang: {transcript.sourceLang}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
              {video.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Open video on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/60">
          {/* View Modes */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setViewMode("timestamps")}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "timestamps"
                  ? "bg-amber-500 text-slate-950 font-semibold shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Timestamps</span>
            </button>
            <button
              onClick={() => setViewMode("reading")}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "reading"
                  ? "bg-amber-500 text-slate-950 font-semibold shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Reader</span>
            </button>
            <button
              onClick={() => setViewMode("vocab")}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "vocab"
                  ? "bg-amber-500 text-slate-950 font-semibold shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Vocab ({vocabWords.length})</span>
            </button>
            <button
              onClick={() => setViewMode("srt")}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "srt"
                  ? "bg-amber-500 text-slate-950 font-semibold shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>SRT</span>
            </button>
          </div>

          {/* Quick Copy & Export Buttons */}
          {transcript && (
            <div className="flex items-center gap-1.5">
              {/* Copy plain */}
              <button
                onClick={() => handleCopy("plain")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1 border border-slate-700/80 transition-colors"
                title="Copy full text without timestamps"
              >
                {copiedType === "plain" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Copy Text</span>
              </button>

              {/* Copy with timestamps */}
              <button
                onClick={() => handleCopy("timestamps")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1 border border-slate-700/80 transition-colors"
                title="Copy text with [MM:SS] timestamps"
              >
                {copiedType === "timestamps" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Copy with Time</span>
              </button>

              {/* Download dropdown / buttons */}
              <button
                onClick={() => handleDownload("txt")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1 border border-slate-700/80 transition-colors"
                title="Download .TXT"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>.TXT</span>
              </button>
              <button
                onClick={() => handleDownload("srt")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1 border border-slate-700/80 transition-colors"
                title="Download .SRT"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>.SRT</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded YouTube Player (Synchronized Preview) */}
      <div className="bg-black border-b border-slate-800 aspect-video max-h-56 w-full flex items-center justify-center relative">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?enablejsapi=1&autoplay=0${seekTime !== null ? `&start=${seekTime}` : ""}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Search within transcript & Font Size bar */}
      {transcript && viewMode !== "vocab" && viewMode !== "srt" && (
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter within this transcript..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-500"
            />
            {searchWord && (
              <button
                onClick={() => setSearchWord("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] mr-1">Text size:</span>
            <button
              onClick={() => setFontSize("sm")}
              className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === "sm" ? "bg-amber-500/20 text-amber-400 font-bold" : "hover:text-slate-200"}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === "base" ? "bg-amber-500/20 text-amber-400 font-bold" : "hover:text-slate-200"}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === "lg" ? "bg-amber-500/20 text-amber-400 font-bold" : "hover:text-slate-200"}`}
            >
              A+
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Fetching Tamil transcript from YouTube...</p>
          </div>
        ) : !transcript ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-slate-300 text-sm font-medium">Transcript not yet cached for this video</p>
            <p className="text-slate-500 text-xs max-w-xs">
              Click below to fetch the subtitles and audio transcript immediately.
            </p>
            {onFetchTranscript && (
              <button
                onClick={() => onFetchTranscript(video.id)}
                className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs shadow-md transition-all"
              >
                Fetch Transcript Now
              </button>
            )}
          </div>
        ) : viewMode === "timestamps" ? (
          /* Timestamp View */
          <div className="space-y-2">
            {filteredSegments.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No matching lines found for "{searchWord}".
              </div>
            ) : (
              filteredSegments.map((segment, idx) => {
                const isActive = activeSegmentIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSeek(segment.start, idx)}
                    className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/50 shadow-sm"
                        : "bg-slate-800/30 hover:bg-slate-800/80 border-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <button
                      className={`px-2 py-1 rounded font-mono text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors ${
                        isActive
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-800 text-amber-400/90 group-hover:bg-amber-500 group-hover:text-slate-950"
                      }`}
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      {formatTime(segment.start)}
                    </button>
                    <p
                      className={`text-slate-200 leading-relaxed font-sans ${
                        fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : "text-sm"
                      } ${isActive ? "text-amber-200 font-medium" : ""}`}
                    >
                      {segment.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        ) : viewMode === "reading" ? (
          /* Reader / Flowing Paragraph View */
          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/80">
            <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Continuous Dialogue
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {transcript.fullText.split(/\s+/).length} words
              </span>
            </div>
            <p
              className={`text-slate-200 leading-loose font-sans whitespace-pre-line ${
                fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-lg leading-relaxed" : "text-sm leading-relaxed"
              }`}
            >
              {transcript.fullText}
            </p>
          </div>
        ) : viewMode === "vocab" ? (
          /* Vocabulary Analysis View */
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-200">
                Spoken Tamil Vocabulary in this Video
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Most frequent words and phrases extracted from the speech transcript.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vocabWords.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs hover:border-amber-500/40 transition-colors"
                >
                  <span className="font-medium text-slate-200 truncate pr-2">
                    {item.word}
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-800 text-amber-400 rounded text-[10px] font-mono shrink-0">
                    ×{item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Raw SRT Subtitle View */
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
            {transcript.segments.map((s, idx) => {
              const start = s.start;
              const end = s.start + (s.dur || 2);
              const fmt = (sec: number) => {
                const h = Math.floor(sec / 3600);
                const m = Math.floor((sec % 3600) / 60);
                const sc = Math.floor(sec % 60);
                const ms = Math.floor((sec % 1) * 1000);
                return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
              };
              return `${idx + 1}\n${fmt(start)} --> ${fmt(end)}\n${s.text}\n\n`;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
