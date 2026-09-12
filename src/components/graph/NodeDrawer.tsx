"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { X, Waypoints, Sparkles, Loader2, Trash2 } from "lucide-react";

export default function NodeDrawer({
  cardId,
  onClose,
}: {
  cardId: string;
  onClose: () => void;
}) {
  const card = useStore((s) => s.cards.find((c) => c.id === cardId));
  const cards = useStore((s) => s.cards);
  const updateCard = useStore((s) => s.updateCard);
  const deleteCard = useStore((s) => s.deleteCard);
  const expandWithAI = useStore((s) => s.expandWithAI);
  const pendingAIParentId = useStore((s) => s.pendingAIParentId);
  const setActiveCard = useStore((s) => s.setActiveCard);

  const [sourceContent, setSourceContent] = useState(card?.sourceContent ?? "");
  const [curationReason, setCurationReason] = useState(card?.curationReason ?? "");
  const [intendedUse, setIntendedUse] = useState(card?.intendedUse ?? "");

  useEffect(() => {
    if (!card) return;
    setSourceContent(card.sourceContent);
    setCurationReason(card.curationReason);
    setIntendedUse(card.intendedUse);
  }, [card?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card) return null;
  const isPending = pendingAIParentId === card.id;
  const save = () => updateCard(card.id, { sourceContent, curationReason, intendedUse });

  return (
    <aside className="absolute right-0 top-0 z-20 h-full w-full max-w-sm border-l border-hairline bg-surface shadow-drawer overflow-y-auto animate-pop-in">
      <div className="flex items-start justify-between gap-3 border-b border-hairline px-5 py-4">
        <h2 className="font-display italic text-lg text-ink leading-snug">{card.title}</h2>
        <button onClick={onClose} className="text-ink-faint hover:text-ink transition-colors shrink-0">
          <X size={18} />
        </button>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        <Field label="原始素材" value={sourceContent} onChange={setSourceContent} onBlur={save} />
        <Field label="收集理由" value={curationReason} onChange={setCurationReason} onBlur={save} />
        <Field label="打算怎么用" value={intendedUse} onChange={setIntendedUse} onBlur={save} />

        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hairline bg-raised px-2.5 py-1 text-xs text-ink-muted font-ui"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => expandWithAI(card.id)}
          disabled={isPending}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-signal-soft border border-signal/40 px-3 py-2 text-sm font-ui font-medium text-signal hover:bg-signal/20 transition-colors disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> 拓展中…
            </>
          ) : (
            <>
              <Sparkles size={14} /> AI 拓展分支
            </>
          )}
        </button>

        {card.connections.length > 0 && (
          <div>
            <span className="text-xs text-ink-faint font-ui flex items-center gap-1.5 mb-2">
              <Waypoints size={12} /> 关联脉络
            </span>
            <ul className="flex flex-col gap-1.5">
              {card.connections.map((conn) => {
                const target = cards.find((c) => c.id === conn.targetId);
                if (!target) return null;
                return (
                  <li
                    key={conn.targetId}
                    onClick={() => setActiveCard(target.id)}
                    className="cursor-pointer text-sm text-ink-muted rounded-lg border border-hairline bg-raised px-3 py-2 hover:border-signal/40 transition-colors"
                  >
                    <span className="text-ink">{target.title}</span>
                    <span className="text-ink-faint"> — {conn.description}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button
          onClick={() => {
            deleteCard(card.id);
            onClose();
          }}
          className="self-start flex items-center gap-1.5 text-xs text-ink-faint hover:text-red-400 transition-colors font-ui"
        >
          <Trash2 size={12} /> 删除这张卡片
        </button>
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-ink-faint font-ui">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={3}
        placeholder="（空）"
        className="resize-none rounded-lg bg-raised border border-hairline px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-signal/60"
      />
    </label>
  );
}
