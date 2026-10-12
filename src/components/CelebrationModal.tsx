import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Flame, CheckCircle, ArrowRight, Trophy } from "lucide-react";
import { sounds } from "../utils/audio";

interface CelebrationModalProps {
  isOpen: boolean;
  xpEarned: number;
  streak: number;
  lessonTitle: string;
  onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  xpEarned,
  streak,
  lessonTitle,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playLevelComplete();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#58cc02", "#ffc800", "#ff4b4b", "#1cb0f6", "#2b70c9"],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl shadow-emerald-500/10 flex flex-col items-center">
        {/* Animated Trophy badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
            🏆
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Lesson Completed!
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          {lessonTitle}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400 font-extrabold text-lg">
              <Sparkles className="w-4 h-4" />
              <span>+{xpEarned}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              XP Earned
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-orange-400 font-extrabold text-lg">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{streak} Days</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Streak
            </span>
          </div>
        </div>

        {/* Encouraging message */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 w-full mb-6 text-emerald-300 text-xs font-medium">
          🎯 "Superb speaking! Your spoken Tamil pronunciation is getting sharper every day."
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 hover:border-emerald-600 active:border-b-0 active:translate-y-1 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
