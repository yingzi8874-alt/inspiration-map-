"use client";

import { useState, FormEvent } from "react";
import { useStore } from "@/lib/store";
import { Plus, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export default function QuickAdd() {
  const addCard = useStore((s) => s.addCard);
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [sourceContent, setSourceContent] = useState("");
  const [curationReason, setCurationReason] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const reset = () => {
    setTitle("");
    setSourceContent("");
    setCurationReason("");
    setIntendedUse("");
    setTagsInput("");
    setExpanded(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addCard({
      title,
      sourceContent,
      curationReason,
      intendedUse,
      tags: tagsInput
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
    });
    reset();
  };

  return (
    <form
      onSubmit={submit}
      className="mb-8 rounded-2xl border border-hairline bg-surface shadow-pin"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <Sparkles size={16} className="text-signal shrink-0" strokeWidth={2} />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="记下一个刚冒出来的念头……"
          className="flex-1 bg-transparent font-display italic text-[16px] text-ink placeholder:text-ink-faint placeholder:not-italic focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-ink-muted hover:text-ink transition-colors p-1 shrink-0"
          aria-label="展开详情"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center gap-1 rounded-full bg-signal px-3.5 py-1.5 text-sm font-ui font-medium text-void disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shrink-0"
        >
          <Plus size={14} strokeWidth={2.5} />
          收集
        </button>
      </div>

      {expanded && (
        <div className="border-t border-hairline px-4 py-4 grid gap-3 sm:grid-cols-2 animate-pop-in">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs text-ink-faint font-ui">原始素材</span>
            <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              rows={2}
              placeholder="摘录、链接、截图描述……"
              className="resize-none rounded-lg bg-raised border border-hairline px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-signal/60"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-faint font-ui">收集理由</span>
            <textarea
              value={curationReason}
              onChange={(e) => setCurationReason(e.target.value)}
              rows={2}
              placeholder="为什么值得留下？"
              className="resize-none rounded-lg bg-raised border border-hairline px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-signal/60"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-faint font-ui">打算怎么用</span>
            <textarea
              value={intendedUse}
              onChange={(e) => setIntendedUse(e.target.value)}
              rows={2}
              placeholder="未来会用在哪里？"
              className="resize-none rounded-lg bg-raised border border-hairline px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-signal/60"
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs text-ink-faint font-ui">标签（用逗号分隔）</span>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="设计, 灵感, 待整理"
              className="rounded-lg bg-raised border border-hairline px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-signal/60"
            />
          </label>
        </div>
      )}
    </form>
  );
}
