export interface VideoItem {
  id: string;
  title: string;
  duration?: string;
  thumbnail: string;
  index: number;
  hasTranscript: boolean;
  segmentCount?: number;
  snippet?: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  dur: number;
}

export interface TranscriptData {
  id: string;
  title: string;
  fetchedAt: string;
  segments: TranscriptSegment[];
  fullText: string;
  sourceLang?: string;
}

export interface ChannelInfo {
  name: string;
  handle: string;
  url: string;
  totalVideos: number;
  cachedTranscripts: number;
}

export interface BatchState {
  running: boolean;
  total: number;
  completed: number;
  failed: number;
  currentVideo: string;
  lastUpdated: string;
}
