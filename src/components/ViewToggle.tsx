"use client";

import { useStore } from "@/lib/store";
import { LayoutGrid, Waypoints } from "lucide-react";

export default function ViewToggle() {
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  return (
    <div className="flex items-center rounded-full border border-hairline bg-surface p-1 text-sm font-ui">
      <button
        onClick={() => setViewMode("feed")}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${
          viewMode === "feed" ? "bg-raised text-ink" : "text-ink-muted hover:text-ink"
        }`}
      >
        <LayoutGrid size={14} strokeWidth={2} />
        卡片流
      </button>
      <button
        onClick={() => setViewMode("graph")}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${
          viewMode === "graph" ? "bg-raised text-ink" : "text-ink-muted hover:text-ink"
        }`}
      >
        <Waypoints size={14} strokeWidth={2} />
        知识图谱
      </button>
    </div>
  );
}
