"use client";

import { create } from "zustand";

import type { Conversation } from "@/entities/conversation/model";

interface SearchState {
  term: string;
  setTerm: (term: string) => void;
  clear: () => void;
}

/** Termo de busca da lista de conversas (estado de UI, fora do server state). */
export const useSearchStore = create<SearchState>((set) => ({
  term: "",
  setTerm: (term) => set({ term }),
  clear: () => set({ term: "" }),
}));

/** Marcas diacríticas combinantes (U+0300–U+036F) para busca sem acentos. */
const DIACRITICS = /[̀-ͯ]/g;

/** Normaliza texto: minúsculo e sem acentos, para busca tolerante. */
function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

/** Filtro puro e reutilizável por nome, telefone ou conteúdo da última mensagem. */
export function filterConversations(
  conversations: Conversation[],
  term: string,
): Conversation[] {
  const query = normalize(term.trim());
  if (!query) return conversations;

  return conversations.filter((conversation) => {
    const haystack = normalize(
      `${conversation.contactName} ${conversation.contactPhone} ${conversation.lastMessage}`,
    );
    return haystack.includes(query);
  });
}
