import { useQuery } from "@tanstack/react-query";

import { fetchConversations } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import { CONVERSATIONS_POLL_MS } from "@/shared/config/constants";
import type { Conversation } from "@/shared/api/types";

export type { Conversation };

/**
 * Lista de conversas com polling — mantém não-lidas, última mensagem e ordenação
 * atualizadas sem intervenção do usuário (estratégia de "live updates" do desafio).
 */
export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: fetchConversations,
    refetchInterval: CONVERSATIONS_POLL_MS,
  });
}

/** Busca uma conversa específica no cache da lista (evita request extra). */
export function selectConversationById(
  conversations: Conversation[] | undefined,
  id: string,
): Conversation | undefined {
  return conversations?.find((conversation) => conversation.id === id);
}
