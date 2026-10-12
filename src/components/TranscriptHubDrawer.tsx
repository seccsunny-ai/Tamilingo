import React, { useState, useEffect } from "react";
import { X, Search, BookOpen, Download, ExternalLink, Play, Check } from "lucide-react";
import { VideoItem, TranscriptData } from "../types";
import { VideoCard } from "./VideoCard";
import { TranscriptViewer } from "./TranscriptViewer";

interface TranscriptHubDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExportModal: () => void;
}

export const TranscriptHubDrawer: React.FC<TranscriptHubDrawerProps> = ({
  isOpen,
  onClose,
  onOpenExportModal,
}) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/videos?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setVideos(data.videos || []);
          if (!selectedVideo && data.videos?.length > 0) {
            setSelectedVideo(data.videos[0]);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    if (selectedVideo) {
      setLoadingTranscript(true);
      fetch(`/api/transcript/${selectedVideo.id}`)
        .then((res) => res.json())
        .then((data) => setTranscript(data.transcript || null))
        .catch(() => setTranscript(null))
        .finally(() => setLoadingTranscript(false));
    }
  }, [selectedVideo?.id]);

  if (!isOpen) return null;

  const totalPages = Math.ceil(videos.length / pageSize) || 1;
  const paginated = videos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Learn Tamil Source Transcripts Hub
              </h3>
              <p className="text-xs text-slate-400">
                425 YouTube videos & transcripts powering your lessons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExportModal}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 425 video titles or spoken dialogue..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Split Catalog & Reader */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden p-4 gap-4">
          {/* Catalog */}
          <div className="md:col-span-5 flex flex-col h-full bg-slate-900/40 rounded-2xl border border-slate-800/80 p-3 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {paginated.map((v) => (
                <VideoCard
                  key={v.id}
                  video={v}
                  isSelected={selectedVideo?.id === v.id}
                  onSelect={(sel) => setSelectedVideo(sel)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded bg-slate-800 disabled:opacity-40"
                >
                  Prev
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded bg-slate-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Transcript Viewer */}
          <div className="md:col-span-7 h-full">
            <TranscriptViewer
              video={selectedVideo}
              transcript={transcript}
              isLoading={loadingTranscript}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
