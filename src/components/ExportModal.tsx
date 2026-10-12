import React, { useState } from "react";
import { Download, FileText, Archive, FileCode, Check, X, Sparkles, Layers } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cachedCount: number;
  totalVideos: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cachedCount,
  totalVideos,
}) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (url: string, key: string, filename: string) => {
    try {
      setDownloading(key);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Export All Transcripts</h3>
              <p className="text-xs text-slate-400">
                {cachedCount} transcripts currently prepared out of {totalVideos} channel videos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content options */}
        <div className="p-6 space-y-4">
          {/* Option 1: ZIP of individual TXT files */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-between group">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 mt-0.5">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-slate-200 group-hover:text-amber-300 transition-colors">
                  ZIP Archive (.txt files)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Folder with separate timestamped text files for each video
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownload("/api/export/all-zip?format=txt", "zip-txt", "learn-tamil-transcripts-txt.zip")}
              disabled={downloading !== null || cachedCount === 0}
              className="px-3 py-1.5 bg-slate-700 hover:bg-amber-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {downloading === "zip-txt" ? (
                <span className="inline-block animate-spin mr-1">↻</span>
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download ZIP
            </button>
          </div>

          {/* Option 2: ZIP of Subtitles (.srt) */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-between group">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-slate-200 group-hover:text-amber-300 transition-colors">
                  ZIP Subtitles (.srt files)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  SubRip subtitle files ready for media players & video editors
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownload("/api/export/all-zip?format=srt", "zip-srt", "learn-tamil-subtitles-srt.zip")}
              disabled={downloading !== null || cachedCount === 0}
              className="px-3 py-1.5 bg-slate-700 hover:bg-purple-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {downloading === "zip-srt" ? (
                <span className="inline-block animate-spin mr-1">↻</span>
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download SRT ZIP
            </button>
          </div>

          {/* Option 3: Single Omnibus Text File */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-between group">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-slate-200 group-hover:text-amber-300 transition-colors">
                  Single Master Document (.txt)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  All channel transcripts combined into one unified searchable file
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownload("/api/export/all-text", "single-txt", "learn-tamil-all-transcripts.txt")}
              disabled={downloading !== null || cachedCount === 0}
              className="px-3 py-1.5 bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {downloading === "single-txt" ? (
                <span className="inline-block animate-spin mr-1">↻</span>
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download TXT
            </button>
          </div>

          {/* Option 4: Full JSON Data */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-between group">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 mt-0.5">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-slate-200 group-hover:text-amber-300 transition-colors">
                  JSON Raw Data (.json)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete structured segments with millisecond start times and durations
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownload("/api/export/all-json", "json", "learn-tamil-transcripts.json")}
              disabled={downloading !== null || cachedCount === 0}
              className="px-3 py-1.5 bg-slate-700 hover:bg-amber-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {downloading === "json" ? (
                <span className="inline-block animate-spin mr-1">↻</span>
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download JSON
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Tip: You can also download single video transcripts directly from the reader.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
