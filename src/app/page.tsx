"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import ViewToggle from "@/components/ViewToggle";
import QuickAdd from "@/components/QuickAdd";
import CardFeed from "@/components/CardFeed";
import CardDetailModal from "@/components/CardDetailModal";
import GraphView from "@/components/graph/GraphView";

export default function Home() {
  const viewMode = useStore((s) => s.viewMode);
  const [detailId, setDetailId] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-hairline bg-void/85 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-display italic text-[22px] leading-none text-ink">
              灵感board
            </h1>
            <span className="text-ink-faint text-xs font-ui hidden sm:inline">
              收集碎片，长成脉络
            </span>
          </div>
          <ViewToggle />
        </div>
      </header>

      {viewMode === "feed" ? (
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 py-8 flex-1">
          <QuickAdd />
          <CardFeed onOpenDetail={setDetailId} />
        </div>
      ) : (
        <div className="flex-1 relative">
          <GraphView />
        </div>
      )}

      {detailId && (
        <CardDetailModal cardId={detailId} onClose={() => setDetailId(null)} />
      )}
    </main>
  );
}
