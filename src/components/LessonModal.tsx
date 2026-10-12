import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Mic,
  MicOff,
  Check,
  X,
  Heart,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Volume1,
  Keyboard,
  ExternalLink,
} from "lucide-react";
import { Exercise, Lesson } from "../data/curriculum";
import { sounds, speakTamil } from "../utils/audio";
import { Mascot } from "./Mascot";

interface LessonModalProps {
  lesson: Lesson;
  hearts: number;
  onLoseHeart: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  hearts,
  onLoseHeart,
  onComplete,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [useKeyboard, setUseKeyboard] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Evaluation state: null | 'correct' | 'wrong'
  const [evalStatus, setEvalStatus] = useState<"correct" | "wrong" | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  const recognitionRef = useRef<any>(null);
  const currentExercise = lesson.exercises[currentIdx];

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // Recognize Indian English / transliterated Tamil phonetics

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join("");
          setSpeechTranscript(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
        setUseKeyboard(true);
      }
    }
  }, []);

  // Auto-play audio on exercise load
  useEffect(() => {
    if (currentExercise) {
      setSelectedOption(null);
      setTypedInput("");
      setSpeechTranscript("");
      setEvalStatus(null);
      setIsListening(false);

      // Play audio automatically for listening/mimicry exercises
      if (currentExercise.type === "listening" || currentExercise.type === "mimicry") {
        playAudio(currentExercise.tamilAudioText, 0.9);
      }
    }
  }, [currentIdx]);

  // Audio Player Helper
  const playAudio = (text: string, rate = 0.9) => {
    setIsPlayingAudio(true);
    speakTamil(text, rate, () => setIsPlayingAudio(false));
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setUseKeyboard(true);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Clean and normalize strings for matching
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  };

  // Check Answer Handler
  const handleCheck = () => {
    if (evalStatus !== null) {
      handleNext();
      return;
    }

    let isCorrect = false;

    if (currentExercise.type === "listening" || currentExercise.type === "fill_blank") {
      isCorrect = normalize(selectedOption || "") === normalize(currentExercise.correctAnswer);
    } else if (currentExercise.type === "speaking" || currentExercise.type === "mimicry") {
      const userAnswer = useKeyboard ? typedInput : speechTranscript || typedInput;
      const target = normalize(currentExercise.correctAnswer);
      const userNorm = normalize(userAnswer);

      // Levenshtein / Substring similarity match for speech transliteration
      isCorrect =
        userNorm.includes(target) ||
        target.includes(userNorm) ||
        userNorm.slice(0, 4) === target.slice(0, 4);
    }

    if (isCorrect) {
      sounds.playCorrect();
      setEvalStatus("correct");
      setConsecutiveCorrect((prev) => prev + 1);
    } else {
      sounds.playWrong();
      setEvalStatus("wrong");
      setConsecutiveCorrect(0);
      onLoseHeart();
    }
  };

  // Advance to next exercise or complete
  const handleNext = () => {
    if (currentIdx + 1 < lesson.exercises.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  // Encouraging feedback line
  const getEncouragingText = () => {
    if (consecutiveCorrect >= 3) return "🔥 3 in a row! You're on fire!";
    if (consecutiveCorrect === 2) return "⚡ Brilliant! Keep the momentum!";
    return "🎯 Spot on! Perfect pronunciation!";
  };

  const progressPercent = Math.round(((currentIdx + (evalStatus === "correct" ? 1 : 0)) / lesson.exercises.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="max-w-3xl w-full mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-sm">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Exercise View */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-3 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Exercise Type Header & Prompt */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-block mb-2">
              {currentExercise.type === "listening" && "🎧 Listening Comprehension"}
              {currentExercise.type === "speaking" && "🎙️ Speaking Challenge"}
              {currentExercise.type === "mimicry" && "🗣️ Repeat After Me"}
              {currentExercise.type === "fill_blank" && "✏️ Fill in the Blank"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {currentExercise.promptText}
            </h2>
          </div>

          {/* Audio Player Card (for Listening / Mimicry / Fill in blank) */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {/* Big Speaker Button */}
              <button
                onClick={() => playAudio(currentExercise.tamilAudioText, 0.9)}
                className="w-16 h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
                title="Play Audio (Normal Speed)"
              >
                <Volume2 className={`w-8 h-8 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </button>

              {/* Slow Turtle Button */}
              <button
                onClick={() => playAudio(currentExercise.tamilAudioText, 0.65)}
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-2 border-slate-700 text-amber-400 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Play Slow (Turtle Mode)"
              >
                <Volume1 className="w-5 h-5" />
              </button>

              {/* Transliteration Display with Pronunciation Chip */}
              <div className="flex-1">
                {currentExercise.type !== "fill_blank" ? (
                  <div>
                    <span className="text-lg sm:text-xl font-extrabold text-amber-300 font-sans tracking-wide">
                      "{currentExercise.tamilAudioText}"
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ({currentExercise.englishTranslation})
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-base sm:text-lg font-bold text-slate-200">
                      Listen and complete the sentence:
                    </span>
                    <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                      ({currentExercise.englishTranslation})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Phonetic Syllable Breakdown (for Audio Mimicry) */}
            {currentExercise.phoneticBreakdown && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Phonetic Breakdown (Syllables):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {currentExercise.phoneticBreakdown.map((syl, i) => (
                    <button
                      key={i}
                      onClick={() => playAudio(syl, 0.75)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-amber-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      {syl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Exercise Specific Input Controls */}
          {/* 1. Multiple Choice Options (Listening & Fill Blank) */}
          {currentExercise.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentExercise.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedOption(opt);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. Speaking / Voice Mimicry Controls */}
          {(currentExercise.type === "speaking" || currentExercise.type === "mimicry") && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col items-center gap-4 text-center">
              {!useKeyboard && speechSupported ? (
                <>
                  <button
                    onClick={toggleListening}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-b-4 border-emerald-700 active:border-b-0"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>
                  <p className="text-xs font-semibold text-slate-300">
                    {isListening ? "Listening... Speak now aloud!" : "Tap the mic and say the phrase aloud"}
                  </p>

                  {speechTranscript && (
                    <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm font-bold text-amber-300">
                      Heard: "{speechTranscript}"
                    </div>
                  )}

                  <button
                    onClick={() => setUseKeyboard(true)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 mt-1 underline cursor-pointer"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>Cannot speak now? Type instead</span>
                  </button>
                </>
              ) : (
                <div className="w-full flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 text-left">
                    Type transliterated Tamil (Romanized):
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${currentExercise.correctAnswer}`}
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3 text-base text-white font-medium focus:outline-none"
                    autoFocus
                  />
                  {speechSupported && (
                    <button
                      onClick={() => setUseKeyboard(false)}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 self-start underline cursor-pointer mt-1"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Switch back to microphone</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Video Lesson Reference Tag */}
          {currentExercise.videoReference && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                SOURCE
              </span>
              <span>Based on video lesson:</span>
              <a
                href={`https://www.youtube.com/watch?v=${currentExercise.videoReference.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                {currentExercise.videoReference.lessonTitle}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Empty space before bottom drawer */}
        <div className="h-24" />
      </div>

      {/* Duolingo Bottom Feedback Drawer */}
      <div
        className={`w-full border-t-2 transition-all duration-200 p-4 sm:p-5 ${
          evalStatus === "correct"
            ? "bg-emerald-950 border-emerald-500 text-emerald-100"
            : evalStatus === "wrong"
            ? "bg-rose-950 border-rose-500 text-rose-100"
            : "bg-slate-900 border-slate-800 text-slate-200"
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {evalStatus === "correct" ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-extrabold text-base text-emerald-300">
                  {getEncouragingText()}
                </h4>
                <p className="text-xs text-emerald-200/90 font-medium">
                  {currentExercise.tamilAudioText} = {currentExercise.englishTranslation}
                </p>
              </div>
            </div>
          ) : evalStatus === "wrong" ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xl shrink-0">
                ✕
              </div>
              <div>
                <h4 className="font-extrabold text-base text-rose-300">
                  Not quite right!
                </h4>
                <p className="text-xs text-rose-200 font-medium">
                  Correct Answer: <strong className="text-white">"{currentExercise.correctAnswer}"</strong>
                </p>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  💡 Hint: {currentExercise.hint}
                </p>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Hint: {currentExercise.hint}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={evalStatus ? handleNext : handleCheck}
            disabled={
              evalStatus === null &&
              !selectedOption &&
              !typedInput &&
              !speechTranscript
            }
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
              evalStatus === "correct"
                ? "bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-slate-950"
                : evalStatus === "wrong"
                ? "bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 text-white"
                : "bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-slate-950"
            }`}
          >
            {evalStatus ? "Continue" : "Check Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};
