import React from "react";

export type MascotMood = "idle" | "happy" | "thinking" | "celebrating" | "listening";

interface MascotProps {
  mood?: MascotMood;
  speech?: string;
  size?: "sm" | "md" | "lg";
}

export const Mascot: React.FC<MascotProps> = ({
  mood = "idle",
  speech,
  size = "md",
}) => {
  const getEmoji = () => {
    switch (mood) {
      case "happy":
        return "🦚✨";
      case "celebrating":
        return "🦚🎉";
      case "listening":
        return "🦚🎧";
      case "thinking":
        return "🦚💭";
      default:
        return "🦚";
    }
  };

  const dimensions =
    size === "sm" ? "w-10 h-10 text-xl" : size === "lg" ? "w-20 h-20 text-4xl" : "w-14 h-14 text-2xl";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${dimensions} rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-300 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0 transform transition-transform hover:scale-105`}
      >
        <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center animate-bounce-subtle">
          <span>{getEmoji()}</span>
        </div>
      </div>

      {speech && (
        <div className="relative bg-slate-800 text-slate-100 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-2xl border-2 border-slate-700 shadow-sm max-w-xs animate-in fade-in duration-200">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-slate-700 border-b-6 border-b-transparent" />
          {speech}
        </div>
      )}
    </div>
  );
};
