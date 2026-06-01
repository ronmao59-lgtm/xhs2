import { subDays } from "@/lib/utils/date";
import { RADAR_KEYWORDS } from "@/lib/config";
import { analyzeHotNotes } from "@/lib/openai/analyze";
import {
  createRadarRun,
  finishRadarRun,
  insertAnalysis,
  upsertNotes
} from "@/lib/radar/repository";
import { selectHotNotes } from "@/lib/scoring";
import { getContentSourceAdapter } from "@/lib/sources";

export async function runDailyRadar() {
  const runId = await createRadarRun();
  const source = getContentSourceAdapter();
  const since = subDays(new Date(), 7);
  let scanned = 0;
  let selected = 0;

  try {
    const batches = await Promise.all(
      RADAR_KEYWORDS.map((keyword) =>
        source.fetchRecentHotNotes({
          keyword,
          since,
          limit: 12
        })
      )
    );

    const notes = batches.flat();
    scanned = notes.length;
    const hotNotes = selectHotNotes(notes, 36);
    selected = hotNotes.length;
    const analysis = await analyzeHotNotes(hotNotes);

    await upsertNotes(hotNotes, runId);
    await insertAnalysis(runId, analysis);
    await finishRadarRun(runId, "succeeded", scanned, selected);

    return {
      runId,
      source: source.name,
      scanned,
      selected,
      analysis
    };
  } catch (error) {
    await finishRadarRun(
      runId,
      "failed",
      scanned,
      selected,
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}
