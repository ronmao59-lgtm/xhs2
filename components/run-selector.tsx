"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { RadarRun } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/date";

type RunSelectorProps = {
  runs: RadarRun[];
  selectedRunId: string | null;
};

function runLabel(run: RadarRun, index: number) {
  const time = formatDateTime(run.finishedAt || run.startedAt);
  const prefix = index === 0 ? "最新批次" : `历史批次 ${index}`;
  return `${prefix} | ${time} | 入选 ${run.notesSelected} 条`;
}

export function RunSelector({ runs, selectedRunId }: RunSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="run-selector">
      <span>雷达日期</span>
      <select
        value={selectedRunId || runs[0]?.id || ""}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("run", event.target.value);
          router.push(`/?${params.toString()}`);
        }}
      >
        {runs.map((run, index) => (
          <option key={run.id} value={run.id}>
            {runLabel(run, index)}
          </option>
        ))}
      </select>
    </label>
  );
}
