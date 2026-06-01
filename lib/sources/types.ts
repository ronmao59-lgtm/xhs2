import type { RadarKeyword } from "@/lib/config";
import type { RadarNote } from "@/lib/types";

export type FetchRecentHotNotesInput = {
  keyword: RadarKeyword;
  since: Date;
  limit: number;
};

export interface ContentSourceAdapter {
  name: string;
  fetchRecentHotNotes(input: FetchRecentHotNotesInput): Promise<RadarNote[]>;
}
