"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { InspirationCard, ViewMode } from "./types";
import { seedCards } from "./seed";

interface AIExpandResult {
  title: string;
  sourceContent: string;
  curationReason: string;
  intendedUse: string;
  tags: string[];
  relation: string;
}

interface AIConnectResult {
  description: string;
}

interface StoreState {
  cards: InspirationCard[];
  viewMode: ViewMode;
  activeCardId: string | null;
  rootFinderActive: boolean;
  rootFinderFirstId: string | null;
  pendingAIParentId: string | null; // shows a loading state on a node
  pendingRootPair: [string, string] | null;
  lastError: string | null;

  setViewMode: (mode: ViewMode) => void;
  setActiveCard: (id: string | null) => void;

  addCard: (input: {
    title: string;
    sourceContent?: string;
    curationReason?: string;
    intendedUse?: string;
    tags?: string[];
    position?: { x: number; y: number };
  }) => string;
  updateCard: (id: string, patch: Partial<InspirationCard>) => void;
  deleteCard: (id: string) => void;
  updateCardPosition: (id: string, position: { x: number; y: number }) => void;

  addManualConnection: (fromId: string, toId: string, description: string, aiGenerated?: boolean) => void;
  removeConnection: (fromId: string, toId: string) => void;

  toggleRootFinder: () => void;
  pickRootFinderNode: (id: string) => Promise<void>;

  expandWithAI: (cardId: string) => Promise<void>;
}

function nextPositionNear(pos: { x: number; y: number }, index: number, total: number) {
  const radius = 240;
  const spread = Math.PI * 0.8;
  const startAngle = -spread / 2 - Math.PI / 2;
  const angle = startAngle + (spread / Math.max(total - 1, 1)) * index;
  return {
    x: pos.x + Math.cos(angle) * radius,
    y: pos.y + Math.sin(angle) * radius,
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cards: seedCards,
      viewMode: "feed",
      activeCardId: null,
      rootFinderActive: false,
      rootFinderFirstId: null,
      pendingAIParentId: null,
      pendingRootPair: null,
      lastError: null,

      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveCard: (id) => set({ activeCardId: id }),

      addCard: (input) => {
        const id = nanoid(8);
        const card: InspirationCard = {
          id,
          title: input.title.trim() || "未命名灵感",
          sourceContent: input.sourceContent ?? "",
          curationReason: input.curationReason ?? "",
          intendedUse: input.intendedUse ?? "",
          tags: input.tags ?? [],
          connections: [],
          position: input.position ?? {
            x: Math.random() * 400 - 200,
            y: Math.random() * 300 - 150,
          },
          createdAt: Date.now(),
        };
        set((s) => ({ cards: [card, ...s.cards] }));
        return id;
      },

      updateCard: (id, patch) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      deleteCard: (id) =>
        set((s) => ({
          cards: s.cards
            .filter((c) => c.id !== id)
            .map((c) => ({
              ...c,
              connections: c.connections.filter((conn) => conn.targetId !== id),
            })),
          activeCardId: s.activeCardId === id ? null : s.activeCardId,
        })),

      updateCardPosition: (id, position) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, position } : c)),
        })),

      addManualConnection: (fromId, toId, description, aiGenerated) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === fromId
              ? {
                  ...c,
                  connections: [
                    ...c.connections.filter((conn) => conn.targetId !== toId),
                    { targetId: toId, description, aiGenerated },
                  ],
                }
              : c
          ),
        })),

      removeConnection: (fromId, toId) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === fromId
              ? { ...c, connections: c.connections.filter((conn) => conn.targetId !== toId) }
              : c
          ),
        })),

      toggleRootFinder: () =>
        set((s) => ({
          rootFinderActive: !s.rootFinderActive,
          rootFinderFirstId: null,
        })),

      pickRootFinderNode: async (id) => {
        const { rootFinderFirstId, cards } = get();
        if (!rootFinderFirstId) {
          set({ rootFinderFirstId: id });
          return;
        }
        if (rootFinderFirstId === id) {
          set({ rootFinderFirstId: null });
          return;
        }
        const a = cards.find((c) => c.id === rootFinderFirstId);
        const b = cards.find((c) => c.id === id);
        if (!a || !b) {
          set({ rootFinderFirstId: null });
          return;
        }
        set({ pendingRootPair: [a.id, b.id], rootFinderFirstId: null });
        try {
          const res = await fetch("/api/ai/connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cardA: { title: a.title, sourceContent: a.sourceContent, curationReason: a.curationReason, tags: a.tags },
              cardB: { title: b.title, sourceContent: b.sourceContent, curationReason: b.curationReason, tags: b.tags },
            }),
          });
          const data: AIConnectResult = await res.json();
          get().addManualConnection(a.id, b.id, data.description, true);
        } catch (e) {
          set({ lastError: "智能寻根失败，请重试" });
        } finally {
          set({ pendingRootPair: null, rootFinderActive: false });
        }
      },

      expandWithAI: async (cardId) => {
        const parent = get().cards.find((c) => c.id === cardId);
        if (!parent) return;
        set({ pendingAIParentId: cardId });
        try {
          const res = await fetch("/api/ai/expand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: parent.title,
              sourceContent: parent.sourceContent,
              curationReason: parent.curationReason,
              intendedUse: parent.intendedUse,
              tags: parent.tags,
            }),
          });
          const data: { branches: AIExpandResult[] } = await res.json();
          const branches = data.branches ?? [];
          const newIds: string[] = [];
          branches.forEach((branch, i) => {
            const id = nanoid(8);
            newIds.push(id);
            const position = nextPositionNear(parent.position, i, branches.length);
            const card: InspirationCard = {
              id,
              title: branch.title,
              sourceContent: branch.sourceContent,
              curationReason: branch.curationReason,
              intendedUse: branch.intendedUse,
              tags: branch.tags,
              connections: [],
              position,
              createdAt: Date.now(),
              isAIGenerated: true,
            };
            set((s) => ({ cards: [...s.cards, card] }));
            set((s) => ({
              cards: s.cards.map((c) =>
                c.id === parent.id
                  ? {
                      ...c,
                      connections: [
                        ...c.connections,
                        { targetId: id, description: branch.relation, aiGenerated: true },
                      ],
                    }
                  : c
              ),
            }));
          });
        } catch (e) {
          set({ lastError: "AI 拓展失败，请重试" });
        } finally {
          set({ pendingAIParentId: null });
        }
      },
    }),
    {
      name: "inspiration-map-storage",
      partialize: (s) => ({ cards: s.cards, viewMode: s.viewMode }),
    }
  )
);
