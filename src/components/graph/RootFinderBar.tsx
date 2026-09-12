"use client";

import { useStore } from "@/lib/store";
import { Sparkles, Loader2, X } from "lucide-react";

export default function RootFinderBar() {
  const rootFinderActive = useStore((s) => s.rootFinderActive);
  const rootFinderFirstId = useStore((s) => s.rootFinderFirstId);
  const pendingRootPair = useStore((s) => s.pendingRootPair);
  const toggleRootFinder = useStore((s) => s.toggleRootFinder);
  const cards = useStore((s) => s.cards);
  const firstTitle = cards.find((c) => c.id === rootFinderFirstId)?.title;

  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
      <button
        onClick={toggleRootFinder}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-ui font-medium shadow-pin transition-colors ${
          rootFinderActive
            ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
            : "border-hairline bg-surface text-ink hover:border-signal/50"
        }`}
      >
        {rootFinderActive ? <X size={14} /> : <Sparkles size={14} />}
        {rootFinderActive ? "取消智能寻根" : "✨ 智能寻根"}
      </button>

      {rootFinderActive && (
        <div className="max-w-[220px] rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-xs text-ink-muted font-ui shadow-pin animate-pop-in">
          {pendingRootPair ? (
            <span className="flex items-center gap-1.5 text-signal">
              <Loader2 size={12} className="animate-spin" /> 正在提炼共同脉络…
            </span>
          ) : firstTitle ? (
            <span>
              已选「<span className="text-ink">{firstTitle}</span>」，再点一张卡片建立连线
            </span>
          ) : (
            <span>依次点击两张卡片，AI 会提炼出连接它们的共同概念</span>
          )}
        </div>
      )}
    </div>
  );
}
