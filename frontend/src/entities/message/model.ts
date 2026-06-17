import { useQuery } from "@tanstack/react-query";

import { fetchMessages } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import { MESSAGES_POLL_MS } from "@/shared/config/constants";
import type { Message } from "@/shared/api/types";

export type { Message };

/**
 * Mensagem como exibida na UI. Estende o DTO com flags de otimismo para o envio:
 * `pending` (aguardando confirmação do servidor) e `failed` (falhou, permite reenvio).
 */
export interface ChatMessage extends Message {
  pending?: boolean;
  failed?: boolean;
}

/** Prefixo dos IDs temporários criados durante o update otimista. */
export const OPTIMISTIC_ID_PREFIX = "optimistic-";

/**
 * Histórico de mensagens da conversa aberta. Polling leve só quando há `conversationId`.
 */
export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId ?? "none"),
    queryFn: () => fetchMessages(conversationId as string),
    enabled: Boolean(conversationId),
    refetchInterval: MESSAGES_POLL_MS,
  });
}
