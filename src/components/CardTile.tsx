"use client";

import { InspirationCard } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Trash2, Waypoints, Sparkles } from "lucide-react";

function hashRotation(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return ((h % 100) / 100 - 0.5) * 1.6; // -0.8deg .. 0.8deg
}

export default function CardTile({
  card,
  onOpen,
}: {
  card: InspirationCard;
  onOpen: () => void;
}) {
  const deleteCard = useStore((s) => s.deleteCard);
  const rotation = hashRotation(card.id);

  return (
    <div
      onClick={onOpen}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="group relative cursor-pointer rounded-xl border border-hairline bg-surface p-4 shadow-pin transition-transform hover:-translate-y-0.5 hover:rotate-0"
    >
      <div className="absolute -top-1.5 left-5 h-3 w-3 rounded-full bg-signal shadow-[0_2px_6px_rgba(140,124,240,0.6)]" />

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display italic text-[17px] leading-snug text-ink pr-2">
          {card.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(card.id);
          }}
          className="shrink-0 text-ink-faint opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
          aria-label="删除卡片"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {card.sourceContent && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted line-clamp-4">
          {card.sourceContent}
        </p>
      )}

      {card.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-hairline bg-raised px-2 py-0.5 text-[11px] text-ink-muted font-ui"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-faint font-ui">
        {card.isAIGenerated && (
          <span className="flex items-center gap-1 text-signal/80">
            <Sparkles size={11} /> AI 生成
          </span>
        )}
        {card.connections.length > 0 && (
          <span className="flex items-center gap-1">
            <Waypoints size={11} /> {card.connections.length} 条关联
          </span>
        )}
      </div>
    </div>
  );
}
