"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Sparkles, Loader2 } from "lucide-react";
import { InspirationCard } from "@/lib/types";
import { useStore } from "@/lib/store";

export interface CardNodeData extends Record<string, unknown> {
  card: InspirationCard;
  isRootPick: boolean;
  rootFinderActive: boolean;
}

function CardNode({ data }: NodeProps<Node<CardNodeData>>) {
  const { card, isRootPick, rootFinderActive } = data;
  const expandWithAI = useStore((s) => s.expandWithAI);
  const pendingAIParentId = useStore((s) => s.pendingAIParentId);
  const [hovered, setHovered] = useState(false);
  const isPending = pendingAIParentId === card.id;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-[220px] rounded-xl border bg-surface px-4 py-3.5 shadow-pin transition-colors ${
        isRootPick
          ? "border-amber-400/70 ring-2 ring-amber-400/30"
          : card.isAIGenerated
          ? "border-signal/40"
          : "border-hairline"
      } ${rootFinderActive ? "cursor-crosshair" : "cursor-pointer"}`}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} isConnectable={false} className="!opacity-0" />

      <div className="absolute -top-1.5 left-4 h-2.5 w-2.5 rounded-full bg-signal" />

      <h3 className="font-display italic text-[15px] leading-snug text-ink pr-1 line-clamp-2">
        {card.title}
      </h3>

      {card.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-hairline bg-raised px-1.5 py-0.5 text-[10px] text-ink-muted font-ui"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {(hovered || isPending) && !rootFinderActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isPending) expandWithAI(card.id);
          }}
          disabled={isPending}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-signal-soft border border-signal/40 px-2 py-1.5 text-[11px] font-ui font-medium text-signal hover:bg-signal/20 transition-colors disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" /> 拓展中…
            </>
          ) : (
            <>
              <Sparkles size={12} /> AI 拓展分支
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default memo(CardNode);
