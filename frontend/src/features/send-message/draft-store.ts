"use client";

import { create } from "zustand";

interface DraftState {
  /** Rascunho por conversa — preserva o texto ao alternar entre conversas. */
  drafts: Record<string, string>;
  setDraft: (conversationId: string, text: string) => void;
  clearDraft: (conversationId: string) => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  drafts: {},
  setDraft: (conversationId, text) =>
    set((state) => ({ drafts: { ...state.drafts, [conversationId]: text } })),
  clearDraft: (conversationId) =>
    set((state) => {
      const { [conversationId]: _removed, ...rest } = state.drafts;
      return { drafts: rest };
    }),
}));

/** Seletor do rascunho de uma conversa (string vazia por padrão). */
export function useDraft(conversationId: string): string {
  return useDraftStore((state) => state.drafts[conversationId] ?? "");
}
