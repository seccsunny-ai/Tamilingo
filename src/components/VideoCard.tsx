import React from "react";
import { Play, CheckCircle2, Clock, FileText, Download, ExternalLink, Sparkles } from "lucide-react";
import { VideoItem } from "../types";

interface VideoCardProps {
  video: VideoItem;
  isSelected: boolean;
  onSelect: (video: VideoItem) => void;
  onQuickDownload?: (videoId: string, e: React.MouseEvent) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isSelected,
  onSelect,
  onQuickDownload,
}) => {
  return (
    <div
      onClick={() => onSelect(video)}
      className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 ${
        isSelected
          ? "bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/30"
          : "bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700/80"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-28 sm:w-32 h-18 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        
        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Lesson number badge */}
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-mono font-bold text-amber-400 border border-white/10">
          #{video.index}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {video.hasTranscript ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Transcript Ready</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>Click to transcribe</span>
              </span>
            )}
            {video.segmentCount ? (
              <span className="text-[10px] text-slate-500 font-mono">
                {video.segmentCount} cues
              </span>
            ) : null}
          </div>

          <h3 className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-snug transition-colors ${
            isSelected ? "text-amber-300" : "text-slate-200 group-hover:text-white"
          }`}>
            {video.title}
          </h3>

          {video.snippet && (
            <p className="text-[11px] text-slate-400/90 line-clamp-1 mt-1 font-sans">
              "{video.snippet}..."
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/40 text-[11px] text-slate-500">
          <span className="font-mono text-[10px] text-slate-500">
            ID: {video.id}
          </span>

          <div className="flex items-center gap-2">
            {video.hasTranscript && onQuickDownload && (
              <button
                onClick={(e) => onQuickDownload(video.id, e)}
                className="text-slate-400 hover:text-amber-400 p-0.5 rounded transition-colors"
                title="Download transcript (.txt)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-amber-400 p-0.5 rounded transition-colors"
              title="Watch on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
