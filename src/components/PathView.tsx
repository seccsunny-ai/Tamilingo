import React, { useState } from "react";
import {
  Check,
  Lock,
  Star,
  Play,
  BookOpen,
  Headphones,
  Mic,
  Trophy,
  ChevronDown,
  Sparkles,
  Layers,
} from "lucide-react";
import { SECTIONS, Section, Unit, Lesson, UnitGuidebook } from "../data/curriculum";
import { Mascot } from "./Mascot";

interface PathViewProps {
  completedLessons: string[];
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenGuidebook: (guidebook: UnitGuidebook) => void;
}

export const PathView: React.FC<PathViewProps> = ({
  completedLessons,
  currentLessonId,
  onSelectLesson,
  onOpenGuidebook,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>("section-1");

  const currentSection =
    SECTIONS.find((s) => s.id === activeSectionId) || SECTIONS[0];

  // Helper for node icon
  const renderNodeIcon = (type: Lesson["iconType"], isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <Check className="w-7 h-7 stroke-[3.5]" />;
    }
    if (isCurrent) {
      return <Play className="w-7 h-7 fill-current ml-0.5" />;
    }
    switch (type) {
      case "headphones":
        return <Headphones className="w-6 h-6" />;
      case "mic":
        return <Mic className="w-6 h-6" />;
      case "star":
        return <Star className="w-6 h-6" />;
      case "trophy":
        return <Trophy className="w-6 h-6" />;
      default:
        return <Lock className="w-5 h-5" />;
    }
  };

  let globalLessonCount = 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-8 font-sans">
      {/* CEFR Section Selector Pill Bar */}
      <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-3 shadow-xl">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Course Sections (CEFR A1 – B2)
          </span>
          <span className="text-xs font-bold text-amber-400">
            {SECTIONS.length} Major Milestones
          </span>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SECTIONS.map((sec) => {
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`p-2.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
                }`}
              >
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded w-max ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {sec.cefrLevel.split(" ")[0]}
                </span>
                <span
                  className={`text-xs font-black truncate mt-1 leading-snug ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  Sec {sec.sectionNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Hero Banner */}
      <div className="w-full bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Mascot mood="happy" speech={`Welcome to ${currentSection.cefrLevel}!`} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Section {currentSection.sectionNumber}
              </span>
              <span className="text-xs font-extrabold text-amber-400">
                {currentSection.units.length} Units
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5 leading-snug">
              {currentSection.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
              {currentSection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Units in the Active Section */}
      {currentSection.units.map((unit) => {
        return (
          <div key={unit.id} className="w-full flex flex-col items-center">
            {/* Unit Header Card with Guidebook Button */}
            <div
              className={`w-full rounded-3xl p-5 mb-8 shadow-xl bg-gradient-to-r ${unit.colorScheme} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-white/10`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black tracking-widest uppercase bg-black/25 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                    Unit {unit.unitNumber}
                  </span>
                  <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                    {unit.guidebook.cefrLevel}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                  {unit.title}
                </h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  {unit.subtitle}
                </p>
              </div>

              {/* Guidebook Button */}
              <button
                onClick={() => onOpenGuidebook(unit.guidebook)}
                className="px-4 py-2.5 bg-black/30 hover:bg-black/50 border border-white/20 rounded-2xl backdrop-blur-sm flex items-center gap-2 text-xs font-bold transition-all shadow cursor-pointer shrink-0"
                title="View Guidebook with vocabulary and grammar tips"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Guidebook</span>
              </button>
            </div>

            {/* Stepping Stone Nodes */}
            <div className="flex flex-col items-center gap-8 w-full max-w-xs relative py-2">
              {/* Vertical connecting line */}
              <div className="absolute top-8 bottom-8 w-3 bg-slate-800 rounded-full z-0" />

              {unit.lessons.map((lesson) => {
                const currentIdx = globalLessonCount++;
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent =
                  lesson.id === currentLessonId ||
                  (!completedLessons.includes(lesson.id) &&
                    (currentIdx === 0 || completedLessons.length >= currentIdx));
                const isUnlocked = isCompleted || isCurrent;

                // S-curve lateral offsets
                const offsets = [
                  "translate-x-0",
                  "-translate-x-10",
                  "translate-x-0",
                  "translate-x-10",
                ];
                const offsetClass = offsets[currentIdx % offsets.length];

                return (
                  <div
                    key={lesson.id}
                    className={`relative z-10 flex flex-col items-center ${offsetClass} transition-all`}
                  >
                    {/* Active tooltip speech bubble */}
                    {isCurrent && (
                      <div className="absolute -top-12 z-20 whitespace-nowrap bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg animate-bounce border-2 border-emerald-400">
                        START LESSON!
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 rotate-45 border-r-2 border-b-2 border-emerald-400" />
                      </div>
                    )}

                    {/* Circular Level Node */}
                    <button
                      onClick={() => isUnlocked && onSelectLesson(lesson)}
                      disabled={!isUnlocked}
                      className={`w-20 h-20 rounded-full flex items-center justify-center font-black transition-all cursor-pointer shadow-xl relative ${
                        isCompleted
                          ? "bg-amber-400 border-b-6 border-amber-600 text-slate-950 hover:bg-amber-300 active:border-b-0 active:translate-y-1"
                          : isCurrent
                          ? "bg-emerald-500 border-b-6 border-emerald-700 text-slate-950 ring-4 ring-emerald-500/30 hover:bg-emerald-400 active:border-b-0 active:translate-y-1"
                          : "bg-slate-800 border-b-6 border-slate-900 text-slate-500 cursor-not-allowed opacity-75"
                      }`}
                      title={lesson.title}
                    >
                      {renderNodeIcon(lesson.iconType, isCompleted, isCurrent)}

                      {/* 3 Stars for completed */}
                      {isCompleted && (
                        <div className="absolute -bottom-2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black border border-white/20 shadow">
                          ★★★
                        </div>
                      )}
                    </button>

                    {/* Lesson Label */}
                    <span className="text-xs font-bold text-slate-300 mt-2 text-center max-w-[140px] leading-tight">
                      {lesson.title}
                    </span>
                  </div>
                );
              })}

              {/* Unit Milestone Chest at end */}
              <div className="relative z-10 my-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-800 text-amber-400 flex items-center justify-center text-2xl shadow-lg">
                  🎁
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1.5">
                  Unit Milestone
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
