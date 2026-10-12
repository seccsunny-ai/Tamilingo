import React from "react";
import { Download, ExternalLink, RefreshCw, Play, Sparkles, CheckCircle2, Video } from "lucide-react";
import { ChannelInfo, BatchState } from "../types";

interface HeaderProps {
  channelInfo: ChannelInfo | null;
  batchState: BatchState;
  onOpenExportModal: () => void;
  onTriggerBatchFetch: () => void;
  onStopBatchFetch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  channelInfo,
  batchState,
  onOpenExportModal,
  onTriggerBatchFetch,
  onStopBatchFetch,
}) => {
  const percentComplete = channelInfo
    ? Math.round((channelInfo.cachedTranscripts / channelInfo.totalVideos) * 100)
    : 0;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Channel branding */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/10">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-bold text-lg">
                  LT
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">LEARN TAMIL</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  @LEARNTAMIL1
                </span>
                <a
                  href="https://www.youtube.com/@LEARNTAMIL1/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-amber-400 p-1 transition-colors"
                  title="Open YouTube Channel"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete Video Transcripts Hub • Spoken Tamil Lessons & Conversations
              </p>
            </div>
          </div>

          {/* Action buttons & Stats */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Stat badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="text-slate-400">Transcribed:</span>
              <span className="font-semibold text-emerald-400">
                {channelInfo?.cachedTranscripts ?? 0}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300 font-medium">
                {channelInfo?.totalVideos ?? 425}
              </span>
              <span className="text-xs text-amber-400/90 font-mono ml-1">
                ({percentComplete}%)
              </span>
            </div>

            {/* Batch fetch trigger */}
            {batchState.running ? (
              <button
                onClick={onStopBatchFetch}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Fetching ({batchState.completed}/{channelInfo?.totalVideos})... Stop</span>
              </button>
            ) : (
              <button
                onClick={onTriggerBatchFetch}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                title="Fetch next pending transcripts in the background"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Fetch Next Batch (25)</span>
              </button>
            )}

            {/* Export all modal button */}
            <button
              onClick={onOpenExportModal}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Export All Transcripts</span>
            </button>
          </div>
        </div>

        {/* Live batch progress bar if active */}
        {batchState.running && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                <span>
                  Currently processing: <strong className="text-slate-200 font-medium">{batchState.currentVideo || "Fetching..."}</strong>
                </span>
              </span>
              <span className="text-amber-400 font-mono">
                {batchState.completed} of {batchState.total} cached
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(2, (batchState.completed / (batchState.total || 425)) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
