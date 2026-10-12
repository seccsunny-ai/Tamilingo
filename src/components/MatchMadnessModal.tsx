import React, { useState, useEffect } from "react";
import { X, Zap, Trophy, Timer, Sparkles, Check } from "lucide-react";
import { MATCH_PAIRS, MatchPair } from "../data/curriculum";
import { sounds, speakTamil } from "../utils/audio";
import confetti from "canvas-confetti";

interface MatchMadnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnReward: (xp: number, gems: number) => void;
}

export const MatchMadnessModal: React.FC<MatchMadnessModalProps> = ({
  isOpen,
  onClose,
  onEarnReward,
}) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedTamilId, setSelectedTamilId] = useState<string | null>(null);
  const [selectedEnglishId, setSelectedEnglishId] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Active subset of 5 words
  const [activePairs, setActivePairs] = useState<MatchPair[]>([]);
  const [shuffledEnglish, setShuffledEnglish] = useState<MatchPair[]>([]);

  // Init game
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(45);
      setScore(0);
      setCombo(1);
      setMatchedIds([]);
      setSelectedTamilId(null);
      setSelectedEnglishId(null);
      setIsGameOver(false);

      // Pick 8 random pairs
      const shuffled = [...MATCH_PAIRS].sort(() => Math.random() - 0.5).slice(0, 8);
      setActivePairs(shuffled);
      setShuffledEnglish([...shuffled].sort(() => Math.random() - 0.5));
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isGameOver, score]);

  const handleGameOver = () => {
    setIsGameOver(true);
    sounds.playLevelComplete();
    confetti({ particleCount: 70, spread: 60 });
    const xpReward = Math.max(10, score * 3);
    const gemReward = Math.max(5, Math.floor(score / 2));
    onEarnReward(xpReward, gemReward);
  };

  const handleSelectTamil = (pair: MatchPair) => {
    if (matchedIds.includes(pair.id)) return;
    sounds.playPop();
    speakTamil(pair.tamil, 0.95);
    setSelectedTamilId(pair.id);

    if (selectedEnglishId) {
      checkMatch(pair.id, selectedEnglishId);
    }
  };

  const handleSelectEnglish = (pair: MatchPair) => {
    if (matchedIds.includes(pair.id)) return;
    sounds.playPop();
    setSelectedEnglishId(pair.id);

    if (selectedTamilId) {
      checkMatch(selectedTamilId, pair.id);
    }
  };

  const checkMatch = (tamilId: string, englishId: string) => {
    if (tamilId === englishId) {
      // Correct Match!
      sounds.playCorrect();
      setMatchedIds((prev) => [...prev, tamilId]);
      setScore((s) => s + 1);
      setCombo((c) => Math.min(5, c + 1));
      setSelectedTamilId(null);
      setSelectedEnglishId(null);

      // If all cleared, finish with bonus
      if (matchedIds.length + 1 >= activePairs.length) {
        setTimeout(handleGameOver, 400);
      }
    } else {
      // Wrong Match
      sounds.playWrong();
      setCombo(1);
      setSelectedTamilId(null);
      setSelectedEnglishId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-lg">
            <Zap className="w-5 h-5 fill-amber-400" />
            <span>Match Madness</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono font-bold">
              <Timer className="w-4 h-4 text-rose-400" />
              <span className={timeLeft <= 10 ? "text-rose-400 animate-pulse font-black" : ""}>
                {timeLeft}s
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Stats & Combo bar */}
        <div className="flex items-center justify-between py-3 text-xs">
          <span className="font-extrabold text-slate-300">
            Matched: <strong className="text-emerald-400">{score}</strong> / {activePairs.length}
          </span>
          <span className="font-black text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
            {combo > 1 ? `⚡ ${combo}x Combo!` : "Rapid Match"}
          </span>
        </div>

        {/* Game Over Screen */}
        {isGameOver ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 text-3xl flex items-center justify-center mb-3">
              ⚡
            </div>
            <h3 className="text-xl font-black text-white">Time's Up!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              You matched {score} spoken Tamil words at lightning speed!
            </p>
            <div className="flex items-center gap-3 mb-6 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800 text-xs font-bold">
              <span className="text-amber-400">+{score * 3} XP</span>
              <span className="text-cyan-400">💎 +{Math.max(5, Math.floor(score / 2))} Gems</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Claim Rewards
            </button>
          </div>
        ) : (
          /* Match Tiles Columns */
          <div className="grid grid-cols-2 gap-3 my-4">
            {/* Left: Romanized Tamil */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
                Spoken Tamil
              </span>
              {activePairs.map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                const isSelected = selectedTamilId === pair.id;
                if (isMatched) {
                  return (
                    <div
                      key={pair.id}
                      className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 opacity-20 text-center text-xs font-bold text-slate-600 line-through"
                    >
                      {pair.tamil}
                    </div>
                  );
                }
                return (
                  <button
                    key={pair.id}
                    onClick={() => handleSelectTamil(pair)}
                    className={`w-full p-3 rounded-2xl border-2 text-center text-xs font-black transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102"
                        : "bg-slate-800 border-slate-700 text-amber-300 hover:border-amber-400/80"
                    }`}
                  >
                    {pair.tamil}
                  </button>
                );
              })}
            </div>

            {/* Right: English Translation */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
                English Meaning
              </span>
              {shuffledEnglish.map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                const isSelected = selectedEnglishId === pair.id;
                if (isMatched) {
                  return (
                    <div
                      key={pair.id}
                      className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 opacity-20 text-center text-xs font-bold text-slate-600 line-through"
                    >
                      {pair.english}
                    </div>
                  );
                }
                return (
                  <button
                    key={pair.id}
                    onClick={() => handleSelectEnglish(pair)}
                    className={`w-full p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-102"
                        : "bg-slate-800 border-slate-700 text-slate-200 hover:border-emerald-400/80"
                    }`}
                  >
                    {pair.english}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
