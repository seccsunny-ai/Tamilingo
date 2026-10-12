import React from "react";
import { Flame, Heart, Gem, BookOpen, Map, Zap, Layers, Sparkles } from "lucide-react";

export type NavTab = "path" | "stories" | "match";

interface TopNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  streak: number;
  gems: number;
  hearts: number;
  onOpenTranscripts: () => void;
  onOpenMatchMadness: () => void;
  onRefillHearts: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  streak,
  gems,
  hearts,
  onOpenTranscripts,
  onOpenMatchMadness,
  onRefillHearts,
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b-2 border-slate-800 px-4 py-2.5 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab("path")}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 p-0.5 shadow-md shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-lg font-black text-emerald-400">
                🦚
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Tamilingo
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Spoken Tamil
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => onSelectTab("path")}
              className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === "path"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Path</span>
            </button>
            <button
              onClick={() => onSelectTab("stories")}
              className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === "stories"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Stories</span>
            </button>
            <button
              onClick={onOpenMatchMadness}
              className="px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
              title="Timed Match Madness speed review"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Match</span>
            </button>
          </div>
        </div>

        {/* Gamified Stats Bar */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          {/* Streak */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold"
            title={`${streak} Day Streak!`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-400 animate-pulse" />
            <span>{streak}</span>
          </div>

          {/* Gems */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold"
            title={`${gems} Gems`}
          >
            <Gem className="w-4 h-4 fill-cyan-500 text-cyan-400" />
            <span>{gems}</span>
          </div>

          {/* Hearts */}
          <button
            onClick={onRefillHearts}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all cursor-pointer"
            title="Hearts remaining (Click to refill)"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-400" />
            <span>{hearts}</span>
          </button>

          {/* Transcripts Hub Button */}
          <button
            onClick={onOpenTranscripts}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Browse full 425 video transcripts"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Transcripts Hub</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
