"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { X, Waypoints, ArrowRight } from "lucide-react";

export default function CardDetailModal({
  cardId,
  onClose,
}: {
  cardId: string;
  onClose: () => void;
}) {
  const card = useStore((s) => s.cards.find((c) => c.id === cardId));
  const cards = useStore((s) => s.cards);
  const updateCard = useStore((s) => s.updateCard);
  const setViewMode = useStore((s) => s.setViewMode);
  const setActiveCard = useStore((s) => s.setActiveCard);

  const [title, setTitle] = useState(card?.title ?? "");
  const [sourceContent, setSourceContent] = useState(card?.sourceContent ?? "");
  const [curationReason, setCurationReason] = useState(card?.curationReason ?? "");
  const [intendedUse, setIntendedUse] = useState(card?.intendedUse ?? "");

  useEffect(() => {
    if (!card) return;
    setTitle(card.title);
    setSourceContent(card.sourceContent);
    setCurationReason(card.curationReason);
    setIntendedUse(card.intendedUse);
  }, [card?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card) return null;

  const save = () => updateCard(card.id, { title, sourceContent, curationReason, intendedUse });

  const viewInGraph = () => {
    setActiveCard(card.id);
    setViewMode("graph");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-hairline bg-surface shadow-pin animate-pop-in"
      >
        <div className="flex items-start justify-between gap-3 border-b border-hairline px-6 py-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={save}
            className="flex-1 bg-transparent font-display italic text-xl text-ink focus:outline-none"
          />
          <button onClick={onClose} className="text-ink-faint hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
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
                      className="text-sm text-ink-muted rounded-lg border border-hairline bg-raised px-3 py-2"
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
            onClick={viewInGraph}
            className="self-start flex items-center gap-1.5 text-sm text-signal hover:text-ink transition-colors font-ui"
          >
            在知识图谱中查看 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
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
