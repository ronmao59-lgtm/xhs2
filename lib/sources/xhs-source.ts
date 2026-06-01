import type { ContentSourceAdapter } from "@/lib/sources/types";

export const xhsSourceAdapter: ContentSourceAdapter = {
  name: "xiaohongshu",
  async fetchRecentHotNotes() {
    throw new Error(
      "Xiaohongshu scraping is intentionally disabled. Connect an authorized API, export, or compliant data provider in this adapter."
    );
  }
};
