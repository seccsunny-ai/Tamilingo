import React, { useState, useEffect } from "react";
import { TopNav, NavTab } from "./components/TopNav";
import { PathView } from "./components/PathView";
import { StoriesView } from "./components/StoriesView";
import { LessonModal } from "./components/LessonModal";
import { CelebrationModal } from "./components/CelebrationModal";
import { GuidebookModal } from "./components/GuidebookModal";
import { MatchMadnessModal } from "./components/MatchMadnessModal";
import { TranscriptHubDrawer } from "./components/TranscriptHubDrawer";
import { ExportModal } from "./components/ExportModal";
import { Lesson, UnitGuidebook, ALL_UNITS } from "./data/curriculum";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("path");

  // Gamification State (Persisted in localStorage)
  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("tamilingo_streak") || "3", 10);
    } catch {
      return 3;
    }
  });

  const [gems, setGems] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("tamilingo_gems") || "120", 10);
    } catch {
      return 120;
    }
  });

  const [hearts, setHearts] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("tamilingo_hearts") || "5", 10);
    } catch {
      return 5;
    }
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tamilingo_completed");
      return saved ? JSON.parse(saved) : ["u1-l1"];
    } catch {
      return ["u1-l1"];
    }
  });

  // Modals & Active Views
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [celebrationLesson, setCelebrationLesson] = useState<Lesson | null>(null);
  const [activeGuidebook, setActiveGuidebook] = useState<UnitGuidebook | null>(null);
  const [isMatchMadnessOpen, setIsMatchMadnessOpen] = useState(false);
  const [isTranscriptsOpen, setIsTranscriptsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("tamilingo_streak", streak.toString());
      localStorage.setItem("tamilingo_gems", gems.toString());
      localStorage.setItem("tamilingo_hearts", hearts.toString());
      localStorage.setItem("tamilingo_completed", JSON.stringify(completedLessons));
    } catch (e) {}
  }, [streak, gems, hearts, completedLessons]);

  const handleLoseHeart = () => {
    setHearts((prev) => Math.max(0, prev - 1));
  };

  const handleRefillHearts = () => {
    if (hearts < 5) {
      setHearts(5);
    }
  };

  const handleCompleteLesson = () => {
    if (!activeLesson) return;

    const lesson = activeLesson;
    setActiveLesson(null);
    setCelebrationLesson(lesson);

    // Update progress
    setGems((prev) => prev + 15);
    setStreak((prev) => prev + 1);

    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons((prev) => [...prev, lesson.id]);
    }
  };

  const handleEarnReward = (xp: number, earnedGems: number) => {
    setGems((prev) => prev + earnedGems);
  };

  // Find next active lesson in the path
  const allLessons = ALL_UNITS.flatMap((u) => u.lessons);
  const currentLesson =
    allLessons.find((l) => !completedLessons.includes(l.id)) || allLessons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        streak={streak}
        gems={gems}
        hearts={hearts}
        onOpenTranscripts={() => setIsTranscriptsOpen(true)}
        onOpenMatchMadness={() => setIsMatchMadnessOpen(true)}
        onRefillHearts={handleRefillHearts}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentTab === "path" && (
          <PathView
            completedLessons={completedLessons}
            currentLessonId={currentLesson.id}
            onSelectLesson={(lesson) => {
              if (hearts <= 0) {
                setHearts(5); // Auto-refill for friendly learning
              }
              setActiveLesson(lesson);
            }}
            onOpenGuidebook={(gb) => setActiveGuidebook(gb)}
          />
        )}

        {currentTab === "stories" && (
          <StoriesView onEarnReward={handleEarnReward} />
        )}
      </main>

      {/* Active Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          hearts={hearts}
          onLoseHeart={handleLoseHeart}
          onComplete={handleCompleteLesson}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {/* Lesson Complete Celebration Modal */}
      {celebrationLesson && (
        <CelebrationModal
          isOpen={Boolean(celebrationLesson)}
          xpEarned={celebrationLesson.xpReward}
          streak={streak}
          lessonTitle={celebrationLesson.title}
          onContinue={() => setCelebrationLesson(null)}
        />
      )}

      {/* Unit Guidebook Modal */}
      <GuidebookModal
        guidebook={activeGuidebook}
        isOpen={Boolean(activeGuidebook)}
        onClose={() => setActiveGuidebook(null)}
      />

      {/* Match Madness Timed Game */}
      <MatchMadnessModal
        isOpen={isMatchMadnessOpen}
        onClose={() => setIsMatchMadnessOpen(false)}
        onEarnReward={handleEarnReward}
      />

      {/* Source Transcripts Hub Drawer */}
      <TranscriptHubDrawer
        isOpen={isTranscriptsOpen}
        onClose={() => setIsTranscriptsOpen(false)}
        onOpenExportModal={() => {
          setIsTranscriptsOpen(false);
          setIsExportModalOpen(true);
        }}
      />

      {/* Bulk Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        cachedCount={40}
        totalVideos={425}
      />
    </div>
  );
}
