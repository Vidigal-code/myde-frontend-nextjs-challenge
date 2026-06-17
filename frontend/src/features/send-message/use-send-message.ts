"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import { toErrorMessage } from "@/shared/api/http-error";
import type { Conversation } from "@/entities/conversation/model";
import { type ChatMessage, OPTIMISTIC_ID_PREFIX } from "@/entities/message/model";

interface MutationContext {
  previousMessages?: ChatMessage[];
  previousConversations?: Conversation[];
  optimisticId: string;
}

/** Cria a mensagem temporária exibida imediatamente (antes da confirmação do servidor). */
function buildOptimisticMessage(text: string): ChatMessage {
  return {
    id: `${OPTIMISTIC_ID_PREFIX}${Date.now()}`,
    direction: "out",
    body: text,
    status: "sent",
    createdAt: new Date().toISOString(),
    pending: true,
  };
}

/** Atualiza a prévia da conversa na lista e reordena por mais recente. */
function applyConversationPreview(
  conversations: Conversation[] | undefined,
  conversationId: string,
  text: string,
  at: string,
): Conversation[] | undefined {
  if (!conversations) return conversations;
  return conversations
    .map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, lastMessage: text, lastMessageAt: at, unread: 0 }
        : conversation,
    )
    .sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1));
}

/**
 * Envio de mensagem com **update otimista**: a bolha aparece na hora (status "enviando"),
 * com rollback em caso de erro e reconciliação com a resposta real do servidor.
 */
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const messagesKey = queryKeys.messages(conversationId);

  return useMutation<ChatMessage, unknown, string, MutationContext>({
    mutationFn: (text) => postMessage(conversationId, text),

    onMutate: async (text) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: messagesKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.conversations }),
      ]);

      const previousMessages = queryClient.getQueryData<ChatMessage[]>(messagesKey);
      const previousConversations = queryClient.getQueryData<Conversation[]>(queryKeys.conversations);
      const optimistic = buildOptimisticMessage(text);

      queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) => [...old, optimistic]);
      queryClient.setQueryData<Conversation[]>(queryKeys.conversations, (old) =>
        applyConversationPreview(old, conversationId, text, optimistic.createdAt),
      );

      return { previousMessages, previousConversations, optimisticId: optimistic.id };
    },

    onSuccess: (serverMessage, _text, context) => {
      // Substitui a mensagem temporária pela versão confirmada do servidor.
      queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) =>
        old.map((message) => (message.id === context?.optimisticId ? serverMessage : message)),
      );
    },

    onError: (_error, _text, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(messagesKey, context.previousMessages);
      }
      if (context?.previousConversations) {
        queryClient.setQueryData(queryKeys.conversations, context.previousConversations);
      }
    },

    onSettled: () => {
      // Garante consistência eventual com o servidor (status real, ordenação).
      queryClient.invalidateQueries({ queryKey: messagesKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export { toErrorMessage };
