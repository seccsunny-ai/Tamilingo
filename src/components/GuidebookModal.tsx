import React, { useState } from "react";
import { X, BookOpen, Volume2, Volume1, Sparkles, Check, Lightbulb } from "lucide-react";
import { UnitGuidebook } from "../data/curriculum";
import { speakTamil, sounds } from "../utils/audio";

interface GuidebookModalProps {
  guidebook: UnitGuidebook | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  guidebook,
  isOpen,
  onClose,
}) => {
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  if (!isOpen || !guidebook) return null;

  const playAudio = (phrase: string, rate = 0.9) => {
    sounds.playPop();
    setPlayingPhrase(phrase);
    speakTamil(phrase, rate, () => setPlayingPhrase(null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  CEFR {guidebook.cefrLevel} Guidebook
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                {guidebook.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>Unit Concept</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {guidebook.overview}
            </p>
          </div>

          {/* Sections */}
          {guidebook.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{section.title}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {section.explanation}
                </p>
              </div>

              {/* Key Phrases List */}
              <div className="space-y-2.5">
                {section.keyPhrases.map((item, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-amber-300">
                          {item.phrase}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          [{item.phonetic}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {item.translation}
                      </p>
                    </div>

                    {/* Audio buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => playAudio(item.phrase, 0.9)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          playingPhrase === item.phrase
                            ? "bg-emerald-500 text-slate-950 animate-pulse"
                            : "bg-slate-700/80 hover:bg-emerald-500 hover:text-slate-950 text-slate-200"
                        }`}
                        title="Play Normal Speed"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => playAudio(item.phrase, 0.65)}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center transition-all cursor-pointer"
                        title="Play Slow (Turtle Mode)"
                      >
                        <Volume1 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
