"use client";

import { useStore } from "@/lib/store";
import CardTile from "./CardTile";

export default function CardFeed({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const cards = useStore((s) => s.cards);
  const ordered = [...cards].sort((a, b) => b.createdAt - a.createdAt);

  if (ordered.length === 0) {
    return (
      <div className="mt-16 text-center text-ink-faint font-ui">
        <p className="font-display italic text-lg text-ink-muted mb-1">还没有卡片</p>
        <p className="text-sm">在上面写下第一个念头，开始收集。</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
      {ordered.map((card) => (
        <div key={card.id} className="break-inside-avoid mb-4">
          <CardTile card={card} onOpen={() => onOpenDetail(card.id)} />
        </div>
      ))}
    </div>
  );
}
