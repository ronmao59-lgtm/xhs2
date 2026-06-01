import { RADAR_KEYWORDS } from "@/lib/config";
import { createFallbackAnalysis } from "@/lib/openai/analyze";
import { selectHotNotes } from "@/lib/scoring";
import { mockSourceAdapter } from "@/lib/sources/mock-source";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { RadarAnalysis, RadarNote, RadarRun } from "@/lib/types";
import { subDays } from "@/lib/utils/date";

export function canUseSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function createRadarRun(): Promise<string | null> {
  if (!canUseSupabase()) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("radar_runs")
    .insert({
      status: "running",
      keywords: [...RADAR_KEYWORDS]
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function finishRadarRun(
  runId: string | null,
  status: "succeeded" | "failed",
  notesScanned: number,
  notesSelected: number,
  errorMessage?: string
) {
  if (!runId || !canUseSupabase()) return;

  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("radar_runs")
    .update({
      status,
      finished_at: new Date().toISOString(),
      notes_scanned: notesScanned,
      notes_selected: notesSelected,
      error_message: errorMessage ?? null
    })
    .eq("id", runId);

  if (error) throw error;
}

export async function upsertNotes(notes: RadarNote[], runId: string | null) {
  if (!canUseSupabase()) return;

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("notes").upsert(
    notes.map((note) => ({
      run_id: runId,
      source_note_id: note.sourceNoteId,
      keyword: note.keyword,
      title: note.title,
      author_name: note.authorName,
      content: note.content,
      note_url: note.noteUrl,
      cover_url: note.coverUrl,
      like_count: note.likeCount,
      comment_count: note.commentCount,
      collect_count: note.collectCount,
      heat_score: note.heatScore ?? 0,
      published_at: note.publishedAt,
      captured_at: note.capturedAt ?? new Date().toISOString(),
      raw: note
    })),
    { onConflict: "run_id,source_note_id,keyword" }
  );

  if (error) throw error;
}

export async function insertAnalysis(runId: string | null, analysis: RadarAnalysis) {
  if (!canUseSupabase()) return;

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("analyses").insert({
    run_id: runId,
    keyword: null,
    summary: analysis.summary,
    viral_patterns: analysis.viralPatterns,
    title_formulas: analysis.titleFormulas,
    shooting_suggestions: analysis.shootingSuggestions,
    talking_script: analysis.talkingScript,
    storyboard: analysis.storyboard,
    risks: analysis.risks
  });

  if (error) throw error;
}

export type DashboardData = {
  notes: RadarNote[];
  analysis: RadarAnalysis | null;
  latestRun: RadarRun | null;
  selectedRun: RadarRun | null;
  runs: RadarRun[];
  cloudStatus: {
    connected: boolean;
    noteCount: number;
    analysisCount: number;
    latestRunStatus: RadarRun["status"] | "preview" | null;
  };
};

function mapNote(row: Record<string, any>): RadarNote {
  return {
    id: row.id,
    runId: row.run_id,
    sourceNoteId: row.source_note_id,
    keyword: row.keyword,
    title: row.title,
    authorName: row.author_name,
    content: row.content,
    noteUrl: row.note_url,
    coverUrl: row.cover_url,
    likeCount: row.like_count,
    commentCount: row.comment_count,
    collectCount: row.collect_count,
    heatScore: Number(row.heat_score || 0),
    publishedAt: row.published_at,
    capturedAt: row.captured_at
  };
}

function mapRun(row: Record<string, any>): RadarRun {
  return {
    id: row.id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    status: row.status,
    keywords: row.keywords,
    notesScanned: row.notes_scanned,
    notesSelected: row.notes_selected,
    errorMessage: row.error_message
  };
}

function mapAnalysis(row: Record<string, any>): RadarAnalysis {
  return {
    summary: row.summary,
    viralPatterns: row.viral_patterns,
    titleFormulas: row.title_formulas,
    shootingSuggestions: row.shooting_suggestions,
    talkingScript: row.talking_script,
    storyboard: row.storyboard,
    risks: row.risks
  };
}

export async function getDashboardData(selectedRunId?: string): Promise<DashboardData> {
  if (!canUseSupabase()) {
    const since = subDays(new Date(), 7);
    const batches = await Promise.all(
      RADAR_KEYWORDS.map((keyword) =>
        mockSourceAdapter.fetchRecentHotNotes({ keyword, since, limit: 4 })
      )
    );
    const notes = selectHotNotes(batches.flat(), 16);
    const previewRun: RadarRun = {
      id: "preview",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      status: "succeeded",
      keywords: [...RADAR_KEYWORDS],
      notesScanned: notes.length,
      notesSelected: notes.length,
      errorMessage: null
    };

    return {
      notes,
      analysis: createFallbackAnalysis(notes),
      latestRun: previewRun,
      selectedRun: previewRun,
      runs: [previewRun],
      cloudStatus: {
        connected: false,
        noteCount: 0,
        analysisCount: 0,
        latestRunStatus: "preview"
      }
    };
  }

  const supabase = createSupabaseAdmin();
  const [runsResult, notesCountResult, analysisCountResult] = await Promise.all([
    supabase.from("radar_runs").select("*").order("started_at", { ascending: false }).limit(30),
    supabase.from("notes").select("id", { count: "exact", head: true }),
    supabase.from("analyses").select("id", { count: "exact", head: true })
  ]);

  if (runsResult.error) throw runsResult.error;
  if (notesCountResult.error) throw notesCountResult.error;
  if (analysisCountResult.error) throw analysisCountResult.error;

  const runs = (runsResult.data || []).map(mapRun);
  const latestRun = runs[0] || null;
  const selectedRun =
    runs.find((run) => run.id === selectedRunId) || latestRun;

  if (!selectedRun) {
    return {
      notes: [],
      analysis: null,
      latestRun: null,
      selectedRun: null,
      runs: [],
      cloudStatus: {
        connected: true,
        noteCount: notesCountResult.count || 0,
        analysisCount: analysisCountResult.count || 0,
        latestRunStatus: null
      }
    };
  }

  const [notesResult, analysisResult] = await Promise.all([
    supabase
      .from("notes")
      .select("*")
      .eq("run_id", selectedRun.id)
      .order("heat_score", { ascending: false })
      .limit(24),
    supabase
      .from("analyses")
      .select("*")
      .eq("run_id", selectedRun.id)
      .order("created_at", { ascending: false })
      .limit(1)
  ]);

  if (notesResult.error) throw notesResult.error;
  if (analysisResult.error) throw analysisResult.error;

  return {
    notes: (notesResult.data || []).map(mapNote),
    analysis: analysisResult.data?.[0] ? mapAnalysis(analysisResult.data[0]) : null,
    latestRun,
    selectedRun,
    runs,
    cloudStatus: {
      connected: true,
      noteCount: notesCountResult.count || 0,
      analysisCount: analysisCountResult.count || 0,
      latestRunStatus: latestRun?.status || null
    }
  };
}

export async function getSafeDashboardData(selectedRunId?: string): Promise<
  DashboardData & { dataError: string | null }
> {
  try {
    return {
      ...(await getDashboardData(selectedRunId)),
      dataError: null
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error
          ? JSON.stringify(error)
          : String(error || "Unknown error");
    const since = subDays(new Date(), 7);
    const batches = await Promise.all(
      RADAR_KEYWORDS.map((keyword) =>
        mockSourceAdapter.fetchRecentHotNotes({ keyword, since, limit: 4 })
      )
    );
    const notes = selectHotNotes(batches.flat(), 16);
    const previewRun: RadarRun = {
      id: "preview",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      status: "succeeded",
      keywords: [...RADAR_KEYWORDS],
      notesScanned: notes.length,
      notesSelected: notes.length,
      errorMessage: null
    };

    return {
      notes,
      analysis: createFallbackAnalysis(notes),
      latestRun: previewRun,
      selectedRun: previewRun,
      runs: [previewRun],
      cloudStatus: {
        connected: false,
        noteCount: 0,
        analysisCount: 0,
        latestRunStatus: "preview"
      },
      dataError: message
    };
  }
}
