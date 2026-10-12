import React, { useState } from "react";
import { BookOpen, Volume2, Check, ArrowRight, Sparkles, X, ChevronRight } from "lucide-react";
import { STORIES, Story, StoryTurn } from "../data/curriculum";
import { speakTamil, sounds } from "../utils/audio";
import confetti from "canvas-confetti";

interface StoriesViewProps {
  onEarnReward: (xp: number, gems: number) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({ onEarnReward }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Play line audio
  const playLineAudio = (text: string) => {
    speakTamil(text, 0.9);
  };

  const startStory = (story: Story) => {
    sounds.playPop();
    setActiveStory(story);
    setCurrentTurnIdx(0);
    setSelectedAnswer(null);
    setAnsweredCorrectly(null);
    setIsFinished(false);
    playLineAudio(story.turns[0].tamilText);
  };

  const handleNextTurn = () => {
    if (!activeStory) return;
    sounds.playPop();

    if (currentTurnIdx + 1 < activeStory.turns.length) {
      const nextIdx = currentTurnIdx + 1;
      setCurrentTurnIdx(nextIdx);
      setSelectedAnswer(null);
      setAnsweredCorrectly(null);
      playLineAudio(activeStory.turns[nextIdx].tamilText);
    } else {
      // Completed story!
      sounds.playLevelComplete();
      confetti({ particleCount: 80, spread: 60 });
      setIsFinished(true);
      onEarnReward(activeStory.xpReward, 10);
    }
  };

  const handleCheckQuestion = (opt: string) => {
    if (!activeStory) return;
    const turn = activeStory.turns[currentTurnIdx];
    if (!turn.question) return;

    setSelectedAnswer(opt);
    if (opt === turn.question.correctAnswer) {
      sounds.playCorrect();
      setAnsweredCorrectly(true);
    } else {
      sounds.playWrong();
      setAnsweredCorrectly(false);
    }
  };

  // If in story reader
  if (activeStory) {
    const currentTurn = activeStory.turns[currentTurnIdx];
    const hasQuestion = Boolean(currentTurn.question);
    const canContinue = !hasQuestion || answeredCorrectly === true;

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 font-sans">
        {/* Story Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveStory(null)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Duolingo Story
            </span>
            <h3 className="text-base font-extrabold text-white">
              {activeStory.title}
            </h3>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold">
            {currentTurnIdx + 1} / {activeStory.turns.length}
          </div>
        </div>

        {/* Story Completed Screen */}
        {isFinished ? (
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mb-4">
              🎉
            </div>
            <h3 className="text-2xl font-black text-white">Story Completed!</h3>
            <p className="text-sm text-slate-400 mt-1 mb-6">
              You understood natural spoken Tamil in context!
            </p>
            <div className="flex items-center gap-4 bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 mb-6">
              <span className="text-amber-400 font-extrabold text-sm flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> +{activeStory.xpReward} XP
              </span>
              <span className="text-cyan-400 font-extrabold text-sm">
                💎 +10 Gems
              </span>
            </div>
            <button
              onClick={() => setActiveStory(null)}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase rounded-2xl cursor-pointer"
            >
              Back to Stories
            </button>
          </div>
        ) : (
          /* Active Dialogue Progression */
          <div className="space-y-4">
            {/* Previous Lines displayed in muted dialogue history */}
            {activeStory.turns.slice(0, currentTurnIdx).map((turn, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-start gap-3 opacity-60"
              >
                <span className="text-2xl">{turn.speakerAvatar}</span>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">
                    {turn.speaker}
                  </span>
                  <p className="text-sm text-slate-300 font-medium font-sans">
                    "{turn.tamilText}"
                  </p>
                  <p className="text-xs text-slate-500">
                    ({turn.englishTranslation})
                  </p>
                </div>
              </div>
            ))}

            {/* Current Active Line */}
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-xl flex items-start gap-4 animate-in fade-in duration-200">
              <span className="text-3xl shrink-0">{currentTurn.speakerAvatar}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    {currentTurn.speaker}
                  </span>
                  <button
                    onClick={() => playLineAudio(currentTurn.tamilText)}
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Replay Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-base sm:text-lg font-black text-white font-sans leading-snug">
                  "{currentTurn.tamilText}"
                </p>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  ({currentTurn.englishTranslation})
                </p>
              </div>
            </div>

            {/* In-Story Comprehension Check */}
            {hasQuestion && currentTurn.question && (
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-500/40 shadow-xl space-y-3 mt-4">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  Quick Check:
                </span>
                <h4 className="text-sm font-extrabold text-white">
                  {currentTurn.question.prompt}
                </h4>
                <div className="space-y-2">
                  {currentTurn.question.options.map((opt, i) => {
                    const isSelected = selectedAnswer === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => handleCheckQuestion(opt)}
                        className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected && answeredCorrectly
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : isSelected && !answeredCorrectly
                            ? "bg-rose-500/20 border-rose-500 text-rose-300"
                            : "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && answeredCorrectly && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
                {answeredCorrectly === false && (
                  <p className="text-xs text-rose-400 font-medium">
                    💡 Hint: {currentTurn.question.hint}
                  </p>
                )}
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextTurn}
                disabled={!canContinue}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-slate-950 font-black text-sm uppercase rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Story Index / Catalog
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Conversational Narratives
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Tamil Stories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Follow authentic spoken Tamil stories and test listening comprehension.
          </p>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
          <BookOpen className="w-7 h-7" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => startStory(story)}
            className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                  {story.turns.length} Dialogues
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  +{story.xpReward} XP
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                {story.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {story.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Read Story</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
