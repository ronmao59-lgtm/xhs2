import { appConfig } from "@/lib/config";
import type { ContentSourceAdapter } from "@/lib/sources/types";
import { mockSourceAdapter } from "@/lib/sources/mock-source";
import { xhsSourceAdapter } from "@/lib/sources/xhs-source";

export function getContentSourceAdapter(): ContentSourceAdapter {
  if (appConfig.dataSource === "xiaohongshu") {
    return xhsSourceAdapter;
  }

  return mockSourceAdapter;
}
