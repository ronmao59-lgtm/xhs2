import type { RadarNote } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function calculateHeatScore(note: RadarNote, now = new Date()): number {
  const publishedAt = new Date(note.publishedAt);
  const ageDays = Math.max(0.25, (now.getTime() - publishedAt.getTime()) / DAY_MS);
  const engagement =
    note.likeCount * 1 + note.commentCount * 4 + note.collectCount * 3;
  const freshness = Math.pow(ageDays, 0.72);

  return Math.round((engagement / freshness) * 100) / 100;
}

export function selectHotNotes(notes: RadarNote[], limit = 24): RadarNote[] {
  const seen = new Set<string>();

  return notes
    .filter((note) => {
      const dedupeKey = `${note.sourceNoteId || ""}:${note.title}`.toLowerCase();
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    })
    .map((note) => ({ ...note, heatScore: calculateHeatScore(note) }))
    .sort((a, b) => (b.heatScore || 0) - (a.heatScore || 0))
    .slice(0, limit);
}
