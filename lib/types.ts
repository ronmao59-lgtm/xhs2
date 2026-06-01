import type { RadarKeyword } from "@/lib/config";

export type RadarNote = {
  id?: string;
  runId?: string | null;
  sourceNoteId: string;
  keyword: RadarKeyword;
  title: string;
  authorName: string;
  content: string;
  noteUrl: string | null;
  coverUrl: string | null;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  publishedAt: string;
  capturedAt?: string;
  heatScore?: number;
};

export type TitleFormula = {
  name: string;
  formula: string;
  examples: string[];
  whyItWorks: string;
};

export type ShotPlan = {
  scene: string;
  visual: string;
  narration: string;
  durationSeconds: number;
};

export type RadarAnalysis = {
  summary: string;
  viralPatterns: string[];
  titleFormulas: TitleFormula[];
  shootingSuggestions: string[];
  talkingScript: string;
  storyboard: ShotPlan[];
  risks: string[];
};

export type TopicPlan = {
  id: string;
  order: number;
  title: string;
  angle: string;
  whyNow: string;
  targetUser: string;
  hook: string;
  script: string;
  storyboard: ShotPlan[];
  callToAction: string;
};

export type RadarRun = {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  status: "running" | "succeeded" | "failed";
  keywords: string[];
  notesScanned: number;
  notesSelected: number;
  errorMessage: string | null;
};
